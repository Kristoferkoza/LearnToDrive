import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import jwtConfig from '../../config/jwt.config';
import { HashingService } from '../../hashing/hashing.service';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { LoginDto } from '../dto/login.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { RefreshTokenIdsService } from './refresh-token-ids.service';

@Injectable()
export class AuthenticationService {

  logger = new Logger(AuthenticationService.name, { timestamp: true });

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokensService: RefreshTokenIdsService,
    private readonly configService: ConfigService,
  ) { }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.createQueryBuilder('user')
      .select(['user.id', 'user.login', 'user.password', 'user.active', 'roles', 'permissions'])
      .leftJoin('user.roles', 'roles')
      .leftJoin('roles.permissions', 'permissions')
      .where('user.login = :login', { login: loginDto.login })
      .andWhere('user.active = :active', { active: true })
      .getOne();

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.password) {
      throw new UnauthorizedException();
    }

    if (!this.isAdmin(user)) {
      throw new UnauthorizedException();
    }

    const isEqual = await this.hashingService.compare(
      loginDto.password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException();
    }

    const activeUser: ActiveUserData = this.extractUserToActiveUserData(user);
    const { accessToken, refreshToken } = await this.generateAccessAndRefreshTokens(activeUser);

    return {
      user: {
        ...activeUser,
      },
      accessToken,
      refreshToken,
    }
  }

  private extractUserToActiveUserData(user: User) {
    const permissions = user.roles.map(
      role => role.permissions.map(permission => permission.name)
    );

    const uniquePermissions = [...new Set(permissions.flat())];

    const activeUser: ActiveUserData = {
      id: user.id,
      login: user.login,
      roles: user.roles.map(role => role.name),
      permissions: uniquePermissions,
    };

    return activeUser;
  }

  async generateAccessAndRefreshTokens(user: ActiveUserData) {
    const refreshTokenExpiresAt = new Date(Date.now() + this.jwtConfiguration.refreshTokenTtl * 1000);

    const { tokenId: refreshTokenId } = await this.refreshTokensService.create(user.id, refreshTokenExpiresAt);

    const { id } = user;

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(
        this.jwtConfiguration.accessTokenTtl,
        {
          ...user,
        },
      ),
      this.signToken(
        this.jwtConfiguration.refreshTokenTtl,
        {
          id,
          refreshTokenId,
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(activeUserData: ActiveUserData) {
    try {
      const { id, refreshTokenId } = activeUserData;

      const user = await this.usersRepository.createQueryBuilder('user')
        .select(['user.id', 'user.login', 'user.password', 'user.active', 'roles', 'permissions'])
        .leftJoin('user.roles', 'roles')
        .leftJoin('roles.permissions', 'permissions')
        .where('user.id = :id', { id })
        .andWhere('user.active = :active', { active: true })
        .getOne();

      if (!user) {
        throw new UnauthorizedException();
      }

      const activeUser: ActiveUserData = this.extractUserToActiveUserData(user);

      const isValid = await this.refreshTokensService.validate(
        user.id,
        refreshTokenId,
      );

      if (isValid) {
        await this.refreshTokensService.delete(user.id);
      } else {
        throw new Error('Refresh token is invalid');
      }

      const { accessToken, refreshToken } = await this.generateAccessAndRefreshTokens(activeUser);

      return {
        user: {
          ...activeUser,
        },
        accessToken,
        refreshToken,
      }
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  private async signToken(expiresIn: number, payload?: any) {
    const token = await this.jwtService.signAsync(
      payload,
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
    return {
      token,
      expires: new Date(Date.now() + expiresIn * 1000),
    }
  }

  private isAdmin(user: User) {
    return user.roles.some(role => role.name === 'admin');
  }
}
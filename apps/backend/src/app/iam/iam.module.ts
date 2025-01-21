import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/services/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { RefreshTokenGuard } from './authentication/guards/refresh-token.guard';
import { RefreshTokenId } from './authentication/entities/refresh-token-id.entity';
import { RefreshTokenIdsService } from './authentication/services/refresh-token-ids.service';
import { PermissionGuard } from './authentication/guards/permission.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshTokenId]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    RefreshTokenGuard,
    PermissionGuard,
    AuthenticationService,
    RefreshTokenIdsService,
  ],
  controllers: [AuthenticationController],
  exports: [HashingService]

})
export class IamModule {}

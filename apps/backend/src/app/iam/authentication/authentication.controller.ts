import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Response } from 'express';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { ActiveUser } from '../decorators/active-user.decorator';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { ConfigService } from '@nestjs/config';
import { Permission } from './decorators/permission.decorator';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly configService: ConfigService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Auth(AuthType.None)
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() loginDto: LoginDto
  ) {
    const { accessToken, refreshToken, user } = await this.authService.login(loginDto);
    response.cookie('access_token', accessToken.token, {
      secure: this.configService.get('COOKIES_SECURE') === 'true' ? true : false,
      httpOnly: true,
      sameSite: true,
      expires: accessToken.expires,
    });
    response.cookie('refresh_token', refreshToken.token, {
      secure: this.configService.get('COOKIES_SECURE') === 'true' ? true : false,
      httpOnly: true,
      sameSite: true,
      path: '/authentication/refresh-tokens',
      expires: refreshToken.expires,
    });

    return {
      user,
      expiresIn: refreshToken.expires
    }
  }

  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.RefreshToken)
  @Post('refresh-tokens')
  async refreshTokens(
    @Res({ passthrough: true }) response: Response,
    @ActiveUser() activeUserData: ActiveUserData,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.refreshTokens(activeUserData);
    response.cookie('access_token', accessToken.token, {
      secure: this.configService.get('COOKIES_SECURE') === 'true' ? true : false,
      httpOnly: true,
      sameSite: true,
      expires: accessToken.expires,
    });
    response.cookie('refresh_token', refreshToken.token, {
      secure: this.configService.get('COOKIES_SECURE') === 'true' ? true : false,
      httpOnly: true,
      sameSite: true,
      path: '/authentication/refresh-tokens',
      expires: refreshToken.expires,
    });

    return {
      user,
      expiresIn: refreshToken.expires,
    }
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  async logout(
    @Res({ passthrough: true }) response: Response,
  ) {
    response.cookie('access_token', null, {
      secure: this.configService.get('COOKIES_SECURE') === 'true' ? true : false,
      httpOnly: true,
      sameSite: true,
      maxAge: 0,
    });
    response.cookie('refresh_token', null, {
      secure: this.configService.get('COOKIES_SECURE') === 'true' ? true : false,
      httpOnly: true,
      sameSite: true,
      path: '/authentication/refresh-tokens',
      maxAge: 0,
    });
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';
import { AccessTokenGuard } from './access-token.guard';
import { RefreshTokenGuard } from './refresh-token.guard';
import { PermissionGuard } from './permission.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthTypes = [AuthType.AccessToken, AuthType.PermissionGuard];
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.AccessToken]: this.accessTokenGuard,
    [AuthType.RefreshToken]: this.refreshTokenGuard,
    [AuthType.PermissionGuard]: this.permissionGuard,
    [AuthType.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly refreshTokenGuard: RefreshTokenGuard,
    private readonly permissionGuard: PermissionGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? AuthenticationGuard.defaultAuthTypes;

    
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    let error = new UnauthorizedException();

    const canActivates = [];

    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        error = err;
      });
      canActivates.push(canActivate);
    }

    if (canActivates.every((value) => value)) {
      return true;
    }

    throw error;
  }
}
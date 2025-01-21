import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../../users/entities/user.entity';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permission = this.reflector.get<string[]>('permission', context.getHandler());
    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as ActiveUserData;

    if (!user) {
      return false;
    }

    const hasPermisson = user.permissions.some(p => permission.includes(p));

    if (!hasPermisson) {
      return false;
    }      

    return true;
  }
}
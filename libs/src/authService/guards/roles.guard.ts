import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../usersService/entities/user.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  //Rules custom decorater's roles
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [
        context.getHandler(), 
        context.getClass()
      ],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}

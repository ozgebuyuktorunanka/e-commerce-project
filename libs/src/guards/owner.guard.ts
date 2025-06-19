import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RequestWithUser } from "../interfaces/requestWithUser";
import { UserRole } from "../usersService/entities/user.enum";
import { ROLES_KEY } from "../authService/decorator/roles.decorator";

@Injectable()
export class OwnerOrRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User is not authenticated.');
    }

    const paramId = request.params.id;
    if (!paramId) {
      throw new ForbiddenException('Resource ID is required.');
    }

    const allowedRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Check if user has an allowed role
    const isRoleAllowed = allowedRoles?.includes(user.role as UserRole);

    // Check if user is the owner of the resource
    const isOwner = String(user.id) === String(paramId);

    if (isOwner || isRoleAllowed) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to perform this operation. You must either be the owner of the resource or have the required role.'
    );
  }
}
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRole } from 'users/entities/user.entity';


@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; //incoming user informations
    return user && ( user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN); 
  }
}

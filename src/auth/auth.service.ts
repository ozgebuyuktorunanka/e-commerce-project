import { Injectable } from '@nestjs/common';
import { User, UserRole } from 'users/entities/user.entity';
import { UsersService } from 'users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = this.usersService.findByEmail(email);
      if (user && user.password === password) {
        const { password, ...result } = user;
        return result as User;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  isAdmin(user: User): boolean {
    return user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
  }
  isSuperAdmin(user: User): boolean {
    return user.role === UserRole.SUPER_ADMIN;
  }
}

import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() Auth: Auth): Promise<Auth> {
    
    const passwordHash = await this.hashPassword(Auth.passwordHash); 
    return this.authService.createAuth(Auth.username, passwordHash);
  }

  @Get(':username')
  async findOne(@Param('username') username: string): Promise<Auth> {
    const auth = await this.authService.findOneByUsername(username);
    if (!auth) {
      throw new NotFoundException(`Auth with username "${username}" not found`);
    }
    return auth;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}

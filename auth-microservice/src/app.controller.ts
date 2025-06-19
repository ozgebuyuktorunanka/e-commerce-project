import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './app.service';
import { LoginDto } from 'dto/login.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RequestWithUser } from '@common/interfaces/requestWithUser';
import { Auth } from 'entities/auth.entity';
import { UserResponseDto } from '@common/usersService/dto/userResponse.dto';
import { MessagePattern } from '@nestjs/microservices';
import { AUTH_PATTERN } from '@common/auth/auth-pattern';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERN.login)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid User Data.');
    }
    return this.authService.login(loginDto);
  }

  @MessagePattern(AUTH_PATTERN.generateJwt)
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Req() req: RequestWithUser) {
    const user = req.user as Partial<UserResponseDto>;
    return this.authService.generateJwtToken(user);
  }

  @MessagePattern(AUTH_PATTERN.createAuth)
  @Post('register')
  async register(@Body() Auth: Auth): Promise<Auth> {
    const passwordHash = await this.hashPassword(Auth.passwordHash);
    return this.authService.createAuth(Auth.username, passwordHash);
  }

  @MessagePattern(AUTH_PATTERN.findOne)
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

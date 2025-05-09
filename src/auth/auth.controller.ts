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
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { RequestWithUser } from 'common/interfaces/requestWithUser';
import { UserResponseDto } from 'users/dto/userResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
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

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Req() req: RequestWithUser) {
    const user = req.user as Partial<UserResponseDto>;
    return this.authService.generateJwtToken(user);
  }

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

import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UseFilters,
  Inject,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { Auth } from '../../../auth-microservice/entities/auth.entity';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { TransformResponseInterceptor } from '@common/interceptors/transform-response.interceptor';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RequestWithUser } from '@common/interfaces/requestWithUser';
import * as bcrypt from 'bcrypt';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AUTH_SERVICE } from '../../../libs/src/constants/index';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(TransformResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login process is started with required login credentials.',
  })
  @ApiResponse({
    status: 201,
    description: 'Login process is completed succesfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid User Login Data',
  })
  login(@Body() loginDto: LoginDto) {
    this.authService.login(loginDto);
  }

  @ApiOperation({
    summary: 'Login validation process with login credentials..',
  })
  @ApiResponse({
    status: 201,
    description: 'Login validation process is completed succesfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid User Login Data',
  })
  @Post('validate')
  validate(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    this.authService.validateUser(email, password, loginDto);
  }

  @ApiOperation({
    summary: 'refresh token process is started.',
  })
  @ApiResponse({
    status: 201,
    description: 'Generate JWT token process is completed succesfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Generation JWT Token is failed.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  refreshToken(@Req() req: RequestWithUser) {
    this.authService.refreshToken(req);
  }

  @ApiOperation({ summary: 'A user registeration process with hashPassword' })
  @ApiResponse({
    status: 201,
    description: 'Auth creation process is completed succesfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Auth creation process is failed.',
  })
  @Post('register')
  async register(@Body() auth: Auth) {
    const passwordHashed = await this.hashPassword(auth.passwordHash);
    return this.authService.createAuth(auth, passwordHashed);
  }

  @ApiOperation({ summary: 'Find one user Auth Search' })
  @ApiResponse({
    status: 201,
    description:
      'One user\s authorization search process is completed succesfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'One user\s authorization search process is failed.',
  })
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.authService.findOne(username);
  }

  //PRivate hash function
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}

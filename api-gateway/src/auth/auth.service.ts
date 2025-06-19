import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { firstValueFrom } from 'rxjs';
import { AUTH_SERVICE } from '../../../libs/src/constants/index';
import { RequestWithUser } from '@common/interfaces/requestWithUser';
import { UserResponseDto } from '@common/usersService/dto/userResponse.dto';
import { AUTH_PATTERN } from '@common/auth/auth-pattern';
import { Auth } from '../../../auth-microservice/entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  async login(loginDto: LoginDto) {
    //Observable Promise Convert Process. and we will wait to response/result to us.
    await firstValueFrom(
      this.authClient.send({ cmd: AUTH_PATTERN.login }, loginDto),
    );
    const user = await firstValueFrom(
      this.authClient.send({ cmd: AUTH_PATTERN.validateUser }, loginDto),
    );
    return user;
  }

  validateUser(email: string, password: string, loginDto: LoginDto) {
    return this.authClient.send(
      { cmd: AUTH_PATTERN.validateUser },
      { email, password, loginDto },
    );
  }

  refreshToken(req: RequestWithUser) {
    const user = req.user as Partial<UserResponseDto>;
    return this.authClient.send({ cmd: AUTH_PATTERN.generateJwt }, { user });
  }

  createAuth(auth: Auth, passwordHashed: string) {
    return this.authClient.send(
      { cmd: AUTH_PATTERN.createAuth },
      { auth, passwordHashed },
    );
  }

  findOne(username: string) {
    return this.authClient.send({ cmd: AUTH_PATTERN.findOne }, { username });
  }
}

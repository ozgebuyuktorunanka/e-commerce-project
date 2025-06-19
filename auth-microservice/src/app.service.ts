import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Auth } from 'entities/auth.entity';
import { UsersService } from '../../users-microservice/src/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'dto/login.dto';
import { JwtPayload } from '@common/authService/utils/types';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async findOneByUsername(username: string): Promise<Auth | null> {
    return this.authRepository.findOne({ where: { username } });
  }

  async createAuth(username: string, passwordHash: string): Promise<Auth> {
    const auth = new Auth();
    auth.username = username;
    auth.passwordHash = passwordHash;

    return this.authRepository.save(auth);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findOneByUsername(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (isPasswordValid) {
      const { passwordHash, ...result } = user;
      return result;
    } else {
      return null;
    }
  }

  async generateJwtToken(user: any) {
    const payload = {
      username: user.username,
      sub: user.userId,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginDto) {
    const { email , password} = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid email or password. Please control again.');
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}

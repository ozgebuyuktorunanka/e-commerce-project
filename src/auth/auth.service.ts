import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) 
    private authRepository: Repository<Auth>, // Inject Auth repository
  ) {}

  async findOneByUsername(username: string): Promise<Auth | null> {
    return this.authRepository.findOne({ where: { username } });
  }

  async createAuth(username: string, passwordHash: string): Promise<Auth> {
    const auth = new Auth();
    auth.username = username;
    auth.passwordHash = passwordHash;

    return this.authRepository.save(auth); // we saved the entity
  }


  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.findOneByUsername(username);

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
}
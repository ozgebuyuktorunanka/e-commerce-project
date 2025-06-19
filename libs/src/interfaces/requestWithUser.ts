import { Request } from 'express';
import { UserResponseDto } from '../usersService/dto/userResponse.dto';

export interface RequestWithUser extends Request {
    user: UserResponseDto;
  }
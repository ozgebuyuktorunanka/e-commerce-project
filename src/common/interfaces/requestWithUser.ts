import { Request } from 'express';
import { UserResponseDto } from 'users/dto/userResponse.dto';


export interface RequestWithUser extends Request {
    user: UserResponseDto;
  }
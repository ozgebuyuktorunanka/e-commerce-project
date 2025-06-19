import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { USER_PATTERN } from '@common/usersService/pattern/user-pattern';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto';
import { USER_SERVICE } from  '../../../libs/src/constants/index';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_SERVICE) 
    private readonly userClient: ClientProxy,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userClient.send(USER_PATTERN.create, { createUserDto });
  }

  findAll(paginationQuery: PaginationQueryDto) {
    return this.userClient.send(USER_PATTERN.findAll, { paginationQuery });
  }

  findOne(id: number) {
    return this.userClient.send(USER_PATTERN.findOne, { id });
  }

  findMe(id:number){
    return this.userClient.send({ cmd: USER_PATTERN.findOne }, { id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userClient.send(USER_PATTERN.update, { id, updateUserDto });
  }

  remove(id: number) {
    return this.userClient.send(USER_PATTERN.remove, { id });
  }
}

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_PATTERN} from '../../common/usersService/pattern/user-pattern'
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USER_PATTERN.create)
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern(USER_PATTERN.findAll)
  findAll(@Payload() paginationQuery: PaginationQueryDto) {
    return this.usersService.findAll(paginationQuery);
  }

  @MessagePattern(USER_PATTERN.findOne)
  findOne(@Payload() id: number) {
    return this.usersService.findOne(id);
  }

  @MessagePattern(USER_PATTERN.update)
  update(@Payload() updateUserDto: UpdateUserDto) {
    const { id } = updateUserDto;
    if (id === undefined) {
      throw new Error("ID is required for updating a user.");
  }
    return this.usersService.update(id as number, updateUserDto);
  }

  @MessagePattern(USER_PATTERN.remove)
  remove(@Payload() id: number) {
    return this.usersService.deleteUser(id);
  }
}

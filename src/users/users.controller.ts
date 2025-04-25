import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CapitalizeNamePipe } from 'common/pipes/capitalize-name.pipe';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';
import { SuperAdminGuard } from 'common/guards/super-admin.guard';
import { TransformResponseInterceptor } from 'common/interceptors/transform-response.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@Controller('users')
//@UseInterceptors(TransformResponseInterceptor)
//@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Body('name', CapitalizeNamePipe) name: string,
    @Body('email', CapitalizeNamePipe) email: string,
  ): User {
    const modifiedTo = {
      ...createUserDto,
      name,
      email,
    };
    return this.usersService.create(modifiedTo);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto): User[] {
    return this.usersService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): User {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(SuperAdminGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Body('name', CapitalizeNamePipe) name: string,
    @Body('email', CapitalizeNamePipe) email: string
  ): User {
        const modifiedDto = {
            ...updateUserDto,
            name: name !== undefined ? name : updateUserDto.name,
            email: email !== undefined? email: updateUserDto.email,
        };
        return this.usersService.update(id, modifiedDto);
  }

  @Delete(':id')
  @UseGuards(SuperAdminGuard)
  remove(
    @Param('id', ParseIntPipe) id:number
  ): void {
    return this.usersService.remove(id);
  }
}

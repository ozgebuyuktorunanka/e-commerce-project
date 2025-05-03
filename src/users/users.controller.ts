import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CapitalizeNamePipe } from 'common/pipes/capitalize-name.pipe';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';
import { SuperAdminGuard } from 'common/guards/super-admin.guard';
import { TransformResponseInterceptor } from 'common/interceptors/transform-response.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
@UseInterceptors(TransformResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'New user is created.' })
  @ApiResponse({
    status: 201,
    description: 'New user is created succesfully.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid Data.' })
  async create(
    @Body(CapitalizeNamePipe) createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all users.' })
  @ApiResponse({
    status: 200,
    description: 'All users is listed succesfully.',
    type: [User],
  })
  async findAll(@Query() paginationQuery: PaginationQueryDto): Promise<User[]> {
    return this.usersService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a user with ID.' })
  @ApiResponse({
    status: 200,
    description: 'User is found succesfully.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'The user is not found with id.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const user = this.usersService.findOne(id);

    if (!user) {
      throw new HttpException(
        `ID: ${id} - this user is not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    console.log(`Username:${user} - this user is found succesfully.`);
  }

  @Put(':id')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Update the user information with using ID.' })
  @ApiResponse({
    status: 200,
    description: 'User is updated succesfully.',
    type: User,
  })
  @ApiResponse({ status: 403, description: 'Authorization error is occured.' })
  @ApiResponse({ status: 400, description: 'The user is not found with id.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.usersService.update(id, updateUserDto);

    //Control and check if There is or not a user to update.
    if (!updatedUser) {
      throw new HttpException(
        `ID: ${id} -This user is not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    console.log(`ID: ${id} -This user is succesfully updated.`);
    return updatedUser;
  }

  @Delete(':id')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Delete the user with using ID.' })
  @ApiResponse({ status: 200, description: 'User is deleted succesfully.' })
  @ApiResponse({ status: 403, description: 'Authorization error is occured.' })
  @ApiResponse({ status: 400, description: 'The user is not found with id.' })
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    const user = this.usersService.deleteUser(id);
    //Control and check the user.
    if (!user) {
      throw new HttpException('User is not found.', HttpStatus.BAD_REQUEST);
    }
    console.log(`User:${user} is deleted succesfully.`);

    return { message: `ID: ${id} - this user is deleted succesfully.` };
  }
}

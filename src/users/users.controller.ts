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
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CapitalizeNamePipe } from 'common/pipes/capitalize-name.pipe';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';
import { SuperAdminGuard } from 'common/guards/super-admin.guard';
import { TransformResponseInterceptor } from 'common/interceptors/transform-response.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { AdminGuard } from 'common/guards/admin.guard';
import { AuthGuard } from '@nestjs/passport';
import { OwnerOrRolesGuard } from 'common/guards/owner.guard';

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
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List all users.' })
  @ApiResponse({
    status: 200,
    description: 'All users is listed succesfully.',
    type: [User],
  })
  async findAll(@Query() paginationQuery: PaginationQueryDto): Promise<User[]> {
    return this.usersService.findAll(paginationQuery);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user info.' })
  @ApiResponse({ status: 200, description: 'User info fetched successfully.',type: User})
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getMe(@Req() req: Request & { user: { id: number } }): Promise<User> {
    try {
      const userId = req.user.id;
      const user = await this.usersService.findOne(userId);
      
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
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
  @UseGuards(SuperAdminGuard, RolesGuard, OwnerOrRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update the user information with using ID.' })
  @ApiResponse({ status: 200, description: 'User is updated succesfully.', type: User})
  @ApiResponse({ status: 403, description: 'Authorization error is occured.' })
  @ApiResponse({ status: 400, description: 'The user is not found with id.' })
  async update( @Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto,): Promise<User> {
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
  @UseGuards(SuperAdminGuard, JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete the user with using ID.' })
  @ApiResponse({ status: 200, description: 'User is deleted succesfully.' })
  @ApiResponse({ status: 403, description: 'Authorization error is occured.' })
  @ApiResponse({ status: 400, description: 'The user is not found with id.' })
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
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

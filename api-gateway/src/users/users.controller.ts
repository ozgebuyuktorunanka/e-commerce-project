import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  UseInterceptors,
  UseFilters,
  UseGuards,
  Put,
  Req,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { OwnerOrRolesGuard } from '@common/guards/owner.guard';
import { AdminGuard } from '@common/guards/admin.guard';
import { SuperAdminGuard } from '@common/guards/super-admin.guard';
import { AuthGuard } from '@nestjs/passport';
import { ParseIntPipe } from '@common/pipes/parse-int.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransformResponseInterceptor } from '@common/interceptors/transform-response.interceptor';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@common/usersService/entities/user.enum';
import { Roles } from '@common/authService/decorator/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { USER_SERVICE } from  '../../../libs/src/constants/index';
import { UsersService } from './users.service';

@ApiTags('users')
@UseInterceptors(TransformResponseInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('users')
export class UsersController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: UsersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'New user is created.' })
  @ApiResponse({
    status: 201,
    description: 'New user is created succesfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid Data.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List all users.' })
  @ApiResponse({
    status: 200,
    description: 'All users is listed succesfully.',
  })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.userService.findAll(paginationQuery);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user info.' })
  @ApiResponse({
    status: 200,
    description: 'User info fetched successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findMe(@Req() req: any) {
    const userId = req.user?.id;
    return this.userService.findMe(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a user with ID.' })
  @ApiResponse({
    status: 200,
    description: 'User is found succesfully.',
  })
  @ApiResponse({ status: 400, description: 'The user is not found with id.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @UseGuards(SuperAdminGuard, RolesGuard, OwnerOrRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update the user information with using ID.' })
  @ApiResponse({
    status: 200,
    description: 'User is updated succesfully.',
  })
  @ApiResponse({ status: 403, description: 'Authorization error is occured.' })
  @ApiResponse({ status: 400, description: 'The user is not found with id.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(SuperAdminGuard, JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete the user with using ID.' })
  @ApiResponse({ status: 200, description: 'User is deleted succesfully.' })
  @ApiResponse({ status: 403, description: 'Authorization error is occured.' })
  @ApiResponse({ status: 400, description: 'The user is not found with id.' })
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}

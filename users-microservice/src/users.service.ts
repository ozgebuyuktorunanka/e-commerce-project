import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../../common/usersService/schemas/user-schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import logger from '../../common/logger/winston-logger';
import { RpcException } from '@nestjs/microservices/exceptions';

/**
 * The UsersService handles operations related to user management, including:
 * - Creating a new user
 * - Fetching all users with pagination and sorting
 * - Fetching a user by email or id
 * - Updating an existing user's information
 * - Deleting a user by id
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) { }

  /**
   * Creates a new user based on the provided data.
   * @param createUserDto - The data to create a new user.
   * @returns The newly created user object.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Check for existing user
      const existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const newUser = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return this.usersRepository.save(newUser);
    } catch (e) {
      logger.error(`User creation method is failed. Check and control. Error: ${e.message}`);
      throw e;
    }
  }

  /**
   * Fetches all users with pagination and sorting options.
   * @param paginationQuery - Pagination and sorting options.
   * @returns A list of users based on the pagination and sorting criteria.
   */
  async findAll(paginationQuery: PaginationQueryDto): Promise<User[]> {
    try {
      const {
        page = 1,
        limit = 10,
        sort = 'id',
        order = 'asc',
      } = paginationQuery;

      const [users, total] = await this.usersRepository.findAndCount({
        order: {
          [sort]: order === 'asc' ? 'ASC' : 'DESC',
        },
        skip: (page - 1) * limit,
        take: limit,
      });
      return users;
    } catch (e) {
      logger.error(
        `findAll method is failed. Pagination process is failed. Check and control please.Error Message:${e.message}`);
      throw e;
    }
  }

  /**
   * Finds a user by email.
   * @param email - The email of the user to find.
   * @returns The user object matching the provided email.
   * @throws NotFoundException if no user with the given email is found.
   */
  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException(
          `The user with this email address could not be found: ${email}`,
        );
      }
      return user;
    } catch (e) {
      logger.error(
        `Failed to findByEmail method for this user with ID ${email}: ${e.message}`,
        e.stack,
      );
      throw e;
    }
  }

  /**
   * Finds a user by their ID.
   * @param id - The ID of the user to find.
   * @returns The user object matching the provided ID.
   * @throws NotFoundException if no user with the given ID is found.
   */
  async findOne(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        //throw new NotFoundException(`User id(${id}) does not found.`);
        throw new RpcException({
          statusCode: 404,
          message: 'User not found',
        });
      }
      return user;
    } catch (e) {
      logger.error(`Failed to findOne method for this user with ID ${id}: ${e.message}`,e.stack);
      throw new RpcException(e);
    }
  }

  /**
   * Updates an existing user based on the provided data.
   * @param id - The ID of the user to update.
   * @param updateUserDto - The data to update the user.
   * @returns The updated user object.
   * @throws NotFoundException if no user with the given ID is found.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findOne(id);

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      // Update user properties and set updatedAt timestamp
      Object.assign(user, updateUserDto, { updatedAt: new Date() });

      return await this.usersRepository.save(user);
    } catch (e) {
      logger.error(
        `Failed to update user with ID ${id}: ${e.message}`,
        e.stack,
      );
      throw e;
    }
  }

  /**
   * Deletes a user by their ID.
   * @param id - The ID of the user to delete.
   * @returns The deleted user object.
   * @throws NotFoundException if no user with the given ID is found.
   */
  async deleteUser(id: number): Promise<void> {
    try {
      const user = await this.findOne(id);
      user.isActive = false;
      user.deletedAt = new Date();
      await this.usersRepository.save(user);
    } catch (e) {
      logger.error(
        `Failed to delete this user with ID ${id}: ${e.message}`,
        e.stack,
      );
      throw e;
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { dummyUsers } from '../data/dummy-users';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';

//dependency injection
@Injectable()
export class UsersService {
    private users: User[] = [...dummyUsers];

    //CreateUserDto : DTO: Data Transfer Object
    create(createUserDto: CreateUserDto): User {
        const { id, ...rest } = createUserDto;

        const newUser: User = {
            id: this.users.length + 1,
            ...rest,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.users.push(newUser);
        return newUser;
    }

    findAll(paginationQuery: PaginationQueryDto): User[] {
        const { page = 1, limit = 10, sort = 'id', order = 'asc' } = paginationQuery;

        // Sorting process
        const sortedUsers = [...this.users].sort((a, b) => {
            const aValue = a[sort];
            const bValue = b[sort];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return order === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            return order === 'asc'
                ? (aValue as number) - (bValue as number)
                : (bValue as number) - (aValue as number);
        });

        // Pagination işlemi (örneğin: sayfa 2, limit 10 => 10-19 arası)
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        return sortedUsers.slice(startIndex, endIndex);
    }

    findByEmail(email: string): User {
        const user = this.users.find(user => user.email === email);
        if (!user) {
            throw new NotFoundException(`The user with this email address could not be found: ${email}`);
        }
        return user;
    }

    findOne(id: number): User {
        const user = this.users.find(user => user.id === id);
        if (!user) {
            throw new NotFoundException(`User id(${id}) does not found.`);
        }
        return user;
    }

    update(id: number, updateUserDto: UpdateUserDto): User {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            throw new NotFoundException(`User's id(${id}) does not found.`);
        }
        const updatedUser = {
            ...this.users[userIndex],
            ...updateUserDto,
            updatedAt: new Date(),
        };

        this.users[userIndex] = updatedUser;
        return updatedUser;
    }

    remove(id: number): void {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            throw new NotFoundException(`User #${id} does not found.`);
        }
        // this.user is array to keep the user data. userIndex: in array user's index to be deleted. 1: this index is one item will be deleted.
        this.users.splice(userIndex, 1);
    }


}

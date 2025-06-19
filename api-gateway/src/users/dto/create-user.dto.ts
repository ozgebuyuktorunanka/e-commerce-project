import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString, Length, Matches, IsOptional, IsInt } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@common/usersService/entities/user.enum'

export class CreateUserDto {
    @IsNotEmpty()
    @IsInt()
    id: number;

    @ApiProperty({ example: 'John Doe' })
    @IsNotEmpty()
    @IsString()
    name!: string;

    @ApiProperty({ example: 'john@example.com' })
    @IsNotEmpty({ message: 'This field is mandatory.' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email!: string;

    @ApiProperty({ example: 'password123' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
        message: 'The password must contain at least one uppercase letter, one lowercase letter and one number'
    })
    @IsNotEmpty()
    @IsString()
    @Length(6, 20, { message: 'Password must be between 6-20 characters.' })
    @IsStrongPassword()
    readonly password!: string;

    @ApiProperty({ enum: UserRole, default: UserRole.USER })
    @IsEnum(UserRole)
    @IsOptional()
    readonly role: UserRole = UserRole.USER; //Default Role

    @IsNotEmpty()
    @IsString()
    readonly birthdate: string;

    @IsDate()
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

function IsInteger(): (target: CreateUserDto, propertyKey: "id") => void {
    throw new Error("Function not implemented.");
}
function IsStrongPassword(): (target: CreateUserDto, propertyKey: "password") => void {
    throw new Error("Function not implemented.");
}


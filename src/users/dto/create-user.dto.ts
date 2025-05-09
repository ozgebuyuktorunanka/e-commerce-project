import { IsDate, IsEmail, IsEnum, IsInt, IsNotEmpty, IsString, Length, Matches, MinLength, IsOptional } from "class-validator";
import { UserRole } from "../entities/user.entity";
import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from "common/decoraters/is-strong-password.decorator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsInt()
    id: number;

    @ApiProperty({ example: 'John Doe' })
    @IsNotEmpty()
    @IsString()
    @Length(2, 50, { message: 'Last name must be between 2-50 characters.' })
    name: string;

    @ApiProperty({ example: 'john@example.com' })
    @IsNotEmpty({ message: 'This field is mandatory.' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @ApiProperty({ example: 'password123' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
        message: 'The password must contain at least one uppercase letter, one lowercase letter and one number'
    })
    @IsNotEmpty()
    @IsString()
    @Length(6, 20, { message: 'Password must be between 6-20 characters.' })
    @IsStrongPassword()
    readonly password: string;

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

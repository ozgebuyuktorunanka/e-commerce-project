import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { IsStrongPassword } from "common/decoraters/is-strong-password.decorator";


export class RegisterDto{
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?:string;
}
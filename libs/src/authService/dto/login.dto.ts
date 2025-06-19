
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { IsStrongPassword } from "decoraters/is-strong-password.decorater";
export class LoginDto{
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsString()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @IsStrongPassword()
    password: string;
}
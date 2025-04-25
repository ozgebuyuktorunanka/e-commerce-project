import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsEnum(UserRole)
    role: UserRole = UserRole.USER; //Default Role

    @IsNotEmpty()
    @IsString()
    birthdate: string;

    @IsDate()
    createdAt: Date;
    updatedAt: Date;
}

function IsInteger(): (target: CreateUserDto, propertyKey: "id") => void {
    throw new Error("Function not implemented.");
}

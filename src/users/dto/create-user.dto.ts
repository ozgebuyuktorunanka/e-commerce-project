import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Length, Matches, MinLength } from "class-validator";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    @Length(2, 50, { message: 'Last name must be between 2-50 characters.' })
    name: string;

    @IsNotEmpty({ message: 'This field is mandatory.' })
    @IsEmail()
    email: string;

    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
        message: 'The password must contain at least one uppercase letter, one lowercase letter and one number'
    })
    @IsNotEmpty()
    @IsString()
    @Length(6, 20, { message: 'Password must be between 6-20 characters.' })
    readonly password: string;

    @IsEnum(UserRole)
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

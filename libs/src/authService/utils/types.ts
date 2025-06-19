import { UserRole } from "../../usersService/entities/user.enum";

export  interface JwtPayload{
    id: number,
    email: string,
    role: UserRole
}
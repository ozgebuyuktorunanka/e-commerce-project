import { UserRole } from "users/entities/user.enum";


export  interface JwtPayload{
    id: number,
    email: string,
    role: UserRole
}
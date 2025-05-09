import { UserRole } from "../entities/user.enum";

export interface UserResponseDto {
    id: string; 
    username: string; 
    email: string;
    role: UserRole;
}
import { UserRole } from "../entities/user.enum";

export interface UserResponseDto {
    id: number; 
    username: string; 
    email: string;
    role: UserRole;
}
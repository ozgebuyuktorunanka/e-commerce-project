import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsStrongPassword } from "common/decoraters/is-strong-password.decorator";
import { UserRole } from "users/entities/user.enum";

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User{
    @Prop({ required:true, unique: true})
    username: string;
    
    @Prop({required: true})
    @IsStrongPassword()
    password: string;
    
    @Prop({required: true})
    email: string;
    
    @Prop({
        type: String,
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;
    
    @Prop({default:true})
    isActive: boolean;
}

export const UserSchema =  SchemaFactory.createForClass(User);
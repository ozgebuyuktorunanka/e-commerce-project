import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsStrongPassword } from "../../decoraters/is-strong-password.decorater";
import { UserRole } from "../../usersService/entities/user.enum";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User{
    @Prop({ required:true, unique: true})
    username!: string;
    
    @Prop({required: true})
    @IsStrongPassword()
    password!: string;
    
    @Prop({required: true})
    email!: string;
    
    @Prop({
        type: String,
        enum: UserRole,
        default: UserRole.USER
    })
    role!: UserRole;
    
    @Prop({default:true})
    isActive!: boolean;
}

export const UserSchema =  SchemaFactory.createForClass(User);
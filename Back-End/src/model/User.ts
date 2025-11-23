import mongoose, { Schema } from "mongoose";


export enum Role{
    ADMIN = "ADMIN",
    USER = "USER"
}

export enum Status{
    ACTIVE = "ACTIVE",
    BANNED = "BANNED"
}

export interface IUser extends Document{
    _id:mongoose.Types.ObjectId;
    firstname : string;
    lastname : string;
    email : string;
    password : string;
    role : Role;
    approved : Status;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    firstname: {type: String, required:true},
    lastname: {type: String, required:true},
    email: {type: String, required:true, unique:true},
    password: {type: String,required:true},
    role: {type: String,enum: Object.values(Role),default:Role.USER},
    approved: {type:String, enum:Object.values(Status),default:Status.ACTIVE}
    },
    {
    timestamps: true  
    }
);

export const User = mongoose.model<IUser>("User",userSchema)
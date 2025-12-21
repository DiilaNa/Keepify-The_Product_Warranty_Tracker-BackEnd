import mongoose, { Schema, Document } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum Status {
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
}

export type Provider = "LOCAL" | "GOOGLE";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  password?: string; // optional for Google users
  role: Role;
  approved: Status;
  provider?: Provider; // optional
  googleId?: string; // optional
  avatar?: string; // optional
  createdAt: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String }, // optional for Google
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    approved: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
    provider: { type: String, enum: ["LOCAL", "GOOGLE"], default: "LOCAL" },
    googleId: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);

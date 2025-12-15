import mongoose, { Document, Schema } from "mongoose";

export enum AnnouncementStatus{
    PUBLISHED = "PUBLISHED",
    UNPUBLISHED = "UNPUBLISHED",
}

export interface IAnnouncement extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: AnnouncementStatus;
  createdAt: Date;
  updatedAt?: Date;
  img_url: string;
  ownerId: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
}

const announcementScema = new Schema<IAnnouncement>(
  {
    title: { type: String },
    description: { type: String },
    status: {
      type: String,
      enum: Object.values(AnnouncementStatus),
      default: AnnouncementStatus.PUBLISHED,
    },
    img_url: { type: String },
    ownerId: { type: mongoose.Types.ObjectId, ref: "User" },
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
  },
  {
    timestamps: true,
  }
);

export const Announcement = mongoose.model<IAnnouncement>("Announcement",announcementScema);
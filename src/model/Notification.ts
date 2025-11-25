import mongoose, { Schema, Document } from "mongoose";

export enum NotificationType {
    EXPIRY_SOON = "EXPIRY_SOON",
    EXPIRED = "EXPIRED",
    INFO = "INFO"
}

export interface INotification extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;            
    message: string;            
    mail_body?: string;       
    userId: mongoose.Types.ObjectId;
    warrantyId: mongoose.Types.ObjectId;
    type: NotificationType;               
    read: boolean;             
    createdAt: Date;           
}    

const NotificationSchema = new Schema<INotification>(
{
    title: { type: String, required: true },
    message: { type: String, required: true },
    mail_body: { type: String, required: false }, 
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    warrantyId: { type: Schema.Types.ObjectId, ref: "Warranty" },
    type:  { type: String, enum: Object.values(NotificationType), default: NotificationType.INFO },
    read: { type: Boolean, default: false }   
},
{
    timestamps: true
}
);

export const Notification = mongoose.model<INotification>("Notification",NotificationSchema);

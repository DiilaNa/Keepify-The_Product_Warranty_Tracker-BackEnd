import mongoose, { Schema } from "mongoose";

export enum WarrantyStatus{
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    DELETED = "DELETED"
}

export interface IWarranty extends Document{
    _id: mongoose.Types.ObjectId;
    name: string;
    purchase_date: Date;
    expiry_date: Date;
    description?: string;
    serial_number: string;
    bill_image: string;
    status?: string;
    ownerId: mongoose.Types.ObjectId;
    category: mongoose.Types.ObjectId;
    brandId: mongoose.Types.ObjectId;
}

const warrrantyScema = new Schema<IWarranty>({
    name: {type: String,required:true},
    purchase_date: {type: Date, required:true},
    expiry_date: {type: Date, required:true},
    description: {type: String},
    serial_number: {type: String, required:true},
    bill_image: {type: String, required:true},
    status: {type: String, enum: Object.values(WarrantyStatus), default:WarrantyStatus.ACTIVE},
    ownerId: {type: mongoose.Types.ObjectId, ref: 'User'},
    category: {type: mongoose.Types.ObjectId, ref: 'Category'},
    brandId: {type: mongoose.Types.ObjectId, ref: 'Brand'}
},{
    timestamps: true
})


export const Warranty = mongoose.model<IWarranty>("Warranty", warrrantyScema)
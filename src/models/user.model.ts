import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
    name: string
    email: string
    password: string
    role: 'buyer' | 'seller'
    createdAt: Date
    updatedAt: Date
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        role: { type: String, enum: ['buyer', 'seller'], default: 'buyer' },
    },
    {
        timestamps: true,
    },
)

export const UserModel = model<IUser>('User', userSchema)

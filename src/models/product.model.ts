import { Schema, model, Document, Types } from 'mongoose'

export interface IProduct extends Document {
    title: string
    description?: string
    price: number
    images?: string[]
    seller: Types.ObjectId
    endTime: Date
    status: 'active' | 'ended'
    createdAt: Date
    updatedAt: Date
}

const productSchema = new Schema<IProduct>(
    {
        title: { type: String, required: true },
        description: String,
        price: { type: Number, required: true },
        images: [String],
        seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        endTime: { type: Date, required: true },
        status: { type: String, enum: ['active', 'ended'], default: 'active' },
    },
    { timestamps: true },
)

export const ProductModel = model<IProduct>('Product', productSchema)

import { Schema, model, Document, Types } from 'mongoose'

export interface IBid extends Document {
    amount: number
    bidder: Types.ObjectId
    product: Types.ObjectId
    createdAt: Date
}

const bidSchema = new Schema<IBid>(
    {
        amount: { type: Number, required: true },
        bidder: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }, // Bids don't need updatedAt
)

export const BidModel = model<IBid>('Bid', bidSchema)

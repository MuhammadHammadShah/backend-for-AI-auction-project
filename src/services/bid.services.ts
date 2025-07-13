import { BidModel } from '../models/bid.model'
import { ProductModel } from '../models/product.model'

export class BidService {
    async placeBid(data: {
        productId: string
        userId: string
        amount: number
    }) {
        const { productId, userId, amount } = data

        if (amount <= 0) {
            throw new Error('Bid amount must be greater than zero.')
        }

        const bid = await BidModel.create({
            amount,
            product: productId,
            bidder: userId,
        })

        return bid
    }

    async getBidsForProduct(productId: string) {
        return await BidModel.find({ product: productId })
            .sort({ amount: -1 }) // Highest first
            .populate('bidder', 'name email')
    }

    async getHighestBid(productId: string) {
        return await BidModel.findOne({ product: productId })
            .sort({ amount: -1 })
            .populate('bidder', 'name email')
    }

    async getSuggestedPrice(productId: string): Promise<number> {
        const bids = await BidModel.find({ product: productId }).select(
            'amount',
        )
        const product = await ProductModel.findById(productId).select('price')

        const basePrice = product?.price || 100

        if (bids.length === 0) {
            // No bids yet → start at basePrice + 10%
            return Math.round(basePrice * 1.1)
        }

        const total = bids.reduce((sum, bid) => sum + bid.amount, 0)
        const avg = total / bids.length

        // Add a smart random boost: 10%–20%
        const boost = 1.1 + Math.random() * 0.1 // 1.1–1.2
        const suggested = avg * boost

        return Math.round(suggested)
    }

    // async updateProduct(
    //     productId: string,
    //     sellerId: string,
    //     updates: Partial<{
    //         title: string
    //         description?: string
    //         images?: string[]
    //         price?: number
    //     }>,
    // ) {
    //     const product = await ProductModel.findOneAndUpdate(
    //         { _id: productId, seller: sellerId },
    //         { $set: updates },
    //         { new: true },
    //     )

    //     if (!product) throw new Error('Not found or not authorized')
    //     return product
    // }

    // /** Delete a product that belongs to the seller */
    // async deleteProduct(productId: string, sellerId: string) {
    //     const doc = await ProductModel.findOneAndDelete({
    //         _id: productId,
    //         seller: sellerId,
    //     })

    //     if (!doc) throw new Error('Not found or not authorized')
    //     return true
    // }
}

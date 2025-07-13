import cron from 'node-cron'
import { ProductModel, IProduct } from '../models/product.model'
import { BidModel, IBid } from '../models/bid.model'
import { IUser } from '../models/user.model'

/**
 * ──────────────────────────────────────────────────────────────
 * CRON   : Every minute   (/1 * * * *)
 * PURPOSE: For every product whose endTime has passed AND
 *          winner === null, pick the highest bid and store
 *          the bidder’s _id in product.winner.
 * ──────────────────────────────────────────────────────────────
 */
export const declareWinnersJob = cron.schedule('*/1 * * * *', () => {
    void (async () => {
        const now = new Date()
        console.log('⏰  [declareWinnersJob] Running at', now.toISOString())

        try {
            // 1. Fetch products whose auction ended but no winner yet
            const endedProducts: IProduct[] = await ProductModel.find({
                endTime: { $lt: now },
                winner: null,
            })

            if (!endedProducts.length) {
                console.log('ℹ️  No ended auctions without winner.')
                return
            }

            for (const product of endedProducts) {
                // 2. Get highest bid for this product
                const highestBid: IBid | null = (await BidModel.findOne({
                    product: product._id,
                })
                    .sort({ amount: -1 })
                    .populate('bidder', 'name email role')) as
                    | (IBid & { bidder: IUser })
                    | null

                // 3. Assign winner if there's a bid
                if (highestBid) {
                    await ProductModel.findByIdAndUpdate(product._id, {
                        winner:
                            typeof highestBid.bidder === 'string'
                                ? highestBid.bidder
                                : (highestBid.bidder as IUser)._id,
                        status: 'ended',
                    })

                    console.log(
                        `🏆  Winner declared for "${product.title}" → ${
                            typeof highestBid.bidder === 'string'
                                ? highestBid.bidder
                                : (highestBid.bidder as IUser).email
                        } (bid: ${highestBid.amount})`,
                    )
                } else {
                    // No bids — just mark as ended
                    await ProductModel.findByIdAndUpdate(product._id, {
                        winner: null,
                        status: 'ended',
                    })
                    console.log(
                        `⚠️  Auction ended with no bids for "${product.title}"`,
                    )
                }
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err)
            console.error('❌  declareWinnersJob error:', msg)
        }
    })()
})

import { Request, Response } from 'express'
import { BidService } from '../services/bid.services'
import { AuthenticatedRequest } from '../middlewares/auth.middleware'
// import { IProduct } from '../models/product.model'
import { ProductService } from '../services/product.services'

export class BidController {
    private readonly bidService = new BidService()
    private readonly productService = new ProductService()

    /** POST /products/:id/bid */
    public readonly placeBid = async (
        req: AuthenticatedRequest,
        res: Response,
    ): Promise<void> => {
        try {
            const productId = req.params.id // /products/:id/bid
            const { amount } = req.body as { amount: number }
            const userId = req.user?.id

            /* ─── Basic checks ────────────────────────────────────────── */
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' })
                return
            }
            if (!amount || amount <= 0) {
                res.status(400).json({ message: 'Bid amount must be > 0.' })
                return
            }

            /* ─── Fetch product ───────────────────────────────────────── */
            const product = await this.productService.getProductById(productId)
            if (!product) {
                res.status(404).json({ message: 'Product not found' })
                return
            }

            /* ─── Prevent seller bidding on own product ───────────────── */
            if (product.seller.toString() === userId) {
                res.status(400).json({
                    message: 'You cannot bid on your own product.',
                })
                return
            }

            /* ─── Check auction end time ──────────────────────────────── */
            if (new Date() > product.endTime) {
                res.status(400).json({
                    message: 'Bidding time is over. Auction closed.',
                })
                return
            }

            /* ─── Place bid via service ───────────────────────────────── */
            const bid = await this.bidService.placeBid({
                productId,
                userId,
                amount,
            })

            res.status(201).json({ bid })
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Bid failed'
            res.status(400).json({ message })
        }
    }

    /** GET /products/:id/bids */
    public readonly getBids = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        try {
            const productId = req.params.id
            const bids = await this.bidService.getBidsForProduct(productId)
            res.status(200).json({ bids })
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Fetch failed'
            res.status(500).json({ message })
        }
    }

    /** GET /products/:id/bid/highest */
    public readonly getHighestBid = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        try {
            const productId = req.params.id
            const highest = await this.bidService.getHighestBid(productId)
            res.status(200).json({ highest })
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Fetch failed'
            res.status(500).json({ message })
        }
    }

    public readonly suggestPrice = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        try {
            const productId = req.params.id
            const suggested = await this.bidService.getSuggestedPrice(productId)

            res.status(200).json({ suggestedPrice: suggested })
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Suggestion failed'
            res.status(500).json({ message })
        }
    }

    // public readonly update = async (
    //     req: AuthenticatedRequest,
    //     res: Response,
    // ): Promise<void> => {
    //     try {
    //         const { id } = req.params
    //         const sellerId = req.user?.id
    //         const updates = req.body as IProduct

    //         if (!sellerId) {
    //             res.status(401).json({ message: 'Unauthorized' })
    //             return
    //         }

    //         const product = await this.productService.updateProduct(
    //             id,
    //             sellerId,
    //             updates,
    //         )
    //         res.status(200).json({ product })
    //     } catch (err) {
    //         const message = err instanceof Error ? err.message : 'Update failed'
    //         res.status(404).json({ message })
    //     }
    // }

    // /** DELETE /products/:id */
    // public readonly delete = async (
    //     req: AuthenticatedRequest,
    //     res: Response,
    // ): Promise<void> => {
    //     try {
    //         const { id } = req.params
    //         const sellerId = req.user?.id

    //         if (!sellerId) {
    //             res.status(401).json({ message: 'Unauthorized' })
    //             return
    //         }

    //         await this.productService.deleteProduct(id, sellerId)
    //         res.status(200).json({ message: 'Product deleted' })
    //     } catch (err) {
    //         const message = err instanceof Error ? err.message : 'Delete failed'
    //         res.status(404).json({ message })
    //     }
    // }
}

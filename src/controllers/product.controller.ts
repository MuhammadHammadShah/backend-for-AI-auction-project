import { Request, Response } from 'express'
import { ProductService } from '../services/product.services'
import { AuthenticatedRequest } from '../middlewares/auth.middleware'
import { IProduct } from '../models/product.model'
import { CreateProductDTO } from '../types/product.types'

export class ProductController {
    constructor(private productService: ProductService) {
        // Bind the method to the class instance
        this.getAll = this.getAll.bind(this)
    }
    /** POST /products */
    public readonly create = async (
        req: AuthenticatedRequest,
        res: Response,
    ): Promise<void> => {
        try {
            const { title, description, images, price, endTime } =
                req.body as CreateProductDTO

            if (!endTime) {
                res.status(400).json({ message: 'endTime is required' })
                return
            }

            if (!title || !price) {
                res.status(400).json({
                    message: 'Title and price are required.',
                })
                return
            }

            const sellerId = req.user?.id
            if (!sellerId) {
                res.status(401).json({ message: 'Unauthorized' })
                return
            }

            const product = await this.productService.createProduct({
                title,
                description,
                images,
                price,
                sellerId,
                endTime: new Date(endTime),
            })

            res.status(201).json({ product })
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Create failed'
            res.status(500).json({ message })
        }
    }

    public getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const products = await this.productService.getAllProducts()
            res.status(200).json({ products })
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Fetch failed'
            res.status(500).json({ message })
        }
    }

    public readonly getMine = async (
        req: AuthenticatedRequest,
        res: Response,
    ): Promise<void> => {
        try {
            const sellerId = req.user?.id
            if (!sellerId) {
                res.status(401).json({ message: 'Unauthorized' })
                return
            }

            const products =
                await this.productService.getProductsBySeller(sellerId)
            res.status(200).json({ products })
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Fetch failed'
            res.status(500).json({ message })
        }
    }
    public readonly delete = async (
        req: AuthenticatedRequest,
        res: Response,
    ): Promise<void> => {
        try {
            const { id } = req.params
            const sellerId = req.user?.id

            if (!sellerId) {
                res.status(401).json({ message: 'Unauthorized' })
                return
            }

            await this.productService.deleteProduct(id, sellerId)
            res.status(200).json({ message: 'Product deleted' })
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Delete failed'
            res.status(404).json({ message })
        }
    }
    public readonly update = async (
        req: AuthenticatedRequest,
        res: Response,
    ): Promise<void> => {
        try {
            const { id } = req.params
            const sellerId = req.user?.id
            const updates = req.body as IProduct

            if (!sellerId) {
                res.status(401).json({ message: 'Unauthorized' })
                return
            }

            const updated = await this.productService.updateProduct(
                id,
                sellerId,
                updates,
            )
            res.status(200).json({ product: updated })
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Update failed'
            res.status(404).json({ message })
        }
    }

    public readonly getStatus = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        try {
            const { id } = req.params
            const product = await this.productService.getProductById(id)

            if (!product) {
                res.status(404).json({ message: 'Product not found' })
                return
            }

            const now = new Date()
            const isClosed = now > product.endTime

            res.status(200).json({
                productId: product._id,
                status: isClosed ? 'closed' : 'open',
                timeLeft: isClosed
                    ? 'Auction ended'
                    : `${Math.ceil(
                          (product.endTime.getTime() - now.getTime()) /
                              1000 /
                              60,
                      )} minutes left`,
            })
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed'
            res.status(500).json({ message })
        }
    }
}

import { ProductModel } from '../models/product.model'

export class ProductService {
    async createProduct(data: {
        title: string
        description?: string
        images?: string[]
        price: number
        sellerId: string
        endTime: Date
    }) {
        const { title, description, images, price, sellerId, endTime } = data

        const product = await ProductModel.create({
            title,
            description,
            images,
            price,
            seller: sellerId,
            endTime,
        })

        return product
    }
    async getProductById(id: string) {
        return await ProductModel.findById(id)
    }
    async getAllProducts() {
        return await ProductModel.find().populate('seller', 'name email role')
    }
    async getProductsBySeller(sellerId: string) {
        return await ProductModel.find({ seller: sellerId }).populate(
            'seller',
            'name email role',
        )
    }
    async deleteProduct(productId: string, sellerId: string) {
        const product = await ProductModel.findOne({
            _id: productId,
            seller: sellerId,
        })
        if (!product) throw new Error('Not found or not authorized')
        await product.deleteOne()
        return true
    }
    async updateProduct(
        productId: string,
        sellerId: string,
        updates: Partial<{
            title: string
            description?: string
            price?: number
            images?: string[]
        }>,
    ) {
        const product = await ProductModel.findOneAndUpdate(
            { _id: productId, seller: sellerId },
            { $set: updates },
            { new: true },
        )

        if (!product) throw new Error('Not found or not authorized')
        return product
    }
}

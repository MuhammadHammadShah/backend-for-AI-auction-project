// POST /products — Add new listing (title, description, images, price)

// GET /products — List all products with filters (search, category, etc.)

// GET /products/:id — View product details

// PUT /products/:id — Update listing

// DELETE /products/:id — Delete listing

// POST /purchase — Buy a product

// POST /wishlist — Add to wishlist

// GET /wishlist — View wishlist

import { Router, Request, Response } from 'express'
import { ProductController } from '../controllers/product.controller'
import { authenticate } from '../middlewares/auth.middleware'
import { ProductService } from '../services/product.services'
import { BidController } from '../controllers/bid.controller'

const router = Router()
const productService = new ProductService()
const productCtrl = new ProductController(productService)
const bidController = new BidController()

router.post('/', authenticate, productCtrl.create)
router.get('/', (req: Request, res: Response) => productCtrl.getAll(req, res)) // public route
router.get('/mine', authenticate, productCtrl.getMine)
router.delete('/:id', authenticate, productCtrl.delete)
router.put('/:id', authenticate, productCtrl.update)
// 💸 Place a bid (buyers only, auth required)
router.post('/:id/bid', authenticate, bidController.placeBid)

// 📜 See all bids on a product
router.get('/:id/bids', bidController.getBids)
// 🏆 Get the highest bid for a product
router.get('/:id/bid/highest', bidController.getHighestBid)
router.get('/:id/suggest-price', bidController.suggestPrice)

//status

router.get('/:id/status', productCtrl.getStatus)

export default router

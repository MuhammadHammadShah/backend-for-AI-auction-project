/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and bidding
 */

import { Router, Request, Response } from 'express'
import { ProductController } from '../controllers/product.controller'
import { authenticate } from '../middlewares/auth.middleware'
import { ProductService } from '../services/product.services'
import { BidController } from '../controllers/bid.controller'

const router = Router()
const productService = new ProductService()
const productCtrl = new ProductController(productService)
const bidController = new BidController()

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product listing
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, price, endTime]
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post('/', authenticate, productCtrl.create)

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', (req: Request, res: Response) => productCtrl.getAll(req, res))

/**
 * @swagger
 * /products/mine:
 *   get:
 *     summary: Get products created by the logged-in user
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's products
 */
router.get('/mine', authenticate, productCtrl.getMine)

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete('/:id', authenticate, productCtrl.delete)

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put('/:id', authenticate, productCtrl.update)

/**
 * @swagger
 * /products/{id}/bid:
 *   post:
 *     summary: Place a bid on a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Bid placed
 */
router.post('/:id/bid', authenticate, bidController.placeBid)

/**
 * @swagger
 * /products/{id}/bids:
 *   get:
 *     summary: Get all bids on a product
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of bids
 */
router.get('/:id/bids', bidController.getBids)

/**
 * @swagger
 * /products/{id}/bid/highest:
 *   get:
 *     summary: Get the highest bid on a product
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Highest bid returned
 */
router.get('/:id/bid/highest', bidController.getHighestBid)

/**
 * @swagger
 * /products/{id}/suggest-price:
 *   get:
 *     summary: Suggest a bid price (AI or logic)
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suggested bid price returned
 */
router.get('/:id/suggest-price', bidController.suggestPrice)

/**
 * @swagger
 * /products/{id}/status:
 *   get:
 *     summary: Get bidding status of a product (open or closed)
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status returned
 */
router.get('/:id/status', productCtrl.getStatus)

export default router

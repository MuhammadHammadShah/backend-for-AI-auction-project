// app.ts
import express from 'express'
import mongoose from 'mongoose'
import productionLogger from './logger'
import marketPlaceRouter from './routes/marketPlace.route'
import authRoutes from './routes/auth.routes'
import { config } from './config/config'

const app = express()

// Logger middleware
const logger = productionLogger()

// MongoDB Connection
mongoose
    .connect(config.mongoURI)
    .then(() => logger.info('🟢 MongoDB connected'))
    .catch((err) => {
        logger.error('🔴 MongoDB connection error: ', err)
        process.exit(1)
    })

// Middleware
app.use(express.json())

app.use(express.json({ limit: '10mb' })) // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })) // Parse URL-encoded bodies

// Routes
app.use('/products', marketPlaceRouter)

app.use('/auth', authRoutes)

// Test Route
app.get('/', (req, res) => {
    logger.info('Root endpoint hit')
    res.send('hello world')
})

export default app

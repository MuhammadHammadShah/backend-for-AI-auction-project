import dotenv from 'dotenv'

dotenv.config()

export const config = {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI || '',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret',
    env: process.env.NODE_ENV || 'development',
}

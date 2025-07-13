import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

/**
 * Extended request type to include `user`
 */
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload & { id: string }
}

/**
 * Middleware to verify JWT and attach user to req
 */
export const authenticate = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): void => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authorization token missing' })
        return
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!,
        ) as JwtPayload & {
            id: string
        }

        req.user = decoded
        next() // ✅ call next middleware
    } catch (err) {
        console.error('JWT verification failed:', err)
        res.status(401).json({ message: 'Invalid or expired token' })
    }
}

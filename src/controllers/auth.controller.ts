// src/controllers/auth.controller.ts
import { Request, Response } from 'express'
import { AuthService } from '../services/auth.services'
import { IUser } from '../models/user.model'

export class AuthController {
    private readonly authService = new AuthService()

    /** POST /auth/register */
    public readonly register = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        try {
            // Check if req.body exists
            if (!req.body) {
                res.status(400).json({
                    message: 'Request body is missing. Please send JSON data.',
                })
                return
            }

            const { name, email, password, role } = req.body as IUser

            // Quick validation
            if (!name || !email || !password) {
                res.status(400).json({
                    message: 'Name, email and password are required.',
                })
                return
            }

            const token = await this.authService.register(
                name,
                email,
                password,
                role,
            )
            res.status(201).json({ token })
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Registration failed'
            res.status(400).json({ message })
        }
    }

    /** POST /auth/login */
    public readonly login = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        try {
            // Debug logging
            console.log('Request headers:', req.headers)
            console.log('Request body:', req.body)
            console.log('Request body type:', typeof req.body)

            // Check if req.body exists
            if (!req.body || Object.keys(req.body as IUser).length === 0) {
                res.status(400).json({
                    message:
                        'Request body is missing. Please send JSON data with Content-Type: application/json header.',
                })
                return
            }

            const { email, password } = req.body as IUser

            if (!email || !password) {
                res.status(400).json({
                    message: 'Email and password are required.',
                    received: { email: !!email, password: !!password },
                })
                return
            }

            const token = await this.authService.login(email, password)
            res.status(200).json({ token })
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed'
            res.status(401).json({ message }) // Changed to 401 for login failures
        }
    }
}

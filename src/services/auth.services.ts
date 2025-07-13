import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Document, Types } from 'mongoose'
import { UserModel } from '../models/user.model'
import { config } from '../config/config'

// Define the user interface extending Mongoose Document
export interface IUser extends Document {
    _id: Types.ObjectId
    name: string
    email: string
    password: string
    role: 'buyer' | 'seller'
    __v?: number
    createdAt?: Date
    updatedAt?: Date
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type UserInput = {
    name: string
    email: string
    password: string
    role?: 'buyer' | 'seller'
}

export class AuthService {
    async register(
        name: string,
        email: string,
        password: string,
        role: 'buyer' | 'seller' = 'buyer',
    ): Promise<string> {
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            throw new Error('User already exists')
        }

        const hashed = await bcrypt.hash(password, 10)

        const user = (await UserModel.create({
            name,
            email,
            password: hashed,
            role,
        })) as IUser

        return this.generateToken(user._id.toString())
    }

    async login(email: string, password: string): Promise<string> {
        const user = (await UserModel.findOne({ email })
            .select('+password')
            .exec()) as IUser

        if (!user) {
            throw new Error('Invalid credentials')
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new Error('Invalid credentials')
        }

        return this.generateToken(user._id.toString())
    }

    private generateToken(userId: string): string {
        return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: '1d' })
    }
}

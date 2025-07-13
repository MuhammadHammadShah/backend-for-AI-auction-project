import jwt from 'jsonwebtoken'

// 👇 use a fake MongoDB _id
const userPayload = {
    id: '64fc09fcdedb123456789abc', // mock user id
}

const token = jwt.sign(userPayload, 'supersecret123', { expiresIn: '1d' })

console.log('🔐 Token:', token)

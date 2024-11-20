import jwt from 'jsonwebtoken'
import { secretKey } from '../app/config.js'

const signToken = (id) => {
    return jwt.sign({ id }, secretKey, {
        expiresIn: '6d'
    })
}

export const createSendResToken = (user, statusCode, res) => {
    const token = signToken(user._id)

    const isDev = process.env.NODE_ENV === 'development' ? false : true;

    const cookieOption = {
        expires: new Date(
            Date.now() + 6 * 24 * 60 * 60 * 1000
        ),
        httpOnly: false,
        security: false
    }

    res.cookie('jwt', token, cookieOption)

    user.us_password = undefined

    res.status(statusCode).json({
        data: user,
        token
    })
}

export const verifyToken = (token) => {
    return jwt.verify(token, secretKey)
}
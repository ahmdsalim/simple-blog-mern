import { verifyToken } from "../utils/authjwt.js";
import User from '../app/user/model.js'
import asyncHandler from "./asyncHandler.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies.jwt
    if(token) {
        try {
            const decoded = verifyToken(token)
            req.user = await User.findById(decoded.id)
            next()
        } catch (err) {
            res.status(401)
            throw new Error("Not authorized, token failed")
        }
    }else{
        res.status(401)
        throw new Error("Not authorized, no token")
    }
})
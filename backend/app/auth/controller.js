import User from '../user/model.js'
import Joi from 'joi'
import bcrypt from 'bcrypt'
import { createSendResToken } from '../../utils/authjwt.js'
import asyncHandler from '../../middlewares/asyncHandler.js'
import handleValidationError from '../../utils/handleValidationError.js'

const registerSchema = Joi.object({
    us_name: Joi.string().min(3).max(50).required(),
    us_email: Joi.string().email().required(),
    us_password: Joi.string().min(6).max(20).required()
})

const loginSchema = Joi.object({
    us_email: Joi.string().email().required(),
    us_password: Joi.string().required()
})

export const register = asyncHandler(async (req, res, next) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: false })
    if(error) return handleValidationError(error, res);

    const { us_password, ...rest } = req.body
    const hashedPass = await bcrypt.hash(us_password, 10)

    await User.create({...rest, us_password: hashedPass})

    res.status(201).json({
        success: true
    })
})

export const login = asyncHandler(async (req, res, next) => {
    const { error } = loginSchema.validate(req.body)
    if(error) return handleValidationError(error, res);

    const { us_email, us_password } = req.body
    const user = await User.findOne({ us_email })

    if(!user) throw new Error("Email/password salah");
    
    const match = await bcrypt.compare(us_password, user.us_password)
    
    if(user && match){
        createSendResToken(user, 200, res)
    } else {
        res.status(400)
        throw new Error("Email atau password salah")
    }
})

export const me = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("-us_password")

    if(user) {
        return res.status(200).json({
            success: true,
            data: user
        })
    }else{
        throw new Error("User not found")
    }
})

export const logout = async (req, res, next) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(Date.now())
    })

    res.status(200).json({
        success: true,
        message: "Logout success"
    })
}
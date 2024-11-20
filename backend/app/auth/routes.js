import express from 'express'
import { login, register, me, logout } from './controller.js'
import { authMiddleware } from '../../middlewares/authMiddleware.js'

const router = express.Router()

router.post("/login", login)
router.post("/register", register)
router.get("/me", authMiddleware, me)
router.post("/logout", authMiddleware, logout)

export default router
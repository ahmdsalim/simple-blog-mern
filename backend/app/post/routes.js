import express from 'express'
import { index, store, update, destroy, getPostById, myPosts } from './controller.js'
import { authMiddleware } from '../../middlewares/authMiddleware.js'

const router = express.Router()

router.get("/", index)
router.post("/", authMiddleware, store)
router.put("/:id", authMiddleware, update)
router.delete("/:id", authMiddleware, destroy)
router.get("/:id", getPostById)
router.get("/my/list", authMiddleware, myPosts)

export default router
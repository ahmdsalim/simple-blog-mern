import express from 'express'
import { index, store, update, destroy, getAllPosts, show } from './controller.js'
import { authMiddleware } from '../../middlewares/authMiddleware.js'

const router = express.Router()

router.get("/", index)
router.get("/:id", show)
router.post("/", authMiddleware, store)
router.put("/:id", authMiddleware, update)
router.delete("/:id", authMiddleware, destroy)
router.get("/:id/posts", getAllPosts)

export default router
import Category from './model.js'
import Post from '../post/model.js'
import asyncHandler from '../../middlewares/asyncHandler.js'
import Joi from 'joi'
import handleValidationError from '../../utils/handleValidationError.js'
import getPlainText from '../../utils/getPlainText.js'

const catSchema = Joi.object().keys({
    cat_name: Joi.string().max(50).required()
})

export const index = asyncHandler(async (req, res, next) => {
    const queryObj = { ...req.query }

    const excludeFields = ["page", "limit"]
    excludeFields.forEach(el => delete queryObj[el])

    let query

    if(req.query.search) {
        query = Category.find({
            name: {$regex: req.query.search, $options: "i"}
        })
    }else{
        query = Category.find(queryObj)
    }

    query = query.sort("-createdAt")

    //Pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 20
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

    const countCat = await Category.countDocuments()
    if(req.query.page && skip >= countCat) {
        res.status(404)
        throw new Error("This page does not exist")
    }

    const data = await query

    return res.status(200).json({
        success: true,
        data,
        count: countCat
    })
})

export const store = asyncHandler(async (req, res, next) => {
    const { error } = catSchema.validate(req.body)
    if(error) return handleValidationError(error, res);

    const { cat_name } = req.body

    const category = await Category.create({ cat_name })

    return res.status(201).json({
        success: true,
        data: category
    })
})

export const update = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const { error } = catSchema.validate(req.body)
    if(error) return handleValidationError(error, res);

    const { cat_name } = req.body

    const category = await Category.findByIdAndUpdate(id, { cat_name }, {
        new: true,
        runValidators: false
    })

    return res.status(201).json({
        success: true,
        data: category
    })
})

export const destroy = asyncHandler(async (req, res, next) => {
    const id = req.params.id

    await Category.findByIdAndDelete(id)

    return res.status(200).json({
        success: true,
        message: "Successfully deleted"
    })
})

export const getAllPosts = asyncHandler(async (req, res, next) => {
    const id = req.params.id

    let query = Post.find({ category: id }).sort("-createdAt").populate("category").populate("user")
    
    //pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 10
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

    const countPosts = await Post.countDocuments()
    if(req.query.page && skip >= countPosts) {
        res.status(404)
        throw new Error("This page does not exist")
    }
    const posts = await query.lean()

    const data = posts.map(post => ({
        ...post,
        summary: getPlainText(post.ps_body)
        })
    )

    return res.status(200).json({
        success: true,
        data
    })
})

export const show = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const category = await Category.findById(id)

    if(!category) {
        res.status(404)
        throw new Error("Category not found")
    }

    return res.status(200).json({
        success: true,
        data: category
    })
})
import Post from './model.js'
import asyncHandler from '../../middlewares/asyncHandler.js'
import Joi from 'joi'
import handleValidationError from '../../utils/handleValidationError.js'
import Category from '../category/model.js'
import sanitizeHtml from 'sanitize-html'
import getPlainText from '../../utils/getPlainText.js'

const postSchema = Joi.object().keys({
    ps_title: Joi.string().required(),
    ps_body: Joi.string().required(),
    ps_thumbnail: Joi.string().required(),
    category: Joi.string().required()
})

const postUpdateSchema = Joi.object().keys({
    ps_title: Joi.string().min(5).required(),
    ps_body: Joi.string().min(5).required(),
    ps_thumbnail: Joi.string().required(),
    category: Joi.string().required()
})

export const index = asyncHandler(async (req, res, next) => {
    const queryObj = { ...req.query }

    const excludeFields = ["page", "limit"]
    excludeFields.forEach(el => delete queryObj[el])

    let query

    if(req.query.search) {
        query = Post.find({
            ps_title: { $regex: '.*' + req.query.search + '.*', $options: 'i' }
        })
    }else{
        query = Post.find(queryObj)
    }

    query = query.sort("-createdAt").populate("category").populate("user")

    //Pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 20
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

    const countPost = await Post.countDocuments()
    if(req.query.page && skip >= countPost) {
        res.status(404)
        throw new Error("This page does not exist")
    }

    const posts = await query.lean()

    const data = posts.map(post => ({
        ...post,
        summary: getPlainText(post.ps_body)
    }))

    return res.status(200).json({
        success: true,
        data,
        count: countPost
    })
})

export const store = asyncHandler(async (req, res, next) => {
    const { error } = postSchema.validate(req.body)
    if(error) return handleValidationError(error, res);

    const { ps_title, ps_body, ps_thumbnail, category } = req.body

    const sanitizedBody = sanitizeHtml(ps_body, {
        allowedTags: sanitizeHtml.defaults.allowedTags,
        allowedAttributes: {
            'a': ['href', 'name', 'target']
        }
    })

    const catExists = await Category.findById(category)
  
    if(!catExists){
        res.status(401)
        throw new Error("Category not found!")
    }

    const post = await Post.create({
        ps_title,
        ps_body: sanitizedBody,
        ps_thumbnail,
        category,
        user: req.user._id
    })

    return res.status(201).json({
        success: true,
        data: post
    })
})

export const update = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const { error } = postUpdateSchema.validate(req.body)
    if(error) return handleValidationError(error, res);

    const catExists = await Category.findById(req.body.category)
    console.log(catExists)
    if(!catExists){
        res.status(401)
        throw new Error("Category not found!")
    }

    const post = await Post.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: false
    })

    return res.status(201).json({
        success: true,
        data: post
    })
})

export const destroy = asyncHandler(async (req, res, next) => {
    const id = req.params.id

    await Post.findByIdAndDelete(id)

    return res.status(200).json({
        success: true,
        message: "Successfully deleted"
    })
})

export const getPostById = asyncHandler(async (req, res, next) => {
    const id = req.params.id

    const post = await Post.findById(id).populate("user")

    return res.status(200).json({
        success: true,
        data: post
    })
})

export const myPosts = asyncHandler(async (req, res, next) => {
    const queryObj = { ...req.query }

    const excludeFields = ["page", "limit"]
    excludeFields.forEach(el => delete queryObj[el])

    let query

    if(req.query.search) {
        query = Post.find({
            ps_title: {$regex: req.query.search, $options: "i"},
            user: req.user._id
        })
    }else{
        query = Post.find({...queryObj, user: req.user._id})
    }

    query = query.sort("-createdAt").populate("category")

    //Pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 20
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

    const countPost = await Post.countDocuments()
    if(req.query.page && skip >= countPost) {
        res.status(404)
        throw new Error("This page does not exist")
    }

    const data = await query

    return res.status(200).json({
        success: true,
        data,
        count: countPost
    })
})
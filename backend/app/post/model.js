import {model, Schema} from 'mongoose'

const postSchema = Schema(
    {
        ps_title: {
            type: String,
            required: [true, "Title must be filled"]
        },
        ps_body: {
            type: String,
            required: [true, "Body must be filled"]
        },
        ps_thumbnail: {
            type: String,
            required: [true, "Thumbnail must be filled"]
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
)

export default model("Post", postSchema)
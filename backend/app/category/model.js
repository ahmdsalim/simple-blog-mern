import { model, Schema } from 'mongoose'

const categorySchema = Schema(
    {
        cat_name: {
            type: String,
            required: [true, "Category name must be filled"]
        }
    },
    { timestamps: true }
)

export default model("Category", categorySchema)
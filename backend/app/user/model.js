import mongoose from "mongoose"

const { model, Schema } = mongoose

const UserSchema = new Schema(
    {
        us_name: {
            type: String,
            minLength: [3, "User name must be at least 3 characters long"],
            maxLength: [50, "User name must not exceed 50 characters"],
            required: [true, "User name must be filled"]
        },
        us_password: {
            type: String,
            minLength: [6, "Password must be at least 6 characters long"],
            required: [true, "Password must be filled"]
        },
        us_email: {
            type: String,
            required: [true, "Email must be filled"],
            unique: [true, "Email has been already taken"],
            match: [/.+@.+\..+/, "Please enter a valid email address"]
        }
    },
    {
        timestamps: true
    }
)

export default model("User", UserSchema)
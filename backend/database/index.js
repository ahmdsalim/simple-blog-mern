import mongoose from "mongoose"
import { dbHost, dbUser, dbPass, dbName } from "../app/config.js"

const username = encodeURIComponent(dbUser)
const password = encodeURIComponent(dbPass)

const MONGODB_URI =
    process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI
    : `mongodb+srv://${username}:${password}@${dbHost}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(MONGODB_URI, {})
    .then(() => console.log(`MongoDB successfully connected to ${MONGODB_URI}`))
    .catch((err) => console.error("MongoDB connection error: ", err))

const db = mongoose.connection

export default db
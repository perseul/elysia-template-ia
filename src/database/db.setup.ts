import mongoose from "mongoose";

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@nodeapi.vgc5rva.mongodb.net/?retryWrites=true&w=majority`
)

export default mongoose;
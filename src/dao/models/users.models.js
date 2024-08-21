import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ["Admin", "User"],
        default: "User"
    },
})

const UserModel = mongoose.model("users", userSchema)

export default UserModel 
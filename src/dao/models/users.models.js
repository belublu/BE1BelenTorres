import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user: {
        type: String
    },
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    // cart:{
    //     cartId: createCart()
    // },
    rol:{
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
})

const UserModel = mongoose.model("users", userSchema)

export default UserModel 
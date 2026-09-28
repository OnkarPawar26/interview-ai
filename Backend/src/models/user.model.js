const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true,"Username is required"],
        unique: [true,"Username already exists"]
    },
    email: {
        type: String,
        required: [true,"Email is required"],
        unique: [true,"Account with this email already exists"]
    },
    password: {
        type: String,
        required: [true,"Password is required"]
    }
})

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
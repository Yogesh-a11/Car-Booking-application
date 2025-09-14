import mongoose, { Schema } from "mongoose";

const userScehme = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'owner'],
        default: 'user'
    },
    image: {
        type: String,
        default: ''
    }

}, {timestamps: true});

const User = mongoose.model('User', userScehme);

export default User 

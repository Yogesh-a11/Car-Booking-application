import mongoose, { model, Schema } from "mongoose";

const carSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    transmission: {
        type: String,
        required: true
    },
    fuel_type: {
        type: String,
        required: true
    },
    seating_capacity: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    }

}, {timestamps: true});

const Car = model('Car', carSchema, 'cars');
export default Car

import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Car from "../models/carModel.js"

// Generate JWT  Token

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;


export const registerUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{
            name,
            email,
            password: hashedPassword
        }]);

        const token = jwt.sign(
            { userId: newUsers[0].id }, 
            JWT_SECRET, 
            {expiresIn: "1d"}
        );

        res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            user: newUsers[0]
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const loginUser = async(req, res) => {
    try {
           const { email, password } = req.body;
   
   
           const userExists = await User.findOne({ email });
   
           if (!userExists) {
               const error = new Error("User not found");
               error.statusCode = 404;
               throw error;
           }
   
           const isPasswordValid = await bcrypt.compare(password, userExists.password);
   
           if (!isPasswordValid) {
               const error = new Error("Incorrect password");
               error.statusCode = 401;
               throw error;
           }
   
           const token = jwt.sign(
               { userId: userExists.id }, 
               JWT_SECRET, 
               {expiresIn: JWT_EXPIRES_IN}
           );
   
           res.status(200).json({
               success: true,
               message: "User logged in successfully",
                token,
                user: userExists
           })
       } catch (error) {
           console.log(error.message);
           return res.status(500).json({success: false, message: "Something went wrong"})
       }
   }
   

// Get user data using JWT

export const getUserData = async (req, res) => {
    try {
        const {user} = req;
        res.json({success: true, user})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: "Something went wrong"})
    }
}

export const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find({isAvailable: true});
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: "Something went wrong"})
    }
}
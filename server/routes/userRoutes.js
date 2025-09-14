import express, { Router } from 'express'
import { getAllCars, getUserData, loginUser, registerUser } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUserData);
userRouter.get('/cars', getAllCars);

export default userRouter
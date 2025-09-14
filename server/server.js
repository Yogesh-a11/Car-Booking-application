import express from 'express';
import "dotenv/config";
import cors from 'cors'
import { connect } from 'mongoose';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import ownerRouter from './routes/ownerRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

// Initialize app
const app = express();

await connectDB();

// Middleware
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/booking", bookingRouter);

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
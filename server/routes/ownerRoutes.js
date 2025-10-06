import {Router} from 'express';
import { addCar, changeRoleToOwner, removeCarOwner, getDashboardData, getOwnerCars, toggleCarAvailability, updateUserImage } from '../controllers/ownerController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const ownerRouter = Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner);
ownerRouter.post('/add-car', protect, upload.single("image"), addCar);
ownerRouter.get("/cars", protect, getOwnerCars);
// ownerRouter.get("/dashboard", protect, getDashboardData);
ownerRouter.post("/toggle-availability", protect, toggleCarAvailability);
ownerRouter.delete("/delete-car", protect, removeCarOwner);
ownerRouter.get("/dashboard", protect, getDashboardData);
ownerRouter.post('/update-image' , protect, upload.single("image"), updateUserImage);

export default ownerRouter
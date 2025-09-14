import express from 'express'
import { checkAvailabilityOfCar, createBooking, getOwnerBookings, getUserBookings, updateBookingStatus } from '../controllers/bookingController.js'
import { protect } from '../middleware/authMiddleware.js'

const bookingRouter = express.Router()

bookingRouter.post('/check-availability', checkAvailabilityOfCar);
bookingRouter.post('/create-booking', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/owner', protect, getOwnerBookings);
bookingRouter.post('/change-status', protect, updateBookingStatus); 

export default bookingRouter
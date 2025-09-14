import Booking from "../models/booking.js"
import Car from "../models/carModel.js"

const checkAvailability = async(car, pickupDate, returnDate) => {
    // check if car is available
    const bookings = await Booking.find({
        car, 
        pickupDate: {$lte: returnDate},
        returnDate: {$gte: pickupDate}
    })
    return bookings.length === 0;
}

// API to check Availability of cars for the given date and location 

export const checkAvailabilityOfCar = async(req, res) => {
    try {
        const {location, pickupDate, returnDate} = req.body;

        // simple way but drawback for performance

        // fetch all available cars for the given location 

        // const cars = await Car.find({location, isAvailable: true});

        // // check car availability for the given date range using promise 
        // const availableCarsPromises = cars.map(async (car)=> {
        //     const availableFlag = await checkAvailability(car._id, pickupDate, returnDate);
        //     return {...car._doc, isAvailable: availableFlag};
        // })

        // let availableCars = await Promise.all(availableCarsPromises);


        

        // better way : using aggregation

        // Stage 1: Filter cars by location
        // Stage 2: Left outer join with the 'bookings' collection
        // Stage 3: Filter out cars that have an overlapping booking
        // Stage 4 : Clean up the output to remove the bookings field

        const pickupDateObj = new Date(pickupDate);
        const returnDateObj = new Date(returnDate);


        const availableCars = await Car.aggregate([
            {
                $match: {
                    location: location
                }
            },
            {
                $lookup: {
                    from: "bookings", // The name of the bookings collection
                    localField: "_id",
                    foreignField: "car",
                    as: "bookings"
                }
            },
            {
                $match: {
                    "bookings": {
                        $not: {
                            $elemMatch: {
                                "pickupDate": { $lt: returnDateObj },
                                "returnDate": { $gt: pickupDateObj }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    bookings: 0
                }
            }
        ]);

        
        availableCars = availableCars.filter(car => car.isAvailable  === true);

        res.status(200).json({success: true, availableCars})

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: "Something went wrong"})
    }
}


// Api to create booking

export const createBooking = async(req, res) => {
    try {
        const userId = req.user.id;
        const {car, pickupDate, returnDate} = req.body;

        const isAvailable = await checkAvailability(car, pickupDate, returnDate);

        if (!isAvailable) {
            return res.status(400).json({success: false, message: "Car is not available for the given date range"});
        }

        const carData = await Car.findById(car);

        // calculate the price based on pickupDate and returnDate 
        const picked = new Date(pickupDate)     //.getTime();
        const returened = new Date(returnDate)
        const noOFDays = Math.max(1, Math.ceil((returened - picked) / (1000 * 60 * 60 * 24)));
        const price = noOFDays * carData.pricePerDay;


        await Booking.create({car, owner: carData.owner, user: userId, pickupDate, returnDate, price});

        res.status(200).json({success: true, message: "Booking created successfully"})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: "Something went wrong"})
    }
}

// API to list  user booking

export const getUserBookings = async(req, res) => {
    try {
        const userId = req.user.id;
        
        const bookings = await Booking.find({user: userId}).populate("car").sort({createdAt: -1});

        res.status(200).json({success: true, bookings})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: "Something went wrong"})
    }
}


// API to get owner bookings

export const getOwnerBookings = async(req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(401).json({success: false, message: "you are not an owner"})
        }
        const userId = req.user.id;
        
        const bookings = await Booking.find({owner: userId}).populate("car user").select("-user.password").sort({createdAt: -1});

        res.status(200).json({success: true, bookings})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: "Something went wrong"})
    }
}

// API to change the booking status 

export const updateBookingStatus = async(req, res) => {
    try {
        const userId = req.user.id;
        const {bookingId, status} = req.body;

        const booking = await Booking.findById(bookingId);

        if (booking.owner.toString() !== userId) {
            return res.status(401).json({success: false, message: "Unauthorized"})
        }

        booking.status = status;
        await booking.save();
        res.status(200).json({success: true, message: "Booking status updated successfully"})

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: "Something went wrong"})
    }
}

// 
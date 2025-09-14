import imagekit from "../config/imageKit.js"
import Booking from "../models/booking.js"
import Car from "../models/carModel.js"
import User from "../models/userModel.js"
import fs from "fs"

export const changeRoleToOwner = async(req, res) => {
    try {
        const userId = req.user.id

        await User.findByIdAndUpdate(userId, {role: "owner"}, {new: true})

        res.status(200).json({success: true, message: "Role changed to owner"})

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: "Something went wrong"})
    }
}

export const addCar = async(req, res) => {
    try {
        const userId = req.user.id;
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file;

        //upload image to image kit
        const fileBuffer = await fs.readFile(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/cars"
        })

        // optimization through imagekit URL transformation
        var optimizedImageURL = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: '1280'},
                {quality: 'auto'}, // auto compration
                {format: 'webp'} // Convrt to mordern format
            ]
        });

        const image = optimizedImageURL;

        await Car.create({...car, owner: userId, image})
        
        return res.status(200).json({success: true, message: "Car added successfully"})

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: "Something went wrong"})
    } finally {
        // temporary file is always deleted
        if (req.file && req.file.path) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error("Error deleting temporary file:", unlinkError.message);
            }
        }
    }
} 

// API to list Owner Cars

export const getOwnerCars = async(req, res) => {
    try {
        const userId = req.user.id;
        const cars = await Car.find({owner: userId})
        res.status(200).json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: "Something went wrong"})
    }
}

// api to toggle car availavility


export const toggleCarAvailability = async (req, res) => {
    try {
        const userId = req.user.id;
        const { carId } = req.body;

        const updatedCar = await Car.findOneAndUpdate(
            { _id: carId, owner: userId }, // Find the car by ID and ensure the user is the owner
            { $not: { isAvailable: true } }, // Atomically toggle the isAvailable field
            { new: true } // Return the updated document
        );

        if (!updatedCar) {
            return res.status(404).json({ success: false, message: "Car not found or you are not authorized." });
        }

        res.status(200).json({
            success: true,
            message: `Car availability toggled to ${updatedCar.isAvailable}`,
            isAvailable: updatedCar.isAvailable
        });
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};



export const removeCarOwner = async (req, res) => {
    try {
        const userId = req.user.id;
        const { carId } = req.body;

        const updatedCar = await Car.findOneAndUpdate(
            { _id: carId, owner: userId }, // Find the car by ID and owner
            { $set: { owner: null, isAvailable: false } }, // Update the fields
            { new: true } // Return the updated document after the change
        );

        if (!updatedCar) {
            return res.status(404).json({ success: false, message: "Car not found or you are not authorized to modify it." });
        }

        res.status(200).json({
            success: true,
            message: "Car owner removed and unlisted successfully.",
            car: updatedCar
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

// initial handler
// API to get Dashboard data 


// export const getDashboardData = async(req, res) => {

//     try {

//         const { role } = req.user;

//          const userId = req.user.id



//         if (role !== "owner") {

//             return res.status(401).json({success: false, message: "Unauthorized"})

//         }

//            

//         const cars = await Car.find({owner: userId});

//         const bookings = await Booking.find({owner: userId}).sort({createdAt: -1});



//         const pendingBookings = await Booking.find({owner: userId, status: "pending"}).sort({createdAt: -1});



//         const completedBookings = await Booking.find({owner: userId, status: "confirmed"}).sort({createdAt: -1});



//         const monthlyRevenue = bookings.slice().filter((booking) => booking.status === "confirmed").reduce((acc, booking) => acc + booking.price, 0);



//         const dashboardData = {

//             totalCars: cars.length,

//             totalBookings: bookings.length,

//             pendingBookings: pendingBookings.length,

//             completedBookings: completedBookings.length,

//             recentBookings: bookings.slice(0, 3),

//             monthlyRevenue

//         }



//         res.status(200).json({success: true, dashboardData})





//     } catch (error) {

//         console.log(error.message);

//         return res.status(500).json({success: false, message: "Something went wrong"})

//     }

// }

// updated handler

export const getDashboardData = async (req, res) => {
    try {
        const { role, id: userId } = req.user;

        if (role !== "owner") {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Single aggregation pipeline to fetch all required data
        const [fetchDashboardData] = await Booking.aggregate([
            { $match: { owner: userId } },
            {
                $facet: {
                    "stats": [
                        {
                            $group: {
                                _id: null,
                                totalBookings: { $sum: 1 },
                                pendingBookings: {
                                    $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
                                },
                                completedBookings: {
                                    $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] }
                                },
                                monthlyRevenue: {
                                    $sum: {
                                        $cond: [{ $and: [{ $gte: ["$createdAt", startOfMonth] }, { $eq: ["$status", "confirmed"] }] }, "$price", 0]
                                    }
                                }
                            }
                        },
                        { $project: { _id: 0 } }
                    ],
                    "recentBookings": [
                        { $sort: { createdAt: -1 } },
                        { $limit: 3 }
                    ]
                }
            },
            {
                $project: {
                    totalBookings: { $arrayElemAt: ["$stats.totalBookings", 0] },
                    pendingBookings: { $arrayElemAt: ["$stats.pendingBookings", 0] },
                    completedBookings: { $arrayElemAt: ["$stats.completedBookings", 0] },
                    monthlyRevenue: { $arrayElemAt: ["$stats.monthlyRevenue", 0] },
                    recentBookings: "$recentBookings"
                }
            }
        ]);

        const totalCars = await Car.countDocuments({ owner: userId });

        const dashboardData = {
            totalCars: totalCars || 0,
            totalBookings: fetchDashboardData?.totalBookings || 0,
            pendingBookings: fetchDashboardData?.pendingBookings || 0,
            completedBookings: fetchDashboardData?.completedBookings || 0,
            monthlyRevenue: fetchDashboardData?.monthlyRevenue || 0,
            recentBookings: fetchDashboardData?.recentBookings || []
        };

        res.status(200).json({ success: true, dashboardData: dashboardData });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};


export const updateUserImage = async(req, res) => {
    try {
        const userId = req.user.id;
        const imageFile = req.file;

        //upload image to image kit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/users"
        })

        // optimization through imagekit URL transformation
        var optimizedImageURL = imagekit.url({
            path: response.filePath,
            transformation: [{width: 400}, {quality: 'auto'}, {format: 'webp'}]
        });

        const image = optimizedImageURL;

        await User.findByIdAndUpdate(userId, {image}, {new: true});

        res.status(200).json({success: true, image})
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: "Something went wrong"})
    }
}


import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyCarData } from '../assets/assets'
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import {motion} from 'motion/react'

const CarDetails = () => {

  const { id } = useParams();
  const {cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate} = useAppContext(); 
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const currency = import.meta.env.VITE_CURRENCY

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post('/api/booking/create-booking', {car: id, pickupDate, returnDate});
      if (data.success) {
        toast.success(data.message);
        navigate('/my-bookings');
      }else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    setCar(cars.find(car => car._id === id))
  }, [id, cars]);

  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
        <img src={assets.arrow_icon} alt="arrow" className='rotate-180 opacity-65'/>
        Back to all cars
      </button>

       <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        {/* Left: car image and details */}
        <motion.div
        initial={{y: 30, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{duration: 0.6}}
        className='lg:col-span-2'>
          <motion.img
          initial={{scale: 0.98, opacity: 0}}
          animate={{scale: 1, opacity: 1}}
          transition={{duration: 0.5}}
          src={car.image} alt="" className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md'/>
          <motion.div 
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.5, delay: 0.2}}
          className='space-y-6'>
            <div>
              <h1 className='text-3xl font-bold'>{car.brand} {car.model}</h1>
              <p className='text-gray-500 text-lg'>{car.category}  {car.year}</p>
            </div>
            <hr className='border-borderColor my-6'/>

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[
                {icon: assets.users_icon, text: `${car.seating_capacity} seats`},
                {icon: assets.fuel_icon, text: car.fuel_type},
                {icon: assets.car_icon, text: car.transmission},
                {icon: assets.location_icon, text: car.location},
              ].map((item, index) => (
                <motion.div
                 initial={{y: 10, opacity: 0}}
                 animate={{y: 0, opacity: 1}}
                 transition={{duration: 0.4}}
                 key={index} className='flex flex-col items-center bg-light p-4 rounded-lg'>
                  <img src={item.icon} alt="" className='h-5 mb-2'/>
                  {item.text}
                </motion.div>
              ))}
            </div>

            {/* Description */}
            <div className='mt-8'>
              <h2 className='text-xl font-medium mb-3'>Description</h2>
              <p className='text-gray-500'>{car.description}</p>
            </div>
            {/* features */}
            <div className='mt-8'>
              <h2 className='text-xl font-medium mb-3'>Features</h2>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {
                  ["360 Cemera", "Bluetooth", "GPS", "Heated Seates", "Rear View Mirror"].map((item)=> (
                    <li key={item} className='flex items-center text-gray-500'>
                      <img src={assets.check_icon} alt="" className='mr-2 h-4'/>
                      {item}
                    </li>
                  ))
                }
              </ul>
            </div>
          </motion.div>
        </motion.div>
          
        {/* Right : BOOKING  form  */}
        <motion.form 
         initial={{y: 30, opacity: 0}}
         animate={{y: 0, opacity: 1}}
         transition={{duration: 0.6, delay: 0.3}}
         onSubmit={handleSubmit} className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'>

          <p className='text-2xl font-semibold flex items-center justify-between text-gray-800'>{currency}{car.pricePerDay} <span className='text-gray-400 text-base font-normal'>per day</span></p>

          <hr className='border-borderColor border my-6'/>

          <div className='flex flex-col gap-2'>
            <label htmlFor="pickup-date">Pickup Date</label>
            <input value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} type="date" id='pickup-date' min={new Date().toISOString().split('T')[0]} className='border border-borderColor px-3 py-2 rounded-lg' required/>
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor="return-date">Return Date</label>
            <input value={returnDate} onChange={(e) => setReturnDate(e.target.value)} type="date" id='return-date' className='border border-borderColor px-3 py-2 rounded-lg' required/>
          </div>

          <button className='w-full bg-primary text-white py-2 rounded-xl font-medium hover:bg-primary-dull transition-all cursor-pointer'>Book Now</button>

          <p className='text-sm text-center'>No credit card required to reserv</p>

          {/* <div className='flex flex-col gap-2'>
            <label htmlFor="pickup-location">Pickup Location</label>
            <input type="text" id='pickup-location' className='border border-borderColor px-3 py-2 rounded-lg' required/>
          </div> */}

        </motion.form>
       </div>

    </div>
  ): <Loader />
}

export default CarDetails

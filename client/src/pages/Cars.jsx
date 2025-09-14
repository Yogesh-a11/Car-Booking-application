import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets, dummyCarData } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const Cars = () => {

  // getting seach params from url
  const [searchParams] = useSearchParams();

  const pickupDate = searchParams.get('pickupDate');
  const returnDate = searchParams.get('returnDate');
  const pickupLocation = searchParams.get('pickupLocation');

  const {cars, axios} = useAppContext();

  const [input, setInput] = useState('')

  const isSearchData = pickupLocation && pickupDate && returnDate;

  const [filtredCars, setFiltredCars] = useState([]);

  const searchCarAvailability = async() => {
    const {data} = await axios.post('/api/booking/check-availability', {pickupDate, returnDate, location: pickupLocation});

    if (data.success) {
      setFiltredCars(data.availableCars);
      if (data.availableCars.length === 0) {
        toast("No cars available for this date range");
      }
      return null
    }
  }

  const applyFilter = async() => {
    if (input === '') {
      setFiltredCars(cars);
      return null
    }

    const filtered = cars.slice.filter((car)=>{
      return car.brand.toLowerCase().includes(input.toLowerCase())
      || car.model.toLowerCase().includes(input.toLowerCase())
      || car.category.toLowerCase().includes(input.toLowerCase())
      || car.transmission.toLowerCase().includes(input.toLowerCase())
    })
    setFiltredCars(filtered);
  }

  useEffect(() => {
    if (isSearchData) {
      searchCarAvailability();
    } else {
      setFiltredCars(cars);
    }
  }, [isSearchData])

  useEffect(() => {
    cars.length > 0 && applyFilter();
  }, [input])

  return (
    <div className=''>
      <motion.div
      initial={{y: 30, opacity: 0}}
      animate={{y: 0, opacity: 1}}
      transition={{duration: 0.6, ease: 'easeOut'}}
      className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title title='Available Cars' subTitle='Browse our collection of premium vehicles available for your next adventure'/>

        <motion.div
        initial={{y: 20, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{duration: 0.5, delay: 0.3}}
        className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2'/>

          <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Search by brand, model, or category' className='w-full h-full text-gray-500 outline-none' />

          <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2'/>
        </motion.div>
      </motion.div>

      <motion.div
      initial={{ opacity: 0}}
      animate={{ opacity: 1}}
      transition={{duration: 0.5, delay: 0.6}}
      className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
        <p className='xl:px-20 max-w-7xl mx-auto text-gray-500'>Showing {filtredCars.length} Cars</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
          {filtredCars.map((car, index) => (
            <motion.div
            initial={{y: 20, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{duration: 0.4, delay: 0.1 * index}}
            key={index}>
              <CarCard car={car}/>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Cars

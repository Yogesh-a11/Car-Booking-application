import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';
const ManageBookings = () => {

  const { currency, token, isOwner, loading, setLoading, axios} = useAppContext();
  const [bookings, setBookings] = useState([])
 

  const fetchOwnerBooking = async() => {
    try {
      setLoading(true);
      const {data} = await axios.get('/api/booking/owner');
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const changeBookingStatus = async(bookingId, status) => {
    try {
      const {data} = await axios.post('/api/booking/change-status', {bookingId, status});
      if (data.success) {
        toast.success(data.message);
        fetchOwnerBooking();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
   if (isOwner && token) {
    
     fetchOwnerBooking();
    }
      
    
  },[])

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title="Manage Bookings" subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses"/>

      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Date Range</th>
              <th className='p-3 font-medium'>Total</th>
              <th className='p-3 font-medium max-md:hidden'>Payment</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id} className='border-t border-borderColor text-gray-500'> 

                <td className='p-3 flex items-center gap-3'>
                  <img src={booking.car.image} alt="" className='w-12 h-12 object-cover aspect-square rounded-md'/>
                  <p className='font-medium maz-md:hidden'>{booking.car.brand} {booking.car.model}</p>
                </td>

                <td className='p-3 max-md:hidden'>
                  {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}
                </td>
                <td className='p-3'>
                  {currency}{booking.price}
                </td>
                <td className='p-3 max-md:hidden'>
                  <span className='bg-gray-100 px-3 py-1 rounded-full text-xs' >offline</span>
                </td>
                <td className='p-3'>
                  {booking.status === "pending" ? (
                    <select onChange={(e) => changeBookingStatus(booking._id, e.target.value)} value={booking.status} className='px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md
                    online-none'>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cencelled</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === "confirmed" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"}`}>{booking.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageBookings

import React from 'react'

const Loader = () => {
  return (
    <div className='h-[80vh] flex items-center justify-center'>
      <div className='animate-spin rounded-full h-14 w-14 border-4 border-gray-300 border-t-primary'></div>
    </div>
  )
}

export default Loader

import React from 'react'

const Title = ({title, subTitle, align}) => {
  return (
    <div className={`flex flex-col justify-center items-center ${align === "left" && "md:items-start md:text-left"}`}>
      <h1 className='text-4xl md:text-[40px] font-semibold'>{title}</h1>
      <p className='text-sm text-gray-500/90 mt-2 md:text-base max-w-156'>{subTitle}</p>
    </div>
  )
}

export default Title

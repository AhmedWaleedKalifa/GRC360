import React from 'react'

function Progress({ title, footer, num, all }) {
    const percentage = (num / all) * 100
    return (
        <div className='flex flex-col gap-2 p-4 w-60 z-10'>
            <div className='font-medium'>{title}</div>
            <div className='w-full h-3 bg-[#22273A] rounded'>
                <div 
                  className='bg-teal h-3 rounded' 
                  style={{ width: `${percentage}%` }}>
                </div>
            </div>
            <div className='text-sm text-gray-300'>
              {num} of {all} {footer}
            </div>
        </div>
    )
}

export default Progress

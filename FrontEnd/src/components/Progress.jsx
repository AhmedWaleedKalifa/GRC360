import React from 'react'

function Progress({ title, footer, num, all }) {
    const percentage = (num / all) * 100
    return (
        <div className='progress cardStyle1 '>
            <div className='progressTitle'>{title}</div>
            <div className='progressContainer'>
                <div 
                  className='progressProgress' 
                  style={{ width: `${percentage}%` }}>
                </div>
            </div>
            <div className='progressFooter'>
              {num} of {all} {footer}
            </div>
        </div>
    )
}

export default Progress

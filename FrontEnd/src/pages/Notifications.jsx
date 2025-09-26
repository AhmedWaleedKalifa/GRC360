import { faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'


function Notification() {
  return (
      <>
        <div className='profile'>
        <h1>
                <FontAwesomeIcon icon={faBell} className="h1Icon" />
                Notifications
              
            </h1>
        </div>
      </>
  
    
  )
}

export default Notification
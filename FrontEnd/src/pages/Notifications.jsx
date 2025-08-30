import { faArrowLeftLong, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Card from '../components/Card'
import { Link } from 'react-router-dom'

function Notification() {
  return (
    <div className='w-full h-screen bg-navy flex flex-col '>
      <Link to="/dashboard">
        <FontAwesomeIcon icon={faArrowLeftLong} className='iconCircle bg-navy m-4' />
      </Link>
      <div className='container mx-auto '>
        <div className='font-bold text-4xl mb-5' >Notifications</div>
        <div className='flex flex-row items-center gap-4'>
          <Card title="Total Documents" value="6" />
          <Card title="Active" value="6" model={2} />
          <Card title="Expiring Soon" value="0" />
          <Card title="Pending Approval" value="0" model={2} />
        </div>
        <div className='flex flex-row items-center justify-between w-full '>
          <div className='text-ml '>Governance Items</div>
          <div className='button my-4 '>
            <FontAwesomeIcon icon={faPlus} className=' mr-1' />
            Add Item
          </div >
        </div>
      </div>
    </div>
  )
}

export default Notification
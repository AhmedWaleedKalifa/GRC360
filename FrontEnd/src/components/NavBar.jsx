import { faBell, faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import SearchBar from "./SearchBar"
import { Link } from 'react-router-dom'
function NavBar({active,open}) {
  
    return (
        <nav
  className={`sticky min-h-20 h-20 ${open?"pl-68":"pl-24"} flex flex-row items-center justify-between 
  bg-gradient-to-br bg-navy from-black/40 via-transparent to-white/5 backdrop-blur-md shadow-xl px-8
`}

>
  <SearchBar active={active} />
  <div className='w-[50%] h-full flex flex-row items-center justify-end px-8'>
    <Link to="/notifications" title="Notifications">
      <FontAwesomeIcon icon={faBell} className='iconCircle mr-2.5' />
    </Link>
    <Link to="/profile" title="Profile">
      <FontAwesomeIcon icon={faCircleUser} className='iconCircle' />
    </Link>
  </div>
</nav>


    )
}

export default NavBar
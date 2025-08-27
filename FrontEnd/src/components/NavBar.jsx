import { faBell, faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import SearchBar from "./SearchBar"
import { Link } from 'react-router-dom'
function NavBar({active}) {
    return (
        <div className="shrink-0 h-18 w-full flex flex-row items-center justify-between bg-gradient-to-br from-black/40 via-transparent to-white/5 backdrop-blur-md shadow-xl px-4">
            <SearchBar active={active} />
            <div className='w-[50%] h-full flex flex-row items-center justify-end  px-8'>
                <Link to="/dashboard/notifications">

                    <FontAwesomeIcon icon={faBell} className='iconCircle mr-2.5' />
                </Link>
                <Link to="/dashboard/profile">
                    <FontAwesomeIcon icon={faCircleUser} className='iconCircle ' />

                </Link>
            </div>
        </div>

    )
}

export default NavBar
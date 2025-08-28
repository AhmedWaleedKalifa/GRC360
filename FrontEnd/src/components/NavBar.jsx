import { faBell, faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import SearchBar from "./SearchBar"
import { Link } from 'react-router-dom'
function NavBar({active}) {
    return (
        <nav className="sticky shrink-0 min-h-20 h-20 w-full flex flex-row items-center justify-between bg-gradient-to-br bg-navy from-black/40 via-transparent to-white/5 backdrop-blur-md shadow-xl px-4 ">
            <SearchBar active={active} />
            <div className='w-[50%] h-full flex flex-row items-center justify-end  px-8'>
                <Link to="/notifications" title="Notifications">

                    <FontAwesomeIcon icon={faBell} className='iconCircle mr-2.5'  />
                </Link>
                <Link to="/profile" title="Profile">
                    <FontAwesomeIcon icon={faCircleUser} className='iconCircle '  />

                </Link>
            </div>
        </nav>

    )
}

export default NavBar
import { faBell, faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import SearchBar from "./SearchBar"
import { Link } from 'react-router-dom'
function NavBar({active,open}) {
    const [width,setWidth]=useState();
    useEffect(() => {
        const handleScroll = () => {
          setWidth(window.innerWidth);
    
        };
        window.addEventListener("New width", handleScroll);
    
        return () => {
          window.removeEventListener("New width", handleScroll);
        };
      }, []);
    return (
        <nav
  className={`sticky shrink-0 min-h-20 h-20 flex flex-row items-center justify-between 
  bg-gradient-to-br bg-navy from-black/40 via-transparent to-white/5 backdrop-blur-md shadow-xl px-4 
`}
  style={{ 
    width: `${open?width-256:width-88}px`, 
    marginLeft: open ? "256px" : "88px" 
  }}
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
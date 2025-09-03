import { faBell, faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SearchBar from "./SearchBar"
import { Link } from 'react-router-dom'
function NavBar({ active, open }) {

  return (
    <>

      <nav style={{paddingLeft:`${open ? "272" : "96"}px`}}>
        <SearchBar active={active} />
        <h2>Hello User!</h2>
        <div className='navContainer'>
          <Link to="/pages/notifications" title="Notifications">
            <FontAwesomeIcon icon={faBell} className='iconCircle' />
          </Link>
          <Link to="/pages/profile" title="Profile">
            <FontAwesomeIcon icon={faCircleUser} className='iconCircle' />
          </Link>
        </div>
      </nav>

    </>
  )
}

export default NavBar
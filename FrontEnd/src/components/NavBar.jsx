// components/NavBar.jsx
import { faBell, faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SearchBar from "./SearchBar"
import { Link } from 'react-router-dom'

function NavBar({ active, open, onSearch }) {
  return (
    <>
      <nav style={{paddingLeft: `${!open ? "272" : "96"}px`}}>
        <SearchBar active={active} onSearch={onSearch} />
        <h2>Hello User!</h2>
        <div className="navContainer">
          <Link to="/pages/notifications" title="Notifications">
            <FontAwesomeIcon icon={faBell} className="iconCircle hover:bg-gray-300/80 dark:hover:bg-gray-700/80 transition-colors" />
          </Link>
          <Link to="/pages/profile" title="Profile">
            <FontAwesomeIcon icon={faCircleUser} className="iconCircle hover:bg-gray-300/80 dark:hover:bg-gray-700/80 transition-colors" />
          </Link>
        </div>
      </nav>
    </>
  )
}

export default NavBar
// components/NavBar.jsx
import { faBell, faCircleUser, faChevronDown, faSync } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SearchBar from "./SearchBar"
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { authAPI } from '../services/api'

function NavBar({ active, open, onSearch }) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const [unreadCount] = useState(0);

  const currentUser = authAPI.getCurrentUser();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Role display configuration with your color scheme
  const roleConfig = {
    admin: {
      label: 'Administrator',
      color: 'blue',
      badge: 'Admin',
      bgLight: 'bg-blue-500/20',
      textLight: 'text-blue-700',
      bgDark: 'dark:bg-blue-900/30',
      textDark: 'dark:text-blue-300',
      borderLight: 'border-blue-200',
      borderDark: 'dark:border-blue-700'
    },
    moderator: {
      label: 'Moderator',
      color: 'purple',
      badge: 'Moderator',
      bgLight: 'bg-purple-500/20',
      textLight: 'text-purple-700',
      bgDark: 'dark:bg-purple-900/30',
      textDark: 'dark:text-purple-300',
      borderLight: 'border-purple-200',
      borderDark: 'dark:border-purple-700'
    },
    user: {
      label: 'User',
      color: 'green',
      badge: 'User',
      bgLight: 'bg-green-500/20',
      textLight: 'text-green-700',
      bgDark: 'dark:bg-green-900/30',
      textDark: 'dark:text-green-300',
      borderLight: 'border-green-200',
      borderDark: 'dark:border-green-700'
    },
    guest: {
      label: 'Guest',
      color: 'gray',
      badge: 'Guest',
      bgLight: 'bg-gray-500/20',
      textLight: 'text-gray-700',
      bgDark: 'dark:bg-gray-700/30',
      textDark: 'dark:text-gray-300',
      borderLight: 'border-gray-200',
      borderDark: 'dark:border-gray-600'
    }
  };

  const userConfig = currentUser ? roleConfig[currentUser.role] : roleConfig.user;

  return (
    <nav
      style={{ paddingLeft: `${!open ? "272px" : "96px"}` }}
      className="bg-gray-200 dark:bg-gray-800 shadow-sm border-b border-gray-300/40 dark:border-gray-700/40 transition-all duration-300"
    >
      <div className="flex flex-row w-full h-full items-center justify-between p-4">
        {/* Left side - Search Bar */}
        <div className="flex-1 max-w-md">
          <SearchBar active={active} onSearch={onSearch} />
        </div>

        {/* Right side - User info and dropdown */}
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 hidden md:block">
            Hello, {currentUser?.user_name || currentUser?.name}!
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${userConfig.bgLight} ${userConfig.textLight} ${userConfig.bgDark} ${userConfig.textDark} border ${userConfig.borderLight} ${userConfig.borderDark}`}>
              {userConfig.badge}
            </span>
          </h2>

          {/* User Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-3 px-4 py-2 bg-gray-200 dark:bg-gray-700 border border-gray-300/40 dark:border-gray-600/40 rounded-lg hover:bg-gray-300/80 dark:hover:bg-gray-600/80 transition-all duration-200 shadow-sm"
              disabled={loading}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full bg-green-500`}></div>
                <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
                  {currentUser?.user_name || currentUser?.name}
                </span>
              </div>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-gray-500 dark:text-gray-400 transition-all duration-200 ${showUserDropdown ? 'rotate-180' : ''}`}
                size="xs"
              />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-200 dark:bg-gray-800 border border-gray-300/40 dark:border-gray-700/40 rounded-lg shadow-xl z-50 transform opacity-100 scale-100 transition-all duration-200 cardStyle1">
                <div className="p-4 border-b border-gray-300/40 dark:border-gray-700/40">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white text-sm">User Profile</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Signed in as {currentUser?.user_name}</p>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${userConfig.bgLight} ${userConfig.textLight} ${userConfig.bgDark} ${userConfig.textDark} border ${userConfig.borderLight} ${userConfig.borderDark}`}>
                      {userConfig.badge}
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-sm`}>
                        {(currentUser?.user_name || currentUser?.name)?.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-800 dark:text-white text-sm">
                        {currentUser?.user_name || currentUser?.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {currentUser?.email}
                      </div>
                      {currentUser?.job_title && (
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {currentUser?.job_title}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-gray-600 dark:text-gray-400">User ID:</div>
                    <div className="text-gray-800 dark:text-gray-200 font-mono">{currentUser?.user_id}</div>
                    
                    <div className="text-gray-600 dark:text-gray-400">Last Login:</div>
                    <div className="text-gray-800 dark:text-gray-200">
                      {currentUser?.last_login ? new Date(currentUser.last_login).toLocaleDateString() : 'Never'}
                    </div>
                    
                    <div className="text-gray-600 dark:text-gray-400">Status:</div>
                    <div className="text-green-600 dark:text-green-400">Active</div>
                  </div>
                </div>

                <div className="p-3 border-t border-gray-300/40 dark:border-gray-700/40 bg-gray-300/50 dark:bg-gray-700/50 rounded-b-lg space-y-2">
                  <Link
                    to="/pages/profile"
                    className="w-full flex items-center justify-center py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors duration-200 text-sm text-gray-700 dark:text-gray-300"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <FontAwesomeIcon icon={faCircleUser} className="mr-2" />
                    View Profile
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center py-2 px-4 bg-red-900/20 hover:bg-red-900/30 dark:bg-red-900/30 dark:hover:bg-red-900/40 rounded-md transition-colors duration-200 text-sm text-red-900 dark:text-red-100 border border-red-900/30 dark:border-red-900/50"
                  >
                    <FontAwesomeIcon icon={faSync} className="mr-2 transform rotate-180" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notification and Profile Icons */}
          <div className="flex items-center space-x-3">
            <Link
              to="/pages/notifications"
              title="Notifications"
              className="relative p-2 rounded-lg hover:bg-gray-300/80 dark:hover:bg-gray-700/80 transition-colors duration-200"
            >
              <FontAwesomeIcon
                icon={faBell}
                className="text-gray-600 dark:text-gray-300 text-lg"
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-200 dark:border-gray-800"></span>
              )}
            </Link>
            <Link
              to="/pages/profile"
              title="Profile"
              className="p-2 rounded-lg hover:bg-gray-300/80 dark:hover:bg-gray-700/80 transition-colors duration-200"
            >
              <FontAwesomeIcon
                icon={faCircleUser}
                className="text-gray-600 dark:text-gray-300 text-xl"
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
// components/NavBar.jsx
import { faBell, faCircleUser, faChevronDown, faSync } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SearchBar from "./SearchBar"
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useUser } from '../hooks/useUser'

function NavBar({ active, open, onSearch }) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const { 
    currentUser, 
    users, 
    loading, 
    error, 
    permissions, 
    changeCurrentUser, 
    refreshUsers 
  } = useUser();

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

  const handleUserChange = (user) => {
    changeCurrentUser(user);
    setShowUserDropdown(false);
    window.location.reload();
  }

  const handleRefreshUsers = async () => {
    await refreshUsers();
  };

  // Group users by role for display
  const usersByRole = {
    admin: users.filter(user => user.role === 'admin'),
    moderator: users.filter(user => user.role === 'moderator'),
    user: users.filter(user => user.role === 'user'),
    guest: users.filter(user => user.role === 'guest')
  };

  // Role display configuration
  const roleConfig = {
    admin: { label: 'Administrators', color: 'blue', badge: 'Admin' },
    moderator: { label: 'Moderators', color: 'purple', badge: 'Moderator' },
    user: { label: 'Users', color: 'green', badge: 'User' },
    guest: { label: 'Guests', color: 'gray', badge: 'Guest' }
  };

  return (
    <nav 
      style={{ paddingLeft: `${!open ? "272px" : "96px" }` }} 
      className=" bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 "
    >
      <div className="flex flex-row w-full h-full items-center justify-between p-4">
        {/* Left side - Search Bar */}
        <div className="flex-1 max-w-md">
          <SearchBar active={active} onSearch={onSearch} />
        </div>
        
        {/* Right side - User info and dropdown */}
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white hidden md:block">
            Hello, {currentUser?.name}!
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
              currentUser?.role === 'admin' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                : currentUser?.role === 'moderator'
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {currentUser?.role}
            </span>
          </h2>
          
          {/* User Selector Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button 
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-3 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm"
              disabled={loading}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  currentUser?.is_active === false ? 'bg-red-500' : 'bg-green-500'
                }`}></div>
                <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
                  {loading ? 'Loading...' : currentUser?.name}
                </span>
              </div>
              <FontAwesomeIcon 
                icon={loading ? faSync : faChevronDown} 
                className={`text-gray-500 transition-all duration-200 ${
                  showUserDropdown ? 'rotate-180' : ''
                } ${loading ? 'animate-spin' : ''}`}
                size="xs"
              />
            </button>
            
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 transform opacity-100 scale-100 transition-all duration-200">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Switch User Account</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Current: {currentUser?.name}</p>
                    </div>
                    <button 
                      onClick={handleRefreshUsers}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Refresh users"
                    >
                      <FontAwesomeIcon icon={faSync} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {Object.entries(roleConfig).map(([role, config]) => (
                    usersByRole[role]?.length > 0 && (
                      <div key={role} className="p-3 border-t border-gray-100 dark:border-gray-700 first:border-t-0">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className={`w-2 h-2 rounded-full bg-${config.color}-500`}></div>
                          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            {config.label}
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {usersByRole[role].map(user => (
                            <button
                              key={user.id}
                              onClick={() => handleUserChange(user)}
                              disabled={user.is_active === false}
                              className={`w-full flex items-center justify-between p-3 text-left rounded-md transition-all duration-150 ${
                                currentUser?.id === user.id 
                                  ? `bg-${config.color}-50 dark:bg-${config.color}-900/30 border border-${config.color}-200 dark:border-${config.color}-700` 
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent'
                              } ${user.is_active === false ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-${config.color}-400 to-${config.color}-600 flex items-center justify-center text-white font-bold shadow-sm`}>
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                </div>
                                <div className="text-left">
                                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                                    {user.name}
                                    {user.is_active === false && (
                                      <span className="ml-2 text-xs text-red-500">(Inactive)</span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {user.email}
                                  </div>
                                  {user.job_title && (
                                    <div className="text-xs text-gray-400 dark:text-gray-500">
                                      {user.job_title}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full bg-${config.color}-100 text-${config.color}-800 dark:bg-${config.color}-900 dark:text-${config.color}-200 font-medium shadow-sm`}>
                                {config.badge}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
                
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {permissions.isAdmin ? 'Full administrative access' : 
                     permissions.isModerator ? 'Moderator access' : 
                     'Limited access permissions'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Notification and Profile Icons */}
          <div className="flex items-center space-x-3">
          <Link 
  to="/pages/notifications" 
  title="Notifications" 
  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
>
  <FontAwesomeIcon 
    icon={faBell} 
    className="text-gray-600 dark:text-gray-300 text-lg" 
  />
  {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
  )}
</Link>
            <Link 
              to="/pages/profile" 
              title="Profile" 
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
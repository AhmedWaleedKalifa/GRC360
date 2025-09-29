import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faSync, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { useUser } from '../hooks/useUser'

function Login() {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const {
    currentUser,
    users,
    loading,
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

  const handleUserChange = async (user) => {
    if (user.is_active === false) {
      setLoginError('Cannot select inactive user');
      return;
    }
    
    try {
      await changeCurrentUser(user);
      setShowUserDropdown(false);
      setLoginError('');
      console.log('User changed to:', user.name); // Debug log
    } catch (error) {
      console.error('Error changing user:', error);
      setLoginError('Failed to select user');
    }
  }

  const handleRefreshUsers = async () => {
    try {
      await refreshUsers();
    } catch (error) {
      console.error('Error refreshing users:', error);
      setLoginError('Failed to refresh users');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setLoginError('Please select a user account to continue');
      return;
    }
    
    if (currentUser.is_active === false) {
      setLoginError('Cannot log in with inactive user account');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      console.log('Logging in with user:', currentUser); // Debug log
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        navigate('/app/dashboard');
        setIsLoggingIn(false);
      }, 100);
      
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
      setIsLoggingIn(false);
    }
  };

  // Debug current user state
  useEffect(() => {
    console.log('Current user updated:', currentUser);
  }, [currentUser]);

  // Group users by role for display
  const usersByRole = {
    admin: users.filter(user => user.role === 'admin'),
    moderator: users.filter(user => user.role === 'moderator'),
    user: users.filter(user => user.role === 'user'),
    guest: users.filter(user => user.role === 'guest')
  };

  // Role display configuration
  const roleConfig = {
    admin: {
      label: 'Administrators',
      color: 'blue',
      badge: 'Admin',
      bgLight: 'bg-blue-100',
      textLight: 'text-blue-800',
      bgDark: 'dark:bg-blue-900',
      textDark: 'dark:text-blue-200',
      gradientFrom: 'from-blue-400',
      gradientTo: 'to-blue-600',
      borderLight: 'border-blue-200',
      borderDark: 'dark:border-blue-700'
    },
    moderator: {
      label: 'Moderators',
      color: 'purple',
      badge: 'Moderator',
      bgLight: 'bg-purple-100',
      textLight: 'text-purple-800',
      bgDark: 'dark:bg-purple-900',
      textDark: 'dark:text-purple-200',
      gradientFrom: 'from-purple-400',
      gradientTo: 'to-purple-600',
      borderLight: 'border-purple-200',
      borderDark: 'dark:border-purple-700'
    },
    user: {
      label: 'Users',
      color: 'green',
      badge: 'User',
      bgLight: 'bg-green-100',
      textLight: 'text-green-800',
      bgDark: 'dark:bg-green-900',
      textDark: 'dark:text-green-200',
      gradientFrom: 'from-green-400',
      gradientTo: 'to-green-600',
      borderLight: 'border-green-200',
      borderDark: 'dark:border-green-700'
    },
    guest: {
      label: 'Guests',
      color: 'gray',
      badge: 'Guest',
      bgLight: 'bg-gray-100',
      textLight: 'text-gray-800',
      bgDark: 'dark:bg-gray-700',
      textDark: 'dark:text-gray-200',
      gradientFrom: 'from-gray-400',
      gradientTo: 'to-gray-600',
      borderLight: 'border-gray-200',
      borderDark: 'dark:border-gray-600'
    }
  };

  const getCurrentUserRoleClasses = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'moderator':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'user':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const isLoginDisabled = !currentUser || currentUser.is_active === false || isLoggingIn;

  return (
    <div className="login">
      <div className="loginContainer">
        <img src="/logoL.png" alt="logo" className="loginLogo" title="المستشار الرقمي GRC360" />
        <div className='form'>
          <h2 className="formTitle">Select User Account</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 text-center">
            Choose your account to access the GRC360 Dashboard
          </p>
          
          <div className='flex flex-col items-center justify-center w-full gap-4'>
            <div className="flex flex-col items-center gap-2 w-full">
              {/* Current User Display */}
              {currentUser && (
                <div className="text-center mb-2">
                  <span className={`px-3 py-1 text-sm rounded-full ${getCurrentUserRoleClasses(currentUser.role)}`}>
                    {currentUser.role}
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Selected: {currentUser.name}
                  </p>
                </div>
              )}

              {/* User Selector Dropdown */}
              <div ref={dropdownRef} className="relative w-full max-w-xs">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className={`flex items-center justify-between w-full px-4 py-3 bg-white dark:bg-gray-800 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm ${
                    loginError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  disabled={loading}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      !currentUser ? 'bg-gray-400' : 
                      currentUser.is_active === false ? 'bg-red-500' : 'bg-green-500'
                    }`}></div>
                    <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
                      {loading ? 'Loading...' : currentUser?.name || 'Select a user account...'}
                    </span>
                  </div>
                  <FontAwesomeIcon
                    icon={loading ? faSync : faChevronDown}
                    className={`text-gray-500 dark:text-gray-400 transition-all duration-200 ${showUserDropdown ? 'rotate-180' : ''} ${loading ? 'animate-spin' : ''}`}
                    size="xs"
                  />
                </button>

                {/* Error Message */}
                {loginError && (
                  <div className="text-red-500 text-sm mt-2 text-center w-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                    {loginError}
                  </div>
                )}

                {showUserDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Select User Account</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {currentUser ? `Current: ${currentUser.name}` : 'No user selected'}
                          </p>
                        </div>
                        <button
                          onClick={handleRefreshUsers}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          title="Refresh users"
                        >
                          <FontAwesomeIcon
                            icon={faSync}
                            className={`text-gray-500 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
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
                                  className={`w-full flex items-center justify-between p-3 text-left rounded-md transition-all duration-150 border ${
                                    currentUser?.id === user.id
                                      ? `${config.bgLight} ${config.textLight} ${config.bgDark} ${config.textDark} ${config.borderLight} ${config.borderDark}`
                                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-transparent'
                                  } ${user.is_active === false ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} flex items-center justify-center text-white font-bold shadow-sm`}>
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
                                  <span className={`px-2 py-1 text-xs rounded-full ${config.bgLight} ${config.textLight} ${config.bgDark} ${config.textDark} font-medium shadow-sm`}>
                                    {config.badge}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoginDisabled}
              className={`button w-full max-w-xs ${
                isLoginDisabled 
                  ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400' 
                  : 'buttonStyle'
              } ${isLoggingIn ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isLoggingIn ? (
                <>
                  <FontAwesomeIcon icon={faSync} className="animate-spin mr-2" />
                  Logging in...
                </>
              ) : isLoginDisabled ? (
                'Select User to Continue'
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
//
export default Login
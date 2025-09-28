import { faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUser'

function Notification() {
  const { currentUser, loading } = useUser()
  const [notifications, setNotifications] = useState([])
  const [lastLogin, setLastLogin] = useState('')

  // Load notifications and user info
  useEffect(() => {
    // Simulate loading notifications
    const loadNotifications = async () => {
      // In a real app, you would fetch from an API
      const mockNotifications = [
        {
          id: 1,
          title: 'Welcome to GRC360',
          message: `You are currently logged in as ${currentUser?.name}`,
          type: 'info',
          timestamp: new Date().toISOString(),
          read: true
        },
        {
          id: 2,
          title: 'System Update',
          message: 'New security features have been deployed',
          type: 'system',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          read: true
        }
      ]
      setNotifications(mockNotifications)
    }

    if (currentUser) {
      loadNotifications()

      // Get last login time from localStorage or use current time
      const userLastLogin = currentUser.last_login || new Date().toISOString()
      setLastLogin(new Date(userLastLogin).toLocaleString())
    }
  }, [currentUser])

  // Mark all notifications as read when page loads
  useEffect(() => {
    // This will remove the red dot from the navbar
    const markAllAsRead = () => {
      // You could call an API here to mark notifications as read
      console.log('All notifications marked as read')
    }

    markAllAsRead()
  }, [])

  if (loading) {
    return (
      <div className="profile">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className='profile'>
     <div className='flex flex-col  justify-center col-span-4'>
     <h1 className="flex items-center gap-3 mb-6">
        <FontAwesomeIcon icon={faBell} className="h1Icon" />
        Notifications
      </h1>

      {/* User Login Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <h3 className="font-semibold text-blue-800">You are logged in</h3>
            <p className="text-blue-600 text-sm">
              <strong>User:</strong> {currentUser?.name} ({currentUser?.role})
            </p>
            <p className="text-blue-600 text-sm">
              <strong>Email:</strong> {currentUser?.email}
            </p>
            {lastLogin && (
              <p className="text-blue-600 text-sm">
                <strong>Session started:</strong> {lastLogin}
              </p>
            )}
          </div>
        </div>
      </div>
     </div>


    </div>
  )
}

export default Notification
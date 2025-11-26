// hooks/useUser.js
import { useState, useEffect, useCallback } from "react";
import { usersAPI } from "../services/api";

export const useUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Fetch all users from database
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const usersData = await usersAPI.getAll();

      // Transform the database data to match our expected format
      const transformedUsers = usersData.map((user) => ({
        id: user.user_id,
        user_id: user.user_id, // Add this for consistency
        user_name: user.user_name, // Add this
        name: user.user_name,
        role: user.role,
        email: user.email,
        job_title: user.job_title,
        phone: user.phone,
        is_active: user.is_active,
        last_login: user.last_login,
      }));

      setUsers(transformedUsers);
      setError(null);
      return transformedUsers;
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
      const fallbackUsers = getFallbackUsers();
      setUsers(fallbackUsers);
      return fallbackUsers;
    } finally {
      setLoading(false);
    }
  }, []);

  // NEW: Function to refresh the current user data
  const refreshCurrentUser = useCallback(async () => {
    if (!currentUser?.id) return;

    try {
      const updatedUser = await usersAPI.getById(currentUser.id);
      if (updatedUser) {
        const transformedUser = {
          id: updatedUser.user_id,
          user_id: updatedUser.user_id,
          user_name: updatedUser.user_name,
          name: updatedUser.user_name,
          role: updatedUser.role,
          email: updatedUser.email,
          job_title: updatedUser.job_title,
          phone: updatedUser.phone,
          is_active: updatedUser.is_active,
          last_login: updatedUser.last_login,
        };

        setCurrentUser(transformedUser);
        localStorage.setItem("currentUser", JSON.stringify(transformedUser));

        // Also update the users list
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === currentUser.id ? transformedUser : user
          )
        );

        return transformedUser;
      }
    } catch (err) {
      console.error("Error refreshing current user:", err);
    }
  }, [currentUser?.id]);

  // Fallback users in case API fails
  const getFallbackUsers = () => {
    return [
      {
        id: 1,
        user_id: 1,
        user_name: "Ahmed Waleed",
        name: "Ahmed Waleed",
        role: "admin",
        email: "ahmed.waleed@company.com",
        job_title: "Admin",
        phone: "01000000000",
      },
      // ... other users
    ];
  };

  // Initialize current user from localStorage or database
  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true);

        // First, try to get current user from localStorage
        const savedUser = localStorage.getItem("currentUser");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setCurrentUser(parsedUser);
        }

        // Then fetch users from database
        const usersData = await fetchUsers();

        // If no current user is set, default to first active admin
        if (!savedUser && usersData.length > 0) {
          const defaultUser =
            usersData.find(
              (user) => user.role === "admin" && user.is_active !== false
            ) ||
            usersData.find((user) => user.is_active !== false) ||
            usersData[0];

          if (defaultUser) {
            setCurrentUser(defaultUser);
            localStorage.setItem("currentUser", JSON.stringify(defaultUser));
          }
        }
      } catch (err) {
        console.error("Error initializing user:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [fetchUsers]);

  // Get user permissions
  const getUserPermissions = useCallback(() => {
    if (!currentUser) return {};

    return {
      canCreate: ["admin", "moderator"].includes(currentUser.role),
      canEdit: ["admin", "moderator"].includes(currentUser.role),
      canDelete: currentUser.role === "admin",
      canView: true,
      isAdmin: currentUser.role === "admin",
      isModerator: currentUser.role === "moderator",
      isUser: currentUser.role === "user",
      isGuest: currentUser.role === "guest",
      isViewer: ["user", "guest"].includes(currentUser.role),
    };
  }, [currentUser]);

  // Change current user
  const changeCurrentUser = useCallback((user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));

    // Trigger storage event for other tabs
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "currentUser",
        newValue: JSON.stringify(user),
      })
    );
  }, []);

  return {
    // State
    currentUser,
    users,
    loading,
    error,

    // Permissions
    permissions: getUserPermissions(),

    // Actions
    changeCurrentUser,
    refreshUsers: fetchUsers,
    refreshUser: refreshCurrentUser, // Add the new refresh function

    // Helper functions
    setCurrentUser: changeCurrentUser,
  };
};

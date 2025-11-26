// pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' // Fixed to 'user' role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (authAPI.isAuthenticated()) {
      navigate('/app/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      // role is automatically set to 'user' - no need to send it
      const response = await authAPI.register(registerData);
      console.log('Registration successful:', response);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="loginContainer">
        <div className="loginLogo">
          <img src="/logo.png" alt="GRC360 Logo" className="bigLogo" />
        </div>
        
        <div className="form cardStyle1">
          <h1 className="formTitle">Create your account</h1>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
            Or{' '}
            <Link
              to="/"
              className="font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              sign in to your existing account
            </Link>
          </p>

          <form className="w-full" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/20 border border-red-900/30 text-red-900 dark:text-red-100 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="inputContainer">
              <label htmlFor="name" className="label">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="Enter your full name"
              />
            </div>

            <div className="inputContainer">
              <label htmlFor="email" className="label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="Enter your email"
              />
            </div>

            {/* Role selection removed - all users register as 'user' */}

            <div className="inputContainer">
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="Enter your password (min 6 characters)"
              />
            </div>

            <div className="inputContainer">
              <label htmlFor="confirmPassword" className="label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="Confirm your password"
              />
            </div>

            <div className="text-xs text-gray-600 dark:text-gray-400 mb-4 p-3 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg">
              <strong>Note:</strong> All new accounts are created as <span className="font-semibold text-blue-600 dark:text-blue-400">User</span> role. 
              Administrator privileges can only be granted by existing administrators.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="formButton buttonStyle"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="loginSpanContainer mt-4">
            <span className="loginSpanText text-gray-600 dark:text-gray-400">
              Secure GRC Management Platform
            </span>
            <span className="loginSpan">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
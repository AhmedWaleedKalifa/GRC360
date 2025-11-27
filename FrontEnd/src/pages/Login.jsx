// pages/Login.jsx - FIXED
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import EmailVerificationModal from '../components/EmailVerificationModal';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      
      if (response.requires_verification) {
        // Show verification modal for unverified email
        setUnverifiedEmail(formData.email);
        setShowVerificationModal(true);
      } else {
        // Successful login
        navigate('/app/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Remove manual storage
  const handleVerificationSuccess = () => {
    setShowVerificationModal(false);
    navigate('/app/dashboard');
  };

  const handleVerificationClose = () => {
    setShowVerificationModal(false);
  };

  return (
    <div className="login">
      <div className="loginContainer">
        <div className="loginLogo">
          <img src="/logo.png" alt="GRC360 Logo" className="bigLogo" />
        </div>
        
        <div className="form cardStyle1">
          <h1 className="formTitle">Sign in to your account</h1>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              create a new account
            </Link>
          </p>

          <form className="w-full" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/20 border border-red-900/30 text-red-900 dark:text-red-100 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

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

            <div className="inputContainer">
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="Enter your password"
              />
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
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="loginSpanContainer">
            <span className="loginSpanText text-gray-600 dark:text-gray-400">
              Secure GRC Management Platform
            </span>
            <span className="loginSpan">
              v1.0.0
            </span>
          </div>
        </div>
      </div>

      {/* Email Verification Modal for unverified login */}
      {showVerificationModal && (
        <EmailVerificationModal
          email={unverifiedEmail}
          onSuccess={handleVerificationSuccess}
          onClose={handleVerificationClose}
        />
      )}
    </div>
  );
};

export default Login;
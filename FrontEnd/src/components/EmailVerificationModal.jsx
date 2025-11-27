// components/EmailVerificationModal.jsx - FIXED
import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const EmailVerificationModal = ({ email, onSuccess, onClose }) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`verification-code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`verification-code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

// components/EmailVerificationModal.jsx - FIXED handleVerify function
const handleVerify = async () => {
  const code = verificationCode.join('');
  if (code.length !== 6) {
    setError('Please enter the 6-digit verification code');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const response = await authAPI.verifyEmail(email, code);
    
    if (response.user?.email_verified) {
      setSuccess(true);
      
      // FIXED: The auth data is already stored by authAPI.verifyEmail
      // Just call onSuccess without passing data
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      throw new Error('Email verification failed');
    }
  } catch (err) {
    setError(err.message || 'Verification failed. Please try again.');
    // Clear the code on error
    setVerificationCode(['', '', '', '', '', '']);
    // Focus first input
    const firstInput = document.getElementById('verification-code-0');
    if (firstInput) firstInput.focus();
  } finally {
    setLoading(false);
  }
};
  const handleResendCode = async () => {
    setResendLoading(true);
    setError('');

    try {
      await authAPI.resendVerificationCode(email);
      setCountdown(60); // 60 seconds countdown
      setError(''); // Clear any previous errors
    } catch (err) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const fullCode = verificationCode.join('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ zIndex: 1000 }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md relative">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {success ? 'Email Verified!' : 'Verify Your Email'}
          </h2>

          {!success ? (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We sent a 6-digit verification code to <strong>{email}</strong>. 
                Enter the code below to verify your email address.
              </p>

              {error && (
                <div className="bg-red-900/20 border border-red-900/30 text-red-900 dark:text-red-100 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="flex justify-center space-x-2 mb-6">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`verification-code-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleVerify}
                  disabled={loading || fullCode.length !== 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    'Verify Email'
                  )}
                </button>

                <div className="text-center">
                  <button
                    onClick={handleResendCode}
                    disabled={resendLoading || countdown > 0}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {resendLoading ? 'Sending...' : countdown > 0 ? `Resend code in ${countdown}s` : 'Resend verification code'}
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="py-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your email has been successfully verified!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Redirecting to dashboard...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
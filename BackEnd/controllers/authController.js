// controllers/authController.js
const { generateToken, hashPassword, comparePassword } = require('../utils/auth');
const { getUserByEmail, addUser, updateUserVerification, verifyUserEmail } = require('../db/queries/users');
const { logAction, logSystemAction } = require('./auditHelper');
const { sendVerificationEmail } = require('../utils/emailService');
const { generateVerificationCode, generateExpirationTime, isCodeExpired } = require('../utils/verificationCode');

// Send verification code endpoint
const sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const user = await getUserByEmail(email);

    if (!user) {
      await logSystemAction('VERIFICATION_CODE_FAILED', 'user', null, {
        reason: 'User not found',
        email,
        ip: req.ip
      });
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is already verified
    if (user.email_verified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Generate verification code and expiration
    const verificationCode = generateVerificationCode();
    const expirationTime = generateExpirationTime();

    // Save verification code to database
    await updateUserVerification(user.user_id, verificationCode, expirationTime);

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    // Log the action
    await logSystemAction('VERIFICATION_CODE_SENT', 'user', user.user_id, {
      email,
      ip: req.ip,
      expires_at: expirationTime
    });

    res.status(200).json({
      message: 'Verification code sent to your email',
      expires_in: '15 minutes'
    });
  } catch (error) {
    console.error('Send verification code error:', error);
    
    await logSystemAction('VERIFICATION_CODE_ERROR', 'user', null, {
      error: error.message,
      email: req.body?.email,
      ip: req.ip
    });
    
    res.status(500).json({ error: 'Failed to send verification code' });
  }
};

// Verify email endpoint
// controllers/authController.js - FIXED verifyEmail function
const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    // Check if user exists
    const user = await getUserByEmail(email);

    if (!user) {
      await logSystemAction('EMAIL_VERIFICATION_FAILED', 'user', null, {
        reason: 'User not found',
        email,
        ip: req.ip
      });
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is already verified
    if (user.email_verified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Check if verification code matches and is not expired
    if (!user.verification_code || user.verification_code !== verificationCode) {
      await logSystemAction('EMAIL_VERIFICATION_FAILED', 'user', user.user_id, {
        reason: 'Invalid verification code',
        email,
        ip: req.ip
      });
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (isCodeExpired(user.verification_code_expires)) {
      await logSystemAction('EMAIL_VERIFICATION_FAILED', 'user', user.user_id, {
        reason: 'Verification code expired',
        email,
        ip: req.ip
      });
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    // Verify the user's email
    await verifyUserEmail(user.user_id);

    // Generate a new token with verified status
    const token = generateToken({
      id: user.user_id,
      email: user.email,
      role: user.role,
      email_verified: true
    });

    // Set the token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    // Get the updated user data
    const updatedUser = await getUserByEmail(email);
    
    // Remove sensitive data from response
    const { password: _, verification_code: __, verification_code_expires: ___, ...userWithoutSensitiveData } = updatedUser;

    // Log successful verification
    await logSystemAction('EMAIL_VERIFIED', 'user', user.user_id, {
      email,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });

    // FIXED: Return complete user data and token
    res.status(200).json({
      message: 'Email verified successfully',
      user: userWithoutSensitiveData,
      token: token
    });
  } catch (error) {
    console.error('Verify email error:', error);
    await logSystemAction('EMAIL_VERIFICATION_ERROR', 'user', null, {
      error: error.message,
      email: req.body?.email,
      ip: req.ip
    });
    res.status(500).json({ error: 'Failed to verify email' });
  }
};

// Update register function to require email verification
const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      await logSystemAction('REGISTER_FAILED', 'user', null, {
        reason: 'Missing email or password',
        email_provided: !!email,
        password_provided: !!password
      });
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      await logSystemAction('REGISTER_FAILED', 'user', null, {
        reason: 'Password too short',
        email,
        password_length: password.length
      });
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      await logSystemAction('REGISTER_FAILED', 'user', null, {
        reason: 'Invalid email format',
        email
      });
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate role if provided
    if (role && !['admin', 'moderator', 'user', 'guest'].includes(role)) {
      await logSystemAction('REGISTER_FAILED', 'user', null, {
        reason: 'Invalid role',
        email,
        role_provided: role
      });
      return res.status(400).json({ 
        error: 'Invalid role. Must be one of: admin, moderator, user, guest' 
      });
    }

    // Check if user exists using existing query
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      await logSystemAction('REGISTER_FAILED', 'user', null, {
        reason: 'User already exists',
        email
      });
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    const hashedPassword = await hashPassword(password);

    // Generate verification code and expiration
    const verificationCode = generateVerificationCode();
    const expirationTime = generateExpirationTime();

    // Create user with verification data
    const user = await addUser({
      user_name: name || email.split('@')[0],
      email: email,
      password: hashedPassword,
      role: role || 'user',
      verification_code: verificationCode,
      verification_code_expires: expirationTime
    });

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    const token = generateToken({
      id: user.user_id,
      email: user.email,
      role: user.role,
      email_verified: false // Include verification status in token
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Log successful registration
    await logSystemAction('USER_REGISTERED', 'user', user.user_id, {
      email: user.email,
      role: user.role,
      user_name: user.user_name,
      registration_method: 'email',
      email_verified: false,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification code.',
      user: userWithoutPassword,
      token: token,
      requires_verification: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Log registration error
    await logSystemAction('REGISTER_ERROR', 'user', null, {
      error: error.message,
      error_code: error.code,
      stack: error.stack
    });
    
    // Handle PostgreSQL unique constraint violation
    if (error.code === '23505') {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    res.status(500).json({ error: 'Internal server error during registration' });
  }
};

// Update login function to check email verification
const login = async (req, res) => {
  try {
    // Add safety check for req.body
    if (!req.body) {
      await logSystemAction('LOGIN_FAILED', 'user', null, {
        reason: 'No request body',
        ip: req.ip,
        user_agent: req.get('User-Agent')
      });
      return res.status(400).json({ error: 'Request body is required' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      await logSystemAction('LOGIN_FAILED', 'user', null, {
        reason: 'Missing email or password',
        email_provided: !!email,
        password_provided: !!password,
        ip: req.ip
      });
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user by email using existing query
    const user = await getUserByEmail(email);

    if (!user) {
      await logSystemAction('LOGIN_FAILED', 'user', null, {
        reason: 'User not found',
        email,
        ip: req.ip
      });
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      await logSystemAction('LOGIN_FAILED', 'user', user.user_id, {
        reason: 'Invalid password',
        email,
        ip: req.ip
      });
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!user.email_verified) {
      await logSystemAction('LOGIN_BLOCKED', 'user', user.user_id, {
        reason: 'Email not verified',
        email,
        ip: req.ip
      });
      return res.status(403).json({ 
        error: 'Please verify your email before logging in',
        requires_verification: true
      });
    }

    const token = generateToken({
      id: user.user_id,
      email: user.email,
      role: user.role,
      email_verified: true
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    // Remove password from user object before sending response
    const { password: _, ...userWithoutPassword } = user;

    // Log successful login
    await logSystemAction('USER_LOGGED_IN', 'user', user.user_id, {
      email: user.email,
      role: user.role,
      user_name: user.user_name,
      login_method: 'email',
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      session_duration: '15 minutes',
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token: token,
      expires_in: '15 minutes'
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Log login error
    await logSystemAction('LOGIN_ERROR', 'user', null, {
      error: error.message,
      email: req.body?.email,
      ip: req.ip,
      stack: error.stack
    });
    
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

// ADD THE MISSING LOGOUT FUNCTION
const logout = async (req, res) => {
  try {
    // Extract user info from token before clearing it
    let userInfo = {};
    try {
      const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userInfo = {
          user_id: decoded.id,
          email: decoded.email,
          role: decoded.role
        };
      }
    } catch (error) {
      // Token might be expired, but we still want to log the logout attempt
      console.log('Token verification failed during logout:', error.message);
    }

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Log logout action
    if (userInfo.user_id) {
      await logSystemAction('USER_LOGGED_OUT', 'user', userInfo.user_id, {
        email: userInfo.email,
        role: userInfo.role,
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
    } else {
      await logSystemAction('LOGOUT_ATTEMPT', 'user', null, {
        reason: 'No valid user token',
        ip: req.ip
      });
    }

    res.status(200).json({ 
      message: 'Logout successful' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    
    // Log logout error
    await logSystemAction('LOGOUT_ERROR', 'user', null, {
      error: error.message,
      ip: req.ip,
      stack: error.stack
    });
    
    res.status(500).json({ error: 'Internal server error during logout' });
  }
};

// Resend verification code endpoint
const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.email_verified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const expirationTime = generateExpirationTime();

    // Update verification code in database
    await updateUserVerification(user.user_id, verificationCode, expirationTime);

    // Send new verification email
    await sendVerificationEmail(email, verificationCode);

    await logSystemAction('VERIFICATION_CODE_RESENT', 'user', user.user_id, {
      email,
      ip: req.ip,
      expires_at: expirationTime
    });

    res.status(200).json({
      message: 'Verification code resent to your email',
      expires_in: '15 minutes'
    });
  } catch (error) {
    console.error('Resend verification code error:', error);
    
    await logSystemAction('VERIFICATION_RESEND_ERROR', 'user', null, {
      error: error.message,
      email: req.body?.email,
      ip: req.ip
    });
    
    res.status(500).json({ error: 'Failed to resend verification code' });
  }
};

// Additional auth-related logging functions
const logFailedLoginAttempt = async (email, reason, ip, userAgent) => {
  try {
    await logSystemAction('LOGIN_FAILED', 'user', null, {
      email,
      reason,
      ip_address: ip,
      user_agent: userAgent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log failed login attempt:', error);
  }
};

const logPasswordChange = async (userId, email, ip) => {
  try {
    await logSystemAction('PASSWORD_CHANGED', 'user', userId, {
      email,
      ip_address: ip,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log password change:', error);
  }
};

const logAccountLocked = async (userId, email, reason, ip) => {
  try {
    await logSystemAction('ACCOUNT_LOCKED', 'user', userId, {
      email,
      reason,
      ip_address: ip,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log account locked:', error);
  }
};

module.exports = {
  register,
  login,
  logout, // Now this is defined!
  sendVerificationCode,
  verifyEmail,
  resendVerificationCode,
  logFailedLoginAttempt,
  logPasswordChange,
  logAccountLocked
};
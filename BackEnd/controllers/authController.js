// controllers/authController.js
const { generateToken, hashPassword, comparePassword } = require('../utils/auth');
const { getUserByEmail, addUser } = require('../db/queries/users');
const { logAction, logSystemAction } = require('./auditHelper');

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

    // Create user using existing addUser function - NOW INCLUDING ROLE
    const user = await addUser({
      user_name: name || email.split('@')[0],
      email: email,
      password: hashedPassword,
      role: role || 'user', // Use provided role or default to 'user'
    });

    const token = generateToken({
      id: user.user_id,
      email: user.email,
      role: user.role,
    });

    // In the register function, update the cookie to also be 15 minutes:
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000, // 15 minutes (changed from 7 days)
});

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Log successful registration
    await logSystemAction('USER_REGISTERED', 'user', user.user_id, {
      email: user.email,
      role: user.role,
      user_name: user.user_name,
      registration_method: 'email',
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token: token
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

    const token = generateToken({
      id: user.user_id,
      email: user.email,
      role: user.role,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes (matches JWT expiration)
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
      session_duration: '15 minutes', // Log the session duration
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token: token,
      expires_in: '15 minutes' // Inform frontend about session duration
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
  logout,
  logFailedLoginAttempt,
  logPasswordChange,
  logAccountLocked
};
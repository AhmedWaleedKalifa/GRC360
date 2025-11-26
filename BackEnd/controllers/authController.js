// controllers/authController.js
const { generateToken, hashPassword, comparePassword } = require('../utils/auth');
const { getUserByEmail, addUser } = require('../db/queries/users');

const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body; // Added role here

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate role if provided
    if (role && !['admin', 'moderator', 'user', 'guest'].includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role. Must be one of: admin, moderator, user, guest' 
      });
    }

    // Check if user exists using existing query
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
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

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token: token
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle PostgreSQL unique constraint violation
    if (error.code === '23505') {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    res.status(500).json({ error: 'Internal server error during registration' });
  }
};

// login and logout functions remain the same...
const login = async (req, res) => {
  try {
    // Add safety check for req.body
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user by email using existing query
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
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
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Remove password from user object before sending response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token: token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};
const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ 
      message: 'Logout successful' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error during logout' });
  }
};

module.exports = {
  register,
  login,
  logout,
};
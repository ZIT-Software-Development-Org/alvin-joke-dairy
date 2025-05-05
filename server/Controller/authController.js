import db from '../models/index.js';
import bcrypt from "bcrypt";

/**
 * Handle user login
 */
const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Regenerate session to prevent session fixation
    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regeneration error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      // Store user information in session
      req.session.userId = user.id;
      req.session.email = user.email;
      req.session.username = user.username;
      req.session.role = user.role;

      // Save the session before redirection to ensure it's stored in the database
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        // Return user data (excluding password)
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        };

        res.status(200).json(userData);
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Handle user signup
 */
const handleSignUp = async (req, res) => {
  const { fullname, email, password } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await db.User.create({
      username: fullname,
      email,
      password: hashedPassword,
    });
    
    // Return success response (excluding password)
    const userData = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    };
    
    res.status(201).json({
      message: "User created successfully",
      data: userData
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Check current user session
 */
const checkSession = async (req, res) => {
  try {
    // Since this route uses isAuthenticated middleware,
    // we know the user is logged in if we reach this point
    const user = await db.User.findByPk(req.session.userId, {
      attributes: ['id', 'username', 'email', 'role'] // Exclude password
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Session check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Handle user logout
 */
const handleLogout = (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Failed to logout' });
    }
    
    // Clear the session cookie
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

export { handleLogin, handleSignUp, checkSession, handleLogout };
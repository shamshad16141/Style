const User = require('../models/User');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!firstName || !lastName || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'firstName, lastName, email, and password are required' });
    }
    
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      phone,
      password,
      role,
    });
    await user.save();
    
    res.status(201).json({ message: 'User created successfully', user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    console.log(`🔍 Login attempt for email: ${normalizedEmail}`);
    
    // First try exact match
    let user = await User.findOne({ email: normalizedEmail });
    
    // If not found, try case-insensitive with whitespace tolerance
    if (!user) {
      console.log('🔍 Trying legacy email patterns...');
      const legacyEmailPattern = new RegExp(`^\\s*${escapeRegex(normalizedEmail)}\\s*$`, 'i');
      user = await User.findOne({ email: { $regex: legacyEmailPattern } });
    }
    
    if (!user) {
      console.log(`❌ User not found for email: ${normalizedEmail}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`✅ User found: ${user.email}`);

    // Compare password using bcrypt
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      console.log('❌ Invalid password');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`✅ Login successful for: ${user.email}`);
    
    res.status(200).json({ 
      message: 'Login successful', 
      user: { ...user.toObject(), password: undefined },
      token: 'jwt_token_here' // Add JWT token generation here
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};

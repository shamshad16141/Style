import type { Request, Response } from 'express';
import User from '../models/User';

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body as Record<string, unknown>;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!firstName || !lastName || !normalizedEmail || !password) {
      res.status(400).json({ message: 'firstName, lastName, email, and password are required' });
      return;
    }

    console.log(`📝 Creating user with email: ${normalizedEmail}`);

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = new User({
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: normalizedEmail,
      phone,
      password,
      role
    });

    console.log('💾 Saving user to database...');
    await user.save();

    console.log(`✅ User created successfully: ${normalizedEmail}`);
    res.status(201).json({ message: 'User created successfully', user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    const err = error as Error;
    console.error('❌ Error creating user:', err.message, err.stack);
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as Record<string, unknown>;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!normalizedEmail || typeof password !== 'string' || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    console.log(`🔍 Login attempt for email: ${normalizedEmail}`);

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log('🔍 Trying legacy email patterns...');
      const legacyEmailPattern = new RegExp(`^\\s*${escapeRegex(normalizedEmail)}\\s*$`, 'i');
      user = await User.findOne({ email: { $regex: legacyEmailPattern } });
    }

    if (!user) {
      console.log(`❌ User not found for email: ${normalizedEmail}`);
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    console.log(`✅ User found: ${user.email}`);

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      console.log('❌ Invalid password');
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    console.log(`✅ Login successful for: ${user.email}`);

    res.status(200).json({
      message: 'Login successful',
      user: { ...user.toObject(), password: undefined },
      token: 'jwt_token_here'
    });
  } catch (error) {
    const err = error as Error;
    console.error('❌ Login error:', err.message);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};
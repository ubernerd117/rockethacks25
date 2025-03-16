import { Request, Response } from 'express';
import User from '../models/User';
import Class from '../models/Class'; // Import the Class model
import jwt from 'jsonwebtoken';

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Username or email already exists',
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password, // Password will be hashed by the pre-save middleware
      role: role || 'student',
    });

    // Save user
    await user.save();

    // Don't return password in response
    const userResponse = user.toObject();
    delete (userResponse as any).password;

    return res.status(201).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// User login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'rockethacks25_jwt_secret_key', {
      expiresIn: '1d', // Token expires in 1 day
    });

    // Don't return password in response
    const userResponse = user.toObject();
    delete (userResponse as any).password;

    return res.status(200).json({
      success: true,
      token,
      data: userResponse,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get all users
export const getUsers = async (
  req: Request,
  res: Response,
  role?: 'student' | 'teacher'
) => {
  try {
    // const { role } = req.query;

    // Build query
    const query: any = {};
    if (role) {
      query.role = role;
    }

    const users = await User.find(query).select('-__v').sort('username');

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// Get single user
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-__v')
      .populate('enrolledClasses', 'name code')
      .populate('teachingClasses', 'name code');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    // Find the user
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check if username already exists for another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Username already exists',
        });
      }
      user.username = username;
    }

    // Check if email already exists for another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists',
        });
      }
      user.email = email;
    }

    // Update password if provided
    if (password) {
      user.password = password; // Will be hashed by the pre-save hook
    }

    // Update role if provided
    if (role) {
      user.role = role;
    }

    // Save updated user
    await user.save();

    // Don't return password in response
    const userResponse = user.toObject();
    delete (userResponse as any).password;

    return res.status(200).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Delete user
    await user.deleteOne();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

export const getStudentsByTeacher = async (req: Request, res: Response) => {
  try {
    const teacherId = req.params.teacherId;

    // Check if teacher exists
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({
        success: false,
        error: 'Teacher not found',
      });
    }

    // Find classes taught by the teacher
    const classes = await Class.find({ teacher: teacherId });

    // Extract class IDs
    const classIds = classes.map((c) => c._id);

    // Find students enrolled in those classes
    const students = await User.find({
      role: 'student',
      enrolledClasses: { $in: classIds },
    })
      .select('-__v')
      .sort('username');

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error('Error fetching students by teacher:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

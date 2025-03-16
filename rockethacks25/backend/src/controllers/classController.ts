import { Request, Response } from 'express';
import Class from '../models/Class';
import User from '../models/User';
import mongoose from 'mongoose';

// Create a new class
export const createClass = async (req: Request, res: Response) => {
  try {
    const { name, description, code, teacherId } = req.body;
    
    // Check if teacher exists and is a teacher
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: 'Teacher not found'
      });
    }
    
    if (teacher.role !== 'teacher') {
      return res.status(400).json({
        success: false,
        error: 'User is not a teacher'
      });
    }
    
    // Check if class code already exists
    const existingClass = await Class.findOne({ code });
    if (existingClass) {
      return res.status(400).json({
        success: false,
        error: 'Class code already exists'
      });
    }
    
    // Create new class
    const newClass = new Class({
      name,
      description,
      code,
      teacher: teacherId,
      students: [],
      assignments: []
    });
    
    // Save the class
    await newClass.save();
    
    // Update teacher's teaching classes
    await User.findByIdAndUpdate(teacherId, {
      $push: { teachingClasses: newClass._id }
    });
    
    return res.status(201).json({
      success: true,
      data: newClass
    });
  } catch (error) {
    console.error('Error creating class:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all classes
export const getClasses = async (req: Request, res: Response) => {
  try {
    const classes = await Class.find()
      .populate('teacher', 'username email')
      .select('name description code teacher students');
    
    return res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single class by ID
export const getClassById = async (req: Request, res: Response) => {
  try {
    const classItem = await Class.findById(req.params.id)
      .populate('teacher', 'username email')
      .populate('students', 'username email')
      .populate({
        path: 'assignments',
        select: 'name description dueDate totalPoints'
      });
    
    if (!classItem) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: classItem
    });
  } catch (error) {
    console.error('Error fetching class:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update class
export const updateClass = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    
    // Find the class
    const classToUpdate = await Class.findById(req.params.id);
    
    if (!classToUpdate) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }
    
    // Update fields
    if (name) classToUpdate.name = name;
    if (description) classToUpdate.description = description;
    
    // Save updates
    await classToUpdate.save();
    
    return res.status(200).json({
      success: true,
      data: classToUpdate
    });
  } catch (error) {
    console.error('Error updating class:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Add student to class
export const addStudentToClass = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const classId = req.params.id;
    
    // Check if student exists and is a student
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }
    
    if (student.role !== 'student') {
      return res.status(400).json({
        success: false,
        error: 'User is not a student'
      });
    }
    
    // Find the class
    const classToUpdate = await Class.findById(classId);
    if (!classToUpdate) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }
    
    // Check if student is already in the class
    if (classToUpdate.students.includes(new mongoose.Types.ObjectId(studentId))) {
      return res.status(400).json({
        success: false,
        error: 'Student is already enrolled in this class'
      });
    }
    
    // Add student to class
    classToUpdate.students.push(new mongoose.Types.ObjectId(studentId));
    await classToUpdate.save();
    
    // Add class to student's enrolled classes
    await User.findByIdAndUpdate(studentId, {
      $push: { enrolledClasses: classId }
    });
    
    return res.status(200).json({
      success: true,
      data: classToUpdate
    });
  } catch (error) {
    console.error('Error adding student to class:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Remove student from class
export const removeStudentFromClass = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const classId = req.params.id;
    
    // Update class by removing student
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $pull: { students: studentId } },
      { new: true }
    );
    
    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }
    
    // Remove class from student's enrolled classes
    await User.findByIdAndUpdate(
      studentId,
      { $pull: { enrolledClasses: classId } }
    );
    
    return res.status(200).json({
      success: true,
      data: updatedClass
    });
  } catch (error) {
    console.error('Error removing student from class:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete class
export const deleteClass = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;
    
    // Find the class
    const classToDelete = await Class.findById(classId);
    if (!classToDelete) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }
    
    // Remove class from teacher's teaching classes
    await User.findByIdAndUpdate(
      classToDelete.teacher,
      { $pull: { teachingClasses: classId } }
    );
    
    // Remove class from all enrolled students
    await User.updateMany(
      { _id: { $in: classToDelete.students } },
      { $pull: { enrolledClasses: classId } }
    );
    
    // Delete the class
    await classToDelete.deleteOne();
    
    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting class:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 
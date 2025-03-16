import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import Class from '../models/Class';
import User from '../models/User';
import { uploadFileToS3, deleteFileFromS3 } from '../services/s3Service';

// Create a new assignment
export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { name, description, dueDate, totalPoints, classId } = req.body;
    
    // Verify class exists
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }
    
    // Create new assignment
    const assignment = new Assignment({
      name,
      description,
      dueDate,
      totalPoints,
      classId,
      submissions: []
    });
    
    // Save assignment
    await assignment.save();
    
    // Add assignment to class
    await Class.findByIdAndUpdate(classId, {
      $push: { assignments: assignment._id }
    });
    
    return res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all assignments for a class
export const getAssignments = async (req: Request, res: Response) => {
  try {
    const { classId } = req.query;
    
    // Build query
    const query: any = {};
    if (classId) {
      query.classId = classId;
    }
    
    const assignments = await Assignment.find(query)
      .sort({ dueDate: 1 })
      .populate({
        path: 'submissions',
        select: 'studentId submissionDate gradeReceived'
      });
    
    return res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single assignment
export const getAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate({
        path: 'submissions',
        select: 'studentId submissionDate gradeReceived fileUrl',
        populate: {
          path: 'studentId',
          select: 'username email'
        }
      });
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update assignment
export const updateAssignment = async (req: Request, res: Response) => {
  try {
    const { name, description, dueDate, totalPoints } = req.body;
    
    let assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }
    
    // Update fields
    if (name) assignment.name = name;
    if (description) assignment.description = description;
    if (dueDate) assignment.dueDate = new Date(dueDate);
    if (totalPoints !== undefined) assignment.totalPoints = totalPoints;
    
    // Save updated assignment
    await assignment.save();
    
    return res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Error updating assignment:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete assignment
export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }
    
    // Remove assignment from class
    await Class.findByIdAndUpdate(assignment.classId, {
      $pull: { assignments: assignment._id }
    });
    
    // Delete assignment
    await assignment.deleteOne();
    
    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 
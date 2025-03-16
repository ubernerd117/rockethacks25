import { Request, Response } from 'express';
import Submission from '../models/Submission';
import Assignment from '../models/Assignment';
import User from '../models/User';
import { uploadFileToS3, deleteFileFromS3 } from '../services/s3Service';

// Create a new submission
export const createSubmission = async (req: Request, res: Response) => {
  try {
    const { assignmentId, studentId } = req.body;
    
    // Verify assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }
    
    // Verify student exists
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
    
    // Check if student already submitted
    const existingSubmission = await Submission.findOne({
      assignmentId,
      studentId
    });
    
    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        error: 'You have already submitted this assignment'
      });
    }
    
    // Create submission
    const submission = new Submission({
      assignmentId,
      studentId,
      submissionDate: new Date()
    });
    
    // If file is uploaded, process it
    if (req.file) {
      const folderName = 'submissions';
      
      // First save the submission to get an ID
      await submission.save();
      
      // Pass submission ID as metadata to help with auto-grading
      const result = await uploadFileToS3(req.file, undefined, folderName, {
        submissionId: submission._id ? submission._id.toString() : ''
      });
      
      // Update submission with file info
      submission.fileUrl = result.Location;
      submission.fileKey = result.Key;
      
      // Save again with the file info
      await submission.save();
    } else {
      // Save submission if no file
      await submission.save();
    }
    
    // Add submission to assignment
    await Assignment.findByIdAndUpdate(assignmentId, {
      $push: { submissions: submission._id }
    });
    
    return res.status(201).json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get submissions for an assignment
export const getSubmissionsByAssignment = async (req: Request, res: Response) => {
  try {
    const { assignmentId } = req.params;
    
    const submissions = await Submission.find({ assignmentId })
      .populate('studentId', 'username email')
      .sort({ submissionDate: -1 });
    
    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get all submissions by a student
export const getSubmissionsByStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    
    const submissions = await Submission.find({ studentId })
      .populate({
        path: 'assignmentId',
        select: 'name dueDate totalPoints classId',
        populate: {
          path: 'classId',
          select: 'name code'
        }
      })
      .sort({ submissionDate: -1 });
    
    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching student submissions:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get a single submission
export const getSubmission = async (req: Request, res: Response) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('studentId', 'username email')
      .populate('assignmentId', 'name description dueDate totalPoints');
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update submission (file or resubmit)
export const updateSubmission = async (req: Request, res: Response) => {
  try {
    const submissionId = req.params.id;
    
    let submission = await Submission.findById(submissionId);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    // Update submission date
    submission.submissionDate = new Date();
    
    // If file is uploaded, process it
    if (req.file) {
      // Delete existing file if there is one
      if (submission.fileKey) {
        await deleteFileFromS3(submission.fileKey);
      }
      
      const folderName = 'submissions';
      const result = await uploadFileToS3(req.file, undefined, folderName);
      
      // Update submission with new file info
      submission.fileUrl = result.Location;
      submission.fileKey = result.Key;
    }
    
    // Save updated submission
    await submission.save();
    
    return res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Grade submission
export const gradeSubmission = async (req: Request, res: Response) => {
  try {
    const { gradeReceived, feedback } = req.body;
    const submissionId = req.params.id;
    
    let submission = await Submission.findById(submissionId);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    // Update grade and feedback
    if (gradeReceived !== undefined) submission.gradeReceived = gradeReceived;
    if (feedback) submission.feedback = feedback;
    
    // Save updated submission
    await submission.save();
    
    return res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Error grading submission:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete submission
export const deleteSubmission = async (req: Request, res: Response) => {
  try {
    const submission = await Submission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    // Delete file from S3 if exists
    if (submission.fileKey) {
      await deleteFileFromS3(submission.fileKey);
    }
    
    // Remove submission from assignment
    await Assignment.findByIdAndUpdate(submission.assignmentId, {
      $pull: { submissions: submission._id }
    });
    
    // Delete submission
    await submission.deleteOne();
    
    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update submission grade
export const updateSubmissionGrade = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { gradeReceived, feedback, autoGraded, gradeDetails } = req.body;
    
    // Update submission
    const submission = await Submission.findByIdAndUpdate(
      id,
      { 
        gradeReceived, 
        feedback, 
        autoGraded,
        autoGradingDetails: gradeDetails
      },
      { new: true }
    );
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Error updating submission grade:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 
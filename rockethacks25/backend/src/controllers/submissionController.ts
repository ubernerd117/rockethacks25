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
    
    // Verify the assignment belongs to a valid class
    if (!assignment.classId) {
      return res.status(400).json({
        success: false,
        error: 'Assignment is not associated with a class'
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
    
    // Check if student is enrolled in the class
    // This is optional but provides an additional layer of validation
    const isEnrolled = student.enrolledClasses && 
                       student.enrolledClasses.some(classId => 
                         classId.toString() === assignment.classId.toString()
                       );
    
    if (!isEnrolled) {
      console.warn(`Student ${studentId} submitting to assignment in a class they may not be enrolled in`);
      // Optional: Return error if you want to strictly enforce enrollment
      // return res.status(403).json({
      //   success: false,
      //   error: 'Student is not enrolled in this class'
      // });
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
    
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'A file is required for submission'
      });
    }
    
    // Upload file to S3
    const folderName = 'submissions';
    
    // Create a submission object without saving yet
    const submission = new Submission({
      assignmentId,
      studentId,
      submissionDate: new Date()
    });
    
    // Get assignment name safely - using type assertion since we know the structure
    const assignmentName = assignment.name || 'assignment';
    
    // Generate a clean filename with assignment and student info
    const cleanFilename = `${assignment._id}_${student._id}_${Date.now()}.pdf`;
    
    // Upload to S3 with metadata for easier retrieval
    const result = await uploadFileToS3(
      req.file, 
      undefined, 
      folderName, 
      {
        assignmentId: assignmentId,
        studentId: studentId,
        assignmentName: assignmentName,
        studentName: student.username || '',
        submissionDate: new Date().toISOString()
      },
      cleanFilename
    );
    
    // Update submission with file info
    submission.fileUrl = result.Location;
    submission.fileKey = result.Key;
    
    // Save the submission
    await submission.save();
    
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
      .populate({
        path: 'assignmentId',
        select: 'name description dueDate totalPoints classId',
        populate: {
          path: 'classId',
          select: 'name code description'
        }
      });
    
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
      
      // Get references to related entities for better filename
      const assignment = await Assignment.findById(submission.assignmentId);
      const student = await User.findById(submission.studentId);
      
      if (!assignment || !student) {
        return res.status(404).json({
          success: false,
          error: 'Associated assignment or student not found'
        });
      }
      
      const folderName = 'submissions';
      const cleanFilename = `${assignment._id}_${student._id}_${Date.now()}.pdf`;
      
      // Upload with metadata
      const result = await uploadFileToS3(
        req.file, 
        undefined, 
        folderName, 
        {
          assignmentId: submission.assignmentId.toString(),
          studentId: submission.studentId.toString(),
          assignmentName: assignment.name || 'assignment',
          studentName: student.username || '',
          submissionDate: new Date().toISOString(),
          isResubmission: 'true'
        },
        cleanFilename
      );
      
      // Update submission with new file info
      submission.fileUrl = result.Location;
      submission.fileKey = result.Key;
    } else {
      return res.status(400).json({
        success: false,
        error: 'A file is required for submission update'
      });
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
    const submissionId = req.params.id;
    
    // Find submission
    const submission = await Submission.findById(submissionId);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    // Delete associated file from S3
    if (submission.fileKey) {
      try {
        await deleteFileFromS3(submission.fileKey);
        console.log(`Successfully deleted file from S3: ${submission.fileKey}`);
      } catch (error) {
        console.error(`Failed to delete file from S3: ${submission.fileKey}`, error);
        // Continue with deletion even if file removal fails
      }
    }
    
    // Remove submission from assignment
    await Assignment.findByIdAndUpdate(submission.assignmentId, {
      $pull: { submissions: submissionId }
    });
    
    // Delete submission from database
    await submission.deleteOne();
    
    return res.status(200).json({
      success: true,
      message: 'Submission deleted successfully'
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

// Get all submissions for a class
export const getSubmissionsByClass = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    
    // First get all assignments for this class
    const assignments = await Assignment.find({ classId }).select('_id');
    
    if (!assignments || assignments.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }
    
    // Get assignment IDs
    const assignmentIds = assignments.map(assignment => assignment._id);
    
    // Find all submissions for these assignments
    const submissions = await Submission.find({
      assignmentId: { $in: assignmentIds }
    })
    .populate('studentId', 'username email')
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
    console.error('Error fetching class submissions:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 
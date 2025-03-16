import mongoose, { Document, Schema } from 'mongoose';

// Define the Submission interface
export interface ISubmission extends Document {
  assignmentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  fileUrl?: string;
  fileKey?: string;
  submissionDate: Date;
  gradeReceived?: number;
  feedback?: string;
  autoGraded?: boolean;
  autoGradingDetails?: any;
  createdAt: Date;
  updatedAt: Date;
}

// Create the Submission schema
const SubmissionSchema: Schema = new Schema({
  assignmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Assignment',
    required: [true, 'Assignment ID is required']
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  fileUrl: {
    type: String
  },
  fileKey: {
    type: String
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  gradeReceived: {
    type: Number,
    min: [0, 'Grade cannot be negative']
  },
  feedback: {
    type: String
  },
  autoGraded: {
    type: Boolean,
    default: false
  },
  autoGradingDetails: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Create and export the Submission model
export default mongoose.model<ISubmission>('Submission', SubmissionSchema); 
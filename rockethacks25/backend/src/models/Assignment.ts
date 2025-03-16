import mongoose, { Document, Schema } from 'mongoose';

// Define the Assignment interface
export interface IAssignment extends Document {
  name: string;
  description?: string;
  dueDate: Date;
  totalPoints: number;
  classId: mongoose.Types.ObjectId;
  submissions: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Create the Assignment schema
const AssignmentSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Assignment name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  totalPoints: {
    type: Number,
    required: [true, 'Total points are required'],
    min: [0, 'Total points cannot be negative']
  },
  classId: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class ID is required']
  },
  submissions: [{
    type: Schema.Types.ObjectId,
    ref: 'Submission'
  }]
}, {
  timestamps: true
});

// Create and export the Assignment model
export default mongoose.model<IAssignment>('Assignment', AssignmentSchema); 
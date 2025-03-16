import mongoose, { Document, Schema } from 'mongoose';

// Define the Class interface
export interface IClass extends Document {
  name: string;
  description?: string;
  code: string;
  teacher: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[];
  assignments: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Create the Class schema
const ClassSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Class code is required'],
    unique: true,
    trim: true
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher is required']
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  assignments: [{
    type: Schema.Types.ObjectId,
    ref: 'Assignment'
  }]
}, {
  timestamps: true
});

// Create and export the Class model
export default mongoose.model<IClass>('Class', ClassSchema); 
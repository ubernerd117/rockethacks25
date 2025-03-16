import mongoose, { Document, Schema } from 'mongoose';

// Define the User interface
export interface IUser extends Document {
  username: string;
  email: string;
  role: 'student' | 'instructor';
  enrolledClasses?: mongoose.Types.ObjectId[];
  teachingClasses?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Create the User schema
const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  role: {
    type: String,
    enum: ['student', 'instructor'],
    default: 'student'
  },
  enrolledClasses: [{
    type: Schema.Types.ObjectId,
    ref: 'Class'
  }],
  teachingClasses: [{
    type: Schema.Types.ObjectId,
    ref: 'Class'
  }]
}, {
  timestamps: true
});

// Create and export the User model
export default mongoose.model<IUser>('User', UserSchema); 
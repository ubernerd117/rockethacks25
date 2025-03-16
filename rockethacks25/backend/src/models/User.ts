import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// Define the User interface
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
  enrolledClasses?: mongoose.Types.ObjectId[];
  teachingClasses?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Create the User schema
const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password should be at least 6 characters long'],
      select: false, // This ensures the password isn't returned by default in queries
    },
    role: {
      type: String,
      enum: ['student', 'teacher'],
      default: 'student',
    },
    enrolledClasses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Class',
      },
    ],
    teachingClasses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Class',
      },
    ],
  },
  {
    timestamps: true
  }
);

// Hash password before saving
UserSchema.pre('save', async function(this: IUser, next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    // Note: We need to use this.password directly since we're using select: false
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error as any);
  }
};

// Create and export the User model
export default mongoose.model<IUser>('User', UserSchema);

import multer from 'multer';
import path from 'path';

// Configure storage
const storage = multer.memoryStorage();

// File filter to restrict file types
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow all file types - modify as needed to restrict by type
  // Example to restrict to images only:
  // const fileTypes = /jpeg|jpg|png|gif/;
  // const mimeType = fileTypes.test(file.mimetype);
  // const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // if (mimeType && extname) {
  //   return cb(null, true);
  // }
  // cb(new Error('Only image files are allowed!'));
  
  // For now, accept all files
  cb(null, true);
};

// Set file size limits
const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB
};

// Create multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload; 
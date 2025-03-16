import express, { Request, Response, NextFunction } from 'express';
import { uploadFile, listFiles, deleteFile } from '../controllers/fileController';
import upload from '../middleware/upload';

const router = express.Router();

// Route to upload a file - wrapping in middleware to handle async errors
router.post('/upload', upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
  uploadFile(req, res).catch(next);
});

// Route to list all files
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  listFiles(req, res).catch(next);
});

// Route to delete a file
router.delete('/:key', (req: Request, res: Response, next: NextFunction) => {
  deleteFile(req, res).catch(next);
});

export default router; 
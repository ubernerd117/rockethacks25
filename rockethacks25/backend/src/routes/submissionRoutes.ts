import express, { Request, Response, NextFunction } from 'express';
import {
  createSubmission,
  getSubmissionsByAssignment,
  getSubmissionsByStudent,
  getSubmission,
  updateSubmission,
  gradeSubmission,
  deleteSubmission
} from '../controllers/submissionController';
import upload from '../middleware/upload';

const router = express.Router();

// Create a new submission - with file upload
router.post('/', upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
  createSubmission(req, res).catch(next);
});

// Get all submissions for an assignment
router.get('/assignment/:assignmentId', (req: Request, res: Response, next: NextFunction) => {
  getSubmissionsByAssignment(req, res).catch(next);
});

// Get all submissions by a student
router.get('/student/:studentId', (req: Request, res: Response, next: NextFunction) => {
  getSubmissionsByStudent(req, res).catch(next);
});

// Get a single submission
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  getSubmission(req, res).catch(next);
});

// Update a submission - with file upload
router.put('/:id', upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
  updateSubmission(req, res).catch(next);
});

// Grade a submission
router.put('/:id/grade', (req: Request, res: Response, next: NextFunction) => {
  gradeSubmission(req, res).catch(next);
});

// Delete a submission
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  deleteSubmission(req, res).catch(next);
});

export default router; 
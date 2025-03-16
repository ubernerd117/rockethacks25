import express, { Request, Response, NextFunction } from 'express';
import { 
  createAssignment, 
  getAssignments, 
  getAssignment, 
  updateAssignment, 
  deleteAssignment 
} from '../controllers/assignmentController';
import upload from '../middleware/upload';

const router = express.Router();

// Create a new assignment
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  createAssignment(req, res).catch(next);
});

// Get all assignments (with optional classId filter)
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  getAssignments(req, res).catch(next);
});

// Get a single assignment
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  getAssignment(req, res).catch(next);
});

// Update an assignment
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  updateAssignment(req, res).catch(next);
});

// Delete an assignment
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  deleteAssignment(req, res).catch(next);
});

export default router; 
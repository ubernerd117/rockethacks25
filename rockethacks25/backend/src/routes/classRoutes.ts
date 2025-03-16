import express, { Request, Response, NextFunction } from 'express';
import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  addStudentToClass,
  removeStudentFromClass,
  deleteClass
} from '../controllers/classController';

const router = express.Router();

// Create a new class
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  createClass(req, res).catch(next);
});

// Get all classes
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  getClasses(req, res).catch(next);
});

// Get a single class
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  getClassById(req, res).catch(next);
});

// Update a class
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  updateClass(req, res).catch(next);
});

// Add student to class
router.post('/:id/students', (req: Request, res: Response, next: NextFunction) => {
  addStudentToClass(req, res).catch(next);
});

// Remove student from class
router.delete('/:id/students/:studentId', (req: Request, res: Response, next: NextFunction) => {
  removeStudentFromClass(req, res).catch(next);
});

// Delete a class
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  deleteClass(req, res).catch(next);
});

export default router; 
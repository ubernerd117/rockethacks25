import express, { Request, Response, NextFunction } from 'express';
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getStudentsByTeacher,
  loginUser,
} from '../controllers/userController';

const router = express.Router();

// Create a new user (register)
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  createUser(req, res).catch(next);
});

// User login
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  loginUser(req, res).catch(next);
});

// Get all users
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  getUsers(req, res).catch(next);
});

router.get('/students', (req: Request, res: Response, next: NextFunction) => {
  getUsers(req, res, 'student').catch(next);
});

router.get('/teachers', (req: Request, res: Response, next: NextFunction) => {
  getUsers(req, res, 'teacher').catch(next);
});

// Get a single user
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  getUser(req, res).catch(next);
});

// Update a user
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  updateUser(req, res).catch(next);
});

// Delete a user
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  deleteUser(req, res).catch(next);
});

router.get(
  '/teachers/:teacherId/students',
  (req: Request, res: Response, next: NextFunction) => {
    getStudentsByTeacher(req, res).catch(next);
  }
);

export default router;

import express, { Request, Response, NextFunction } from 'express';
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from '../controllers/userController';

const router = express.Router();

// Create a new user
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  createUser(req, res).catch(next);
});

// Get all users
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  getUsers(req, res).catch(next);
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

export default router; 
import express, { Request, Response, NextFunction } from 'express';
import { handleChatQuery, handleSpecificQuery } from '../controllers/chatController';

const router = express.Router();

// General chat endpoint
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  handleChatQuery(req, res).catch(next);
});

// Topic-specific chat endpoint (using URL parameter)
router.post('/topics/:topic', (req: Request, res: Response, next: NextFunction) => {
  handleSpecificQuery(req, res).catch(next);
});

// Convenience topic-specific endpoints
router.post('/assignments', (req: Request, res: Response, next: NextFunction) => {
  req.params.topic = 'assignments';
  handleSpecificQuery(req, res).catch(next);
});

router.post('/classes', (req: Request, res: Response, next: NextFunction) => {
  req.params.topic = 'classes';
  handleSpecificQuery(req, res).catch(next);
});

router.post('/users', (req: Request, res: Response, next: NextFunction) => {
  req.params.topic = 'users';
  handleSpecificQuery(req, res).catch(next);
});

router.post('/submissions', (req: Request, res: Response, next: NextFunction) => {
  req.params.topic = 'submissions';
  handleSpecificQuery(req, res).catch(next);
});

// Endpoint specifically for general knowledge questions
router.post('/general', (req: Request, res: Response, next: NextFunction) => {
  req.params.topic = 'general';
  handleSpecificQuery(req, res).catch(next);
});

export default router; 
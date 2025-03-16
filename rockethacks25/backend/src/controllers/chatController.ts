import { Request, Response } from 'express';
import { generateChatResponse, generateTopicResponse } from '../services/chatService';

// Controller to handle chat requests
export const handleChatQuery = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }
    
    const response = await generateChatResponse(query);
    
    res.status(200).json({ response });
  } catch (error) {
    console.error('Chat controller error:', error);
    res.status(500).json({ message: 'Failed to process chat query', error: (error as Error).message });
  }
};

// Controller to handle topic-specific queries
export const handleSpecificQuery = async (req: Request, res: Response) => {
  try {
    const { topic } = req.params;
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }
    
    const response = await generateTopicResponse(topic, query);
    
    res.status(200).json({ response });
  } catch (error) {
    console.error('Chat controller error:', error);
    res.status(500).json({ message: 'Failed to process specific query', error: (error as Error).message });
  }
}; 
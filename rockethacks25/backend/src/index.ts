import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileRoutes from './routes/fileRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/files', fileRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('S3 File Upload API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
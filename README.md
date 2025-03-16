# RocketGrades 🚀

An intelligent grading platform for teachers and students that leverages AI to streamline the homework grading process.

## About

RocketGrades is a web application built to help teachers save time on grading while providing students with detailed feedback on their assignments. Our platform uses AI-powered grading to analyze student submissions and generate constructive feedback automatically.

## Features

- **Teacher Dashboard**: Manage classes, assignments, and view performance statistics
- **Student Dashboard**: View assignments, submit homework, and receive feedback
- **AI-Powered Grading**: Automatic assessment of student submissions with detailed feedback
- **Document Support**: Upload and grade various document formats including PDF, Word, and plain text
- **Authentication**: Secure login system with role-based access control

## Tech Stack

### Frontend
- Angular 19
- TypeScript
- TailwindCSS & DaisyUI
- Auth0 Integration

### Backend
- Node.js with Express
- TypeScript
- MongoDB & Mongoose
- LangChain & Mistral AI for document processing
- JWT Authentication

### Infrastructure
- AWS Elastic Beanstalk for backend deployment
- AWS Amplify for frontend hosting

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/rockethacks25.git
cd rockethacks25
```

2. Install frontend dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
AUTH0_DOMAIN=your-auth0-domain
AUTH0_CLIENT_ID=your-auth0-client-id
API_URL=http://localhost:3000/api
```

4. Install backend dependencies
```bash
cd backend
npm install
```

5. Set up backend environment variables
Create a `.env` file in the backend directory with:
```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
MISTRAL_API_KEY=your-mistral-api-key
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend application (in a new terminal)
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:4200`

## Project Structure

- `/src` - Frontend Angular application
- `/backend` - Node.js Express backend
- `/backend/src/models` - MongoDB schemas
- `/backend/src/routes` - API endpoints
- `/src/app/components` - Angular components
- `/src/app/services` - Angular services
- `/src/app/pages` - Main application pages



## Acknowledgments

- Built for RocketHacks 2025
- Powered by Mistral AI

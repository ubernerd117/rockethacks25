import { ChatMistralAI } from '@langchain/mistralai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { IClass } from '../models/Class';
import { IAssignment } from '../models/Assignment';
import { IUser } from '../models/User';
import { ISubmission } from '../models/Submission';

dotenv.config();

// Initialize the Mistral AI chat model
const chatModel = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  modelName: process.env.MISTRAL_MODEL || 'mistral-small',
});

const outputParser = new StringOutputParser();

// Create system prompt template for the educational chatbot
const educationPrompt = `You are an intelligent teaching assistant AI created to help with the educational platform.
You have access to the following information:
- Classes, their details, and students enrolled
- Assignments, their details, deadlines, and class associations
- User information, including names and roles
- Submission details

Please answer questions helpfully, accurately, and concisely based on the data provided.
Be friendly and professional in your responses.

Here are some examples of questions you should be able to answer:
- "What assignments are due this week?"
- "How many students are in the Math class?"
- "Who has submitted their homework for Assignment X?"
- "What are all the classes available?"
- "When is the deadline for the Physics project?"

DATA:
{context}

QUESTION: {query}`;

// Create system prompt template for general questions
const generalPrompt = `You are an intelligent AI assistant created to answer general knowledge questions.
Please answer the following question helpfully, accurately, and concisely.
Be friendly and professional in your responses.

QUESTION: {query}`;

// Function to determine if a query is education-related or general
function isEducationQuery(query: string): boolean {
  const educationKeywords = [
    'class', 'classes', 'assignment', 'assignments', 'student', 'students',
    'submission', 'submissions', 'deadline', 'deadlines', 'due', 'homework',
    'project', 'course', 'courses', 'enrolled', 'instructor', 'teacher',
    'professor', 'grade', 'grades', 'submit', 'submitted', 'teach', 'teaching'
  ];
  
  const lowercaseQuery = query.toLowerCase();
  return educationKeywords.some(keyword => lowercaseQuery.includes(keyword));
}

// Function to fetch all classes
async function fetchClasses() {
  // Import model dynamically to avoid circular dependencies
  const ClassModel = mongoose.model<IClass>('Class');
  return await ClassModel.find().lean();
}

// Function to fetch classes by specific criteria
async function fetchClassesBy(criteria: any) {
  const ClassModel = mongoose.model<IClass>('Class');
  return await ClassModel.find(criteria).lean();
}

// Function to fetch all assignments
async function fetchAssignments() {
  const AssignmentModel = mongoose.model<IAssignment>('Assignment');
  return await AssignmentModel.find().lean();
}

// Function to fetch assignments by specific criteria
async function fetchAssignmentsBy(criteria: any) {
  const AssignmentModel = mongoose.model<IAssignment>('Assignment');
  return await AssignmentModel.find(criteria).lean();
}

// Function to fetch users (excluding password)
async function fetchUsers() {
  const UserModel = mongoose.model<IUser>('User');
  return await UserModel.find().select('-password').lean();
}

// Function to fetch user by id or other criteria
async function fetchUserBy(criteria: any) {
  const UserModel = mongoose.model<IUser>('User');
  return await UserModel.findOne(criteria).select('-password').lean();
}

// Function to fetch submissions
async function fetchSubmissions() {
  const SubmissionModel = mongoose.model<ISubmission>('Submission');
  return await SubmissionModel.find().lean();
}

// Function to fetch submissions by specific criteria
async function fetchSubmissionsBy(criteria: any) {
  const SubmissionModel = mongoose.model<ISubmission>('Submission');
  return await SubmissionModel.find(criteria).lean();
}

// Function to generate a response for general questions
async function generateGeneralResponse(query: string) {
  try {
    // Create the prompt with the query
    const prompt = PromptTemplate.fromTemplate(generalPrompt);
    
    // Generate response
    const chain = prompt.pipe(chatModel).pipe(outputParser);
    
    const response = await chain.invoke({
      query: query
    });

    return response;
  } catch (error) {
    console.error('Error generating general response:', error);
    throw error;
  }
}

// Function to generate an education-related response
async function generateEducationResponse(query: string) {
  try {
    // Fetch relevant data from the database
    const classes = await fetchClasses();
    const assignments = await fetchAssignments();
    const users = await fetchUsers();
    const submissions = await fetchSubmissions();

    // Format context data
    const contextData = {
      classes,
      assignments,
      users,
      submissions
    };

    // Create the prompt with the data and query
    const prompt = PromptTemplate.fromTemplate(educationPrompt);
    
    // Generate response
    const chain = prompt.pipe(chatModel).pipe(outputParser);
    
    const response = await chain.invoke({
      context: JSON.stringify(contextData, null, 2),
      query: query
    });

    return response;
  } catch (error) {
    console.error('Error generating education response:', error);
    throw error;
  }
}

// Main function to generate chat responses
export const generateChatResponse = async (query: string) => {
  try {
    // Determine if this is an education-related query or a general query
    if (isEducationQuery(query)) {
      return await generateEducationResponse(query);
    } else {
      return await generateGeneralResponse(query);
    }
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
};

// Function to generate a response for a specific topic
export const generateTopicResponse = async (topic: string, query: string) => {
  try {
    let contextData: any = {};
    
    // Fetch data specific to the requested topic
    switch(topic.toLowerCase()) {
      case 'classes':
        contextData.classes = await fetchClasses();
        break;
      case 'assignments':
        contextData.assignments = await fetchAssignments();
        break;
      case 'users':
        contextData.users = await fetchUsers();
        break;
      case 'submissions':
        contextData.submissions = await fetchSubmissions();
        break;
      case 'general':
        // For general knowledge questions, use the general response generator
        return await generateGeneralResponse(query);
      default:
        // If unknown topic, fall back to main chat response logic
        return await generateChatResponse(query);
    }
    
    // Create topic-specific prompt
    const topicPrompt = `You are an intelligent teaching assistant AI focused on ${topic}.
Please answer questions about ${topic} helpfully, accurately, and concisely based on the data provided.

DATA:
{context}

QUESTION: {query}`;

    // Create the prompt with the data and query
    const prompt = PromptTemplate.fromTemplate(topicPrompt);
    
    // Generate response
    const chain = prompt.pipe(chatModel).pipe(outputParser);
    
    const response = await chain.invoke({
      context: JSON.stringify(contextData, null, 2),
      query: query
    });

    return response;
  } catch (error) {
    console.error(`Error generating ${topic} response:`, error);
    throw error;
  }
}; 
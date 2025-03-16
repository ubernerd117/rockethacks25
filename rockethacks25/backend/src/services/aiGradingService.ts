import { ChatMistralAI } from "@langchain/mistralai"; // Ensure the module is installed and available
import { StructuredOutputParser } from "@langchain/core/output_parsers"; // Ensure the module is installed and available
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { downloadFileFromS3 } from "./s3Service";
// Import parsers for different file formats
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { JSDOM } from 'jsdom';

export async function gradeSubmission(
  submissionId: string, 
  fileKey: string, 
  assignmentName: string, 
  assignmentInstructions: string
): Promise<{
  grade: number;
  feedback: string;
  details: any;
}> {
  try {
    // Create temp directory
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'submission-'));
    const localFilePath = path.join(tempDir, path.basename(fileKey));
    
    // Download file from S3
    await downloadFileFromS3(fileKey, localFilePath);
    
    // Extract content based on file type
    let text = '';
    const fileExt = path.extname(fileKey).toLowerCase();
    
    try {
      switch (fileExt) {
        case '.pdf':
          // Extract text from PDF
          const pdfBuffer = fs.readFileSync(localFilePath);
          const pdfData = await pdfParse(pdfBuffer);
          text = pdfData.text;
          break;
          
        case '.docx':
          // Extract text from Word document
          const result = await mammoth.extractRawText({ path: localFilePath });
          text = result.value;
          break;
          
        case '.doc':
          // Old Word format warning
          text = "Warning: .doc format detected. For better results, please upload .docx files.\n\n" +
                 "Partial content extracted: [Content may be incomplete]";
          // You would need a different library for .doc files (legacy Word format)
          break;
          
        case '.html':
        case '.htm':
          // Extract text from HTML
          const htmlContent = fs.readFileSync(localFilePath, 'utf8');
          const dom = new JSDOM(htmlContent);
          text = dom.window.document.body.textContent || '';
          break;
          
        default:
          // Default to reading as text
          text = fs.readFileSync(localFilePath, 'utf8');
      }
    } catch (extractError) {
      console.error(`Error extracting content from ${fileExt} file:`, extractError);
      text = `[Error extracting content from ${fileExt} file. Grading may be inaccurate.]`;
    }
    
    // Truncate if text is too long (LLM token limits)
    if (text.length > 15000) {
      text = text.substring(0, 15000) + "...\n[Content truncated due to length]";
    }
    
    // 1. Initialize the Mistral model
    const model = new ChatMistralAI({
      apiKey: process.env.MISTRAL_API_KEY,
      modelName: "mistral-large-latest"
    });
    
    // 2. Define the output structure for grading
    const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
      score: "The overall numerical score for the submission (0-100)",
      feedback: "Detailed feedback explaining the grade and overall assessment",
      strengths: "A list of specific strengths in the submission",
      improvements: "A list of areas that need improvement",
      rubric: "A breakdown of scoring by category: understanding (0-20), analysis (0-30), application (0-30), presentation (0-20)"
    });
    
    // 3. Create the prompt
    const promptContent = `
You are an educational grading assistant grading a student submission.

Assignment: ${assignmentName}
Instructions: ${assignmentInstructions}

Student Submission (file type: ${fileExt}):
${text}

Grade this submission out of 100 points based on the following rubric:
- Understanding of concepts (0-20 points)
- Analysis & critical thinking (0-30 points)
- Application of knowledge (0-30 points)
- Presentation & clarity (0-20 points)

${outputParser.getFormatInstructions()}
`;
    
    try {
      // 4. Execute the chain
      const result = await model.invoke(promptContent);
      
      // 5. Extract string content from the result
      let content = '';
      if (typeof result.content === 'string') {
        content = result.content;
      } else if (Array.isArray(result.content)) {
        content = result.content
          .map(item => {
            if (typeof item === 'string') return item;
            if ('text' in item) return item.text;
            return '';
          })
          .join('');
      }
      
      // Parse the structured output
      const gradingResult = await outputParser.parse(content);
      
      // Clean up temp files
      fs.unlinkSync(localFilePath);
      fs.rmdirSync(tempDir);
      
      return {
        grade: typeof gradingResult.score === 'number' ? gradingResult.score : parseInt(gradingResult.score as string, 10),
        feedback: gradingResult.feedback as string,
        details: gradingResult
      };
    } catch (parseError: unknown) {
      console.error('Error processing AI response:', parseError);
      
      // Clean up temp files
      fs.unlinkSync(localFilePath);
      fs.rmdirSync(tempDir);
      
      // Return a default response if parsing fails
      return {
        grade: 0,
        feedback: "Error processing submission. Please try again or grade manually.",
        details: { 
          error: "Failed to process AI response", 
          message: parseError instanceof Error ? parseError.message : String(parseError)
        }
      };
    }
  } catch (error) {
    console.error('Error grading submission:', error);
    throw error;
  }
}
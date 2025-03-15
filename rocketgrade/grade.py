import os
from typing import List, Dict, Any
from pathlib import Path
import json
from dotenv import load_dotenv

from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI

from constants import GEMINI_MODEL, GOOGLE_API_KEY

# Load environment variables
load_dotenv()

class PDFAutograder:
    def __init__(
        self,
        gemini_api_key: str = GOOGLE_API_KEY,
        gemini_model: str = GEMINI_MODEL,
        criteria: Dict[str, float] = None,
    ):
        """
        Initialize the autograder with API keys and grading criteria.
        
        Args:
            gemini_api_key: API key for Google Gemini
            gemini_model: Gemini model to use
            criteria: Dictionary mapping grading criteria to their weight
        """
        # Use environment variables if not explicitly provided
        self.gemini_api_key = gemini_api_key or os.getenv("GOOGLE_API_KEY")
        
        if not self.gemini_api_key:
            raise ValueError("Gemini API key must be provided or set as GOOGLE_API_KEY environment variable")
        
        # Initialize default criteria if none provided
        self.criteria = criteria or {
            "content_quality": 0.3,
            "structure": 0.2,
            "technical_accuracy": 0.3,
            "presentation": 0.2
        }
        
        # Initialize LLM model
        self.gemini = ChatGoogleGenerativeAI(
            model=gemini_model,
            temperature=0.1,
            google_api_key=self.gemini_api_key
        )
    
    def load_pdf(self, pdf_path: str) -> List[Document]:
        """Load a PDF file and return its content as documents."""
        loader = PyPDFLoader(pdf_path)
        return loader.load()
    
    def extract_details(self, documents: List[Document]) -> Dict[str, Any]:
        """Use Gemini to extract key details from the document."""
        # Create a prompt for information extraction
        extraction_prompt = ChatPromptTemplate.from_template("""
        You are an AI assistant tasked with analyzing academic submissions.
        Extract the key details from the following document:
        
        {text}
        
        Please extract and organize the following information:
        1. Main topic or thesis
        2. Key arguments or points presented
        3. Evidence provided to support arguments
        4. Methodology used (if applicable)
        5. Quality of writing and organization
        6. Technical depth and accuracy
        7. Summary of strengths
        8. Summary of weaknesses
        
        Provide your analysis in a detailed structured format.
        """)
        
        # Create extraction chain using Gemini
        extraction_chain = (
            extraction_prompt
            | self.gemini
            | StrOutputParser()
        )
        
        # Combine all document content
        full_text = " ".join([doc.page_content for doc in documents])
        
        # Run extraction
        result = extraction_chain.invoke({"text": full_text})
        return {"detailed_analysis": result}
    
    def grade_submission(self, details: Dict[str, Any]) -> Dict[str, Any]:
        """Use Gemini to grade the submission based on extracted details."""
        # Format the criteria as a string for the prompt
        criteria_str = "\n".join([f"- {name} ({weight * 100}%)" for name, weight in self.criteria.items()])
        
        # Create the grading prompt
        grading_prompt = ChatPromptTemplate.from_template("""
        You are an expert academic grader. Your task is to evaluate a submission based on the analysis provided.
        The grading criteria and their weights are:
        {criteria}
        
        Here is the detailed analysis of the submission:
        {detailed_analysis}
        
        Please provide a fair and detailed evaluation. For each criterion, assign a score from 0-10 and justify your scoring.
        Then, calculate an overall weighted score.
        
        Format your response as a JSON object with the following structure:
        {{
            "criteria_scores": {{
                "criterion_name": {{
                    "score": score_value,  
                    "justification": "Detailed justification for this score"
                }},
                ...
            }},
            "overall_score": calculated_overall_score,
            "feedback": "Comprehensive feedback for the student",
            "grade": "Letter grade (A, B, C, D, or F)"
        }}
        
        Ensure your evaluation is thorough and constructive.
        """)
        
        # Create the grading chain
        grading_chain = (
            grading_prompt
            | self.gemini
            | StrOutputParser()
        )
        
        # Run grading
        result_str = grading_chain.invoke({
            "criteria": criteria_str,
            "detailed_analysis": details["detailed_analysis"]
        })
        
        # Parse the result string to JSON
        try:
            # Try to parse directly as JSON
            result = json.loads(result_str)
        except json.JSONDecodeError:
            # If parsing fails, try to extract JSON from the response
            import re
            json_match = re.search(r'```json\n(.*?)\n```', result_str, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group(1))
            else:
                # If all fails, wrap the result in a simple structure
                result = {
                    "error": "Could not parse JSON response",
                    "raw_response": result_str
                }
        
        return result
    
    def grade_pdf(self, pdf_path: str) -> Dict[str, Any]:
        """
        Complete pipeline to grade a PDF.
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            Dictionary with grading results
        """
        # Validate file exists
        if not os.path.exists(pdf_path):
            return {"error": f"File not found: {pdf_path}"}
        
        # Step 1: Load the PDF
        try:
            documents = self.load_pdf(pdf_path)
        except Exception as e:
            return {"error": f"Error loading PDF: {str(e)}"}
        
        # Step 2: Extract details using Gemini
        try:
            details = self.extract_details(documents)
        except Exception as e:
            return {"error": f"Error extracting details: {str(e)}"}
        
        # Step 3: Grade using Gemini
        try:
            grades = self.grade_submission(details)
        except Exception as e:
            return {"error": f"Error grading submission: {str(e)}"}
        
        # Step 4: Return results
        result = {
            "file_path": pdf_path,
            "file_name": Path(pdf_path).name,
            "analysis": details,
            "grades": grades
        }
        
        return result
    
    def grade_directory(self, directory_path: str, file_pattern: str = "*.pdf") -> List[Dict[str, Any]]:
        """
        Grade all PDF files in a directory matching the pattern.
        
        Args:
            directory_path: Path to directory containing PDFs
            file_pattern: Glob pattern to match files
            
        Returns:
            List of grading results for each file
        """
        # Get all PDF files in the directory
        pdf_files = list(Path(directory_path).glob(file_pattern))
        
        if not pdf_files:
            return [{"error": f"No files matching pattern '{file_pattern}' found in {directory_path}"}]
        
        # Grade each file
        results = []
        for pdf_file in pdf_files:
            result = self.grade_pdf(str(pdf_file))
            results.append(result)
        
        return results


# Example usage function
def example_usage():
    # Create grader instance
    grader = PDFAutograder()
    
    # Grade a single file
    result = grader.grade_pdf("path/to/submission.pdf")
    print(json.dumps(result, indent=2))
    
    # Or grade all PDFs in a directory
    # results = grader.grade_directory("path/to/submissions_folder")
    # for result in results:
    #     print(json.dumps(result, indent=2))


if __name__ == "__main__":
    # This will run only when the script is executed directly
    example_usage()

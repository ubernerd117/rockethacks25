import os
from typing import Dict, Any
import json
import requests
import pypdf
from constants import GOOGLE_API_KEY

class PDFAutograder:
    def __init__(
        self,
        gemini_api_key: str = GOOGLE_API_KEY,
        criteria: Dict[str, float] = None,
    ):
        """
        Initialize the autograder with API keys and grading criteria.
        
        Args:
            gemini_api_key: API key for Google Gemini
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
    
    def load_pdf(self, pdf_path: str) -> str:
        """
        Load and extract text from a PDF.
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            Extracted text from the PDF
        """
        text = ""
        with open(pdf_path, 'rb') as file:
            reader = pypdf.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() + "\n\n"
        return text

    def extract_details(self, pdf_text: str) -> Dict[str, Any]:
        """
        Extract key details from PDF text.
        
        Args:
            pdf_text: Text extracted from PDF
            
        Returns:
            Dictionary with key details
        """
        # Basic extraction - you can enhance this as needed
        return {
            "full_text": pdf_text,
            "word_count": len(pdf_text.split()),
            "character_count": len(pdf_text)
        }

    def grade_submission(self, details: Dict[str, Any]) -> Dict[str, Any]:
        """
        Grade the submission using the Gemini API.
        
        Args:
            details: Dictionary with details extracted from the PDF
            
        Returns:
            Grading results
        """
        # Direct Gemini API call
        api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
        
        # Create the prompt
        prompt = f"""
        You are an experienced teacher grading a student submission. Analyze the following text and provide a detailed grade. 
        
        TEXT:
        {details["full_text"][:8000]}  # Limit text length to avoid token limits
        
        CRITERIA:
        - Content Quality (thoroughness, relevance): {self.criteria["content_quality"]*100}% of grade
        - Structure (organization, flow): {self.criteria["structure"]*100}% of grade
        - Technical Accuracy (correctness, depth): {self.criteria["technical_accuracy"]*100}% of grade
        - Presentation (clarity, language): {self.criteria["presentation"]*100}% of grade
        
        INSTRUCTIONS:
        1. Evaluate each criterion and assign a score from 0-100
        2. Provide specific justification for each score
        3. Calculate an overall weighted score
        4. Provide overall feedback with the most important improvement areas
        
        Your response must be a valid JSON string with the following structure:
        {
            "criteria_scores": {
                "content_quality": {"score": 85, "justification": "..."},
                "structure": {"score": 90, "justification": "..."},
                "technical_accuracy": {"score": 75, "justification": "..."},
                "presentation": {"score": 80, "justification": "..."}
            },
            "overall_score": 82.5,
            "feedback": "Overall feedback here..."
        }
        """
        
        response = requests.post(
            f"{api_url}?key={self.gemini_api_key}",
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.1}
            }
        )
        
        if response.status_code != 200:
            print(f"Error calling Gemini API: {response.status_code} - {response.text}")
            return {"error": "Failed to grade submission"}
        
        result = response.json()
        
        # Extract the JSON from the response text
        try:
            response_text = result["candidates"][0]["content"]["parts"][0]["text"]
            
            # Find the JSON part (between ``` if present)
            if "```json" in response_text:
                json_part = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                json_part = response_text.split("```")[1].strip()
            else:
                json_part = response_text.strip()
            
            grades = json.loads(json_part)
            
            # Calculate overall score if not provided
            if "overall_score" not in grades:
                total = 0
                for criterion, weight in self.criteria.items():
                    if criterion in grades["criteria_scores"]:
                        total += grades["criteria_scores"][criterion]["score"] * weight
                grades["overall_score"] = total
            
            return {"grades": grades}
            
        except Exception as e:
            print(f"Error parsing Gemini API response: {str(e)}")
            print(f"Response text: {response_text}")
            return {"error": f"Failed to parse grading results: {str(e)}"}
    
    def grade_pdf(self, pdf_path: str) -> Dict[str, Any]:
        """
        Grade a PDF file.
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            Grading results
        """
        try:
            # Load and extract text from PDF
            pdf_text = self.load_pdf(pdf_path)
            
            # Extract details
            details = self.extract_details(pdf_text)
            
            # Grade the submission
            results = self.grade_submission(details)
            
            return results
        except Exception as e:
            print(f"Error grading PDF: {str(e)}")
            return {"error": str(e)}
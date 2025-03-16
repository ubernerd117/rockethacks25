import os
import json
import sys
from grader.pdf_autograder import PDFAutograder

def test_grader(pdf_path):
    """Test the PDF autograder with a given PDF file."""
    print(f"Testing PDF autograder with file: {pdf_path}")
    
    # Check if Google API key is set
    if not os.environ.get("GOOGLE_API_KEY"):
        print("Error: GOOGLE_API_KEY environment variable not set")
        print("Set it with: export GOOGLE_API_KEY=your_api_key")
        return
    
    # Initialize the grader
    grader = PDFAutograder()
    
    # Grade the PDF
    print("Grading PDF...")
    result = grader.grade_pdf(pdf_path)
    
    # Print the result
    print("\n===== GRADING RESULTS =====")
    print(json.dumps(result, indent=2))
    
    return result

if __name__ == "__main__":
    # Check if PDF path is provided
    if len(sys.argv) < 2:
        print("Usage: python test_local.py <path_to_pdf>")
        print("Example: python test_local.py ../lda.pdf")
        sys.exit(1)
    
    # Get PDF path from command line
    pdf_path = sys.argv[1]
    
    # Test the grader
    test_grader(pdf_path) 
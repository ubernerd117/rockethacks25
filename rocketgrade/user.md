# PDF Autograder Usage Guide

## Overview
The PDF Autograder is a tool designed to automatically grade PDF submissions using Google Gemini for content analysis and grading. This guide will walk you through the setup, usage, and customization of the autograder.

## Prerequisites
- **Python 3.8 or higher**: Ensure you have Python installed on your system.
- **API Keys**: You will need an API key for Google Gemini.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd rocketgrade
   ```

2. **Create and Activate a Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set Up Environment Variables**:
   Create a `.env` file in the project root with the following content:
   ```plaintext
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

## Usage

### Command-Line Interface

The autograder can be run from the command line. Here are the available options:

- **Grade a Single PDF File**:
   ```bash
   python main.py --pdf path/to/submission.pdf
   ```

- **Grade All PDFs in a Directory**:
   ```bash
   python main.py --directory path/to/submissions_folder
   ```

- **Save Results to a File**:
   ```bash
   python main.py --pdf path/to/submission.pdf --output results.json
   ```

- **Specify a Different File Pattern** (default is `*.pdf`):
   ```bash
   python main.py --directory path/to/submissions_folder --pattern "assignment*.pdf"
   ```

- **Use Specific API Key** (overrides .env file):
   ```bash
   python main.py --pdf path/to/submission.pdf --gemini-key YOUR_KEY
   ```

### Example Usage in Code

You can also use the autograder as a library in your Python code:

```python
from grade import PDFAutograder

# Initialize the grader
grader = PDFAutograder()

# Grade a single file
result = grader.grade_pdf("path/to/submission.pdf")
print(result)

# Grade all PDFs in a directory
results = grader.grade_directory("path/to/submissions_folder")
for result in results:
    print(result)
```

## Customization

### Grading Criteria
You can customize the grading criteria by providing a dictionary mapping criteria names to their weights (must sum to 1.0):

```python
custom_criteria = {
    "content_quality": 0.4,
    "technical_accuracy": 0.3,
    "structure": 0.2,
    "presentation": 0.1
}
```

### AI Models
You can specify which model to use for Gemini:

```python
grader = PDFAutograder(
    gemini_model="gemini-1.5-pro"  # or another Gemini model
)
```

## Output Format
The grader produces a structured JSON output with the following information:
- File metadata (path, name)
- Detailed analysis of the content
- Scores for each criterion (0-10)
- Overall weighted score
- Letter grade (A, B, C, D, or F)
- Detailed feedback for improvement

## Conclusion
The PDF Autograder is a powerful tool for automating the grading process of PDF submissions. By following this guide, you can set up and use the autograder effectively, as well as customize it to fit your specific grading needs.

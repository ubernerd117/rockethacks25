# RocketGrade - PDF Autograder

RocketGrade is a powerful PDF autograder built using LangChain, Google's Gemini, and MistralAI. It automatically grades PDF submissions by analyzing their content and providing detailed feedback and scores based on configurable criteria.

## Features

- **PDF Processing**: Reads and processes PDF files using PyPDF.
- **Content Analysis**: Uses Google's Gemini AI to extract and analyze key details from the PDFs.
- **Automated Grading**: Uses MistralAI to grade submissions based on configurable criteria.
- **Customizable Criteria**: Adjust grading weights and criteria to match your specific needs.
- **Batch Processing**: Grade individual PDFs or entire directories of submissions at once.
- **Detailed Output**: Get comprehensive analysis, scores, and feedback for each submission.

## Installation

### Prerequisites

- Python 3.8+
- API keys for Google Gemini and MistralAI

### Steps

1. Clone the repository:
   ```
   git clone <repository-url>
   cd rocketgrade
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up your API keys:
   
   Create a `.env` file in the project root with the following content:
   ```
   GOOGLE_API_KEY=your_gemini_api_key_here
   MISTRAL_API_KEY=your_mistral_api_key_here
   ```

## Usage

### Command Line Interface

The autograder provides a command-line interface for easy use:

```bash
# Grade a single PDF file
python main.py --pdf path/to/submission.pdf

# Grade all PDFs in a directory
python main.py --directory path/to/submissions_folder

# Save results to a file
python main.py --pdf path/to/submission.pdf --output results.json

# Specify a different file pattern (default is *.pdf)
python main.py --directory path/to/submissions_folder --pattern "assignment*.pdf"

# Use specific API keys (overrides .env file)
python main.py --pdf path/to/submission.pdf --gemini-key YOUR_KEY --mistral-key YOUR_KEY
```

### Usage as a Library

You can also use the autograder in your own Python code:

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

# Customize grading criteria
custom_criteria = {
    "content_quality": 0.4,
    "technical_accuracy": 0.3,
    "structure": 0.2,
    "presentation": 0.1
}
custom_grader = PDFAutograder(criteria=custom_criteria)
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

You can specify which models to use for Gemini and MistralAI:

```python
grader = PDFAutograder(
    gemini_model="gemini-1.5-pro",  # or another Gemini model
    mistral_model="mistral-large-latest"  # or another Mistral model
)
```

## Output Format

The grader produces a structured JSON output with the following information:

- File metadata (path, name)
- Detailed analysis of the content
- Scores for each criterion
- Overall weighted score
- Letter grade
- Detailed feedback

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 
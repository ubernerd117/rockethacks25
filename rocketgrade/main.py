#!/usr/bin/env python3
import os
import sys
import json
import argparse
from pathlib import Path
from dotenv import load_dotenv

from grade import PDFAutograder

def main():
    """Main entry point for the autograder CLI."""
    load_dotenv()
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="PDF Autograder using LangChain and Gemini")
    
    # Add arguments
    parser.add_argument("--pdf", type=str, help="Path to a single PDF file to grade")
    parser.add_argument("--directory", type=str, help="Path to a directory containing PDFs to grade")
    parser.add_argument("--pattern", type=str, default="*.pdf", help="File pattern to match in directory (default: *.pdf)")
    parser.add_argument("--output", type=str, help="Path to save the JSON output")
    parser.add_argument("--gemini-key", type=str, help="Gemini API key (overrides env variable)")
    parser.add_argument("--gemini-model", type=str, default="gemini-1.5-pro", help="Gemini model to use")
    
    args = parser.parse_args()
    
    # Validate arguments
    if not args.pdf and not args.directory:
        parser.error("Either --pdf or --directory must be specified")
    
    if args.pdf and args.directory:
        parser.error("Only one of --pdf or --directory can be specified at a time")
    
    # Create grader
    try:
        grader = PDFAutograder(
            gemini_api_key=args.gemini_key,
            gemini_model=args.gemini_model
        )
    except ValueError as e:
        print(f"Error: {str(e)}")
        sys.exit(1)
    
    # Grade PDF(s)
    results = []
    if args.pdf:
        print(f"Grading PDF: {args.pdf}")
        result = grader.grade_pdf(args.pdf)
        results = [result]
    else:
        print(f"Grading PDFs in directory: {args.directory}")
        results = grader.grade_directory(args.directory, args.pattern)
    
    # Format results
    formatted_results = json.dumps(results, indent=2)
    
    # Output results
    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w') as f:
            f.write(formatted_results)
        print(f"Results saved to {args.output}")
    else:
        print("\nResults:")
        print(formatted_results)
    
    # Print summary
    print("\nGrading Summary:")
    for result in results:
        if "error" in result:
            print(f"Error: {result['error']}")
            continue
            
        file_name = result.get("file_name", "Unknown file")
        
        if "grades" in result and "overall_score" in result["grades"]:
            score = result["grades"]["overall_score"]
            grade = result["grades"].get("grade", "No grade")
            print(f"File: {file_name} - Score: {score} - Grade: {grade}")
        else:
            print(f"File: {file_name} - Could not extract grade")


if __name__ == "__main__":
    main()

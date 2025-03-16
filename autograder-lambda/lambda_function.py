import json
import boto3
import os
import tempfile
import requests
from grader.pdf_autograder import PDFAutograder

# Initialize AWS client
s3 = boto3.client('s3')

# Your API base URL (set as environment variable in Lambda)
API_URL = os.environ.get('API_URL', 'http://your-api-url.com')

def lambda_handler(event, context):
    """
    AWS Lambda entry point for grading PDFs
    
    Event formats supported:
    1. S3 event trigger: when a PDF is uploaded
    2. Direct invocation: with explicit parameters
    """
    try:
        print("Received event:", json.dumps(event))
        
        # Determine event source and extract bucket/key
        if 'Records' in event and event['Records'][0].get('eventSource') == 'aws:s3':
            # S3 event trigger
            s3_event = event['Records'][0]['s3']
            bucket_name = s3_event['bucket']['name']
            file_key = s3_event['object']['key']
            
            # Extract submission ID from key 
            # Format: submissions/1234567890-filename__submissionId.pdf
            submission_id = extract_submission_id_from_key(file_key)
            if not submission_id:
                print(f"Could not extract submission ID from key: {file_key}")
                return {
                    'statusCode': 400,
                    'body': json.dumps({'error': 'Could not extract submission ID from file key'})
                }
        else:
            # Direct invocation with parameters
            bucket_name = event.get('bucket')
            file_key = event.get('key')
            submission_id = event.get('submissionId')
        
        if not all([bucket_name, file_key, submission_id]):
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing required parameters'})
            }
            
        print(f"Processing submission {submission_id}, file: {file_key}")
        
        # Create a temporary file to store the downloaded PDF
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
            temp_filename = temp_file.name
        
        # Download the file from S3
        print(f"Downloading file from S3: {bucket_name}/{file_key}")
        s3.download_file(bucket_name, file_key, temp_filename)
        
        # Initialize and run the grader
        print("Starting grading process")
        grader = PDFAutograder()
        grading_result = grader.grade_pdf(temp_filename)
        
        # Clean up the temporary file
        os.unlink(temp_filename)
        
        # Extract grade information
        if 'grades' in grading_result and 'overall_score' in grading_result['grades']:
            grade_info = {
                'gradeReceived': grading_result['grades']['overall_score'],
                'feedback': grading_result['grades']['feedback'],
                'autoGraded': True,
                'gradeDetails': grading_result
            }
            
            # Update submission record with grades via API
            success = update_submission(submission_id, grade_info)
            if not success:
                return {
                    'statusCode': 500,
                    'body': json.dumps({'error': 'Failed to update submission in database'})
                }
            
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Grading completed successfully',
                'submissionId': submission_id,
                'result': grading_result
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

def extract_submission_id_from_key(file_key):
    """
    Extract submission ID from file key
    Format: submissions/1234567890-filename__submissionId.pdf
    """
    try:
        # Check if using "__" format (our recommended format)
        if '__' in file_key:
            parts = file_key.split('__')
            if len(parts) >= 2:
                # Get the part after the last __ and remove file extension
                submission_id = parts[-1].split('.')[0]
                return submission_id
        
        # Fallback to other methods if necessary
        # (You can add additional extraction methods here)
        
        return None
    except Exception as e:
        print(f"Error extracting submission ID: {str(e)}")
        return None

def update_submission(submission_id, grade_info):
    """Update the submission record with grading results via API"""
    try:
        # Call your MongoDB API endpoint
        if not API_URL:
            raise ValueError("API_URL environment variable not set")
        
        endpoint = f"{API_URL}/api/submissions/{submission_id}/auto-grade"
        print(f"Updating submission at endpoint: {endpoint}")
        print(f"Grade info: {json.dumps(grade_info)}")
        
        response = requests.put(
            endpoint,
            json=grade_info,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code != 200:
            print(f"Error updating submission: {response.status_code} - {response.text}")
            return False
        
        print(f"Successfully updated submission {submission_id}")
        return True
        
    except Exception as e:
        print(f"Error updating submission: {str(e)}")
        return False
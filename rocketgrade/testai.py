import requests
import os
from dotenv import load_dotenv

load_dotenv()

def generate_content():

    api_key = os.getenv('GOOGLE_API_KEY')  # Changed to match the correct environment variabl
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    
    headers = {
        'Content-Type': 'application/json',
    }
    
    data = {
        "contents": [{
            "parts": [{"text": "Explain how AI works"}]
        }]
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": response.text}

print(generate_content())
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment variable
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

app = FastAPI(title="AMITG API", description="AI-powered Machine for Intelligent Testing & Guidance")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeAnalysisRequest(BaseModel):
    code: str

@app.get("/")
async def root():
    return {"message": "Welcome to AMITG API - AI-powered Machine for Intelligent Testing & Guidance"}

@app.get("/ping")
async def ping():
    """
    Health check endpoint for keeping the server alive
    """
    return {"status": "alive", "message": "Server is running"}

@app.post("/analyze")
async def analyze_code(request: CodeAnalysisRequest):
    """
    Analyze code using Gemini
    """
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Please provide code to analyze")
    
    try:
        review = analyze_with_gemini(request.code)
        return {"review": review}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/upload-analyze")
async def upload_and_analyze(
    file: UploadFile = File(...)
):
    """
    Upload a file and analyze its code
    """
    if not file.filename.endswith(('.py', '.js')):
        raise HTTPException(status_code=400, detail="Only .py and .js files are supported")
    
    try:
        contents = await file.read()
        code = contents.decode("utf-8")
        review = analyze_with_gemini(code)
        return {"review": review}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


def analyze_with_gemini(code: str) -> str:
    """
    Analyze code using Google's Gemini API via REST API
    """
    try:
        prompt = create_analysis_prompt(code)
        
        print("Calling Gemini API...")
        
        url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key={api_key}"
        
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        }
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        response_json = response.json()
        
        if 'candidates' in response_json and len(response_json['candidates']) > 0:
            if 'content' in response_json['candidates'][0] and 'parts' in response_json['candidates'][0]['content']:
                text = response_json['candidates'][0]['content']['parts'][0]['text']
                return text
        
        # If we can't extract the text in the expected format, return the raw response
        return f"API Response: {json.dumps(response_json)}"
    except Exception as e:
        print(f"Error in analyze_with_gemini: {str(e)}")
        raise

def create_analysis_prompt(code: str) -> str:
    """
    Create a prompt for AI code analysis
    """
    return f"""
    Review the following code and provide:
    
    1. A summary of what this code does
    2. Edge cases that might break it
    3. Suggested test cases
    4. Feedback on code quality
    5. Line-by-line reviewer comments
    
    Format your response with clear section headings.
    
    CODE:
    ```
    {code}
    ```
    """

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main_render:app", host="0.0.0.0", port=8000, reload=True)

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import google.generativeai as genai
from dotenv import load_dotenv
import asyncio
import httpx
from contextlib import asynccontextmanager

# Load environment variables
load_dotenv()

# Get API key from environment variable
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

# Configure API key
print(f"Configuring Gemini with API key: {api_key[:5]}...")
genai.configure(api_key=api_key)

# Keep-alive function that calls itself every 50 seconds
async def keep_alive():
    """
    Function that pings the server every 50 seconds to keep it alive
    """
    # Get the server URL from environment variable or use default
    server_url = os.getenv("SERVER_URL", "http://localhost:8000")
    
    while True:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{server_url}/ping", timeout=10.0)
                print(f"Keep-alive ping successful: {response.status_code}")
        except Exception as e:
            print(f"Keep-alive ping failed: {str(e)}")
        
        # Wait 50 seconds before next ping
        await asyncio.sleep(50)

# Background task to run keep-alive
async def start_keep_alive():
    """
    Start the keep-alive background task
    """
    print("Starting keep-alive service...")
    asyncio.create_task(keep_alive())

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start keep-alive
    await start_keep_alive()
    yield
    # Shutdown: Clean up if needed
    pass

app = FastAPI(
    title="AMITG API", 
    description="AI-powered Machine for Intelligent Testing & Guidance",
    lifespan=lifespan
)

# Add CORS middleware
# Get allowed origins from environment variable, default to "*" for development
cors_origins_env = os.getenv("CORS_ORIGINS", "*")
allowed_origins = ["*"] if cors_origins_env == "*" else [origin.strip() for origin in cors_origins_env.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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
    Analyze code using Google's Gemini API
    """
    try:
        prompt = create_analysis_prompt(code)
        
        print("Creating Gemini model...")
        model = genai.GenerativeModel('gemini-2.5-pro')
        
        print("Generating content...")
        response = model.generate_content(prompt)
        
        print("Content generated successfully")
        return response.text
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
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

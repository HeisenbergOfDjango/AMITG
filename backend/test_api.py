import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv("GEMINI_API_KEY")
print(f"API key: {api_key[:5]}...")

# Configure API
genai.configure(api_key=api_key)

# List available models
print("Available models:")
try:
    models = genai.list_models()
    for m in models:
        print(f"- {m.name}")
except Exception as e:
    print(f"Error listing models: {str(e)}")

# Try with a different model name
try:
    print("\nTrying with gemini-pro-latest model...")
    model = genai.GenerativeModel('gemini-pro-latest')
    response = model.generate_content('Say hello')
    print(f"Response: {response.text}")
    
    print("\nTrying with gemini-2.5-pro model...")
    model = genai.GenerativeModel('gemini-2.5-pro')
    response = model.generate_content('Say hello')
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error with gemini-pro: {str(e)}")

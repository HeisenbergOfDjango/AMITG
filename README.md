# AMITG: AI-powered Machine for Intelligent Testing & Guidance

AMITG is a web-based AI code reviewer that helps developers analyze code snippets for quality, robustness, and testability. It uses both OpenAI and Google Gemini models to provide comprehensive code analysis.

## Features

- **Code Analysis**: Get a detailed summary of what your code does
- **Edge Case Detection**: Identify potential failure points in your code
- **Test Case Suggestions**: Receive recommended test cases for your code
- **Code Quality Feedback**: Get insights on code readability and maintainability
- **Reviewer Comments**: Line-by-line feedback like a human code reviewer
- **Dual AI Support**: Toggle between OpenAI and Google Gemini models
- **File Upload**: Upload .py or .js files for analysis

## Project Structure

```
amitg/
├── backend/               # FastAPI backend
│   ├── app/
│   │   └── main.py        # Main API implementation
│   ├── requirements.txt   # Python dependencies
│   ├── env.example        # Example environment variables
│   └── run.py             # Server startup script
└── frontend/              # React frontend
    ├── src/
    │   ├── components/    # React components
    │   ├── App.jsx        # Main application component
    │   └── main.jsx       # Entry point
    ├── index.html         # HTML template
    ├── package.json       # Node.js dependencies
    └── vite.config.js     # Vite configuration
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Create a `.env` file based on `env.example` and add your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

6. Run the server:
   ```
   python run.py
   ```
   The API will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   The frontend will be available at http://localhost:5173

## API Endpoints

- `GET /`: Welcome message
- `POST /analyze`: Analyze code snippet
  - Request body: `{ "code": "...", "provider": "openai" | "gemini" }`
- `POST /upload-analyze`: Upload and analyze file
  - Form data: `file` (file upload), `provider` (string)

## Technologies Used

- **Backend**: FastAPI, OpenAI API, Google Generative AI
- **Frontend**: React, Vite, TailwindCSS, Monaco Editor
- **APIs**: OpenAI GPT-4o-mini, Google Gemini 1.5 Pro

## Future Enhancements

- Auto test generator
- Language detection
- Save review history
- Share reviews as Markdown/PDF
- VSCode/Cursor extension
- Code quality score

# Deployment Guide for AMITG

This guide explains how to deploy AMITG on Render.com for free with a keep-alive mechanism to prevent the service from going down due to inactivity.

## Backend Deployment on Render

1. Sign up for a free account at [render.com](https://render.com)

2. Create a new Web Service:
   - Click "New" > "Web Service"
   - Connect your GitHub repository or upload your code directly
   - Select the branch to deploy

3. Configure the Web Service:
   - **Name**: `amitg-backend` (or your preferred name)
   - **Root Directory**: Leave empty if your repo root is the project root
   - **Environment**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. Add Environment Variables:
   - Click "Environment" > "Add Environment Variable"
   - Add the following:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     GEMINI_API_KEY=your_gemini_api_key_here
     BACKEND_URL=https://your-backend-url.onrender.com
     FRONTEND_URL=https://your-frontend-url.onrender.com
     ```

5. Advanced Settings:
   - Under "Advanced" settings, add a background worker:
   - Click "Add Background Worker"
   - **Start Command**: `cd backend && python keep_alive.py`
   - This will run the keep-alive script in the background

6. Click "Create Web Service"

## Frontend Deployment on Render

1. Create a new Static Site:
   - Click "New" > "Static Site"
   - Connect your GitHub repository or upload your code directly

2. Configure the Static Site:
   - **Name**: `amitg-frontend` (or your preferred name)
   - **Root Directory**: Leave empty if your repo root is the project root
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

3. Environment Variables:
   - Add the following environment variable:
   - `VITE_API_URL=https://your-backend-url.onrender.com`

4. Click "Create Static Site"

## Update Frontend API URL

Before deploying, update the API URL in your frontend code to point to your Render backend URL:

1. Create a `.env` file in your frontend directory:

```
VITE_API_URL=https://your-backend-url.onrender.com
```

2. Update your API calls in the frontend code to use this environment variable:

```javascript
// Example in a component that makes API calls
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const response = await axios.post(`${apiUrl}/analyze`, { code });
```

## Keep-Alive Mechanism

The project includes a keep-alive mechanism that pings both the backend and frontend every 2 minutes to prevent them from going inactive on Render's free tier:

1. Backend has a `/ping` endpoint that returns a simple status message
2. `keep_alive.py` script pings both services at regular intervals
3. The script runs as a background worker on Render

## Verifying Deployment

1. Visit your backend URL (e.g., `https://amitg-backend.onrender.com/ping`)
   - You should see: `{"status":"alive","message":"Server is running"}`

2. Visit your frontend URL (e.g., `https://amitg-frontend.onrender.com`)
   - You should see the AMITG web interface

3. Check the logs in Render to verify the keep-alive script is running properly

## Troubleshooting

- If the backend fails to start, check the logs in Render for errors
- Verify your API keys are correctly set in the environment variables
- If the keep-alive script isn't working, check if the background worker is running
- For frontend issues, verify the API URL is correctly set in the environment variables

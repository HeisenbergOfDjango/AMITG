# Fixed Deployment Instructions for AMITG on Render.com

I've created a special deployment configuration to solve the Rust compilation errors you're experiencing. Follow these steps to deploy your project:

## Step 1: Push the Updated Files to Your Repository

Make sure all these new files are committed and pushed to your repository:
- `backend/requirements-render.txt` - Special requirements file without Rust dependencies
- `backend/app/main_render.py` - Modified backend that uses REST API instead of the Python package
- `backend/build.sh` - Custom build script that uses the special requirements file
- `backend/runtime.txt` - Specifies Python 3.9.16
- `render.yaml` - Blueprint configuration for all services

## Step 2: Deploy Using Render Blueprint

1. **Go to Render.com Dashboard**:
   - Sign up or log in at [render.com](https://render.com)

2. **Create a New Blueprint**:
   - Click "New" in the top right
   - Select "Blueprint" from the dropdown

3. **Connect Your Repository**:
   - Select your repository from the list
   - If you don't see it, you may need to configure Render to access your repositories

4. **Review and Deploy**:
   - Render will detect the `render.yaml` file and show you the services it will create
   - Click "Apply" to start the deployment process

## Step 3: Set Environment Variables

After the initial deployment, you need to set your API keys:

1. **Go to the Backend Service**:
   - In your Render dashboard, click on the "amitg-backend" service

2. **Add Environment Variables**:
   - Click on "Environment" in the left sidebar
   - Add your API keys:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     GEMINI_API_KEY=your_gemini_api_key_here
     ```
   - Click "Save Changes"

3. **Redeploy the Service**:
   - Click "Manual Deploy" > "Deploy latest commit"

## Step 4: Verify the Deployment

1. **Check Backend Status**:
   - Visit your backend URL + `/ping` endpoint (e.g., `https://amitg-backend.onrender.com/ping`)
   - You should see: `{"status":"alive","message":"Server is running"}`

2. **Check Frontend**:
   - Visit your frontend URL (e.g., `https://amitg-frontend.onrender.com`)
   - The application should load and connect to your backend

3. **Test the Application**:
   - Try analyzing some code to ensure everything works correctly

## Troubleshooting

If you encounter any issues:

1. **Check Logs**:
   - In your Render dashboard, click on the service with issues
   - Click "Logs" to see what's happening

2. **Common Issues**:
   - **API Key Issues**: Ensure your API keys are correctly set and valid
   - **CORS Errors**: If the frontend can't connect to the backend, check CORS settings
   - **Module Not Found**: If you see import errors, check the requirements file

3. **Manual Deployment**:
   If the Blueprint approach doesn't work, you can deploy each service manually:

   a. **Backend**:
      - Create a new Web Service
      - Build Command: `cd backend && chmod +x build.sh && ./build.sh`
      - Start Command: `cd backend && uvicorn app.main_render:app --host 0.0.0.0 --port $PORT`

   b. **Keep-Alive Worker**:
      - Create a Background Worker
      - Build Command: `cd backend && chmod +x build.sh && ./build.sh`
      - Start Command: `cd backend && python keep_alive.py`

   c. **Frontend**:
      - Create a Static Site
      - Build Command: `cd frontend && npm install && npm run build`
      - Publish Directory: `frontend/dist`

## What Changed?

1. **Removed Rust Dependencies**:
   - Created a special requirements file without packages that need Rust
   - Used direct REST API calls instead of the Python package

2. **Custom Build Process**:
   - Added a build script that uses the special requirements file
   - Specified an older Python version (3.9) for better compatibility

3. **Alternative Implementation**:
   - Created a version of main.py that uses the REST API directly
   - This avoids the need for the google-generativeai package

These changes should allow your application to deploy successfully on Render's free tier without running into Rust compilation issues.

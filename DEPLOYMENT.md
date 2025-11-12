# Render.com Deployment Guide

This guide will walk you through deploying the AMITG application on Render.com's free tier.

## Prerequisites

- A GitHub account
- A Render.com account (sign up at https://render.com)
- Your Gemini API key

## Step 1: Push Your Code to GitHub

1. If you haven't already, initialize a git repository:
   ```bash
   git init
   git add .
   git commit -m "Prepare for Render deployment"
   ```

2. Create a new repository on GitHub (if you don't have one)

3. Push your code to GitHub:
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy Backend Service

1. **Log in to Render.com** and go to your Dashboard

2. **Create a New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your code

3. **Configure Backend Service**:
   - **Name**: `amitg-backend` (or any name you prefer)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install --upgrade pip && pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: Leave empty (or set to root if needed)
   - **Python Version**: Render will automatically use Python 3.11.9 from `backend/runtime.txt`

4. **Set Environment Variables**:
   Click on "Environment" tab and add:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `CORS_ORIGINS`: Leave this empty for now (we'll set it after frontend is deployed)
   - `PYTHON_VERSION`: `3.11.0` (optional, but recommended)

5. **Select Free Plan**:
   - Choose "Free" plan
   - Click "Create Web Service"

6. **Wait for Deployment**:
   - Render will build and deploy your backend
   - Note the URL (e.g., `https://amitg-backend.onrender.com`)
   - The backend will be available at this URL

## Step 3: Deploy Frontend Service

1. **Create a New Static Site**:
   - Click "New +" → "Static Site"
   - Connect the same GitHub repository

2. **Configure Frontend Service**:
   - **Name**: `amitg-frontend` (or any name you prefer)
   - **Build Command**: `cd frontend && npm install --legacy-peer-deps && npm run build`
   - **Publish Directory**: `frontend/dist`

3. **Set Environment Variables**:
   Click on "Environment" tab and add:
   - `VITE_API_URL`: Your backend URL from Step 2 (e.g., `https://amitg-backend.onrender.com`)
   - **Important**: Make sure there's no trailing slash

4. **Select Free Plan**:
   - Choose "Free" plan
   - Click "Create Static Site"

5. **Wait for Deployment**:
   - Render will build and deploy your frontend
   - Note the frontend URL (e.g., `https://amitg-frontend.onrender.com`)

## Step 4: Update CORS Settings

1. **Go back to your Backend Service** in Render dashboard

2. **Update Environment Variables**:
   - Find `CORS_ORIGINS`
   - Set it to your frontend URL (e.g., `https://amitg-frontend.onrender.com`)
   - If you have multiple origins, separate them with commas: `https://frontend1.onrender.com,https://frontend2.onrender.com`

3. **Redeploy the Backend**:
   - Click "Manual Deploy" → "Deploy latest commit"
   - This will restart the backend with the new CORS settings

## Step 5: Verify Deployment

1. **Test Backend**:
   - Visit `https://your-backend-url.onrender.com/ping`
   - You should see: `{"status": "alive", "message": "Server is running"}`

2. **Test Frontend**:
   - Visit your frontend URL
   - Try analyzing some code
   - It should connect to the backend successfully

## Important Notes

### Free Tier Limitations

- **Spinning Down**: Free services spin down after 15 minutes of inactivity. The first request after spin-down may take 30-60 seconds.
- **Build Time**: Free tier has limited build minutes per month
- **Bandwidth**: Free tier has limited bandwidth

### Keeping Services Alive (Optional)

If you want to keep your backend from spinning down, you can:
1. Use a service like UptimeRobot to ping your backend every 10-14 minutes
2. Set up a cron job (if you have a paid service)
3. Use the `/ping` endpoint for health checks

### Troubleshooting

**Backend not starting:**
- Check the logs in Render dashboard
- Verify all environment variables are set correctly
- Ensure `GEMINI_API_KEY` is valid

**Build errors with pydantic/pydantic-core:**
- The requirements.txt has been updated to use versions with pre-built wheels (pydantic 2.5.3)
- Ensure Python 3.11 is being used (check `backend/runtime.txt`)
- If you still see Rust compilation errors:
  1. Try using Python 3.11 explicitly in Render's environment settings
  2. As a fallback, use `backend/requirements-fallback.txt` which uses pydantic 1.x (no Rust required)
  3. Change the build command to: `pip install --upgrade pip && pip install -r backend/requirements-fallback.txt`

**Frontend can't connect to backend:**
- Verify `VITE_API_URL` is set correctly in frontend environment variables
- Check that `CORS_ORIGINS` in backend includes your frontend URL
- Make sure backend is deployed and running

**Build failures:**
- Check that all dependencies are in `requirements.txt` (backend) or `package.json` (frontend)
- Verify Python/Node versions are compatible
- Check build logs for specific error messages

**Frontend npm peer dependency errors:**
- The build command includes `--legacy-peer-deps` to handle version conflicts
- If you see ERESOLVE errors, ensure your build command is: `cd frontend && npm install --legacy-peer-deps && npm run build`
- The `monaco-editor` version has been set to `^0.44.0` to match `react-monaco-editor` requirements

## Alternative: Using render.yaml (Blueprints)

If you prefer, you can use the `render.yaml` file for automated setup:

1. **Push render.yaml to your repository** (already done)

2. **In Render Dashboard**:
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and create both services

3. **Configure Environment Variables**:
   - You'll still need to set `GEMINI_API_KEY` manually
   - Set `VITE_API_URL` after backend is deployed
   - Set `CORS_ORIGINS` after frontend is deployed

## Next Steps

- Set up a custom domain (optional, requires paid plan)
- Configure automatic deployments from GitHub
- Set up monitoring and alerts
- Consider upgrading to paid plan for better performance

## Support

If you encounter issues:
1. Check Render's documentation: https://render.com/docs
2. Check application logs in Render dashboard
3. Verify all environment variables are set correctly
4. Ensure your code is pushed to GitHub


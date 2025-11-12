# Fixed Deployment Guide for AMITG on Render.com

This updated guide addresses the Rust compilation issue and provides a more streamlined deployment process using Render's Blueprint feature.

## Option 1: Deploy using Render Blueprint (Recommended)

Render Blueprints allow you to define all your services in a single YAML file, making deployment much easier.

1. **Push the updated code to your repository**:
   - Make sure the `render.yaml` file is in the root directory
   - Ensure the `build.sh` script is in the backend directory
   - Verify all changes are committed and pushed

2. **Deploy using Blueprint**:
   - Go to [render.com](https://render.com) and sign up/login
   - Click "New" > "Blueprint"
   - Connect your repository
   - Render will automatically detect the `render.yaml` file
   - Review the services that will be created
   - Click "Apply" to start the deployment

3. **Set Secret Environment Variables**:
   - After the initial deployment, you'll need to set your API keys
   - Go to each service in the Render dashboard
   - Click "Environment" > "Add Secret"
   - Add your API keys:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

4. **Verify Deployment**:
   - Check all three services (backend, frontend, keep-alive)
   - Verify they're running without errors
   - Test the application by visiting the frontend URL

## Option 2: Manual Deployment

If you prefer to deploy each service individually or if the Blueprint approach doesn't work, follow these steps:

### Step 1: Deploy the Backend

1. **Create a new Web Service**:
   - Go to [render.com](https://render.com) and sign up/login
   - Click "New" > "Web Service"
   - Connect your GitHub repository

2. **Configure the service**:
   - **Name**: `amitg-backend`
   - **Runtime**: Python 3
   - **Build Command**: `cd backend && chmod +x build.sh && ./build.sh`
   - **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Environment Variables**:
   - Add Python version: `PYTHON_VERSION` = `3.11.0`
   - Add your API keys:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

4. **Create the service** and wait for deployment

### Step 2: Deploy the Keep-Alive Worker

1. **Create a Background Worker**:
   - Click "New" > "Background Worker"
   - Connect your repository

2. **Configure the worker**:
   - **Name**: `amitg-keep-alive`
   - **Runtime**: Python 3
   - **Build Command**: `cd backend && chmod +x build.sh && ./build.sh`
   - **Start Command**: `cd backend && python keep_alive.py`

3. **Environment Variables**:
   - Add Python version: `PYTHON_VERSION` = `3.11.0`
   - Add service URLs:
     ```
     BACKEND_URL=https://your-backend-url.onrender.com
     FRONTEND_URL=https://your-frontend-url.onrender.com
     ```

4. **Create the worker** and wait for deployment

### Step 3: Deploy the Frontend

1. **Create a Static Site**:
   - Click "New" > "Static Site"
   - Connect your repository

2. **Configure the static site**:
   - **Name**: `amitg-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

3. **Environment Variables**:
   - Add Node version: `NODE_VERSION` = `18.0.0`
   - Add backend URL: `VITE_API_URL` = `https://your-backend-url.onrender.com`

4. **Create the static site** and wait for deployment

## Troubleshooting

### Build Errors

If you encounter build errors related to Rust or other compilation issues:

1. **Check the build logs** for specific error messages
2. **Update the build.sh script** to address any specific package issues
3. **Try specifying different Python versions** (3.9, 3.10, or 3.11)
4. **Use `--prefer-binary` flag** for pip installations to avoid compilation

### Connection Issues

If services can't connect to each other:

1. **Verify environment variables** are correctly set
2. **Check CORS settings** in the backend
3. **Test endpoints directly** using the browser or tools like Postman

### Keep-Alive Issues

If the keep-alive mechanism isn't working:

1. **Check worker logs** for any errors
2. **Verify the URLs** are correctly set
3. **Test the ping endpoint** directly in your browser

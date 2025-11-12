FROM python:3.8-slim

WORKDIR /app

# Copy only necessary files
COPY backend/app ./app
COPY backend/keep_alive.py ./
COPY backend/env.example ./.env

# Install dependencies without using requirements.txt
RUN pip install --no-cache-dir fastapi==0.95.2 uvicorn==0.22.0 python-dotenv==1.0.0 \
    starlette==0.27.0 click==8.1.3 h11==0.14.0 pydantic==1.10.8 \
    python-multipart==0.0.6 requests==2.31.0 typing-extensions==4.5.0 \
    google-api-python-client==2.97.0 google-auth==2.22.0 google-auth-httplib2==0.1.0 \
    google-auth-oauthlib==1.0.0 idna==3.4 certifi==2023.5.7 charset-normalizer==3.1.0 \
    urllib3==2.0.3 anyio==3.7.0 sniffio==1.3.0 exceptiongroup==1.1.1

# Set environment variables
ENV PORT=8000

# Run the application
CMD ["uvicorn", "app.main_render:app", "--host", "0.0.0.0", "--port", "8000"]

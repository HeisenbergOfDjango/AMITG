import requests
import time
import os
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("keep_alive.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("keep-alive")

# Get backend and frontend URLs from environment variables or use defaults
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

def ping_service(url, service_name):
    """Ping a service and log the result"""
    try:
        start_time = time.time()
        response = requests.get(url)
        elapsed_time = time.time() - start_time
        
        if response.status_code == 200:
            logger.info(f"✅ {service_name} is up! Response time: {elapsed_time:.2f}s")
            return True
        else:
            logger.warning(f"⚠️ {service_name} returned status code {response.status_code}")
            return False
    except requests.RequestException as e:
        logger.error(f"❌ Failed to connect to {service_name}: {str(e)}")
        return False

def main():
    """Main function to ping services at regular intervals"""
    logger.info("Starting keep-alive service")
    logger.info(f"Backend URL: {BACKEND_URL}")
    logger.info(f"Frontend URL: {FRONTEND_URL}")
    
    interval = 120  # 2 minutes in seconds
    
    while True:
        logger.info("--- Pinging services ---")
        
        # Ping backend
        backend_endpoint = f"{BACKEND_URL}/ping"
        ping_service(backend_endpoint, "Backend")
        
        # Ping frontend (this will just check if the frontend is accessible)
        ping_service(FRONTEND_URL, "Frontend")
        
        logger.info(f"Sleeping for {interval} seconds...")
        time.sleep(interval)

if __name__ == "__main__":
    main()

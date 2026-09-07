import sys
import os

# Ensure the api directory is in the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from mangum import Mangum
except ImportError:
    print("Mangum is required to run on AWS Lambda. Please add it to requirements.txt.")
    raise

# Import the FastAPI app instance from index.py
from index import app

# Wrap the FastAPI app with Mangum to handle API Gateway events
handler = Mangum(app)

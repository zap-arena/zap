import os
import sys
from dotenv import load_dotenv

api_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(api_dir)
load_dotenv(os.path.join(root_dir, ".env"))

sys.path.insert(0, api_dir)

import models
from database import engine, Base

print("Connecting to DB...")
try:
    with engine.connect() as conn:
        print("Connected!")
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")
except Exception as e:
    print(f"Error: {e}")

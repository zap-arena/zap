import os
import sys

from dotenv import load_dotenv

_API_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, _API_DIR)
load_dotenv(os.path.join(_API_DIR, ".env"))
load_dotenv(os.path.join(os.path.dirname(_API_DIR), ".env"))

from database import engine
from sqlalchemy import text

if engine is not None:
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE quizzes ADD COLUMN category VARCHAR(100) DEFAULT 'General'"))
            conn.commit()
            print("Successfully added category column")
        except Exception as e:
            print("Error or already exists:", e)

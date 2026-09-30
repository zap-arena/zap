"""
Run this once to create the quiz-related tables:
  api/.venv/bin/python api/create_quiz_tables.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

# Load .env file manually
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
if os.path.exists(dotenv_path):
    with open(dotenv_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                os.environ.setdefault(k.strip(), v.strip())

from database import engine, Base
import models  # noqa: F401

if engine is None:
    print("ERROR: DATABASE_URL not set.")
    sys.exit(1)

print("Creating quiz tables (checkfirst=True – safe to re-run)...")
with engine.begin() as conn:
    Base.metadata.create_all(bind=conn, checkfirst=True)
print("Done!")

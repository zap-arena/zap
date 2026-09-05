import os
from dotenv import load_dotenv
# pyrefly: ignore [missing-import]
import sqlalchemy as sa

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = "postgresql://" + DATABASE_URL[len("postgres://"):]
if DATABASE_URL and DATABASE_URL.startswith("postgresql://") and "+psycopg" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

print("Connecting to:", DATABASE_URL)
engine = sa.create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        conn.execute(sa.text("ALTER TABLE problems ADD COLUMN type VARCHAR(20) DEFAULT 'coding'"))
        conn.commit()
        print("Added type column.")
except Exception as e:
    print("Could not add type column:", e)

try:
    with engine.connect() as conn:
        conn.execute(sa.text("ALTER TABLE problems ADD COLUMN debugging_data JSON"))
        conn.commit()
        print("Added debugging_data column.")
except Exception as e:
    print("Could not add debugging_data column:", e)

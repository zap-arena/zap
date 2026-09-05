import sys
import os
from dotenv import load_dotenv
load_dotenv()
sys.path.append('api')
from database import SessionLocal
import models
import json

db = SessionLocal()
admin = db.query(models.User).filter_by(role="admin").first()

debugging_data = {
    "columns": ["Line", "Variable", "Value"],
    "rows": [
        {"id": "1", "Line": "10", "Variable": "i", "Value": "0"},
        {"id": "2", "Line": "11", "Variable": "sum", "Value": "0"},
        {"id": "3", "Line": "12", "Variable": "i", "Value": "1"}
    ]
}

p = models.Problem(
    title="Sample Debugging Problem",
    slug="sample-debugging-problem-1",
    difficulty="Easy",
    description="This is a generated debugging problem.",
    type="debugging",
    debugging_data=debugging_data,
    created_by=admin.id if admin else "system"
)

db.add(p)
try:
    db.commit()
    print("Created debugging problem with ID:", p.id)
except Exception as e:
    print("Error:", e)

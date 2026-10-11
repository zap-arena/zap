"""Seed the SQL Basics, DDL, DML and SELECT quiz into the database."""
import json
import os
import sys
import uuid
from pathlib import Path
from dotenv import load_dotenv

_API_DIR = os.path.dirname(os.path.abspath(__file__))
_ROOT_DIR = os.path.dirname(_API_DIR)
sys.path.insert(0, _API_DIR)

load_dotenv(os.path.join(_ROOT_DIR, ".env"))
load_dotenv(os.path.join(_API_DIR, ".env"))

import models
from database import SessionLocal, engine
from sqlalchemy import select

QUIZ_FILE = Path(_ROOT_DIR) / "course-materials" / "sql_basics_ddl_dml_quiz.json"

def seed_sql_quiz():
    if not engine or not SessionLocal:
        print("DATABASE_URL not configured.")
        return

    with open(QUIZ_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    db = SessionLocal()
    try:
        title = data["title"]
        # Check if quiz with this title already exists
        existing = db.scalar(select(models.Quiz).where(models.Quiz.title == title))
        if existing:
            print(f"Updating existing quiz: {existing.id} ({title})")
            quiz = existing
            quiz.description = data.get("description", "")
            quiz.category = data.get("category", "SQL")
            quiz.status = data.get("status", "active")
            db.query(models.QuizQuestion).filter(models.QuizQuestion.quiz_id == quiz.id).delete()
        else:
            quiz = models.Quiz(
                id=uuid.uuid4().hex,
                title=title,
                description=data.get("description", ""),
                category=data.get("category", "SQL"),
                status=data.get("status", "active"),
            )
            db.add(quiz)
            db.flush()
            print(f"Created new quiz: {quiz.id} ({title})")

        for idx, q in enumerate(data.get("questions", [])):
            question = models.QuizQuestion(
                id=uuid.uuid4().hex,
                quiz_id=quiz.id,
                text=q["text"],
                options=q["options"],
                correct_option_index=q["correctOptionIndex"],
                explanation=q.get("explanation", ""),
                order=idx,
            )
            db.add(question)

        db.commit()
        print(f"Successfully seeded {len(data['questions'])} SQL quiz questions into database!")
    except Exception as e:
        db.rollback()
        print("Failed to seed quiz:", e)
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_sql_quiz()

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
import uuid

import models
from database import get_db
from deps import get_current_user

router = APIRouter(prefix="/api/quizzes", tags=["quizzes"])


# ─── All current user submissions (for quiz list page) ───────────────────────
@router.get("/submissions/me")
def get_all_my_submissions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    submissions = db.scalars(
        select(models.QuizSubmission).where(
            models.QuizSubmission.user_id == current_user.id
        )
    ).all()
    return [
        {
            "id": s.id,
            "quiz_id": s.quiz_id,
            "score": s.score,
            "total_questions": s.total_questions,
            "answers": s.answers,
            "submitted_at": s.submitted_at,
        }
        for s in submissions
    ]


# ─── Quiz list ────────────────────────────────────────────────────────────────
@router.get("")
def list_quizzes(db: Session = Depends(get_db)):
    quizzes = db.scalars(select(models.Quiz)).all()
    result = []
    for quiz in quizzes:
        questions = db.scalars(
            select(models.QuizQuestion).where(models.QuizQuestion.quiz_id == quiz.id)
        ).all()
        result.append({
            "id": quiz.id,
            "title": quiz.title,
            "description": quiz.description,
            "status": quiz.status,
            "createdAt": quiz.created_at,
            "questions": [
                {
                    "id": q.id,
                    "text": q.text,
                    "options": q.options,
                    "correctOptionIndex": q.correct_option_index,
                    "explanation": q.explanation,
                }
                for q in questions
            ],
        })
    return result


# ─── Create quiz (admin) ──────────────────────────────────────────────────────
@router.post("")
def create_quiz(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    quiz = models.Quiz(
        id=payload.get("id", uuid.uuid4().hex),
        title=payload["title"],
        description=payload.get("description", ""),
        status=payload.get("status", "active"),
    )
    for i, q_data in enumerate(payload.get("questions", [])):
        question = models.QuizQuestion(
            id=q_data.get("id", uuid.uuid4().hex),
            text=q_data["text"],
            options=q_data["options"],
            correct_option_index=q_data["correctOptionIndex"],
            explanation=q_data.get("explanation", ""),
            order=i,
        )
        quiz.questions.append(question)

    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return {"id": quiz.id, "title": quiz.title}


# ─── Get single quiz ──────────────────────────────────────────────────────────
@router.get("/{quiz_id}")
def get_quiz(quiz_id: str, db: Session = Depends(get_db)):
    quiz = db.scalar(select(models.Quiz).where(models.Quiz.id == quiz_id))
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions = db.scalars(
        select(models.QuizQuestion)
        .where(models.QuizQuestion.quiz_id == quiz_id)
        .order_by(models.QuizQuestion.order)
    ).all()

    return {
        "id": quiz.id,
        "title": quiz.title,
        "description": quiz.description,
        "status": quiz.status,
        "createdAt": quiz.created_at,
        "questions": [
            {
                "id": q.id,
                "text": q.text,
                "options": q.options,
                "correctOptionIndex": q.correct_option_index,
                "explanation": q.explanation,
                "order": q.order,
            }
            for q in questions
        ],
    }


# ─── Delete quiz (admin) ──────────────────────────────────────────────────────
@router.delete("/{quiz_id}")
def delete_quiz(
    quiz_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    quiz = db.scalar(select(models.Quiz).where(models.Quiz.id == quiz_id))
    if quiz:
        db.delete(quiz)
        db.commit()
    return {"ok": True}


# ─── Submit quiz ──────────────────────────────────────────────────────────────
@router.post("/{quiz_id}/submit")
def submit_quiz(
    quiz_id: str,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Prevent double submission
    existing = db.scalar(
        select(models.QuizSubmission)
        .where(models.QuizSubmission.quiz_id == quiz_id)
        .where(models.QuizSubmission.user_id == current_user.id)
    )
    if existing:
        raise HTTPException(status_code=409, detail="Already submitted")

    submission = models.QuizSubmission(
        id=payload.get("id", uuid.uuid4().hex),
        quiz_id=quiz_id,
        user_id=current_user.id,
        answers=payload.get("answers", {}),
        score=payload.get("score", 0),
        total_questions=payload.get("totalQuestions", 0),
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return {
        "id": submission.id,
        "quiz_id": submission.quiz_id,
        "score": submission.score,
        "total_questions": submission.total_questions,
        "answers": submission.answers,
        "submitted_at": submission.submitted_at,
    }


# ─── Get my submission for a specific quiz ────────────────────────────────────
@router.get("/{quiz_id}/submissions/me")
def get_my_submission(
    quiz_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    submission = db.scalar(
        select(models.QuizSubmission)
        .where(models.QuizSubmission.quiz_id == quiz_id)
        .where(models.QuizSubmission.user_id == current_user.id)
    )
    if not submission:
        raise HTTPException(status_code=404, detail="No submission found")
    return {
        "id": submission.id,
        "quiz_id": submission.quiz_id,
        "score": submission.score,
        "total_questions": submission.total_questions,
        "answers": submission.answers,
        "submitted_at": submission.submitted_at,
    }

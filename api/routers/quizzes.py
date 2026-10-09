from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.orm import Session
import uuid

from typing import Optional
import models
from database import get_db
from deps import get_current_user, get_optional_user

router = APIRouter(prefix="/api/quizzes", tags=["quizzes"])


def _clean_id(val: Optional[str]) -> str:
    """Strip dashes from UUID strings so they fit in String(32) columns."""
    if val:
        return val.replace("-", "")
    return uuid.uuid4().hex



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
def list_quizzes(
    skip: int = 0,
    limit: int = 100,
    filter: str = "all",
    category: str = "all",
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_user),
):
    query = select(models.Quiz)

    if current_user and filter != "all":
        # Subquery to check if user has submitted the quiz
        submitted_subquery = (
            select(models.QuizSubmission.quiz_id)
            .where(models.QuizSubmission.user_id == current_user.id)
        )
        
        if filter == "completed":
            query = query.where(models.Quiz.id.in_(submitted_subquery))
        elif filter == "pending":
            query = query.where(models.Quiz.id.not_in(submitted_subquery))
            
    if category and category != "all":
        query = query.where(models.Quiz.category == category)

    total = db.scalar(select(func.count()).select_from(query.subquery()))
    quizzes = db.scalars(query.offset(skip).limit(limit)).all()
    
    result = []
    for quiz in quizzes:
        questions = db.scalars(
            select(models.QuizQuestion).where(models.QuizQuestion.quiz_id == quiz.id)
        ).all()
        result.append({
            "id": quiz.id,
            "title": quiz.title,
            "description": quiz.description,
            "category": quiz.category,
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
    return {"data": result, "total": total}


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
        id=_clean_id(payload.get("id")),
        title=payload["title"],
        description=payload.get("description", ""),
        category=payload.get("category", "General"),
        status=payload.get("status", "active"),
    )
    for i, q_data in enumerate(payload.get("questions", [])):
        question = models.QuizQuestion(
            id=_clean_id(q_data.get("id")),
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
        "category": quiz.category,
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
        id=_clean_id(payload.get("id")),
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


# ─── Leaderboard ──────────────────────────────────────────────────────────────
@router.get("/{quiz_id}/leaderboard")
def get_quiz_leaderboard(quiz_id: str, db: Session = Depends(get_db)):
    submissions = db.scalars(
        select(models.QuizSubmission)
        .where(models.QuizSubmission.quiz_id == quiz_id)
        .order_by(models.QuizSubmission.score.desc(), models.QuizSubmission.submitted_at.asc())
        .limit(10)
    ).all()

    return [
        {
            "userId": s.user.id,
            "userName": s.user.name,
            "score": s.score,
            "totalQuestions": s.total_questions,
            "submittedAt": s.submitted_at,
        }
        for s in submissions
    ]


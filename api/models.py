import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean, DateTime, Float, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def gen_id() -> str:
    return uuid.uuid4().hex


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=gen_id)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="user")  # admin | user
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)


class Problem(Base):
    __tablename__ = "problems"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=gen_id)
    title: Mapped[str] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True)
    difficulty: Mapped[str] = mapped_column(String(20), default="Easy")
    description: Mapped[str] = mapped_column(Text, default="")
    input_format: Mapped[str] = mapped_column(Text, default="")
    output_format: Mapped[str] = mapped_column(Text, default="")
    constraints: Mapped[str] = mapped_column(Text, default="")
    examples: Mapped[list] = mapped_column(JSON, default=list)
    tags: Mapped[list] = mapped_column(JSON, default=list)
    languages: Mapped[list] = mapped_column(JSON, default=list)
    boilerplates: Mapped[dict] = mapped_column(JSON, default=dict)
    time_limit: Mapped[int] = mapped_column(Integer, default=2)
    memory_limit: Mapped[int] = mapped_column(Integer, default=256)
    max_score: Mapped[int] = mapped_column(Integer, default=100)
    status: Mapped[str] = mapped_column(String(20), default="active")  # active | archived
    created_by: Mapped[str] = mapped_column(String(32), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    test_cases: Mapped[list["TestCase"]] = relationship(back_populates="problem", cascade="all, delete-orphan")


class TestCase(Base):
    __tablename__ = "test_cases"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=gen_id)
    problem_id: Mapped[str] = mapped_column(String(32), ForeignKey("problems.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(120), default="Test case")
    input: Mapped[str] = mapped_column(Text, default="")
    expected_output: Mapped[str] = mapped_column(Text, default="")
    hidden: Mapped[bool] = mapped_column(Boolean, default=False)
    marks: Mapped[int] = mapped_column(Integer, default=0)
    order: Mapped[int] = mapped_column(Integer, default=0)

    problem: Mapped["Problem"] = relationship(back_populates="test_cases")


class Contest(Base):
    __tablename__ = "contests"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=gen_id)
    name: Mapped[str] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True)
    description: Mapped[str] = mapped_column(Text, default="")
    instructions: Mapped[str] = mapped_column(Text, default="")
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    duration: Mapped[int] = mapped_column(Integer, default=60)  # minutes
    status: Mapped[str] = mapped_column(String(20), default="draft")
    scoring_mode: Mapped[str] = mapped_column(String(20), default="partial")  # full | partial
    leaderboard_visible: Mapped[bool] = mapped_column(Boolean, default=True)
    created_by: Mapped[str] = mapped_column(String(32), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)

    problems: Mapped[list["ContestProblem"]] = relationship(back_populates="contest", cascade="all, delete-orphan")
    moderators: Mapped[list["ContestModerator"]] = relationship(back_populates="contest", cascade="all, delete-orphan")


class ContestModerator(Base):
    __tablename__ = "contest_moderators"
    __table_args__ = (UniqueConstraint("contest_id", "user_id", name="uq_contest_moderator"),)

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=gen_id)
    contest_id: Mapped[str] = mapped_column(String(32), ForeignKey("contests.id", ondelete="CASCADE"))
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id", ondelete="CASCADE"))

    contest: Mapped["Contest"] = relationship(back_populates="moderators")
    user: Mapped["User"] = relationship()


class ContestProblem(Base):
    __tablename__ = "contest_problems"
    __table_args__ = (UniqueConstraint("contest_id", "problem_id", name="uq_contest_problem"),)

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=gen_id)
    contest_id: Mapped[str] = mapped_column(String(32), ForeignKey("contests.id", ondelete="CASCADE"))
    problem_id: Mapped[str] = mapped_column(String(32), ForeignKey("problems.id", ondelete="CASCADE"))
    order: Mapped[int] = mapped_column(Integer, default=0)
    max_score: Mapped[int] = mapped_column(Integer, default=100)

    contest: Mapped["Contest"] = relationship(back_populates="problems")
    problem: Mapped["Problem"] = relationship()


class ContestParticipant(Base):
    __tablename__ = "contest_participants"
    __table_args__ = (UniqueConstraint("contest_id", "user_id", name="uq_contest_user"),)

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=gen_id)
    contest_id: Mapped[str] = mapped_column(String(32), ForeignKey("contests.id", ondelete="CASCADE"))
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id", ondelete="CASCADE"))
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="not_started")
    score: Mapped[int] = mapped_column(Integer, default=0)
    problems_solved: Mapped[int] = mapped_column(Integer, default=0)
    total_submissions: Mapped[int] = mapped_column(Integer, default=0)


class CodeDraft(Base):
    __tablename__ = "code_drafts"
    __table_args__ = (UniqueConstraint("contest_id", "problem_id", "user_id", name="uq_draft"),)

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=gen_id)
    contest_id: Mapped[str] = mapped_column(String(32), ForeignKey("contests.id", ondelete="CASCADE"))
    problem_id: Mapped[str] = mapped_column(String(32), ForeignKey("problems.id", ondelete="CASCADE"))
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id", ondelete="CASCADE"))
    language: Mapped[str] = mapped_column(String(20))
    source_code: Mapped[str] = mapped_column(Text, default="")
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)


class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=gen_id)
    contest_id: Mapped[str] = mapped_column(String(32), ForeignKey("contests.id", ondelete="CASCADE"), nullable=True)
    problem_id: Mapped[str] = mapped_column(String(32), ForeignKey("problems.id", ondelete="CASCADE"))
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id", ondelete="CASCADE"))
    language: Mapped[str] = mapped_column(String(20))
    source_code: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(30), default="QUEUED")
    passed_tests: Mapped[int] = mapped_column(Integer, default=0)
    total_tests: Mapped[int] = mapped_column(Integer, default=0)
    score: Mapped[int] = mapped_column(Integer, default=0)
    execution_time: Mapped[float] = mapped_column(Float, default=0)
    memory_usage: Mapped[float] = mapped_column(Float, default=0)
    compile_output: Mapped[str] = mapped_column(Text, nullable=True)
    # Submitted after the contest ended: kept for audit, excluded from scores and leaderboard.
    is_late: Mapped[bool] = mapped_column(Boolean, default=False)
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)


class SubmissionTestResult(Base):
    __tablename__ = "submission_test_results"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=gen_id)
    submission_id: Mapped[str] = mapped_column(String(32), ForeignKey("submissions.id", ondelete="CASCADE"))
    test_case_id: Mapped[str] = mapped_column(String(32), nullable=True)
    name: Mapped[str] = mapped_column(String(120), default="Test case")
    status: Mapped[str] = mapped_column(String(30))
    execution_time: Mapped[float] = mapped_column(Float, default=0)
    error_message: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)


class ContestActivityLog(Base):
    __tablename__ = "contest_activity_logs"
    __table_args__ = (UniqueConstraint("user_id", "client_event_id", name="uq_activity_client_event"),)

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=gen_id)
    contest_id: Mapped[str] = mapped_column(String(32), nullable=True)
    user_id: Mapped[str] = mapped_column(String(32), nullable=True)
    problem_id: Mapped[str] = mapped_column(String(32), nullable=True)
    submission_id: Mapped[str] = mapped_column(String(32), nullable=True)
    event_type: Mapped[str] = mapped_column(String(60))
    event_metadata: Mapped[dict] = mapped_column(JSON, default=dict)
    # Client-generated id; lets a retried batch be inserted at most once.
    client_event_id: Mapped[str] = mapped_column(String(64), nullable=True)
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)


class ContestNotification(Base):
    __tablename__ = "contest_notifications"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=gen_id)
    contest_id: Mapped[str] = mapped_column(String(32), ForeignKey("contests.id", ondelete="CASCADE"))
    message: Mapped[str] = mapped_column(Text)
    created_by: Mapped[str] = mapped_column(String(32), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)


class RateLimit(Base):
    """Shared rate-limit counters; one row per identity per time window."""

    __tablename__ = "rate_limits"

    bucket: Mapped[str] = mapped_column(String(80), primary_key=True)
    hits: Mapped[int] = mapped_column(Integer, default=0)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)


class ExecutionLog(Base):
    __tablename__ = "execution_logs"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=gen_id)
    submission_id: Mapped[str] = mapped_column(String(32), nullable=True)
    user_id: Mapped[str] = mapped_column(String(32), nullable=True)
    problem_id: Mapped[str] = mapped_column(String(32), nullable=True)
    language: Mapped[str] = mapped_column(String(20), nullable=True)
    execution_duration: Mapped[float] = mapped_column(Float, default=0)
    passed_tests: Mapped[int] = mapped_column(Integer, default=0)
    failed_tests: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(30))
    error_type: Mapped[str] = mapped_column(String(60), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)

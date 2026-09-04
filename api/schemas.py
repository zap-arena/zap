from typing import Optional
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, EmailStr, Field, field_validator

Language = Literal["c", "cpp", "java", "python"]
Difficulty = Literal["Easy", "Medium", "Hard"]


# ---------- Auth ----------
class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    token: str
    user: UserOut


# ---------- Problems ----------
class ExampleIn(BaseModel):
    input: str = ""
    output: str = ""
    explanation: Optional[str] = None


class TestCaseIn(BaseModel):
    id: Optional[str] = None
    name: str = "Test case"
    input: str = ""
    expectedOutput: str = ""
    hidden: bool = False
    marks: int = 0


class TestCaseOut(TestCaseIn):
    id: str


class ProblemIn(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    difficulty: Difficulty = "Easy"
    description: str = ""
    inputFormat: str = ""
    outputFormat: str = ""
    constraints: str = ""
    examples: list[ExampleIn] = []
    tags: list[str] = []
    languages: list[Language] = ["cpp", "python"]
    boilerplates: dict[str, str] = {}
    testCases: list[TestCaseIn] = []
    timeLimit: int = Field(default=2, ge=1, le=15)
    memoryLimit: int = Field(default=256, ge=16, le=1024)
    maxScore: int = Field(default=100, ge=0, le=10000)
    status: Literal["active", "archived"] = "active"


class ProblemOut(BaseModel):
    id: str
    title: str
    slug: str
    difficulty: str
    description: str
    inputFormat: str
    outputFormat: str
    constraints: str
    examples: list[dict]
    tags: list[str]
    languages: list[str]
    boilerplates: dict
    testCases: list[dict]
    timeLimit: int
    memoryLimit: int
    maxScore: int
    status: str
    createdAt: str


class ProblemSummaryOut(BaseModel):
    id: str
    title: str
    slug: str
    difficulty: str
    tags: list[str]
    languages: list[str]
    status: str


# ---------- Contests ----------
class ContestProblemIn(BaseModel):
    problemId: str
    order: int = 0
    maxScore: int = 100


class ContestIn(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: str = ""
    instructions: str = ""
    startTime: datetime
    endTime: datetime
    duration: int = Field(default=60, ge=5, le=1440)
    scoringMode: Literal["full", "partial"] = "partial"
    leaderboardVisible: bool = True
    problems: list[ContestProblemIn] = []
    moderatorIds: list[str] = []

    @field_validator("endTime")
    @classmethod
    def end_after_start(cls, v, info):
        start = info.data.get("startTime")
        if start and v <= start:
            raise ValueError("endTime must be after startTime")
        return v


PROCTOR_EVENTS = Literal[
    "ESCAPE_PRESSED",
    "FULLSCREEN_EXITED",
    "FULLSCREEN_ENTERED",
    "TAB_HIDDEN",
    "TAB_VISIBLE",
    "WINDOW_BLUR",
    "WINDOW_FOCUS",
    "COPY_BLOCKED",
    "PASTE_BLOCKED",
    "CUT_BLOCKED",
    "CONTEXT_MENU_BLOCKED",
    "DEVTOOLS_ATTEMPT",
]


class ProctorEventIn(BaseModel):
    clientEventId: str = Field(min_length=1, max_length=64)
    type: PROCTOR_EVENTS
    occurredAt: datetime
    problemId: Optional[str] = None
    metadata: dict = {}


class ProctorBatchIn(BaseModel):
    events: list[ProctorEventIn] = Field(min_length=1, max_length=50)


class NotificationIn(BaseModel):
    message: str = Field(min_length=1, max_length=1000)


class ContestOut(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    startTime: str
    endTime: str
    duration: int
    status: str
    scoringMode: str
    leaderboardVisible: bool
    problems: list[dict]
    createdAt: str


# ---------- Submissions / Run ----------
class RunRequest(BaseModel):
    problemId: str
    contestId: Optional[str] = None
    language: Language
    code: str = Field(min_length=1, max_length=30000)
    stdin: str = Field(default="", max_length=12000)


class SubmitRequest(BaseModel):
    problemId: str
    contestId: Optional[str] = None
    language: Language
    code: str = Field(min_length=1, max_length=30000)


class DraftIn(BaseModel):
    language: Language
    sourceCode: str = Field(default="", max_length=30000)

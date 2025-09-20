from pydantic import BaseModel
from typing import Optional

class AnswerPayload(BaseModel):
    question_id: str
    text: Optional[str]
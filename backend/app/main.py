from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Excel Mock Interviewer - PoC")

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

class SessionCreateResponse(BaseModel):
	session_id: str

class AnswerPayload(BaseModel):
	question_id: str
	text: Optional[str] = None
	
SESSIONS = {}

@app.post("/session", response_model=SessionCreateResponse)
async def create_session(candidate_name: Optional[str] = Form(None)):
	import uuid
	sid = "sess_" + uuid.uuid4().hex[:8]
	SESSIONS[sid] = {
		"candidate": candidate_name or "anonymous",
		"questions": [],
		"answers": [],
		"scores": [],
	}
	return {"session_id": sid}

@app.get("/session/{sid}/question")
async def get_next_question(sid: str):
	
	script = [
		{"id": "intro", "text": "Hi — I am the Excel Mock Interviewer. We'll do 3 questions. Ready?"},
		{"id": "q1", "text": "Q1: How would you count unique customers in a column? (Give formula or steps)"},
		{"id": "q2", "text": "Q2: How would you remove duplicate rows keeping the first occurrence?"},
		{"id": "q3", "text": "Q3 (Practical): Upload an Excel file where column 'Amount' sum must equal 1000. We'll check it."},
		{"id": "done", "text": "Thanks — that finishes the interview. We'll generate a report now."}
	]
	sess = SESSIONS.get(sid)
	if not sess:
		return {"error": "session_not_found"}
	
	answered_ids = [a["question_id"] for a in sess["answers"]]
	for q in script:
		if q["id"] not in answered_ids:
			return q
	return {"id": "done", "text": "Thanks — that finishes the interview. We'll generate a report now."}

from fastapi import Body
@app.post("/session/{sid}/answer")
async def submit_answer(sid: str, payload: AnswerPayload):
    sess = SESSIONS.get(sid)
    if not sess:
        return {"error": "session_not_found"}
    sess["answers"].append({"question_id": payload.question_id, "text": payload.text})
    return {"status": "ok"}
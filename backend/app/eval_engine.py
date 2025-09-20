import os

OPENAI_KEY = os.getenv("OPENAI_API_KEY")
USE_OPENAI = bool(OPENAI_KEY)

def simple_heuristic_check(question_id, text):
	text = (text or "").lower()
	score = 0
	if question_id == "q1":
		if "unique" in text or "countunique" in text or "=unique" in text:
			score = 9
		elif "countif" in text:
			score = 4
		else:
			score = 2
	elif question_id == "q2":
		if "remove duplicates" in text or "=unique" in text:
			score = 8
		else:
			score = 3
	else:
		score = 5
	return {"score": score, "notes": "heuristic"}

def evaluate_answer(question_id, text):
	
	if USE_OPENAI:
		try:
			import openai
			openai.api_key = OPENAI_KEY
			system = "You are an expert Excel interviewer. Score answers 0-10 and return JSON with keys: score, explanation."
			prompt = f"Question ID: {question_id}\nCandidate answer: {text}\nProvide a JSON:\n{{\"score\": <0-10>, \"explanation\": \"...\"}}"
			resp = openai.ChatCompletion.create(
				model="gpt-4o-mini",
				messages=[{"role": "system", "content": system}, {"role": "user", "content": prompt}],
				temperature=0.0,
				max_tokens=200,
			)
			out = resp.choices[0].message.content
			
			import json
			try:
				parsed = json.loads(out)
				return parsed
			except Exception:
				
				return {"score": 6, "explanation": "Could not parse model output; defaulted."}
		except Exception as e:
			return {"score": 5, "explanation": f"OpenAI call failed: {e}"}
	else:
		
		return simple_heuristic_check(question_id, text)
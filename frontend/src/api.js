const fakeQuestions = [
  { id: "q1", text: "What is VLOOKUP in Excel?" },
  { id: "q2", text: "Explain INDEX/MATCH usage." },
  { id: "q3", text: "How do you create a Pivot Table?" },
  { id: "done", text: "Interview completed!" },
];
const API_BASE = "https://ai-interview-qu5v.onrender.com";
let qIndex = 0;

export async function createSession({ name }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      qIndex = 0; 
      resolve({ session_id: "sess_mock_123" });
    }, 300);
  });
}

export async function fetchNextQuestion(sid, lastAnswer = null) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (qIndex >= fakeQuestions.length) return resolve(null);
      resolve(fakeQuestions[qIndex++]);
    }, 500); 
  });
}

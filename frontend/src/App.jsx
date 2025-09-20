import React, { useState } from "react";
import { createSession, fetchNextQuestion } from "./api";
import Transcript from "./components/Transcript";
import Interview from "./components/Interview";
import Report from "./components/Report";


function heuristicsEvaluate(answer) {
  const keywords = [
    "vlookup","xlookup","index","match","pivot","sumif","sumifs","countif",
    "iferror","filter","unique","sort","macro","vba","powerquery","pivot table","chart"
  ];

  if (!answer || answer.trim().length === 0)
    return { score: 0, notes: ["No answer provided"] };

  const low = answer.toLowerCase();
  let matches = 0;
  for (const k of keywords) if (low.includes(k)) matches++;

  const formulaLike = (low.match(/=\w+\([^)]*\)/g) || []).length;
  const lengthScore = Math.min(1, Math.log10(Math.max(1, answer.trim().length)) / 2);
  const keywordScore = Math.min(1, matches / 5);
  const formulaScore = Math.min(1, formulaLike / 2);

  const score = Math.round((0.4 * lengthScore + 0.4 * keywordScore + 0.2 * formulaScore) * 100);

  const notes = [];
  if (matches === 0)
    notes.push("No Excel keywords detected; consider using functions like VLOOKUP, INDEX/MATCH, Pivot Tables.");
  else notes.push(`Detected ${matches} Excel keyword(s).`);
  if (formulaLike > 0) notes.push(`Found ${formulaLike} formula-like snippet(s).`);
  if (answer.trim().length < 40) notes.push("Answer is short — provide step-by-step approach and example formulas.");

  return { score, notes };
}

function formatISO(d = new Date()) { return d.toISOString(); }


export default function App() {
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [answerDraft, setAnswerDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [localEval, setLocalEval] = useState(null);
  const [finished, setFinished] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  function pushTranscript(role, text, meta = {}) {
    setTranscript((t) => [...t, { role, text, time: formatISO(), meta }]);
  }

  async function startSession() {
    setError(null);
    if (!candidateName) { setError("Enter candidate name"); return; }
    setLoading(true);
    try {
      const data = await createSession({ name: candidateName });
      const sid = data.session_id;
      if (!sid) throw new Error("No session_id in response");
      setSessionId(sid);
      pushTranscript("system", `Session started: ${sid}`);
      await loadNextQuestion(sid);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally { setLoading(false); }
  }

  function handleNewQuestion(question) {
    setCurrentQuestion(question);
    pushTranscript("interviewer", question.text, { qid: question.id });
  }

  async function loadNextQuestion(sid) {
    setError(null);
    setLoading(true);
    try {
      const q = await fetchNextQuestion(sid);
      if (!q) {
        setFinished(true);
        setCurrentQuestion(null);
        pushTranscript("system", "Interview finished");
        setReport(makeReport(transcript));
      } else if (q.id === "done") {
        setFinished(true);
        setCurrentQuestion(null);
        pushTranscript("interviewer", q.text);
        setReport(makeReport(transcript));
      } else {
        handleNewQuestion(q);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally { setLoading(false); }
  }

  function makeReport(transcriptState) {
    const candidateMsgs = transcriptState.filter((t) => t.role === "candidate");
    const avgLen = Math.round(
      (candidateMsgs.reduce((s, m) => s + m.text.length, 0) || 0) /
      Math.max(1, candidateMsgs.length)
    );
    const lastEval = localEval || heuristicsEvaluate(candidateMsgs.map((m) => m.text).join("\n"));
    return {
      generatedAt: formatISO(),
      candidate: { name: candidateName, email: candidateEmail },
      questionsAnswered: candidateMsgs.length,
      averageAnswerLength: avgLen,
      localScoreEstimate: lastEval.score,
      localNotes: lastEval.notes,
      transcript: transcriptState
    };
  }

  async function submitAnswer() {
    if (!answerDraft.trim()) return;
    const text = answerDraft.trim();
    pushTranscript("candidate", text, { qid: currentQuestion?.id });
    const evalRes = heuristicsEvaluate(text);
    setLocalEval(evalRes);
    pushTranscript("system", `Local evaluation: ${evalRes.score}`);
    setAnswerDraft("");
    if (!sessionId) { setError("No session id"); return; }
    await loadNextQuestion(sessionId);
  }

  function downloadReport() {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${sessionId || "nosession"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function resetAll() {
    setCandidateName(""); setCandidateEmail(""); setSessionId(null);
    setCurrentQuestion(null); setTranscript([]); setAnswerDraft("");
    setLocalEval(null); setFinished(false); setReport(null); setError(null);
  }

  return (
    <div className="app" style={{ padding: 18 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1>AI-Powered Excel Mock Interviewer</h1>
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              Frontend PoC — multi-file. Update <code>src/api.js</code> if backend differs.
            </div>
          </div>
          <div><button className="btn" onClick={resetAll}>Reset</button></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginTop: 16 }}>
          <div>
            <div className="card" style={{ marginBottom: 12 }}>
              <h3>Candidate</h3>
              <div style={{ marginTop: 8 }}>
                <label className="small">Name</label>
                <input className="input" value={candidateName} onChange={(e)=>setCandidateName(e.target.value)} placeholder="e.g. Jalaj Pandey" />
              </div>
              <div style={{ marginTop: 8 }}>
                <label className="small">Email (optional)</label>
                <input className="input" value={candidateEmail} onChange={(e)=>setCandidateEmail(e.target.value)} placeholder="email@example.com" />
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button className="btn" onClick={startSession} disabled={loading || !!sessionId}>Start Interview</button>
                <button className="btn secondary" onClick={() => { if(currentQuestion) setAnswerDraft(currentQuestion.text); }}>Repeat Q</button>
              </div>

              <div style={{ marginTop: 10 }} className="small">
                <div>Session: <strong>{sessionId || "not started"}</strong></div>
                <div>Questions answered: {transcript.filter(t=>t.role==="candidate").length}</div>
                <div>Local score: {localEval ? `${localEval.score}/100` : "—"}</div>
                {error && <div style={{ color: "crimson", marginTop: 6 }}>{error}</div>}
              </div>
            </div>

            <Transcript transcript={transcript} />
          </div>

          <div>
            <Interview
              sessionId={sessionId}
              currentQuestion={currentQuestion}
              answerDraft={answerDraft}
              setAnswerDraft={setAnswerDraft}
              onSubmitAnswer={submitAnswer}
              loading={loading}
              localEval={localEval}
            />
            {report && <Report report={report} onDownload={downloadReport} />}
          </div>
        </div>
      </div>
    </div>
  );
}

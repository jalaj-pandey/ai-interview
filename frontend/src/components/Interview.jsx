import React, { useRef } from "react";

export default function Interview({
  sessionId,
  currentQuestion,
  answerDraft,
  setAnswerDraft,
  onSubmitAnswer,
  loading,
  localEval
}) {
  const ta = useRef(null);

  return (
    <div>
      <div className="card">
        <h3>Interview Flow</h3>

        {!sessionId && (
          <div className="small" style={{ marginTop: 8 }}>
            Start a session to receive questions.
          </div>
        )}

        {sessionId && (
          <div style={{ marginTop: 8 }}>
            {currentQuestion ? (
              <>
                <div className="small">Interviewer</div>
                <div
                  style={{
                    marginTop: 8,
                    padding: 10,
                    borderRadius: 8,
                    background: "#f9fafb",
                  }}
                >
                  {currentQuestion.text}
                </div>

                <div style={{ marginTop: 10 }}>
                  <div className="small">Your answer</div>
                  <textarea
                    ref={ta}
                    rows={6}
                    className="input"
                    value={answerDraft}
                    onChange={(e) => setAnswerDraft(e.target.value)}
                    placeholder="Type answer or paste formula/example"
                  />
                </div>

                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <button
                    className="btn"
                    onClick={onSubmitAnswer}
                    disabled={loading || !answerDraft.trim()}
                  >
                    Submit Answer
                  </button>
                  <button
                    className="btn secondary"
                    onClick={() => setAnswerDraft("")}
                  >
                    Clear
                  </button>
                  {localEval && (
                    <div style={{ marginLeft: "auto" }} className="small">
                      Local score: {localEval.score}/100
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="small">Waiting for next question...</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

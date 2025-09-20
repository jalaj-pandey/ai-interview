import React from "react";

export default function Report({ report, onDownload }) {
  if (!report) return null;
  return (
    <div className="card report" style={{ marginTop: 12 }}>
      <h3>Performance Report</h3>
      <div className="small">Generated: {report.generatedAt}</div>
      <div style={{ marginTop: 8 }}>
        <div>
          <strong>Candidate:</strong> {report.candidate.name}{" "}
          {report.candidate.email && <>• {report.candidate.email}</>}
        </div>
        <div>
          <strong>Questions answered:</strong> {report.questionsAnswered}
        </div>
        <div>
          <strong>Average answer length:</strong> {report.averageAnswerLength}{" "}
          chars
        </div>
        <div>
          <strong>Local score estimate:</strong> {report.localScoreEstimate}/100
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <strong>Local notes</strong>
        <ul>
          {report.localNotes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </div>

      {report.backendFeedback && (
        <div style={{ marginTop: 10 }}>
          <strong>Backend feedback</strong>
          <pre>{JSON.stringify(report.backendFeedback, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <button className="btn" onClick={onDownload}>
          Download JSON
        </button>
      </div>
    </div>
  );
}

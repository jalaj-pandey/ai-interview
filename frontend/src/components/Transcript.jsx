import React from "react";

export default function Transcript({ transcript }) {
  return (
    <div className="transcript">
      {transcript.length === 0 && <div className="small">No messages yet.</div>}
      {transcript.map((m, i) => (
        <div key={i} className={`message ${m.role}`}>
          <div style={{ fontSize: 12, color: "#374151" }}>
            {m.role.toUpperCase()} • {new Date(m.time).toLocaleString()}
          </div>
          <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{m.text}</div>
        </div>
      ))}
    </div>
  );
}

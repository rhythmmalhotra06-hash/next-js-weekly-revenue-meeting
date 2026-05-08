"use client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard error]", error);
  }, [error]);

  return (
    <div role="alert" style={{
      minHeight: "100vh", background: "#0f131a", color: "#ffffff",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: "16px", padding: "24px",
      fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 18,
        background: "linear-gradient(135deg, rgba(122,18,212,0.25), rgba(155,55,242,0.06))",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 30, color: "#9b37f2",
      }}>!</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>
        Something went off-script
      </h2>
      <p style={{
        color: "#b3b8c1", fontSize: 14, lineHeight: 1.5,
        maxWidth: 420, textAlign: "center",
      }}>
        The dashboard hit an unexpected error. Your unsaved edits are kept locally — refresh or retry to recover.
        {error.message ? <><br /><span style={{ color: "#979ca5", fontSize: 12, fontFamily: "ui-monospace, monospace" }}>{error.message}</span></> : null}
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: 8, padding: "10px 24px", borderRadius: 999,
          background: "#7a12d4", color: "#fff", border: "none",
          cursor: "pointer", fontSize: 14, fontWeight: 500,
          fontFamily: "inherit",
        }}
      >
        Try again
      </button>
    </div>
  );
}

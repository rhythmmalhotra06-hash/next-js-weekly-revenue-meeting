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
    <div style={{
      minHeight: "100vh", background: "#07050F", color: "#F0EDFC",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: "16px", fontFamily: "system-ui, sans-serif",
    }}>
      <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Something went wrong</h2>
      <p style={{
        color: "rgba(240,237,252,0.52)", fontSize: "13px",
        maxWidth: "360px", textAlign: "center",
      }}>
        {error.message || "An unexpected error occurred in the dashboard."}
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: "8px", padding: "8px 20px", borderRadius: "8px",
          background: "#7B5FF5", color: "#fff", border: "none",
          cursor: "pointer", fontSize: "14px",
        }}
      >
        Try again
      </button>
    </div>
  );
}

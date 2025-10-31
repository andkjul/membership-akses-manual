"use client";
import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState<"auth" | "form">("auth");
  const [inputPass, setInputPass] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");

  const FRONTEND_PASSWORD = process.env.NEXT_PUBLIC_FORM_PASSWORD;

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (inputPass === FRONTEND_PASSWORD) {
      setStep("form");
      setInputPass("");
    } else {
      alert("❌ Password salah!");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Mengirim...");

    const res = await fetch("/api/forward", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, email, phone }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus("✅ Terkirim ke n8n");
      setNama("");
      setEmail("");
      setPhone("");
    } else {
      setStatus("❌ " + (data.message || "Gagal kirim"));
    }
  }

  // layar password
  if (step === "auth") {
    return (
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            width: "90%",
            maxWidth: 400,
            background: "#fff",
            padding: 24,
            borderRadius: 8,
            boxShadow: "0 0 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: 16, textAlign: "center" }}>
            Masuk ke Form Admin
          </h2>
          <form onSubmit={handleAuth}>
            <input
              type="password"
              placeholder="Masukkan password"
              value={inputPass}
              onChange={(e) => setInputPass(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                border: "1px solid #ccc",
                borderRadius: 6,
                marginBottom: 12,
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 0",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Masuk
            </button>
          </form>
        </div>
      </main>
    );
  }

  // layar form
  return (
    <main
      style={{
        maxWidth: 460,
        margin: "40px auto",
        fontFamily: "system-ui",
        padding: "0 16px",
      }}
    >
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>Manual Membership Request</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Nama
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>
        <label>
          No. WA (62…)
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>
        <button
          type="submit"
          style={{
            padding: "10px 14px",
            background: "#2563eb",
            border: "none",
            color: "white",
            cursor: "pointer",
            borderRadius: 6,
          }}
        >
          Kirim
        </button>
      </form>
      {status && <p style={{ marginTop: 16 }}>{status}</p>}
    </main>
  );
}
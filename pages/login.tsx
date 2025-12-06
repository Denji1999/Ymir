import React, { useState } from "react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);

  async function sendOtp(e: any) {
    e.preventDefault();
    const res = await fetch("/api/auth/request-otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phone, username }),
    });
    const json = await res.json();
    if (res.ok) {
      setOtpSent(true);
      // demo: API includes otp in response for quick testing
      if (json.otp) setDevOtp(json.otp);
      alert("OTP sent (in demo it is returned by API). Use YMIRBOTZ or the returned OTP.");
    } else {
      alert(json.message || "Error");
    }
  }

  async function verify(e: any) {
    e.preventDefault();
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    const json = await res.json();
    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      alert(json.message || "Invalid OTP");
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }} className="card">
      <h2>Login / Create account (WhatsApp demo)</h2>
      {!otpSent ? (
        <form onSubmit={sendOtp} style={{ display: "grid", gap: 8 }}>
          <label>WhatsApp phone (E.164):</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1555..." />
          <label>Username:</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Eren" />
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit">Send OTP</button>
          </div>
        </form>
      ) : (
        <form onSubmit={verify} style={{ display: "grid", gap: 8 }}>
          <label>Enter OTP (demo: YMIRBOTZ or provided):</label>
          <input value={otp} onChange={(e) => setOtp(e.target.value)} />
          <div>
            <button type="submit">Verify & Sign In</button>
            <button type="button" onClick={() => { setOtpSent(false); setDevOtp(null); }}>Back</button>
          </div>
          {devOtp && <div style={{ marginTop: 8 }}>Dev OTP: <strong>{devOtp}</strong></div>}
        </form>
      )}
    </div>
  );
}

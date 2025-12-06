import React, { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Profile() {
  const { data } = useSWR("/api/auth/me", fetcher);
  const [file, setFile] = useState<File | null>(null);

  if (!data) return <div className="card">Loading...</div>;

  async function upload(e: any) {
    e.preventDefault();
    if (!file) return alert("Pick a file");
    const fd = new FormData();
    fd.append("pfp", file);
    const res = await fetch("/api/profile/upload-pfp", { method: "POST", body: fd });
    const j = await res.json();
    if (res.ok) {
      alert("Uploaded");
      location.reload();
    } else {
      alert(j.message || "Upload failed");
    }
  }

  return (
    <div className="card" style={{ maxWidth: 600 }}>
      <h2>Profile</h2>
      <img src={data.user.pfpUrl || "/images/default-pfp.png"} style={{ width: 140, height: 140, borderRadius: "50%" }} />
      <p>Username: {data.user.username}</p>
      <p>Phone: {data.user.phone}</p>

      <form onSubmit={upload}>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button type="submit">Upload PFP</button>
      </form>
      <p style={{ marginTop: 12 }}>Note: In production, upload should go to cloud storage (S3/Cloudinary). On Vercel uploads to /public/uploads are ephemeral.</p>
    </div>
  );
}

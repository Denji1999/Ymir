import React from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Dashboard() {
  const { data, error } = useSWR("/api/auth/me", fetcher);

  if (error) return <div className="card">Error loading</div>;
  if (!data) return <div className="card">Loading...</div>;

  const user = data.user;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
      <div className="card">
        <img src={user.pfpUrl || "/images/default-pfp.png"} alt="pfp" style={{ width: 120, height: 120, borderRadius: "50%" }} />
        <h3>{user.username}</h3>
        <p>Phone: {user.phone}</p>
        <p>Balance: {user.balance} gold</p>
        <p>Level: {user.level} (XP: {user.xp})</p>
      </div>
      <div className="card">
        <h3>Cards ({user.cards.length})</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {user.cards.map((c: any) => (
            <div key={c.id} style={{ background: "rgba(0,0,0,0.4)", padding: 8, borderRadius: 6 }}>
              <img src={`/images/cards/${c.name.replace(/\s+/g, "_")}.png`} alt={c.name} style={{ width: "100%", height: 120, objectFit: "contain" }} />
              <div style={{ marginTop: 6 }}>
                <div><strong>{c.name}</strong></div>
                <div style={{ fontSize: 12 }}>{c.rarity}</div>
              </div>
            </div>
          ))}
          {user.cards.length === 0 && <div>No cards yet.</div>}
        </div>
      </div>
    </div>
  );
}

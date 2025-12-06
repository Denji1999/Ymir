import Link from "next/link";
import React from "react";

export default function NavBar() {
  return (
    <nav className="nav">
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src="/images/logo.png" alt="AOT Logo" style={{ height: 36, width: 36, marginRight: 8 }} />
        <strong>Scout Corps — Demo</strong>
      </div>
      <div>
        <Link href="/dashboard"><a>Dashboard</a></Link>
        <Link href="/shop"><a>Shop</a></Link>
        <Link href="/leaderboard"><a>Leaderboard</a></Link>
        <Link href="/profile"><a>Profile</a></Link>
        <Link href="/login"><a>Login</a></Link>
      </div>
    </nav>
  );
}

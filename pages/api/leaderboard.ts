import type { NextApiRequest, NextApiResponse } from "next";
import { Store } from "../../lib/store";

/*
Return top users by balance, card count, xp (demo).
*/
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const users = Store.listUsers();
  const money = [...users].sort((a,b)=> b.balance - a.balance).slice(0,10).map(u => ({ id: u.id, username: u.username, balance: u.balance }));
  const xp = [...users].sort((a,b)=> b.xp - a.xp).slice(0,10).map(u => ({ id: u.id, username: u.username, xp: u.xp }));
  const cards = [...users].sort((a,b)=> b.cards.length - a.cards.length).slice(0,10).map(u => ({ id: u.id, username: u.username, cardCount: u.cards.length }));
  res.json({ money, xp, cards });
}

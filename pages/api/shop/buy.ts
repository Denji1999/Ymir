import type { NextApiRequest, NextApiResponse } from "next";
import { getTokenFromReq, verifyToken } from "../../../lib/auth";
import { Store } from "../../../lib/store";

const catalog: Record<string, { name: string; price: number }> = {
  p1: { name: "ODM Gas Canister", price: 100 },
  p2: { name: "Scout Cloak", price: 250 },
  p3: { name: "Titan Serum", price: 1000 },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json({ message: "Not authenticated" });
  const payload: any = verifyToken(token);
  if (!payload) return res.status(401).json({ message: "Invalid token" });

  const { itemId } = req.body;
  if (!itemId || !catalog[itemId]) return res.status(400).json({ message: "Unknown item" });

  const allUsers = Store.listUsers();
  const user = allUsers.find(u => u.id === payload.sub);
  if (!user) return res.status(404).json({ message: "User not found" });

  const item = catalog[itemId];
  if (user.balance < item.price) return res.status(400).json({ message: "Insufficient funds" });

  Store.updateUserStats(user.phone, { balance: user.balance - item.price });

  res.json({ ok: true });
}

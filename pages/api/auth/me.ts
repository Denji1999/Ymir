import type { NextApiRequest, NextApiResponse } from "next";
import { getTokenFromReq, verifyToken } from "../../../lib/auth";
import { Store } from "../../../lib/store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json({ message: "Not authenticated" });
  const payload: any = verifyToken(token);
  if (!payload) return res.status(401).json({ message: "Invalid token" });

  // Find user by id in in-memory store (search by id)
  const all = Store.listUsers();
  const user = all.find(u => u.id === payload.sub);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ user });
}

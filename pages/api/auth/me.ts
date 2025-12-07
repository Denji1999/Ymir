import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, include: { cards: true } });
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

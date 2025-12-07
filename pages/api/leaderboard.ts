import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // top 10 by balance
  const money = await prisma.user.findMany({ orderBy: { balance: "desc" }, take: 10, select: { id: true, username: true, balance: true } });
  const xp = await prisma.user.findMany({ orderBy: { xp: "desc" }, take: 10, select: { id: true, username: true, xp: true } });
  const cards = await prisma.user.findMany({
    orderBy: { cards: { _count: "desc" } },
    take: 10,
    select: { id: true, username: true, cards: true, _count: { select: { cards: true } } },
  });
  const cardsMapped = cards.map(u => ({ id: u.id, username: u.username, cardCount: (u as any)._count.cards }));
  res.json({ money, xp, cards: cardsMapped });
}

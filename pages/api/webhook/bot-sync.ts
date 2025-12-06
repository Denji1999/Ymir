import type { NextApiRequest, NextApiResponse } from "next";
import { Store } from "../../../lib/store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const secret = req.headers["x-bot-secret"] as string | undefined;
  const expected = process.env.BOT_WEBHOOK_SECRET || "dev_bot_secret";
  if (!secret || secret !== expected) return res.status(403).json({ message: "Forbidden" });

  const { type, phone, payload } = req.body;
  if (!phone) return res.status(400).json({ message: "phone required" });

  const user = Store.findUserByPhone(phone);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (type === "inventory_update") {
    const { cards, balance, xp, level } = payload ?? {};
    if (Array.isArray(cards)) {
      Store.replaceCards(phone, cards.map((c: any) => ({ name: c.name, rarity: c.rarity || "common", metadata: c.metadata || {} })));
    }
    Store.updateUserStats(phone, { balance: typeof balance === "number" ? balance : user.balance, xp: typeof xp === "number" ? xp : user.xp, level: typeof level === "number" ? level : user.level });
    return res.json({ ok: true });
  }

  if (type === "card_claimed") {
    const c = payload?.card;
    if (!c) return res.status(400).json({ message: "card missing" });
    Store.addCardToUser(phone, { name: c.name, rarity: c.rarity || "common", metadata: c.metadata || {} });
    return res.json({ ok: true });
  }

  res.status(400).json({ message: "unknown event type" });
}

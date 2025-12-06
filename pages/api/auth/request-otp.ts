import type { NextApiRequest, NextApiResponse } from "next";
import { Store } from "../../../lib/store";

/*
 Demo: create user if missing and return OTP in response (for quick demo).
 In production, send OTP to WhatsApp via Twilio / WhatsApp API and do not return it.
*/
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { phone, username } = req.body;
  if (!phone || !username) return res.status(400).json({ message: "phone and username required" });

  const user = Store.upsertUser(phone, username);

  const code = (Math.floor(100000 + Math.random() * 900000)).toString();
  Store.saveOtp(phone, code, 300);

  // In demo we return OTP so tester can use it (do NOT do in production)
  res.json({ ok: true, message: "OTP generated (demo)", otp: code });
}

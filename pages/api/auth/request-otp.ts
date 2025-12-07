import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import crypto from "crypto";
import axios from "axios";

const otpStore: Map<string, { code: string; expires: number }> = new Map();

// Utility: send OTP via WhatsApp using Twilio or log in dev
async function sendOtpWhatsApp(phone: string, text: string) {
  if (!process.env.TWILIO_ACCOUNT_SID) {
    console.log("[DEV MODE] Would send to", phone, ":", text);
    return;
  }
  // Twilio API: send WhatsApp message
  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const from = process.env.TWILIO_WHATSAPP_FROM!;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const data = new URLSearchParams({
    From: `whatsapp:${from.replace(/^whatsapp:/, "")}`,
    To: `whatsapp:${phone.replace(/^whatsapp:/, "").replace(/^\+/, "")
}`,
    Body: text,
  });
  await axios.post(url, data.toString(), {
    auth: { username: accountSid, password: authToken },
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { phone, username } = req.body;
  if (!phone || !username) return res.status(400).json({ message: "phone and username required" });

  // Create or find user
  let user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    user = await prisma.user.create({ data: { phone, username } });
  }

  // create OTP
  const code = (Math.floor(100000 + Math.random() * 900000)).toString();
  otpStore.set(phone, { code, expires: Date.now() + 5 * 60 * 1000 });
  await sendOtpWhatsApp(phone, `Your Scout Corps OTP: ${code}`);

  // In production, don't return the OTP. For dev you can return it.
  res.json({ ok: true, message: "OTP sent" });
}

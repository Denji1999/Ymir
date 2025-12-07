import type { NextApiRequest, NextApiResponse } from "next";
import { put } from "@vercel/blob";
import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ error: "Missing token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };
    const userId = decoded.id;

    const { fileName, fileBase64 } = req.body;

    if (!fileName || !fileBase64) {
      return res.status(400).json({ error: "Missing file data" });
    }

    // Convert base64 → buffer
    const buffer = Buffer.from(fileBase64, "base64");

    // Upload to Vercel Blob
    const blob = await put(`pfp/${userId}-${fileName}`, buffer, {
      access: "public",
    });

    // Save URL to database
    await prisma.user.update({
      where: { id: userId },
      data: {
        pfpUrl: blob.url,
      },
    });

    return res.status(200).json({ success: true, url: blob.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Upload failed" });
  }
}

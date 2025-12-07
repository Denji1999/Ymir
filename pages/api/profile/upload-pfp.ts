import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export const config = {
  api: {
    bodyParser: false, // Disables Next.js default body parsing
  },
};

type Data = {
  success: boolean;
  message?: string;
  url?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // Parse the token from headers (example)
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  let userId: string;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    userId = decoded.id;
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  const form = formidable({ multiples: false, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error parsing form data" });
    }

    const file = files.file as File;
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    try {
      // Move file to public/uploads
      const uploadDir = path.join(process.cwd(), "/public/uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const newFilePath = path.join(uploadDir, file.originalFilename || file.newFilename);
      fs.renameSync(file.filepath, newFilePath);

      // Save file info to database
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { profilePicture: `/uploads/${file.originalFilename || file.newFilename}` },
      });

      return res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully",
        url: updatedUser.profilePicture,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
};

export default handler;

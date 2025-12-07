import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parsing for file uploads
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

  // Parse JWT token from headers
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

  // Initialize Formidable
  const form = formidable({ multiples: false, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error parsing form data" });
    }

    // Type-safe handling of Formidable file(s)
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!uploadedFile) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    try {
      // Create uploads folder if it doesn't exist
      const uploadDir = path.join(process.cwd(), "/public/uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      // Move uploaded file to /public/uploads
      const newFilePath = path.join(uploadDir, uploadedFile.originalFilename || uploadedFile.newFilename);
      fs.renameSync(uploadedFile.filepath, newFilePath);

      // Save file URL to database
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { profilePicture: `/uploads/${uploadedFile.originalFilename || uploadedFile.newFilename}` },
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

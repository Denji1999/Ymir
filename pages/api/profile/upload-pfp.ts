import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export const config = {
  api: {
    bodyParser: false, // required for formidable
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm({
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Upload failed" });
    }

    try {
      const token = fields.token as string;
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      const file = files.file as formidable.File;
      const buffer = fs.readFileSync(file.filepath);

      // Example: upload to a folder or cloud
      const filename = `uploads/${decoded.id}-${Date.now()}.jpg`;
      fs.writeFileSync(filename, buffer);

      const updated = await prisma.user.update({
        where: { id: decoded.id },
        data: { pfpUrl: filename },
      });

      return res.status(200).json({ success: true, user: updated });
    } catch (e) {
      return res.status(500).json({ error: "Server error" });
    }
  });
}

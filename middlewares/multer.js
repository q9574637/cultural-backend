import express from "express";
import multer from "multer";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const upload = multer({ dest: "uploads/" }); // Temporary disk storage

const uploadToCloudinary = [
  upload.single("file"), 
  async (req, res) => {
    const localPath = req.file?.path;
    if (!localPath) return res.status(400).json({ error: "No file provided" });

    const result = await uploadOnCloudinary(localPath);
    if (!result) return res.status(500).json({ error: "Upload failed" });

    res.status(200).json({
      message: "Upload successful",
      url: result.secure_url,
      public_id: result.public_id,
    });
  },
];

export default uploadToCloudinary;

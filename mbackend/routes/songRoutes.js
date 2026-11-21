
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Song = require("../models/Song");
const authMiddleware = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/authMiddleware");

// UPLOAD DIRECTORY
const uploadDir = path.join(__dirname, "../uploads");

// CREATE UPLOADS FOLDER IF NOT EXISTS
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// MULTER STORAGE

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, path.basename(file.originalname));
  }
});

// MULTER UPLOAD
const upload = multer({ storage });

// ADD SONG
router.post(
  "/add-song",
  authMiddleware,
  adminMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { title, artist, album, duration } = req.body;

      const imageFile = req.files?.image?.[0];
      const audioFile = req.files?.audio?.[0];

      if (!title || !artist || !audioFile) {
        return res.status(400).json({
          message: "Title, artist and audio file are required"
        });
      }

      // SAVE SONG IN MONGODB
      const song = await Song.create({
        title,
        artist,
        album: album || "Unknown Album",

        image: imageFile
          ? `/uploads/${imageFile.filename}`
          : "",

        audio: `/uploads/${audioFile.filename}`,

        duration: duration
          ? Number(duration)
          : undefined
      });

      res.status(201).json({
        message: "Song uploaded successfully",
        song
      });

    } catch (error) {
      console.error("Add song error:", error);

      res.status(500).json({
        message: "Song upload failed",
        error: error.message
      });
    }
  }
);

// GET ALL SONGS
router.get("/all-songs", async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });

    res.status(200).json({
      songs
    });

  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch songs",
      error: error.message
    });
  }
});

// DELETE SONG
router.delete(
  "/delete-song/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const song = await Song.findByIdAndDelete(req.params.id);

      if (!song) {
        return res.status(404).json({
          message: "Song not found"
        });
      }

      res.status(200).json({
        message: "Song deleted successfully"
      });

    } catch (error) {
      res.status(500).json({
        message: "Unable to delete song",
        error: error.message
      });
    }
  }
);

module.exports = router;

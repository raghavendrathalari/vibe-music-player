
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

// AUDIO FILTER
const fileFilter = (req, file, cb) => {
  if (
    file.fieldname === "audio" &&
    path.extname(file.originalname).toLowerCase() === ".mp3"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only MP3 audio files are allowed."));
  }
};

// MULTER - AUDIO ONLY
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

// ADD SONG
router.post(
  "/add-song",
  authMiddleware,
  adminMiddleware,
  upload.single("audio"),
  async (req, res) => {
    try {
      const { title, artist, album, image, duration } = req.body;

      const audioFile = req.file;

      if (!title || !artist || !audioFile) {
        return res.status(400).json({
          message: "Title, artist and audio are required"
        });
      }

      // IMAGE NAME AS TEXT
      const imageName = image
        ? path.basename(image.replace(/\\/g, "/").trim())
        : "";

      const imagePath = imageName
        ? `/uploads/${imageName}`
        : "";

      // CHECK IMAGE EXISTS
      if (
        imageName &&
        !fs.existsSync(path.join(uploadDir, imageName))
      ) {
        fs.unlinkSync(audioFile.path);

        return res.status(400).json({
          message: `Image not found: ${imageName}`
        });
      }

      console.log("Received image:", image);
      console.log("Saved image:", imagePath);
      console.log("Received audio:", audioFile.filename);

      // SAVE IN MONGODB
      const song = await Song.create({
        title: title.trim(),
        artist: artist.trim(),
        album: album?.trim() || "Unknown Album",
        image: imagePath,
        audio: `/uploads/${audioFile.filename}`,
        duration: duration ? Number(duration) : undefined
      });

      res.status(201).json({
        message: "Song uploaded successfully",
        song
      });

    } catch (error) {
      console.error("Add song error:", error);

      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

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

    res.status(200).json({ songs });

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

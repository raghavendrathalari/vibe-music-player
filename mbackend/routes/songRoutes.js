
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Song = require("../models/Song");

const authMiddleware = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/authMiddleware");

// CREATE UPLOADS FOLDER
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
    const originalName = path.basename(file.originalname);
    cb(null, originalName);
  }
});

// FILE VALIDATION
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "image") {
    const allowedImages = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (allowedImages.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(new Error("Only JPG, PNG and WEBP images are allowed"));
  }

  if (file.fieldname === "audio") {
    const allowedAudio = [
      "audio/mpeg",
      "audio/mp3",
      "audio/x-mpeg-3"
    ];

    if (allowedAudio.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(new Error("Only MP3 audio files are allowed"));
  }

  cb(new Error("Unexpected file field"));
};

// MULTER CONFIGURATION
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

// REMOVE UPLOADED FILES
function removeUploadedFiles(files) {
  if (!files) return;

  Object.values(files).flat().forEach((file) => {
    fs.unlink(file.path, () => {});
  });
}

// ADD SONG - ADMIN ONLY
router.post(
  "/add-song",
  authMiddleware,
  adminMiddleware,
  (req, res, next) => {
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "audio", maxCount: 1 }
    ])(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          message: error.message
        });
      }

      next();
    });
  },
  async (req, res) => {
    try {
      const { title, artist, album, duration } = req.body;

      const imageFile = req.files?.image?.[0];
      const audioFile = req.files?.audio?.[0];

      if (!title || !artist || !audioFile) {
        removeUploadedFiles(req.files);

        return res.status(400).json({
          message: "Title, artist and audio file are required"
        });
      }

      const newSong = await Song.create({
        title,
        artist,
        album: album || "Unknown Album",

        image: imageFile
          ? `/uploads/${imageFile.filename}`
          : "",

        audio: `/uploads/${audioFile.filename}`,

        duration: duration ? Number(duration) : undefined
      });

      return res.status(201).json({
        message: "Song added successfully",
        song: newSong
      });

    } catch (error) {
      removeUploadedFiles(req.files);

      return res.status(500).json({
        message: "Error adding song",
        error: error.message
      });
    }
  }
);

// GET ALL SONGS - PUBLIC
router.get("/all-songs", async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Songs fetched successfully",
      songs
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching songs",
      error: error.message
    });
  }
});

// DELETE SONG - ADMIN ONLY
router.delete(
  "/delete-song/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          message: "Invalid song ID"
        });
      }

      const song = await Song.findByIdAndDelete(req.params.id);

      if (!song) {
        return res.status(404).json({
          message: "Song not found"
        });
      }

      // DELETE ASSOCIATED FILES
      [song.image, song.audio].forEach((filePath) => {
        if (filePath) {
          const filename = path.basename(filePath);
          const fullPath = path.join(uploadDir, filename);

          fs.unlink(fullPath, () => {});
        }
      });

      return res.json({
        message: "Song deleted successfully"
      });

    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  }
);

// EXPORT ROUTER
module.exports = router;

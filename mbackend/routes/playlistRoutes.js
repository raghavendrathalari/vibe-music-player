
const express = require("express");
const Playlist = require("../models/Playlist");
const Song = require("../models/Song");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create playlist
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Playlist name is required"
      });
    }

    const playlist = await Playlist.create({
      user: req.userId,
      name: name.trim(),
      songs: []
    });

    res.status(201).json({
      message: "Playlist created",
      playlist
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add song to playlist
router.post("/add-song", authMiddleware, async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    const playlist = await Playlist.findOne({
      _id: playlistId,
      user: req.userId
    });

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found"
      });
    }

    const song = await Song.findById(songId);

    if (!song) {
      return res.status(404).json({
        message: "Song not found"
      });
    }

    if (playlist.songs.some(id => id.toString() === songId)) {
      return res.status(400).json({
        message: "Song already exists"
      });
    }

    playlist.songs.push(song._id);
    await playlist.save();

    res.json({
      message: "Song added successfully",
      playlist
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's playlists
router.get("/my-playlists", authMiddleware, async (req, res) => {
  try {
    const playlists = await Playlist.find({
      user: req.userId
    }).populate("songs");

    res.json({ playlists });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

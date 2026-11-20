
const express = require("express");
const mongoose = require("mongoose");

const Playlist = require("../models/Playlist");
const Song = require("../models/Song");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE PLAYLIST
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Playlist name is required"
      });
    }

    const playlist = await Playlist.create({
      user: req.userId,
      name: name.trim(),
      songs: []
    });

    return res.status(201).json({
      message: "Playlist created successfully",
      playlist
    });

  } catch (error) {
    console.error("Create playlist error:", error);

    return res.status(500).json({
      message: "Unable to create playlist"
    });
  }
});


// ADD SONG TO PLAYLIST
router.post("/add-song", authMiddleware, async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(playlistId) ||
      !mongoose.Types.ObjectId.isValid(songId)
    ) {
      return res.status(400).json({
        message: "Invalid playlist ID or song ID"
      });
    }

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

    const alreadyExists = playlist.songs.some(
      id => id.toString() === songId
    );

    if (alreadyExists) {
      return res.status(400).json({
        message: "Song already exists in this playlist"
      });
    }

    playlist.songs.push(song._id);

    await playlist.save();

    return res.status(200).json({
      message: "Song added successfully",
      playlist
    });

  } catch (error) {
    console.error("Add song error:", error);

    return res.status(500).json({
      message: "Unable to add song"
    });
  }
});


// GET USER PLAYLISTS
router.get("/my-playlists", authMiddleware, async (req, res) => {
  try {
    const playlists = await Playlist.find({
      user: req.userId
    })
      .populate("songs")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      playlists
    });

  } catch (error) {
    console.error("Fetch playlists error:", error);

    return res.status(500).json({
      message: "Unable to fetch playlists"
    });
  }
});

module.exports = router;

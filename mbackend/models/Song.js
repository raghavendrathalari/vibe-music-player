
const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  artist: {
    type: String,
    required: true
  },

  album: {
    type: String,
    default: "Unknown Album"
  },

  image: {
    type: String
  },

  audio: {
    type: String,
    required: true
  },

  duration: {
    type: Number
  }

}, { timestamps: true });

const Song = mongoose.model("Song", songSchema);

module.exports = Song;

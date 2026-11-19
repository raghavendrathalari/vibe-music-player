
import axios from "axios";

import API_URL from "../config";


function getConfig() {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}

// Get logged-in user's playlists
export async function getPlaylists() {
  const response = await axios.get(
    `${API_URL}/api/playlists/my-playlists`,
    getConfig()
  );

  return response.data.playlists;
}

// Create a playlist
export async function createPlaylist(name) {
  const response = await axios.post(
    `${API_URL}/api/playlists/create`,
    { name },
    getConfig()
  );

  return response.data.playlist;
}

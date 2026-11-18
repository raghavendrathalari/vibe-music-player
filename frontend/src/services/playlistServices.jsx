
import axios from "axios";

const API = "http://localhost:3000/api/playlists";

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
    `${API}/my-playlists`,
    getConfig()
  );

  return response.data.playlists;
}

// Create a playlist
export async function createPlaylist(name) {
  const response = await axios.post(
    `${API}/create`,
    { name },
    getConfig()
  );

  return response.data.playlist;
}

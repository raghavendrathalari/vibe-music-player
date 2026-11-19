
import axios from "axios";
import API_URL from "../config";

function Playlist() {

  // ADD SONG TO PLAYLIST
  const addToPlaylist = async (playlistId, songId) => {
    try {
      const token = localStorage.getItem("token");

      // Check login
      if (!token) {
        alert("Please login first.");
        return;
      }

      // API request
      const response = await axios.post(
        `${API_URL}/api/playlists/add-song`,
        {
          playlistId,
          songId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(
        response.data.message || "Song added to playlist successfully!"
      );

    } catch (error) {
      console.error("Add to playlist error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to add song. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-white">

      <h1 className="mb-6 text-2xl font-bold text-green-400">
        My Playlists
      </h1>

      {/* Your playlist UI goes here */}

    </div>
  );
}

export default Playlist;

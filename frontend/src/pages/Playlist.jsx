
import { useEffect, useState } from "react";
import axios from "axios";
import { Music2, Plus, RefreshCw } from "lucide-react";
import API_URL from "../config";

function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  // FETCH PLAYLISTS
  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axios.get(
        `${API_URL}/api/playlists`,
        { headers }
      );

      setPlaylists(response.data.playlists || []);
    } catch (error) {
      console.error("Fetch playlists error:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.message || "Unable to load playlists"
      );
    } finally {
      setLoading(false);
    }
  };

  // FETCH SONGS
  const fetchSongs = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/songs/all-songs`
      );

      setSongs(response.data.songs || []);
    } catch (error) {
      console.error("Fetch songs error:", error.response?.data || error.message);
    }
  };

  // ADD SONG TO PLAYLIST
  const addToPlaylist = async (playlistId, songId) => {
    try {
      if (!token) {
        setMessage("Please login first.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/playlists/add-song`,
        { playlistId, songId },
        { headers }
      );

      setMessage(
        response.data.message || "Song added successfully!"
      );

      fetchPlaylists();

    } catch (error) {
      console.error("Add to playlist error:", error.response?.data || error.message);

      setMessage(
        error.response?.data?.message || "Unable to add song."
      );
    }
  };

  // LOAD DATA
  useEffect(() => {
    if (!token) {
      setMessage("Please login to view your playlists.");
      return;
    }

    fetchPlaylists();
    fetchSongs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-white">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-400">
          My Playlists
        </h1>

        <button
          onClick={() => {
            fetchPlaylists();
            fetchSongs();
          }}
          className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700"
          aria-label="Refresh playlists"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {message && (
        <p className="mb-4 text-sm text-green-400">
          {message}
        </p>
      )}

      {loading ? (
        <p className="text-gray-400">Loading playlists...</p>
      ) : playlists.length === 0 ? (
        <p className="text-gray-400">
          No playlists found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              className="bg-gray-900 border border-gray-800 p-5 rounded-xl"
            >
              <h2 className="text-xl font-bold flex items-center gap-2 mb-3">
                <Music2 className="text-green-400" />
                {playlist.name}
              </h2>

              <p className="text-gray-400 text-sm mb-4">
                {playlist.songs?.length || 0} songs
              </p>

              {playlist.songs?.map((song) => (
                <p
                  key={song._id}
                  className="text-gray-300 py-1"
                >
                  {song.title} - {song.artist}
                </p>
              ))}

              <div className="mt-5">
                <label className="text-sm text-gray-300">
                  Add a song
                </label>

                <select
                  defaultValue=""
                  onChange={(e) => {
                    const songId = e.target.value;

                    if (songId) {
                      addToPlaylist(playlist._id, songId);
                    }

                    e.target.value = "";
                  }}
                  className="w-full mt-2 bg-gray-800 p-3 rounded-lg outline-none"
                >
                  <option value="">Select a song</option>

                  {songs.map((song) => (
                    <option key={song._id} value={song._id}>
                      {song.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default Playlist;

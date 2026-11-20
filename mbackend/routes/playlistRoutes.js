
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Music2,
  Plus,
  RefreshCw,
  ListMusic
} from "lucide-react";

import API_URL from "../config";

function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // GET AUTH TOKEN
  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`
    };
  };

  // FETCH PLAYLISTS
  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your playlists.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/playlists/my-playlists`,
        {
          headers: getHeaders()
        }
      );

      setPlaylists(response.data.playlists || []);

    } catch (err) {
      console.error(
        "Fetch playlists error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
        "Unable to load playlists."
      );

    } finally {
      setLoading(false);
    }
  };

  // FETCH ALL SONGS
  const fetchSongs = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/songs/all-songs`
      );

      setSongs(response.data.songs || []);

    } catch (err) {
      console.error(
        "Fetch songs error:",
        err.response?.data || err.message
      );
    }
  };

  // CREATE PLAYLIST
  const createPlaylist = async (e) => {
    e.preventDefault();

    if (!playlistName.trim()) {
      setError("Please enter a playlist name.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setMessage("");

      const response = await axios.post(
        `${API_URL}/api/playlists/create`,
        {
          name: playlistName.trim()
        },
        {
          headers: getHeaders()
        }
      );

      setMessage(
        response.data.message || "Playlist created successfully!"
      );

      setPlaylistName("");

      await fetchPlaylists();

    } catch (err) {
      console.error(
        "Create playlist error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
        "Unable to create playlist."
      );

    } finally {
      setCreating(false);
    }
  };

  // ADD SONG TO PLAYLIST
  const addToPlaylist = async (playlistId, songId) => {
    if (!songId) return;

    try {
      setError("");
      setMessage("");

      const response = await axios.post(
        `${API_URL}/api/playlists/add-song`,
        {
          playlistId,
          songId
        },
        {
          headers: getHeaders()
        }
      );

      setMessage(
        response.data.message || "Song added successfully!"
      );

      await fetchPlaylists();

    } catch (err) {
      console.error(
        "Add song error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
        "Unable to add song."
      );
    }
  };

  // LOAD DATA
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setError("Please login to view your playlists.");
      return;
    }

    fetchPlaylists();
    fetchSongs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-6 text-white">

      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-8">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-green-400 flex items-center gap-2">
            <Music2 />
            My Playlists
          </h1>

          <p className="text-gray-400 mt-1">
            Create and manage your music collections
          </p>
        </div>

        <button
          onClick={() => {
            fetchPlaylists();
            fetchSongs();
          }}
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg"
          aria-label="Refresh playlists"
        >
          <RefreshCw size={20} />
        </button>

      </div>

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="bg-green-900/30 border border-green-600 text-green-400 p-3 rounded-lg mb-4">
          {message}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-900/30 border border-red-600 text-red-400 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* CREATE PLAYLIST */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Plus className="text-green-400" />
          Create New Playlist
        </h2>

        <form
          onSubmit={createPlaylist}
          className="flex flex-col sm:flex-row gap-3"
        >

          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Enter playlist name"
            className="flex-1 min-w-0 bg-gray-800 border border-gray-700 rounded-lg p-3 outline-none focus:border-green-500"
          />

          <button
            type="submit"
            disabled={creating}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            {creating ? "Creating..." : "Create Playlist"}
          </button>

        </form>

      </section>

      {/* PLAYLIST LIST */}
      <section>

        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
          <ListMusic className="text-green-400" />
          Your Playlists
        </h2>

        {loading ? (
          <p className="text-gray-400">
            Loading playlists...
          </p>
        ) : playlists.length === 0 ? (

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">

            <Music2
              size={45}
              className="mx-auto text-gray-500 mb-3"
            />

            <h3 className="text-lg font-semibold">
              No playlists yet
            </h3>

            <p className="text-gray-400 mt-2">
              Create your first playlist above.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {playlists.map((playlist) => (

              <div
                key={playlist._id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-green-600 transition"
              >

                {/* PLAYLIST TITLE */}
                <div className="flex items-center gap-3 mb-4">

                  <div className="bg-green-600/20 p-3 rounded-lg">
                    <Music2
                      size={25}
                      className="text-green-400"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      {playlist.name}
                    </h3>

                    <p className="text-sm text-gray-400">
                      {playlist.songs?.length || 0} songs
                    </p>
                  </div>

                </div>

                {/* PLAYLIST SONGS */}
                <div className="space-y-2 mb-5">

                  {playlist.songs?.length > 0 ? (

                    playlist.songs.map((song) => (

                      <div
                        key={song._id}
                        className="bg-gray-800 p-3 rounded-lg"
                      >

                        <p className="font-medium">
                          {song.title}
                        </p>

                        <p className="text-sm text-gray-400">
                          {song.artist || "Unknown Artist"}
                        </p>

                      </div>

                    ))

                  ) : (

                    <p className="text-sm text-gray-500">
                      No songs added yet.
                    </p>

                  )}

                </div>

                {/* ADD SONG */}
                <div>

                  <label className="text-sm text-gray-300 mb-2 block">
                    Add a song to this playlist
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
                    className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg outline-none focus:border-green-500"
                  >

                    <option value="">
                      Select a song
                    </option>

                    {songs.map((song) => (

                      <option
                        key={song._id}
                        value={song._id}
                      >
                        {song.title}
                      </option>

                    ))}

                  </select>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default Playlist;


import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Music2,
  Plus,
  Trash2,
  RefreshCw,
  Image,
  Upload,
  LogOut
} from "lucide-react";

import API_URL from "../config";

function Admin() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    title: "",
    artist: "",
    album: "",
    image: null,
    audio: null
  });

  const token = localStorage.getItem("token");

  // IMAGE PREVIEW
  useEffect(() => {
    if (!form.image) {
      setImagePreview("");
      return;
    }

    const preview = URL.createObjectURL(form.image);
    setImagePreview(preview);

    return () => URL.revokeObjectURL(preview);
  }, [form.image]);

  // FETCH SONGS
  async function fetchSongs() {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/api/songs/all-songs`
      );

      setSongs(res.data.songs || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to load songs"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSongs();
  }, []);

  // HANDLE TEXT INPUT
  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  // HANDLE FILE INPUT
  function handleFileChange(e) {
    const { name, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files[0] || null
    }));
  }

  // ADD SONG
  async function handleAddSong(e) {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    if (!form.audio) {
      setMessage("Please select an MP3 audio file.");
      return;
    }

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("artist", form.artist);
    formData.append("album", form.album);

    if (form.image) {
      formData.append("image", form.image);
    }

    formData.append("audio", form.audio);

    try {
      setUploading(true);
      setProgress(0);

      const res = await axios.post(
        `${API_URL}/api/songs/add-song`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          onUploadProgress: (event) => {
            if (event.total) {
              setProgress(
                Math.round((event.loaded * 100) / event.total)
              );
            }
          }
        }
      );

      setMessage(res.data.message || "Song added successfully!");

      setForm({
        title: "",
        artist: "",
        album: "",
        image: null,
        audio: null
      });

      e.target.reset();

      await fetchSongs();

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to upload song"
      );
    } finally {
      setUploading(false);
    }
  }

  // DELETE SONG
  async function handleDeleteSong(id) {
    if (!window.confirm("Are you sure you want to delete this song?")) {
      return;
    }

    try {
      const res = await axios.delete(
        `${API_URL}/api/songs/delete-song/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(res.data.message);
      await fetchSongs();

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to delete song"
      );
    }
  }

   const navigate = useNavigate();

   function handleLogout() {
   localStorage.removeItem("token");
   localStorage.removeItem("user");

   navigate("/login", { replace: true });
   }

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-white md:p-10">

    {/* HEADER */}
    <div className="mb-10 flex flex-wrap items-center justify-between gap-4">

    <div>
    <h1 className="text-3xl font-bold text-green-400">
      Vibe Music Admin
    </h1>

    <p className="mt-2 text-gray-400">
      Manage your music library
    </p>
    </div>

    <div className="flex items-center gap-3">

    <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-3 text-green-400">
      <Music2 />
      <span>Admin Dashboard</span>

    </div>

    <button
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-red-400 transition hover:bg-red-500 hover:text-white"
    >
      <LogOut size={20} />
      <span>Logout</span>
    </button>

    </div>

    </div>

      {/* MESSAGE */}
      {message && (
        <div className="mb-6 rounded-lg bg-gray-800 p-4 text-green-400">
          {message}
        </div>
      )}

      {/* ADD SONG */}
      <div className="mb-10 max-w-2xl rounded-xl bg-gray-900 p-6">

        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          <Plus className="text-green-400" />
          Add New Song
        </h2>

        <form onSubmit={handleAddSong} className="space-y-5">

          <input
            type="text"
            name="title"
            placeholder="Song Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 outline-none focus:border-green-400"
          />

          <input
            type="text"
            name="artist"
            placeholder="Artist"
            value={form.artist}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 outline-none focus:border-green-400"
          />

          <input
            type="text"
            name="album"
            placeholder="Album"
            value={form.album}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 outline-none focus:border-green-400"
          />

          {/* IMAGE UPLOAD */}
          <div>
            <label className="mb-2 block text-gray-300">
              Album Image
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-600 bg-gray-800 p-4 hover:border-green-400">
              <Image className="text-green-400" />

              <span className="text-gray-300">
                {form.image
                  ? form.image.name
                  : "Choose JPG, PNG or WEBP image"}
              </span>

              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Album preview"
                className="mt-4 h-32 w-32 rounded-xl object-cover"
              />
            )}
          </div>

          {/* AUDIO UPLOAD */}
          <div>
            <label className="mb-2 block text-gray-300">
              Song Audio
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-600 bg-gray-800 p-4 hover:border-green-400">
              <Upload className="text-green-400" />

              <span className="text-gray-300">
                {form.audio
                  ? form.audio.name
                  : "Choose MP3 audio file"}
              </span>

              <input
                type="file"
                name="audio"
                accept=".mp3,audio/mpeg"
                onChange={handleFileChange}
                required
                className="hidden"
              />
            </label>
          </div>

          {/* UPLOAD PROGRESS */}
          {uploading && (
            <div>
              <div className="mb-2 flex justify-between text-sm text-gray-400">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 p-3 font-semibold text-black hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={20} />
            {uploading ? "Uploading..." : "Add Song"}
          </button>

        </form>
      </div>

      {/* ALL SONGS */}
      <div className="rounded-xl bg-gray-900 p-6">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            All Songs ({songs.length})
          </h2>

          <button
            onClick={fetchSongs}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 hover:bg-gray-700"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading songs...</p>
        ) : songs.length === 0 ? (
          <p className="text-gray-400">No songs available.</p>
        ) : (
          <div className="space-y-3">

            {songs.map((song) => (
              <div
                key={song._id}
                className="flex items-center gap-4 rounded-lg bg-gray-800 p-4"
              >

                {song.image ? (
                  <img
                    src={`${API}${song.image}`}
                    alt={song.title}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-700">
                    <Music2 />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">
                    {song.title}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {song.artist} • {song.album}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteSong(song._id)}
                  className="rounded-lg bg-red-500/10 p-3 text-red-400 hover:bg-red-500 hover:text-white"
                  title="Delete song"
                >
                  <Trash2 size={20} />
                </button>

              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
}

export default Admin;

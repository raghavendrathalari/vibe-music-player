
import { useState } from "react";
import { Play, Heart, ListPlus } from "lucide-react";

const API = "http://localhost:3000";

function SongCard({
  song,
  onPlay,
  likedSongs = [],
  onLike,
  playlists = [],
  onAddToPlaylist
}) {
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [adding, setAdding] = useState(false);

  // Check liked song
  const isLiked = likedSongs.some(
    (item) => item._id === song._id
  );

  // Correct image URL
  const imageUrl = song.image
    ? song.image.startsWith("http")
      ? song.image
      : `${API}/${song.image.replace(/^\/+/, "")}`
    : "/default-song.png";

  // Add song to playlist
  const handleAddToPlaylist = async (playlistId) => {
    if (!song._id || adding) return;

    try {
      setAdding(true);

      await onAddToPlaylist?.(playlistId, song._id);

      setShowPlaylists(false);

    } catch (error) {
      console.error("Playlist error:", error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition">

      {/* SONG IMAGE */}
      <div className="relative">

        <img
          src={imageUrl}
          alt={song.title || "Song"}
          className="w-full aspect-square object-cover rounded-lg"
          onError={(e) => {
            console.error("Image not found:", imageUrl);
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/default-song.png";
          }}
        />

        {/* PLAY BUTTON */}
        <button
          onClick={() => onPlay?.(song)}
          className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
          title="Play song"
        >
          <Play size={20} />
        </button>

      </div>

      {/* SONG DETAILS */}
      <div className="flex justify-between items-center mt-3">

        <div className="min-w-0">
          <h3 className="font-semibold text-white truncate">
            {song.title}
          </h3>

          <p className="text-sm text-gray-400 truncate">
            {song.artist}
          </p>
        </div>

        {/* LIKE BUTTON */}
        <button
          onClick={() => onLike?.(song)}
          title={isLiked ? "Unlike" : "Like"}
          className="p-2 rounded-full hover:bg-gray-600 transition"
        >
          <Heart
            size={24}
            className={
              isLiked ? "text-red-500" : "text-gray-400"
            }
            fill={isLiked ? "red" : "none"}
          />
        </button>

      </div>

      {/* ADD TO PLAYLIST */}
      <div className="relative mt-4">

        <button
          onClick={() => setShowPlaylists(!showPlaylists)}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
        >
          <ListPlus size={20} />
          Add to Playlist
        </button>

        {/* PLAYLIST DROPDOWN */}
        {showPlaylists && (

          <div className="mt-2 bg-gray-900 rounded-lg p-2">

            {playlists.length > 0 ? (

              playlists.map((playlist) => (

                <button
                  key={playlist._id}
                  disabled={adding}
                  onClick={() =>
                    handleAddToPlaylist(playlist._id)
                  }
                  className="block w-full text-left text-white p-2 hover:bg-gray-700 rounded disabled:opacity-50"
                >
                  {adding ? "Adding..." : playlist.name}
                </button>

              ))

            ) : (

              <p className="text-gray-400 text-sm p-2">
                No playlists found. Create a playlist first.
              </p>

            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default SongCard;

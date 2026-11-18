
import { useState } from "react";
import { Heart, Plus, Music2, Play } from "lucide-react";

function Library({
  songs = [],
  likedSongs = [],
  playlists = [],
  onPlay,
  onCreatePlaylist,
  onLike,
  onAddToPlaylist,
  initialTab = "library"
}) {
  const [playlistName, setPlaylistName] = useState("");

  function createPlaylist(e) {
    e.preventDefault();

    if (!playlistName.trim()) return;

    onCreatePlaylist(playlistName.trim());
    setPlaylistName("");
  }

  function addSong(playlistId, songId) {
    if (!songId) return;

    onAddToPlaylist(playlistId, songId);
  }

  return (
    <div className="p-6 text-white space-y-8">

      {/* Liked Songs */}
      {initialTab === "liked" && (
        <section>
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
            <Heart className="text-red-500" fill="currentColor" />
            Liked Songs
          </h1>

          {likedSongs.length === 0 ? (
            <p className="text-gray-400">
              You haven't liked any songs yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {likedSongs.map(song => (
                <div
                  key={song._id}
                  className="bg-gray-800 p-3 rounded-xl"
                >
                  <img
                    src={
                      song.image?.startsWith("http")
                        ? song.image
                        : `http://localhost:3000/${song.image?.replace(/^\//, "")}`
                    }
                    alt={song.title}
                    className="w-full aspect-square object-cover rounded-lg"
                  />

                  <h3 className="font-semibold mt-2">
                    {song.title}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {song.artist}
                  </p>

                  <div className="flex justify-between mt-3">
                    <button onClick={() => onPlay(song)}>
                      <Play />
                    </button>

                    <button onClick={() => onLike(song)}>
                      <Heart fill="red" className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Create Playlist */}
      {initialTab === "library" && (
        <section>
          <h1 className="text-2xl font-bold mb-4">
            Your Library
          </h1>

          <h2 className="text-xl font-bold mb-3">
            Create Playlist
          </h2>

          <form onSubmit={createPlaylist} className="flex gap-2">
            <input
              value={playlistName}
              onChange={e => setPlaylistName(e.target.value)}
              placeholder="Enter playlist name"
              className="bg-gray-800 p-3 rounded-lg outline-none flex-1"
            />

            <button
              type="submit"
              className="bg-green-600 px-4 rounded-lg flex items-center gap-2"
            >
              <Plus size={18} />
              Create
            </button>
          </form>
        </section>
      )}

      {/* Playlists */}
      {initialTab === "library" && (
        <section>
          <h2 className="text-xl font-bold mb-4">
            Your Playlists
          </h2>

          {playlists.length === 0 ? (
            <p className="text-gray-400">
              No playlists created yet.
            </p>
          ) : (
            <div className="space-y-4">
              {playlists.map(playlist => (
                <div
                  key={playlist._id}
                  className="bg-gray-800 p-4 rounded-xl"
                >
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Music2 />
                    {playlist.name}
                  </h3>

                  <p className="text-sm text-gray-400 mb-3">
                    {playlist.songs?.length || 0} songs
                  </p>

                  {playlist.songs?.map(song => (
                    <button
                      key={song._id}
                      onClick={() => onPlay(song)}
                      className="block text-left text-gray-300 hover:text-green-400 py-1"
                    >
                      {song.title} — {song.artist}
                    </button>
                  ))}

                  <div className="mt-3">
                    <label className="text-sm text-gray-300">
                      Add a song:
                    </label>

                    <select
                      defaultValue=""
                      onChange={e => {
                        addSong(playlist._id, e.target.value);
                        e.target.value = "";
                      }}
                      className="block w-full mt-2 bg-gray-700 p-2 rounded-lg"
                    >
                      <option value="">Select a song</option>

                      {songs.map(song => (
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
        </section>
      )}
    </div>
  );
}

export default Library;

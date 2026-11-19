

import SongCard from "../components/Songcard";

function Home({
  songs = [],
  onPlay,
  search = "",
  likedSongs = [],
  onLike,
  playlists = [],
  onAddToPlaylist
}) {
  const filteredSongs = songs.filter((song) => {
    const query = search.toLowerCase().trim();

    return (
      song.title?.toLowerCase().includes(query) ||
      song.artist?.toLowerCase().includes(query) ||
      song.album?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold text-white mb-3">
        Discover Music
      </h1>

      <h2 className="text-xl font-semibold text-white mb-1">
        {search ? "Search Results" : "All Songs"}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => (
            <SongCard
              key={song._id}
              song={song}
              onPlay={onPlay}
              likedSongs={likedSongs}
              onLike={onLike}
              playlists={playlists}
              onAddToPlaylist={onAddToPlaylist}
            />
          ))
        ) : (
          <p className="text-gray-400 col-span-full">
            No songs found!
          </p>
        )}

      </div>
    </div>
  );
}

export default Home;

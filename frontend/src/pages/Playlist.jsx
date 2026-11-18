import axios from "axios";

function Playlist() {

  const addToPlaylist = async (playlistId, songId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:3000/api/playlists/add-song",
        { playlistId, songId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(response.data.message);

    } catch (error) {
      console.error(error);
      alert("Unable to add song");
    }
  };

  return (
    <div>
      {/* Your playlist UI */}
    </div>
  );
}

export default Playlist;
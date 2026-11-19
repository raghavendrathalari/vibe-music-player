
import {
  useState,
  useEffect,
  useRef,
  useCallback
} from "react";

import axios from "axios";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LoadingScreen from "./components/LoadingScreen";
import Footer from "./components/Footer";

import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Library from "./pages/Library";
import MusicPlayer from "./components/MusicPlayer";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import API_URL from "./config";

// =====================================
// MUSIC APP
// =====================================

function MusicApp() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [search, setSearch] = useState("");

  const searchInputRef = useRef(null);

  // Loading states
  const [songsLoaded, setSongsLoaded] = useState(false);
  const [minimumTimePassed, setMinimumTimePassed] = useState(false);

  const showSplash = !songsLoaded || !minimumTimePassed;

  // =====================================
  // LOADING TIMER
  // =====================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumTimePassed(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // =====================================
  // AUTH CONFIG
  // =====================================

  function getConfig() {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  // =====================================
  // LIKED SONGS
  // =====================================

  const [likedSongs, setLikedSongs] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("likedSongs") || "[]"
      );
    } catch {
      return [];
    }
  });

  // =====================================
  // PLAYLISTS
  // =====================================

  const [playlists, setPlaylists] = useState([]);

  // =====================================
  // FETCH SONGS
  // =====================================

  useEffect(() => {
    let mounted = true;

    async function fetchSongs() {
      try {
        const res = await axios.get(
          `${API_URL}/api/songs/all-songs`,
          { timeout: 12000 }
        );

        const songList = Array.isArray(res.data)
          ? res.data
          : res.data?.songs || [];

        if (mounted) {
          setSongs(songList);

          console.log("Songs loaded:", songList);
        }
      } catch (error) {
        console.error(
          "Fetch songs error:",
          error.response?.data || error.message
        );

        if (mounted) {
          setSongs([]);
        }
      } finally {
        if (mounted) {
          setSongsLoaded(true);
        }
      }
    }

    fetchSongs();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================
  // FETCH PLAYLISTS
  // =====================================

  const loadPlaylists = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setPlaylists([]);
      return;
    }

    try {
      const res = await axios.get(
        `${API_URL}/api/playlists/my-playlists`,
        getConfig()
      );

      setPlaylists(res.data.playlists || []);
    } catch (error) {
      console.error(
        "Fetch playlists error:",
        error.response?.data || error.message
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        setPlaylists([]);
      }
    }
  }, []);

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  // =====================================
  // SAVE LIKED SONGS
  // =====================================

  useEffect(() => {
    localStorage.setItem(
      "likedSongs",
      JSON.stringify(likedSongs)
    );
  }, [likedSongs]);

  // =====================================
  // LIKE / UNLIKE
  // =====================================

  function toggleLike(song) {
    setLikedSongs((prev) => {
      const alreadyLiked = prev.some(
        (item) => item._id === song._id
      );

      if (alreadyLiked) {
        return prev.filter(
          (item) => item._id !== song._id
        );
      }

      return [...prev, song];
    });
  }

  // =====================================
  // CREATE PLAYLIST
  // =====================================

  async function createPlaylist(name) {
    try {
      const res = await axios.post(
        `${API_URL}/api/playlists/create`,
        { name },
        getConfig()
      );

      alert(
        res.data.message ||
        "Playlist created successfully"
      );

      await loadPlaylists();
    } catch (error) {
      console.error(
        "Create playlist error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
        "Unable to create playlist"
      );
    }
  }

  // =====================================
  // ADD SONG TO PLAYLIST
  // =====================================

  async function addToPlaylist(playlistId, songId) {
    try {
      const res = await axios.post(
        `${API_URL}/api/playlists/add-song`,
        { playlistId, songId },
        getConfig()
      );

      alert(
        res.data.message ||
        "Song added successfully"
      );

      await loadPlaylists();
    } catch (error) {
      console.error(
        "Add song error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
        "Unable to add song"
      );
    }
  }

  // =====================================
  // NEXT SONG
  // =====================================

  function nextSong() {
    if (!songs.length || !currentSong) return;

    const index = songs.findIndex(
      (song) => song._id === currentSong._id
    );

    if (index === -1) return;

    setCurrentSong(
      songs[(index + 1) % songs.length]
    );
  }

  // =====================================
  // PREVIOUS SONG
  // =====================================

  function previousSong() {
    if (!songs.length || !currentSong) return;

    const index = songs.findIndex(
      (song) => song._id === currentSong._id
    );

    if (index === -1) return;

    setCurrentSong(
      songs[
        (index - 1 + songs.length) % songs.length
      ]
    );
  }

  // =====================================
  // LOADING SCREEN
  // =====================================

  if (showSplash) {
    return <LoadingScreen />;
  }

  // =====================================
  // MUSIC APP UI
  // =====================================

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activePage={activePage}
        setActivePage={setActivePage}
        searchInputRef={searchInputRef}
      />

      <main className="min-w-0 pb-28">

        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          search={search}
          setSearch={setSearch}
          searchInputRef={searchInputRef}
        />

        {/* HOME */}

        {activePage === "home" && (
          <Home
            songs={songs}
            onPlay={setCurrentSong}
            search={search}
            likedSongs={likedSongs}
            onLike={toggleLike}
            playlists={playlists}
            onAddToPlaylist={addToPlaylist}
          />
        )}

        {/* SEARCH */}

        {activePage === "search" && (
          <Home
            songs={songs}
            onPlay={setCurrentSong}
            search={search}
            likedSongs={likedSongs}
            onLike={toggleLike}
            playlists={playlists}
            onAddToPlaylist={addToPlaylist}
          />
        )}

        {/* LIKED SONGS */}

        {activePage === "liked" && (
          <Library
            songs={songs}
            likedSongs={likedSongs}
            playlists={playlists}
            onPlay={setCurrentSong}
            onCreatePlaylist={createPlaylist}
            onLike={toggleLike}
            onAddToPlaylist={addToPlaylist}
            initialTab="liked"
          />
        )}

        {/* LIBRARY */}

        {activePage === "library" && (
          <Library
            songs={songs}
            likedSongs={likedSongs}
            playlists={playlists}
            onPlay={setCurrentSong}
            onCreatePlaylist={createPlaylist}
            onLike={toggleLike}
            onAddToPlaylist={addToPlaylist}
            initialTab="library"
          />
        )}

        {/* FOOTER */}

        <Footer setActivePage={setActivePage} />

      </main>

      {/* MUSIC PLAYER */}

      <MusicPlayer
        song={currentSong}
        onNext={nextSong}
        onPrevious={previousSong}
      />

    </div>
  );
}

// =====================================
// NORMAL USER PROTECTED ROUTE
// =====================================

function ProtectedRoute() {
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch {
    user = null;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <MusicApp />;
}

// =====================================
// AUTH REDIRECT
// =====================================

function AuthRedirect() {
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch {
    user = null;
  }

  if (!token || !user) {
    return <Login />;
  }

  return user.role === "admin"
    ? <Navigate to="/admin" replace />
    : <Navigate to="/" replace />;
}

// =====================================
// SIGNUP REDIRECT
// =====================================

function SignupRedirect() {
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch {
    user = null;
  }

  if (!token || !user) {
    return <Signup />;
  }

  return user.role === "admin"
    ? <Navigate to="/admin" replace />
    : <Navigate to="/" replace />;
}

// =====================================
// MAIN APP
// =====================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<AuthRedirect />}
        />

        <Route
          path="/signup"
          element={<SignupRedirect />}
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        <Route
          path="/*"
          element={<ProtectedRoute />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

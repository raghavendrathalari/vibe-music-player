
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Menu,
  X,
  LogOut,
  User
} from "lucide-react";

function Navbar({
  setIsSidebarOpen,
  isSidebarOpen,
  search,
  setSearch
}) {
  const navigate = useNavigate();

  // Get logged-in user
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // Logout
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("likedSongs");

    navigate("/login", { replace: true });
  }

  return (
    <div className="h-20 bg-gray-900 flex items-center justify-between px-8">

      {/* Hamburger + Navigation */}
      <div className="flex items-center gap-4">

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white hover:text-green-400"
        >
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="bg-black p-2 rounded-full text-white"
        >
          <ArrowLeft size={20} />
        </button>

        <button
          onClick={() => navigate(1)}
          className="bg-black p-2 rounded-full text-white"
        >
          <ArrowRight size={20} />
        </button>

      </div>

      {/* Search */}
      <div className="flex items-center bg-white rounded-full px-4 py-3 w-96">

        <Search size={20} className="text-gray-600" />

        <input
          type="text"
          placeholder="Search songs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-3 outline-none w-full text-black"
        />

        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-gray-500 hover:text-black"
          >
            <X size={18} />
          </button>
        )}

      </div>

      {/* User Profile + Logout */}
      <div className="flex items-center gap-4">

        <div className="flex items-center gap-2 text-white">
          <div className="bg-green-500 p-2 rounded-full text-black">
            <User size={20} />
          </div>

          <span className="font-semibold">
            {user?.username || user?.name || "User"}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-full font-bold hover:bg-green-400 transition"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </div>
  );
}

export default Navbar;

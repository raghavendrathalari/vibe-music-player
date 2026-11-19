
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
  const [showSearch, setShowSearch] = useState(false);

  // Get logged-in user safely
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("likedSongs");

    navigate("/login", { replace: true });
  }

  return (
    <nav className="min-h-16 md:min-h-20 bg-gray-900 flex items-center justify-between gap-2 px-3 sm:px-5 md:px-8 py-3">

      {/* Left Navigation */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">

        {/* Hamburger */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white hover:text-green-400 transition"
        >
          {isSidebarOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="bg-black p-2 rounded-full text-white hover:bg-gray-700"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Forward */}
        <button
          onClick={() => navigate(1)}
          className="bg-black p-2 rounded-full text-white hover:bg-gray-700"
        >
          <ArrowRight size={18} />
        </button>

      </div>

      {/* Desktop Search */}
      <div className="hidden sm:flex items-center bg-white rounded-full px-4 py-2.5 w-48 md:w-64 lg:w-96">

        <Search size={20} className="text-gray-600 shrink-0" />

        <input
          type="text"
          placeholder="Search songs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-3 outline-none w-full text-black min-w-0"
        />

        {search && (
          <button onClick={() => setSearch("")}>
            <X size={18} className="text-gray-500 hover:text-black" />
          </button>
        )}

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">

        {/* Mobile Search Button */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="sm:hidden text-white hover:text-green-400"
        >
          {showSearch ? <X size={23} /> : <Search size={23} />}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 text-white">

          <div className="bg-green-500 p-2 rounded-full text-black">
            <User size={18} />
          </div>

          <span className="hidden md:block font-semibold max-w-32 truncate">
            {user?.username || user?.name || "User"}
          </span>

        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 bg-white text-black px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-full font-bold text-xs sm:text-sm hover:bg-green-400 transition"
        >
          <LogOut size={17} />
          <span className="hidden xs:inline">Logout</span>
        </button>

      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="absolute top-16 left-0 w-full bg-gray-900 px-4 py-3 sm:hidden z-50 shadow-lg">

          <div className="flex items-center bg-white rounded-full px-4 py-3">

            <Search size={20} className="text-gray-600" />

            <input
              type="text"
              placeholder="Search songs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ml-3 outline-none w-full text-black"
              autoFocus
            />

            {search && (
              <button onClick={() => setSearch("")}>
                <X size={18} className="text-gray-500" />
              </button>
            )}

          </div>

        </div>
      )}

    </nav>
  );
}

export default Navbar;

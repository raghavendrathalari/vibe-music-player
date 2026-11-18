
import {
  Home,
  Search,
  Library,
  Heart,
  Music2,
  X
} from "lucide-react";

function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  activePage,
  setActivePage,
  searchInputRef
}) {

  function navigate(page) {
    setActivePage(page);
    setIsSidebarOpen(false);

    if (page === "search") {
      searchInputRef?.current?.focus();
    }
  }

  const menuClass = (page) =>
    `flex items-center gap-3 w-full p-3 rounded-lg transition
    ${
      activePage === page
        ? "bg-green-600 text-white"
        : "text-gray-300 hover:bg-gray-800"
    }`;

  return (
    <>
      {/* Background Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-950 p-5
        transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >

        {/* Logo */}
        <div className="flex justify-between items-center mb-8">

          <h2 className="text-xl font-bold text-green-500 flex gap-2">
            <Music2 />
            Music Player
          </h2>

          <button onClick={() => setIsSidebarOpen(false)}>
            <X />
          </button>

        </div>

        {/* Navigation */}
        <nav className="space-y-3">

          <button
            onClick={() => navigate("home")}
            className={menuClass("home")}
          >
            <Home size={20} />
            Home
          </button>

          <button
            onClick={() => navigate("search")}
            className={menuClass("search")}
          >
            <Search size={20} />
            Search
          </button>

          <button
            onClick={() => navigate("library")}
            className={menuClass("library")}
          >
            <Library size={20} />
            Your Library
          </button>

          <button
            onClick={() => navigate("liked")}
            className={menuClass("liked")}
          >
            <Heart size={20} />
            Liked Songs
          </button>

        </nav>
      </aside>
    </>
  );
}

export default Sidebar;


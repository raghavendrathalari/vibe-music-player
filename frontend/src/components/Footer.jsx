
import {
  Music2,
  Home,
  Library,
  Heart,
  Mail,
  MessageCircle,
  Camera
} from "lucide-react";

function Footer({ setActivePage = () => {} }) {
  const navClass =
    "flex items-center gap-2 text-sm transition-colors duration-200 hover:text-green-400";

  return (
    <footer className="w-full border-t border-gray-800 bg-gray-950 text-gray-400">
      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500">
                <Music2 size={26} className="text-black" />
              </div>

              <span className="text-2xl font-bold text-white">
                Vibe<span className="text-green-400">Music</span>
              </span>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-6">
              Feel every beat. Discover your favourite music
              and enjoy your own musical world with Vibe Music.
            </p>

            {/* SOCIAL LINKS */}
            <div className="mt-5 flex gap-5">
              <a
                href="https://www.instagram.com/raghavendra.6125/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition hover:text-pink-400"
              >
                <Camera size={21} />
              </a>

              <a
                href="https://wa.me/916302562173"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="transition hover:text-green-400"
              >
                <MessageCircle size={21} />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="mb-5 font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => setActivePage("home")}
                  className={navClass}
                >
                  <Home size={16} />
                  Home
                </button>
              </li>

              <li>
                <button
                  onClick={() => setActivePage("library")}
                  className={navClass}
                >
                  <Library size={16} />
                  Library
                </button>
              </li>

              <li>
                <button
                  onClick={() => setActivePage("liked")}
                  className={navClass}
                >
                  <Heart size={16} />
                  Liked Songs
                </button>
              </li>
            </ul>
          </div>

          {/* EXPLORE */}
          <div>
            <h3 className="mb-5 font-semibold text-white">
              Explore
            </h3>

            <p className="text-sm leading-6">
              Discover new music, explore your favourite songs
              and create playlists for every mood.
            </p>
          </div>

          {/* CONTACT US */}
          <div>
            <h3 className="mb-5 font-semibold text-white">
              Contact Us
            </h3>

            <p className="mb-5 text-sm leading-6">
              Have questions or suggestions? Connect with us.
            </p>

            <div className="space-y-4">
              <a
                href="https://wa.me/916302562173"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm transition hover:text-green-400"
              >
                <MessageCircle size={19} />
                WhatsApp
              </a>

              <a
                href="https://www.instagram.com/raghavendra.6125/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm transition hover:text-pink-400"
              >
                <Camera size={19} />
                Instagram
              </a>

              <a
                href="mailto:raghavendrathalari2005@gmail.com"
                className="flex items-center gap-3 text-sm transition hover:text-green-400"
              >
                <Mail size={19} />
                Email Support
              </a>
            </div>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-6 text-center text-sm md:flex-row">
          <p>
            © {new Date().getFullYear()} Vibe Music. All rights reserved.
          </p>

          <p className="text-gray-500">
            Made with passion for music.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;

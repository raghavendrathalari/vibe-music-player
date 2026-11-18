
import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2
} from "lucide-react";

const API_URL = "http://localhost:3000";

function getFileUrl(file) {
  if (!file) return "";

  if (file.startsWith("http")) return file;

  return `${API_URL}/${file.replace(/^\/+/, "")}`;
}

function MusicPlayer({ song, onNext, onPrevious }) {
  const audioRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const audioUrl = getFileUrl(song?.audio);

useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  audio.pause();
  audio.currentTime = 0;

  setPlaying(false);
  setCurrentTime(0);
  setDuration(0);

  if (!audioUrl) {
    audio.removeAttribute("src");
    audio.load();
    return;
  }

  audio.src = audioUrl;
  audio.load();

  audio.play()
    .then(() => {
      setPlaying(true);
    })
    .catch((error) => {
      console.error("Auto play failed:", error);
    });

}, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  async function togglePlay() {
    const audio = audioRef.current;

    if (!audio || !audioUrl) return;

    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      console.error("Audio playback failed:", error);
    }
  }

  function formatTime(time) {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  function seek(e) {
    const audio = audioRef.current;

    if (audio && duration) {
      audio.currentTime = Number(e.target.value);
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-black border-t border-gray-800 text-white px-6 flex items-center justify-between z-50">

      <audio
  ref={audioRef}
  onTimeUpdate={(e) =>
    setCurrentTime(e.target.currentTime)
  }
  onLoadedMetadata={(e) =>
    setDuration(e.target.duration)
  }
  onEnded={() => {
    setPlaying(false);
    onNext?.();
  }}
  onPause={() => setPlaying(false)}
  onPlay={() => setPlaying(true)}
  onError={(e) => {
    console.error("Audio error:", e.currentTarget.error);
    console.error("Audio URL:", audioUrl);
  }}
/>

      <div className="flex items-center gap-3 w-1/4">
        {song && (
          <>
            <img
              src={getFileUrl(song.image)}
              alt={song.title}
              className="w-14 h-14 rounded object-cover"
            />

            <div className="min-w-0">
              <h3 className="font-semibold truncate">
                {song.title}
              </h3>
              <p className="text-gray-400 text-sm truncate">
                {song.artist}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col items-center w-2/4 gap-2">

        <div className="flex items-center gap-6">
          <button onClick={onPrevious}>
            <SkipBack size={22} />
          </button>

          <button
            onClick={togglePlay}
            disabled={!audioUrl}
            className="bg-white text-black p-3 rounded-full disabled:opacity-40"
          >
            {playing ? (
              <Pause size={20} />
            ) : (
              <Play size={20} fill="black" />
            )}
          </button>

          <button onClick={onNext}>
            <SkipForward size={22} />
          </button>
        </div>

        <div className="flex items-center gap-3 w-full max-w-lg">
          <span className="text-xs text-gray-400">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={Math.min(currentTime, duration || 0)}
            onChange={seek}
            className="flex-1 accent-green-500"
          />

          <span className="text-xs text-gray-400">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 w-1/4 justify-end">
        <Volume2 size={20} />

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24 accent-green-500"
        />
      </div>
    </div>
  );
}

export default MusicPlayer;

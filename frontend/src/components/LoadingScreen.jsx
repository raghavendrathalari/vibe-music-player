
import { Music2, Headphones } from "lucide-react";
import vibeLogo from "../assets/vibe-music-logo.png";

function LoadingScreen() {
  const bars = [20, 35, 50, 30, 45, 25, 55, 35, 20];

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-hidden bg-[#07080d] text-white">

      {/* Background gradients */}
      <div className="absolute -left-40 -top-40 h-96 w-96  bg-green-500/20 blur-[120px]" /> 

      <div className="absolute -bottom-40 -right-40 h-96 w-96 bg-purple-600/20 blur-[120px]" /> 

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-4">

        {/* Music disc */}
        <div className="relative mb-9 flex h-32 w-32 items-center justify-center  border-green-400/30 bg-linear-to-br from-green-400/20 to-purple-600/20 shadow-[0_0_70px_rgba(34,197,94,0.18)]">

          {/* Rotating outer circle */}
          {/* <div className="absolute inset-3 border-4 border-dashed border-green-400/40 animate-spin" /> */}

        {/* Center Vibe Music Logo */}
        <div className="flex h-40 w-40 items-center justify-center">
         <img
         src={vibeLogo}
         alt="Vibe Music Logo"
         className="h-full w-full object-contain drop-shadow-[0_0_25px_rgba(34,197,94,0.5)] animate-pulse"
         />
        </div>

          {/* Headphone icon */}
          <div className="absolute -right-3 -top-2 rounded-full bg-purple-500 p-2 shadow-lg">
            <Headphones size={20} className="text-white" />
          </div>
        </div>

        {/* App name */}
        <h1 className="text-center text-4xl font-black tracking-[0.18em]">
          VIBE
          <span className="text-green-400"> MUSIC</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-sm tracking-[0.35em] text-gray-400">
          FEEL THE MUSIC
        </p>

        {/* Equalizer animation */}
        <div className="mt-12 flex h-14 items-center gap-2">
          {bars.map((height, index) => (
            <div
              key={index}
              className="equalizer-bar w-2 rounded-full bg-linear-to-t from-green-500 to-emerald-200"
              style={{
                height: `${height}px`,
                animationDelay: `${index * 0.12}s`,
              }}
            />
          ))}
        </div>

        {/* Loading text */}
        <p className="mt-7 text-center text-xs font-medium tracking-[0.3em] text-gray-400">
          LOADING YOUR MUSIC EXPERIENCE
        </p>

        {/* Progress bar */}
        <div className="mt-5 h-1 w-56 overflow-hidden rounded-full bg-gray-800">
          <div className="loading-progress h-full rounded-full bg-linear-to-r from-green-400 to-emerald-200" />
        </div>

        {/* Footer */}
        <p className="mt-5 text-xs text-gray-600">
          Made for music lovers
        </p>

      </div>
    </div>
  );
}

export default LoadingScreen;

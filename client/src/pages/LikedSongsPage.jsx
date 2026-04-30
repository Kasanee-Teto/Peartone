import { useState } from "react";
import Sidebar from "../components/Sidebar";
import MusicCard from "../components/MusicCard";

const likedSongs = [
  { id: 1, title: "Night Runner", artist: "Arka Lane", album: "After Dark", duration: "3:21", genre: "Pop", cover_url: "https://via.placeholder.com/240?text=A", play_count: 45120 },
  { id: 2, title: "Static Heart", artist: "Nova Echo", album: "City Lights", duration: "4:02", genre: "Electronic", cover_url: "https://via.placeholder.com/240?text=B", play_count: 39810 },
  { id: 3, title: "Soft Gravity", artist: "Luna Vale", album: "Sunset Tapes", duration: "3:48", genre: "Indie", cover_url: "https://via.placeholder.com/240?text=C", play_count: 38750 },
  { id: 4, title: "Move Fast", artist: "Rift Boys", album: "Throttle", duration: "2:55", genre: "Hip-Hop", cover_url: "https://via.placeholder.com/240?text=D", play_count: 42200 },
  { id: 5, title: "Bloom", artist: "Mira Sol", album: "Orbit", duration: "4:16", genre: "Alt Pop", cover_url: "https://via.placeholder.com/240?text=E", play_count: 36140 },
  { id: 6, title: "Blue Skyline", artist: "Velvet Peak", album: "Blue Hour", duration: "3:37", genre: "Dream Pop", cover_url: "https://via.placeholder.com/240?text=F", play_count: 31990 },
];

const LikedSongsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white">
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#7c6af7] opacity-20 blur-[120px]" />
          <div className="absolute bottom-6 right-0 h-72 w-72 rounded-full bg-[#c8f560] opacity-15 blur-[140px]" />
        </div>

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={() => setIsSidebarOpen(false)}
        />

        <button
          className={`home__sidebar-overlay ${isSidebarOpen ? "is-open" : ""}`}
          type="button"
          aria-label="Tutup menu samping"
          onClick={() => setIsSidebarOpen(false)}
        />

        <button
          className="home__sidebar-toggle"
          type="button"
          aria-label="Buka menu samping"
          aria-controls="home-sidebar"
          aria-expanded={isSidebarOpen}
          onClick={() => setIsSidebarOpen(true)}
        >
          ≡
        </button>

        <section className="relative z-10 grid w-full gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center">
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              Liked Songs
            </h1>
            <p className="mt-4 max-w-md text-sm text-white/60 sm:text-base">
              Lagu-lagu favorit yang kamu simpan untuk didengar lagi kapan saja.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">Saved Tracks</h2>
              <span className="rounded-full border border-white/5 bg-white/5 px-2 py-1 text-xs uppercase tracking-[0.2em] text-white/50">
                {likedSongs.length} Songs
              </span>
            </div>

            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4" aria-label="Daftar liked songs">
              {likedSongs.map((track) => (
                <li key={track.id}>
                  <MusicCard track={track} variant="popular" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LikedSongsPage;
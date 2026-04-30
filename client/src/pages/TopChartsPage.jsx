import { useState } from "react";
import Sidebar from "../components/Sidebar";
import MusicCard from "../components/MusicCard";

const charts = [
  { id: 1, title: "Neon Drive", artist: "Arka Lane", album: "After Dark", duration: "3:42", genre: "Pop", cover_url: "https://via.placeholder.com/240?text=01", play_count: 84500 },
  { id: 2, title: "Midnight Pulse", artist: "Nova Echo", album: "City Lights", duration: "4:08", genre: "Electronic", cover_url: "https://via.placeholder.com/240?text=02", play_count: 78200 },
  { id: 3, title: "Golden Hour", artist: "Luna Vale", album: "Sunset Tapes", duration: "3:19", genre: "Indie", cover_url: "https://via.placeholder.com/240?text=03", play_count: 69800 },
  { id: 4, title: "Fast Lane", artist: "Rift Boys", album: "Throttle", duration: "2:57", genre: "Hip-Hop", cover_url: "https://via.placeholder.com/240?text=04", play_count: 65500 },
  { id: 5, title: "Starfall", artist: "Mira Sol", album: "Orbit", duration: "4:12", genre: "Alt Pop", cover_url: "https://via.placeholder.com/240?text=05", play_count: 60100 },
];

const TopChartsPage = () => {
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
              Top Charts
            </h1>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">Trending Tracks</h2>
              <p className="mt-4 max-w-md text-sm text-white/60 sm:text-base">
              Lagu-lagu yang lagi naik dan paling sering didengar minggu ini.
              </p>
            </div>

            <ol className="space-y-3" aria-label="Daftar top charts">
              {charts.map((track, index) => (
                <li key={track.id}>
                  <MusicCard track={track} variant="chart" rank={index + 1} />
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </main>
  );
};

export default TopChartsPage;
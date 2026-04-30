import { useState } from "react";
import Sidebar from "../components/Sidebar";

const albums = [
  { id: 1, title: "After Dark", artist: "Arka Lane", year: "2026", tracks: 12, accent: "from-[#7c6af7] to-[#111114]" },
  { id: 2, title: "City Lights", artist: "Nova Echo", year: "2025", tracks: 10, accent: "from-[#00d4ff] to-[#111114]" },
  { id: 3, title: "Sunset Tapes", artist: "Luna Vale", year: "2026", tracks: 14, accent: "from-[#ff5c6e] to-[#111114]" },
  { id: 4, title: "Throttle", artist: "Rift Boys", year: "2024", tracks: 11, accent: "from-[#ffa500] to-[#111114]" },
  { id: 5, title: "Orbit", artist: "Mira Sol", year: "2025", tracks: 9, accent: "from-[#c8f560] to-[#111114]" },
  { id: 6, title: "Blue Hour", artist: "Velvet Peak", year: "2026", tracks: 13, accent: "from-[#ec4899] to-[#111114]" },
];

const AlbumsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white">
      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center px-4 py-8 sm:px-6 sm:py-10">
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

        <section className="relative z-10 grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-center">
            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
              Albums
            </h1>
            <p className="mt-3 max-w-md text-sm text-white/60">
              Koleksi album terbaik untuk menemani eksplorasi musikmu.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Latest Albums</h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/50">
                Fresh
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {albums.map((album) => (
                <article key={album.id} className="overflow-hidden rounded-3xl border border-white/10 bg-[#111114]">
                  <div className={`flex h-28 items-end bg-gradient-to-br ${album.accent} p-3`}>
                    <div className="h-12 w-12 rounded-2xl border border-white/20 bg-white/10 backdrop-blur" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold">{album.title}</h3>
                    <p className="mt-1 text-sm text-white/60">{album.artist}</p>
                    <div className="mt-4 flex items-center justify-between text-sm text-white/65">
                      <span>{album.year}</span>
                      <span>{album.tracks} tracks</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AlbumsPage;
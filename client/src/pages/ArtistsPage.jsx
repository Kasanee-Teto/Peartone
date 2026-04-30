import { useState } from "react";
import Sidebar from "../components/Sidebar";

const artists = [
  { id: 1, name: "Arka Lane", genre: "Pop / R&B", followers: "1.2M", color: "from-[#7c6af7] to-[#c8f560]" },
  { id: 2, name: "Nova Echo", genre: "Electronic", followers: "980K", color: "from-[#00d4ff] to-[#7c6af7]" },
  { id: 3, name: "Luna Vale", genre: "Indie Pop", followers: "740K", color: "from-[#ff5c6e] to-[#ffa500]" },
  { id: 4, name: "Rift Boys", genre: "Hip-Hop", followers: "2.1M", color: "from-[#ffa500] to-[#c8f560]" },
  { id: 5, name: "Mira Sol", genre: "Alt Pop", followers: "860K", color: "from-[#0ea5e9] to-[#7c6af7]" },
  { id: 6, name: "Velvet Peak", genre: "Dream Pop", followers: "520K", color: "from-[#ec4899] to-[#7c6af7]" },
];

const ArtistsPage = () => {
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
              Artists
            </h1>
            <p className="mt-3 max-w-md text-sm text-white/60">
              Temukan musisi yang lagi ramai didengar dan cocok dengan selera kamu.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Featured Artists</h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/50">
                Popular
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {artists.map((artist) => (
                <article key={artist.id} className="overflow-hidden rounded-3xl border border-white/10 bg-[#111114]">
                  <div className={`h-24 bg-gradient-to-br ${artist.color}`} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold">{artist.name}</h3>
                        <p className="mt-1 text-sm text-white/60">{artist.genre}</p>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                        {artist.followers}
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-white/65">
                      Profil artis pilihan yang cocok untuk eksplorasi playlist harian.
                    </p>
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

export default ArtistsPage;
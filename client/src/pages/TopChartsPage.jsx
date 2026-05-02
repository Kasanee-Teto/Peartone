import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import MusicCard from "../components/MusicCard";
import { useFetch } from "../hooks/useFetch";

function normalizeTrack(track) {
  const artist =
    Array.isArray(track?.Artists) && track.Artists.length > 0
      ? track.Artists.map((item) => item?.name).filter(Boolean).join(", ")
      : track?.artist || track?.Artist?.name || "Unknown Artist";

  return {
    ...track,
    title: track?.title || track?.name || "Untitled",
    artist,
    album: track?.Album?.title || track?.album || "",
    cover_url:
      track?.cover ||
      track?.coverUrl ||
      track?.image ||
      track?.imageUrl ||
      track?.Album?.cover ||
      track?.Album?.coverUrl ||
      "",
    duration: track?.duration || 0,
  };
}

const TopChartsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: tracksResp, loading, error } = useFetch("/tracks?page=1&limit=5");

  const chartsRaw = useMemo(() => {
    if (Array.isArray(tracksResp)) return tracksResp;
    if (Array.isArray(tracksResp?.data)) return tracksResp.data;
    return [];
  }, [tracksResp]);

  const charts = useMemo(() => chartsRaw.map(normalizeTrack), [chartsRaw]);

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
              Top Charts
            </h1>
            <p className="mt-3 max-w-md text-sm text-white/60">
              Lagu-lagu yang lagi naik dan paling sering didengar minggu ini.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Trending Tracks</h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/50">
                Live
              </span>
            </div>

            {loading ? (
              <p className="text-sm text-white/60">Memuat chart...</p>
            ) : error ? (
              <p className="text-sm text-red-300">Gagal memuat charts: {error}</p>
            ) : (
              <ol className="space-y-2.5" aria-label="Daftar top charts">
                {charts.map((track, index) => (
                  <li key={track.id}>
                    <MusicCard track={track} variant="chart" rank={index + 1} />
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default TopChartsPage;
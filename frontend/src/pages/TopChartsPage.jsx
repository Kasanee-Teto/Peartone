import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import MusicCard from "../components/MusicCard";
import { useFetch } from "../hooks/useFetch";
import { authApi } from "../api/auth";

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

const handleLogout = async () => {
  try {
    await authApi.logout();
    setIsSidebarOpen(false);
    navigate("/login"); 
  } catch (err) {
    console.error("Logout failed", err);
  }
};

const TopChartsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: tracksResp, loading, error } = useFetch("/tracks?page=1&limit=5");

  const chartsRaw = useMemo(() => {
    let rawData = [];
    if (Array.isArray(tracksResp)) rawData = tracksResp;
    else if (Array.isArray(tracksResp?.data)) rawData = tracksResp.data;
    return [...rawData].sort((a, b) => (b.listeners || 0) - (a.listeners || 0));
  }, [tracksResp]);

  const charts = useMemo(() => chartsRaw.map(normalizeTrack), [chartsRaw]);

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white">
      <div className="relative mx-auto flex max-w-5xl items-start px-4 py-8 pt-20 sm:px-6 sm:py-10 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#7c6af7] opacity-20 blur-[120px]" />
          <div className="absolute bottom-6 right-0 h-72 w-72 rounded-full bg-[#c8f560] opacity-15 blur-[140px]" />
        </div>

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
        />

        <button
          className={`home__sidebar-overlay ${isSidebarOpen ? "is-open" : ""}`}
          type="button"
          aria-label="Tutup menu samping"
          onClick={() => setIsSidebarOpen(false)}
        />

        <button
          className="home__sidebar-toggle fixed left-4 top-4 z-50"
          type="button"
          aria-label="Buka menu samping"
          aria-controls="home-sidebar"
          aria-expanded={isSidebarOpen}
          onClick={() => setIsSidebarOpen(true)}
        >
          ≡
        </button>

        <section className="relative z-10 grid w-full min-w-0 gap-8 pl-14 lg:pl-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="w-14 shrink-0 lg:hidden" aria-hidden="true" />
              <div>
                <h1 className="mt-1 text-3xl font-semibold leading-tight sm:text-4xl">
                  Top Charts
                </h1>
                <p className="mt-3 max-w-md text-sm text-white/60">
                  Top trending musics this week!
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="translate-x-3 translate-y-1 inline-block text-[10px] scale-75 origin-left uppercase font-bold text-white/50">
                Trending Tracks
              </h2>
            </div>

            {loading ? (
              <p className="text-sm text-white/60">Loading Chart...</p>
            ) : error ? (
              <p className="text-sm text-red-300">Failed to load Charts: {error}</p>
            ) : (
              <ol className="space-y-2.5" aria-label="Daftar top charts">
                {charts.map((track, index) => (
                  <li key={track.id} className="min-w-0 overflow-hidden rounded-2xl">
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
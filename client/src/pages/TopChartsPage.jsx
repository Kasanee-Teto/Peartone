import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MusicCard from "../components/MusicCard";
import { useFetch } from "../hooks/useFetch";
import { authApi } from "../api/auth";
import { FiTrendingUp, FiMusic } from "react-icons/fi";

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
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: tracksResp, loading, error } = useFetch("/tracks?page=1&limit=20"); 

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsSidebarOpen(false);
      navigate("/login"); 
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const chartsRaw = useMemo(() => {
    let rawData = [];
    if (Array.isArray(tracksResp)) rawData = tracksResp;
    else if (Array.isArray(tracksResp?.data)) rawData = tracksResp.data;
    return [...rawData].sort((a, b) => (b.listeners || 0) - (a.listeners || 0));
  }, [tracksResp]);

  const charts = useMemo(() => chartsRaw.map(normalizeTrack), [chartsRaw]);

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white overflow-x-hidden pb-24 font-sans">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-32 w-[500px] h-[500px] rounded-full bg-[#7c6af7] opacity-[0.07] blur-[140px]" />
        <div className="absolute -bottom-20 right-0 w-[384px] h-[384px] rounded-full bg-[#c8f560] opacity-[0.06] blur-[140px]" />
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <button
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 backdrop-blur-sm ${
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        type="button"
        aria-label="Close Sidebar"
        onClick={() => setIsSidebarOpen(false)}
      />

      <button
        className="fixed right-6 top-6 z-50 inline-flex items-center justify-center bg-[#18181c] text-[#c8f560] border border-white/5 rounded-xl h-11 w-11 shadow-lg hover:bg-[#c8f560] hover:text-[#0d0d0f] transition-all duration-200 active:scale-95"
        type="button"
        aria-label="Open Sidebar"
        aria-expanded={isSidebarOpen}
        onClick={() => setIsSidebarOpen(true)}
      >
        ≡
      </button>

      <div className="mx-auto max-w-7xl px-6 pt-24 md:px-12 lg:pt-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:h-[calc(100vh-160px)] lg:items-stretch">

          <div className="flex flex-col justify-center lg:pr-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c8f560]/10 text-[#c8f560] text-xs font-semibold tracking-wider uppercase mb-4 mx-auto lg:mx-0 w-fit">
              <FiTrendingUp size={14} />
              <span>Weekly Rankings</span>
            </div>
            <h1 className="text-4xl font-extrabold font-display tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
              Top <span className="text-[#c8f560]">Charts</span>
            </h1>
            <p className="mt-4 max-w-md text-base text-white/50 leading-relaxed mx-auto lg:mx-0 font-light">
              Discover the most played soundscapes and trending records across the globe this week (LIVE).
            </p>
          </div>

          <div className="flex flex-col min-w-0 rounded-2xl border border-white/10 bg-[#141417a8] shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl overflow-hidden lg:h-full">
            <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-6 py-4">
              <div className="flex items-center gap-2">
                <FiMusic size={16} className="text-white/40" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">
                  Trending Tracks
                </h2>
              </div>
              <span className="text-xs font-medium text-[#c8f560] bg-[#c8f560]/10 px-2.5 py-0.5 rounded-full">
                {charts.length} Hits Found
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 scrollbar-thin scrollbar-thumb-white/10 overscroll-contain">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-3">
                  <div className="w-8 h-8 border-2 border-[#c8f560] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-white/40 animate-pulse font-medium">Loading Chart Data...</p>
                </div>
              ) : error ? (
                <div className="text-center py-24 border border-red-500/10 rounded-xl bg-red-500/5 p-6">
                  <p className="text-sm text-red-400 font-medium">Failed to load Charts: {error}</p>
                </div>
              ) : charts.length === 0 ? (
                <div className="text-center py-24 text-white/40 text-sm font-medium">
                  No charts available at the moment.
                </div>
              ) : (
                <ol className="space-y-3" aria-label="Daftar top charts">
                  {charts.map((track, index) => (
                    <li 
                      key={track.id || index} 
                      className="min-w-0 overflow-hidden rounded-xl transition-all duration-200 hover:bg-white/[0.02] hover:translate-x-1"
                    >
                      <MusicCard track={track} variant="top_chart" rank={index + 1} />
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default TopChartsPage;
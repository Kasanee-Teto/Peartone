import { useMemo, useState } from "react";
import MusicCard from "../components/MusicCard.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { handleLogout } from "../api/client.js";
import { FiTrendingUp, FiMusic, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SidebarSetup from "../components/SidebarSetup.jsx";
import { normalizeTrack } from "../utils/playerBus.js";
import { useNavigate } from "react-router-dom";

const TopChartsPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const { data: tracksResp, loading, error } = useFetch(`/tracks?page=1&limit=20`); 

  const chartsRaw = useMemo(() => {
    let rawData = [];
    if (Array.isArray(tracksResp)) rawData = tracksResp;
    else if (Array.isArray(tracksResp?.data)) rawData = tracksResp.data;
    const normalized = rawData.map(normalizeTrack);
    return [...normalized].sort((a, b) => (b.listeners || 0) - (a.listeners || 0));
  }, [tracksResp]);

  const currentPageCharts = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return chartsRaw.slice(startIndex, endIndex);
  }, [chartsRaw, page, itemsPerPage]);

  const isLastPage = page * itemsPerPage >= chartsRaw.length;

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white overflow-x-hidden pb-24 font-sans">
      <SidebarSetup handleLogout={() => handleLogout(setIsSidebarOpen, navigate)} />

      <div className="mx-auto max-w-7xl px-6 pt-24 md:px-12 lg:pt-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:h-full lg:items-stretch">

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
              ) : currentPageCharts.length === 0 ? (
                <div className="text-center py-24 text-white/40 text-sm font-medium">
                  No charts available at the moment.
                </div>
              ) : (
                <ol className="space-y-3" aria-label="Daftar top charts">
                  {currentPageCharts.map((track, index) => (
                    <li 
                      key={track.id || index} 
                      className="min-w-0 overflow-hidden rounded-xl transition-all duration-200 hover:bg-white/[0.02] hover:translate-x-1"
                    >
                      <MusicCard track={track} variant="top_chart" rank={(page - 1) * itemsPerPage + (index + 1)} />
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/5 bg-white/[0.01] px-6 py-4 mt-auto">
              <button
                type="button"
                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                disabled={page === 1 || loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/60 bg-white/5 rounded-lg border border-white/5 transition hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
              >
                <FiChevronLeft size={14} />
                Previous
              </button>

              <span className="text-xs font-mono text-white/40">
                Page {page}
              </span>

              <button
                type="button"
                onClick={() => setPage((old) => old + 1)}
                disabled={isLastPage || loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/60 bg-white/5 rounded-lg border border-white/5 transition hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
              >
                Next
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TopChartsPage;
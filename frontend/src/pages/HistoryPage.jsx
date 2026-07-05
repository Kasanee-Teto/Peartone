import { useState, useEffect } from "react";
import { FiSearch, FiTrash2, FiX, FiAlertTriangle } from "react-icons/fi";
import { useFetch } from "../hooks/useFetch.js";
import { historyApi } from "../api/history.js";
import { handleLogout } from "../api/client.js";
import SidebarSetup from "../components/SidebarSetup.jsx";
import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [clearing, setClearing] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const { data: historyResp, loading, error, execute: reloadHistory } = useFetch("/history");

  const rows = Array.isArray(historyResp) ? historyResp : historyResp?.data || [];

  const q = search.trim().toLowerCase();
  const filtered = q
    ? rows.filter((r) => {
        const t = r.Track || {};
        return [t.title, t?.Artists?.map?.((a) => a.name).join(", "), t?.Album?.title]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q));
      })
    : rows;

  const formatPlayedAt = (row) => {
    const value = row.playedAt || row.createdAt;
    if (!value) return "—";
    return new Date(value).toLocaleString();
  };

  const handleClearHistory = async () => {
    try {
      setClearing(true);
      await historyApi.clear();
      setShowDeletePopup(false);
      await reloadHistory();
    } catch (err) {
      window.alert(err.message || "Failed to load history");
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    window.addEventListener("focus", reloadHistory);
    return () => window.removeEventListener("focus", reloadHistory);
  }, [reloadHistory]);

  return (
    <main className="w-full min-h-screen bg-[#0d0d0f] text-white relative overflow-hidden flex" aria-label="History">
      <SidebarSetup 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        handleLogout={() => handleLogout(setIsSidebarOpen, navigate)} 
      />

      <div className="flex-1 w-full min-w-0 relative z-10 flex flex-col h-screen overflow-y-auto scrollbar-hidden">
        <header className="w-full h-16 min-h-16 px-5 sm:px-6 flex items-center justify-between md:hidden border-b border-white/5 bg-[#0d0d0f]/80 backdrop-blur-md sticky top-1.5 z-50">
          <span className="font-display font-extrabold text-white text-lg tracking-tight select-none">Peartone</span>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center justify-center h-10 w-10 text-lime-300 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 active:scale-80 transition-all cursor-pointer"
            aria-label="Open menu"
          >
            <span className="text-xl leading-none -mt-0.5">☰</span>
          </button>
        </header>

        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pt-12 flex flex-col gap-6">
          <header className="flex items-start justify-between gap-4 border-b border-white/5 pb-5">
            <div>
              <p className="m-0 mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Library</p>
              <h1 className="m-0 text-[clamp(2rem,6vw,3.25rem)] font-black leading-none tracking-tight">History</h1>
              <p className="m-0 mt-2 text-xs sm:text-sm text-white/45 leading-relaxed">Latest Music Track(s).</p>
            </div>
            <span className="shrink-0 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-[#1ed760] bg-[#1ed760]/10 border border-[#1ed760]/20">
              Recent
            </span>
          </header>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3" aria-label="History Controls">
            <label className="flex-1 flex items-center gap-2.5 p-3 px-3.5 rounded-xl border border-white/10 bg-white/5 transition-colors focus-within:border-[#1ed760]/40">
              <FiSearch className="shrink-0 text-white/40 text-sm" />
              <input 
                className="w-full bg-transparent border-none outline-none text-white text-sm placeholder:text-white/35" 
                type="search" 
                placeholder="Search for Title, Artist, and Album" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </label>

            <button 
              type="button" 
              className="inline-flex items-center justify-center gap-2 p-3 px-4 rounded-xl border border-white/10 bg-white/5 text-white/80 cursor-pointer transition-all whitespace-nowrap hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed" 
              onClick={() => setShowDeletePopup(true)} 
              disabled={rows.length === 0 || clearing} 
              title={rows.length === 0 ? "Empty History" : "Delete All Histories"}
            >
              <FiTrash2 size={15}/>
              <span className="text-sm font-semibold">{clearing ? "Deleting..." : "Clear All"}</span>
            </button>
          </div>

          <section className="w-full rounded-2xl bg-white/[0.01] border border-white/5 overflow-hidden" aria-label="Daftar history">
            <div className="grid grid-cols-[32px_1fr_56px] min-[640px]:grid-cols-[40px_2.5fr_1.5fr_1.5fr_140px] gap-4 p-3 px-4 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/35 bg-white/[0.02] border-b border-white/5" role="row">
              <div role="columnheader">#</div>
              <div role="columnheader">Title</div>
              <div role="columnheader" className="hidden min-[640px]:block">Artist</div>
              <div role="columnheader" className="hidden min-[640px]:block">Album</div>
              <div role="columnheader" className="hidden min-[640px]:block text-right">Played At</div>
              <div role="columnheader" className="min-[640px]:hidden text-right">Info</div>
            </div>

          {loading ? (
            <div className="p-4 text-sm text-white/40">Loading…</div>
          ) : error ? (
            <div className="p-4 text-sm text-red-400">Failed to load history: {error}</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-sm text-white/45" role="status">
              {rows.length === 0 ? "No history." : "No result matches search criteria."}
            </div>
          ) : (
            <ul className="list-none m-0 p-1 divide-y divide-white/[0.02]">
              {filtered.map((row, index) => {
                const t = row.Track || {};
                const artist = Array.isArray(t.Artists) ? t.Artists.map((a) => a.name).join(", ") : t.Artist?.name || "Unknown";
                
                return (
                  <li 
                    key={row.id || index} 
                    className="grid grid-cols-[32px_1fr_56px] min-[640px]:grid-cols-[40px_2.5fr_1.5fr_1.5fr_140px] gap-4 p-3 px-4 items-center text-white/80 rounded-xl transition-all hover:bg-white/[0.03]"
                  >
                    <div className="text-white/30 tabular-nums text-xs font-semibold">{index + 1}</div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm truncate" title={t.title}>{t.title}</div>
                      <div className="min-[640px]:hidden text-white/40 text-xs truncate mt-0.5 font-medium">
                        {artist} {t.Album?.title ? `· ${t.Album.title}` : ""}
                      </div>
                    </div>
                    <div className="hidden min-[640px]:block text-white/50 text-xs font-medium truncate" title={artist}>{artist}</div>
                    <div className="hidden min-[640px]:block text-white/40 text-xs font-medium truncate" title={t.Album?.title}>{t.Album?.title || "—"}</div>
                    <div className="hidden min-[640px]:block text-right tabular-nums text-white/40 text-xs font-medium" title={formatPlayedAt(row)}>{formatPlayedAt(row)}</div>
                    <div className="min-[640px]:hidden text-right text-[10px] font-medium text-white/20 italic">Recent</div>
                  </li>
                );
              })}
            </ul>
          )}
          </section>
        </div>
      </div>

      {showDeletePopup && (
        <div className="fixed inset-0 z-[400] grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="history-delete-title">
          <button
            type="button"
            className="absolute inset-0 border-0 bg-black/70 backdrop-blur-sm transition-opacity"
            aria-label="Close popup"
            onClick={() => setShowDeletePopup(false)}
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#121214] shadow-2xl p-6 transition-all animate-[history-pop-in_150ms_ease-out]">

            <div className="w-12 h-12 rounded-xl grid place-items-center bg-amber-500/10 text-amber-400 mb-4" aria-hidden="true">
              <FiAlertTriangle className="w-5 h-5" />
            </div>

            <button
              type="button"
              className="absolute top-4 right-4 w-8 h-8 border-0 rounded-full bg-white/5 text-white/60 grid place-items-center cursor-pointer hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close popup"
              onClick={() => setShowDeletePopup(false)}
            >
              <FiX size={14} />
            </button>

            <h2 className="m-0 text-xl font-bold tracking-tight" id="history-delete-title">Delete all histories?</h2>
            <p className="mt-2 text-white/60 text-xs sm:text-sm leading-relaxed">
              All music histories will be removed. This action cannot be reverted.
            </p>

            <div className="flex flex-col-reverse sm:flex-row gap-2.5 justify-end mt-6">
              <button
                type="button"
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-white/5 font-bold bg-white/5 text-white/80 text-xs cursor-pointer hover:bg-white/10 hover:text-white transition-all"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-transparent font-bold bg-[#1ed760] text-[#08110b] text-xs cursor-pointer hover:bg-[#2ae06d] transition-all"
                onClick={handleClearHistory}
                disabled={clearing}
              >
                {clearing ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default HistoryPage;
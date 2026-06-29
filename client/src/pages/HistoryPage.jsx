import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FiSearch, FiTrash2, FiX, FiAlertTriangle } from "react-icons/fi";
import { useFetch } from "../hooks/useFetch";
import { historyApi } from "../api/history.js";
import { authApi } from "../api/auth.js";

const HistoryPage = () => {
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

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsSidebarOpen(false);
      navigate("/login"); 
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0d0d0f] text-white" aria-label="History">
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

      <div className="relative z-10 max-w-[1024px] mx-auto px-6 pt-12 pb-24">
        
        <header className="flex items-start justify-between gap-4 border-b border-white/6 pb-7 mb-7">
          <div>
            <p className="m-0 mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Library</p>
            <h1 className="m-0 text-5xl sm:text-[56px] font-black line-height-1 tracking-tight">History</h1>
            <p className="mt-3 max-w-[360px] text-xs sm:text-sm text-white/45 leading-relaxed">Latest Music Track(s).</p>
          </div>
          <span className="shrink-0 mt-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-[#1ed760] bg-[#1ed760]/10 border border-[#1ed760]/18">
            Recent
          </span>
        </header>

        <div className="flex flex-col min-[680px]:flex-row items-stretch min-[680px]:items-center justify-between gap-3 my-[18px] mx-0" aria-label="Kontrol history">
          <label className="flex-1 flex items-center gap-2.5 p-[10px_12px] rounded-xl border border-white/10 bg-white/[0.04]" aria-label="Cari di history">
            <FiSearch className="shrink-0 text-white/[0.55]" />
            <input 
              className="w-full bg-transparent border-none outline-none text-white/[0.88] text-xs sm:text-sm placeholder:text-white/45" 
              type="search" 
              placeholder="Search for Title, Artist, and Album" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </label>

          <button 
            type="button" 
            className="inline-flex items-center justify-center gap-2 p-[10px_12px] rounded-xl border border-white/10 bg-white/[0.04] text-white/80 cursor-pointer transition-all duration-150 ease-out whitespace-nowrap hover:bg-[rgba(255,92,110,0.1)] hover:border-[rgba(255,92,110,0.25)] hover:text-white hover:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none" 
            onClick={() => setShowDeletePopup(true)} 
            disabled={rows.length === 0 || clearing} 
            aria-label="Hapus semua history" 
            title={rows.length === 0 ? "Empty History" : "Delete All Histories"}
          >
            <FiTrash2/>
            <span className="text-xs sm:text-sm font-semibold">{clearing ? "Deleting..." : "Delete"}</span>
          </button>
        </div>

        <section className="rounded-[14px] bg-white/[0.04] border border-white/[0.08] overflow-hidden" aria-label="Daftar history">
          <div className="grid grid-cols-[34px_2fr_1fr_0.9fr] min-[680px]:grid-cols-[34px_2fr_1.2fr_1fr_92px] md:grid-cols-[48px_2fr_1.25fr_1.25fr_120px] gap-3 md:gap-4 p-[12px_18px] text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/45 bg-black/25 border-b border-white/[0.08]" role="row">
            <div role="columnheader">#</div>
            <div role="columnheader">Title</div>
            <div role="columnheader">Artist</div>
            <div role="columnheader" className="hidden min-[680px]:block">Album</div>
            <div role="columnheader" className="hidden min-[680px]:block text-right">Played</div>
          </div>

          {loading ? (
            <div className="p-[20px_18px] text-sm text-white/40">Loading…</div>
          ) : error ? (
            <div className="p-[20px_18px] text-sm text-red-300">Failed to load history: {error}</div>
          ) : filtered.length === 0 ? (
            <div className="p-[20px_18px] text-sm text-white/60" role="status">
              {rows.length === 0 ? "No history." : "No result."}
            </div>
          ) : (
            <ul className="list-none m-0 p-0">
              {filtered.map((row, index) => {
                const t = row.Track || {};
                const artist = Array.isArray(t.Artists) ? t.Artists.map((a) => a.name).join(", ") : t.Artist?.name || "Unknown";
                return (
                  <li 
                    key={row.id || index} 
                    className="grid grid-cols-[34px_2fr_1fr_0.9fr] min-[680px]:grid-cols-[34px_2fr_1.2fr_1fr_92px] md:grid-cols-[48px_2fr_1.25fr_1.25fr_120px] gap-3 md:gap-4 p-[12px_18px] items-center text-white/[0.82] border-b border-white/[0.06] last:border-b-0 transition-colors duration-150 ease-out hover:bg-[#1ed760]/[0.06] hover:text-white"
                  >
                    <div className="text-white/45 tabular-nums text-xs md:text-sm">{index + 1}</div>
                    <div className="font-bold whitespace-nowrap overflow-hidden text-overflow-ellipsis text-xs md:text-sm" title={t.title}>{t.title}</div>
                    <div className="text-white/60 whitespace-nowrap overflow-hidden text-overflow-ellipsis text-xs md:text-sm" title={artist}>{artist}</div>
                    <div className="hidden min-[680px]:block text-white/60 whitespace-nowrap overflow-hidden text-overflow-ellipsis text-xs md:text-sm" title={t.Album?.title}>{t.Album?.title || ""}</div>
                    <div className="hidden min-[680px]:block text-right tabular-nums text-white/60 text-xs md:text-sm" title={formatPlayedAt(row)}>{formatPlayedAt(row)}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {showDeletePopup && (
        <div className="fixed inset-0 z-[400] grid place-items-center p-6 animate-[history-pop-in_180ms_ease-out]" style={{ animationDuration: '180ms' }} role="dialog" aria-modal="true" aria-labelledby="history-delete-title">
          <button
            type="button"
            className="absolute inset-0 border-0 bg-black/[0.62] backdrop-blur-[8px]"
            aria-label="Close popup"
            onClick={() => setShowDeletePopup(false)}
          />

          <div className="relative z-10 w-full max-w-[460px] rounded-3xl border border-white/10 bg-gradient-to-b from-[#121214]/98 to-[#0d0d0f]/98 shadow-[0_2px_8px_rgba(0,0,0,0.4)] p-5 min-[680px]:p-7">

            <div className="w-[54px] h-[54px] rounded-full grid place-items-center bg-[#ffb84a]/12 text-[#ffb84a] mb-[18px]" aria-hidden="true">
              <FiAlertTriangle className="w-6 h-6" />
            </div>

            <button
              type="button"
              className="absolute top-4 right-4 w-9 h-9 border-0 rounded-full bg-white/[0.06] text-white/[0.72] grid place-items-center cursor-pointer transition-all duration-150 ease-out hover:bg-white/10 hover:text-white hover:scale-[1.03]"
              aria-label="Close popup"
              onClick={() => setShowDeletePopup(false)}
            >
              <FiX />
            </button>

            <h2 className="m-0 text-xl sm:text-2xl font-bold tracking-tight leading-snug" id="history-delete-title">Delete all histories?</h2>
            <p className="mt-3 text-white/[0.68] text-xs sm:text-sm leading-relaxed">
              All music histories will be removed. This action cannot be reverted.
            </p>

            <div className="flex flex-col-reverse min-[680px]:flex-row gap-3 justify-end mt-6">
              <button
                type="button"
                className="w-full min-[680px]:w-auto min-w-[108px] p-[11px_16px] rounded-full border border-white/[0.08] font-extrabold bg-white/[0.06] text-white/[0.84] cursor-pointer transition-all duration-150 ease-out hover:bg-white/10 hover:text-white hover:-translate-y-0.5 disabled:opacity-65 disabled:cursor-wait disabled:transform-none"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-full min-[680px]:w-auto min-w-[108px] p-[11px_16px] rounded-full border border-transparent font-extrabold bg-[#1ed760] text-[#08110b] cursor-pointer transition-all duration-150 ease-out hover:bg-[#2ae06d] hover:-translate-y-0.5 disabled:opacity-65 disabled:cursor-wait disabled:transform-none"
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
import { useState, useEffect } from "react";
import { FiSearch, FiPlay, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SelectPlaylistModal from "../components/SelectPlaylistModal.jsx";
import { emitPlayTrack, normalizePlayableTrack } from "../utils/playerBus.js";
import { likesApi } from "../api/likes.js";
import { emitLikesChanged } from "../utils/likeBus.js";
import { authApi } from "../api/auth.js";
import SidebarSetup from "../components/SidebarSetup.jsx";
import TrackRow from "../components/TrackRow.jsx";
import { tracksApi } from "../api/tracks.js";
import { socket } from "../api/socket.js";
import { handleLogout } from "../api/client.js";
import { useNavigate } from "react-router-dom";

const LIMIT = 20;

const TracksPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tracks, setTracks] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [likedIds, setLikedIds] = useState(new Set());
  const [playlistTarget, setPlaylistTarget] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    tracksApi
      .list({ page, limit: LIMIT, q: debouncedSearch || undefined })
      .then((payload) => {
        if (cancelled) return;
        const rows = payload?.data || [];
        const m = payload?.meta || { total: 0, totalPages: 1 };
        setTracks(rows);
        setMeta(m);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load tracks");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [page, debouncedSearch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    likesApi
      .list()
      .then((payload) => {
        const items = Array.isArray(payload) ? payload : payload?.data || [];
        const normalizedIds = items.map((t) =>  String(t.trackId || t.Track?.id || t.id || "").trim());
        setLikedIds(new Set(normalizedIds));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    socket.on("track-added", (newTrack) => {
      setTracks((prev) => [newTrack, ...prev]);
    });

    return () => { socket.off("track-added"); };
  }, []);

  const handleLikeToggle = async (track) => {
    const trackId = String(track.id || "").trim();
    if (!trackId) return;

    const wasLiked = likedIds.has(trackId);
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (wasLiked) next.delete(trackId);
      else next.add(trackId);
      return next;
    });

    try {
      const res = await likesApi.toggle(trackId);
      const likedFlag = res?.data?.liked ?? res?.liked;
      const nowLiked = typeof likedFlag === "boolean" ? likedFlag : !wasLiked;
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (nowLiked) next.add(trackId);
        else next.delete(trackId);
        return next;
      });
      emitLikesChanged();
    } catch (err) {
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (wasLiked) next.add(trackId);
        else next.delete(trackId);
        return next;
      });
      console.error("Toggle like failed", err);
    }
  };

  const totalPages = meta.totalPages || 1;
  const totalTracks = meta.total || 0;

  return (
    <main className="w-full min-h-screen bg-[#0d0d0f] text-white relative overflow-hidden flex" aria-label="All Tracks">
      <SidebarSetup 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        handleLogout={() => handleLogout(setIsSidebarOpen, navigate)} 
      />
      <div className="flex-1 w-full min-w-0 relative z-10 flex flex-col h-screen overflow-y-auto scrollbar-hidden">
        <header className="w-full h-16 min-h-16 px-5 sm:px-6 flex items-center justify-between md:hidden border-b border-white/5 bg-[#0d0d0f]/80 backdrop-blur-md sticky top-0 z-50">
          <span className="font-display font-extrabold text-white text-lg tracking-tight select-none">Peartone</span>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center justify-center h-10 w-10 text-lime-300 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            aria-label="Open menu"
          >
            <span className="text-xl leading-none -mt-0.5">☰</span>
          </button>
        </header>
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pt-12 flex flex-col gap-6">
          
          <div className="flex flex-col gap-1 border-b border-white/5 pb-5">
            <p className="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Music Collection</p>
            <h1 className="m-0 text-[clamp(2rem,6vw,3.25rem)] font-black leading-tight tracking-tight text-white">All Tracks</h1>
            <p className="m-0 mt-1 text-xs text-white/45">
              {totalTracks > 0 ? `${totalTracks} tracks available` : "All tracks available for audio playing."}
            </p>
          </div>

          <div className="w-full relative flex items-center gap-3 p-3.5 rounded-2xl border border-white/10 bg-white/5 transition-colors focus-within:border-[#c8f560]/35 focus-within:bg-white/[0.07]" role="search">
            <FiSearch className="text-white/40 flex-shrink-0 text-base" />
            <input
              type="search"
              className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-white/35"
              placeholder="Search for title, artist, and album…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search track"
            />
            {search && (
              <button
                type="button"
                className="bg-transparent border-none text-white/40 cursor-pointer text-sm p-1 rounded transition-colors hover:text-white"
                onClick={() => setSearch("")}
                aria-label="Delete Search Result"
              >
                ✕
              </button>
            )}
          </div>

          <section className="w-full rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden" aria-label="Tracks">
            <div className="grid grid-cols-[48px_3fr_2fr_1fr_64px_72px] gap-4 items-center p-3 px-4 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/35 bg-white/[0.02] border-b border-white/5 max-md:grid-cols-[40px_3fr_1.5fr_60px_48px] max-sm:grid-cols-[32px_1fr_48px_48px]" role="row" aria-label="Header tabel">
              <div role="columnheader">#</div>
              <div role="columnheader">Title</div>
              <div className="max-sm:hidden" role="columnheader">Album</div>
              <div className="max-md:hidden" role="columnheader">Genre</div>
              <div className="text-right" role="columnheader">Time</div>
              <div className="text-right" role="columnheader">Action</div>
            </div>

            {loading ? (
              <div className="p-4 flex flex-col gap-3" aria-live="polite">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-12 w-full rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="p-8 text-center text-sm text-red-400" role="alert">⚠️ {error}</div>
            ) : tracks.length === 0 ? (
              <div className="p-8 text-center text-sm text-white/45" role="status">
                {debouncedSearch ? `No Track on result "${debouncedSearch}"` : "No available track."}
              </div>
            ) : (
              <ul className="list-none p-1 m-0 divide-y divide-white/[0.02]" role="rowgroup">
                {tracks.map((track, i) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={(page - 1) * LIMIT + i}
                    likedIds={likedIds}
                    onLikeToggle={handleLikeToggle}
                    onAddToPlaylist={setPlaylistTarget}
                  />
                ))}
              </ul>
            )}
          </section>

          {!loading && totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-4 flex-wrap" aria-label="Navigate page">
              <button
                type="button"
                className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-white/5 text-white/60 cursor-pointer transition-all hover:not-disabled:bg-white/10 hover:not-disabled:text-white disabled:opacity-20 disabled:cursor-not-allowed"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <FiChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = page - 2 + i;

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      className={`min-w-[36px] h-9 px-2.5 rounded-xl border border-transparent bg-transparent text-white/50 text-xs font-medium cursor-pointer transition-all hover:bg-white/5 hover:text-white ${pageNum === page ? "!bg-[#c8f560] !text-[#0d0d0f] font-bold" : ""}`}
                      onClick={() => setPage(pageNum)}
                      aria-label={`Page ${pageNum}`}
                      aria-current={pageNum === page ? "page" : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-white/5 text-white/60 cursor-pointer transition-all hover:not-disabled:bg-white/10 hover:not-disabled:text-white disabled:opacity-20 disabled:cursor-not-allowed"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next Page"
              >
                <FiChevronRight size={16} />
              </button>
            </nav>
          )}
        </div>
      </div>

      {playlistTarget && (
        <SelectPlaylistModal
          track={playlistTarget}
          onClose={() => setPlaylistTarget(null)}
        />
      )}
    </main>
  );
};

export default TracksPage;
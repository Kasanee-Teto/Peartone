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
    <main className="min-h-screen bg-[#0d0d0f] text-white relative overflow-x-hidden" aria-label="All Tracks">

      <SidebarSetup handleLogout={() => handleLogout(setIsSidebarOpen, navigate)} />

      <div className="relative z-10 max-w-[1100px] mx-auto p-[48px_24px_120px]">
        <header className="flex items-start justify-between gap-4 border-b border-white/6 pb-7 mb-6">
          <div>
            <p className="m-0 mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Music Collection</p>
            <h1 className="m-0 text-[52px] font-black leading-none tracking-[-0.03em] max-sm:text-[40px]">All Tracks</h1>
            <p className="m-0 mt-2.5 text-xs text-white/45">
              {totalTracks > 0 ? `${totalTracks} tracks available` : "All tracks available for audio playing."}
            </p>
          </div>
        </header>

        <div className="relative flex items-center gap-2.5 p-[12px_16px] rounded-[14px] border border-white/10 bg-white/4 mb-5 transition-colors focus-within:border-[#c8f560]/35 focus-within:bg-white/5" role="search">
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
              className="bg-transparent border-none text-white/40 cursor-pointer text-xs p-1 rounded transition-colors hover:text-white"
              onClick={() => setSearch("")}
              aria-label="Delete Search Result"
            >
              ✕
            </button>
          )}
        </div>

        <section className="rounded-[14px] bg-white/3 border border-white/7 overflow-hidden" aria-label="Daftar lagu">
          <div className="grid grid-cols-[52px_3fr_2fr_1fr_72px_80px] gap-3 items-center p-[10px_14px] text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/35 bg-black/20 border-b border-white/6 max-[900px]:grid-cols-[44px_3fr_1.5fr_72px_64px] max-sm:grid-cols-[36px_1fr_56px_56px]" role="row" aria-label="Header tabel">
            <div role="columnheader">#</div>
            <div role="columnheader">Title</div>
            <div className="max-sm:hidden" role="columnheader">Album</div>
            <div className="max-[900px]:hidden max-sm:hidden" role="columnheader">Genre</div>
            <div className="text-right max-[900px]:pr-0" role="columnheader">Duration</div>
            <div className="text-right" role="columnheader">Action</div>
          </div>

          {loading ? (
            <div className="p-3 flex flex-col gap-2" aria-live="polite">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[54px] rounded-[10px] animate-shimmer"  />
              ))}
            </div>
          ) : error ? (
            <div className="p-[32px_20px] text-center text-sm text-[#ff9d9d]" role="alert">⚠️ {error}</div>
          ) : tracks.length === 0 ? (
            <div className="p-[32px_20px] text-center text-sm text-white/45" role="status">
              {debouncedSearch
                ? `No Track on result "${debouncedSearch}"`
                : "No available track."}
            </div>
          ) : (
            <ul className="list-none p-1 m-0" role="rowgroup">
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
          <nav className="flex items-center justify-center gap-1.5 mt-7 flex-wrap" aria-label="Navigate page">
            <button
              type="button"
              className="flex items-center justify-center w-9 h-9 rounded-md border border-white/10 bg-white/4 text-white/60 cursor-pointer transition-all hover:not-disabled:bg-white/8 hover:not-disabled:text-white hover:not-disabled:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <FiChevronLeft />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    type="button"
                    className={`min-width min-w-[36px] h-9 p-[0_6px] rounded-md border border-transparent bg-transparent text-white/50 text-xs cursor-pointer transition-colors hover:bg-white/6 hover:text-white ${pageNum === page ? "!bg-[#c8f560] !text-[#0d0d0f] font-bold" : ""}`}
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
              className="flex items-center justify-center w-9 h-9 rounded-md border border-white/10 bg-white/4 text-white/60 cursor-pointer transition-all hover:not-disabled:bg-white/8 hover:not-disabled:text-white hover:not-disabled:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next Page"
            >
              <FiChevronRight />
            </button>

            <span className="ml-2 text-xs text-white/35">
              Page {page} from {totalPages}
            </span>
          </nav>
        )}
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
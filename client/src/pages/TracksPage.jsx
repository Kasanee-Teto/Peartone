import { useState, useEffect } from "react";
import { FiSearch, FiPlay, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import SelectPlaylistModal from "../components/SelectPlaylistModal";
import { emitPlayTrack, normalizePlayableTrack } from "../utils/playerBus.js";
import { likesApi } from "../api/likes.js";
import { emitLikesChanged } from "../utils/likeBus.js";
import { authApi } from "../api/auth.js";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000";
const LIMIT = 20;

function formatDuration(sec) {
  if (!sec || sec <= 0) return "0:00";
  const m = Math.floor(Number(sec) / 60);
  const s = String(Math.round(Number(sec)) % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function getArtistName(track) {
  if (Array.isArray(track?.Artists) && track.Artists.length > 0) {
    return track.Artists.map((a) => a?.name).filter(Boolean).join(", ");
  }
  return track?.artist || track?.Artist?.name || "Unknown Artist";
}

const TrackRow = ({ track, index, likedIds, onLikeToggle, onAddToPlaylist }) => {
  const artist = getArtistName(track);
  const album = track?.Album?.title || track?.album || "—";
  const duration = formatDuration(track?.duration);
  const currentTrackId = String(track.id || "").trim();
  const isLiked = likedIds.has(currentTrackId);

  const handlePlay = () => {
    const playable = normalizePlayableTrack({
      ...track,
      trackId: track.id,
      title: track.title,
      artist: getArtistName(track), 
      coverUrl: track.coverUrl || track.Album?.coverUrl || track.Album?.imageUrl || "",
    });

    emitPlayTrack(playable);
  };

  const formatCoverPath = (path) => {
    if (!path) return null;
    return path.replace(/ /g, '_');
  };

  const safeUrl = track.coverUrl 
    ? `${API_URL}${encodeURI(formatCoverPath(track.coverUrl))}` 
    : null;

  return (
    <li 
      className="group grid grid-cols-[52px_3fr_2fr_1fr_72px_80px] gap-3 items-center p-[6px_10px] rounded-eb-md rounded-[10px] transition-colors duration-150 cursor-default hover:bg-white/4 max-[900px]:grid-cols-[44px_3fr_1.5fr_72px_64px] max-sm:grid-cols-[36px_1fr_56px_56px] max-sm:gap-2" 
      role="row"
    >
      <div className="relative flex items-center justify-center w-9 h-9" role="cell">
        <span className="absolute text-[13px] text-white/40 font-mono transition-opacity duration-150 group-hover:opacity-0">
          {index + 1}
        </span>
        <button
          type="button"
          className="absolute bg-transparent border-none text-[#c8f560] cursor-pointer flex items-center justify-center w-7 h-7 rounded-full opacity-0 transition-all duration-150 group-hover:opacity-100 hover:scale-115"
          onClick={handlePlay}
          aria-label={`Play ${track.title}`}
        >
          <FiPlay fill="currentColor" size={13} />
        </button>
      </div>

      <div className="flex items-center gap-2.5 min-w-0" role="cell">
        <div
          className="w-10 h-10 rounded-md flex-shrink-0 bg-[#7c6af7]/20 flex items-center justify-center text-16 text-white/50 bg-cover bg-center"
          style={{ 
            backgroundImage: track.coverUrl ? `url("${safeUrl}")` : undefined,
            backgroundColor: track.coverUrl ? 'transparent' : 'rgba(124, 106, 247, 0.2)'
          }}
        >
          {!track.coverUrl && <span>♪</span>}
        </div>
        <div className="min-w-0 flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold text-white/90 truncate" title={track.title}>{track.title}</span>
          <span className="text-[11px] text-white/45 truncate" title={artist}>{artist}</span>
        </div>
      </div>

      <div className="text-xs text-white/50 truncate max-sm:hidden" role="cell" title={album}>{album}</div>

      <div className="flex items-center max-[900px]:hidden max-sm:hidden" role="cell">
        {track.genre && track.genre !== "unknown" && (
          <span className="text-[10px] font-semibold p-[2px_8px] rounded-full bg-[#7c6af7]/15 text-[#a89ef7] border border-[#7c6af7]/20 capitalize whitespace-nowrap">
            {track.genre}
          </span>
        )}
      </div>

      <div className="text-xs text-white/40 text-right font-mono max-[900px]:pr-0" role="cell">{duration}</div>

      <div className="flex items-center justify-end gap-1 max-sm:opacity-100" role="cell">
        <button
          type="button"
          className={`bg-transparent border-none cursor-pointer flex items-center justify-center w-7 h-7 rounded-md text-sm transition-all duration-150 hover:bg-[#c8f560]/10 ${isLiked ? "text-[#c8f560] opacity-100" : "text-white/40 opacity-0 group-hover:opacity-100"}`}
          onClick={() => onLikeToggle(track)}
          aria-label={isLiked ? "Unlike" : "Like"}
          title={isLiked ? "Unlike" : "Like"}
        >
          ♥
        </button>
        
        <button
          type="button"
          className="bg-transparent border-none cursor-pointer flex items-center justify-center w-7 h-7 rounded-md text-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-white/8 hover:text-white"
          onClick={() => onAddToPlaylist(track)}
          aria-label="Add to playlist"
          title="Add to playlist"
        >
          <FiPlus size={14} />
        </button>
      </div>
    </li>
  );
};

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

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsSidebarOpen(false);
      navigate("/login"); 
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

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

    const qs = new URLSearchParams({ page, limit: LIMIT });
    if (debouncedSearch) qs.set("q", debouncedSearch);

    fetch(`/api/tracks?${qs}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((r) => r.json())
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

      <div className="relative z-10 max-w-[1100px] mx-auto p-[48px_24px_120px]">
        <header className="flex items-start justify-between gap-4 border-b border-white/6 pb-7 mb-6">
          <div>
            <p className="m-0 mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Music Collection</p>
            <h1 className="m-0 text-[52px] font-black leading-none tracking-[-0.03em] max-sm:text-[40px]">All Tracks</h1>
            <p className="m-0 mt-2.5 text-xs text-white/45">
              {totalTracks > 0 ? `${totalTracks} lagu tersedia` : "Semua lagu tersedia untuk diputar."}
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
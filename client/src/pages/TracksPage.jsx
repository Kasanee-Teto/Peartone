import { useState, useEffect, useMemo } from "react";
import { FiSearch, FiPlay, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import SelectPlaylistModal from "../components/SelectPlaylistModal";
import { emitPlayTrack, normalizePlayableTrack } from "../utils/playerBus.js";
import { likesApi } from "../api/likes.js";
import { emitLikesChanged } from "../utils/likeBus.js";
import "../styles/TracksPage.css";


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
  const isLiked = likedIds.has(String(track.id || ""));

  const handlePlay = () => {
    const playable = normalizePlayableTrack({ ...track, trackId: track.id });
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
    <li className="tr-row" role="row">
      <div className="tr-row__index" role="cell">
        <span className="tr-row__num">{index + 1}</span>
        <button
          type="button"
          className="tr-row__play"
          onClick={handlePlay}
          aria-label={`Play ${track.title}`}
        >
          <FiPlay fill="currentColor" size={13} />
        </button>
      </div>

      <div className="tr-row__info" role="cell">
        <div
        className="tr-row__cover"
        style={{ 
          backgroundImage: track.coverUrl ? `url("${safeUrl}")` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: track.coverUrl ? 'transparent' : 'var(--bg-card-alt)'
        }}
        aria-hidden="true"
      >
        {!track.coverUrl && <span>♪</span>}
      </div>
        <div className="tr-row__text">
          <span className="tr-row__title" title={track.title}>{track.title}</span>
          <span className="tr-row__artist" title={artist}>{artist}</span>
        </div>
      </div>

      <div className="tr-row__album" role="cell" title={album}>{album}</div>

      <div className="tr-row__genre" role="cell">
        {track.genre && track.genre !== "unknown" && (
          <span className="tr-row__genre-tag">{track.genre}</span>
        )}
      </div>

      <div className="tr-row__duration" role="cell">{duration}</div>

      <div className="tr-row__actions" role="cell">
        <button
          type="button"
          className={`tr-row__like ${isLiked ? "is-liked" : ""}`}
          onClick={() => onLikeToggle(track)}
          aria-label={isLiked ? "Unlike" : "Like"}
          title={isLiked ? "Unlike" : "Like"}
        >
          ♥
        </button>
        <button
          type="button"
          className="tr-row__add"
          onClick={() => onAddToPlaylist(track)}
          aria-label="Tambah ke playlist"
          title="Tambah ke playlist"
        >
          <FiPlus size={14} />
        </button>
      </div>
    </li>
  );
};

const TracksPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tracks, setTracks] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [likedIds, setLikedIds] = useState(new Set());
  const [playlistTarget, setPlaylistTarget] = useState(null); // track to add

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch tracks
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
        if (!cancelled) setError("Gagal memuat tracks");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [page, debouncedSearch]);

  // Fetch liked track IDs
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    likesApi
      .list()
      .then((payload) => {
        const items = Array.isArray(payload) ? payload : payload?.data || [];
        setLikedIds(new Set(items.map((t) => String(t.id || t.trackId || t.Track?.id || ""))));
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
    <main className="tracks-page" aria-label="All Tracks">
      <div className="tracks-page__blob" aria-hidden="true" />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={() => setIsSidebarOpen(false)}
      />

      <button
        className={`home__sidebar-overlay${isSidebarOpen ? " is-open" : ""}`}
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

      <div className="tracks-page__inner">
        <header className="tracks-header">
          <div>
            <p className="tracks-header__eyebrow">Koleksi Musik</p>
            <h1 className="tracks-header__title">All Tracks</h1>
            <p className="tracks-header__desc">
              {totalTracks > 0 ? `${totalTracks} lagu tersedia` : "Semua lagu tersedia untuk diputar."}
            </p>
          </div>
          <span className="tracks-header__badge">Library</span>
        </header>

        {/* Search */}
        <div className="tracks-search" role="search">
          <FiSearch className="tracks-search__icon" aria-hidden="true" />
          <input
            type="search"
            className="tracks-search__input"
            placeholder="Cari judul, artis, genre, atau album…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Cari lagu"
          />
          {search && (
            <button
              type="button"
              className="tracks-search__clear"
              onClick={() => setSearch("")}
              aria-label="Hapus pencarian"
            >
              ✕
            </button>
          )}
        </div>

        {/* Track list */}
        <section className="tracks-table" aria-label="Daftar lagu">
          {/* Table header */}
          <div className="tracks-table__head" role="row" aria-label="Header tabel">
            <div role="columnheader">#</div>
            <div role="columnheader">Judul</div>
            <div role="columnheader">Album</div>
            <div role="columnheader">Genre</div>
            <div role="columnheader">Durasi</div>
            <div role="columnheader">Aksi</div>
          </div>

          {loading ? (
            <div className="tracks-table__loading" aria-live="polite">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="tracks-skeleton" aria-hidden="true" />
              ))}
            </div>
          ) : error ? (
            <div className="tracks-error" role="alert">⚠️ {error}</div>
          ) : tracks.length === 0 ? (
            <div className="tracks-empty" role="status">
              {debouncedSearch
                ? `Tidak ada lagu untuk pencarian "${debouncedSearch}"`
                : "Belum ada lagu tersedia."}
            </div>
          ) : (
            <ul className="tracks-table__rows" role="rowgroup">
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

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <nav className="tracks-pagination" aria-label="Navigasi halaman">
            <button
              type="button"
              className="tracks-pagination__btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Halaman sebelumnya"
            >
              <FiChevronLeft />
            </button>

            <div className="tracks-pagination__pages">
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
                    className={`tracks-pagination__page ${pageNum === page ? "is-active" : ""}`}
                    onClick={() => setPage(pageNum)}
                    aria-label={`Halaman ${pageNum}`}
                    aria-current={pageNum === page ? "page" : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="tracks-pagination__btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Halaman berikutnya"
            >
              <FiChevronRight />
            </button>

            <span className="tracks-pagination__info">
              Hal {page} dari {totalPages}
            </span>
          </nav>
        )}
      </div>

      {/* Playlist picker modal */}
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
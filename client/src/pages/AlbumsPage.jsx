import { useState, useCallback } from "react";
import { FiPlay, FiMusic, FiLoader } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import "../styles/AlbumsPage.css";
import { useFetch } from "../hooks/useFetch";
import { albumsApi } from "../api/album.js";
import { emitPlayTrack, normalizePlayableTrack } from "../utils/playerBus.js";

const STORAGE_BASE = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:3000";

function buildCoverUrl(coverUrl) {
  if (!coverUrl) return null;
  if (coverUrl.startsWith("http")) return coverUrl;
  return `${STORAGE_BASE}${coverUrl}`;
}

/* ─── Album Card ─────────────────────────────────────────── */
const AlbumCard = ({ album }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const coverUrl  = buildCoverUrl(album.coverUrl);
  const year      = album.releaseDate ? new Date(album.releaseDate).getFullYear() : "";
  const trackCount = album.trackNumbers ?? (album.Tracks || []).length;

  const handlePlay = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await albumsApi.getById(album.id);

      const albumDetail = response.data; 
      const tracks = albumDetail?.Tracks || [];

      if (!tracks.length) {
        setError("This album doesn't have any tracks.");
        return;
      }

      const normalized = tracks.map((t) =>
        normalizePlayableTrack({
          ...t,
          artist: t.Artists?.[0]?.name || album.Artist?.name || "Unknown Artist",
        album: albumDetail.title,
        })
      );

      emitPlayTrack(normalized[0]);

      for (let i = 1; i < normalized.length; i++) {
        const track = normalized[i];
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("pt:add-to-queue", { detail: track })
          );
        }, i * 20);
      }
    } catch (err) {
      console.error("AlbumCard play error:", err);
      setError("Failed to load tracks.");
    } finally {
      setLoading(false);
    }
  }, [album, loading]);

  return (
    <article className="album-card">
      <div className="album-card__cover">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={album.title}
            className="album-card__cover-img"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="album-card__cover-placeholder">
            <FiMusic size={26} />
          </div>
        )}
        <div className="album-card__scrim" />

        {/* Tombol Play */}
        <button
          type="button"
          aria-label={`Play ${album.title}`}
          className={`album-card__play${loading ? " album-card__play--loading" : ""}`}
          onClick={handlePlay}
          disabled={loading}
        >
          {loading
            ? <FiLoader size={18} className="album-card__play-spinner" />
            : <FiPlay size={18} fill="currentColor" />
          }
        </button>
      </div>

      <div className="album-card__info">
        <div className="album-card__text">
          <h3 className="album-card__title" title={album.title}>{album.title}</h3>
          <p className="album-card__artist">{album.Artist?.name || "Unknown"}</p>
        </div>
        <div className="album-card__meta">
          {year && <span>{year}</span>}
          {year && <span className="album-card__meta-dot" />}
          <span>{trackCount} tracks</span>
        </div>

        {error && (
          <p className="album-card__error">{error}</p>
        )}
      </div>
    </article>
  );
};

/* ─── Albums Page ────────────────────────────────────────── */
const AlbumsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: albumsResp, loading, error } = useFetch("/albums");

  const albums = Array.isArray(albumsResp)
    ? albumsResp
    : albumsResp?.data || [];

  return (
    <main className="albums-page">
      <div className="albums-page__blob" aria-hidden="true" />

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

      <div className="albums-page__inner">
        <header className="albums-header">
          <div>
            <p className="albums-header__eyebrow">Koleksi Musik</p>
            <h1 className="albums-header__title">Albums</h1>
            <p className="albums-header__desc">
              Best Album Collections to fill your mood!
            </p>
          </div>
          <span className="albums-header__badge">Fresh</span>
        </header>

        <div className="albums-section-row">
          <h2 className="albums-section-row__title">Latest Albums</h2>
          <button type="button" className="albums-section-row__see-all">
            See All
          </button>
        </div>

        {loading ? (
          <div className="albums-page__loading">Load Albums…</div>
        ) : error ? (
          <div className="albums-page__error">Failed to load albums: {error}</div>
        ) : albums.length === 0 ? (
          <div className="albums-page__empty">No album.</div>
        ) : (
          <ul className="albums-grid">
            {albums.map((album) => (
              <li key={album.id}>
                <AlbumCard album={album} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default AlbumsPage;

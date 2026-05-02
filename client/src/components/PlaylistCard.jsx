import { useState } from "react";
import "../styles/PlaylistCard.css";
import { FiPlus, FiTrash2, FiPlay } from "react-icons/fi";
import { playlistsApi } from "../api/playlists.js";
import { emitPlayTrack } from "../utils/playerBus.js";

const STORAGE_BASE = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:3000";

function buildStreamUrl(track) {
  const id = track?.id || track?.trackId;
  if (!id) return "";
  return `${STORAGE_BASE}/api/stream/tracks/${id}`;
}

function normalizeTrack(t) {
  const artist =
    Array.isArray(t?.Artists) && t.Artists.length > 0
      ? t.Artists.map((a) => a?.name).filter(Boolean).join(", ")
      : t?.artist || t?.Artist?.name || "Unknown Artist";

  return {
    ...t,
    id: t.id,
    trackId: t.id,
    title: t.title || "Untitled",
    artist,
    album: t?.Album?.title || t?.album || "",
    duration: t?.duration || 0,
    streamUrl: buildStreamUrl(t),
  };
}

const PlaylistCard = ({ playlist, onAddTrack, onDelete }) => {
  const [isLoadingPlay, setIsLoadingPlay] = useState(false);

  if (!playlist) return null;

  const songCount = Array.isArray(playlist.songs)
    ? playlist.songs.length
    : playlist.songs ?? 0;

  const handlePlay = async (e) => {
    e.stopPropagation();
    if (isLoadingPlay) return;
    setIsLoadingPlay(true);
    try {
      const res = await playlistsApi.getMine(playlist.id);
      const tracks = res?.data?.tracks || res?.tracks || [];
      if (tracks.length === 0) {
        window.alert("Playlist ini belum ada lagu.");
        return;
      }
      emitPlayTrack(normalizeTrack(tracks[0]));
    } catch (err) {
      window.alert(err.message || "Gagal memuat lagu.");
    } finally {
      setIsLoadingPlay(false);
    }
  };

  return (
    <div className="playlist-card">
      {/* ── Cover ── */}
      <div className="playlist-card__image-wrapper">
        <img
          src={playlist.image || "/placeholder-album.png"}
          alt={playlist.title}
          className="playlist-card__image"
          loading="lazy"
          onError={(e) => { e.target.src = "/placeholder-album.png"; }}
        />
        <div
          className="playlist-card__overlay"
          style={{ backgroundColor: playlist.color }}
        />

        {/* Play button */}
        <button
          className="playlist-card__play-button"
          aria-label={`Putar ${playlist.title}`}
          onClick={handlePlay}
          disabled={isLoadingPlay}
        >
          {isLoadingPlay
            ? <span style={{ fontSize: 13 }}>...</span>
            : <FiPlay fill="currentColor" size={22} style={{ marginLeft: 2 }} />
          }
        </button>
      </div>

      {/* ── Info + action row ── */}
      <div className="playlist-card__content">
        <div className="playlist-card__meta">
          <div className="playlist-card__text">
            <h3 className="playlist-card__title">{playlist.title}</h3>
            <p className="playlist-card__songs">{songCount} lagu</p>
          </div>

          <div className="playlist-card__actions">
            {onAddTrack && (
              <button
                className="playlist-card__add-button"
                onClick={(e) => { e.stopPropagation(); onAddTrack(playlist); }}
                aria-label={`Tambah lagu ke ${playlist.title}`}
                title="Tambah lagu"
              >
                <FiPlus size={15} />
              </button>
            )}
            {onDelete && (
              <button
                className="playlist-card__delete-button"
                onClick={(e) => { e.stopPropagation(); onDelete(playlist); }}
                aria-label={`Hapus ${playlist.title}`}
                title="Hapus playlist"
              >
                <FiTrash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;

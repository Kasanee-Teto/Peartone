import "../styles/PlaylistCard.css";
import { FiPlus, FiTrash2, FiPlay } from "react-icons/fi";

const PlaylistCard = ({ playlist, onAddTrack, onDelete }) => {
  const songCount = Array.isArray(playlist.songs)
    ? playlist.songs.length
    : playlist.songs ?? 0;

  return (
    <div className="playlist-card">
      {/* ── Cover ── */}
      <div className="playlist-card__image-wrapper">
        <img
          src={playlist.image}
          alt={playlist.title}
          className="playlist-card__image"
          loading="lazy"
          onError={(e) => { e.target.src = "/placeholder-album.png"; }}
        />
        <div
          className="playlist-card__overlay"
          style={{ backgroundColor: playlist.color }}
        />

        {/* Play — tengah, muncul saat hover */}
        <button
          className="playlist-card__play-button"
          aria-label={`Putar ${playlist.title}`}
        >
          <FiPlay fill="currentColor" size={22} style={{ marginLeft: 2 }} />
        </button>
      </div>

      {/* ── Info + action row ── */}
      <div className="playlist-card__content">
        <div className="playlist-card__meta">
          <div className="playlist-card__text">
            <h3 className="playlist-card__title">{playlist.title}</h3>
            <p className="playlist-card__songs">{songCount} lagu</p>
          </div>

          {/* Tombol di bawah, sejajar kanan */}
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

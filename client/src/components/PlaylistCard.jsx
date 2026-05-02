import "../styles/PlaylistCard.css";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const PlaylistCard = ({ playlist, onAddTrack, onDelete }) => {
  return (
    <div className="playlist-card">
      <div className="playlist-card__image-wrapper">
        <img
          src={playlist.image}
          alt={playlist.title}
          className="playlist-card__image"
          loading="lazy"
        />
        <div
          className="playlist-card__overlay"
          style={{ backgroundColor: playlist.color }}
        />
        <button
          className="playlist-card__play-button"
          aria-label={`Putar ${playlist.title}`}
        >
          ▶
        </button>
        {onAddTrack && (
          <button
            className="playlist-card__add-button"
            onClick={() => onAddTrack(playlist)}
            aria-label={`Tambah lagu ke ${playlist.title}`}
            title="Tambah lagu"
          >
            <FiPlus />
          </button>
        )}
        {onDelete && (
          <button
            className="playlist-card__delete-button"
            onClick={() => onDelete(playlist)}
            aria-label={`Hapus ${playlist.title}`}
            title="Hapus playlist"
          >
            <FiTrash2 />
          </button>
        )}
      </div>

      <div className="playlist-card__content">
        <h3 className="playlist-card__title">{playlist.title}</h3>
        <p className="playlist-card__description">{playlist.description}</p>
        <p className="playlist-card__songs">{playlist.songs} lagu</p>
      </div>
    </div>
  );
};

export default PlaylistCard;

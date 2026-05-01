import "../styles/PlaylistCard.css";

const PlaylistCard = ({ playlist }) => {
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

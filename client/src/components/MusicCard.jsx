/**
 * 
 * @param {object} track 
 * @param {string} variant
 * @param {number} rank 
 */
const MusicCard = ({ track, variant = "popular", rank }) => {
  const {
    id,
    title = "Unknown Title",
    artist = "Unknown Artist",
    album = "",
    duration = "0:00",
    cover_url = "",
    genre = "",
    play_count = 0,
  } = track;

  const handlePlay = () => {
    console.log(`Playing track: ${title} by ${artist}`);
  };

  return (
    <article className={`music-card music-card--${variant}`} aria-label={`${title} by ${artist}`}>
      {/* Rank badge hanya tampil di chart variant */}
      {variant === "chart" && rank && (
        <span className="music-card__rank" aria-label={`Rank ${rank}`}>
          #{rank}
        </span>
      )}

      {/* Cover Art */}
      <div className="music-card__cover-wrapper">
        {cover_url ? (
          <img
            src={cover_url}
            alt={`Cover ${title}`}
            className="music-card__cover"
            loading="lazy"
          />
        ) : (
          // Placeholder jika cover tidak tersedia
          <div className="music-card__cover music-card__cover--placeholder" aria-hidden="true">
            <span>♪</span>
          </div>
        )}

        {/* Overlay play button */}
        <button
          className="music-card__play-btn"
          onClick={handlePlay}
          aria-label={`Play ${title}`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      {/* Info Lagu */}
      <div className="music-card__info">
        <h3 className="music-card__title" title={title}>
          {title}
        </h3>
        <p className="music-card__artist">{artist}</p>

        {album && (
          <p className="music-card__album">{album}</p>
        )}

        <div className="music-card__meta">
          {genre && <span className="music-card__genre">{genre}</span>}
          <span className="music-card__duration">{duration}</span>
        </div>

        {/* Play count hanya di popular variant */}
        {variant === "popular" && play_count > 0 && (
          <p className="music-card__plays">
            {play_count.toLocaleString("id-ID")} plays
          </p>
        )}
      </div>
    </article>
  );
};

export default MusicCard;

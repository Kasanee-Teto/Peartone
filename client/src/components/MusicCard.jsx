const MusicCard = ({ track = {}, variant = "popular", rank }) => {
  const {
    title = "Unknown Title",
    artist = "Unknown Artist",
    album = "",
    duration = "0:00",
    cover_url = "",
    genre = "",
    play_count = 0,
  } = track;

  const safePlayCount = Number(play_count) || 0;

  const handlePlay = () => {
    console.log(`Playing track: ${title} by ${artist}`);
  };

  return (
    <article className={`music-card music-card--${variant}`} aria-label={`${title} by ${artist}`}>
      {variant === "chart" && rank && (
        <span className="music-card__rank" aria-label={`Rank ${rank}`}>
          #{rank}
        </span>
      )}

      <div className="music-card__cover-wrapper">
        {cover_url ? (
          <img
            src={cover_url}
            alt={`Cover ${title}`}
            className="music-card__cover"
            loading="lazy"
          />
        ) : (
          <div className="music-card__cover music-card__cover--placeholder" aria-hidden="true">
            <span>♪</span>
          </div>
        )}

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

      <div className="music-card__info">
        <h3 className="music-card__title" title={title}>
          {title}
        </h3>
        <p className="music-card__artist">{artist}</p>

        {album && <p className="music-card__album">{album}</p>}

        <div className="music-card__meta">
          {genre && <span className="music-card__genre">{genre}</span>}
          <span className="music-card__duration">{duration}</span>
        </div>

        {variant === "popular" && safePlayCount > 0 && (
          <p className="music-card__plays">
            {safePlayCount.toLocaleString("id-ID")} plays
          </p>
        )}
      </div>
    </article>
  );
};

export default MusicCard;
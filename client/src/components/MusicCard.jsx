import { emitPlayTrack, normalizePlayableTrack } from "../utils/playerBus.js";

function formatDuration(value) {
  if (value == null) return "0:00";
  if (typeof value === "string") return value; 
  const sec = Number(value);
  if (Number.isNaN(sec) || sec <= 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function getArtistName(track) {
  if (Array.isArray(track?.Artists) && track.Artists.length > 0) {
    return track.Artists.map((a) => a?.name).filter(Boolean).join(", ");
  }
  return track?.artist || track?.Artist?.name || "Unknown Artist";
}

function getCoverUrl(track) {
  if (track?.cover_url) return track.cover_url;

  return (
    track?.cover ||
    track?.coverUrl ||
    track?.image ||
    track?.imageUrl ||
    track?.Album?.cover ||
    track?.Album?.coverUrl ||
    ""
  );
}

function hasTrackId(trackId) {
  return typeof trackId === "string" && trackId.trim().length > 0;
}

const MusicCard = ({ track = {}, variant = "popular", rank, onPlay }) => {
  const title = track?.title || track?.name || "Unknown Title";
  const artist = getArtistName(track);
  const album = track?.Album?.title || track?.album || "";
  const genre = track?.genre || "";
  const duration = formatDuration(track?.duration);
  const coverUrl = getCoverUrl(track);
  const playableTrack = normalizePlayableTrack({
    ...track,
    trackId: track?.trackId || track?.id,
    title,
    artist,
    album,
    genre,
    duration: track?.duration,
    coverUrl,
  });

  const safePlayCount = Number(track?.play_count ?? track?.playCount ?? 0) || 0;

  const handlePlay = () => {
    if (!hasTrackId(playableTrack.trackId)) {
      return;
    }

    if (onPlay) {
      onPlay(playableTrack);
      return;
    }

    emitPlayTrack(playableTrack);
  };

  return (
    <article
      className={`music-card music-card--${variant}`}
      aria-label={`${title} by ${artist}`}
    >
      {variant === "chart" && rank && (
        <span className="music-card__rank" aria-label={`Rank ${rank}`}>
          #{rank}
        </span>
      )}

      <div className="music-card__cover-wrapper">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`Cover ${title}`}
            className="music-card__cover"
            loading="lazy"
          />
        ) : (
          <div
            className="music-card__cover music-card__cover--placeholder"
            aria-hidden="true"
          >
            <span>♪</span>
          </div>
        )}

        <button
          type="button"
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
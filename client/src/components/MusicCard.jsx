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

  const safePlayCount = Number(track?.listeners ?? track?.listeners ?? 0) || 0;

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
      className={`flex flex-col w-full`}
      aria-label={`${title} by ${artist}`}
    >
       <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-white/5">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`Cover for ${title}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-white/20" aria-hidden="true">
            ♪
          </div>
        )}

        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Play ${title}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-xl"
        >
          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#c8f560] shadow-lg">
            <svg viewBox="0 0 24 24" fill="black" className="w-5 h-5 ml-0.5" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      </div>

      <div className="mt-2 px-0.5 flex flex-col gap-0.5">
        <h3
          className="text-sm font-semibold text-white leading-snug truncate"
          title={title}
        >
          {title}
        </h3>
        <p className="text-xs text-white/50 truncate">{artist}</p>

        {(album || genre) && (
          <p className="text-xs text-white/30 truncate">
            {[album, genre].filter(Boolean).join(" · ")}
          </p>
        )}

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-white/40">{duration}</span>
          {variant === "popular" && safePlayCount > 0 && (
            <span className="text-xs text-white/40">
              {safePlayCount.toLocaleString("id-ID")} plays
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default MusicCard;
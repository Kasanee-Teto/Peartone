import { emitPlayTrack, normalizePlayableTrack, isValidTrackId } from "../utils/playerBus.js";
import { getCoverUrl, buildCoverUrl } from "../api/client.js";
import { formatDuration } from "../utils/format.js";
import { getArtistName } from "../utils/playerBus.js";

const MusicCard = ({ track = {}, variant = "popular", rank, onPlay }) => {
  const title = track?.title || track?.name || "Unknown Title";
  const artist = getArtistName(track);
  const album = track?.Album?.title || track?.album || "";
  const genre = track?.genre || "";
  const duration = formatDuration(track?.duration);
  const coverUrl = buildCoverUrl(getCoverUrl(track));
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
    if (!isValidTrackId(playableTrack.trackId)) {
      return;
    }

    if (onPlay) {
      onPlay(playableTrack);
      return;
    }

    emitPlayTrack(playableTrack);
  };

  if (variant === "top_chart") {
    return (
      <div className="grid grid-cols-[36px_1fr] md:grid-cols-[44px_1.5fr_1fr_100px_80px] gap-4 items-center px-4 py-2.5 rounded-xl hover:bg-white/[0.04] transition-all group/row">
        <div className="text-center text-xs font-semibold text-white/40 flex items-center justify-center relative w-full h-8">
          <span className="group-hover/row:opacity-0 transition-opacity duration-150">
            {rank}
          </span>
          <button 
            type="button" 
            onClick={handlePlay}
            className="absolute opacity-0 group-hover/row:opacity-100 flex items-center justify-center text-[#c8f560] transition-opacity duration-150 scale-110"
            aria-label={`Play ${title}`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3.5 min-w-0">
          <div className="h-10 w-10 rounded-md overflow-hidden bg-white/5 shrink-0 border border-white/5 shadow-md">
            {coverUrl ? (
              <img src={coverUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-white/20">♪</div>
            )}
          </div>
        
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[13px] font-semibold text-white group-hover/row:text-[#c8f560] transition-colors leading-tight" title={title}>
              {title}
            </h3>
            <p className="truncate text-[11px] text-white/40 mt-0.5" title={artist}>
              {artist}
            </p>
          </div>
        </div>

        <div className="hidden md:block truncate text-xs text-white/50">
          {album || "Single"}
        </div>

        <div className="hidden md:flex items-center justify-center">
          {genre ? (
            <span className="text-[10px] font-semibold tracking-wide text-indigo-300 border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 rounded-full uppercase">
              {genre}
            </span>
          ) : (
            <span className="text-[10px] font-semibold tracking-wide text-white/30 border border-white/5 bg-white/5 px-2.5 py-0.5 rounded-full uppercase">
              No Genre
            </span>
          )}
        </div>

        <div className="hidden md:block text-right pr-2 text-xs text-white/40 font-mono">
          {duration}
        </div>

      </div>
    );
  }

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
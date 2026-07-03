import { FiPlay, FiPlus } from "react-icons/fi";
import { formatDuration } from "../utils/format.js";
import { ASSET_BASE } from "../api/client.js";
import { getArtistName } from "../utils/playerBus.js";
import { normalizePlayableTrack } from "../utils/playerBus.js";

const TrackRow = ({ track, index, likedIds, onLikeToggle, onAddToPlaylist }) => {
  const artist = getArtistName(track);
  const album = track?.Album?.title || track?.album || "—";
  const duration = formatDuration(track);
  const currentTrackId = String(track.id || "").trim();
  const isLiked = likedIds.has(currentTrackId);

  const handlePlay = () => {
    const playable = normalizePlayableTrack({
      ...track,
      trackId: track.id,
      title: track.title,
      artist: getArtistName(track), 
      coverUrl: track.coverUrl || track.Album?.coverUrl || track.Album?.imageUrl || "",
    });

    emitPlayTrack(playable);
  };

  const formatCoverPath = (path) => {
    if (!path) return null;
    return path.replace(/ /g, '_');
  };

  const safeUrl = track.coverUrl 
    ? `${ASSET_BASE}${encodeURI(formatCoverPath(track.coverUrl))}` 
    : null;

  return (
    <li 
      className="group grid grid-cols-[52px_3fr_2fr_1fr_72px_80px] gap-3 items-center p-[6px_10px] rounded-eb-md rounded-[10px] transition-colors duration-150 cursor-default hover:bg-white/4 max-[900px]:grid-cols-[44px_3fr_1.5fr_72px_64px] max-sm:grid-cols-[36px_1fr_56px_56px] max-sm:gap-2" 
      role="row"
    >
      <div className="relative flex items-center justify-center w-9 h-9" role="cell">
        <span className="absolute text-[13px] text-white/40 font-mono transition-opacity duration-150 group-hover:opacity-0">
          {index + 1}
        </span>
        <button
          type="button"
          className="absolute bg-transparent border-none text-[#c8f560] cursor-pointer flex items-center justify-center w-7 h-7 rounded-full opacity-0 transition-all duration-150 group-hover:opacity-100 hover:scale-115"
          onClick={handlePlay}
          aria-label={`Play ${track.title}`}
        >
          <FiPlay fill="currentColor" size={13} />
        </button>
      </div>

      <div className="flex items-center gap-2.5 min-w-0" role="cell">
        <div
          className="w-10 h-10 rounded-md flex-shrink-0 bg-[#7c6af7]/20 flex items-center justify-center text-16 text-white/50 bg-cover bg-center"
          style={{ 
            backgroundImage: track.coverUrl ? `url("${safeUrl}")` : undefined,
            backgroundColor: track.coverUrl ? 'transparent' : 'rgba(124, 106, 247, 0.2)'
          }}
        >
          {!track.coverUrl && <span>♪</span>}
        </div>
        <div className="min-w-0 flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold text-white/90 truncate" title={track.title}>{track.title}</span>
          <span className="text-[11px] text-white/45 truncate" title={artist}>{artist}</span>
        </div>
      </div>

      <div className="text-xs text-white/50 truncate max-sm:hidden" role="cell" title={album}>{album}</div>

      <div className="flex items-center max-[900px]:hidden max-sm:hidden" role="cell">
        {track.genre && track.genre !== "unknown" && (
          <span className="text-[10px] font-semibold p-[2px_8px] rounded-full bg-[#7c6af7]/15 text-[#a89ef7] border border-[#7c6af7]/20 capitalize whitespace-nowrap">
            {track.genre}
          </span>
        )}
      </div>

      <div className="text-xs text-white/40 text-right font-mono max-[900px]:pr-0" role="cell">{duration}</div>

      <div className="flex items-center justify-end gap-1 max-sm:opacity-100" role="cell">
        <button
          type="button"
          className={`bg-transparent border-none cursor-pointer flex items-center justify-center w-7 h-7 rounded-md text-sm transition-all duration-150 hover:bg-[#c8f560]/10 ${isLiked ? "text-[#c8f560] opacity-100" : "text-white/40 opacity-0 group-hover:opacity-100"}`}
          onClick={() => onLikeToggle(track)}
          aria-label={isLiked ? "Unlike" : "Like"}
          title={isLiked ? "Unlike" : "Like"}
        >
          ♥
        </button>
        
        <button
          type="button"
          className="bg-transparent border-none cursor-pointer flex items-center justify-center w-7 h-7 rounded-md text-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-white/8 hover:text-white"
          onClick={() => onAddToPlaylist(track)}
          aria-label="Add to playlist"
          title="Add to playlist"
        >
          <FiPlus size={14} />
        </button>
      </div>
    </li>
  );
};

export default TrackRow;
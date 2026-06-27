import { useState } from "react";
import { FiPlus, FiTrash2, FiPlay } from "react-icons/fi";
import { playlistsApi } from "../api/playlists.js";
import { emitPlayTrack, normalizePlayableTrack } from "../utils/playerBus.js";

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

  return normalizePlayableTrack({
    ...t,
    trackId: t.id,
    artist,
    album: t?.Album?.title || t?.album || "",
    streamUrl: buildStreamUrl(t),
  });
}

const PlaylistCard = ({ playlist, onAddTrack, onDelete }) => {
  const [isLoadingPlay, setIsLoadingPlay] = useState(false);
  if (!playlist) return null;

  const songCount = Array.isArray(playlist.songs) ? playlist.songs.length : playlist.songs ?? 0;

  const handleCardClick = async () => {
    if (isLoadingPlay) return;
    setIsLoadingPlay(true);
    try {
      const res = await playlistsApi.getMine(playlist.id);
      const tracks = res?.data?.tracks || res?.tracks || [];
      if (tracks.length === 0) return window.alert("This playlist has no track.");

      const normalized = tracks.map(normalizeTrack);
      window.dispatchEvent(new Event("pt:clear-queue"));
      emitPlayTrack(normalized[0]);

      for (let i = 1; i < normalized.length; i++) {
        const track = normalized[i];
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("pt:add-to-queue", { detail: track }));
        }, i * 20);
      }
    } catch (err) {
      window.alert(err.message || "Failed to load track.");
    } finally {
      setIsLoadingPlay(false);
    }
  };

  const handlePlayBtn = async (e) => {
    e.stopPropagation();
    await handleCardClick();
  };

  return (
    <div
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-white/10 bg-[#161618] transition hover:-translate-y-0.5 hover:border-lime-300/20"
      onClick={handleCardClick}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[#1e1e22]">
        <img
          src={playlist.image || "/placeholder-album.png"}
          alt={playlist.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.target.src = "/placeholder-album.png"; }}
        />
        <div
          className="absolute inset-0 opacity-25 transition group-hover:opacity-25"
          style={{ backgroundColor: playlist.color }}
        />

        <button
          className="absolute left-1/2 top-1/2 z-10 flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 scale-90 items-center justify-center rounded-full bg-lime-300 text-[#0d0d0f] opacity-0 shadow-[0_8px_24px_rgba(200,245,96,0.4)] transition group-hover:scale-100 group-hover:opacity-100 hover:scale-105 hover:bg-lime-200"
          aria-label={`Play ${playlist.title}`}
          onClick={handlePlayBtn}
          disabled={isLoadingPlay}
        >
          {isLoadingPlay ? <span className="text-[13px]">...</span> : <FiPlay fill="currentColor" size={22} className="ml-[2px]" />}
        </button>
      </div>

      <div className="px-[14px] pb-[14px] pt-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="m-0 mb-[3px] truncate text-sm font-bold text-white">{playlist.title}</h3>
            <p className="m-0 text-xs font-semibold text-lime-300">{songCount} lagu</p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {onAddTrack && (
              <button
                className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-lime-300/30 bg-lime-300/10 text-lime-300 transition hover:scale-105 hover:bg-lime-300/20"
                onClick={(e) => { e.stopPropagation(); onAddTrack(playlist); }}
                aria-label={`Added track to ${playlist.title}`}
                title="Add track"
              >
                <FiPlus size={15} />
              </button>
            )}
            {onDelete && (
              <button
                className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-rose-300/30 bg-rose-300/10 text-rose-300 transition hover:scale-105 hover:bg-rose-300/20"
                onClick={(e) => { e.stopPropagation(); onDelete(playlist); }}
                aria-label={`Delete ${playlist.title}`}
                title="Delete playlist"
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
import { useCallback, useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiPlay, FiAlertTriangle } from "react-icons/fi";
import { playlistsApi } from "../api/playlists.js";
import { emitPlayTrack, normalizePlayableTrack, buildStreamUrl, normalizeTrack } from "../utils/playerBus.js";

const DEFAULT_COVER =
"data:image/svg+xml;utf8," +
encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="#232327"/>
    <g fill="#4b4b52">
      <path d="M270 120v120a30 30 0 1 1-14-25V150l-70 16v104a30 30 0 1 1-14-25V145a10 10 0 0 1 7.6-9.7l82-19a10 10 0 0 1 8.4 3.7 10 10 0 0 1 0 0z"/>
    </g>
  </svg>
`);

const PlaylistCard = ({ playlist, onAddTrack, isPendingDelete = false, deleting = false, deleteError = "", onRequestDelete, onCancelDelete, onConfirmDelete }) => {
  const [isLoadingPlay, setIsLoadingPlay] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!message) return;
    const m = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(m);
  }, [message]);

  const notify = useCallback((message, type="info") => {
    setMessage({ message, type });
  }, []);

  if (!playlist) return null;

  const songCount = Array.isArray(playlist.songs) ? playlist.songs.length : playlist.songs ?? 0;

  const handleCardClick = async () => {
    if (isLoadingPlay) return;
    setIsLoadingPlay(true);
    try {
      const res = await playlistsApi.getMine(playlist.id);
      const tracks = res?.data?.tracks || res?.tracks || [];
      if (tracks.length === 0) return notify("This playlist has no track.", "info");

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
      notify(err.message || "Failed to load track.", "error");
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
      {message && (
        <div
          className={`absolute left-1/2 top-2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold shadow-lg ${
            message.type === "error"
              ? "bg-[rgba(255,92,110,0.9)] text-white"
              : "bg-[#0d0d0f]/90 text-lime-300 border border-lime-300/30"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {message.message}
        </div>
      )}

      <div className="relative aspect-square w-full overflow-hidden bg-[#1e1e22]">
        <img
          src={playlist.image || DEFAULT_COVER }
          alt={playlist.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.target.src = DEFAULT_COVER; }}
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
            <p className="m-0 text-xs font-semibold text-lime-300">{songCount} songs</p>
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
            {onRequestDelete && (
              <button
                className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-rose-300/30 bg-rose-300/10 text-rose-300 transition hover:scale-105 hover:bg-rose-300/20"
                onClick={(e) => { e.stopPropagation(); onRequestDelete(playlist); }}
                aria-label={`Delete ${playlist.title}`}
                title="Delete playlist"
              >
                <FiTrash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {isPendingDelete && (
        <div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 rounded-xl border border-[rgba(255,92,110,0.3)] bg-[#0d0d0f]/92 px-5 text-center backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <FiAlertTriangle size={18} className="shrink-0 text-[#ff8b85]" />
          <span className="text-[12px] leading-snug text-white/70">
            Do you want to delete this playlist? Action cannot be reverted.
          </span>
          {deleteError && (
            <span className="text-[11px] text-[#ff8b85]">{deleteError}</span>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onCancelDelete?.()}
              disabled={deleting}
              className="text-[12px] px-3 py-[5px] rounded-lg border border-white/12 bg-white/[0.06] text-white/60 cursor-pointer hover:bg-white/10 transition-colors disabled:cursor-wait"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirmDelete?.()}
              disabled={deleting}
              className="text-[12px] px-3 py-[5px] rounded-lg border border-[rgba(255,92,110,0.4)] bg-[rgba(255,92,110,0.2)] text-[#ff8b85] font-medium cursor-pointer disabled:cursor-wait hover:bg-[rgba(255,92,110,0.3)] transition-colors"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistCard;
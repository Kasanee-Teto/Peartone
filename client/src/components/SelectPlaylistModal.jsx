import { useState, useEffect } from "react";
import { FiX, FiPlus, FiCheck, FiMusic } from "react-icons/fi";
import { playlistsApi } from "../api/playlists.js";

const STORAGE_BASE = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:3000";

function buildCoverUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${STORAGE_BASE}${url}`;
}

const SelectPlaylistModal = ({ track, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState("");
  const [added, setAdded] = useState(new Set());
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    playlistsApi
      .listMine()
      .then((res) => {
        if (!active) return;
        const items = Array.isArray(res) ? res : res?.data || [];
        setPlaylists(items);
      })
      .catch(() => {
        if (active) setError("Failed to load playlist");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const handleAdd = async (playlist) => {
    const trackId = track?.id || track?.trackId;
    if (!trackId) return;
    setAdding(playlist.id);
    try {
      await playlistsApi.addTrack(playlist.id, trackId);
      setAdded((prev) => new Set([...prev, playlist.id]));
    } catch (err) {
      setError(err.message || "Failed to add track to playlist");
    } finally {
      setAdding("");
    }
  };

  const trackTitle = track?.title || "Track";
  const artistName =
    Array.isArray(track?.Artists) && track.Artists.length > 0
      ? track.Artists.map((a) => a.name).join(", ")
      : track?.artist || "";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Added to playlist"
        className="relative z-10 flex max-h-[70vh] w-[90%] max-w-[400px] flex-col overflow-hidden rounded-[18px] border border-white/10 bg-[#1a1a1e] shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-[18px] pb-[14px] pt-[18px]">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">Add to Playlist</p>
            <h3 className="m-0 text-[15px] font-bold leading-[1.3] text-white">{trackTitle}</h3>
            {artistName && <p className="mt-[3px] text-xs text-white/45">{artistName}</p>}
          </div>
          <button
            type="button"
            className="shrink-0 rounded-md p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        {error && <p className="m-0 bg-red-300/10 px-[18px] py-2 text-xs text-red-300">{error}</p>}

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex items-center justify-center p-8 text-center text-sm text-white/40">Load playlist…</div>
          ) : playlists.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2.5 p-8 text-center text-sm text-white/40">
              <FiMusic size={24} />
              <p>No playlist yet. Create playlist on Playlists page.</p>
            </div>
          ) : (
            playlists.map((pl) => {
              const isAdded = added.has(pl.id);
              const isAdding = adding === pl.id;
              const coverUrl = buildCoverUrl(pl.coverUrl);
              return (
                <button
                  key={pl.id}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-white transition ${
                    isAdded ? "cursor-default opacity-70" : "hover:bg-white/5"
                  }`}
                  onClick={() => !isAdded && handleAdd(pl)}
                  disabled={isAdding || isAdded}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#7c6af726] text-[#a89ef7]">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={pl.name}
                        className="h-full w-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <FiMusic size={16} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-white/90">{pl.name}</span>
                    <span className="text-[11px] text-white/40">
                      {pl.trackCount ?? pl.trackNumbers ?? pl.trackCount ?? 0} lagu
                    </span>
                  </div>

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-lime-300/10 text-[14px] text-lime-300">
                    {isAdding ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-lime-300/30 border-t-lime-300" /> : isAdded ? <FiCheck /> : <FiPlus />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectPlaylistModal;
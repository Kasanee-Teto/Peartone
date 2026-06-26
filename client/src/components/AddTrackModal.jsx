import { useState, useMemo, useEffect } from "react";
import { FiSearch, FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { useFetch } from "../hooks/useFetch";
import { playlistsApi } from "../api/playlists.js";

const AddTrackModal = ({ playlistId, onClose, onTrackAdded }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [addingTrackId, setAddingTrackId] = useState("");
  const [removingTrackId, setRemovingTrackId] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const { data: tracksResp } = useFetch("/tracks?limit=100");

  useEffect(() => {
    const loadPlaylistTracks = async () => {
      try {
        const data = await playlistsApi.getMine(playlistId);
        const tracks = data?.data?.tracks || [];
        setPlaylistTracks(tracks.map((t) => t.id || t.trackId));
      } catch {
        // ignore
      }
    };
    loadPlaylistTracks();
  }, [playlistId]);

  const tracks = Array.isArray(tracksResp) ? tracksResp : tracksResp?.data || [];

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return tracks;
    const q = searchQuery.toLowerCase();
    return tracks.filter(
      (t) =>
        (t.title?.toLowerCase() || "").includes(q) ||
        (t.artist?.toLowerCase() || "").includes(q) ||
        ((t.Artists || []).some((a) => a.name?.toLowerCase().includes(q)))
    );
  }, [tracks, searchQuery]);

  const handleAddTrack = async (trackId) => {
    const token = localStorage.getItem("token");
    if (!token) return window.alert("Login to add track to Playlist");

    setAddingTrackId(trackId);
    try {
      const res = await fetch(`/api/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ trackId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to add track");
      setPlaylistTracks((current) => [...current, trackId]);
      onTrackAdded?.();
    } catch (err) {
      window.alert(err.message || "Failed to add track");
    } finally {
      setAddingTrackId("");
    }
  };

  const handleRemoveTrack = async (trackId) => {
    const token = localStorage.getItem("token");
    if (!token) return window.alert("Login to delete track from playlist");

    setRemovingTrackId(trackId);
    try {
      const res = await fetch(`/api/playlists/${playlistId}/tracks/${trackId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete track");
      setPlaylistTracks((current) => current.filter((id) => id !== trackId));
    } catch (err) {
      window.alert(err.message || "Failed to delete track");
    } finally {
      setRemovingTrackId("");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-[10000] flex max-h-[80vh] w-[90%] max-w-[520px] flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[#161618] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="m-0 text-lg font-bold text-white">Add Track to Playlist</h2>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/60 transition hover:bg-white/10 hover:text-white"
            onClick={onClose}
            aria-label="Tutup"
          >
            <FiX />
          </button>
        </div>

        <div className="m-0 flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <FiSearch className="shrink-0 text-white/40" />
          <input
            type="text"
            placeholder="Search for tracks and artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/40"
          />
        </div>

        <ul className="m-0 flex-1 list-none overflow-y-auto p-2">
          {filtered.map((track) => {
            const inPlaylist = playlistTracks.includes(track.id);
            const busy = addingTrackId === track.id || removingTrackId === track.id;
            return (
              <li
                key={track.id}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 transition hover:bg-white/5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <img
                      src={track.coverUrl || track.Album?.imageUrl || "/placeholder-album.png"}
                      alt={track.title}
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-white">{track.title}</p>
                      <p className="mt-1 truncate text-[11px] text-white/50">
                        {track.artist || (track.Artists || []).map((a) => a.name).join(", ")}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-lime-300/30 bg-lime-300/10 text-lime-300 transition hover:-translate-y-[1px] hover:bg-lime-300/20 disabled:cursor-wait disabled:opacity-50"
                  onClick={() => (inPlaylist ? handleRemoveTrack(track.id) : handleAddTrack(track.id))}
                  disabled={busy}
                  aria-label={`${inPlaylist ? "Delete" : "Add"} ${track.title}`}
                >
                  <FiTrash2 />
                </button>
              </li>
            );
          })}
        </ul>

        {filtered.length === 0 && (
          <div className="flex h-[200px] items-center justify-center text-sm text-white/40">
            {searchQuery ? "Track not found" : "No track available"}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTrackModal;
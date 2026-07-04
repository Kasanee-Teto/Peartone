import { useEffect, useState, useMemo, useCallback } from "react";
import PlaylistCard from "../components/PlaylistCard.jsx";
import AddTrackModal from "../components/AddTrackModal.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { playlistsApi } from "../api/playlists.js";
import { FiPlus, FiSearch, FiMusic } from "react-icons/fi";
import SidebarSetup from "../components/SidebarSetup.jsx";
import { buildCoverUrl, handleLogout } from "../api/client.js";
import { useNavigate } from "react-router-dom";

const PlaylistPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName]= useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [message, setMessage] = useState(null);

  const { data: playlistsResp, loading, error } = useFetch("/playlists");

  useEffect(() => {
    const incoming = Array.isArray(playlistsResp)
      ? playlistsResp
      : playlistsResp?.data || [];
    setPlaylists(incoming);
  }, [playlistsResp]);

  useEffect(() => {
    if (!message) return;
    const m = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(m);
  }, [message]);

  const notify = useCallback((message, type="info") => {
    setMessage({ message, type });
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return playlists;
    return playlists.filter((p) =>
      (p.name || p.title || "").toLowerCase().includes(q)
    );
  }, [playlists, searchQuery]);

  const createPlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) { notify("Please login to your account.", "info"); return; }
    setIsSaving(true);
    try {
      const created = await playlistsApi.create(newPlaylistName.trim());
      const playlist = created?.data || created;
      setPlaylists((prev) => [{ ...playlist, trackCount: 0, coverUrl: null }, ...prev]);
      setNewPlaylistName("");
      setSelectedPlaylistId(playlist.id);
    } catch (err) {
      notify(err.message || "Failed to load playlist.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTracksChanged = async () => {
    if (!selectedPlaylistId) return;
    try {
      const updated = await playlistsApi.getMine(selectedPlaylistId);
      const data = updated?.data;
      const playlist = data?.playlist;
      const tracks = data?.tracks || [];
      
      if (playlist?.id) {
        setPlaylists((prev) => 
          prev.map((p) => p.id === playlist.id ? {
            ...p,
            ...playlist,
            trackCount: tracks.length,
            coverUrl: tracks.length > 0 ? tracks[0]?.coverUrl : null,
          } : p)
        )
      };
    } catch (err) {
      console.error("Failed to refresh playlist:", err);
    }
  };

  const requestDeletePlaylist = (playlist) => {
    setDeleteError("");
    setConfirmDeleteId((curr) => (curr === playlist.id ? null : playlist.id));
  };

  const cancelDeletePlaylist = () => {
    setConfirmDeleteId(null);
    setDeleteError("");
  }

  const confirmDeletePlaylist = async () => {
    const id = confirmDeleteId;
    if (!id) return;
    setDeletingId(id);
    setDeleteError("");
    try {
      await playlistsApi.delete(id);
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      setDeleteError(err.message || "Failed to delete playlist.");
    } finally {
      setDeletingId(null);
    }
  };
  
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0d0d0f] text-white">
      <SidebarSetup handleLogout={() => handleLogout(setIsSidebarOpen, navigate)} />

      <div className="relative z-10 max-w-[1024px] mx-auto px-6 pt-12 pb-24 max-md:pt-[72px]">

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

        <header className="flex items-start justify-between gap-4 border-b border-white/5 pb-7 mb-7 max-md:flex-col-reverse max-md:items-start max-md:gap-3">
          <div>
            <p className="m-0 mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Library</p>
            <h1 className="m-0 text-[52px] font-black leading-none tracking-[-0.03em] text-white max-md:text-[36px]">
              My Playlist
            </h1>
            <p className="m-0 mt-2.5 text-xs leading-[1.6] text-white/40">Enjoy and Organize Your Playlist(s).</p>
          </div>
        </header>

        <form className="flex gap-2.5 mb-4 flex-wrap" onSubmit={createPlaylist}>
          <input
            className="flex-1 min-w-[220px] px-4 py-[11px] rounded-[10px] border border-white/10 bg-white/5 text-white text-sm outline-none transition-all duration-150 placeholder:text-white/30 focus:border-[#c8f560]/40 focus:bg-white/7"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="New Playlist Title..."
            aria-label="New Playlist Title"
          />
          <button
            className={`inline-flex items-center gap-1.75 px-5 py-[11px] rounded-[10px] border-none bg-[#c8f560] text-[#0d0d0f] text-[13px] font-bold cursor-pointer transition-all duration-150 whitespace-nowrap hover:bg-[#d4f770] hover:-translate-y-[1px] active:translate-y-0 ${
              isSaving ? "opacity-65 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={isSaving}
          >
            <FiPlus size={16} />
            {isSaving ? "Saving..." : "Create Playlist"}
          </button>
        </form>

        <div className="relative flex items-center mb-6">
          <FiSearch className="absolute left-3.5 text-white/35 pointer-events-none shrink-0" size={15} />
          <input
            className="w-full px-10 py-[11px] rounded-[10px] border border-white/8 bg-white/4 text-white text-sm outline-none transition-all duration-150 placeholder:text-white/25 focus:border-white/15 focus:bg-white/6"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari playlist..."
            aria-label="Cari playlist"
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-3 bg-transparent border-none text-white/35 text-[18px] leading-none cursor-pointer p-1 flex items-center justify-center rounded-full transition-all duration-150 hover:text-white hover:bg-white/8"
              onClick={() => setSearchQuery("")}
              aria-label="Delete search history"
            >×</button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center text-white/30 text-sm">
           
            <div className="w-8 h-8 rounded-full border-[3px] border-white/8 border-t-[#c8f560] animate-spin mb-2" />
            <p className="m-0">Load playlist...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center text-[#ff5c6e] text-sm">
            <p className="m-0">Failed to load playlist.</p>
            <span className="text-[xs] text-[rgba(255,92,110,0.6)]">{error}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center text-white/30 text-sm">
            <FiMusic size={40} className="text-white/15 mb-3" />
            <p className="m-0">{searchQuery ? "No matched playlist." : "No playlist yet. Create first playlist!"}</p>
          </div>
        ) : (
          <>
            <p className="m-0 mb-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-white/30">
              {filtered.length} playlist{searchQuery ? ` for "${searchQuery}"` : ""}
            </p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" role="list">
              {filtered.map((playlist) => {
                const rawCover = playlist.coverUrl || playlist.image || null;
                return (
                  <div key={playlist.id} role="listitem">
                    <PlaylistCard
                      playlist={{
                        id: playlist.id,
                        title: playlist.name || playlist.title,
                        image: buildCoverUrl(rawCover),
                        songs: playlist.trackCount ?? (playlist.Tracks || []).length,
                        color: "#7c6af7",
                      }}
                      onAddTrack={(p) => setSelectedPlaylistId(p.id)}
                      isPendingDelete={confirmDeleteId === playlist.id}
                      deleting={deletingId === playlist.id}
                      deleteError={confirmDeleteId === playlist.id ? deleteError : ""}
                      onRequestDelete={requestDeletePlaylist}
                      onCancelDelete={cancelDeletePlaylist}
                      onConfirmDelete={confirmDeletePlaylist}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {selectedPlaylistId && (
        <AddTrackModal
          playlistId={selectedPlaylistId}
          onClose={() => setSelectedPlaylistId(null)}
          onTrackChanged={handleTracksChanged}
        />
      )}
    </main>
  );
};

export default PlaylistPage;
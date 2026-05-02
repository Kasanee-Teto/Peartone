import { useState, useMemo, useEffect } from "react";
import { FiSearch, FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { useFetch } from "../hooks/useFetch";
import { playlistsApi } from "../api/playlists.js";
import "../styles/AddTrackModal.css";

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

  const tracks = useMemo(
    () => (Array.isArray(tracksResp) ? tracksResp : tracksResp?.data || []),
    [tracksResp]
  );

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
    if (!token) {
      window.alert("Silakan login terlebih dahulu untuk menambah lagu ke playlist");
      return;
    }
    setAddingTrackId(trackId);
    try {
      await playlistsApi.addTrack(playlistId, trackId);
      setPlaylistTracks((current) => [...current, trackId]);
      onTrackAdded?.();
    } catch (err) {
      window.alert(err.message || "Gagal menambah track");
    } finally {
      setAddingTrackId("");
    }
  };

  const handleRemoveTrack = async (trackId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.alert("Silakan login terlebih dahulu untuk menghapus lagu dari playlist");
      return;
    }
    setRemovingTrackId(trackId);
    try {
      await playlistsApi.removeTrack(playlistId, trackId);
      setPlaylistTracks((current) => current.filter((id) => id !== trackId));
    } catch (err) {
      window.alert(err.message || "Gagal menghapus track");
    } finally {
      setRemovingTrackId("");
    }
  };

  return (
    <div className="add-track-modal">
      <div className="add-track-modal__overlay" onClick={onClose} />
      <div className="add-track-modal__content">
        <div className="add-track-modal__header">
          <h2>Tambah Lagu ke Playlist</h2>
          <button
            type="button"
            className="add-track-modal__close"
            onClick={onClose}
            aria-label="Tutup"
          >
            <FiX />
          </button>
        </div>

        <div className="add-track-modal__search">
          <FiSearch className="add-track-modal__search-icon" />
          <input
            type="text"
            placeholder="Cari lagu atau artis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="add-track-modal__search-input"
          />
        </div>

        <ul className="add-track-modal__list">
          {filtered.map((track) => (
            <li key={track.id} className="add-track-modal__item">
              <div className="add-track-modal__track-info">
                <img
                  src={track.coverUrl || track.Album?.imageUrl || "/placeholder-album.png"}
                  alt={track.title}
                  className="add-track-modal__track-image"
                />
                <div className="add-track-modal__track-details">
                  <p className="add-track-modal__track-title">{track.title}</p>
                  <p className="add-track-modal__track-artist">
                    {track.artist ||
                      (track.Artists || []).map((a) => a.name).join(", ")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="add-track-modal__add-btn"
                onClick={() => playlistTracks.includes(track.id) 
                  ? handleRemoveTrack(track.id) 
                  : handleAddTrack(track.id)}
                disabled={addingTrackId === track.id || removingTrackId === track.id}
                aria-label={`${playlistTracks.includes(track.id) ? "Hapus" : "Tambah"} ${track.title}`}
              >
                {removingTrackId === track.id ? (
                  <FiTrash2 />
                ) : playlistTracks.includes(track.id) ? (
                  <FiTrash2 />
                ) : (
                  <FiPlus />
                )}
              </button>
            </li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <div className="add-track-modal__empty">
            {searchQuery ? "Lagu tidak ditemukan" : "Tidak ada lagu tersedia"}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTrackModal;

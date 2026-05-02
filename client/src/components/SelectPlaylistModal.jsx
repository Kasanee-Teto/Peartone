import { useState, useEffect } from "react";
import { FiX, FiPlus, FiCheck, FiList } from "react-icons/fi";
import { playlistsApi } from "../api/playlists.js";
import "../styles/SelectPlaylistModal.css";

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
        if (active) setError("Gagal memuat playlist");
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
      setError(err.message || "Gagal menambahkan ke playlist");
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
    <div className="spm">
      <div className="spm__overlay" onClick={onClose} />
      <div className="spm__panel" role="dialog" aria-modal="true" aria-label="Tambah ke Playlist">
        <div className="spm__head">
          <div className="spm__track-info">
            <p className="spm__label">Tambah ke Playlist</p>
            <h3 className="spm__track-title">{trackTitle}</h3>
            {artistName && <p className="spm__track-artist">{artistName}</p>}
          </div>
          <button type="button" className="spm__close" onClick={onClose} aria-label="Tutup">
            <FiX />
          </button>
        </div>

        {error && <p className="spm__error">{error}</p>}

        <div className="spm__list">
          {loading ? (
            <div className="spm__empty">Memuat playlist…</div>
          ) : playlists.length === 0 ? (
            <div className="spm__empty">
              <FiList size={24} />
              <p>Belum ada playlist. Buat dulu di halaman Playlists.</p>
            </div>
          ) : (
            playlists.map((pl) => {
              const isAdded = added.has(pl.id);
              const isAdding = adding === pl.id;
              return (
                <button
                  key={pl.id}
                  type="button"
                  className={`spm__item ${isAdded ? "is-added" : ""}`}
                  onClick={() => !isAdded && handleAdd(pl)}
                  disabled={isAdding || isAdded}
                >
                  <div className="spm__item-icon" aria-hidden="true">
                    <FiList />
                  </div>
                  <div className="spm__item-info">
                    <span className="spm__item-name">{pl.name}</span>
                    <span className="spm__item-count">
                      {pl.trackNumbers ?? pl.trackCount ?? 0} lagu
                    </span>
                  </div>
                  <div className="spm__item-action">
                    {isAdding ? (
                      <span className="spm__spinner" />
                    ) : isAdded ? (
                      <FiCheck />
                    ) : (
                      <FiPlus />
                    )}
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
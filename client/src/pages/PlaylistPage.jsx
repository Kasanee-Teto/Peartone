import { useEffect, useState, useMemo } from "react";
import PlaylistCard from "../components/PlaylistCard";
import AddTrackModal from "../components/AddTrackModal";
import { useFetch } from "../hooks/useFetch";
import { playlistsApi } from "../api/playlists.js";
import { FiPlus, FiSearch, FiMusic } from "react-icons/fi";
import "../styles/PlaylistPage.css";

const PlaylistPage = ({ onBack }) => {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isSaving, setIsSaving]               = useState(false);
  const [playlists, setPlaylists]             = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchQuery, setSearchQuery]         = useState("");

  const { data: playlistsResp, loading, error } = useFetch("/playlists");

  useEffect(() => {
    const incoming = Array.isArray(playlistsResp)
      ? playlistsResp
      : playlistsResp?.data || [];
    setPlaylists(incoming);
  }, [playlistsResp]);

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
    if (!token) { window.alert("Silakan login terlebih dahulu."); return; }
    setIsSaving(true);
    try {
      const created = await playlistsApi.create(newPlaylistName.trim());
      const playlist = created?.data || created;
      setPlaylists((prev) => [playlist, ...prev]);
      setNewPlaylistName("");
    } catch (err) {
      window.alert(err.message || "Gagal membuat playlist.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePlaylist = async (playlist) => {
    if (!window.confirm(`Hapus playlist "${playlist.title}"?`)) return;
    try {
      await playlistsApi.delete(playlist.id);
      setPlaylists((prev) => prev.filter((p) => p.id !== playlist.id));
    } catch (err) {
      window.alert(err.message || "Gagal menghapus playlist.");
    }
  };

  // Increment song count langsung di state tanpa re-fetch
const handleTrackAdded = async () => {
  if (!selectedPlaylist) return;

  try {
    // fetch updated playlist from backend
    const updated = await playlistsApi.getMine(selectedPlaylist.id);
    const fresh = updated?.data || updated;

    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === fresh.id
          ? {
              ...p,
              ...fresh, // replace with real backend data
            }
          : p
      )
    );
  } catch (err) {
    console.error("Failed to refresh playlist:", err);
  } finally {
    setSelectedPlaylist(null);
  }
};

  return (
    <main className="pl-page">
      <div className="pl-page__blob" aria-hidden="true" />

      <div className="pl-page__inner">

        {/* Header */}
        <header className="pl-header">
          <div>
            <p className="pl-header__eyebrow">Library</p>
            <h1 className="pl-header__title">Playlist Saya</h1>
            <p className="pl-header__desc">Kelola dan nikmati koleksi playlist kamu.</p>
          </div>
          <button className="pl-header__back" onClick={onBack} aria-label="Kembali">
            ← Kembali
          </button>
        </header>

        {/* Create form */}
        <form className="pl-create" onSubmit={createPlaylist}>
          <input
            className="pl-create__input"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Nama playlist baru..."
            aria-label="Nama playlist baru"
          />
          <button
            className={`pl-create__btn${isSaving ? " is-saving" : ""}`}
            type="submit"
            disabled={isSaving}
          >
            <FiPlus size={16} />
            {isSaving ? "Menyimpan..." : "Buat Playlist"}
          </button>
        </form>

        {/* Search */}
        <div className="pl-search">
          <FiSearch className="pl-search__icon" size={15} />
          <input
            className="pl-search__input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari playlist..."
            aria-label="Cari playlist"
          />
          {searchQuery && (
            <button
              type="button"
              className="pl-search__clear"
              onClick={() => setSearchQuery("")}
              aria-label="Hapus pencarian"
            >×</button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="pl-state">
            <div className="pl-state__spinner" />
            <p>Memuat playlist...</p>
          </div>
        ) : error ? (
          <div className="pl-state pl-state--error">
            <p>Gagal memuat playlist.</p>
            <span>{error}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="pl-state">
            <FiMusic size={40} style={{ color: "rgba(255,255,255,0.15)", marginBottom: 12 }} />
            <p>{searchQuery ? "Tidak ada playlist yang cocok." : "Belum ada playlist. Buat yang pertama!"}</p>
          </div>
        ) : (
          <>
            <p className="pl-count">
              {filtered.length} playlist{searchQuery ? ` untuk "${searchQuery}"` : ""}
            </p>
            <div className="pl-grid" role="list">
              {filtered.map((playlist) => (
                <div key={playlist.id} role="listitem">
                  <PlaylistCard
                    playlist={{
                      id: playlist.id,
                      title: playlist.name || playlist.title,
                      image:
                        playlist.image ||
                        playlist.Tracks?.[0]?.coverUrl ||
                        playlist.Tracks?.[0]?.Track?.coverUrl ||
                        null,
                      songs: playlist.trackCount ?? (playlist.Tracks || []).length,
                      color: "#7c6af7",
                    }}
                    onAddTrack={setSelectedPlaylist}
                    onDelete={handleDeletePlaylist}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedPlaylist && (
        <AddTrackModal
          playlistId={selectedPlaylist.id}
          onClose={() => setSelectedPlaylist(null)}
          onTrackAdded={handleTrackAdded}
        />
      )}
    </main>
  );
};

export default PlaylistPage;

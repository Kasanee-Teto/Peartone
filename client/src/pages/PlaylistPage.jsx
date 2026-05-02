import { useEffect, useState, useMemo } from "react";
import PlaylistCard from "../components/PlaylistCard";
import AddTrackModal from "../components/AddTrackModal";
import Sidebar from "../components/Sidebar";
import { useFetch } from "../hooks/useFetch";
import { playlistsApi } from "../api/playlists.js";
import { FiPlus, FiSearch, FiMusic } from "react-icons/fi";
import "../styles/PlaylistPage.css";

const STORAGE_BASE = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:3000";

function buildCoverUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${STORAGE_BASE}${url}`;
}

const PlaylistPage = ({ onBack }) => {
  const [isSidebarOpen, setIsSidebarOpen]         = useState(false);
  const [newPlaylistName, setNewPlaylistName]     = useState("");
  const [isSaving, setIsSaving]                   = useState(false);
  const [playlists, setPlaylists]                 = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [searchQuery, setSearchQuery]             = useState("");

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

  const handleTrackAdded = async () => {
    if (!selectedPlaylistId) return;
    try {
      const updated = await playlistsApi.getMine(selectedPlaylistId);
      const fresh = updated?.data?.playlist || updated?.data || updated;
      if (fresh?.id) {
        setPlaylists((prev) =>
          prev.map((p) => p.id === fresh.id ? { ...p, ...fresh } : p)
        );
      }
    } catch (err) {
      console.error("Failed to refresh playlist:", err);
    } finally {
      setSelectedPlaylistId(null);
    }
  };

  return (
    <main className="pl-page">
      <div className="pl-page__blob" aria-hidden="true" />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={() => setIsSidebarOpen(false)}
      />
      <button
        className={`home__sidebar-overlay ${isSidebarOpen ? "is-open" : ""}`}
        type="button"
        aria-label="Tutup menu samping"
        onClick={() => setIsSidebarOpen(false)}
      />
      <button
        className="home__sidebar-toggle"
        type="button"
        aria-label="Buka menu samping"
        aria-controls="home-sidebar"
        aria-expanded={isSidebarOpen}
        onClick={() => setIsSidebarOpen(true)}
      >≡</button>

      <div className="pl-page__inner">

        <header className="pl-header">
          <div>
            <p className="pl-header__eyebrow">Library</p>
            <h1 className="pl-header__title">Playlist Saya</h1>
            <p className="pl-header__desc">Kelola dan nikmati koleksi playlist kamu.</p>
          </div>
          {onBack && (
            <button className="pl-header__back" onClick={onBack} aria-label="Kembali">
              ← Kembali
            </button>
          )}
        </header>

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
              {filtered.map((playlist) => {
                const rawCover =
                  playlist.image ||
                  playlist.coverUrl ||
                  playlist.Tracks?.[0]?.coverUrl ||
                  playlist.Tracks?.[0]?.Track?.coverUrl ||
                  null;

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
                      onDelete={handleDeletePlaylist}
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
          onTrackAdded={handleTrackAdded}
        />
      )}
    </main>
  );
};

export default PlaylistPage;

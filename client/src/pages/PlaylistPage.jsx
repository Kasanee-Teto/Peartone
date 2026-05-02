import { useEffect, useState } from "react";
import PlaylistCard from "../components/PlaylistCard";
import AddTrackModal from "../components/AddTrackModal";
import Sidebar from "../components/Sidebar";
import "../styles/playlistPage.css";
import { useFetch } from "../hooks/useFetch";
import { playlistsApi } from "../api/playlists.js";

const PlaylistPage = ({ onBack }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const { data: playlistsResp, loading, error } = useFetch("/playlists");

  useEffect(() => {
    const incoming = Array.isArray(playlistsResp) ? playlistsResp : playlistsResp?.data || [];
    setPlaylists(incoming);
  }, [playlistsResp]);

  const createPlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) {
      window.alert("Silakan login terlebih dahulu untuk membuat playlist");
      return;
    }
    setIsSaving(true);
    try {
      const created = await playlistsApi.create(newPlaylistName.trim());
      const playlist = created?.data || created;
      setPlaylists((current) => [playlist, ...current]);
      setNewPlaylistName("");
    } catch (err) {
      window.alert(err.message || "Gagal membuat playlist");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTrackToPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleTrackAdded = () => {
    window.alert("Lagu berhasil ditambahkan!");
    setSelectedPlaylist(null);
  };

  const handleDeletePlaylist = async (playlist) => {
    const confirm = window.confirm(`Yakin ingin menghapus playlist "${playlist.title}"?`);
    if (!confirm) return;

    try {
      await playlistsApi.delete(playlist.id);
      setPlaylists((current) => current.filter((p) => p.id !== playlist.id));
      window.alert("Playlist berhasil dihapus");
    } catch (err) {
      window.alert(err.message || "Gagal menghapus playlist");
    }
  };

  return (
    <main className="playlist" aria-label="Playlist">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onHome={() => {
          onBack();
          setIsSidebarOpen(false);
        }}
        onPlaylist={() => setIsSidebarOpen(false)}
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
      >
        ≡
      </button>

      <div className="playlist-header">
        <button className="back-button" onClick={onBack} aria-label="Kembali ke beranda">
          ← Kembali
        </button>
        <h1 className="playlist-title">Playlist Saya</h1>
        <div style={{ width: "80px" }}></div>
      </div>

      <form onSubmit={createPlaylist} style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="Nama playlist baru"
          aria-label="Nama playlist baru"
          className="admin-field__input"
          style={{ minWidth: 260 }}
        />
        <button type="submit" className="admin-submit" disabled={isSaving}>
          {isSaving ? "Menyimpan..." : "Buat Playlist"}
        </button>
      </form>

      {loading ? (
        <div>Loading playlists…</div>
      ) : error ? (
        <div className="error-state">Gagal memuat playlist: {error}</div>
      ) : (
        <div className="playlists-grid" role="list" aria-label="Daftar playlist">
          {playlists.map((playlist) => (
            <div key={playlist.id} role="listitem">
              <PlaylistCard 
                playlist={{
                  id: playlist.id,
                  title: playlist.name,
                  image: playlist.image || "/placeholder-album.png",
                  songs: playlist.trackCount || (playlist.Tracks || []).length,
                  color: "#7c6af7"
                }}
                onAddTrack={handleAddTrackToPlaylist}
                onDelete={handleDeletePlaylist}
              />
            </div>
          ))}
        </div>
      )}

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
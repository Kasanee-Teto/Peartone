import { useState } from "react";
import { FiPlay, FiMoreHorizontal, FiMusic } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import "../styles/AlbumsPage.css";
import { useFetch } from "../hooks/useFetch";

const AlbumCard = ({ album }) => {
  return (
    <article className="album-card">
      <div className="album-card__cover" style={{ background: "linear-gradient(145deg,#3b2fa8 0%,#1a1a2e 100%)" }}>
        <div className="album-card__cover-inner">
          <div className="album-card__art">
            <FiMusic size={26} />
          </div>
        </div>
        <div className="album-card__scrim" />
        <button type="button" aria-label={`Play ${album.title}`} className="album-card__play">
          <FiPlay size={18} fill="currentColor" />
        </button>
      </div>

      <div className="album-card__info">
        <div className="album-card__info-row">
          <div className="album-card__text">
            <h3 className="album-card__title" title={album.title}>{album.title}</h3>
            <p className="album-card__artist">{album.Artist?.name || album.artist || "Unknown"}</p>
          </div>
        </div>

        <div className="album-card__meta">
          <span>{album.releaseDate ? new Date(album.releaseDate).getFullYear() : ""}</span>
          <span className="album-card__meta-dot" />
          <span>{(album.Tracks || []).length} tracks</span>
        </div>
      </div>

      <div className="album-card__accent" />
    </article>
  );
};

const AlbumsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: albumsResp, loading, error } = useFetch("/albums");
  const albums = Array.isArray(albumsResp) ? albumsResp : albumsResp?.data || [];

  return (
    <main className="albums-page">
      <div className="albums-page__blob" aria-hidden="true" />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={() => setIsSidebarOpen(false)}
      />

      <button
        className={`home__sidebar-overlay${isSidebarOpen ? " is-open" : ""}`}
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

      <div className="albums-page__inner">
        <header className="albums-header">
          <div>
            <p className="albums-header__eyebrow">Koleksi Musik</p>
            <h1 className="albums-header__title">Albums</h1>
            <p className="albums-header__desc">Koleksi album terbaik untuk menemani eksplorasi musikmu.</p>
          </div>
          <span className="albums-header__badge">Fresh</span>
        </header>

        <div className="albums-section-row">
          <h2 className="albums-section-row__title">Latest Albums</h2>
          <button type="button" className="albums-section-row__see-all">Lihat Semua</button>
        </div>

        {loading ? (
          <div>Loading albums…</div>
        ) : error ? (
          <div className="error-state">Gagal memuat albums: {error}</div>
        ) : (
          <ul className="albums-grid">
            {albums.map((album) => (
              <li key={album.id}><AlbumCard album={album} /></li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default AlbumsPage;

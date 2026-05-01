import { useState } from "react";
import { FiPlay, FiMoreHorizontal, FiMusic } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import "../styles/AlbumsPage.css";

const albums = [
  { id: 1, title: "After Dark",   artist: "Arka Lane",   year: "2026", tracks: 12, color: "#7c6af7", bg: "linear-gradient(145deg,#3b2fa8 0%,#1a1a2e 100%)" },
  { id: 2, title: "City Lights",  artist: "Nova Echo",   year: "2025", tracks: 10, color: "#00d4ff", bg: "linear-gradient(145deg,#005f73 0%,#0a1628 100%)" },
  { id: 3, title: "Sunset Tapes", artist: "Luna Vale",   year: "2026", tracks: 14, color: "#ff5c6e", bg: "linear-gradient(145deg,#7b1e2e 0%,#1a0a0e 100%)" },
  { id: 4, title: "Throttle",     artist: "Rift Boys",   year: "2024", tracks: 11, color: "#ffa500", bg: "linear-gradient(145deg,#6b3a00 0%,#1a1200 100%)" },
  { id: 5, title: "Orbit",        artist: "Mira Sol",    year: "2025", tracks:  9, color: "#c8f560", bg: "linear-gradient(145deg,#3a5c00 0%,#0e1a00 100%)" },
  { id: 6, title: "Blue Hour",    artist: "Velvet Peak", year: "2026", tracks: 13, color: "#ec4899", bg: "linear-gradient(145deg,#6b0f4a 0%,#1a0014 100%)" },
];

const DROPDOWN_ITEMS = ["Tambah ke Playlist", "Bagikan Album", "Simpan ke Library", "Lihat Artis"];

const AlbumCard = ({ album }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article
      className="album-card"
      onMouseLeave={() => setMenuOpen(false)}
    >
      {/* Cover */}
      <div className="album-card__cover" style={{ background: album.bg }}>
        <div className="album-card__cover-inner">
          <div
            className="album-card__art"
            style={{ boxShadow: `0 4px 24px ${album.color}44` }}
          >
            <FiMusic size={26} style={{ color: album.color }} />
          </div>
        </div>

        <div className="album-card__scrim" />

        <button
          type="button"
          aria-label={`Play ${album.title}`}
          className="album-card__play"
        >
          <FiPlay size={18} fill="currentColor" />
        </button>
      </div>

      {/* Info */}
      <div className="album-card__info">
        <div className="album-card__info-row">
          <div className="album-card__text">
            <h3 className="album-card__title" title={album.title}>{album.title}</h3>
            <p className="album-card__artist">{album.artist}</p>
          </div>

          <div className="album-card__more-wrap">
            <button
              type="button"
              aria-label="Opsi lainnya"
              className={`album-card__more${menuOpen ? " is-open" : ""}`}
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            >
              <FiMoreHorizontal size={15} />
            </button>

            {menuOpen && (
              <div className="album-card__dropdown">
                {DROPDOWN_ITEMS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className="album-card__dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="album-card__meta">
          <span>{album.year}</span>
          <span className="album-card__meta-dot" />
          <span>{album.tracks} tracks</span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="album-card__accent"
        style={{ background: `linear-gradient(90deg, ${album.color}00, ${album.color}99, ${album.color}00)` }}
      />
    </article>
  );
};

const AlbumsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

        {/* Header */}
        <header className="albums-header">
          <div>
            <p className="albums-header__eyebrow">Koleksi Musik</p>
            <h1 className="albums-header__title">Albums</h1>
            <p className="albums-header__desc">
              Koleksi album terbaik untuk menemani eksplorasi musikmu.
            </p>
          </div>
          <span className="albums-header__badge">Fresh</span>
        </header>

        {/* Section row */}
        <div className="albums-section-row">
          <h2 className="albums-section-row__title">Latest Albums</h2>
          <button type="button" className="albums-section-row__see-all">
            Lihat Semua
          </button>
        </div>

        {/* Grid */}
        <ul className="albums-grid">
          {albums.map((album) => (
            <li key={album.id}>
              <AlbumCard album={album} />
            </li>
          ))}
        </ul>

      </div>
    </main>
  );
};

export default AlbumsPage;

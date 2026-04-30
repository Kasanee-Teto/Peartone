import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/ArtistsPage.css";

const artists = [
  { id: 1, name: "Arka Lane",   genre: "Pop / R&B",   followers: "1.2M", color1: "#7c6af7", color2: "#c8f560" },
  { id: 2, name: "Nova Echo",   genre: "Electronic",  followers: "980K", color1: "#00d4ff", color2: "#7c6af7" },
  { id: 3, name: "Luna Vale",   genre: "Indie Pop",   followers: "740K", color1: "#ff5c6e", color2: "#ffa500" },
  { id: 4, name: "Rift Boys",   genre: "Hip-Hop",     followers: "2.1M", color1: "#ffa500", color2: "#c8f560" },
  { id: 5, name: "Mira Sol",    genre: "Alt Pop",     followers: "860K", color1: "#0ea5e9", color2: "#7c6af7" },
  { id: 6, name: "Velvet Peak", genre: "Dream Pop",   followers: "520K", color1: "#ec4899", color2: "#7c6af7" },
];

const ArtistCard = ({ artist }) => {
  const [following, setFollowing] = useState(false);

  const initials = artist.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <article className="artist-card">
      {/* Banner */}
      <div
        className="artist-card__banner"
        style={{
          background: `linear-gradient(135deg, ${artist.color1} 0%, ${artist.color2} 100%)`,
        }}
      >
        {/* Avatar */}
        <div className="artist-card__avatar-wrap">
          <div
            className="artist-card__avatar"
            style={{ boxShadow: `0 4px 16px ${artist.color1}55` }}
          >
            {initials}
          </div>
        </div>

        {/* Followers badge */}
        <div className="artist-card__followers">{artist.followers}</div>
      </div>

      {/* Info */}
      <div className="artist-card__info">
        <h3 className="artist-card__name">{artist.name}</h3>
        <p className="artist-card__genre">{artist.genre}</p>

        <button
          type="button"
          className={`artist-card__follow${following ? " is-following" : ""}`}
          onClick={() => setFollowing(!following)}
        >
          {following ? "Following" : "Follow"}
        </button>
      </div>

      {/* Bottom accent line */}
      <div
        className="artist-card__accent"
        style={{
          background: `linear-gradient(90deg, ${artist.color1}00, ${artist.color1}99, ${artist.color1}00)`,
        }}
      />
    </article>
  );
};

const ArtistsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="artists-page">
      <div className="artists-page__blob" aria-hidden="true" />

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

      <div className="artists-page__inner">

        {/* Header */}
        <header className="artists-header">
          <div>
            <p className="artists-header__eyebrow">Koleksi Musik</p>
            <h1 className="artists-header__title">Artists</h1>
            <p className="artists-header__desc">
              Temukan musisi yang lagi ramai didengar dan cocok dengan selera kamu.
            </p>
          </div>
          <span className="artists-header__badge">Popular</span>
        </header>

        {/* Section row */}
        <div className="artists-section-row">
          <h2 className="artists-section-row__title">Featured Artists</h2>
          <button type="button" className="artists-section-row__see-all">
            Lihat Semua
          </button>
        </div>

        {/* Grid */}
        <ul className="artists-grid">
          {artists.map((artist) => (
            <li key={artist.id}>
              <ArtistCard artist={artist} />
            </li>
          ))}
        </ul>

      </div>
    </main>
  );
};

export default ArtistsPage;

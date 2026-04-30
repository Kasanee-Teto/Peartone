import { useState } from "react";
import { FiMusic, FiHeart, FiEdit2, FiMapPin, FiCalendar } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="profile__page">
      {/* Blur blobs */}
      <div className="profile__blobs" aria-hidden="true">
        <div className="profile__blob profile__blob--purple" />
        <div className="profile__blob profile__blob--green" />
      </div>

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
      >
        ≡
      </button>

      <div className="profile__container">

        {/* Hero Banner */}
        <div className="profile__hero">
          <div className="profile__avatar">P</div>
          <div className="profile__hero-info">
            <span className="profile__hero-type">Profil Publik</span>
            <h1 className="profile__hero-name">Peartone User</h1>
            <div className="profile__hero-meta">
              <span className="profile__hero-meta-item">
                <FiMusic size={13} /> 12 Playlist
              </span>
              <span className="profile__hero-meta-item">
                <FiHeart size={13} /> 84 Liked Songs
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="profile__actions">
          <button type="button" className="profile__btn-edit">
            <FiEdit2 size={14} />
            Edit Profil
          </button>
        </div>

        {/* Content Grid */}
        <div className="profile__content">

          {/* Kolom Kiri */}
          <aside className="profile__sidebar-info">
            <div className="profile__info-card">
              <h2 className="profile__info-card-title">Informasi</h2>
              <ul className="profile__info-list">
                <li className="profile__info-item">
                  <span className="profile__info-icon"><FiMapPin size={14} /></span>
                  <span>Jakarta, Indonesia</span>
                </li>
                <li className="profile__info-item">
                  <span className="profile__info-icon"><FiCalendar size={14} /></span>
                  <span>Bergabung April 2025</span>
                </li>
              </ul>
            </div>

            <div className="profile__info-card">
              <h2 className="profile__info-card-title">Bio</h2>
              <p className="profile__bio-text">
                Pendengar musik aktif yang suka eksplorasi playlist baru setiap hari.
              </p>
            </div>

            <div className="profile__stats-row">
              <div className="profile__stat">
                <span className="profile__stat-icon profile__stat-icon--purple">
                  <FiMusic size={16} />
                </span>
                <p className="profile__stat-value">12</p>
                <p className="profile__stat-label">Playlists</p>
              </div>
              <div className="profile__stat">
                <span className="profile__stat-icon profile__stat-icon--green">
                  <FiHeart size={16} />
                </span>
                <p className="profile__stat-value">84</p>
                <p className="profile__stat-label">Liked Songs</p>
              </div>
            </div>
          </aside>

          {/* Kolom Kanan */}
          <section className="profile__main">
            <h2 className="profile__section-title">Aktivitas Terbaru</h2>
            <ul className="profile__activity-list" role="list">
              {[
                { title: "Lo-fi Morning Vibes",  sub: "Playlist · Diperbarui 2 jam lalu" },
                { title: "Favourite Indie Picks", sub: "Playlist · Diperbarui kemarin" },
                { title: "Late Night Drive",       sub: "Playlist · Diperbarui 3 hari lalu" },
              ].map((item) => (
                <li key={item.title} className="profile__activity-item">
                  <div className="profile__activity-thumb">
                    <FiMusic size={16} />
                  </div>
                  <div className="profile__activity-info">
                    <p className="profile__activity-title">{item.title}</p>
                    <p className="profile__activity-sub">{item.sub}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

        </div>
      </div>
    </main>
  );
};

export default ProfilePage;

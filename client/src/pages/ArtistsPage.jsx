import { useMemo, useState } from "react";
import { FiArrowRight, FiStar } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import "../styles/ArtistsPage.css";
import { useFetch } from "../hooks/useFetch";

const ArtistsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: artistsResp, loading, error } = useFetch("/artists");

  const artists = Array.isArray(artistsResp) ? artistsResp : artistsResp?.data || [];
  const featuredArtists = useMemo(() => artists.slice(0, 6), [artists]);
  const spotlightArtist = featuredArtists[0] || null;

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

        <div className="artists-section-row">
          <h2 className="artists-section-row__title">Featured Artists</h2>
          <button type="button" className="artists-section-row__see-all">
            Lihat Semua
          </button>
        </div>

        {!loading && !error && spotlightArtist ? (
          <section className="artists-spotlight" aria-label="Featured artist spotlight">
            <div className="artists-spotlight__hero">
              <div className="artists-spotlight__avatar">
                {spotlightArtist.imageUrl ? (
                  <img src={spotlightArtist.imageUrl} alt={spotlightArtist.name} />
                ) : (
                  <span>{(spotlightArtist.name || "").slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="artists-spotlight__content">
                <p className="artists-spotlight__eyebrow"><FiStar /> Featured Pick</p>
                <h3 className="artists-spotlight__title">{spotlightArtist.name}</h3>
                <p className="artists-spotlight__desc">{spotlightArtist.bio || "Featured artist pilihan backend hari ini."}</p>
              </div>
              <button type="button" className="artists-spotlight__action">
                Explore <FiArrowRight />
              </button>
            </div>
          </section>
        ) : null}

        {loading ? (
          <div>Loading artists…</div>
        ) : error ? (
          <div className="error-state">Gagal memuat artists: {error}</div>
        ) : (
          <ul className="artists-grid">
            {featuredArtists.map((artist) => (
              <li key={artist.id}>
                <article className="artist-card">
                  <div className="artist-card__banner" style={{ background: artist.imageUrl ? `url(${artist.imageUrl}) center/cover no-repeat` : "linear-gradient(135deg,#7c6af7 0%, #c8f560 100%)" }}>
                    <div className="artist-card__avatar-wrap">
                      <div className="artist-card__avatar">{(artist.name || "").slice(0,2).toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="artist-card__info">
                    <h3 className="artist-card__name">{artist.name}</h3>
                    <p className="artist-card__genre">{artist.bio || "Featured artist dari backend"}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

      </div>
    </main>
  );
};

export default ArtistsPage;

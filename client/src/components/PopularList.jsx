import MusicCard from "./MusicCard";

const PopularList = ({ popular = [], loading, error }) => {
  if (loading) {
    return (
      <section className="popular" aria-label="Popular Now">
        <h2 className="section-title">Popular Now</h2>
        <div className="skeleton-grid" aria-busy="true" aria-live="polite">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card skeleton-card--grid" aria-hidden="true" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="popular" aria-label="Popular Now">
        <h2 className="section-title">Popular Now</h2>
        <div className="error-state" role="alert">
          <span className="error-state__icon" aria-hidden="true">⚠️</span>
          <p className="error-state__message">Gagal memuat lagu populer: {error}</p>
        </div>
      </section>
    );
  }

  if (popular.length === 0) {
    return (
      <section className="popular" aria-label="Popular Now">
        <h2 className="section-title">Popular Now</h2>
        <p className="empty-state">Belum ada lagu populer tersedia.</p>
      </section>
    );
  }

  return (
    <section className="popular" aria-label="Popular Now">
      <div className="section-header">
        <h2 className="section-title">Popular Now</h2>
        <a href="/popular" className="section-link" aria-label="Lihat semua lagu populer">
          Lihat Semua →
        </a>
      </div>

      <div className="popular-grid" role="list" aria-label="Daftar lagu populer">
        {popular.map((track, index) => (
          <div key={track?.id ?? index} role="listitem">
            <MusicCard track={track} variant="popular" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularList;
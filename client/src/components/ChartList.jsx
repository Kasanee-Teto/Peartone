import MusicCard from "./MusicCard";

const ChartList = ({ charts = [], loading, error }) => {
  if (loading) {
    return (
      <section className="charts" aria-label="Top Charts">
        <h2 className="section-title">Top Charts</h2>
        <div className="skeleton-list" aria-busy="true" aria-live="polite">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-card" aria-hidden="true" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="charts" aria-label="Top Charts">
        <h2 className="section-title">Top Charts</h2>
        <div className="error-state" role="alert">
          <span className="error-state__icon" aria-hidden="true">⚠️</span>
          <p className="error-state__message">Gagal memuat charts: {error}</p>
        </div>
      </section>
    );
  }

  if (charts.length === 0) {
    return (
      <section className="charts" aria-label="Top Charts">
        <h2 className="section-title">Top Charts</h2>
        <p className="empty-state">Belum ada data chart tersedia.</p>
      </section>
    );
  }

  return (
    <section className="charts" aria-label="Top Charts">
      <div className="section-header">
        <h2 className="section-title">Top Charts</h2>
        <a href="/charts" className="section-link" aria-label="Lihat semua charts">
          Lihat Semua →
        </a>
      </div>

      <ol className="chart-list" aria-label="Daftar top charts">
        {charts.map((track, index) => (
          <li key={track?.id ?? index} className="chart-list__item">
            <MusicCard track={track} variant="chart" rank={index + 1} />
          </li>
        ))}
      </ol>
    </section>
  );
};

export default ChartList;
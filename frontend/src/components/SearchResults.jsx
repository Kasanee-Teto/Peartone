import { FiMusic, FiPlay } from "react-icons/fi";
import { emitPlayTrack } from "../utils/playerBus.js";
import "../styles/SearchResults.css";

function formatDuration(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function normalizeResult(t) {
  const artist =
    Array.isArray(t?.Artists) && t.Artists.length > 0
      ? t.Artists.map((a) => a?.name).filter(Boolean).join(", ")
      : t?.artist || t?.Artist?.name || "Unknown Artist";

  return {
    id: t?.id,
    title: t?.title || t?.name || "Untitled",
    artist,
    album: t?.Album?.title || t?.album || "",
    duration: t?.duration || 0,
    cover: t?.cover || t?.coverUrl || t?.Album?.cover || "",
    ...t,
  };
}

const SearchResults = ({ results, loading, error, query }) => {
  if (loading) {
    return (
      <div className="search-results">
        <div className="search-results__skeleton">
          {[1, 2, 3].map((i) => (
            <div key={i} className="search-results__skeleton-row">
              <div className="search-results__skeleton-thumb" />
              <div className="search-results__skeleton-lines">
                <div className="search-results__skeleton-line" />
                <div className="search-results__skeleton-line search-results__skeleton-line--short" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results__error">
        Gagal mencari: {error}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="search-results">
        <div className="search-results__empty">
          <FiMusic size={28} className="search-results__empty-icon" />
          <p className="search-results__empty-text">
            Tidak ada lagu ditemukan untuk{" "}
            <span className="search-results__empty-query">"{query}"</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="search-results__header">
        <p className="search-results__header-text">
          {results.length} hasil untuk "{query}"
        </p>
      </div>

      <ul className="search-results__list" role="list">
        {results.map((raw, index) => {
          const track = normalizeResult(raw);
          return (
            <li
              key={track.id || index}
              className="search-results__item"
              onClick={() => emitPlayTrack(track)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && emitPlayTrack(track)}
              aria-label={`Putar ${track.title} oleh ${track.artist}`}
            >
              <div className="search-results__thumb">
                {track.cover ? (
                  <img src={track.cover} alt={track.title} />
                ) : (
                  <FiMusic size={16} />
                )}
                <div className="search-results__play-overlay">
                  <FiPlay size={14} fill="white" color="white" />
                </div>
              </div>

              <div className="search-results__info">
                <p className="search-results__title">{track.title}</p>
                <p className="search-results__artist">
                  {track.artist}
                  {track.album && (
                    <span className="search-results__album"> · {track.album}</span>
                  )}
                </p>
              </div>

              <span className="search-results__duration">
                {formatDuration(track.duration)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchResults;

import { useEffect, useState } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import MusicCard from "../components/MusicCard";
import { tracksApi } from "../api/tracks.js";

const PAGE_SIZE = 20;

function normalizeTrack(t) {
  const artist =
    Array.isArray(t?.Artists) && t.Artists.length > 0
      ? t.Artists.map((a) => a?.name).filter(Boolean).join(", ")
      : t?.artist || t?.Artist?.name || "Unknown Artist";

  return {
    ...t,
    title: t?.title || t?.name || "Untitled",
    artist,
    album: t?.Album?.title || t?.album || "",
    cover_url:
      t?.cover ||
      t?.coverUrl ||
      t?.image ||
      t?.imageUrl ||
      t?.Album?.cover ||
      t?.Album?.coverUrl ||
      "",
    duration: t?.duration || 0,
  };
}

const TracksPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await tracksApi.list({ q: query || undefined, page, limit: PAGE_SIZE });
        if (cancelled) return;
        const items = Array.isArray(res) ? res : res?.data || [];
        setTracks(items.map(normalizeTrack));
        setHasMore(items.length === PAGE_SIZE);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Gagal memuat lagu");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [query, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(inputValue.trim());
  };

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => p + 1);

  return (
    <main className="tracks-page" style={{ minHeight: "100vh", background: "#0d0d0f", color: "#fff" }}>
      <div
        style={{
          pointerEvents: "none",
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          zIndex: 0,
        }}
        aria-hidden="true"
      >
        <div style={{ position: "absolute", top: -64, left: -128, width: 500, height: 500, borderRadius: "50%", background: "#7c6af7", opacity: 0.07, filter: "blur(140px)" }} />
        <div style={{ position: "absolute", bottom: -80, right: 0, width: 384, height: 384, borderRadius: "50%", background: "#c8f560", opacity: 0.06, filter: "blur(140px)" }} />
      </div>

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

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1024,
          margin: "0 auto",
          padding: "48px 24px 100px",
        }}
      >
        {/* Header */}
        <header style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 28, marginBottom: 32 }}>
          <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)" }}>
            Koleksi Musik
          </p>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem,6vw,3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>
            All Songs
          </h1>
          <p style={{ margin: "12px 0 0", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Telusuri seluruh koleksi lagu dan temukan favoritmu.
          </p>
        </header>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}
          aria-label="Cari lagu"
        >
          <label
            style={{
              flex: 1,
              minWidth: 240,
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: "10px 16px",
            }}
          >
            <FiSearch size={16} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} aria-hidden="true" />
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Cari judul, artis, atau album..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: 14,
              }}
              aria-label="Kata kunci pencarian"
            />
          </label>
          <button
            type="submit"
            style={{
              padding: "10px 24px",
              borderRadius: 12,
              border: "none",
              background: "#c8f560",
              color: "#0d0d0f",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cari
          </button>
        </form>

        {/* Content */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }} aria-busy="true" aria-live="polite">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 72,
                  borderRadius: 14,
                  background: "linear-gradient(90deg,#18181c 25%,#222228 50%,#18181c 75%)",
                  backgroundSize: "800px 100%",
                  animation: "shimmer 1.4s infinite",
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        ) : error ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(255,92,110,0.08)",
              border: "1px solid rgba(255,92,110,0.25)",
              borderRadius: 14,
              padding: "20px 24px",
              color: "#ff5c6e",
            }}
            role="alert"
          >
            <span aria-hidden="true">⚠️</span>
            <p style={{ margin: 0 }}>Gagal memuat lagu: {error}</p>
          </div>
        ) : tracks.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "40px 0" }}>
            {query ? `Tidak ada lagu untuk "${query}".` : "Belum ada lagu tersedia."}
          </p>
        ) : (
          <ol className="chart-list" aria-label="Daftar lagu">
            {tracks.map((track, index) => (
              <li key={track?.id ?? index} className="chart-list__item">
                <MusicCard track={track} variant="chart" rank={(page - 1) * PAGE_SIZE + index + 1} />
              </li>
            ))}
          </ol>
        )}

        {/* Pagination */}
        {!loading && !error && tracks.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginTop: 40,
            }}
            aria-label="Navigasi halaman"
          >
            <button
              type="button"
              onClick={handlePrev}
              disabled={page === 1}
              aria-label="Halaman sebelumnya"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 18px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "transparent",
                color: page === 1 ? "rgba(255,255,255,0.25)" : "#fff",
                cursor: page === 1 ? "not-allowed" : "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <FiChevronLeft size={16} />
              Sebelumnya
            </button>

            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
              Halaman {page}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={!hasMore}
              aria-label="Halaman berikutnya"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 18px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "transparent",
                color: !hasMore ? "rgba(255,255,255,0.25)" : "#fff",
                cursor: !hasMore ? "not-allowed" : "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Berikutnya
              <FiChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default TracksPage;

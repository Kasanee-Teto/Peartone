import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FiSearch, FiPlay } from "react-icons/fi";
import "../styles/HistoryPage.css";
import { useFetch } from "../hooks/useFetch";
import { emitPlayTrack, normalizePlayableTrack } from "../utils/playerBus.js";

const HistoryPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: historyResp, loading, error } = useFetch("/history");

  const rows = Array.isArray(historyResp) ? historyResp : historyResp?.data || [];

  const q = search.trim().toLowerCase();
  const filtered = q
    ? rows.filter((r) => {
        const t = r.Track || {};
        return [t.title, t?.Artists?.map?.((a) => a.name).join(", "), t?.Album?.title]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q));
      })
    : rows;

  const handlePlay = (row) => {
    const t = row.Track || {};
    emitPlayTrack(
      normalizePlayableTrack({
        id: t.id || row.trackId,
        trackId: t.id || row.trackId,
        title: t.title,
        artist: Array.isArray(t.Artists)
          ? t.Artists.map((a) => a.name).join(", ")
          : t.Artist?.name || "",
        album: t.Album?.title || "",
        duration: t.duration || 0,
        coverUrl: t.coverUrl || t.Album?.coverUrl || "",
      })
    );
  };

  return (
    <main className="history-page" aria-label="History">
      <div className="history-page__blob" aria-hidden="true" />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={() => setIsSidebarOpen(false)} />

      <button className={`home__sidebar-overlay${isSidebarOpen ? " is-open" : ""}`} type="button" aria-label="Tutup menu samping" onClick={() => setIsSidebarOpen(false)} />

      <button className="home__sidebar-toggle" type="button" aria-label="Buka menu samping" aria-controls="home-sidebar" aria-expanded={isSidebarOpen} onClick={() => setIsSidebarOpen(true)}>≡</button>

      <div className="history-page__inner">
        <header className="history-header">
          <div>
            <p className="history-header__eyebrow">Library</p>
            <h1 className="history-header__title">History</h1>
            <p className="history-header__desc">Lagu terakhir yang kamu dengarkan.</p>
          </div>
          <span className="history-header__badge">Recent</span>
        </header>

        <div className="history-toolbar" aria-label="Kontrol history">
          <label className="history-search" aria-label="Cari di history">
            <FiSearch className="history-search__icon" aria-hidden="true" />
            <input className="history-search__input" type="search" placeholder="Cari judul, artis, atau album" value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>

          <button type="button" className="history-delete" disabled aria-label="Hapus semua history" title="Fitur hapus history belum tersedia">
            <span>Delete</span>
          </button>
        </div>

        <section className="history-table" aria-label="Daftar history">
          <div className="history-table__head" role="row">
            <div role="columnheader">#</div>
            <div role="columnheader">Judul</div>
            <div role="columnheader">Artis</div>
            <div role="columnheader">Album</div>
            <div role="columnheader">Diputar</div>
          </div>

          {loading ? (
            <div>Loading…</div>
          ) : error ? (
            <div className="error-state">Gagal memuat history: {error}</div>
          ) : filtered.length === 0 ? (
            <div className="history-empty" role="status">{rows.length === 0 ? "Belum ada history." : "Tidak ada hasil yang cocok."}</div>
          ) : (
            <ul className="history-table__rows">
              {filtered.map((row, index) => {
                const t = row.Track || {};
                const artist = Array.isArray(t.Artists) ? t.Artists.map((a) => a.name).join(", ") : t.Artist?.name || "Unknown";
                return (
                  <li key={row.id || index} className="history-row">
                    <div className="history-row__index">{index + 1}</div>
                    <div className="history-row__title" title={t.title}>
                      <button
                        type="button"
                        onClick={() => handlePlay(row)}
                        aria-label={`Putar ${t.title || "lagu"}`}
                        title="Putar"
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: "#c8f560", padding: "4px", display: "inline-flex", alignItems: "center", marginRight: "8px" }}
                      >
                        <FiPlay size={13} fill="currentColor" />
                      </button>
                      {t.title}
                    </div>
                    <div className="history-row__cell" title={artist}>{artist}</div>
                    <div className="history-row__cell" title={t.Album?.title}>{t.Album?.title || ""}</div>
                    <div className="history-row__cell history-row__playedAt">{new Date(row.playedAt || row.createdAt || 0).toLocaleString()}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default HistoryPage;

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FiSearch, FiTrash2, FiX, FiAlertTriangle } from "react-icons/fi";
import "../styles/HistoryPage.css";
import { useFetch } from "../hooks/useFetch";
import { historyApi } from "../api/history.js";

const HistoryPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [clearing, setClearing] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const { data: historyResp, loading, error, execute: reloadHistory } = useFetch("/history");

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

  const formatPlayedAt = (row) => {
    const value = row.playedAt || row.createdAt;
    if (!value) return "—";
    return new Date(value).toLocaleString();
  };

  const handleClearHistory = async () => {
    try {
      setClearing(true);
      await historyApi.clear();
      setShowDeletePopup(false);
      await reloadHistory();
    } catch (err) {
      window.alert(err.message || "Gagal menghapus history");
    } finally {
      setClearing(false);
    }
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

          <button type="button" className="history-delete" onClick={() => setShowDeletePopup(true)} disabled={rows.length === 0 || clearing} aria-label="Hapus semua history" title={rows.length === 0 ? "History kosong" : "Hapus semua history"}>
            <FiTrash2 aria-hidden="true" />
            <span>{clearing ? "Deleting..." : "Delete"}</span>
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
                    <div className="history-row__title" title={t.title}>{t.title}</div>
                    <div className="history-row__cell" title={artist}>{artist}</div>
                    <div className="history-row__cell" title={t.Album?.title}>{t.Album?.title || ""}</div>
                    <div className="history-row__cell history-row__playedAt">{formatPlayedAt(row)}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {showDeletePopup && (
        <div className="history-modal" role="dialog" aria-modal="true" aria-labelledby="history-delete-title">
          <button
            type="button"
            className="history-modal__backdrop"
            aria-label="Tutup popup"
            onClick={() => setShowDeletePopup(false)}
          />

          <div className="history-modal__card">
            <div className="history-modal__iconWrap" aria-hidden="true">
              <FiAlertTriangle className="history-modal__icon" />
            </div>

            <button
              type="button"
              className="history-modal__close"
              aria-label="Tutup popup"
              onClick={() => setShowDeletePopup(false)}
            >
              <FiX />
            </button>

            <h2 className="history-modal__title" id="history-delete-title">Hapus semua history?</h2>
            <p className="history-modal__text">
              Semua riwayat putar akan dihapus dari akun ini. Tindakan ini tidak bisa dibatalkan.
            </p>

            <div className="history-modal__actions">
              <button
                type="button"
                className="history-modal__btn history-modal__btn--ghost"
                onClick={() => setShowDeletePopup(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="history-modal__btn history-modal__btn--danger"
                onClick={handleClearHistory}
                disabled={clearing}
              >
                {clearing ? "Deleting..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default HistoryPage;

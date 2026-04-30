import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import "../styles/HistoryPage.css";

const historyTracks = [
  { id: 1, title: "Night Runner", artist: "Arka Lane", album: "After Dark", playedAt: "Hari ini" },
  { id: 2, title: "Static Heart", artist: "Nova Echo", album: "City Lights", playedAt: "Kemarin" },
  { id: 3, title: "Soft Gravity", artist: "Luna Vale", album: "Sunset Tapes", playedAt: "Kemarin" },
  { id: 4, title: "Move Fast", artist: "Rift Boys", album: "Throttle", playedAt: "3 hari lalu" },
  { id: 5, title: "Bloom", artist: "Mira Sol", album: "Orbit", playedAt: "1 minggu lalu" },
];

const HistoryPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tracks, setTracks] = useState(historyTracks);

  const q = search.trim().toLowerCase();
  const filteredTracks = q
    ? tracks.filter((t) =>
        [t.title, t.artist, t.album].some((v) => v.toLowerCase().includes(q))
      )
    : tracks;

  return (
    <main className="history-page" aria-label="History">
      <div className="history-page__blob" aria-hidden="true" />

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
            <input
              className="history-search__input"
              type="search"
              placeholder="Cari judul, artis, atau album"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <button
            type="button"
            className="history-delete"
            onClick={() => setTracks([])}
            disabled={tracks.length === 0}
            aria-label="Hapus semua history"
            title={tracks.length === 0 ? "History kosong" : "Hapus semua history"}
          >
            <FiTrash2 aria-hidden="true" />
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

          {filteredTracks.length === 0 ? (
            <div className="history-empty" role="status">
              {tracks.length === 0 ? "Belum ada history." : "Tidak ada hasil yang cocok."}
            </div>
          ) : (
            <ul className="history-table__rows">
              {filteredTracks.map((track, index) => (
                <li key={track.id} className="history-row">
                  <div className="history-row__index">{index + 1}</div>
                  <div className="history-row__title" title={track.title}>
                    {track.title}
                  </div>
                  <div className="history-row__cell" title={track.artist}>
                    {track.artist}
                  </div>
                  <div className="history-row__cell" title={track.album}>
                    {track.album}
                  </div>
                  <div className="history-row__cell history-row__playedAt">{track.playedAt}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default HistoryPage;

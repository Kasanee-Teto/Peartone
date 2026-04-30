import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/LikedSongsPage.css";

const likedSongs = [
  { id: 1, title: "Night Runner", artist: "Arka Lane", album: "After Dark", duration: "3:21" },
  { id: 2, title: "Static Heart", artist: "Nova Echo", album: "City Lights", duration: "4:02" },
  { id: 3, title: "Soft Gravity", artist: "Luna Vale", album: "Sunset Tapes", duration: "3:48" },
  { id: 4, title: "Move Fast", artist: "Rift Boys", album: "Throttle", duration: "2:55" },
  { id: 5, title: "Bloom", artist: "Mira Sol", album: "Orbit", duration: "4:16" },
  { id: 6, title: "Blue Skyline", artist: "Velvet Peak", album: "Blue Hour", duration: "3:37" },
];

const LikedSongsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const userName = "kindy";
  const totalLikedSongs = 76;

  return (
    <main className="liked liked--fullbleed">
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

      <section className="liked__hero">
        <div className="liked__heroInner">
          <div className="liked__header">
            <div className="liked__cover" aria-hidden="true">
              <img src="/like.png" alt="Disukai" className="liked__coverImg" />
            </div>

            <div className="liked__meta">
              <p className="liked__label">Playlist</p>
              <h1 className="liked__title">Lagu yang Disukai</h1>
              <p className="liked__subtitle">
                <strong>{userName}</strong>
                <span className="liked__dot">•</span>
                <span>{totalLikedSongs} lagu</span>
              </p>
            </div>
          </div>

          <div className="liked__controlsRow">
            <button
              type="button"
              onClick={() => setIsPlaying((v) => !v)}
              className="liked__play"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button type="button" className="liked__iconBtn" aria-label="Shuffle">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <button type="button" className="liked__iconBtn" aria-label="Download">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section className="liked__list" aria-label="Daftar lagu yang disukai">
        <div className="liked__tableHead" role="row">
          <div role="columnheader">#</div>
          <div role="columnheader">Judul</div>
          <div role="columnheader">Artis</div>
          <div role="columnheader">Album</div>
          <div className="liked__clock" role="columnheader" aria-label="Durasi">
              <svg className="h-1 w-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v5l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
          </div>
        </div>

        <ul className="liked__rows">
          {likedSongs.map((track, index) => (
            <li key={track.id} className="liked__row">
              <div className="liked__index">{index + 1}</div>
              <div className="liked__titleCell">{track.title}</div>
              <div className="liked__cell">{track.artist}</div>
              <div className="liked__cell">{track.album}</div>
              <div className="liked__cell liked__duration">{track.duration}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default LikedSongsPage;
import { useState } from "react";
import ChartList from "../components/ChartList";
import Sidebar from "../components/Sidebar";
import PopularList from "../components/PopularList";
import PlaylistPage from "./PlaylistPage";
import useFetch from "../hooks/useFetch";

// Samakan dengan http.js Anda: base URL harus include /api
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

function normalizeTrack(t) {
  const artist =
    Array.isArray(t?.Artists) && t.Artists.length > 0
      ? t.Artists.map((a) => a?.name).filter(Boolean).join(", ")
      : t?.artist || t?.Artist?.name || "Unknown Artist";

  return {
    // field yang umum dipakai komponen card
    id: t?.id,
    title: t?.title || t?.name || "Untitled",
    artist,
    album: t?.Album?.title || t?.album || "",
    cover:
      t?.cover ||
      t?.coverUrl ||
      t?.image ||
      t?.imageUrl ||
      t?.Album?.cover ||
      t?.Album?.coverUrl ||
      "",
    duration: t?.duration || 0,

    // simpan raw supaya kalau MusicCard butuh field lain masih ada
    ...t,
  };
}

const HomePage = () => {
  const [showplaylist, setShowplaylist] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Top Charts
  const {
    data: chartsResp,
    loading: chartsLoading,
    error: chartsError,
  } = useFetch(`${API_BASE_URL}/tracks?page=1&limit=5`);

  // Popular Now (sementara ambil dari endpoint yang sama)
  const {
    data: popularResp,
    loading: popularLoading,
    error: popularError,
  } = useFetch(`${API_BASE_URL}/tracks?page=1&limit=8`);

  const chartsRaw = Array.isArray(chartsResp)
    ? chartsResp
    : chartsResp?.data ?? [];

  const popularRaw = Array.isArray(popularResp)
    ? popularResp
    : popularResp?.data ?? [];

  const charts = chartsRaw.map(normalizeTrack);
  const popular = popularRaw.map(normalizeTrack);

  if (showplaylist) {
    return <PlaylistPage onBack={() => setShowplaylist(false)} />;
  }

  return (
    <main className="home" aria-label="Halaman Utama Peartone">
      <div className="home__layout">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onHome={() => setIsSidebarOpen(false)}
          onPlaylist={() => {
            setShowplaylist(true);
            setIsSidebarOpen(false);
          }}
        />

        <button
          className={`home__sidebar-overlay ${isSidebarOpen ? "is-open" : ""}`}
          type="button"
          aria-label="Tutup menu samping"
          onClick={() => setIsSidebarOpen(false)}
        />

        <div className="home__content">
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

          <section className="home__hero" aria-label="Banner Peartone">
            <div className="home__hero-content flex flex-col justify-center items-center">
              <h1 className="home__hero-title text-center">
                Temukan Musik
                <br />
                <span className="home__hero-accent">Favoritmu</span>
              </h1>
              <p className="home__hero-subtitle w-full text-center mx-auto max-w-2xl px-4">
                Streaming musik tanpa batas. Dengarkan chart terpopuler dan temukan lagu baru setiap hari.
              </p>
              <button
                className="home__hero-cta"
                aria-label="Mulai mendengarkan"
                onClick={() => setShowplaylist(true)}
              >
                Mulai Dengarkan
              </button>
            </div>
          </section>

          <ChartList
            charts={charts}
            loading={chartsLoading}
            error={chartsError}
          />

          <PopularList
            popular={popular}
            loading={popularLoading}
            error={popularError}
          />
        </div>
      </div>
    </main>
  );
};

export default HomePage;
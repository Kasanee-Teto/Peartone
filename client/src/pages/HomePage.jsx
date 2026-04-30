import { useState } from "react";
import ChartList from "../components/ChartList";
import Sidebar from "../components/Sidebar";
import PopularList from "../components/PopularList";
import PlaylistPage from "./PlaylistPage";
import useFetch from "../hooks/useFetch";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const HomePage = () => {
  const [showplaylist, setShowplaylist] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    data: chartsData,
    loading: chartsLoading,
    error: chartsError,
  } = useFetch(`${BASE_URL}/charts`);

  const {
    data: popularData,
    loading: popularLoading,
    error: popularError,
  } = useFetch(`${BASE_URL}/popular`);

  const charts = Array.isArray(chartsData)
    ? chartsData
    : chartsData?.data ?? [];

  const popular = Array.isArray(popularData)
    ? popularData
    : popularData?.data ?? [];

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
                Temukan Musik<br />
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

          <ChartList charts={charts} loading={chartsLoading} error={chartsError} />
          <PopularList popular={popular} loading={popularLoading} error={popularError} />
        </div>
      </div>
    </main>
  );
};

export default HomePage;
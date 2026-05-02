import { useState, useMemo, useCallback } from "react";
import ChartList from "../components/ChartList";
import Sidebar from "../components/Sidebar";
import PopularList from "../components/PopularList";
import PlaylistPage from "./PlaylistPage";
import SearchBar from "../components/SearchBar.jsx";
import SearchResults from "../components/SearchResults.jsx";
import { useFetch } from "../hooks/useFetch";
import { tracksApi } from "../api/tracks.js";

function normalizeTrack(t) {
  const artist =
    Array.isArray(t?.Artists) && t.Artists.length > 0
      ? t.Artists.map((a) => a?.name).filter(Boolean).join(", ")
      : t?.artist || t?.Artist?.name || "Unknown Artist";

  return {
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
    ...t,
  };
}

const HomePage = () => {
  const [showplaylist, setShowplaylist] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ── Search state ──
  const [searchQuery, setSearchQuery]   = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError]   = useState("");
  const isSearching = searchQuery.length > 0;

  const {
    data: chartsResp,
    loading: chartsLoading,
    error: chartsError,
  } = useFetch("/tracks?page=1&limit=5");

  const {
    data: popularResp,
    loading: popularLoading,
    error: popularError,
  } = useFetch("/tracks?page=1&limit=8");

  const chartsRaw = useMemo(() => {
    if (Array.isArray(chartsResp)) return chartsResp;
    if (Array.isArray(chartsResp?.data)) return chartsResp.data;
    return [];
  }, [chartsResp]);

  const popularRaw = useMemo(() => {
    if (Array.isArray(popularResp)) return popularResp;
    if (Array.isArray(popularResp?.data)) return popularResp.data;
    return [];
  }, [popularResp]);

  const charts = useMemo(() => chartsRaw.map(normalizeTrack), [chartsRaw]);
  const popular = useMemo(() => popularRaw.map(normalizeTrack), [popularRaw]);

  // ── Handler search ──
  const handleSearch = useCallback(async (q) => {
    setSearchQuery(q);
    setSearchLoading(true);
    setSearchError("");
    setSearchResults([]);

    try {
      const res = await tracksApi.list({ q, page: 1, limit: 20 });
      // tracksApi.list pakai httpRaw jadi res bisa { data: [...] } atau [...]
      const items = Array.isArray(res) ? res : res?.data || [];
      setSearchResults(items);
    } catch (err) {
      setSearchError(err?.message || "Pencarian gagal");
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchError("");
  }, []);

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
            <div className="home__hero-content flex flex-col justify-center items-center gap-6">
              <h1 className="home__hero-title text-center">
                Temukan Musik
                <br />
                <span className="home__hero-accent">Favoritmu</span>
              </h1>
              <p className="home__hero-subtitle w-full text-center mx-auto max-w-2xl px-4">
                Streaming musik tanpa batas. Dengarkan chart terpopuler dan
                temukan lagu baru setiap hari.
              </p>

              <div className="w-full max-w-xl px-4">
                <SearchBar
                  onSearch={handleSearch}
                  onClear={handleClearSearch}
                />
              </div>

              {!isSearching && (
                <button
                  className="home__hero-cta"
                  aria-label="Mulai mendengarkan"
                  onClick={() => setShowplaylist(true)}
                >
                  Mulai Dengarkan
                </button>
              )}
            </div>
          </section>


          {isSearching ? (
            <div className="px-4 pb-8 max-w-3xl mx-auto w-full">
              <SearchResults
                results={searchResults}
                loading={searchLoading}
                error={searchError}
                query={searchQuery}
              />
            </div>
          ) : (
            <>
              <ChartList charts={charts} loading={chartsLoading} error={chartsError} />
              <PopularList
                popular={popular}
                loading={popularLoading}
                error={popularError}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default HomePage;

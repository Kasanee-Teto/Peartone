import { useState, useMemo, useCallback } from "react";
import ChartList from "../components/ChartList";
import PopularList from "../components/PopularList";
import PlaylistPage from "./PlaylistPage";
import SearchBar from "../components/Searchbar.jsx";
import SearchResults from "../components/SearchResults.jsx";
import { useFetch } from "../hooks/useFetch";
import { tracksApi } from "../api/tracks.js";
import { handleLogout } from "../api/client.js";
import SidebarSetup from "../components/SidebarSetup.jsx";
import { normalizeTrack } from "../utils/playerBus.js";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showplaylist, setShowplaylist] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [searchQuery, setSearchQuery]   = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError]   = useState("");
  const isSearching = searchQuery.length > 0;

  const {
    data: chartsResp,
    loading: chartsLoading,
    error: chartsError,
  } = useFetch("/tracks?page=1&limit=8");

  const {
    data: popularResp,
    loading: popularLoading,
    error: popularError,
  } = useFetch("/tracks?page=1&limit=4");

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

  const handleSearch = useCallback(async (q) => {
    setSearchQuery(q);
    if (searchResults.length === 0) {
      setSearchLoading(true);
    }
    setSearchError("");

    try {
      const res = await tracksApi.list({ q, page: 1, limit: 20 });
      const items = Array.isArray(res) ? res : res?.data || [];
      setSearchResults(items);
    } catch (err) {
      setSearchError(err?.message || "Failed to search");
    } finally {
      setSearchLoading(false);
    }
  }, [searchResults.length]);

  const handleClearSearch = useCallback(() => {
    searchQuery && setSearchQuery("");
    searchResults.length && setSearchResults([]);
    searchError && setSearchError("");
  }, [searchQuery, searchResults, searchError]);

  if (showplaylist) {
    return <PlaylistPage onBack={() => setShowplaylist(false)} />;
  }

  return (
    <main 
      className="w-full min-h-screen bg-[#0d0d0f] text-[#8a8a99] relative overflow-hidden flex" 
      aria-label="Peartone Home Page"
    >
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(124,106,247,0.15)_0%,transparent_70%)] pointer-events-none z-0 mix-blend-screen -translate-x-1/4 -translate-y-1/4" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(200,245,96,0.08)_0%,transparent_70%)] pointer-events-none z-0 mix-blend-screen translate-x-1/4 -translate-y-1/4" />

      <SidebarSetup 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        handleLogout={() => handleLogout(setIsSidebarOpen, navigate)} 
        showPlaylist={() => {setShowplaylist(false)}} 
      />

      <div className="flex-1 w-full min-w-0 relative z-10 flex flex-col h-screen overflow-y-auto scrollbar-hidden">
        <header className="w-full px-6 py-4 flex items-center justify-between md:hidden border-b border-white/5 bg-[#0d0d0f]/80 backdrop-blur-md sticky top-0 z-50">
          <span className="font-display font-extrabold text-white text-xl tracking-tight">Peartone</span>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 text-white bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            ☰
          </button>
        </header>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-12">
          
          <section className="w-full flex flex-col items-center justify-center text-center pt-4 md:pt-10 gap-6" aria-label="Peartone Banner">
            <h1 className="font-display font-extrabold text-[clamp(2.2rem,6vw,4rem)] text-white leading-[1.1] tracking-tight">
              Find your
              <br />
              <span className="text-[#c8f560] inline-block relative mt-1 pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-[#c8f560] after:to-[#7c6af7] after:rounded-full">
                Favorites!
              </span>
            </h1>
            
            <p className="text-sm md:text-base text-[#8a8a99] font-light max-w-md px-4">
              Listen to your music till your weekend COMES!
            </p>

            <div className="w-full max-w-xl mx-auto flex flex-col items-center mt-2 px-2 gap-6">
              <SearchBar
                onSearch={handleSearch}
                onClear={handleClearSearch}
              />

              {!isSearching && (
                <button
                  className="inline-flex items-center gap-2 bg-[#c8f560] text-[#0d0d0f] font-display font-bold text-sm sm:text-[0.95rem] px-8 py-3.5 border-none rounded-full cursor-pointer tracking-wide transition-all duration-200 ease-in-out hover:bg-[#a8d840] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(200,245,96,0.25)] active:translate-y-0"
                  aria-label="Start Listening"
                  onClick={() => setShowplaylist(true)}
                >
                  Start Listening
                </button>
              )}
            </div >
          </section>

          {isSearching && (
            <div className="w-full max-w-5xl mx-auto mt-2">
              <SearchResults
                results={searchResults}
                loading={searchLoading}
                error={searchError}
                query={searchQuery}
              />
            </div>
          )}
          
          {!isSearching && (
            <div className="w-full flex flex-col gap-14 mt-4">
              <ChartList charts={charts} loading={chartsLoading} error={chartsError} />
              <PopularList
                popular={popular}
                loading={popularLoading}
                error={popularError}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
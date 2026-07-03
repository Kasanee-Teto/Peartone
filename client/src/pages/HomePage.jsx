import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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

const HomePage = () => {
  const navigate = useNavigate();
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

  const handleSearch = useCallback(async (q) => {
    setSearchQuery(q);
    setSearchLoading(true);
    setSearchError("");
    setSearchResults([]);

    try {
      const res = await tracksApi.list({ q, page: 1, limit: 20 });

      const items = Array.isArray(res) ? res : res?.data || [];
      setSearchResults(items);
    } catch (err) {
      setSearchError(err?.message || "Failed to search");
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
    <main 
      className="w-full max-w-7xl mx-auto px-6 md:px-8 pb-20 flex flex-col gap-16 font-sans antialiased text-[#8a8a99]" 
      aria-label="Peartone Home Page"
    >
      <div className="grid grid-columns-1 gap-8 items-start">

        <SidebarSetup handleLogout={handleLogout} showPlaylist={() => {setShowplaylist(false)}} />

        <div className="flex flex-col gap-16 md:gap-12">

          <section className="relative pt-12 pb-9 md:pt-20 md:pb-14 overflow-hidden" aria-label="Peartone Banner">

            <div className="absolute -top-10 -left-20 w-[500px] height-[500px] bg-[radial-gradient(circle,rgba(124,106,247,0.18)_0%,transparent_70%)] pointer-events-none animate-[heroPulse_6s_ease-in-out_infinite]" />
            <div className="absolute top-0 -right-[100px] w-[350px] height-[350px] bg-[radial-gradient(circle,rgba(200,245,96,0.1)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10 w-full max-w-[640px] flex flex-col justify-center items-center gap-6 mx-auto">
              <h1 className="font-display font-extrabold text-[clamp(1.8rem,6vw,4.5rem)] text-white text-center leading-[1.05] tracking-tight">
                Find your
                <br />
                <span className="text-[#c8f560] inline-block relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-[#c8f560] after:to-[#7c6af7] after:rounded-[2px]">
                  Favorites!
                </span>
              </h1>
              <p className="text-sm md:text-[1.05rem] text-[#8a8a99] font-light w-full text-center max-w-2xl px-4">
                Listen to your musics till your weekend COMES!
              </p>

              <div className="w-full max-w-xl mx-auto flex flex-col items-center">
                <SearchBar
                  onSearch={handleSearch}
                  onClear={handleClearSearch}
                />

                {!isSearching && (
                    <button
                      className="mt-8 inline-flex items-center gap-2 bg-[#c8f560] text-[#0d0d0f] font-display font-bold text-[0.95rem] px-8 py-3.5 border-none rounded-full cursor-pointer tracking-wide transition-all duration-150 ease-in-out hover:bg-[#a8d840] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(200,245,96,0.3)] active:translate-y-0"
                      aria-label="Start Listening"
                      onClick={() => setShowplaylist(true)}
                    >
                      Start Listening
                    </button>
                )}

                {isSearching && (
                  <div className="w-full mt-1.5">
                    <SearchResults
                      results={searchResults}
                      loading={searchLoading}
                      error={searchError}
                      query={searchQuery}
                    />
                  </div>
                )}
              </div>

              {!isSearching && (
                <div className="w-full mt-12 flex flex-col gap-12">
                  <ChartList charts={charts} loading={chartsLoading} error={chartsError} />
                  <PopularList
                    popular={popular}
                    loading={popularLoading}
                    error={popularError}
                  />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
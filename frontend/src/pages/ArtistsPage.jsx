import { useMemo, useState } from "react";
import { FiArrowRight, FiStar } from "react-icons/fi";
import { useFetch } from "../hooks/useFetch.js";
import SidebarSetup from "../components/SidebarSetup.jsx";
import { handleLogout,buildCoverUrl } from "../api/client.js";
import { useNavigate } from "react-router-dom";

const ArtistsPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: artistsResp, loading, error } = useFetch("/artists");

  const artists = Array.isArray(artistsResp) ? artistsResp : artistsResp?.data || [];
  const featuredArtists = useMemo(() => artists, [artists]);
  const spotlightArtist = featuredArtists[0] || null;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0d0d0f] text-white">
     
     <SidebarSetup handleLogout={() => handleLogout(setIsSidebarOpen, navigate)} />

      <div className="relative z-10 max-w-[1024px] mx-auto px-6 pt-12 pb-24">
        
        <header className="flex items-start justify-between gap-4 border-b border-white/5 pb-7 mb-8">
          <div>
            <p className="m-0 mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
              Music Collection
            </p>
            <h1 className="m-0 text-5xl sm:text-[56px] font-black tracking-tight leading-none">
              Artists
            </h1>
            <p className="mt-3 max-w-[340px] text-xs sm:text-sm text-white/40 leading-relaxed">
              Find your famous artists here!
            </p>
          </div>
          <span className="hidden lg:inline-block shrink-0 mt-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-[#c8f560] bg-[#c8f560]/10 border border-[#c8f560]/20">
            Popular
          </span>
        </header>

        <div className="flex items-center justify-between mb-5">
          <h2 className="m-0 text-lg font-bold tracking-tight">
            Featured Artists
          </h2>
          <button 
            type="button" 
            className="bg-transparent border-none cursor-pointer text-xs font-semibold uppercase tracking-wider text-white/35 transition-colors duration-150 hover:text-white"
          >
            See All
          </button>
        </div>

        {!loading && !error && spotlightArtist ? (
          <section className="mb-5" aria-label="Featured artist spotlight">
            <div className="grid grid-cols-1 md:grid-cols-[96px_minmax(0,1fr)_auto] gap-4 items-center p-4 md:p-[18px] border border-white/[0.08] rounded-3xl bg-gradient-to-br from-[#7c6af7]/15 to-[#c8f560]/5 shadow-[0_16px_40px_rgba(0,0,0,0.28)] md:justify-items-stretch justify-items-start">

              <div className="w-24 h-24 rounded-3xl overflow-hidden bg-white/5 grid place-items-center text-white text-3xl font-black tracking-tighter">
                {spotlightArtist.imageUrl ? (
                  <img src={buildCoverUrl(spotlightArtist.imageUrl)} alt={spotlightArtist.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{(spotlightArtist.name || "").slice(0, 2).toUpperCase()}</span>
                )}
              </div>

              <div className="min-w-0">
                <p className="inline-flex items-center gap-2 m-0 mb-2 text-[#c8f560] text-[11px] font-bold uppercase tracking-[0.14em]">
                  <FiStar /> Featured Pick
                </p>
                <h3 className="m-0 text-3xl font-black tracking-tight">{spotlightArtist.name}</h3>
                <p className="mt-2 max-w-[56ch] text-white/70 text-xs sm:text-sm leading-relaxed">
                  {spotlightArtist.bio || "Featured artist pilihan backend hari ini."}
                </p>
              </div>

              <button 
                type="button" 
                className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-[#c8f560]/25 rounded-full bg-[#c8f560]/10 text-[#c8f560] font-bold cursor-pointer transition-all duration-160 ease-out hover:-translate-y-0.5 hover:bg-[#c8f560]/15 w-full md:w-auto"
              >
                Explore <FiArrowRight />
              </button>
            </div>
          </section>
        ) : null}

        {loading ? (
          <div className="py-12 text-center text-sm text-white/40">Loading artists…</div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-300">Failed to load artists: {error}</div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 list-none p-0 m-0">
            {featuredArtists.map((artist) => (
              <li key={artist.id}>
                <article className="group relative rounded-xl bg-[#161618] shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-all duration-250 ease-out hover:-translate-y-1 overflow-hidden">
                  
                  <div 
                    className="relative w-full h-22 overflow-hidden"
                    style={{ 
                        background: artist.imageUrl
                          ? `url(${buildCoverUrl(artist.imageUrl)}) center/cover no-repeat`
                          : "linear-gradient(135deg, #7c6af7 0%, #c8f560 100%)"
                    }}
                  >
                    <div 
                      className="absolute inset-0 opacity-[0.07] pointer-events-none"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
                    />
                  </div>

                  <div className="p-[28px_14px_14px]">
                    <h3 className="m-0 text-sm font-bold text-white truncate leading-snug">
                      {artist.name}
                    </h3>
                  
                    <p className="mt-1 text-[11px] text-white/40 line-clamp-1">
                      {artist.bio || "Featured artist dari backend"}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-[2px] opacity-0 scale-x-[0.4] transition-all duration-400 ease-out group-hover:opacity-100 group-hover:scale-x-100 bg-gradient-to-r from-[#7c6af7] to-[#c8f560]" />
                </article>
              </li>
            ))}
          </ul>
        )}

      </div>
    </main>
  );
};

export default ArtistsPage;
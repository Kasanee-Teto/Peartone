import { useState, useCallback } from "react";
import { FiPlay, FiMusic, FiLoader } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import { useFetch } from "../hooks/useFetch";
import { albumsApi } from "../api/album.js";
import { emitPlayTrack, normalizePlayableTrack } from "../utils/playerBus.js";
import { authApi } from "../api/auth";

const STORAGE_BASE = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
  : "http://localhost:3000";

function buildCoverUrl(coverUrl) {
  if (!coverUrl) return null;
  if (coverUrl.startsWith("http")) return coverUrl;
  return `${STORAGE_BASE}${coverUrl}`;
}

const AlbumCard = ({ album }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const coverUrl = buildCoverUrl(album.coverUrl);
  const year = album.releaseDate ? new Date(album.releaseDate).getFullYear() : "";
  const trackCount = (album.Tracks && album.Tracks.length > 0) ? album.Tracks.length : (album.trackNumbers || 0);

  const handlePlay = useCallback(async (e) => {

    e.stopPropagation(); 
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await albumsApi.getById(album.id);
      const albumDetail = response?.data?.data || response?.data || response;
      const tracks = albumDetail?.Tracks || albumDetail?.tracks || [];

      if (!tracks.length) {
        setError("This album doesn't have any tracks.");
        return;
      }

      const normalized = tracks.map((t) =>
        normalizePlayableTrack({
          ...t,
          artist: t.Artists?.[0]?.name || album.Artist?.name || "Unknown Artist",
          album: albumDetail.title,
        })
      );

      window.dispatchEvent(new Event("pt:clear-queue"));
      emitPlayTrack(normalized[0]);

      for (let i = 1; i < normalized.length; i++) {
        const track = normalized[i];
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("pt:add-to-queue", { detail: track })
          );
        }, i * 20);
      }
    } catch (err) {
      console.error("AlbumCard play error:", err);
      setError("Failed to load tracks.");
    } finally {
      setLoading(false);
    }
  }, [album, loading]);

  return (
    <article className="group relative cursor-pointer rounded-xl bg-[#161618] shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-all duration-250 ease-out hover:-translate-y-1 overflow-hidden">
      <div className="relative w-full pb-[100%] overflow-hidden bg-gradient-to-br from-[#3b2fa8] to-[#1a1a2e]">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={album.title}
            className="absolute inset-0 w-full height-full object-cover block transition-transform duration-300 ease-out group-hover:scale-105"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/25 bg-gradient-to-br from-[#3b2fa8] to-[#1a1a2e]">
            <FiMusic size={26} />
          </div>
        )}

        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none z-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />

        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-250 ease-out pointer-events-none z-20 group-hover:opacity-100" />
]
        <button
          type="button"
          aria-label={`Play ${album.title}`}
          className={`absolute bottom-3 right-3 w-11 h-11 rounded-full border-none bg-[#c8f560] text-[#0d0d0f] flex items-center justify-center cursor-pointer opacity-0 translate-y-2.5 scale-[0.85] transition-all duration-200 ease-out shadow-[0_8px_24px_rgba(200,245,96,0.45)] z-30 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 hover:!scale-106 active:!scale-95 disabled:cursor-not-allowed ${
            loading ? "opacity-100 translate-y-0 scale-100" : ""
          }`}
          onClick={handlePlay}
          disabled={loading}
        >
          {loading ? (
            <FiLoader size={18} className="animate-spin" />
          ) : (
            <FiPlay size={18} fill="currentColor" className="ml-0.5" />
          )}
        </button>
      </div>

      <div className="p-[12px_14px_14px]">
        <div className="min-w-0">
          <h3 className="m-0 text-sm font-semibold text-white truncate leading-snug" title={album.title}>
            {album.title}
          </h3>
          <p className="mt-0.5 text-xs text-white/50 truncate">
            {album.Artist?.name || "Unknown"}
          </p>
        </div>
        
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-white/30">
          {year && <span>{year}</span>}
          {year && <span className="w-[3px] h-[3px] rounded-full bg-white/25 shrink-0" />}
          <span>{trackCount} tracks</span>
        </div>

        {error && (
          <p className="mt-2 text-xs text-red-300 font-medium">{error}</p>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#7c6af7] to-[#c8f560] opacity-0 scale-x-[0.4] transition-all duration-400 ease-out group-hover:opacity-100 group-hover:scale-x-100" />
    </article>
  );
};

const AlbumsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: albumsResp, loading, error } = useFetch("/albums");

  const albums = Array.isArray(albumsResp)
    ? albumsResp
    : albumsResp?.data || [];

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsSidebarOpen(false);
      Navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0d0d0f] text-white">

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-16 -left-32 w-[500px] h-[500px] rounded-full bg-[#7c6af7] opacity-[0.07] blur-[140px]" />
        <div className="absolute -bottom-20 right-0 w-[384px] h-[384px] rounded-full bg-[#c8f560] opacity-[0.06] blur-[140px]" />
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <button
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden ${
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        type="button"
        aria-label="Tutup menu samping"
        onClick={() => setIsSidebarOpen(false)}
      />

      <button
        className="fixed top-4 left-4 z-40 p-2 bg-[#161618] rounded-md text-xl md:hidden"
        type="button"
        aria-label="Buka menu samping"
        aria-expanded={isSidebarOpen}
        onClick={() => setIsSidebarOpen(true)}
      >
        ≡
      </button>

      <div className="relative z-10 max-w-[1024px] mx-auto px-6 pt-12 pb-24">

        <header className="flex items-start justify-between gap-4 border-b border-white/5 pb-7 mb-8">
          <div>
            <p className="m-0 mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
              Music Collection
            </p>
            <h1 className="m-0 text-5xl sm:text-[56px] font-black line-height-1 tracking-tight">
              Albums
            </h1>
            <p className="mt-3 max-w-[340px] text-xs sm:text-sm text-white/40 leading-relaxed">
              Best Album Collections to fill your mood!
            </p>
          </div>
          <span className="shrink-0 mt-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-[#c8f560] bg-[#c8f560]/10 border border-[#c8f560]/20">
            Fresh
          </span>
        </header>

        <div className="flex items-center justify-between mb-5">
          <h2 className="m-0 text-lg font-bold tracking-tight">
            Latest Albums
          </h2>
          <button 
            type="button" 
            className="bg-transparent border-none cursor-pointer text-xs font-semibold uppercase tracking-wider text-white/35 transition-colors duration-150 hover:text-white"
          >
            See All
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-white/40">Load Albums…</div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-300">Failed to load albums: {error}</div>
        ) : albums.length === 0 ? (
          <div className="py-12 text-center text-sm text-white/40">No album.</div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 list-none p-0 m-0">
            {albums.map((album) => (
              <li key={album.id}>
                <AlbumCard album={album} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default AlbumsPage;
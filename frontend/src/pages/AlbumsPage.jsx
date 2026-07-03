import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { handleLogout } from "../api/client.js";
import SidebarSetup from "../components/SidebarSetup.jsx";
import AlbumCard from "../components/AlbumsCard.jsx";

const AlbumsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: albumsResp, loading, error } = useFetch("/albums");

  const albums = Array.isArray(albumsResp)
    ? albumsResp
    : albumsResp?.data || [];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0d0d0f] text-white">

    <SidebarSetup handleLogout={handleLogout} />

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
          <span className="hidden lg:inline-block shrink-0 mt-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-[#c8f560] bg-[#c8f560]/10 border border-[#c8f560]/20">
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
              <li key={album.id} className="h-full flex flex-col">
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
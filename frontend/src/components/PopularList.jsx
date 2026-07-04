import MusicCard from "./MusicCard.jsx";
import { NavLink } from "react-router-dom";

const PopularList = ({ popular = [], loading, error }) => {
  if (loading) {
    return (
      <section aria-label="Popular Now">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Popular Now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5" aria-busy="true" aria-live="polite">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[380px] bg-white/5 rounded-xl animate-pulse" aria-hidden="true" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section aria-label="Popular Now">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Popular Now</h2>
        <div className="mt-4 text-red-400" role="alert">
          ⚠️ Failed to load popular track: {error}
        </div>
      </section>
    );
  }

  if (popular.length === 0) {
    return (
      <section aria-label="Popular Now">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Popular Now</h2>
        <p className="text-white/50 mt-4">No Popular Music Available.</p>
      </section>
    );
  }

  return (
    <section aria-label="Popular Now">
      <div className="flex justify-between items-center mb-6 w-full">
          <h2 className="text-2xl font-bold text-white tracking-tight">Popular Now</h2>
          <NavLink to="/tracks" className="text-sm font-medium text-white/60 transition-colors hover:text-[#c8f560]" aria-label="See all popular tracks">
            See All →
          </NavLink>
        </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 w-full" role="list" aria-label="Daftar lagu populer">
        {popular.map((track, index) => (
          <div key={track?.id ?? index} className="relative group w-full flex flex-col">
            <div className="absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 border border-white/10 text-xs font-bold text-white backdrop-blur-md shadow-md">
              #{index + 1}
            </div>
            <MusicCard track={track} variant="popular" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularList;
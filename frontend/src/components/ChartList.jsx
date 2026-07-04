import MusicCard from "./MusicCard.jsx";
import { NavLink } from "react-router-dom";

const ChartList = ({ charts = [], loading, error }) => {
  if (loading) {
    return (
      <section aria-label="Top Charts">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Top Charts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5" aria-busy="true" aria-live="polite">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[380px] bg-white/5 rounded-xl animate-pulse" aria-hidden="true" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section aria-label="Top Charts">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Top Charts</h2>
        <div className="mt-4 text-red-400" role="alert">
          ⚠️ Failed to load charts: {error}
        </div>
      </section>
    );
  }

  if (charts.length === 0) {
    return (
      <section aria-label="Top Charts">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Top Charts</h2>
        <p className="text-white/50 mt-4">No music charts currently available.</p>
      </section>
    );
  }

  return (
    <section aria-label="Top Charts">
      <div className="flex justify-between items-center mb-6 w-full">
        <h2 className="text-2xl font-bold text-white tracking-tight">Top Charts</h2>
        <NavLink to="/charts" className="text-sm font-medium text-white/60 transition-colors hover:text-[#c8f560]" aria-label="See all charts">
          See All →
        </NavLink>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
        {charts.map((track, index) => (
          <div key={track?.id ?? index} className="relative group w-full flex flex-col">
            <div className="absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 border border-white/10 text-xs font-bold text-white backdrop-blur-md shadow-md">
              #{index + 1}
            </div>
            <MusicCard track={track} variant="chart" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChartList;
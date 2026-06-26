import { FiMusic, FiPlay } from "react-icons/fi";
import { emitPlayTrack } from "../utils/playerBus.js";

function formatDuration(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function normalizeResult(t) {
  const artist =
    Array.isArray(t?.Artists) && t.Artists.length > 0
      ? t.Artists.map((a) => a?.name).filter(Boolean).join(", ")
      : t?.artist || t?.Artist?.name || "Unknown Artist";

  return {
    id: t?.id,
    title: t?.title || t?.name || "Untitled",
    artist,
    album: t?.Album?.title || t?.album || "",
    duration: t?.duration || 0,
    cover: t?.cover || t?.coverUrl || t?.Album?.cover || "",
    ...t,
  };
}

const SearchResults = ({ results, loading, error, query }) => {
  if (loading) {
    return (
      <div className="mx-auto mt-4 w-full max-w-[520px] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="flex flex-col gap-3 p-3 px-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-white/10" />
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="h-2.5 animate-pulse rounded bg-white/10" />
                <div className="h-2.5 w-3/5 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-4 w-full max-w-[520px] rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
        Failed to load: {error}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="mx-auto mt-4 w-full max-w-[520px] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="px-4 py-8 text-center">
          <FiMusic size={28} className="mx-auto mb-3 text-white/20" />
          <p className="text-sm text-white/40">
            No tracks found for <span className="text-white/60">"{query}"</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-4 w-full max-w-[520px] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="border-b border-white/10 px-4 py-2.5">
        <p className="m-0 text-[11px] font-bold uppercase tracking-[0.12em] text-white/35">
          {results.length} results to "{query}"
        </p>
      </div>

      <ul className="m-0 list-none p-0" role="list">
        {results.map((raw, index) => {
          const track = normalizeResult(raw);
          return (
            <li
              key={track.id || index}
              className="group flex cursor-pointer items-center gap-3 border-b border-white/5 px-4 py-2.5 last:border-b-0 hover:bg-white/10"
              onClick={() => emitPlayTrack(track)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && emitPlayTrack(track)}
              aria-label={`Play ${track.title} from ${track.artist}`}
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#7c6af733] text-[#a89ef7]">
                {track.cover ? (
                  <img src={track.cover} alt={track.title} className="h-full w-full object-cover" />
                ) : (
                  <FiMusic size={16} />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition group-hover:opacity-100">
                  <FiPlay size={14} fill="white" color="white" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="m-0 truncate text-sm text-white">{track.title}</p>
                <p className="m-0 truncate text-[11px] text-white/45">
                  {track.artist}
                  {track.album && <span className="text-white/25"> · {track.album}</span>}
                </p>
              </div>

              <span className="shrink-0 text-[11px] text-white/35">
                {formatDuration(track.duration)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchResults;
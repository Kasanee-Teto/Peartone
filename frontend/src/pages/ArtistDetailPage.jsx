import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlay, FiDisc, FiClock } from "react-icons/fi";
import { useFetch } from "../hooks/useFetch.js";
import { buildCoverUrl } from "../api/client.js";
import { formatDuration } from "../utils/format.js";

const ArtistDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: artistResp, loading, error } = useFetch(`/artists/${id}`);
  const artist = artistResp?.data || artistResp;

  const tracks = artist?.Tracks || [];
  const albums = artist?.Albums || [];

  return (
    <main className="relative min-h-screen bg-[#0d0d0f] text-white px-6 pt-8 pb-24 max-w-[1024px] mx-auto">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40 hover:text-white transition-colors mb-8"
      >
        <FiArrowLeft /> Back
      </button>

      {loading ? (
        <div className="py-12 text-center text-sm text-white/40">Loading artist…</div>
      ) : error ? (
        <div className="py-12 text-center text-sm text-red-300">Failed to load artist: {error}</div>
      ) : artist ? (
        <div className="space-y-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 border-b border-white/5 pb-10">
            <div className="w-36 h-36 rounded-3xl overflow-hidden bg-white/5 grid place-items-center text-3xl font-black shrink-0 shadow-xl">
              {artist.imageUrl ? (
                <img src={buildCoverUrl(artist.imageUrl)} alt={artist.name} className="w-full h-full object-cover" />
              ) : (
                <span>{(artist.name || "").slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8f560]">Artist Profile</span>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-1 mb-3 truncate">{artist.name}</h1>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-[60ch]">
                {artist.bio || "No biography available yet."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold tracking-tight">Tracks</h2>
              {tracks.length === 0 ? (
                <p className="text-xs text-white/30 italic">No tracks cataloged for this artist.</p>
              ) : (
                <div className="space-y-1">
                  {tracks.map((track, index) => (
                    <div 
                      key={track.id}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="w-4 text-xs font-semibold text-white/30 text-center group-hover:hidden">
                          {index + 1}
                        </span>
                        <FiPlay className="w-4 h-4 text-[#c8f560] hidden group-hover:block" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate text-white group-hover:text-[#c8f560] transition-colors">
                            {track.title}
                          </p>
                          <p className="text-[11px] text-white/40 mt-0.5">
                            {track.listeners || 0} plays {track.TrackArtists?.role && `• ${track.TrackArtists.role}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <FiClock className="text-white/20" />
                        <span>{formatDuration(track) || "--:--"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold tracking-tight">Albums</h2>
              {albums.length === 0 ? (
                <p className="text-xs text-white/30 italic">No albums listed.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {albums.map((album) => (
                    <div 
                      key={album.id}
                      className="flex items-center gap-4 p-3 rounded-xl bg-[#161618] border border-white/[0.03] hover:border-white/10 transition-all duration-200 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 grid place-items-center shrink-0">
                        {album.coverUrl ? (
                          <img src={buildCoverUrl(album.coverUrl)} alt={album.title} className="w-full h-full object-cover" />
                        ) : (
                          <FiDisc className="w-5 h-5 text-[#c8f560]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate text-white">{album.title}</p>
                        <p className="text-xs text-white/40 mt-0.5">
                          {album.releaseDate ? album.releaseDate.split("-")[0] : "N/A"} • {album.trackNumbers || 0} Songs
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-sm text-white/40">Artist not found.</div>
      )}
    </main>
  );
};

export default ArtistDetailPage;
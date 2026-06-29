import { useCallback, useEffect, useState } from "react";
import { FiHeart, FiX, FiLoader, FiPlay } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import { likesApi } from "../api/likes.js";
import { emitLikesChanged, onLikesChanged } from "../utils/likeBus.js";
import { emitPlayTrack, normalizePlayableTrack } from "../utils/playerBus.js";
import { authApi } from "../api/auth.js";
import { useNavigate } from "react-router-dom";

const LikedSongsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("pt_user") || "null") || {};

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsSidebarOpen(false);
      navigate("/login"); 
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleSufflePlay = useCallback((e) => {
    e.stopPropagation(); 
    if (loading || tracks.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const suffledTracks = [...tracks].sort(() => Math.random() - 0.5);

      const normalized = suffledTracks.map((t) => 
        normalizePlayableTrack({
          ...t,
          artist: t.Artists?.[0]?.name || t.Track?.Artists?.[0]?.name || "Unknown Artist",
          album: t.title,
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
    } catch (error) {
      console.error("LikedSongs play error:", error);
      setError("Failed to load tracks.");
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    let active = true;

    const loadLikedSongs = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await likesApi.list();
        const items = Array.isArray(response) ? response : response?.data || [];
        if (active) setTracks(items);
      } catch (err) {
        if (active) setError(err.message || "Invalid or expired token");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadLikedSongs();
    const cleanup = onLikesChanged(loadLikedSongs);

    return () => {
      active = false;
      cleanup();
    };
  }, []);

  const handleUnlike = async (trackId) => {
    const normalizedTrackId = String(trackId || "").trim();
    if (!normalizedTrackId) return;

    try {
      setRemovingId(normalizedTrackId);
      setTracks((current) => current.filter((item) => String(item.id || item.trackId || item.Track?.id || "").trim() !== normalizedTrackId));
      await likesApi.unlike(normalizedTrackId);
      emitLikesChanged();
      window.dispatchEvent(
        new CustomEvent("pt:remove-from-queue", { detail: { trackId: normalizedTrackId } })
      );
    } catch (err) {
      window.alert(err.message || "Failed to remove like");
      const response = await likesApi.list();
      setTracks(Array.isArray(response) ? response : response?.data || []);
    } finally {
      setRemovingId("");
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white overflow-x-hidden overflow-y-auto font-sans antialiased">
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
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 backdrop-blur-sm ${
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        type="button"
        aria-label="Close Sidebar"
        onClick={() => setIsSidebarOpen(false)}
      />

      <button
        className="fixed left-6 top-6 z-50 inline-flex items-center justify-center bg-[#18181c] text-[#c8f560] border border-white/5 rounded-xl h-11 w-11 shadow-lg hover:bg-[#c8f560] hover:text-[#0d0d0f] transition-all duration-200 active:scale-95"
        type="button"
        aria-label="Open Sidebar"
        aria-expanded={isSidebarOpen}
        onClick={() => setIsSidebarOpen(true)}
      >
        ≡
      </button>

      <section className="relative border-b border-white/[0.06] bg-gradient-to-b from-[#0c3e2f] via-[#09221a] to-[#0d0d0f] px-6 lg:px-12 pt-20 pb-8">
        <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_80%_0%,rgba(200,245,96,0.12),transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 items-center sm:items-end text-center sm:text-left">
          <div className="w-40 h-40 md:w-52 md:h-52 rounded-2xl bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex items-center justify-center shrink-0 border border-white/10 group relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-20 h-20 md:w-28 md:h-28 text-white drop-shadow-sm"
            >
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
          </div>

            <div className="pb-1 min-w-0">
              <p className="m-0 mb-1.5 text-xs font-bold tracking-[0.25em] uppercase text-[#10b981]">Playlist</p>
              <h1 className="m-0 font-black tracking-tight text-4xl sm:text-5xl lg:text-6xl text-white">
                Liked Tracks
              </h1>
              <p className="m-0 mt-4 text-xs sm:text-sm text-white/50 flex gap-2 items-center justify-center sm:justify-start font-medium">
                <strong className="font-semibold text-white">{user.username || "User"}</strong>
                <span className="text-white/20">•</span>
                <span className="text-[#c8f560] bg-[#c8f560]/10 px-2.5 py-0.5 rounded-full font-bold text-xs">{tracks.length} songs</span>
              </p>
            </div>
          </div>

          {tracks.length > 0 && (
            <div className="flex items-center gap-4 mt-8 justify-center sm:justify-start">
              <button 
                type="button" 
                className="px-6 py-3 rounded-full bg-[#c8f560] text-[#0d0d0f] font-bold text-sm tracking-wide inline-flex items-center gap-2 cursor-pointer shadow-[0_6px_20px_rgba(200,245,96,0.35)] transition-all duration-250 hover:scale-105 active:scale-95"
              onClick={handleSufflePlay}>
                <FiPlay fill="currentColor" className="ml-0.5" />
                <span>Shuffle Play</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="px-6 lg:px-12 py-8 max-w-[1200px] mx-auto" aria-label="List of Liked Songs">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3 text-sm text-white/40 font-medium">
            <FiLoader className="animate-spin text-[#c8f560]" size={24} />
            Loading your favorites…
          </div>
        ) : error ? (
          <div className="flex items-center gap-4 bg-red-500/5 border border-red-500/10 rounded-2xl p-4 text-red-400 text-sm max-w-xl mx-auto shadow-inner">
            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 font-bold shrink-0">!</div>
            <div className="flex-1 font-medium">Failed to load liked songs: {error}</div>
          </div>
        ) : tracks.length === 0 ? (
          <div className="py-20 text-center text-sm text-white/40 font-medium bg-white/[0.02] border border-white/[0.04] rounded-2xl max-w-md mx-auto">
            Your liked collection is currently empty.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[40px_minmax(120px,2fr)_minmax(100px,1fr)_minmax(100px,1fr)_100px] gap-4 items-center px-4 py-3 border-b border-white/[0.06] text-white/40 text-[11px] font-bold tracking-wider uppercase" role="row">
              <div role="columnheader">#</div>
              <div role="columnheader">Title</div>
              <div role="columnheader">Artist</div>
              <div role="columnheader">Album</div>
              <div className="text-right" role="columnheader">Action</div>
            </div>

            <ul className="m-0 mt-2 p-0 list-none space-y-1">
              {tracks.map((t, i) => {
                const uniqueId = String(t.id || t.trackId || t.Track?.id || "").trim();
                const isCurrentRemoving = removingId === uniqueId;

                return (
                  <li 
                    key={t.id || i} 
                    className="grid grid-cols-[40px_minmax(120px,2fr)_minmax(100px,1fr)_minmax(100px,1fr)_100px] gap-4 items-center px-4 py-3 rounded-xl text-white/80 cursor-pointer transition-all duration-200 hover:bg-white/[0.05] group"
                  >
                    <div className="text-white/30 text-xs font-semibold [font-variant-numeric:tabular-nums]">{i + 1}</div>

                    <div className="font-bold text-white text-sm truncate group-hover:text-[#c8f560] transition-colors duration-150" title={t.title || t.Track?.title}>
                      {t.title || t.Track?.title}
                    </div>

                    <div className="text-white/50 text-xs font-medium truncate" title={t.artist || (t.Artists || t.Track?.Artists || []).map?.((a) => a.name).join(", ")}>
                      {t.artist || (t.Artists || t.Track?.Artists || []).map?.((a) => a.name).join(", ")}
                    </div>

                    <div className="text-white/40 text-xs font-medium truncate" title={t.album || t.Track?.Album?.title || "—"}>
                      {t.album || t.Track?.Album?.title || "—"}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center p-2 rounded-full border border-white/10 bg-white/[0.02] text-white/60 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/10 transition-all duration-200 disabled:cursor-wait disabled:opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnlike(uniqueId);
                        }}
                        disabled={isCurrentRemoving}
                        aria-label={`Remove ${t.title || t.Track?.title || "song"}`}
                        title="Remove from liked songs"
                      >
                        {isCurrentRemoving ? (
                          <FiLoader className="animate-spin text-[#c8f560]" size={14} />
                        ) : (
                          <FiHeart fill="currentColor" className="text-[#10b981] group-hover:text-red-400 group-hover:scale-90 transition-transform" size={14} />
                        )}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>
    </main>
  );
};

export default LikedSongsPage;
import { useEffect, useState } from "react";
import { FiHeart, FiX, FiLoader } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import { likesApi } from "../api/likes.js";
import { emitLikesChanged, onLikesChanged } from "../utils/likeBus.js";
import { authApi } from "../api/auth.js";

const handleLogout = async () => {
  try {
    await authApi.logout();
    setIsSidebarOpen(false);
    navigate("/login"); 
  } catch (err) {
    console.error("Logout failed", err);
  }
};

const LikedSongsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState("");
  const user = JSON.parse(localStorage.getItem("pt_user") || "null") || {};

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
        if (active) setError(err.message || "Failed to load liked songs");
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
    } catch (err) {
      window.alert(err.message || "Failed to remove like");
      const response = await likesApi.list();
      setTracks(Array.isArray(response) ? response : response?.data || []);
    } finally {
      setRemovingId("");
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0b0f] text-white overflow-x-hidden overflow-y-auto text-left w-screen ml-[calc(50%-50vw)] font-sans antialiased">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} />

      <button 
        className={`fixed inset-0 bg-black/55 z-40 transition-opacity duration-250 ease-in-out ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} 
        type="button" 
        aria-label="Close Sidebar" 
        onClick={() => setIsSidebarOpen(false)} 
      />

      <button 
        className="fixed top-6 left-6 z-45 inline-flex items-center justify-center bg-[#222228] text-[#c8f560] border border-white/5 rounded-[9px] px-[18px] py-2.5 cursor-pointer transition-all duration-150 ease-in-out hover:bg-[#c8f560] hover:text-[#0d0d0f] hover:-translate-y-[1px]" 
        type="button" 
        aria-label="Open Sidebar" 
        aria-controls="home-sidebar" 
        aria-expanded={isSidebarOpen} 
        onClick={() => setIsSidebarOpen(true)}
      >
        ≡
      </button>

      <section className="relative border-b border-white/10 bg-gradient-to-b from-[#0f4d3a] via-[#0b2f24] to-[#0b0b0f] px-5 lg:px-14 pt-11 pb-6.5">
        <div className="absolute inset-0 bg-[radial-gradient(700px_360px_at_70%_0%,rgba(30,215,96,0.22),transparent_60%),radial-gradient(900px_500px_at_0%_10%,rgba(52,211,153,0.14),transparent_55%)] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex gap-8 items-end">
            <div className="w-40 h-40 md:w-60 md:h-60 rounded-ff-12 bg-gradient-to-br from-[#16a34a] via-[#22c55e_40%] to-[#bbf7d0] shadow-[0_18px_60px_rgba(0,0,0,0.45)] grid place-items-center shrink-0" aria-hidden="true">
              <img src="/like.png" alt="Disukai" className="w-[78px] h-[78px] object-contain filter drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]" />
            </div>

            <div className="pb-2 min-w-0">
              <p className="m-0 mb-2 text-sm font-bold tracking-[0.18em] uppercase text-white/72">Playlist</p>
              <h1 className="m-0 font-black tracking-tighter text-[35px] sm:text-[44px] lg:text-[64px] whitespace-normal sm:overflow-hidden sm:text-ellipsis">
                Liked Track
              </h1>
              <p className="m-0 mt-3.5 text-sm text-white/65 flex gap-2.5 items-center">
                <strong className="font-bold text-white/9">{user.username || "User"}</strong>
                <span className="text-white/55">•</span>
                <span>{tracks.length} tracks</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4.5 mt-5.5">
            <button type="button" className="w-11 h-11 border-none bg-transparent text-white/62 inline-flex items-center justify-center cursor-pointer transition-all duration-160 ease-in-out hover:text-white/85 hover:-translate-y-0.5" aria-label="Shuffle">Shuffle</button>
          </div>
        </div>
      </section>

      <section className="px-5 lg:px-14 pt-4.5 pb-32 bg-gradient-to-b from-black/24 to-transparent via-transparent to-65%" aria-label="List of Liked Songs">
        
        <div className="grid grid-cols-[36px_minmax(120px,1.7fr)_minmax(90px,1fr)_64px_minmax(86px,auto)] md:grid-cols-[44px_minmax(180px,5fr)_minmax(120px,3fr)_minmax(120px,3fr)_72px_minmax(110px,auto)] gap-2.5 md:gap-4 items-center px-3 md:px-4 py-3.5 border-b border-white/10 text-white/55 text-xs font-bold tracking-[0.14em] uppercase" role="row">
          <div role="columnheader">#</div>
          <div role="columnheader">Title</div>
          <div role="columnheader">Artist</div>
          <div className="hidden md:block" role="columnheader">Album</div>
          <div className="flex justify-end" role="columnheader" aria-label="Durasi">Duration</div>
          <div className="text-right" role="columnheader">Action</div>
        </div>

        {loading ? (
          <div className="text-white/65 p-6">Loading…</div>
        ) : error ? (
          <div className="flex items-center gap-3 bg-[rgba(255,92,110,0.08)] border border-[rgba(255,92,110,0.25)] rounded-ff-14 p-5 text-[#ff5c6e] text-sm mt-4">
            Failed to load liked songs: {error}
          </div>
        ) : (
          <ul className="m-0 mt-2.5 p-0 list-none">
            {tracks.map((t, i) => (
              <li 
                key={t.id || i} 
                className="grid grid-cols-[36px_minmax(120px,1.7fr)_minmax(90px,1fr)_64px_minmax(86px,auto)] md:grid-cols-[44px_minmax(180px,5fr)_minmax(120px,3fr)_minmax(120px,3fr)_72px_minmax(110px,auto)] gap-2.5 md:gap-4 items-center px-3 md:px-4 py-2.5 rounded-lg text-white/86 cursor-pointer transition-colors duration-160 ease-in-out hover:bg-white/6"
              >
                <div className="text-white/55 [font-variant-numeric:tabular-nums]">{i + 1}</div>
                <div className="font-bold text-white/92 overflow-hidden text-ellipsis whitespace-nowrap">{t.title || t.Track?.title}</div>
                <div className="text-white/55 overflow-hidden text-ellipsis whitespace-nowrap">{t.artist || (t.Artists || t.Track?.Artists || []).map?.((a) => a.name).join(", ")}</div>
                <div className="hidden md:block text-white/55 overflow-hidden text-ellipsis whitespace-nowrap">{t.album || t.Track?.Album?.title}</div>
                <div className="text-right [font-variant-numeric:tabular-nums] text-white/55">{Math.floor((t.duration || t.Track?.duration || 0) / 60)}:{String((t.duration || t.Track?.duration || 0) % 60).padStart(2, "0")}</div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 py-2 md:px-3.5 md:py-2.5 rounded-full border border-white/12 bg-white/4 text-white/80 font-bold text-xs md:text-sm cursor-pointer transition-all duration-160 ease-in-out hover:enabled:translate-y-[-1px] hover:enabled:bg-[rgba(255,72,66,0.1)] hover:enabled:border-[rgba(255,72,66,0.45)] hover:enabled:text-[#ffb4ad] disabled:cursor-wait disabled:opacity-65"
                    onClick={() => handleUnlike(t.id || t.trackId || t.Track?.id)}
                    disabled={removingId === String(t.id || t.trackId || t.Track?.id || "").trim()}
                    aria-label={`Delete from liked songs: ${t.title || t.Track?.title || "lagu"}`}
                    title="Delete from liked songs"
                  >
                    {removingId === String(t.id || t.trackId || t.Track?.id || "").trim() ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <>
                        <FiHeart fill="currentColor" />
                        <span>Unlike</span>
                        <FiX />
                      </>
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default LikedSongsPage;
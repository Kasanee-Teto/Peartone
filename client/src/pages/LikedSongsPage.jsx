import { useEffect, useState } from "react";
import { FiHeart, FiX, FiLoader, FiPlay } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import "../styles/LikedSongsPage.css";
import { likesApi } from "../api/likes.js";
import { emitLikesChanged, onLikesChanged } from "../utils/likeBus.js";
import { emitPlayTrack, normalizePlayableTrack } from "../utils/playerBus.js";

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
        if (active) setError(err.message || "Gagal memuat liked songs");
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

  const handlePlay = (t) => {
    const track = t.Track || t;
    emitPlayTrack(
      normalizePlayableTrack({
        id: track.id || t.trackId,
        trackId: track.id || t.trackId,
        title: track.title,
        artist:
          Array.isArray(track.Artists)
            ? track.Artists.map((a) => a.name).join(", ")
            : track.Artist?.name || t.artist || "",
        album: track.Album?.title || t.album || "",
        duration: track.duration || t.duration || 0,
        coverUrl: track.coverUrl || track.Album?.coverUrl || t.coverUrl || "",
      })
    );
  };

  const handleUnlike = async (trackId) => {
    const normalizedTrackId = String(trackId || "").trim();
    if (!normalizedTrackId) return;

    try {
      setRemovingId(normalizedTrackId);
      setTracks((current) => current.filter((item) => String(item.id || item.trackId || item.Track?.id || "").trim() !== normalizedTrackId));
      await likesApi.unlike(normalizedTrackId);
      emitLikesChanged();
    } catch (err) {
      window.alert(err.message || "Gagal menghapus like");
      const response = await likesApi.list();
      setTracks(Array.isArray(response) ? response : response?.data || []);
    } finally {
      setRemovingId("");
    }
  };

  return (
    <main className="liked liked--fullbleed">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={() => setIsSidebarOpen(false)} />
      <button className={`home__sidebar-overlay ${isSidebarOpen ? "is-open" : ""}`} type="button" aria-label="Tutup menu samping" onClick={() => setIsSidebarOpen(false)} />
      <button className="home__sidebar-toggle" type="button" aria-label="Buka menu samping" aria-controls="home-sidebar" aria-expanded={isSidebarOpen} onClick={() => setIsSidebarOpen(true)}>≡</button>

      <section className="liked__hero">
        <div className="liked__heroInner">
          <div className="liked__header">
            <div className="liked__cover" aria-hidden="true">
              <img src="/like.png" alt="Disukai" className="liked__coverImg" />
            </div>

            <div className="liked__meta">
              <p className="liked__label">Playlist</p>
              <h1 className="liked__title">Lagu yang Disukai</h1>
              <p className="liked__subtitle">
                <strong>{user.username || "Pengguna"}</strong>
                <span className="liked__dot">•</span>
                <span>{tracks.length} lagu</span>
              </p>
            </div>
          </div>

          <div className="liked__controlsRow">
            <button type="button" className="liked__iconBtn" aria-label="Shuffle">Shuffle</button>
          </div>
        </div>
      </section>

      <section className="liked__list" aria-label="Daftar lagu yang disukai">
        <div className="liked__tableHead" role="row">
          <div role="columnheader">#</div>
          <div role="columnheader">Judul</div>
          <div role="columnheader">Artis</div>
          <div role="columnheader">Album</div>
          <div className="liked__clock" role="columnheader" aria-label="Durasi">Durasi</div>
        </div>

        {loading ? (
          <div>Loading…</div>
        ) : error ? (
          <div className="error-state">Gagal memuat liked songs: {error}</div>
        ) : (
          <ul className="liked__rows">
            {tracks.map((t, i) => (
              <li key={t.id || i} className="liked__row">
                <div className="liked__index">{i + 1}</div>
                <div className="liked__titleCell">
                  <button
                    type="button"
                    className="liked__playBtn"
                    onClick={() => handlePlay(t)}
                    aria-label={`Putar ${t.title || t.Track?.title || "lagu"}`}
                    title="Putar"
                    style={{ background: "transparent", border: "none", cursor: "pointer", color: "#c8f560", padding: "4px", display: "inline-flex", alignItems: "center", marginRight: "8px" }}
                  >
                    <FiPlay size={13} fill="currentColor" />
                  </button>
                  {t.title || t.Track?.title}
                </div>
                <div className="liked__cell">{t.artist || (t.Artists || t.Track?.Artists || []).map?.((a) => a.name).join(", ")}</div>
                <div className="liked__cell">{t.album || t.Track?.Album?.title}</div>
                <div className="liked__cell liked__duration">{Math.floor((t.duration || t.Track?.duration || 0) / 60)}:{String((t.duration || t.Track?.duration || 0) % 60).padStart(2, "0")}</div>
                <div className="liked__cell">
                  <button
                    type="button"
                    className="liked__unlikeBtn"
                    onClick={() => handleUnlike(t.id || t.trackId || t.Track?.id)}
                    disabled={removingId === String(t.id || t.trackId || t.Track?.id || "").trim()}
                    aria-label={`Hapus dari liked songs: ${t.title || t.Track?.title || "lagu"}`}
                    title="Hapus dari liked songs"
                  >
                    {removingId === String(t.id || t.trackId || t.Track?.id || "").trim() ? (
                      <FiLoader className="liked__spin" />
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
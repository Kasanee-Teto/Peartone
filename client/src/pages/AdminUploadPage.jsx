import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import { useFetch } from "../hooks/useFetch";
import { authApi } from "../api/auth";

const GENRES = [
  "pop", "rock", "hip-hop", "r&b", "jazz", "classical", "electronic", "J-Pop", "Anime",
  "folk", "country", "reggae", "metal", "indie", "blues", "soul", "latin", "other"
];

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");
  return fetch(url, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
};

const parseDuration = (val) => {
  const trimmed = (val || "").trim();
  if (/^\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  const parts = trimmed.split(":");
  if (parts.length === 2) {
    const m = parseInt(parts[0], 10) || 0;
    const s = parseInt(parts[1], 10) || 0;
    return m * 60 + s;
  }
  return 0;
};

const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(opt => String(opt.id) === String(value))?.title || placeholder;

  return (
    <div className="relative w-full">
      <div
        className={`
          flex items-center justify-between w-full px-3 py-[10px] rounded-xl
          border bg-white/[0.04] text-[13px] text-white/90 cursor-pointer select-none
          transition-all duration-200
          ${isOpen
            ? "border-white/20 bg-white/[0.08] shadow-[0_0_0_2px_rgba(200,245,96,0.1)]"
            : "border-white/10 hover:bg-white/[0.08] hover:border-white/20"
          }
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={!value ? "text-white/45" : ""}>{selectedLabel}</span>
        <span
          className={`
            inline-block w-[9px] h-[9px] border-r-2 border-b-2 border-white/50
            transition-transform duration-300 mr-1
            ${isOpen ? "-rotate-[135deg] translate-y-[-2px] translate-x-[-2px]" : "rotate-45"}
          `}
        />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[999]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#181818] border border-white/10 rounded-2xl max-h-[250px] overflow-y-auto z-[1001] shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            <div
              className="px-4 py-[14px] text-sm text-white/70 cursor-pointer transition-all duration-150 hover:bg-white/[0.08] hover:text-white"
              onClick={() => { onChange(""); setIsOpen(false); }}
            >
              Without album
            </div>
            {options.map((item) => (
              <div
                key={item.id}
                className={`
                  px-4 py-[14px] text-sm cursor-pointer transition-all duration-150
                  ${String(value) === String(item.id)
                    ? "bg-[rgba(200,245,96,0.1)] text-[#c8f560]"
                    : "text-white/70 hover:bg-white/[0.08] hover:text-white"
                  }
                `}
                onClick={() => { onChange(item.id); setIsOpen(false); }}
              >
                {item.title}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const AdminUploadPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("pop");
  const [durationInput, setDurationInput] = useState("");
  const [selectedArtistIds, setSelectedArtistIds] = useState([]);
  const [album, setAlbum] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: artistsResp } = useFetch("/artists");
  const { data: albumsResp } = useFetch("/albums");
  const artists = Array.isArray(artistsResp) ? artistsResp : artistsResp?.data || [];
  const albums = Array.isArray(albumsResp) ? albumsResp : albumsResp?.data || [];

  const durationSeconds = parseDuration(durationInput);
  const audioName = audioFile?.name ?? "Haven't choose file";
  const coverName = coverFile?.name ?? "Haven't choose file";
  const navigate = useNavigate();

  const canSubmit = useMemo(
    () => title.trim() && selectedArtistIds.length > 0 && audioFile && durationSeconds > 0,
    [title, selectedArtistIds, audioFile, durationSeconds]
  );

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsSidebarOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    authFetch(`${API_BASE}/admin/tracks`)
      .then((r) => r.json())
      .then((res) => setTracks(Array.isArray(res) ? res : res?.data || []))
      .catch(console.error);
  }, [refreshKey]);

  const resetForm = () => {
    setTitle("");
    setGenre("pop");
    setDurationInput("");
    setSelectedArtistIds([]);
    setAlbum("");
    setAudioFile(null);
    setCoverFile(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || uploading) return;

    setUploading(true);
    setUploadMsg("");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("genre", genre);
    fd.append("duration", String(durationSeconds));
    fd.append("artistIds", JSON.stringify(selectedArtistIds));
    if (album) fd.append("albumId", album);
    fd.append("audio", audioFile);
    if (coverFile) fd.append("cover", coverFile);

    try {
      const r = await authFetch(`${API_BASE}/admin/tracks`, { method: "POST", body: fd });
      const res = await r.json();
      if (!r.ok) throw new Error(res?.message || "Upload failed");
      setUploadMsg("File Uploaded! Track has been added.");
      resetForm();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setUploadMsg(`${err.message || "Upload failed"}`);
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId || deleting) return;
    setDeleting(true);
    try {
      const r = await authFetch(`${API_BASE}/admin/tracks/${confirmDeleteId}`, { method: "DELETE" });
      const res = await r.json();
      if (!r.ok) throw new Error(res?.message || "Gagal menghapus");
      setTracks((prev) => prev.filter((t) => t.id !== confirmDeleteId));
      setUploadMsg("Track successfully deleted.");
    } catch (err) {
      setUploadMsg(`${err.message || "Failed to delete track."}`);
    } finally {
      setDeleting(false);
      setConfirmDeleteId(null);
    }
  };

  const isSuccess = uploadMsg.startsWith("✅");

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0d0d0f] text-white" aria-label="Admin Upload Lagu">

      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[72px] -left-[140px] w-[560px] h-[560px] rounded-full bg-[#1ed760] opacity-[0.06] blur-[160px]" />
        <div className="absolute -bottom-[100px] -right-[80px] w-[460px] h-[460px] rounded-full bg-[#7c6af7] opacity-[0.05] blur-[170px]" />
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Sidebar overlay */}
      <button
        className={`fixed inset-0 z-20 bg-black/40 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        type="button"
        aria-label="Tutup menu samping"
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Hamburger toggle */}
      <button
        className="fixed top-5 left-5 z-30 w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.06] border border-white/10 text-white text-xl hover:bg-white/10 transition-colors"
        type="button"
        aria-label="Buka menu samping"
        aria-controls="home-sidebar"
        aria-expanded={isSidebarOpen}
        onClick={() => setIsSidebarOpen(true)}
      >
        ≡
      </button>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-24">

        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-7 mb-[18px]">
          <div>
            <p className="m-0 mb-2 text-[10px] font-[800] uppercase tracking-[0.18em] text-white/30">Admin</p>
            <h1 className="m-0 text-[clamp(44px,8vw,56px)] font-[900] leading-none tracking-[-0.03em] text-white">
              Upload Track
            </h1>
            <p className="mt-3 mb-0 max-w-[520px] text-[13px] leading-relaxed text-white/45">
              Upload track to platform. Fill out all the fields needed.
            </p>
          </div>
        </header>

        {/* Status message */}
        {uploadMsg && (
          <div
            className={`
              px-4 py-3 rounded-xl mb-4 border text-[13px]
              ${isSuccess
                ? "bg-[rgba(30,215,96,0.1)] border-[rgba(30,215,96,0.25)] text-[#1ed760]"
                : "bg-[rgba(255,92,110,0.1)] border-[rgba(255,92,110,0.25)] text-[#ff8b85]"
              }
            `}
          >
            {uploadMsg}
          </div>
        )}

        {/* Form */}
        <form
          className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-[18px]"
          onSubmit={onSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">

            {/* Title */}
            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-[11px] font-[800] uppercase tracking-[0.14em] text-white/50">Title *</span>
              <input
                className="w-full px-3 py-[10px] rounded-xl border border-white/10 bg-white/[0.04] outline-none text-white/90 text-[13px] placeholder:text-white/45 focus:border-white/20 focus:bg-white/[0.07] transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul lagu"
                required
              />
            </label>

            {/* Genre */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <span className="text-[11px] font-[800] uppercase tracking-[0.14em] text-white/50">Genre *</span>
              <div className="flex flex-wrap gap-2 p-3 bg-white/[0.04] border border-white/10 rounded-xl">
                {GENRES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGenre(g)}
                    className={`
                      px-[14px] py-[6px] rounded-[20px] text-xs font-medium cursor-pointer transition-all duration-150
                      ${genre === g
                        ? "border border-[rgba(200,245,96,0.5)] bg-[rgba(200,245,96,0.15)] text-[#c8f560]"
                        : "border border-white/12 bg-white/[0.06] text-white/65 hover:bg-white/10 hover:text-white/80"
                      }
                    `}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <label className="flex flex-col gap-2">
              <span className="text-[11px] font-[800] uppercase tracking-[0.14em] text-white/50">
                Duration * (format: 3:45 atau second(s))
              </span>
              <input
                className="w-full px-3 py-[10px] rounded-xl border border-white/10 bg-white/[0.04] outline-none text-white/90 text-[13px] placeholder:text-white/45 focus:border-white/20 focus:bg-white/[0.07] transition-all"
                value={durationInput}
                onChange={(e) => setDurationInput(e.target.value)}
                placeholder="Ex: 3:45 or 225"
                required
              />
              {durationInput && durationSeconds > 0 && (
                <span className="text-[11px] text-white/40 mt-1">
                  = {Math.floor(durationSeconds / 60)}m {durationSeconds % 60}s
                </span>
              )}
            </label>

            {/* Artists */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <span className="text-[11px] font-[800] uppercase tracking-[0.14em] text-white/50">
                Artist * (choose min. 1)
              </span>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2 max-h-[200px] overflow-auto p-3 border border-white/10 rounded-xl bg-white/[0.04]">
                {artists.length === 0 ? (
                  <span className="text-white/40 text-[13px]">
                    No artist. Add artist at Artists.
                  </span>
                ) : artists.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-2 text-[13px] cursor-pointer ${selectedArtistIds.includes(item.id) ? "text-[#c8f560]" : "text-white/70"}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedArtistIds.includes(item.id)}
                      onChange={(e) =>
                        setSelectedArtistIds((prev) =>
                          e.target.checked ? [...prev, item.id] : prev.filter((id) => id !== item.id)
                        )
                      }
                      className="accent-[#c8f560]"
                    />
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Album */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-[800] uppercase tracking-[0.14em] text-white/50">Album (optional)</span>
              <CustomSelect value={album} onChange={setAlbum} options={albums} placeholder="Tanpa album" />
            </div>

            {/* Audio file */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-[800] uppercase tracking-[0.14em] text-white/50">
                File Audio * (MP3, WAV, OGG, FLAC — max 50 MB)
              </span>
              <label className="grid grid-cols-[auto_1fr] items-center gap-[10px] p-[10px_12px] rounded-xl border border-white/10 bg-white/[0.04] cursor-pointer">
                <input
                  type="file"
                  accept="audio/mpeg,audio/wav,audio/ogg,audio/flac,audio/*"
                  onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                  className="absolute w-px h-px opacity-0 pointer-events-none"
                />
                <span className="inline-flex items-center gap-2 px-[10px] py-2 rounded-[10px] border border-[rgba(30,215,96,0.22)] bg-[rgba(30,215,96,0.1)] text-[#1ed760] text-[13px] cursor-pointer select-none">
                  <FiUploadCloud aria-hidden="true" />
                  <span>Choose Audio</span>
                </span>
                <span className="text-white/70 text-[13px] truncate" title={audioName}>{audioName}</span>
              </label>
            </div>

            {/* Cover image */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-[800] uppercase tracking-[0.14em] text-white/50">
                Cover (optional — JPG, PNG, WEBP)
              </span>
              <label className="grid grid-cols-[auto_1fr] items-center gap-[10px] p-[10px_12px] rounded-xl border border-white/10 bg-white/[0.04] cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                  className="absolute w-px h-px opacity-0 pointer-events-none"
                />
                <span className="inline-flex items-center gap-2 px-[10px] py-2 rounded-[10px] border border-[rgba(30,215,96,0.22)] bg-[rgba(30,215,96,0.1)] text-[#1ed760] text-[13px] cursor-pointer select-none">
                  <FiUploadCloud aria-hidden="true" />
                  <span>Choose Cover</span>
                </span>
                <span className="text-white/70 text-[13px] truncate" title={coverName}>{coverName}</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-[14px] mt-4">
            <button
              className="w-full sm:w-auto px-4 py-[10px] rounded-full font-[900] tracking-[0.02em] cursor-pointer text-[#0d0d0f] bg-[#1ed760] transition-all duration-150 hover:-translate-y-px disabled:opacity-55 disabled:cursor-not-allowed disabled:translate-y-0"
              type="submit"
              disabled={!canSubmit || uploading}
            >
              {uploading ? "Uploading…" : "Upload Track"}
            </button>
            <p className="m-0 text-[12px] text-white/50">
              * Must fill: Title, Genre, Duration, Artist, dan Audio file.
            </p>
          </div>
        </form>

        {/* Track list */}
        <section className="mt-8 rounded-2xl bg-black/25 border border-white/[0.08] p-[18px]" aria-label="Daftar lagu tersimpan">
          <h2 className="m-0 mb-3 text-[14px] font-[800] text-white/85">
            Track saved ({tracks.length})
          </h2>

          {tracks.length === 0 ? (
            <p className="text-white/35 text-[13px] mt-3">No track uploaded.</p>
          ) : (
            <div className="flex flex-col gap-[10px] mt-3">
              {tracks.map((track) => {
                const artistNames = Array.isArray(track.Artists)
                  ? track.Artists.map((a) => a.name).join(", ")
                  : track.artist?.name ?? "—";
                const mins = Math.floor((track.duration || 0) / 60);
                const secs = String((track.duration || 0) % 60).padStart(2, "0");
                const isPendingDelete = confirmDeleteId === track.id;

                return (
                  <div key={track.id}>
                    {/* Track row */}
                    <div
                      className={`
                        flex items-center gap-[14px] px-[14px] py-[10px] border transition-all duration-[160ms]
                        ${isPendingDelete
                          ? "bg-[rgba(255,92,110,0.05)] border-[rgba(255,92,110,0.3)] rounded-[14px_14px_0_0]"
                          : "bg-white/[0.03] border-white/[0.07] rounded-[14px] hover:bg-white/[0.06]"
                        }
                      `}
                    >
                      {/* Cover thumbnail */}
                      {track.coverUrl ? (
                        <img
                          src={track.coverUrl}
                          alt={track.title}
                          className="w-[52px] h-[52px] rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-[52px] h-[52px] rounded-lg bg-white/[0.08] shrink-0 flex items-center justify-center text-xl">
                          🎵
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="m-0 text-[14px] font-semibold text-white truncate">{track.title}</p>
                        <p className="m-0 mt-[3px] text-[12px] text-white/50 truncate">
                          {artistNames}{track.Album?.title ? ` · ${track.Album.title}` : ""}
                        </p>
                      </div>

                      {/* Genre badge */}
                      <span className="text-[11px] font-medium px-[10px] py-1 rounded-full bg-[rgba(200,245,96,0.1)] border border-[rgba(200,245,96,0.25)] text-[#c8f560] shrink-0 capitalize">
                        {track.genre}
                      </span>

                      {/* Duration */}
                      <span className="text-[12px] text-white/40 shrink-0 tabular-nums min-w-[36px] text-right">
                        {mins}:{secs}
                      </span>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(isPendingDelete ? null : track.id)}
                        className={`
                          shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border cursor-pointer transition-all duration-150
                          ${isPendingDelete
                            ? "bg-[rgba(255,92,110,0.2)] border-[rgba(255,92,110,0.5)] text-[#ff8b85]"
                            : "bg-white/[0.05] border-white/10 text-white/40 hover:bg-white/10 hover:text-white/70"
                          }
                        `}
                        aria-label="Delete track"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>

                    {/* Confirm delete panel */}
                    {isPendingDelete && (
                      <div className="flex items-center justify-between gap-3 px-[14px] py-[10px] bg-[rgba(255,92,110,0.08)] border border-[rgba(255,92,110,0.3)] border-t-0 rounded-[0_0_14px_14px]">
                        <div className="flex items-center gap-2">
                          <FiAlertTriangle size={14} className="text-[#ff8b85] shrink-0" />
                          <span className="text-[12px] text-white/70">
                            Do you want to delete this track? Action cannot be reverted.
                          </span>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[12px] px-3 py-[5px] rounded-lg border border-white/12 bg-white/[0.06] text-white/60 cursor-pointer hover:bg-white/10 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={confirmDelete}
                            disabled={deleting}
                            className="text-[12px] px-3 py-[5px] rounded-lg border border-[rgba(255,92,110,0.4)] bg-[rgba(255,92,110,0.2)] text-[#ff8b85] font-medium cursor-pointer disabled:cursor-wait hover:bg-[rgba(255,92,110,0.3)] transition-colors"
                          >
                            {deleting ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AdminUploadPage;
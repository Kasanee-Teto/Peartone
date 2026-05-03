import { useEffect, useMemo, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import "../styles/AdminUploadPage.css";
import { useFetch } from "../hooks/useFetch";

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

  const { data: artistsResp } = useFetch("/artists");
  const { data: albumsResp } = useFetch("/albums");
  const artists = Array.isArray(artistsResp) ? artistsResp : artistsResp?.data || [];
  const albums = Array.isArray(albumsResp) ? albumsResp : albumsResp?.data || [];

  const durationSeconds = parseDuration(durationInput);
  const audioName = audioFile?.name ?? "Belum pilih file";
  const coverName = coverFile?.name ?? "Belum pilih file";
  const selectedArtistNames = artists
    .filter((a) => selectedArtistIds.includes(a.id))
    .map((a) => a.name)
    .join(", ");

  const canSubmit = useMemo(
    () => title.trim() && selectedArtistIds.length > 0 && audioFile && durationSeconds > 0,
    [title, selectedArtistIds, audioFile, durationSeconds]
  );

  useEffect(() => {
    authFetch(`${API_BASE}/admin/tracks`)
      .then((r) => r.json())
      .then((res) => {
        console.log("Response data:", res);
        setTracks(Array.isArray(res) ? res : res?.data || [])
      })
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
      if (!r.ok) throw new Error(res?.message || "Upload gagal");
      setUploadMsg("✅ Upload berhasil! Lagu telah ditambahkan.");
      resetForm();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setUploadMsg(`❌ ${err.message || "Upload gagal"}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="admin-upload" aria-label="Admin Upload Lagu">
      <div className="admin-upload__blob" aria-hidden="true" />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={() => setIsSidebarOpen(false)}
      />

      <button
        className={`home__sidebar-overlay${isSidebarOpen ? " is-open" : ""}`}
        type="button"
        aria-label="Tutup menu samping"
        onClick={() => setIsSidebarOpen(false)}
      />
      <button
        className="home__sidebar-toggle"
        type="button"
        aria-label="Buka menu samping"
        aria-controls="home-sidebar"
        aria-expanded={isSidebarOpen}
        onClick={() => setIsSidebarOpen(true)}
      >
        ≡
      </button>

      <div className="admin-upload__inner">
        <header className="admin-upload__header">
          <div>
            <p className="admin-upload__eyebrow">Admin</p>
            <h1 className="admin-upload__title">Upload Lagu</h1>
            <p className="admin-upload__desc">
              Upload musik ke platform. Isi semua field yang diperlukan.
            </p>
          </div>
        </header>

        {uploadMsg && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              marginBottom: 16,
              background: uploadMsg.startsWith("✅") ? "rgba(30,215,96,0.1)" : "rgba(255,92,110,0.1)",
              border: `1px solid ${uploadMsg.startsWith("✅") ? "rgba(30,215,96,0.25)" : "rgba(255,92,110,0.25)"}`,
              color: uploadMsg.startsWith("✅") ? "#1ed760" : "#ff8b85",
              fontSize: 13,
            }}
          >
            {uploadMsg}
          </div>
        )}

        <form className="admin-form" onSubmit={onSubmit}>
          <div className="admin-form__grid">

            {/* Title */}
            <label className="admin-field">
              <span className="admin-field__label">Judul *</span>
              <input
                className="admin-field__input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul lagu"
                required
              />
            </label>

            {/* Genre */}
            <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
              <span className="admin-field__label">Genre *</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}>
                {GENRES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGenre(g)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      border: genre === g ? "1px solid rgba(200,245,96,0.5)" : "1px solid rgba(255,255,255,0.12)",
                      background: genre === g ? "rgba(200,245,96,0.15)" : "rgba(255,255,255,0.06)",
                      color: genre === g ? "#c8f560" : "rgba(255,255,255,0.65)",
                      transition: "all 140ms ease",
                    }}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <label className="admin-field">
              <span className="admin-field__label">Durasi * (format: 3:45 atau detik)</span>
              <input
                className="admin-field__input"
                value={durationInput}
                onChange={(e) => setDurationInput(e.target.value)}
                placeholder="Contoh: 3:45 atau 225"
                required
              />
              {durationInput && durationSeconds > 0 && (
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
                  = {Math.floor(durationSeconds / 60)}m {durationSeconds % 60}s
                </span>
              )}
            </label>

            {/* Artists */}
            <label className="admin-field" style={{ gridColumn: "1 / -1" }}>
              <span className="admin-field__label">Artis * (pilih minimal 1)</span>
              <div
                className="admin-picker"
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8, maxHeight: 200, overflow: "auto", padding: "10px 12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, background: "rgba(255,255,255,0.04)" }}
              >
                {artists.length === 0 ? (
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                    Belum ada artis. Tambah artis dulu di halaman Artists.
                  </span>
                ) : artists.map((item) => (
                  <label
                    key={item.id}
                    style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", color: selectedArtistIds.includes(item.id) ? "#c8f560" : "rgba(255,255,255,0.7)" }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedArtistIds.includes(item.id)}
                      onChange={(e) =>
                        setSelectedArtistIds((prev) =>
                          e.target.checked ? [...prev, item.id] : prev.filter((id) => id !== item.id)
                        )
                      }
                      style={{ accentColor: "#c8f560" }}
                    />
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            </label>

            {/* Album */}
            <label className="admin-field">
              <span className="admin-field__label">Album (opsional)</span>
              <select className="admin-field__input" value={album} onChange={(e) => setAlbum(e.target.value)}>
                <option value="">Tanpa album</option>
                {albums.map((item) => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))}
              </select>
            </label>

            {/* Audio file */}
            <div className="admin-field">
              <span className="admin-field__label">File Audio * (MP3, WAV, OGG, FLAC — maks 50 MB)</span>
              <label className="admin-file">
                <input
                  type="file"
                  accept="audio/mpeg,audio/wav,audio/ogg,audio/flac,audio/*"
                  onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                />
                <span className="admin-file__btn">
                  <FiUploadCloud aria-hidden="true" />
                  <span>Pilih Audio</span>
                </span>
                <span className="admin-file__name" title={audioName}>{audioName}</span>
              </label>
            </div>

            {/* Cover image */}
            <div className="admin-field">
              <span className="admin-field__label">Cover (opsional — JPG, PNG, WEBP)</span>
              <label className="admin-file">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                />
                <span className="admin-file__btn">
                  <FiUploadCloud aria-hidden="true" />
                  <span>Pilih Cover</span>
                </span>
                <span className="admin-file__name" title={coverName}>{coverName}</span>
              </label>
            </div>
          </div>

          <div className="admin-actions">
            <button className="admin-submit" type="submit" disabled={!canSubmit || uploading}>
              {uploading ? "Mengupload…" : "Upload Lagu"}
            </button>
            <p className="admin-hint">* Wajib isi: Judul, Genre, Durasi, Artis, dan file Audio.</p>
          </div>
        </form>

        {/* Preview */}
        <section className="admin-preview" aria-label="Daftar lagu tersimpan" style={{ marginTop: 32 }}>
          <h2 className="admin-preview__title">Lagu Tersimpan ({tracks.length})</h2>

          {tracks.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 12 }}>
              Belum ada lagu yang diupload.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              {tracks.map((track) => {
                const artistNames = Array.isArray(track.Artists)
                  ? track.Artists.map((a) => a.name).join(", ")  
                  : track.artist?.name ?? "—";
                const mins = Math.floor((track.duration || 0) / 60);
                const secs = String((track.duration || 0) % 60).padStart(2, "0");

                return (
                  <div
                    key={track.id}
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, transition: "background 160ms ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                  >
                    {track.coverUrl ? (
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{ width: 52, height: 52, borderRadius: 8, background: "rgba(255,255,255,0.08)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                        🎵
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {track.title}
                      </p>
                      <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {artistNames}{track.Album?.title ? ` · ${track.Album.title}` : ""}
                      </p>
                    </div>

                    <span style={{ fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 20, background: "rgba(200,245,96,0.1)", border: "1px solid rgba(200,245,96,0.25)", color: "#c8f560", flexShrink: 0, textTransform: "capitalize" }}>
                      {track.genre}
                    </span>

                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", flexShrink: 0, fontVariantNumeric: "tabular-nums", minWidth: 36, textAlign: "right" }}>
                      {mins}:{secs}
                    </span>
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
import { useMemo, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import "../styles/AdminUploadPage.css";
import { useFetch } from "../hooks/useFetch";

const GENRES = [
  "pop", "rock", "hip-hop", "r&b", "jazz", "classical", "electronic",
  "folk", "country", "reggae", "metal", "indie", "blues", "soul", "latin", "other"
];

const AdminUploadPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("pop");
  const [durationInput, setDurationInput] = useState(""); // mm:ss format
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

  const audioName = audioFile?.name ?? "Belum pilih file";
  const coverName = coverFile?.name ?? "Belum pilih file";

  // Parse mm:ss → seconds
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

  const durationSeconds = parseDuration(durationInput);

  const canSubmit = useMemo(() => {
    return title.trim() && selectedArtistIds.length > 0 && audioFile && durationSeconds > 0;
  }, [title, selectedArtistIds, audioFile, durationSeconds]);

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

    const token = localStorage.getItem("token");
    const fd = new FormData();
    fd.append("title", title);
    fd.append("genre", genre);
    fd.append("duration", String(durationSeconds));
    fd.append("artistIds", JSON.stringify(selectedArtistIds));
    if (album) fd.append("albumId", album);
    fd.append("audio", audioFile);
    if (coverFile) fd.append("cover", coverFile);

    try {
      const r = await fetch("/api/admin/tracks", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const res = await r.json();
      if (!r.ok) throw new Error(res?.message || "Upload gagal");
      setUploadMsg("✅ Upload berhasil! Lagu telah ditambahkan.");
      resetForm();
    } catch (err) {
      setUploadMsg(`❌ ${err.message || "Upload gagal"}`);
    } finally {
      setUploading(false);
    }
  };

  const selectedArtistNames = artists
    .filter((a) => selectedArtistIds.includes(a.id))
    .map((a) => a.name)
    .join(", ");

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
              background: uploadMsg.startsWith("✅")
                ? "rgba(30,215,96,0.1)"
                : "rgba(255,92,110,0.1)",
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
            <label className="admin-field">
              <span className="admin-field__label">Genre *</span>
              <select
                className="admin-field__input"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                ))}
              </select>
            </label>

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
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: 8,
                  maxHeight: 200,
                  overflow: "auto",
                  padding: "10px 12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                {artists.length === 0 && (
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                    Belum ada artis. Tambah artis dulu di halaman Artists.
                  </span>
                )}
                {artists.map((item) => (
                  <label
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      cursor: "pointer",
                      color: selectedArtistIds.includes(item.id)
                        ? "#c8f560"
                        : "rgba(255,255,255,0.7)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedArtistIds.includes(item.id)}
                      onChange={(e) => {
                        setSelectedArtistIds((prev) =>
                          e.target.checked
                            ? [...prev, item.id]
                            : prev.filter((id) => id !== item.id)
                        );
                      }}
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
              <select
                className="admin-field__input"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
              >
                <option value="">Tanpa album</option>
                {albums.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
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
                <span className="admin-file__name" title={audioName}>
                  {audioName}
                </span>
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
                <span className="admin-file__name" title={coverName}>
                  {coverName}
                </span>
              </label>
            </div>
          </div>

          <div className="admin-actions">
            <button
              className="admin-submit"
              type="submit"
              disabled={!canSubmit || uploading}
            >
              {uploading ? "Mengupload…" : "Upload Lagu"}
            </button>
            <p className="admin-hint">
              * Wajib isi: Judul, Genre, Durasi, Artis, dan file Audio.
            </p>
          </div>
        </form>

        {/* Preview */}
        <section className="admin-preview" aria-label="Preview data">
          <h2 className="admin-preview__title">Preview</h2>
          <div className="admin-preview__grid">
            <div className="admin-preview__item">
              <span className="admin-preview__k">Judul</span>
              <span className="admin-preview__v">{title || "—"}</span>
            </div>
            <div className="admin-preview__item">
              <span className="admin-preview__k">Genre</span>
              <span className="admin-preview__v">{genre}</span>
            </div>
            <div className="admin-preview__item">
              <span className="admin-preview__k">Durasi</span>
              <span className="admin-preview__v">
                {durationSeconds > 0
                  ? `${Math.floor(durationSeconds / 60)}:${String(durationSeconds % 60).padStart(2, "0")} (${durationSeconds}s)`
                  : "—"}
              </span>
            </div>
            <div className="admin-preview__item">
              <span className="admin-preview__k">Artis</span>
              <span className="admin-preview__v">{selectedArtistNames || "—"}</span>
            </div>
            <div className="admin-preview__item">
              <span className="admin-preview__k">Album</span>
              <span className="admin-preview__v">
                {albums.find((a) => a.id === album)?.title || "—"}
              </span>
            </div>
            <div className="admin-preview__item">
              <span className="admin-preview__k">Audio</span>
              <span className="admin-preview__v">{audioName}</span>
            </div>
            <div className="admin-preview__item">
              <span className="admin-preview__k">Cover</span>
              <span className="admin-preview__v">{coverName}</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminUploadPage;
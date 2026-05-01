import { useMemo, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import "../styles/AdminUploadPage.css";

const AdminUploadPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const audioName = audioFile?.name ?? "Belum pilih file";
  const coverName = coverFile?.name ?? "Belum pilih file";

  const canSubmit = useMemo(() => {
    return title.trim() && artist.trim() && audioFile;
  }, [title, artist, audioFile]);

  const onSubmit = (e) => {
    e.preventDefault();

    // Placeholder only (backend upload belum dibuat)
    window.alert(
      "Placeholder: data sudah siap. Nanti tinggal sambungkan ke backend upload."
    );
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
              For Creators: Upload your music to share with the world.
            </p>
          </div>
        </header>

        <form className="admin-form" onSubmit={onSubmit}>
          <div className="admin-form__grid">
            <label className="admin-field">
              <span className="admin-field__label">Judul</span>
              <input
                className="admin-field__input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul lagu"
                required
              />
            </label>

            <label className="admin-field">
              <span className="admin-field__label">Artis</span>
              <input
                className="admin-field__input"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Masukkan nama artis"
                required
              />
            </label>

            <label className="admin-field">
              <span className="admin-field__label">Album (opsional)</span>
              <input
                className="admin-field__input"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                placeholder="Masukkan nama album"
              />
            </label>

            <div className="admin-field">
              <span className="admin-field__label">Audio (wajib)</span>
              <label className="admin-file">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                  required
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

            <div className="admin-field">
              <span className="admin-field__label">Cover (opsional)</span>
              <label className="admin-file">
                <input
                  type="file"
                  accept="image/*"
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
            <button className="admin-submit" type="submit" disabled={!canSubmit}>
              Upload
            </button>
            <p className="admin-hint">
              Wajib isi: Judul, Artis, dan file Audio.
            </p>
          </div>
        </form>

        <section className="admin-preview" aria-label="Preview data">
          <h2 className="admin-preview__title">Preview</h2>
          <div className="admin-preview__grid">
            <div className="admin-preview__item">
              <span className="admin-preview__k">Judul</span>
              <span className="admin-preview__v">{title || "-"}</span>
            </div>
            <div className="admin-preview__item">
              <span className="admin-preview__k">Artis</span>
              <span className="admin-preview__v">{artist || "-"}</span>
            </div>
            <div className="admin-preview__item">
              <span className="admin-preview__k">Album</span>
              <span className="admin-preview__v">{album || "-"}</span>
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

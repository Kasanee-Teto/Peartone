import { useEffect, useState } from "react";
import { FiTrash2, FiX } from "react-icons/fi";
import "../styles/LyricsPanel.css";

const exampleLyrics = `Malam datang perlahan
Kota ini masih bernapas
Kita simpan semua harap
Di antara lampu yang redup

Biar hujan turun lagi
Tak semua harus dimengerti
Kalau nanti lagu ini hilang
Masih ada jejak yang tinggal`;

const LyricsPanel = ({ artist, title, open, onClose }) => {
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    if (!artist || !title) {
      setLyrics("");
      setError("Informasi lagu kurang");
      return;
    }
    setLoading(true);
    setError(null);
    setLyrics("");
    const fetchLyrics = async () => {
      try {
        const res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
        if (!res.ok) throw new Error("Tidak ditemukan");
        const data = await res.json();
        setLyrics(data.lyrics || exampleLyrics);
      } catch (e) {
        setError("Lirik tidak ditemukan");
        setLyrics(exampleLyrics);
      } finally {
        setLoading(false);
      }
    };
    fetchLyrics();
  }, [open, artist, title]);

  const handleDeleteLyrics = () => {
    setLyrics("");
    setError(null);
  };

  if (!open) return null;

  return (
    <div className="pt-lyrics">
      <div className="pt-lyrics__head">
        <div>
          <strong>{title}</strong>
          <div className="pt-lyrics__artist">{artist}</div>
        </div>
        <div className="pt-lyrics__actions">
          {lyrics ? (
            <button type="button" className="pt-btn pt-btn--danger" onClick={handleDeleteLyrics} title="Delete lyrics">
              <FiTrash2 />
            </button>
          ) : null}
          <button type="button" className="pt-btn" onClick={onClose} title="Close">
            <FiX />
          </button>
        </div>
      </div>
      <div className="pt-lyrics__body">
        {loading ? (
          <div className="pt-lyrics__loading">Memuat lirik…</div>
        ) : lyrics ? (
          <div className="pt-lyrics__content">
            {error ? <div className="pt-lyrics__hint">{error}. Menampilkan contoh lirik.</div> : null}
            <pre className="pt-lyrics__text">{lyrics}</pre>
          </div>
        ) : (
          <div className="pt-lyrics__empty">Lirik tidak tersedia</div>
        )}
      </div>
    </div>
  );
};

export default LyricsPanel;

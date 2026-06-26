import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import "../styles/LyricsPanel.css";

function getLyricsText(payload) {
  if (!payload) return "";
  if (typeof payload === "string") return payload;
  return payload?.text || payload?.lyrics || "";
}

const LyricsPanel = ({ trackId, artist, title, open, onClose }) => {
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !trackId) return;

    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setLoading(true);
      setError(null);
      setLyrics("");
    });

    const fetchLyrics = async () => {
      try {
        const res = await fetch(`/api/lyrics/${encodeURIComponent(trackId)}`);
        if (!res.ok) throw new Error("Tidak ditemukan");
        const data = await res.json();
        if (!active) return;
        setLyrics(getLyricsText(data?.data || data));
      } catch {
        if (!active) return;
        setError("Lirik tidak ditemukan");
        setLyrics("");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchLyrics();

    return () => {
      active = false;
    };
  }, [open, trackId]);

  if (!open) return null;

  const statusMessage = trackId ? error || "Lirik tidak tersedia" : "Track tidak tersedia";

  return (
    <div className="pt-lyrics">
      <div className="pt-lyrics__head">
        <div>
          <strong>{title}</strong>
          <div className="pt-lyrics__artist">{artist}</div>
        </div>
        <div className="pt-lyrics__actions">
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
            <pre className="pt-lyrics__text">{lyrics}</pre>
          </div>
        ) : (
          <div className="pt-lyrics__empty">{statusMessage}</div>
        )}
      </div>
    </div>
  );
};

export default LyricsPanel;

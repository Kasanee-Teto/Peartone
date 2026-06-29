import { useEffect, useState, useRef } from "react";
import { FiX } from "react-icons/fi";
import { parseLRC } from "../utils/parseLRC";

function getLyricsText(payload) {
  if (!payload) return "";
  if (typeof payload === "string") return payload;
  return payload?.text || payload?.lyrics || "";
}

const LyricsPanel = ({ trackId, artist, title, open, onClose, currentTime = 0 }) => {
  const [parsedLyrics, setParsedLyrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeIdx, setActiveIdx] = useState(-1);
  const lyricContainerRef = useRef(null);
  const lineRefs = useRef([]);

  useEffect(() => {
    if (!open || !trackId) return;

    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setLoading(true);
      setError(null);
      setParsedLyrics([]);
    });

    const fetchLyrics = async () => {
      try {
        const res = await fetch(`/api/lyrics/${encodeURIComponent(trackId)}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        if (!active) return;
        setParsedLyrics(parseLRC(getLyricsText(data?.data || data)));
      } catch {
        if (!active) return;
        setError("Lyric not found");
        setParsedLyrics([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchLyrics();
    return () => { active = false; };
  }, [open, trackId]);

  useEffect(() => {
    if (parsedLyrics.length === 0) return;

    let currentLineIdx = -1;
    parsedLyrics.forEach((lyric, index) => {
      if (currentTime >= lyric.time) {
        currentLineIdx = index;
      } 
    });

    if (currentLineIdx !== activeIdx) {
      setActiveIdx(currentLineIdx);

      if (currentLineIdx !== -1 && lineRefs.current[currentLineIdx]) {
        lineRefs.current[currentLineIdx].scrollIntoView({
          behavior: "smooth", block: "nearest"
        });
      }
    }
  }, [currentTime, parsedLyrics, activeIdx]);

  if (!open) return null;

  const statusMessage = trackId ? error || "Lyric not available" : "Track not available";

  return (
    <div className="fixed sm:absolute bottom-24 right-0 sm:right-4 z-[600] max-h-[75vh] sm:max-h-[420px] w-full sm:w-[400px] overflow-hidden rounded-t-xl sm:rounded-lg border border-white/10 bg-[#0d0d0ff5] text-white shadow-[0_-8px_32px_rgba(0,0,0,0.5)] sm:shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-md pointer-events-auto">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-[14px] py-3">
        <div className="min-w-0">
          <strong className="block truncate">{title}</strong>
          <div className="truncate text-xs text-white/55">{artist}</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          title="Close"
          className="inline-flex items-center justify-center rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
        >
          <FiX />
        </button>
      </div>

      <div 
        ref={lyricContainerRef}
        className="max-h-[20vh] sm:max-h-[340px] overflow-y-auto overflow-x-hidden p-4 overscroll-contain touch-pan-y scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {loading ? (
          <div className="text-white/60">Load Lyric…</div>
        ) : parsedLyrics.length > 0 ? (
          <div className="flex flex-col gap-4 pt-8 pb-24"> 
            {parsedLyrics.map((line, index) => {
              const isActive = index === activeIdx;
              const isPast = index < activeIdx;

              return (
                <p
                  key={index}
                  ref={(el) => (lineRefs.current[index] = el)}
                  className={`m-0 text-sm font-bold transition-all duration-300 select-none max-w-full break-words ${
                    isActive 
                      ? "text-[#1db954] opacity-100" 
                      : isPast 
                      ? "text-white opacity-40" 
                      : "text-white/50 opacity-50"
                  }`}
                >
                  {line.text || "•••"}
                </p>
              );
            })}
          </div>
        ) : (
          <div className="text-white/60">{statusMessage}</div>
        )}
      </div>
    </div>
  );
};

export default LyricsPanel;
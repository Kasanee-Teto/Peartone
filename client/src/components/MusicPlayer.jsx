import { useState, useEffect } from "react";
import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiShuffle,
  FiRepeat,
  FiHeart,
  FiVolume2,
  FiList,
  FiMic,
  FiPlus,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import "../styles/MusicPlayer.css";
import LyricsPanel from "./LyricsPanel";
import QueueList from "./QueueList";

// Data lagu dummy — nanti diganti dari state/context/API
const CURRENT_TRACK = {
  title: "After Dark",
  artist: "Arka Lane",
  album: "After Dark",
  duration: 214,
};

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [progress, setProgress] = useState(40);
  const [volume, setVolume] = useState(75);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [queue, setQueue] = useState(() => {
    try {
      const raw = localStorage.getItem("pt_queue");
      return raw ? JSON.parse(raw) : [CURRENT_TRACK];
    } catch {
      return [CURRENT_TRACK];
    }
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTrack = queue[currentIndex] || CURRENT_TRACK;
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const currentTime = Math.floor((progress / 100) * currentTrack.duration);

  useEffect(() => {
    try {
      localStorage.setItem("pt_queue", JSON.stringify(queue));
    } catch (e) {
      // ignore
    }
  }, [queue]);

  function addToQueue(track) {
    setQueue((q) => [...q, track]);
    setShowQueue(true);
  }

  function removeFromQueue(idx) {
    setQueue((q) => {
      const copy = q.slice();
      copy.splice(idx, 1);
      return copy;
    });
    // adjust current index bounds
    setCurrentIndex((i) => Math.max(0, Math.min(i, queue.length - 2)));
  }

  function playTrack(idx) {
    if (idx < 0 || idx >= queue.length) return;
    setCurrentIndex(idx);
    setIsPlaying(true);
  }

  function playNext() {
    if (isRepeat) return setIsPlaying(true);
    if (isShuffle) return setCurrentIndex(() => Math.floor(Math.random() * queue.length));
    setCurrentIndex((i) => Math.min(queue.length - 1, i + 1));
    setIsPlaying(true);
  }

  function playPrev() {
    setCurrentIndex((i) => Math.max(0, i - 1));
    setIsPlaying(true);
  }

  return (
    <div
      className={`player${isCollapsed ? " player--collapsed" : ""}`}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 300,
        pointerEvents: "none",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {isCollapsed ? (
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="player__collapsed-toggle"
          style={{
            pointerEvents: "auto",
            marginRight: "24px",
            width: "auto",
            height: "auto",
            border: "none",
            borderRadius: 0,
            background: "transparent",
            color: "rgba(255,255,255,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "none",
            padding: 0,
            lineHeight: 0,
          }}
          aria-label="Show music player"
          title="Show music player"
        >
          <FiChevronUp size={18} />
        </button>
      ) : (
        <div
          className="player__body"
          style={{
            pointerEvents: "auto",
            width: "100%",
            height: "80px",
            background: "rgba(13, 13, 15, 0.92)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            gap: "16px",
            color: "#fff",
            position: "relative",
          }}
        >
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="player__toggle"
            style={{
              width: "auto",
              height: "auto",
              borderRadius: 0,
              border: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "none",
              flexShrink: 0,
              marginLeft: "auto",
              order: 4,
              padding: 0,
              lineHeight: 0,
            }}
            aria-label="Hide music player"
            title="Hide music player"
          >
            <FiChevronDown size={18} />
          </button>

          <div className="player__left" style={{ display: "flex", alignItems: "center", gap: "12px", width: "240px", flexShrink: 0, order: 1 }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                flexShrink: 0,
                background: "linear-gradient(135deg, #7c6af7, #c8f560)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}
            >
              ♪
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {currentTrack.title}
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {currentTrack.artist}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setIsLiked(!isLiked)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: isLiked ? "#c8f560" : "rgba(255,255,255,0.4)",
                  display: "flex",
                  padding: "4px",
                  flexShrink: 0,
                  transition: "color 0.15s",
                }}
                aria-label={isLiked ? "Unlike" : "Like"}
              >
                <FiHeart size={16} fill={isLiked ? "currentColor" : "none"} />
              </button>

              <button
                type="button"
                onClick={() => addToQueue(currentTrack)}
                title="Add to queue"
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", padding: 4 }}
              >
                <FiPlus size={14} />
              </button>
            </div>
          </div>

          <div className="player__center" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", order: 2, minWidth: 0 }}>
            <div className="player__controls" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button
                type="button"
                onClick={() => setIsShuffle(!isShuffle)}
                className="player__btn player__btn--shuffle"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: isShuffle ? "#c8f560" : "rgba(255,255,255,0.4)",
                  display: "flex",
                  padding: "4px",
                  transition: "color 0.15s",
                }}
                aria-label="Shuffle"
              >
                <FiShuffle size={16} />
              </button>

              <button
                type="button"
                className="player__btn player__btn--skip"
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", display: "flex", padding: "4px" }}
                aria-label="Previous"
              >
                <FiSkipBack size={20} />
              </button>

              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="player__play"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "none",
                  background: "#ffffff",
                  color: "#0d0d0f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  boxShadow: "0 4px 16px rgba(255,255,255,0.15)",
                  transition: "transform 0.1s",
                }}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <FiPause size={18} fill="currentColor" /> : <FiPlay size={18} fill="currentColor" style={{ marginLeft: "2px" }} />}
              </button>

              <button
                type="button"
                className="player__btn player__btn--skip"
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", display: "flex", padding: "4px" }}
                aria-label="Next"
              >
                <FiSkipForward size={20} />
              </button>

              <button
                type="button"
                onClick={() => setIsRepeat(!isRepeat)}
                className="player__btn player__btn--repeat"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: isRepeat ? "#c8f560" : "rgba(255,255,255,0.4)",
                  display: "flex",
                  padding: "4px",
                  transition: "color 0.15s",
                }}
                aria-label="Repeat"
              >
                <FiRepeat size={16} />
              </button>
            </div>

            <div className="player__progress-row" style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", maxWidth: "480px" }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", flexShrink: 0, minWidth: "32px", textAlign: "right" }}>
                {formatTime(currentTime)}
              </span>
              <div style={{ flex: 1, position: "relative", height: "4px" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "2px", background: "rgba(255,255,255,0.15)" }} />
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${progress}%`, borderRadius: "2px", background: "#c8f560", transition: "width 0.1s" }} />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                    margin: 0,
                  }}
                  aria-label="Progress"
                />
              </div>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", flexShrink: 0, minWidth: "32px" }}>
                {formatTime(currentTrack.duration)}
              </span>
            </div>
          </div>

          <div className="player__right" style={{ display: "flex", alignItems: "center", gap: "12px", width: "240px", flexShrink: 0, justifyContent: "flex-end", order: 3 }}>
            <button
              type="button"
              className="player__btn player__btn--extra"
              onClick={() => setShowLyrics((s) => !s)}
              style={{ background: "transparent", border: "none", cursor: "pointer", color: showLyrics ? "#c8f560" : "rgba(255,255,255,0.4)", display: "flex", padding: "4px", transition: "color 0.15s" }}
              aria-label="Lirik"
              title="Lirik"
            >
              <FiMic size={16} />
            </button>

            <button
              type="button"
              className="player__btn player__btn--extra"
              onClick={() => setShowQueue((s) => !s)}
              style={{ background: "transparent", border: "none", cursor: "pointer", color: showQueue ? "#c8f560" : "rgba(255,255,255,0.4)", display: "flex", padding: "4px", transition: "color 0.15s" }}
              aria-label="Queue"
              title="Queue"
            >
              <FiList size={16} />
            </button>

            <div className="player__volume-wrap" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FiVolume2 size={16} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
              <div className="player__vol-bar-wrap" style={{ position: "relative", width: "80px", height: "4px" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "2px", background: "rgba(255,255,255,0.15)" }} />
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${volume}%`, borderRadius: "2px", background: "rgba(255,255,255,0.7)" }} />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                    margin: 0,
                  }}
                  aria-label="Volume"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {showQueue && (
        <QueueList
          queue={queue}
          currentIndex={currentIndex}
          onPlay={(i) => playTrack(i)}
          onRemove={(i) => removeFromQueue(i)}
          onClear={() => setQueue([])}
        />
      )}

      {showLyrics && (
        <LyricsPanel artist={currentTrack.artist} title={currentTrack.title} open={showLyrics} onClose={() => setShowLyrics(false)} />
      )}
    </div>
  );
};

export default MusicPlayer;

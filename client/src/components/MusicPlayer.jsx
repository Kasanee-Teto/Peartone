import { useState } from "react";
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
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import "../styles/MusicPlayer.css";

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

  const currentTime = Math.floor((progress / 100) * CURRENT_TRACK.duration);

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
                {CURRENT_TRACK.title}
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {CURRENT_TRACK.artist}
              </p>
            </div>
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
                {formatTime(CURRENT_TRACK.duration)}
              </span>
            </div>
          </div>

          <div className="player__right" style={{ display: "flex", alignItems: "center", gap: "12px", width: "240px", flexShrink: 0, justifyContent: "flex-end", order: 3 }}>
            <button
              type="button"
              className="player__btn player__btn--extra"
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex", padding: "4px", transition: "color 0.15s" }}
              aria-label="Lirik"
              title="Lirik"
            >
              <FiMic size={16} />
            </button>

            <button
              type="button"
              className="player__btn player__btn--extra"
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex", padding: "4px", transition: "color 0.15s" }}
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
    </div>
  );
};

export default MusicPlayer;

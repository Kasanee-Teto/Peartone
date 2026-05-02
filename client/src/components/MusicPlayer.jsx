import { useEffect, useRef, useState } from "react";
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
import { buildStreamUrl, isValidTrackId, normalizePlayableTrack, onPlayTrack } from "../utils/playerBus.js";
import { likesApi } from "../api/likes.js";
import { emitLikesChanged } from "../utils/likeBus.js";

function formatTime(sec) {
  const total = Math.max(0, Math.floor(Number(sec) || 0));
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [queue, setQueue] = useState(() => {
    try {
      const raw = localStorage.getItem("pt_queue");
      const parsed = raw ? JSON.parse(raw) : [];
      const normalized = Array.isArray(parsed)
        ? parsed
            .map(normalizePlayableTrack)
            .filter((track) => track && isValidTrackId(track.trackId))
        : [];
      return normalized.length > 0 ? normalized : [];
    } catch {
      return [];
    }
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [playerError, setPlayerError] = useState("");

  const currentTrack = queue[currentIndex] || null;
  const duration = Number(currentTrack?.duration) || 0;
  const currentTime = Math.round((progress / 100) * duration);

  useEffect(() => {
    try {
      localStorage.setItem("pt_queue", JSON.stringify(queue));
    } catch {
      // ignore
    }
  }, [queue]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const cleanup = onPlayTrack((incomingTrack) => {
      const track = normalizePlayableTrack(incomingTrack);
      if (!isValidTrackId(track.trackId)) {
        setPlayerError("Track ini belum tersedia di server.");
        return;
      }

      if (!track.streamUrl) {
        setPlayerError("Track ini belum tersedia untuk streaming.");
        return;
      }

      setQueue((currentQueue) => {
        const withoutTrack = currentQueue.filter((item) => item.id !== track.id);
        return [track, ...withoutTrack];
      });
      setCurrentIndex(0);
      setProgress(0);
      setPlayerError("");
      setShowQueue(false);
      setShowLyrics(false);
      setIsCollapsed(false);
      setIsPlaying(true);
    });

    return cleanup;
  }, []);

  useEffect(() => {
  const handleAddToQueue = (event) => {
    const track = normalizePlayableTrack(event.detail);
    if (!isValidTrackId(track.trackId)) return;
    if (!track.streamUrl) return;
 
    setQueue((currentQueue) => {
      const alreadyIn = currentQueue.some((item) => item.id === track.id);
      if (alreadyIn) return currentQueue;
      return [...currentQueue, track];
    });
  };
 
  window.addEventListener("pt:add-to-queue", handleAddToQueue);
  return () => window.removeEventListener("pt:add-to-queue", handleAddToQueue);
}, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentTrack) {
      setIsPlaying(false);
      setProgress(0);
      audio.removeAttribute("src");
      audio.load();
      return;
    }

    const source = currentTrack.streamUrl || buildStreamUrl(currentTrack);
    if (!source) {
      setPlayerError("Track ini belum tersedia untuk streaming.");
      setIsPlaying(false);
      audio.removeAttribute("src");
      audio.load();
      return;
    }

    setPlayerError("");
    setProgress(0);
    audio.src = source;
    audio.load();

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrack?.id, currentTrack?.streamUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack?.streamUrl]);

  useEffect(() => {
    if (!currentTrack?.id) {
      setIsLiked(false);
      return;
    }

    let active = true;
    likesApi
      .list()
      .then((payload) => {
        if (!active) return;
        const likedTracks = Array.isArray(payload) ? payload : payload?.data || [];
        const currentTrackId = String(currentTrack.trackId || currentTrack.id || "").trim();
        const liked = likedTracks.some((item) => String(item?.trackId || item?.Track?.id || item?.id || "").trim() === currentTrackId);
        setIsLiked(liked);
      })
      .catch(() => {
        if (active) setIsLiked(false);
      });

    return () => {
      active = false;
    };
  }, [currentTrack?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setPlayerError("");
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100 || 0);
      }
    };

    const handleTimeUpdate = () => {
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      } else if (duration > 0) {
        setProgress((audio.currentTime / duration) * 100);
      }
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
        return;
      }

      if (queue.length === 0) {
        setIsPlaying(false);
        return;
      }

      if (isShuffle && queue.length > 1) {
        const nextIndex = Math.floor(Math.random() * queue.length);
        setCurrentIndex(nextIndex);
        setIsPlaying(true);
        return;
      }

      setCurrentIndex((current) => {
        const next = current + 1;
        if (next >= queue.length) {
          setIsPlaying(false);
          return current;
        }
        setIsPlaying(true);
        return next;
      });
    };

    const handleError = () => {
      setIsPlaying(false);
      setPlayerError("Gagal memutar lagu ini.");
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [duration, isRepeat, isShuffle, queue.length]);

  function addToQueue(track) {
    const item = normalizePlayableTrack(track);
    if (!item.streamUrl) {
      setPlayerError("Track ini belum tersedia untuk streaming.");
      return;
    }

    setQueue((currentQueue) => [...currentQueue, item]);
    setShowQueue(true);
  }

  function removeFromQueue(idx) {
    setQueue((currentQueue) => {
      const copy = currentQueue.slice();
      copy.splice(idx, 1);

      setCurrentIndex((current) => {
        if (copy.length === 0) return 0;
        if (idx < current) return current - 1;
        if (idx === current) return Math.min(current, copy.length - 1);
        return current;
      });

      if (copy.length === 0) {
        setIsPlaying(false);
      }

      return copy;
    });
  }

  function playTrack(idx) {
    if (idx < 0 || idx >= queue.length) return;
    setCurrentIndex(idx);
    setIsPlaying(true);
    setIsCollapsed(false);
  }

  function playNext() {
    if (queue.length === 0) return;

    if (isShuffle && queue.length > 1) {
      setCurrentIndex(() => Math.floor(Math.random() * queue.length));
      setIsPlaying(true);
      return;
    }

    setCurrentIndex((current) => {
      const next = current + 1;
      if (next >= queue.length) {
        if (isRepeat) {
          const audio = audioRef.current;
          if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => setIsPlaying(false));
          }
          return current;
        }
        setIsPlaying(false);
        return current;
      }
      setIsPlaying(true);
      return next;
    });
  }

  function playPrev() {
    setCurrentIndex((current) => Math.max(0, current - 1));
    setIsPlaying(true);
  }

  function toggleProgress(event) {
    const next = Number(event.target.value);
    setProgress(next);

    const audio = audioRef.current;
    const total = audio?.duration || duration;
    if (audio && total > 0) {
      audio.currentTime = (next / 100) * total;
    }
  }

  function togglePlay() {
    if (!currentTrack?.streamUrl) {
      setPlayerError("Track ini belum tersedia untuk streaming.");
      return;
    }

    if (!isPlaying && progress >= 99 && duration > 0) {
      const audio = audioRef.current;
      if (audio) audio.currentTime = 0;
      setProgress(0);
    }

    setIsPlaying((state) => !state);
  }

  async function toggleLike() {
    const trackId = currentTrack?.trackId || currentTrack?.id;
    console.log("Debug Track ID:", trackId);

    if (!isValidTrackId(trackId)) {
      setPlayerError("Track ini belum tersimpan di server.");
      return;
    }

    try {
      const response = await likesApi.toggle(trackId);
      const nextLiked = Boolean(response?.data?.liked ?? response?.liked);
      setIsLiked(nextLiked);
      emitLikesChanged();
    } catch (error) {
      setPlayerError(error.message || "Gagal memperbarui like");
    }
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
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <audio ref={audioRef} preload="metadata" />
      {isCollapsed ? (
        <button
          type="button"
          onClick={() => {
            setIsCollapsed(false);
          }}
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
            onClick={() => {
              setIsCollapsed(true);
              setShowQueue(false);
              setShowLyrics(false);
            }}
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
                {currentTrack?.title || "Belum ada lagu diputar"}
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {currentTrack?.artist || "Pilih lagu untuk mulai"}
              </p>
              {playerError && (
                <p style={{ margin: "4px 0 0", fontSize: "10px", color: "#ffb3b3", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {playerError}
                </p>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                type="button"
                onClick={toggleLike}
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
                disabled={!isValidTrackId(String(currentTrack?.trackId || currentTrack?.id || "").trim())}
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
                onClick={playPrev}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", display: "flex", padding: "4px" }}
                aria-label="Previous"
              >
                <FiSkipBack size={20} />
              </button>

              <button
                type="button"
                onClick={togglePlay}
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
                onClick={playNext}
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
                  onChange={toggleProgress}
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
                {formatTime(duration)}
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
                  onChange={(event) => setVolume(Number(event.target.value))}
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
          onClear={() => {
            setQueue([]);
            setCurrentIndex(0);
            setIsPlaying(false);
            setProgress(0);
          }}
        />
      )}

      {showLyrics && (
        <LyricsPanel key={currentTrack?.id || "no-track"} trackId={currentTrack?.id} artist={currentTrack?.artist} title={currentTrack?.title} open={showLyrics} onClose={() => setShowLyrics(false)} />
      )}
    </div>
  );
};

export default MusicPlayer;

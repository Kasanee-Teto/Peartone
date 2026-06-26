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
import LyricsPanel from "./LyricsPanel";
import QueueList from "./QueueList";
import { buildStreamUrl, isValidTrackId, normalizePlayableTrack, onPlayTrack } from "../utils/playerBus.js";
import { likesApi } from "../api/likes.js";
import { historyApi } from "../api/history.js";
import { emitLikesChanged } from "../utils/likeBus.js";

function formatTime(sec) {
  const total = Math.max(0, Math.floor(Number(sec) || 0));
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const lastHistoryTrackIdRef = useRef("");
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
        ? parsed.map(normalizePlayableTrack).filter((track) => track && isValidTrackId(track.trackId))
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
        setPlayerError("This track is not found at the server.");
        return;
      }
      if (!track.streamUrl) {
        setPlayerError("This track is not available for streaming.");
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
      if (!isValidTrackId(track.trackId) || !track.streamUrl) return;
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
    const handleClearQueue = () => {
      setQueue([]);
      setCurrentIndex(0);
      setIsPlaying(false);
      setProgress(0);
    };

    window.addEventListener("pt:clear-queue", handleClearQueue);
    return () => window.removeEventListener("pt:clear-queue", handleClearQueue);
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
      setPlayerError("This track is not available for streaming.");
      setIsPlaying(false);
      audio.removeAttribute("src");
      audio.load();
      return;
    }

    setPlayerError("");
    setProgress(0);
    audio.src = source;
    audio.load();

    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
  }, [currentTrack?.id, currentTrack?.streamUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
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
        const liked = likedTracks.some(
          (item) => String(item?.trackId || item?.Track?.id || item?.id || "").trim() === currentTrackId
        );
        setIsLiked(liked);
      })
      .catch(() => {
        if (active) setIsLiked(false);
      });

    return () => {
      active = false;
    };
  }, [currentTrack?.id, currentTrack?.trackId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const trackId = String(currentTrack?.trackId || currentTrack?.id || "").trim();

    if (!token || !isValidTrackId(trackId) || !isPlaying) return;
    if (lastHistoryTrackIdRef.current === trackId) return;

    const timer = setTimeout(() => {
      if (lastHistoryTrackIdRef.current === trackId) return;
      lastHistoryTrackIdRef.current = trackId;
      historyApi.add({ trackId }).catch(() => {
        lastHistoryTrackIdRef.current = "";
      });
    }, 15000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentTrack?.id, currentTrack?.trackId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setPlayerError("");
      if (audio.duration > 0) setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleTimeUpdate = () => {
      if (audio.duration > 0) setProgress((audio.currentTime / audio.duration) * 100);
      else if (duration > 0) setProgress((audio.currentTime / duration) * 100);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
        return;
      }

      if (queue.length === 0) return setIsPlaying(false);

      if (isShuffle && queue.length > 1) {
        setCurrentIndex(Math.floor(Math.random() * queue.length));
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
      setPlayerError("Failed to load this track.");
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
      setPlayerError("This track is not available for streaming.");
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

      if (copy.length === 0) setIsPlaying(false);
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
      setCurrentIndex(Math.floor(Math.random() * queue.length));
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
    if (audio && total > 0) audio.currentTime = (next / 100) * total;
  }

  function togglePlay() {
    if (!currentTrack?.streamUrl) {
      setPlayerError("This track is not available for streaming.");
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

    if (!isValidTrackId(trackId)) {
      setPlayerError("This track is not found at the server.");
      return;
    }

    try {
      const response = await likesApi.toggle(trackId);
      const nextLiked = Boolean(response?.data?.liked ?? response?.liked);
      setIsLiked(nextLiked);
      emitLikesChanged();
    } catch (error) {
      setPlayerError(error.message || "Failed to update like");
    }
  }

  const baseIconBtn =
    "inline-flex items-center justify-center p-1 text-white/50 transition hover:text-white";
  const activeIcon = "text-[#c8f560]";

  return (
    <div className="fixed inset-x-0 bottom-0 z-[300] flex justify-end pointer-events-none">
      <audio ref={audioRef} preload="metadata" />

      {isCollapsed ? (
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="pointer-events-auto mr-6 flex items-center justify-center p-0 text-white/85 hover:text-white"
          aria-label="Show music player"
          title="Show music player"
        >
          <FiChevronUp size={18} />
        </button>
      ) : (
        <div className="pointer-events-auto relative flex h-20 w-full items-center gap-4 border-t border-white/10 bg-[#0d0d0feb] px-6 text-white backdrop-blur-xl">
          <button
            type="button"
            onClick={() => {
              setIsCollapsed(true);
              setShowQueue(false);
              setShowLyrics(false);
            }}
            className="order-4 ml-auto flex shrink-0 items-center justify-center p-0 text-white/85 hover:text-white"
            aria-label="Hide music player"
            title="Hide music player"
          >
            <FiChevronDown size={18} />
          </button>

          <div className="order-1 flex w-[240px] shrink-0 items-center gap-3 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c6af7] to-[#c8f560] text-xl">
              ♪
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold">
                {currentTrack?.title || "No track played"}
              </p>
              <p className="truncate text-[11px] text-white/45">
                {currentTrack?.artist || "Choose a track to start listening"}
              </p>
              {playerError && <p className="mt-1 truncate text-[10px] text-red-200">{playerError}</p>}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleLike}
                className={`${baseIconBtn} ${isLiked ? activeIcon : ""}`}
                aria-label={isLiked ? "Unlike" : "Like"}
                disabled={!isValidTrackId(String(currentTrack?.trackId || currentTrack?.id || "").trim())}
              >
                <FiHeart size={16} fill={isLiked ? "currentColor" : "none"} />
              </button>

              <button
                type="button"
                onClick={() => addToQueue(currentTrack)}
                title="Add to queue"
                className={baseIconBtn}
              >
                <FiPlus size={14} />
              </button>
            </div>
          </div>

          <div className="order-2 flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsShuffle(!isShuffle)}
                className={`${baseIconBtn} ${isShuffle ? activeIcon : ""}`}
                aria-label="Shuffle"
              >
                <FiShuffle size={16} />
              </button>

              <button type="button" className="inline-flex p-1 text-white/70 hover:text-white" onClick={playPrev} aria-label="Previous">
                <FiSkipBack size={20} />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0d0d0f] shadow-[0_4px_16px_rgba(255,255,255,0.15)] transition hover:scale-105"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <FiPause size={18} fill="currentColor" /> : <FiPlay size={18} fill="currentColor" className="ml-[2px]" />}
              </button>

              <button type="button" className="inline-flex p-1 text-white/70 hover:text-white" onClick={playNext} aria-label="Next">
                <FiSkipForward size={20} />
              </button>

              <button
                type="button"
                onClick={() => setIsRepeat(!isRepeat)}
                className={`${baseIconBtn} ${isRepeat ? activeIcon : ""}`}
                aria-label="Repeat"
              >
                <FiRepeat size={16} />
              </button>
            </div>

            <div className="flex w-full max-w-[480px] items-center gap-2">
              <span className="min-w-8 shrink-0 text-right text-[11px] text-white/40">{formatTime(currentTime)}</span>
              <div className="relative h-1 flex-1">
                <div className="absolute inset-0 rounded-sm bg-white/15" />
                <div
                  className="absolute bottom-0 left-0 top-0 rounded-sm bg-[#c8f560] transition-[width] duration-100"
                  style={{ width: `${progress}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={toggleProgress}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Progress"
                />
              </div>
              <span className="min-w-8 shrink-0 text-[11px] text-white/40">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="order-3 flex w-[240px] shrink-0 items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowLyrics((s) => !s)}
              className={`${baseIconBtn} ${showLyrics ? activeIcon : ""}`}
              aria-label="Lyric"
              title="Lyric"
            >
              <FiMic size={16} />
            </button>

            <button
              type="button"
              onClick={() => setShowQueue((s) => !s)}
              className={`${baseIconBtn} ${showQueue ? activeIcon : ""}`}
              aria-label="Queue"
              title="Queue"
            >
              <FiList size={16} />
            </button>

            <div className="ml-1 flex items-center gap-1.5">
              <FiVolume2 size={16} className="shrink-0 text-white/40" />
              <div className="relative h-1 w-20">
                <div className="absolute inset-0 rounded-sm bg-white/15" />
                <div className="absolute bottom-0 left-0 top-0 rounded-sm bg-white/70" style={{ width: `${volume}%` }} />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
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
        <LyricsPanel
          key={currentTrack?.id || "no-track"}
          trackId={currentTrack?.id}
          artist={currentTrack?.artist}
          title={currentTrack?.title}
          open={showLyrics}
          onClose={() => setShowLyrics(false)}
        />
      )}
    </div>
  );
};

export default MusicPlayer;
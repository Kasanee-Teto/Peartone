import { useEffect, useRef, useState } from "react";
import {
  FiPlay, FiPause, FiSkipBack, FiSkipForward,
  FiShuffle, FiRepeat, FiHeart, FiVolume2,
  FiList, FiMic, FiPlus, FiChevronUp, FiChevronDown,
} from "react-icons/fi";
import LyricsPanel from "./LyricsPanel";
import QueueList from "./QueueList";
import { buildStreamUrl, isValidTrackId, normalizePlayableTrack, onPlayTrack } from "../utils/playerBus.js";
import { likesApi } from "../api/likes.js";
import { historyApi } from "../api/history.js";
import { emitLikesChanged } from "../utils/likeBus.js";
import { formatTime } from "../utils/format.js";
import { buildCoverUrl } from "../api/client.js";

/**
 * Small play/pause toggle button.
 * @param {boolean} isPlaying - Whether the track is currently playing.
 * @param {() => void} onToggle - Called when the button is pressed.
 * @param {"sm"|"md"} [size="md"] - Visual size variant.
 */
const PlayButton = ({ isPlaying, onToggle, size = "md" }) => {
  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconSize = size === "sm" ? 14 : 16;
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`${dim} shrink-0 flex items-center justify-center rounded-full bg-white text-[#0d0d0f] shadow-md transition hover:scale-105 active:scale-95`}
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      {isPlaying
        ? <FiPause size={iconSize} fill="currentColor" />
        : <FiPlay size={iconSize} fill="currentColor" className="ml-[2px]" />}
    </button>
  );
};

/**
 * Seekable progress bar showing elapsed / total time.
 * @param {number} currentTime - Current playback position in seconds.
 * @param {number} duration - Total track duration in seconds.
 * @param {number} progress - Playback progress as a 0-100 percentage.
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} onSeek - Fired while dragging the seek slider.
 */
const ProgressBar = ({ currentTime, duration, progress, onSeek }) => (
  <div className="flex w-full items-center gap-2">
    <span className="w-8 shrink-0 text-right text-[10px] font-mono text-white/40">
      {formatTime(currentTime)}
    </span>
    <div className="relative h-1 flex-1 py-2 flex items-center group">
      <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full bg-[#c8f560] transition-all" style={{ width: `${progress}%` }} />
      </div>
      <input
        type="range" min={0} max={100} value={progress}
        onChange={onSeek}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10"
        aria-label="Seek"
      />
    </div>
    <span className="w-8 shrink-0 text-left text-[10px] font-mono text-white/40">
      {formatTime(duration)}
    </span>
  </div>
);

/**
 * Cover artwork for the currently playing track.
 *
 * Renders the track's cover image when one is available and loads
 * successfully. Falls back to a gradient "♪" placeholder when there is
 * no cover URL, or when the image fails to load (404, CORS, etc).
 *
 * The failure state is tracked in local component state (not a global
 * store) and is reset whenever the active track changes, so a broken
 * image on track A doesn't "stick" and hide the artwork for track B.
 *
 * @param {object|null} track - The currently playing track (or null).
 * @param {string} sizeClass - Tailwind size classes, e.g. "h-14 w-14".
 * @param {string} textSizeClass - Tailwind text-size class for the fallback glyph.
 */
const TrackCoverArt = ({ track, sizeClass, textSizeClass }) => {
  const [failed, setFailed] = useState(false);
  const rawCover = track?.cover || track?.coverUrl || "";
  const src = rawCover ? buildCoverUrl(rawCover) : "";

  // Reset the failure flag whenever the track changes so a previous
  // broken image doesn't suppress artwork for a new, valid track.
  useEffect(() => {
    setFailed(false);
  }, [track?.id]);

  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c6af7] to-[#c8f560] ${textSizeClass} font-semibold shadow-md overflow-hidden`}
    >
      {showImage ? (
        <img
          src={src}
          alt={track?.title || "Track cover"}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        "♪"
      )}
    </div>
  );
};

/**
 * Global, persistent bottom music player.
 *
 * Responsibilities (candidates for extraction — see architecture notes
 * at the bottom of this file):
 *  - Owns the single <audio> element and its playback state
 *  - Maintains the play queue (persisted to localStorage)
 *  - Listens for cross-app events (play track, add/remove/set/clear queue)
 *  - Tracks "liked" state and reports listening history for the current track
 *  - Renders three responsive layouts (mobile / tablet / desktop)
 */
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
        ? parsed.map(normalizePlayableTrack).filter((t) => t && isValidTrackId(t.trackId))
        : [];
      return normalized;
    } catch { return []; }
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [playerError, setPlayerError] = useState("");

  const currentTrack = queue[currentIndex] || null;
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Persist the queue across reloads.
  useEffect(() => {
    try { localStorage.setItem("pt_queue", JSON.stringify(queue)); } catch {}
  }, [queue]);

  // Keep the <audio> element's volume in sync with the volume slider.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume / 100;
  }, [volume]);

  // Listen for "play this track now" events fired from anywhere in the app
  // (track rows, cards, search results, etc). Replaces the current queue
  // head with the requested track and starts playback immediately.
  useEffect(() => {
    return onPlayTrack((incomingTrack) => {
      const track = normalizePlayableTrack(incomingTrack);
      if (!isValidTrackId(track.trackId)) { setPlayerError("Track not found."); return; }
      if (!track.streamUrl) { setPlayerError("Track not available for streaming."); return; }
      setQueue((q) => [track, ...q.filter((item) => item.id !== track.id)]);
      setCurrentIndex(0);
      setProgress(0);
      setCurrentTime(0);
      setPlayerError("");
      setShowQueue(false);
      setShowLyrics(false);
      setIsCollapsed(false);
      setIsPlaying(true);
    });
  }, []);

  // Listen for bulk "set queue" events (e.g. "play this whole album/playlist").
  useEffect(() => {
    const handleSetQueue = (e) => {
      const incomingTracks = Array.isArray(e.detail) ? e.detail : [e.detail];
      const normalizedTracks = incomingTracks
        .map(normalizePlayableTrack)
        .filter((t) => t && isValidTrackId(t.trackId || t.id) && t.streamUrl);

      if (normalizedTracks.length === 0) return;

      setQueue((currentQueue) => {
        if (currentIndex === 0 && currentQueue.length <= 1) {
          return [currentQueue[0], ...normalizedTracks].filter(Boolean);
        }
        return [...currentQueue, ...normalizedTracks];
      });
    };

    window.addEventListener("pt:set-queue", handleSetQueue);
    return () => window.removeEventListener("pt:set-queue", handleSetQueue);
  }, [currentIndex]);

  // Listen for "append single track to queue" events.
  useEffect(() => {
    const handler = (e) => {
      const track = normalizePlayableTrack(e.detail);
      if (!isValidTrackId(track.trackId) || !track.streamUrl) return;
      setQueue((q) => q.some((item) => item.id === track.id) ? q : [...q, track]);
    };
    window.addEventListener("pt:add-to-queue", handler);
    return () => window.removeEventListener("pt:add-to-queue", handler);
  }, []);

  // Listen for "clear the whole queue" events.
  useEffect(() => {
    const handler = () => {
      setQueue([]); setCurrentIndex(0); setIsPlaying(false); setProgress(0);
    };
    window.addEventListener("pt:clear-queue", handler);
    return () => window.removeEventListener("pt:clear-queue", handler);
  }, []);

  // Load and (attempt to) auto-play whenever the active track changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!currentTrack) {
      setIsPlaying(false); setProgress(0); setDuration(0);
      audio.removeAttribute("src"); audio.load(); return;
    }
    const source = currentTrack.streamUrl || buildStreamUrl(currentTrack);
    if (!source) {
      setPlayerError("Track not available for streaming.");
      setIsPlaying(false); audio.removeAttribute("src"); audio.load(); return;
    }
    setPlayerError(""); setProgress(0); setDuration(0);
    audio.src = source; audio.load();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (err.name !== "AbortError") {
          setIsPlaying(false);
        }
      });
    }
  }, [currentTrack?.id]);

  // React to explicit play/pause toggles (separate from track-change autoplay above).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let isCurrent = true;
    let timeoutId = null;

    if (isPlaying) {
      timeoutId = setTimeout(() => {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            if (!isCurrent) audio.pause();
          }).catch((err) => {
            if (err.name !== "AbortError") setIsPlaying(false);
          });
        }
      }, 50);
    } else {
      audio.pause();
    }

    return () => {
      isCurrent = false;
      if (timeoutId) clearTimeout(timeoutId);
    }
  }, [isPlaying]);

  // Sync the "liked" heart icon whenever the current track changes.
  useEffect(() => {
    if (!currentTrack?.id) { setIsLiked(false); return; }
    let active = true;
    likesApi.list().then((payload) => {
      if (!active) return;
      const likedTracks = Array.isArray(payload) ? payload : payload?.data || [];
      const tid = String(currentTrack.trackId || currentTrack.id || "").trim();
      setIsLiked(likedTracks.some((item) =>
        String(item?.trackId || item?.Track?.id || item?.id || "").trim() === tid
      ));
    }).catch(() => { if (active) setIsLiked(false); });
    return () => { active = false; };
  }, [currentTrack?.id, currentTrack?.trackId]);

  // Report a listening-history entry after 15s of continuous playback,
  // once per track, only for authenticated users.
  useEffect(() => {
    const token = localStorage.getItem("token");
    const trackId = String(currentTrack?.trackId || currentTrack?.id || "").trim();
    if (!token || !isValidTrackId(trackId) || !isPlaying) return;
    if (lastHistoryTrackIdRef.current === trackId) return;
    const timer = setTimeout(() => {
      if (lastHistoryTrackIdRef.current === trackId) return;
      lastHistoryTrackIdRef.current = trackId;
      historyApi.add({ trackId }).catch(() => { lastHistoryTrackIdRef.current = ""; });
    }, 15000);
    return () => clearTimeout(timer);
  }, [isPlaying, currentTrack?.id, currentTrack?.trackId]);

  // Wire up native <audio> element events (metadata, time updates, end-of-track,
  // errors) plus the "remove from queue" cross-app event.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setPlayerError("");
      setCurrentTime(0);
      setDuration(audio.duration || 0);
      setProgress(0);
    };

    const handleTimeUpdate = () => {
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      if (isRepeat) { audio.currentTime = 0; audio.play().catch((err) => { if (err.name !== "AbortError") setIsPlaying(false) }); return; }
      if (queue.length === 0) return setIsPlaying(false);
      if (isShuffle && queue.length > 1) {
        setCurrentIndex(Math.floor(Math.random() * queue.length));
        setIsPlaying(true); return;
      }
      setCurrentIndex((curr) => {
        const next = curr + 1;
        const nextIndex = next >= queue.length ? 0 : next;
        setIsPlaying(true); return nextIndex;
      });
    };

    const handleRemoved = (e) => {
      const targetId = String(e.detail?.TrackId || "").trim();
      if (!targetId) return;

      setQueue((curr) => {
        const idx = curr.findIndex(track =>
          String(track.trackId || track.id || "").trim() === targetId
        );

        if (idx === -1) return curr;
        const copy = curr.slice();
        copy.splice(idx, 1);

        setCurrentIndex(curr => {
          if (copy.length === 0) return 0;
          if (idx < curr) return curr - 1;
          if (idx === curr) return Math.min(curr, copy.length - 1);
          return curr;
        });

        if (copy.length === 0) setIsPlaying(false);
        return copy;
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
    window.addEventListener("pt:remove-from-queue", handleRemoved);
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      window.removeEventListener("pt:remove-from-queue", handleRemoved);
    };
  }, [duration, isRepeat, isShuffle, queue.length]);

  /** Append a track to the end of the queue and open the queue panel. */
  function addToQueue(track) {
    const item = normalizePlayableTrack(track);
    if (!item.streamUrl) {
      setPlayerError("Track not available for streaming."); return;
    }
    setQueue((q) => [...q, item]);
    setShowQueue(true);
  }

  /** Remove a track from the queue by index, adjusting currentIndex as needed. */
  function removeFromQueue(idx) {
    setQueue((q) => {
      const copy = q.slice();
      copy.splice(idx, 1);
      setCurrentIndex((cur) => {
        if (copy.length === 0) return 0;
        if (idx < cur) return cur - 1;
        if (idx === cur) return Math.min(cur, copy.length - 1);
        return cur;
      });
      if (copy.length === 0) setIsPlaying(false);
      return copy;
    });
  }

  /** Jump to and play a specific queue index. */
  function playTrack(idx) {
    if (idx < 0 || idx >= queue.length) return;
    setCurrentIndex(idx); setIsPlaying(true); setIsCollapsed(false);
  }

  /** Advance to the next track, respecting shuffle mode. */
  function playNext() {
    if (queue.length === 0) return;
    let nextIndex;
    if (isShuffle && queue.length > 1) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        nextIndex = 0;
      }
    }
    setCurrentIndex(nextIndex);
    setProgress(0);
    setIsPlaying(true);
  }

  /** Go back to the previous track (clamped at index 0). */
  function playPrev() {
    const prevIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(prevIndex);
    setProgress(0);
    setIsPlaying(true);
  }

  /** Seek handler for the progress slider (0-100 -> audio.currentTime). */
  function toggleProgress(e) {
    const next = Number(e.target.value);
    setProgress(next);
    const audio = audioRef.current;
    const total = audio?.duration || duration;
    if (audio && total > 0) audio.currentTime = (next / 100) * total;
  }

  /** Toggle play/pause; restarts from 0 if the track had already ended. */
  function togglePlay() {
    if (!currentTrack?.streamUrl) { setPlayerError("Track not available for streaming."); return; }
    if (!isPlaying && progress >= 99 && duration > 0) {
      const audio = audioRef.current;
      if (audio) audio.currentTime = 0;
      setProgress(0);
    }
    setIsPlaying((s) => !s);
  }

  /** Toggle the liked state of the current track via the likes API. */
  async function toggleLike() {
    const trackId = currentTrack?.trackId || currentTrack?.id;
    if (!isValidTrackId(trackId)) { setPlayerError("Track not found."); return; }
    try {
      const response = await likesApi.toggle(trackId);
      setIsLiked(Boolean(response?.data?.liked ?? response?.liked));
      emitLikesChanged();
    } catch (err) { setPlayerError(err.message || "Failed to update like"); }
  }

  const iconBtn = "inline-flex items-center justify-center rounded-full p-1.5 text-white/50 transition-all hover:text-white hover:bg-white/5";
  const activeIcon = "text-[#c8f560] hover:text-[#c8f560]";

  return (
    <div className="fixed inset-x-0 bottom-0 z-[300] pointer-events-none">
      <audio ref={audioRef} preload="metadata" />

      {/* Floating "reopen player" button shown when the player is collapsed */}
      <div className={`fixed right-4 bottom-4 z-[310] ${isCollapsed ? "block" : "hidden"}`}>
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#1c1c1f] text-white/85 shadow-lg border border-white/5 hover:text-white hover:scale-105 active:scale-95 transition-all"
          aria-label="Show music player"
        >
          <FiChevronUp size={20} />
        </button>
      </div>

      <div className={`pointer-events-auto w-full border-t border-white/5 bg-[#0a0a0cd6] backdrop-blur-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)] text-white ${isCollapsed ? "hidden" : ""}`}>

        {/* ---------- Mobile layout (< sm) ---------- */}
        <div className="flex flex-col sm:hidden px-4 pt-3 pb-2 gap-2">
          <div className="flex items-center gap-3">
            <TrackCoverArt track={currentTrack} sizeClass="h-10 w-10" textSizeClass="text-base" />

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white/95">{currentTrack?.title || "No track"}</p>
              <p className="truncate text-[10px] text-white/50">{currentTrack?.artist || "Start listening"}</p>
              {playerError && <p className="truncate text-[9px] text-red-400">{playerError}</p>}
            </div>
            <button type="button" onClick={toggleLike} className={`${iconBtn} shrink-0`} aria-label={isLiked ? "Unlike" : "Like"}>
              <FiHeart size={15} className={isLiked ? "text-[#c8f560]" : ""} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <PlayButton isPlaying={isPlaying} onToggle={togglePlay} />
          </div>

          <ProgressBar currentTime={currentTime} duration={duration} progress={progress} onSeek={toggleProgress}/>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setIsShuffle((s) => !s)} className={`${iconBtn} ${isShuffle ? activeIcon : ""}`} aria-label="Shuffle">
                <FiShuffle size={13} />
              </button>
              <button type="button" onClick={playPrev} className={iconBtn} aria-label="Previous"><FiSkipBack size={16} /></button>
              <button type="button" onClick={playNext} className={iconBtn} aria-label="Next"><FiSkipForward size={16} /></button>
              <button type="button" onClick={() => setIsRepeat((s) => !s)} className={`${iconBtn} ${isRepeat ? activeIcon : ""}`} aria-label="Repeat">
                <FiRepeat size={13} />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setShowLyrics((s) => !s)} className={`${iconBtn} ${showLyrics ? activeIcon : ""}`} aria-label="Lyrics"><FiMic size={14} /></button>
              <button type="button" onClick={() => setShowQueue((s) => !s)} className={`${iconBtn} ${showQueue ? activeIcon : ""}`} aria-label="Queue"><FiList size={14} /></button>
              <button type="button" onClick={() => setIsCollapsed(true)} className={`${iconBtn}`} aria-label="Collapse"><FiChevronDown size={16} /></button>
            </div>
          </div>
        </div>

        {/* ---------- Tablet layout (sm - lg) ---------- */}
        <div className="hidden sm:flex lg:hidden flex-col px-5 pt-3 pb-2 gap-1.5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <TrackCoverArt track={currentTrack} sizeClass="h-11 w-11" textSizeClass="text-lg" />

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white/95 max-w-[180px]">{currentTrack?.title || "No track"}</p>
                <p className="truncate text-xs text-white/50">{currentTrack?.artist || "Start listening"}</p>
                {playerError && <p className="text-[9px] text-red-400 truncate">{playerError}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button type="button" onClick={() => setIsShuffle((s) => !s)} className={`${iconBtn} ${isShuffle ? activeIcon : ""}`}><FiShuffle size={14} /></button>
              <button type="button" onClick={playPrev} className={iconBtn}><FiSkipBack size={17} /></button>
              <PlayButton isPlaying={isPlaying} onToggle={togglePlay} size="sm" />
              <button type="button" onClick={playNext} className={iconBtn}><FiSkipForward size={17} /></button>
              <button type="button" onClick={() => setIsRepeat((s) => !s)} className={`${iconBtn} ${isRepeat ? activeIcon : ""}`}><FiRepeat size={14} /></button>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button type="button" onClick={toggleLike} className={iconBtn}><FiHeart size={15} className={isLiked ? "text-[#c8f560]" : ""} fill={isLiked ? "currentColor" : "none"} /></button>
              <button type="button" onClick={() => setShowLyrics((s) => !s)} className={`${iconBtn} ${showLyrics ? activeIcon : ""}`}><FiMic size={14} /></button>
              <button type="button" onClick={() => setShowQueue((s) => !s)} className={`${iconBtn} ${showQueue ? activeIcon : ""}`}><FiList size={14} /></button>
              <button type="button" onClick={() => setIsCollapsed(true)} className={iconBtn}><FiChevronDown size={16} /></button>
            </div>
          </div>
          <ProgressBar currentTime={currentTime} duration={duration} progress={progress} onSeek={toggleProgress}/>
        </div>

        {/* ---------- Desktop layout (lg+) ---------- */}
        <div className="hidden lg:grid lg:grid-cols-3 h-24 items-center px-8">
          <div className="flex items-center gap-4 min-w-0 justify-self-start">
            <TrackCoverArt track={currentTrack} sizeClass="h-14 w-14" textSizeClass="text-xl" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white/95 max-w-[200px]">{currentTrack?.title || "No track played"}</p>
              <p className="truncate text-xs text-white/50">{currentTrack?.artist || "Start listening"}</p>
              {playerError && <p className="text-[9px] text-red-400 truncate">{playerError}</p>}
            </div>
            <div className="flex items-center gap-0.5 ml-1 shrink-0">
              <button type="button" onClick={toggleLike} className={iconBtn} disabled={!isValidTrackId(String(currentTrack?.trackId || currentTrack?.id || "").trim())}>
                <FiHeart size={15} className={isLiked ? "text-[#c8f560]" : ""} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <button type="button" onClick={() => addToQueue(currentTrack)} className={iconBtn} title="Add to queue"><FiPlus size={16} /></button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 w-full max-w-[480px] justify-self-center">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setIsShuffle((s) => !s)} className={`${iconBtn} ${isShuffle ? activeIcon : ""}`}><FiShuffle size={14} /></button>
              <button type="button" onClick={playPrev} className={iconBtn} aria-label="Previous"><FiSkipBack size={18} /></button>
              <PlayButton isPlaying={isPlaying} onToggle={togglePlay} />
              <button type="button" onClick={playNext} className={iconBtn} aria-label="Next"><FiSkipForward size={18} /></button>
              <button type="button" onClick={() => setIsRepeat((s) => !s)} className={`${iconBtn} ${isRepeat ? activeIcon : ""}`}><FiRepeat size={14} /></button>
            </div>
            <ProgressBar currentTime={currentTime} duration={duration} progress={progress} onSeek={toggleProgress}/>
          </div>

          <div className="flex items-center justify-end gap-2.5 justify-self-end shrink-0">
            <button type="button" onClick={() => setShowLyrics((s) => !s)} className={`${iconBtn} ${showLyrics ? activeIcon : ""}`} aria-label="Lyrics"><FiMic size={15} /></button>
            <button type="button" onClick={() => setShowQueue((s) => !s)} className={`${iconBtn} ${showQueue ? activeIcon : ""}`} aria-label="Queue"><FiList size={15} /></button>
            <div className="flex items-center gap-1.5 group">
              <FiVolume2 size={15} className="shrink-0 text-white/50 group-hover:text-white transition" />
              <div className="relative h-1 w-20 py-2 flex items-center">
                <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-white/80 group-hover:bg-[#c8f560] transition-colors" style={{ width: `${volume}%` }} />
                </div>
                <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10" aria-label="Volume" />
              </div>
            </div>
            <div className="h-3.5 w-px bg-white/10 mx-0.5" />
            <button type="button" onClick={() => { setIsCollapsed(true); setShowQueue(false); setShowLyrics(false); }} className={`${iconBtn} h-7 w-7`} aria-label="Hide player"><FiChevronDown size={18} /></button>
          </div>
        </div>
      </div>

      {!isCollapsed && showQueue && (
        <QueueList queue={queue} currentIndex={currentIndex}
          onPlay={playTrack} onRemove={removeFromQueue}
          onClear={() => { setQueue([]); setCurrentIndex(0); setIsPlaying(false); setProgress(0); }}
        />
      )}
      {!isCollapsed && showLyrics && (
        <LyricsPanel key={currentTrack?.id || "no-track"}
          trackId={currentTrack?.id} artist={currentTrack?.artist}
          title={currentTrack?.title} open={showLyrics}
          onClose={() => setShowLyrics(false)} currentTime={currentTime}
        />
      )}
    </div>
  );
};

export default MusicPlayer;
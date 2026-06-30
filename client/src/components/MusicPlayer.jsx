// MusicPlayer.jsx — fully responsive rewrite
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

function formatTime(sec) {
  const total = Math.max(0, Math.floor(Number(sec) || 0));
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

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

  useEffect(() => {
    try { localStorage.setItem("pt_queue", JSON.stringify(queue)); } catch {}
  }, [queue]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume / 100;
  }, [volume]);

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

  useEffect(() => {
    const handler = (e) => {
      const track = normalizePlayableTrack(e.detail);
      if (!isValidTrackId(track.trackId) || !track.streamUrl) return;
      setQueue((q) => q.some((item) => item.id === track.id) ? q : [...q, track]);
    };
    window.addEventListener("pt:add-to-queue", handler);
    return () => window.removeEventListener("pt:add-to-queue", handler);
  }, []);

  useEffect(() => {
    const handler = () => { 
      setQueue([]); setCurrentIndex(0); setIsPlaying(false); setProgress(0); };
    window.addEventListener("pt:clear-queue", handler);
    return () => window.removeEventListener("pt:clear-queue", handler);
  }, []);

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

    const handleError = () => { setIsPlaying(false);    
      
    setPlayerError("Failed to load this track."); };

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

  function addToQueue(track) {
    const item = normalizePlayableTrack(track);
    if (!item.streamUrl) { 
      setPlayerError("Track not available for streaming."); return; 
    }
    setQueue((q) => [...q, item]);
    setShowQueue(true);
  }

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

  function playTrack(idx) {
    if (idx < 0 || idx >= queue.length) return;
    setCurrentIndex(idx); setIsPlaying(true); setIsCollapsed(false);
  }

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

  function playPrev() {
    const prevIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(prevIndex);
    setProgress(0);
    setIsPlaying(true);
  }

  function toggleProgress(e) {
    const next = Number(e.target.value);
    setProgress(next);
    const audio = audioRef.current;
    const total = audio?.duration || duration;
    if (audio && total > 0) audio.currentTime = (next / 100) * total;
  }

  function togglePlay() {
    if (!currentTrack?.streamUrl) { setPlayerError("Track not available for streaming."); return; }
    if (!isPlaying && progress >= 99 && duration > 0) {
      const audio = audioRef.current;
      if (audio) audio.currentTime = 0;
      setProgress(0);
    }
    setIsPlaying((s) => !s);
  }

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

        <div className="flex flex-col sm:hidden px-4 pt-3 pb-2 gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c6af7] to-[#c8f560] text-base font-semibold shadow-md">♪</div>

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

        <div className="hidden sm:flex lg:hidden flex-col px-5 pt-3 pb-2 gap-1.5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c6af7] to-[#c8f560] text-lg font-semibold shadow-md">♪</div>
              
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

        <div className="hidden lg:grid lg:grid-cols-3 h-24 items-center px-8">
          <div className="flex items-center gap-4 min-w-0 justify-self-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c6af7] to-[#c8f560] text-xl font-semibold shadow-md">♪</div>
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
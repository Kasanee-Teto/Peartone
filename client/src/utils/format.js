export const formatDuration = (track) => {
    const mins = Math.floor((track.duration || 0) / 60);
    const secs = String((track.duration || 0) % 60).padStart(2, "0");
    return `${mins}:${secs}`;
};

export function formatTime(sec) {
  const total = Math.max(0, Math.floor(Number(sec) || 0));
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}
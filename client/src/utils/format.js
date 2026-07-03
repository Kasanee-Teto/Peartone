export const formatDuration = (track) => {
    const mins = Math.floor((track.duration || 0) / 60);
    const secs = String((track.duration || 0) % 60).padStart(2, "0");
    return `${mins}:${secs}`;
};
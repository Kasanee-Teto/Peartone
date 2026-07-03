const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const PLAY_TRACK_EVENT = "pt:play-track";

export function isValidTrackId(trackId) {
  return typeof trackId === "string" && trackId.trim().length > 0;
}

function getApiOrigin() {
  return API_BASE_URL.replace(/\/api\/?$/, "");
}

export function buildStreamUrl(track) {
  if (track?.streamUrl) return track.streamUrl;
  const trackId = track?.trackId || track?.id;
  if (!trackId) return "";
  const origin = getApiOrigin();
  return `${origin}/api/stream/tracks/${trackId}`;
}

export function normalizeTrack(t) {
  const artist =
    Array.isArray(t?.Artists) && t.Artists.length > 0
      ? t.Artists.map((a) => a?.name).filter(Boolean).join(", ")
      : t?.artist || t?.Artist?.name || "Unknown Artist";

  return {
    id: t?.id,
    title: t?.title || t?.name || "Untitled",
    artist,
    album: t?.Album?.title || t?.album || "",
    cover:
      t?.cover ||
      t?.coverUrl ||
      t?.image ||
      t?.imageUrl ||
      t?.Album?.cover ||
      t?.Album?.coverUrl ||
      "",
    duration: t?.duration || 0,
    ...t,
  };
}

export function normalizePlayableTrack(track) {
  const durationValue = Number(track?.duration ?? track?.durationSeconds ?? 0);
  const trackId = String(track?.trackId || track?.id || "").trim();
  return {
    ...track,
    trackId,
    title: track?.title || track?.name || "Untitled",
    artist: track?.artist || track?.Artist?.name || "Unknown Artist",
    album: track?.album || track?.Album?.title || "",
    duration: Number.isFinite(durationValue) && durationValue > 0 ? durationValue : 0,
    streamUrl: buildStreamUrl(track),
  };
}

export function emitPlayTrack(track) {
  window.dispatchEvent(new CustomEvent(PLAY_TRACK_EVENT, { detail: track }));
}

export function onPlayTrack(handler) {
  const listener = (event) => handler(event.detail);
  window.addEventListener(PLAY_TRACK_EVENT, listener);
  return () => window.removeEventListener(PLAY_TRACK_EVENT, listener);
}
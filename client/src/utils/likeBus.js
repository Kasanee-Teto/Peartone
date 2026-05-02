export const LIKES_CHANGED_EVENT = "pt:likes-changed";

export function emitLikesChanged() {
  window.dispatchEvent(new Event(LIKES_CHANGED_EVENT));
}

export function onLikesChanged(handler) {
  window.addEventListener(LIKES_CHANGED_EVENT, handler);
  return () => window.removeEventListener(LIKES_CHANGED_EVENT, handler);
}
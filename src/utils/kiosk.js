// Kiosk helpers for the touchscreen photo booth.
//
// Fullscreen and orientation-lock APIs both require a user gesture and reject
// (or are simply absent) on desktop browsers, so every call is wrapped in
// try/catch and treated as best-effort — failure is a no-op, never an error.

// Request fullscreen on the document element, with a webkit fallback for older
// iOS/Safari. Returns a promise that resolves regardless of support.
export async function requestFullscreen() {
  const el = document.documentElement;
  try {
    if (document.fullscreenElement) return; // already fullscreen
    if (el.requestFullscreen) {
      await el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  } catch {
    // Not supported / blocked (e.g. desktop without a gesture). Ignore.
  }
}

// Best-effort lock to portrait. No-op where the Screen Orientation API is
// unavailable (most desktops, iOS Safari).
export async function lockPortrait() {
  try {
    if (window.screen?.orientation?.lock) {
      await window.screen.orientation.lock('portrait');
    }
  } catch {
    // Orientation lock often rejects unless already fullscreen — ignore.
  }
}

// Enter kiosk mode: fullscreen first, then orientation lock (which some
// browsers only permit once fullscreen). Must be called from a user gesture.
export async function enterKiosk() {
  await requestFullscreen();
  await lockPortrait();
}

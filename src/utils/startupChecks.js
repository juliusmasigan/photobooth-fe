// Startup readiness checks performed on the splash screen before entering the app.
// Each check returns a normalized { ok: boolean, detail: string } and never throws.

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Resolve the layouts URL exactly like ThemeSelection.jsx does.
const themeLayoutsUrl = process.env.REACT_APP_THEME_LAYOUTS || '/designs/layouts.json';

// Modes that require a design template. Animation modes (gif, boomerang,
// wigglegram) don't use templates and are intentionally not checked.
export const TEMPLATE_MODES = ['still', 'collage'];

// Mirror ModeSelection.jsx's parsing of the enabled modes env var.
export function getEnabledModes() {
  return process.env.REACT_APP_BOOTH_MODES
    ? process.env.REACT_APP_BOOTH_MODES.split(',').map((m) => m.trim()).filter(Boolean)
    : ['still', 'collage', 'gif', 'boomerang', 'wigglegram'];
}

// 1. Check that design templates exist for every enabled template mode.
export async function checkDesigns() {
  const modesToCheck = getEnabledModes().filter((mode) => TEMPLATE_MODES.includes(mode));

  // No enabled mode needs a template — nothing to verify.
  if (modesToCheck.length === 0) {
    return { ok: true, detail: 'No template modes enabled' };
  }

  try {
    const response = await fetch(themeLayoutsUrl);
    if (!response.ok) {
      return { ok: false, detail: `Could not load layouts (HTTP ${response.status})` };
    }
    const data = await response.json();

    const missing = modesToCheck.filter(
      (mode) => !Array.isArray(data[mode]) || data[mode].length === 0
    );

    if (missing.length > 0) {
      return { ok: false, detail: `No design templates for: ${missing.join(', ')}` };
    }

    return { ok: true, detail: `Templates ready for ${modesToCheck.join(', ')}` };
  } catch (err) {
    return { ok: false, detail: `Failed to load design templates: ${err.message}` };
  }
}

// 2. Check that the camera is connected and ready via the backend status endpoint.
export async function checkCamera() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${apiBaseUrl}/api/status`, { signal: controller.signal });
    if (!response.ok) {
      return { ok: false, detail: `Camera service error (HTTP ${response.status})` };
    }
    const data = await response.json();
    if (data.connected === true) {
      return { ok: true, detail: data.model ? `Connected: ${data.model}` : 'Camera connected' };
    }
    return { ok: false, detail: 'No camera detected' };
  } catch (err) {
    const detail = err.name === 'AbortError'
      ? 'Camera service did not respond'
      : `Cannot reach camera service: ${err.message}`;
    return { ok: false, detail };
  } finally {
    clearTimeout(timeout);
  }
}

// 3. Printer check — stubbed for now (no printer integration exists yet).
// When a backend printer endpoint is added, replace the stub below with a real
// fetch, e.g. `GET ${apiBaseUrl}/api/printer/status`.
export async function checkPrinter() {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { ok: true, detail: 'Printer check skipped (not yet integrated)' };
}

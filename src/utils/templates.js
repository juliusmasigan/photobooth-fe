// Print templates (themes) live on the camera backend: GET /api/templates lists them by layout
// type, and their SVGs are served from the backend's /designs path.

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Root-relative template paths (e.g. /designs/collage/1.svg) point at the backend
export function resolveTemplateUrl(url = '') {
  return url.startsWith('/') ? `${apiBaseUrl}${url}` : url;
}

// Returns { collage: [...], still: [...] } with each layout's url resolved; throws on failure
export async function fetchTemplates(options) {
  const response = await fetch(`${apiBaseUrl}/api/templates`, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();

  const templates = {};
  for (const [mode, layouts] of Object.entries(data.templates || {})) {
    templates[mode] = (layouts || []).map((layout) => ({ ...layout, url: resolveTemplateUrl(layout.url) }));
  }
  return templates;
}

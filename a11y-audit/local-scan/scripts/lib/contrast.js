/**
 * WCAG relative-luminance contrast math, shared by the axe scan (focus/hover
 * checks) and the standalone contrast-check pass.
 */

function parseColor(str) {
  if (!str) return null;
  const m = str.match(/rgba?\(([^)]+)\)/i);
  if (!m) return null;
  const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
  const [r, g, b, a = 1] = parts;
  if ([r, g, b].some((v) => Number.isNaN(v))) return null;
  return { r, g, b, a };
}

function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relLuminance({ r, g, b }) {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrastRatio(fg, bg) {
  const L1 = relLuminance(fg);
  const L2 = relLuminance(bg);
  const [lighter, darker] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (lighter + 0.05) / (darker + 0.05);
}

function toHex({ r, g, b }) {
  const h = (n) => Math.round(n).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`.toLowerCase();
}

/**
 * Flattens a possibly-transparent fg color over a bg color (simple alpha
 * compositing), so contrast math on rgba() text colors is still accurate.
 */
function compositeOver(fg, bg) {
  if (fg.a === undefined || fg.a === 1) return fg;
  const a = fg.a;
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a)
  };
}

module.exports = { parseColor, contrastRatio, toHex, compositeOver };

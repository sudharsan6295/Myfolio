// One-off script to generate public/og-image.png from a hand-built SVG.
// Not a standing build step — re-run manually if the brand/name changes
// meaningfully. Uses `sharp` (already a project dependency via astro:assets)
// to rasterize, since sharp/libvips can render SVG directly to PNG.
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

// Read real content so the card reflects the actual current about.md
// rather than a hardcoded guess that could drift out of sync.
const aboutMd = readFileSync(path.join(projectRoot, "src/content/about/about.md"), "utf8");
function frontmatterField(name) {
  const m = aboutMd.match(new RegExp(`^${name}:\\s*"([^"]*)"`, "m"));
  return m ? m[1] : "";
}
const name = frontmatterField("name") || "Sudharsan Balaji";
const roleFull = frontmatterField("role");
const roleShort = roleFull.split(" — ")[0] || "Lead Solution Consultant";
const location = frontmatterField("location") || "";

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="meshA" cx="12%" cy="10%" r="65%">
      <stop offset="0%" stop-color="#f7ecd8" />
      <stop offset="100%" stop-color="#f7ecd8" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="meshB" cx="90%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#f1dce6" />
      <stop offset="100%" stop-color="#f1dce6" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="base" x1="0%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#fce1ce" />
      <stop offset="55%" stop-color="#f1dce6" />
      <stop offset="100%" stop-color="#f7ecd8" />
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#base)" />
  <rect width="1200" height="630" fill="url(#meshA)" />
  <rect width="1200" height="630" fill="url(#meshB)" />

  <!-- faint notebook rule lines, right side, tactile brand detail -->
  <g stroke="#e4d2c0" stroke-width="1.5" opacity="0.55">
    <line x1="860" y1="90" x2="1140" y2="90" />
    <line x1="860" y1="150" x2="1140" y2="150" />
    <line x1="860" y1="210" x2="1140" y2="210" />
    <line x1="860" y1="270" x2="1140" y2="270" />
    <line x1="860" y1="330" x2="1140" y2="330" />
    <line x1="860" y1="390" x2="1140" y2="390" />
    <line x1="860" y1="450" x2="1140" y2="450" />
    <line x1="860" y1="510" x2="1140" y2="510" />
  </g>

  <!-- seal monogram -->
  <g transform="translate(96,84)">
    <circle cx="40" cy="40" r="37" stroke="#5b1a22" stroke-width="2.4" opacity="0.85" fill="none" />
    <circle cx="40" cy="40" r="30" stroke="#5b1a22" stroke-width="1.2" opacity="0.5" fill="none" />
    <line x1="76.5" y1="40" x2="80.5" y2="40" stroke="#5b1a22" stroke-width="2" opacity="0.7" />
    <line x1="40" y1="76.5" x2="40" y2="80.5" stroke="#5b1a22" stroke-width="2" opacity="0.7" />
    <line x1="3.5" y1="40" x2="-0.5" y2="40" stroke="#5b1a22" stroke-width="2" opacity="0.7" />
    <line x1="40" y1="3.5" x2="40" y2="-0.5" stroke="#5b1a22" stroke-width="2" opacity="0.7" />
    <text x="40" y="52" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-weight="600" font-size="26" fill="#5b1a22">SB</text>
  </g>

  <text x="96" y="280" font-family="Georgia, serif" font-size="30" fill="#5b1a22" letter-spacing="2" font-weight="600">PROFESSIONAL NOTEBOOK</text>

  <text x="96" y="360" font-family="Georgia, 'Times New Roman', serif" font-size="66" fill="#2b211f" font-weight="500">${esc(name)}</text>

  <text x="96" y="410" font-family="Georgia, serif" font-size="30" fill="#7a655f">${esc(roleShort)}</text>

  <text x="96" y="540" font-family="Courier New, monospace" font-size="22" fill="#7a655f" letter-spacing="1">${esc(location)}</text>
</svg>
`;

const outPath = path.join(projectRoot, "public/og-image.png");
sharp(Buffer.from(svg))
  .resize(1200, 630)
  .png()
  .toFile(outPath)
  .then(() => console.log("Wrote", outPath))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

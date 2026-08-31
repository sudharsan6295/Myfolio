// One-off script to generate public/og-image.png from a hand-built SVG.
// Not a standing build step — re-run manually if the brand/name changes
// meaningfully. Uses `sharp` (already a project dependency via astro:assets)
// to rasterize, since sharp/libvips can render SVG directly to PNG.
//
// Matches the site's "spec doc" visual identity (see src/styles/global.css):
// flat porcelain paper, a dot-grid texture, a doc-header field block, and
// the bracketed [SB] mark — replacing the earlier glass/gradient-mesh/wax-
// seal card.
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

// Dot-grid texture as a tiled pattern — same 28px spacing as the live
// site's body background, at a similarly faint opacity.
const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="#d7dcde" />
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="#f2f4f5" />
  <rect width="1200" height="630" fill="url(#dots)" />

  <!-- doc-header field block -->
  <g font-family="'IBM Plex Mono', 'Courier New', monospace" font-size="18" letter-spacing="1.5">
    <text x="96" y="98" fill="#5c666b">DOCUMENT</text>
    <text x="270" y="98" fill="#191d1f">PROFESSIONAL NOTEBOOK</text>
    <text x="96" y="128" fill="#5c666b">OWNER</text>
    <text x="270" y="128" fill="#191d1f">${esc(name).toUpperCase()}</text>
    <text x="96" y="158" fill="#5c666b">STATUS</text>
    <circle cx="278" cy="153" r="4" fill="#b93a14" />
    <text x="292" y="158" fill="#b93a14">ACTIVELY SHIPPING</text>
  </g>
  <line x1="96" y1="180" x2="1104" y2="180" stroke="#d7dcde" stroke-width="1.5" />

  <!-- [SB] mark -->
  <rect x="96" y="216" width="64" height="64" rx="6" fill="none" stroke="#b93a14" stroke-width="2.5" />
  <text x="128" y="258" text-anchor="middle" font-family="'IBM Plex Mono', 'Courier New', monospace" font-weight="600" font-size="22" fill="#b93a14">SB</text>

  <text x="96" y="340" font-family="'Space Grotesk', 'Arial', sans-serif" font-size="60" font-weight="700" fill="#191d1f">${esc(name)}</text>

  <text x="96" y="384" font-family="'IBM Plex Sans', Arial, sans-serif" font-size="27" fill="#5c666b">${esc(roleShort)}</text>

  <text x="96" y="540" font-family="'IBM Plex Mono', 'Courier New', monospace" font-size="20" fill="#5c666b" letter-spacing="1">${esc(location)}</text>
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

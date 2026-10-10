// Gives every photo a descriptive, keyword-friendly file name and trims alt text to 125 characters.
// Usage: node scripts/seo-image-names.mjs   (safe to re-run)
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const manifestPath = join(root, "src", "content", "images.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

export function descriptiveName(alt, key) {
  const slug = alt
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/^(a|an|the)-/, "");
  let name = "";
  for (const word of slug.split("-")) {
    if ((name + "-" + word).length > 60) break;
    name = name ? `${name}-${word}` : word;
  }
  return name || key;
}

function trimAlt(alt) {
  if (alt.length <= 125) return alt;
  const cut = alt.slice(0, 125);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\s]+$/, "");
}

const used = new Set();
let renamed = 0;
for (const [key, photo] of Object.entries(manifest)) {
  let name = descriptiveName(photo.alt, key);
  if (used.has(name)) name = `${name}-${key}`;
  used.add(name);
  const src = `/images/${name}.webp`;
  if (photo.src !== src) {
    const from = join(root, "public", photo.src);
    const to = join(root, "public", src);
    if (existsSync(from)) renameSync(from, to);
    photo.src = src;
    renamed += 1;
  }
  photo.alt = trimAlt(photo.alt);
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`${renamed} files renamed, ${Object.keys(manifest).length} photos checked.`);

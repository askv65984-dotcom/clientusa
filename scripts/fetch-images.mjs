// Downloads and optimizes the site's photos from Pexels.
// Usage: node --env-file=.env.local scripts/fetch-images.mjs [--only=key1,key2] [--force]
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { imageList } from "./image-list.mjs";

const KEY = process.env.PEXELS_API_KEY;
if (!KEY) throw new Error("Set PEXELS_API_KEY (see .env.example).");

const root = process.cwd();
const outDir = join(root, "public", "images");
const manifestPath = join(root, "src", "content", "images.json");
const widths = { hero: 1920, section: 1400, card: 960 };
// Keep the photography on-message: no pandemic-era masks, needles or surgery.
const avoid = /mask|covid|corona|face shield|syringe|injection|vaccin|blood|surg|x-ray|cigar|skull|halloween|toy|apothecary|antique|vintage|protective|ppe|construction|hard hat|breach|hacker/i;

const args = process.argv.slice(2);
const only = args.find((a) => a.startsWith("--only="))?.slice(7).split(",") ?? null;
const force = args.includes("--force");

await mkdir(outDir, { recursive: true });
const manifest = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, "utf8")) : {};
const used = new Set(Object.values(manifest).map((m) => m.pexelsId));

async function pexels(path) {
  const res = await fetch(`https://api.pexels.com/v1${path}`, { headers: { Authorization: KEY } });
  if (!res.ok) throw new Error(`Pexels ${res.status} for ${path}`);
  return res.json();
}

function cleanAlt(alt, fallback) {
  const text = (alt || "").trim().replace(/\s+/g, " ");
  return text.length > 8 ? text.replace(/\.$/, "") : fallback;
}

async function choose(item) {
  if (item.id) return pexels(`/photos/${item.id}`);
  const data = await pexels(`/search?query=${encodeURIComponent(item.query)}&orientation=landscape&per_page=30&size=large`);
  const photos = data.photos ?? [];
  return (
    photos.find((p) => !used.has(p.id) && !avoid.test(p.alt ?? "") && p.width >= 2000) ??
    photos.find((p) => !used.has(p.id) && !avoid.test(p.alt ?? "")) ??
    null
  );
}

for (const item of imageList) {
  if (only && !only.includes(item.key)) continue;
  if (!only && !force && manifest[item.key]) continue;

  // The current photo stays in "used", so a re-run always picks a different one.
  const photo = await choose(item);
  if (!photo) {
    console.warn(`No photo found for ${item.key} (${item.query})`);
    continue;
  }
  used.add(photo.id);

  const width = widths[item.size];
  const download = await fetch(`${photo.src.original}?auto=compress&cs=tinysrgb&w=${Math.min(width * 1.25, 2400)}`);
  const input = Buffer.from(await download.arrayBuffer());
  const file = join(outDir, `${item.key}.webp`);
  const info = await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 72 }).toFile(file);
  const blur = await sharp(input).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();

  manifest[item.key] = {
    src: `/images/${item.key}.webp`,
    width: info.width,
    height: info.height,
    alt: cleanAlt(photo.alt, item.query),
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    pexelsId: photo.id,
    pexelsUrl: photo.url,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    avgColor: photo.avg_color,
  };
  console.log(`${item.key.padEnd(22)} ${photo.id}  ${Math.round(info.size / 1024)}KB  ${manifest[item.key].alt.slice(0, 70)}`);
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  await new Promise((r) => setTimeout(r, 150));
}

console.log(`Done. ${Object.keys(manifest).length} photos in the manifest. Run scripts/seo-image-names.mjs next to give new files descriptive names.`);

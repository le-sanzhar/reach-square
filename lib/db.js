import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

const EMPTY = { artists: [], albums: [], users: [], reviews: [] };

export function getDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

export function saveDB(db) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export function albumWithStats(db, album) {
  const reviews = db.reviews.filter((r) => r.albumId === album.id);
  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;
  return { ...album, reviewCount: reviews.length, avgRating: avg };
}

export function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "только что";
  if (m < 60) return `${m} мин назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч назад`;
  const d = Math.floor(h / 24);
  if (d === 1) return "вчера";
  if (d < 30) return `${d} дн назад`;
  const mo = Math.floor(d / 30);
  return `${mo} мес назад`;
}

export function wordCount(text) {
  return (text || "").trim().split(/\s+/).filter(Boolean).length;
}

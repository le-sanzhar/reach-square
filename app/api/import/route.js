import { NextResponse } from "next/server";
import { getDB, saveDB } from "../../../lib/db";

export const dynamic = "force-dynamic";

// GET /api/import?q=... — поиск альбомов в iTunes (сервер-сайд, без CORS-проблем)
export async function GET(req) {
  const q = new URL(req.url).searchParams.get("q") || "";
  if (q.trim().length < 2) return NextResponse.json({ results: [] });

  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=album&limit=6&country=US`,
      { cache: "no-store" }
    );
    const data = await res.json();
    const existing = new Set(getDB().albums.map((a) => a.itunesId));
    return NextResponse.json({
      results: (data.results || [])
        .filter((c) => !existing.has(c.collectionId))
        .map((c) => ({
          collectionId: c.collectionId,
          collectionName: c.collectionName,
          artistName: c.artistName,
          primaryGenreName: c.primaryGenreName,
          artworkUrl100: c.artworkUrl100,
        })),
    });
  } catch {
    return NextResponse.json({ results: [], error: "iTunes недоступен" }, { status: 502 });
  }
}

// POST /api/import { collectionId } — добавить альбом + треки в каталог
export async function POST(req) {
  const body = await req.json().catch(() => null);
  const collectionId = body?.collectionId;
  if (!collectionId) return NextResponse.json({ error: "Нет collectionId" }, { status: 400 });

  const db = getDB();
  const dup = db.albums.find((a) => a.itunesId === collectionId);
  if (dup) return NextResponse.json({ albumId: dup.id });

  try {
    const res = await fetch(
      `https://itunes.apple.com/lookup?id=${collectionId}&entity=song&limit=200`,
      { cache: "no-store" }
    );
    const data = await res.json();
    const col = (data.results || []).find((r) => r.wrapperType === "collection");
    if (!col) return NextResponse.json({ error: "Альбом не найден в iTunes" }, { status: 404 });

    const artistId = `a${col.artistId}`;
    if (!db.artists.some((a) => a.id === artistId)) {
      db.artists.push({
        id: artistId,
        itunesId: col.artistId,
        name: col.artistName,
        genre: col.primaryGenreName || "Indie",
        link: col.artistViewUrl || null,
      });
    }

    const album = {
      id: `al${col.collectionId}`,
      itunesId: col.collectionId,
      artistId,
      title: col.collectionName,
      year: col.releaseDate ? new Date(col.releaseDate).getFullYear() : null,
      genre: col.primaryGenreName || "Indie",
      cover: (col.artworkUrl100 || "").replace("100x100", "600x600"),
      link: col.collectionViewUrl || null,
      tracks: (data.results || [])
        .filter((t) => t.wrapperType === "track")
        .map((t) => ({
          name: t.trackName,
          previewUrl: t.previewUrl || null,
          durationMs: t.trackTimeMillis || null,
        })),
    };
    db.albums.push(album);
    saveDB(db);
    return NextResponse.json({ albumId: album.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "iTunes недоступен" }, { status: 502 });
  }
}

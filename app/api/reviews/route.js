import { NextResponse } from "next/server";
import { getDB, saveDB, wordCount } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });

  const { albumId, userId, rating, text } = body;
  const db = getDB();

  if (!db.albums.some((a) => a.id === albumId))
    return NextResponse.json({ error: "Альбом не найден" }, { status: 404 });
  if (!db.users.some((u) => u.id === userId))
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return NextResponse.json({ error: "Оценка должна быть от 1 до 5" }, { status: 400 });
  if (wordCount(text) < 50)
    return NextResponse.json({ error: "Минимум 50 слов — это наша фишка 🙂" }, { status: 400 });

  const review = {
    id: `r${Date.now()}`,
    albumId,
    userId,
    rating,
    text: String(text).slice(0, 5000),
    date: new Date().toISOString(),
    likes: 0,
  };
  db.reviews.unshift(review);
  saveDB(db);
  return NextResponse.json(review, { status: 201 });
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { getDB, saveDB } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Нужно войти в аккаунт" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });

  const { albumId, rating, text } = body;
  const userId = session.user.id;

  const db = getDB();
  if (!db.albums.some((a) => a.id === albumId))
    return NextResponse.json({ error: "Альбом не найден" }, { status: 404 });
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return NextResponse.json({ error: "Оценка должна быть от 1 до 5" }, { status: 400 });

  const review = {
    id: `r${Date.now()}`,
    albumId,
    userId,
    rating,
    text: text ? String(text).slice(0, 5000) : null,
    date: new Date().toISOString(),
    likes: 0,
  };
  db.reviews.unshift(review);
  saveDB(db);
  return NextResponse.json(review, { status: 201 });
}

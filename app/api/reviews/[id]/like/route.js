import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { getDB, saveDB } from "../../../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Нужно войти" }, { status: 401 });

  const db = getDB();
  const review = db.reviews.find((r) => r.id === params.id);
  if (!review) return NextResponse.json({ error: "Не найдено" }, { status: 404 });

  if (!review.likedBy) review.likedBy = [];
  const uid = session.user.id;
  const idx = review.likedBy.indexOf(uid);
  if (idx === -1) {
    review.likedBy.push(uid);
    review.likes = (review.likes || 0) + 1;
  } else {
    review.likedBy.splice(idx, 1);
    review.likes = Math.max(0, (review.likes || 1) - 1);
  }
  saveDB(db);
  return NextResponse.json({ likes: review.likes, liked: idx === -1 });
}

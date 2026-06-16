import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { getDB, saveDB } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Нужно войти" }, { status: 401 });

  const db = getDB();
  const idx = db.reviews.findIndex((r) => r.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  if (db.reviews[idx].userId !== session.user.id)
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });

  db.reviews.splice(idx, 1);
  saveDB(db);
  return NextResponse.json({ ok: true });
}

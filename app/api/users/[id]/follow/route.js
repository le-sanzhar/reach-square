import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { getDB, saveDB } from "../../../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  if (session.user.id === params.id)
    return NextResponse.json({ error: "Нельзя подписаться на себя" }, { status: 400 });

  const db = getDB();
  const me = db.users.find((u) => u.id === session.user.id);
  const target = db.users.find((u) => u.id === params.id);
  if (!me || !target) return NextResponse.json({ error: "Не найдено" }, { status: 404 });

  if (!me.following) me.following = [];
  const idx = me.following.indexOf(params.id);
  if (idx === -1) {
    me.following.push(params.id);
  } else {
    me.following.splice(idx, 1);
  }
  saveDB(db);

  const followers = db.users.filter((u) => (u.following || []).includes(params.id)).length;
  return NextResponse.json({ following: idx === -1, followers });
}

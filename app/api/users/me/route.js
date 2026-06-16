import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { getDB, saveDB } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Нужно войти" }, { status: 401 });

  const { name, bio } = await req.json().catch(() => ({}));
  if (!name?.trim())
    return NextResponse.json({ error: "Имя не может быть пустым" }, { status: 400 });

  const db = getDB();
  const user = db.users.find((u) => u.id === session.user.id);
  if (!user) return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });

  user.name = name.trim().slice(0, 60);
  user.bio = (bio || "").trim().slice(0, 200);
  saveDB(db);
  return NextResponse.json({ name: user.name, bio: user.bio });
}

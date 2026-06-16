import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDB, saveDB } from "../../../../lib/db";

export async function POST(req) {
  const body = await req.json().catch(() => null);
  const { name, email, password } = body || {};

  if (!name?.trim() || !email?.trim() || !password)
    return NextResponse.json({ error: "Заполни все поля" }, { status: 400 });
  if (password.length < 6)
    return NextResponse.json({ error: "Пароль — минимум 6 символов" }, { status: 400 });

  const db = getDB();
  if (db.users.some((u) => u.email === email.toLowerCase().trim()))
    return NextResponse.json({ error: "Этот email уже зарегистрирован" }, { status: 409 });

  const password_hash = await bcrypt.hash(password, 10);
  const user = {
    id: `u${Date.now()}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    avatar: "👤",
    bio: "",
    password_hash,
  };

  db.users.push(user);
  saveDB(db);
  return NextResponse.json({ id: user.id }, { status: 201 });
}

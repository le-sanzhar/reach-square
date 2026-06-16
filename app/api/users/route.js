import { NextResponse } from "next/server";
import { getDB } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const q = new URL(req.url).searchParams.get("q") || "";
  const db = getDB();
  const users = db.users
    .filter((u) => !q || u.name.toLowerCase().includes(q.toLowerCase()))
    .map((u) => {
      const reviewCount = db.reviews.filter((r) => r.userId === u.id).length;
      const followers = db.users.filter((x) => (x.following || []).includes(u.id)).length;
      return { id: u.id, name: u.name, bio: u.bio || "", reviewCount, followers };
    });
  return NextResponse.json(users);
}

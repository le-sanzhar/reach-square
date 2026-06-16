import { NextResponse } from "next/server";
import { getDB } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getDB().users);
}

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await pool.query("UPDATE users SET role = $1 WHERE email = $2", [
    "premium",
    session.user.email,
  ]);

  return NextResponse.json({ message: "OK" });
}

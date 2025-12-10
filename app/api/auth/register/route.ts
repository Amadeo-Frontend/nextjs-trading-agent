import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // conexão com NEON
import { RowDataPacket } from "mysql2";

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export async function POST(req: Request) {
  try {
    const { email, name } = (await req.json()) as {
      email: string;
      name: string;
    };

    if (!email || !name) {
      return NextResponse.json(
        { message: "Email e nome são obrigatórios" },
        { status: 400 }
      );
    }

    const exists = await pool.query<UserRow[]>(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (exists.rowCount && exists.rowCount > 0) {
      return NextResponse.json(
        { message: "Usuário já existe" },
        { status: 400 }
      );
    }

    await pool.query(
      "INSERT INTO users (email, name, role) VALUES ($1, $2, $3)",
      [email, name, "free"]
    );

    return NextResponse.json({ message: "Usuário criado" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}

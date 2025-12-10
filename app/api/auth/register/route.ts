// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

type RegisterBody = {
  name: string;
  email: string;
};

export async function POST(req: Request) {
  try {
    const body: RegisterBody = await req.json();
    const { name, email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email é obrigatório" },
        { status: 400 }
      );
    }

    // Verifica se usuário já existe
    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (exists.rowCount && exists.rowCount > 0) {
      return NextResponse.json(
        { message: "Usuário já existe" },
        { status: 400 }
      );
    }

    // Cria usuário com role "free"
    await pool.query(
      "INSERT INTO users (email, name, role) VALUES ($1, $2, $3)",
      [email, name ?? null, "free"]
    );

    return NextResponse.json(
      { message: "Usuário registrado com sucesso" },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Erro interno no registro:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

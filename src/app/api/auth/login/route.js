export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dataDir = join(process.cwd(), "src", "data");
const usersPath = join(dataDir, "users.json");

function readUsers() {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  if (!existsSync(usersPath)) writeFileSync(usersPath, JSON.stringify([]));
  try {
    return JSON.parse(readFileSync(usersPath, "utf-8"));
  } catch {
    return [];
  }
}

export async function POST(req) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const users = readUsers();
  const found = users.find((u) => u.email === email && u.password === password);
  if (!found) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({ email }, { status: 200 });
}
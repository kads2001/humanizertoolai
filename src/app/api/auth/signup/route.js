export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
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

function writeUsers(users) {
  writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

export async function POST(req) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const users = readUsers();
  if (users.some((u) => u.email === email)) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }

  users.push({ name, email, password }); // NOTE: plaintext for demo only, not for production
  writeUsers(users);
  return NextResponse.json({ message: "Account created" }, { status: 201 });
}
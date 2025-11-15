export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const dataDir = join(process.cwd(), "src", "data");
const otpsPath = join(dataDir, "otps.json");

function readOtps() {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  if (!existsSync(otpsPath)) writeFileSync(otpsPath, JSON.stringify({}));
  try {
    return JSON.parse(readFileSync(otpsPath, "utf-8"));
  } catch {
    return {};
  }
}

function writeOtps(otps) {
  writeFileSync(otpsPath, JSON.stringify(otps, null, 2));
}

export async function POST(req) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });
  // basic email format validation (standard)
  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  if (!emailOk) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const otps = readOtps();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otps[email] = { code, expires: Date.now() + 5 * 60 * 1000 };
  writeOtps(otps);
  // Standard behaviour: don't expose OTP in production; show during development for testing
  const body = { message: "OTP sent" };
  if (process.env.NODE_ENV !== "production") {
    body.code = code;
  }
  return NextResponse.json(body, { status: 200 });
}
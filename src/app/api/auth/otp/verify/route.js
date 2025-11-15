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
  const { email, code } = await req.json();
  if (!email || !code) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const otps = readOtps();
  const record = otps[email];
  if (!record) return NextResponse.json({ error: "No OTP requested" }, { status: 404 });
  if (record.expires < Date.now()) return NextResponse.json({ error: "OTP expired" }, { status: 410 });
  if (record.code !== code) return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  delete otps[email];
  writeOtps(otps);
  return NextResponse.json({ message: "OTP verified" }, { status: 200 });
}
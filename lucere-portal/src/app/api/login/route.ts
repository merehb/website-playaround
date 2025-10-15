import { NextResponse } from "next/server";

// Expected env shape: BRAND_CODES='{"Holla":"HOLLA-2025","Acme":"ACME-123"}'
const raw = process.env.BRAND_CODES || "{}";
let brandCodes: Record<string, string> = {};
try {
  brandCodes = JSON.parse(raw);
} catch {
  brandCodes = {};
}

export async function POST(req: Request) {
  const { brand, code } = await req.json();
  if (!brand || !code) {
    return NextResponse.json({ message: "Missing brand or code" }, { status: 400 });
  }
  const expected = brandCodes[brand];
  if (!expected || expected !== code) {
    return NextResponse.json({ message: "Invalid brand or access code" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  // Set cookie for 7 days
  res.cookies.set("ldm_customer_name", brand, {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}



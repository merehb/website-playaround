import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (!password || password !== process.env.ADMIN_PASS) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("ldm_admin", "1", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 2 });
  return res;
}



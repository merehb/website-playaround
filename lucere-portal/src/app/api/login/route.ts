import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { brand, code } = await req.json();
  if (!brand || !code) {
    return NextResponse.json({ message: "Missing brand or code" }, { status: 400 });
  }

  // Look up access code in Supabase
  const { data: customer } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("name", brand)
    .maybeSingle();
  if (!customer?.id) {
    return NextResponse.json({ message: "Brand not found" }, { status: 401 });
  }
  const { data: ac } = await supabaseAdmin
    .from("access_codes")
    .select("id,active,expires_at")
    .eq("customer_id", customer.id)
    .eq("code", code)
    .maybeSingle();
  if (!ac?.id || ac.active === false || (ac.expires_at && new Date(ac.expires_at) < new Date())) {
    return NextResponse.json({ message: "Invalid or expired code" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("ldm_customer_name", brand, {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}



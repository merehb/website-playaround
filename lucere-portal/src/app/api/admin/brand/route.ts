import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  if (!/ldm_admin=1/.test(cookie)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { brand, code } = await req.json();
  if (!brand || !code) return NextResponse.json({ message: "Missing brand or code" }, { status: 400 });

  // Upsert customer
  let { data: customer } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("name", brand)
    .maybeSingle();
  if (!customer?.id) {
    const ins = await supabaseAdmin.from("customers").insert({ name: brand }).select("id").single();
    if (ins.error) return NextResponse.json({ message: ins.error.message }, { status: 400 });
    customer = { id: ins.data.id } as any;
  }
  const insCode = await supabaseAdmin.from("access_codes").insert({ customer_id: customer.id, code, active: true });
  if (insCode.error) return NextResponse.json({ message: insCode.error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}



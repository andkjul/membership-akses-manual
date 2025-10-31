import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const { nama, email, phone } = body;

    if (!nama || !email || !phone) {
      return NextResponse.json(
        { ok: false, message: "nama, email, dan phone wajib diisi" },
        { status: 400 }
      );
    }

    // payload untuk diteruskan ke n8n
    const payload = {
      nama,
      email,
      phone,
      source: "vercel-admin-form",
      at: new Date().toISOString(),
    };

    // kirim ke n8n
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, message: "Forward ke n8n gagal", detail: text },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Data terkirim ke n8n",
      forwarded: payload,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Forward endpoint aktif",
  });
}

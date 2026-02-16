import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { getOpenAIEmbedding } from "@/lib/ai/embedding";

export async function GET(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10) || 10));

  const supabase = createSupabaseAdminClient();

  if (id) {
    const { data: row, error } = await supabase
      .from("questions")
      .select("embedding, title, body")
      .eq("id", id)
      .maybeSingle();

    if (error || !row) {
      return NextResponse.json(
        { similar: [], message: "Soru bulunamadı." },
        { status: 200 }
      );
    }

    let embedding = row.embedding as number[] | null;
    if (!embedding?.length && row.title != null && process.env.OPENAI_API_KEY) {
      try {
        const text = [row.title, row.body].filter(Boolean).join("\n");
        embedding = await getOpenAIEmbedding(text);
        await supabase.rpc("set_question_embedding", {
          p_question_id: id,
          p_embedding: embedding,
        });
      } catch {
        return NextResponse.json(
          { similar: [], message: "Embedding oluşturulamadı." },
          { status: 200 }
        );
      }
    }

    if (!embedding?.length) {
      return NextResponse.json(
        { similar: [], message: "Bu soru için embedding henüz yok. Soruyu yayınlayın veya OPENAI_API_KEY tanımlı olsun." },
        { status: 200 }
      );
    }
    const { data: similar, error: rpcError } = await supabase.rpc("match_similar_questions", {
      p_query_embedding: embedding,
      p_exclude_id: id,
      p_match_count: limit,
      p_min_similarity: 0.5,
    });

    if (rpcError) {
      return NextResponse.json(
        { message: rpcError.message, similar: [] },
        { status: 500 }
      );
    }
    return NextResponse.json({ similar: similar ?? [] });
  }

  return NextResponse.json(
    { similar: [], message: "id veya text gerekli." },
    { status: 400 }
  );
}

export async function POST(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  let body: { text?: string; exclude_id?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Geçersiz JSON." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json({ message: "text gerekli." }, { status: 400 });
  }

  const limit = 10;
  const excludeId = body.exclude_id ?? null;

  let embedding: number[];
  try {
    embedding = await getOpenAIEmbedding(text);
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Embedding oluşturulamadı.", similar: [] },
      { status: 500 }
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data: similar, error } = await supabase.rpc("match_similar_questions", {
    p_query_embedding: embedding,
    p_exclude_id: excludeId,
    p_match_count: limit,
    p_min_similarity: 0.5,
  });

  if (error) {
    return NextResponse.json(
      { message: error.message, similar: [] },
      { status: 500 }
    );
  }

  return NextResponse.json({ similar: similar ?? [] });
}

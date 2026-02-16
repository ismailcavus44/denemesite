"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AnswerEditor } from "@/components/answer-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Category = { id: string; name: string };

type QuestionData = {
  id: string;
  title: string;
  body: string;
  status: string;
  category_id: string | null;
  asker_email: string | null;
  answer?: { answer_text: string } | { answer_text: string }[] | null;
  ai_title: string | null;
  ai_answer_draft: string | null;
  ai_main_concept: string | null;
  ai_pillar_slug: string | null;
  ai_pillar_url: string | null;
  ai_category: string | null;
  ai_card_summary: string | null;
  seo_slug: string | null;
  seo_title: string | null;
  seo_description: string | null;
  ai_h1_summary: string | null;
  ai_h1_enabled: boolean | null;
  related_guide_url: string | null;
  related_guide_label: string | null;
};

type SimilarQuestion = {
  id: string;
  title: string;
  slug: string;
  category_slug: string;
  similarity: number;
};

const QUESTION_SELECT =
  "id,title,body,status,category_id,asker_email,ai_title,ai_answer_draft,ai_main_concept,ai_pillar_slug,ai_pillar_url,ai_category,ai_card_summary,seo_slug,seo_title,seo_description,ai_h1_summary,ai_h1_enabled,related_guide_url,related_guide_label,answer:answers(answer_text)";

function getAccessToken(): string | null {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const projectRef = new URL(url).hostname.split(".")[0];
    const raw = localStorage.getItem(`sb-${projectRef}-auth-token`);
    if (!raw) return null;
    return JSON.parse(raw).access_token ?? null;
  } catch {
    return null;
  }
}

export default function AdminQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = String(params.id);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [cardSummary, setCardSummary] = useState("");
  const [seoSlug, setSeoSlug] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [aiH1Summary, setAiH1Summary] = useState("");
  const [aiH1Enabled, setAiH1Enabled] = useState(false);
  const [relatedGuideUrl, setRelatedGuideUrl] = useState("");
  const [relatedGuideLabel, setRelatedGuideLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [aiSeoLoading, setAiSeoLoading] = useState(false);
  const [aiCardSummaryLoading, setAiCardSummaryLoading] = useState(false);
  const [aiH1Loading, setAiH1Loading] = useState(false);
  const [similarQuestions, setSimilarQuestions] = useState<SimilarQuestion[]>([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [answerWithSimilarLoading, setAnswerWithSimilarLoading] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const token = getAccessToken();
    if (!token) {
      toast.error("Oturum bulunamadı.");
      setLoading(false);
      return;
    }

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const headers = {
        apikey: key,
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };

      const [questionRes, categoriesRes] = await Promise.all([
        fetch(
          `${url}/rest/v1/questions?id=eq.${questionId}&select=${QUESTION_SELECT}`,
          { headers }
        ),
        fetch(`${url}/rest/v1/categories?select=id,name&order=name`, { headers }),
      ]);

      const questionArr = questionRes.ok ? await questionRes.json() : [];
      const questionData: QuestionData | null = questionArr[0] ?? null;
      const categoriesData: Category[] = categoriesRes.ok ? await categoriesRes.json() : [];

      if (!questionData) {
        toast.error("Soru bulunamadı.");
        setLoading(false);
        return;
      }

      setQuestion(questionData);
      setCategories(categoriesData);
      setBody(questionData.body);
      setCategoryId(questionData.category_id ?? "");
      const answerRow = Array.isArray(questionData.answer)
        ? questionData.answer[0]
        : questionData.answer;
      setAnswerText(answerRow?.answer_text ?? "");
      setCardSummary(questionData.ai_card_summary ?? "");
      setSeoSlug(questionData.seo_slug ?? "");
      setSeoTitle(questionData.seo_title ?? "");
      setSeoDescription(questionData.seo_description ?? "");
      setAiH1Summary(questionData.ai_h1_summary ?? questionData.title ?? "");
      setAiH1Enabled(questionData.ai_h1_enabled === true);
      setRelatedGuideUrl((questionData as { related_guide_url?: string | null }).related_guide_url ?? "");
      setRelatedGuideLabel((questionData as { related_guide_label?: string | null }).related_guide_label ?? "");

      setSimilarLoading(true);
      try {
        const similarRes = await fetch(
          `/api/admin/questions/similar?id=${encodeURIComponent(questionId)}&limit=10`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const similarData = await similarRes.json().catch(() => ({}));
        setSimilarQuestions(Array.isArray(similarData.similar) ? similarData.similar : []);
      } catch {
        setSimilarQuestions([]);
      } finally {
        setSimilarLoading(false);
      }
    } catch {
      toast.error("Veri yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const callAdminUpdate = async (status: string) => {
    const token = getAccessToken();
    if (!token) {
      toast.error("Oturum bulunamadı.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/questions/${questionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          title: aiH1Summary.trim() || body.trim().slice(0, 200),
          body: body.trim(),
          category_id: categoryId || null,
          answer_text: answerText.trim(),
          ai_card_summary: cardSummary.trim() || null,
          slug: seoSlug.trim() || undefined,
          seo_slug: seoSlug.trim() || null,
          seo_title: seoTitle.trim() || null,
          seo_description: seoDescription.trim() || null,
          ai_h1_summary: aiH1Summary.trim() || null,
          ai_h1_enabled: aiH1Enabled,
          related_guide_url: relatedGuideUrl.trim() || null,
          related_guide_label: relatedGuideLabel.trim() || null,
        }),
      });

      if (!response.ok) {
        toast.error("Güncelleme başarısız.");
        return;
      }

      toast.success("Güncelleme kaydedildi.");
      loadData();
    } catch {
      toast.error("Güncelleme sırasında hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleDraft = () => callAdminUpdate("draft");
  const handlePublish = () => callAdminUpdate("published");
  const handleReject = () => callAdminUpdate("rejected");

  const handleAnswerWithSimilar = async (similarQuestionId: string) => {
    const token = getAccessToken();
    if (!token) return;
    setAnswerWithSimilarLoading(similarQuestionId);
    try {
      const res = await fetch(`/api/admin/questions/${questionId}/answer-with-similar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ similar_question_id: similarQuestionId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error((data.message as string) ?? "İşlem başarısız.");
        return;
      }
      if (data.email_sent) {
        toast.success("Soru reddedildi, kullanıcıya benzer cevap e-postayla gönderildi.");
      } else {
        toast.success("Soru reddedildi. E-posta yok, mail gönderilmedi; isterseniz manuel silin.");
      }
      loadData();
    } catch {
      toast.error("İşlem sırasında hata oluştu.");
    } finally {
      setAnswerWithSimilarLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu soruyu kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;
    const token = getAccessToken();
    if (!token) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/questions/${questionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        toast.error("Soru silinemedi.");
        return;
      }
      toast.success("Soru silindi.");
      router.replace("/admin/sorular");
    } catch {
      toast.error("Soru silinemedi.");
    } finally {
      setDeleting(false);
    }
  };

  const handleAiCardSummary = async () => {
    const token = getAccessToken();
    if (!token) {
      toast.error("Oturum bulunamadı.");
      return;
    }
    if (!answerText.trim()) {
      toast.error("Önce cevap metnini girin.");
      return;
    }
    setAiCardSummaryLoading(true);
    try {
      const res = await fetch("/api/admin/ai/card-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answer_text: answerText.trim().replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, ""),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error((data.message as string) ?? "Kart özeti oluşturulamadı.");
        return;
      }
      if (data.card_summary != null) setCardSummary(data.card_summary);
      toast.success("Kart özeti dolduruldu. İstediğiniz gibi düzenleyip kaydedin.");
    } catch {
      toast.error("Kart özeti oluşturulamadı.");
    } finally {
      setAiCardSummaryLoading(false);
    }
  };

  const handleAiH1Summary = async () => {
    const token = getAccessToken();
    if (!token) {
      toast.error("Oturum bulunamadı.");
      return;
    }
    if (!body.trim()) {
      toast.error("Soru metni gerekli.");
      return;
    }
    setAiH1Loading(true);
    try {
      const res = await fetch("/api/admin/ai/h1-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question_text: body.trim(),
          current_title: "",
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error((data.message as string) ?? "Başlık oluşturulamadı.");
        return;
      }
      if (data.h1_summary) {
        setAiH1Summary(data.h1_summary);
        if (data.should_apply) {
          setAiH1Enabled(true);
          toast.success("Başlık oluşturuldu ve sayfada H1 olarak kullanılacak. Sorunun devamı bloğu açık gösterilir.");
        } else {
          toast.info("Mevcut başlık yeterli görünüyor. İsterseniz üretilen başlığı kullanabilirsiniz.");
        }
      }
    } catch {
      toast.error("Başlık oluşturulamadı.");
    } finally {
      setAiH1Loading(false);
    }
  };

  const handleAiSeo = async () => {
    const token = getAccessToken();
    if (!token) {
      toast.error("Oturum bulunamadı.");
      return;
    }
    if (!body.trim()) {
      toast.error("Soru metni gerekli.");
      return;
    }
    setAiSeoLoading(true);
    try {
      const res = await fetch("/api/admin/ai/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question_text: body.trim(),
          answer_text: answerText.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error((data.message as string) ?? "SEO alanları oluşturulamadı.");
        return;
      }
      if (typeof data.slug === "string") setSeoSlug(data.slug);
      if (typeof data.meta_title === "string") setSeoTitle(data.meta_title);
      if (typeof data.meta_description === "string") setSeoDescription(data.meta_description);
      toast.success("SEO alanları dolduruldu. İstediğiniz gibi düzenleyip kaydedin.");
    } catch {
      toast.error("SEO alanları oluşturulamadı.");
    } finally {
      setAiSeoLoading(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Yükleniyor...</div>;
  }

  if (!question) {
    return <div className="text-sm text-muted-foreground">Soru bulunamadı.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Soru Düzenle</h1>
          <div className="text-xs text-muted-foreground">
            Durum: <Badge variant="outline">{question.status}</Badge>
            {question.asker_email && (
              <span className="ml-2"> · E-posta: {question.asker_email}</span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleDraft} disabled={saving}>
            Taslak Kaydet
          </Button>
          <Button onClick={handlePublish} disabled={saving}>
            Yayınla
          </Button>
          <Button variant="outline" onClick={handleReject} disabled={saving}>
            Reddet
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={saving || deleting}>
            {deleting ? "Siliniyor..." : "Soruyu Sil"}
          </Button>
        </div>
      </div>

      {/* Benzer sorular — en üstte */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Benzer sorular</h2>
          <span className="text-sm">
            E-posta: {question.asker_email ? (
            <span className="text-green-600">{question.asker_email}</span>
            ) : (
              <span className="text-amber-600">yok</span>
            )}
          </span>
        </div>
        {similarLoading ? (
          <p className="text-sm text-muted-foreground">Benzer sorular yükleniyor…</p>
        ) : similarQuestions.length > 0 ? (
          <ul className="space-y-3">
            {similarQuestions.slice(0, 10).map((q) => {
              const pct = Math.round(q.similarity * 100);
              const loading = answerWithSimilarLoading === q.id;
              return (
                <li key={q.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-background p-3">
                  <div className="min-w-0 flex-1">
                    <a
                      href={`/${q.category_slug}/soru/${q.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {q.title}
                    </a>
                    <p className="text-xs text-muted-foreground mt-0.5">Benzerlik: %{pct}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!!answerWithSimilarLoading}
                    onClick={() => handleAnswerWithSimilar(q.id)}
                  >
                    {loading ? "Gönderiliyor…" : "Bu cevapla yanıtla"}
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Henüz benzer soru bulunamadı. Soru yayınlandığında embedding üretilir; yayınlanmış sorularla karşılaştırılır.
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Sol: Kategori, Soru metni, hemen altında Başlık (H1) */}
        <div className="space-y-4 rounded-xl border p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Kategori</label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Soru metni</label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Detaylı soru — başlık ve SEO bu metinden üretilir"
              className="min-h-[160px]"
            />
          </div>
          <div className="space-y-2 rounded-lg border border-muted p-3">
            <label className="text-sm font-medium">Başlık (H1)</label>
            <p className="text-xs text-muted-foreground">
              Soru metninden AI ile başlık oluştur; sayfada H1 olur.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={aiH1Loading}
                onClick={handleAiH1Summary}
              >
                {aiH1Loading && <Loader2 className="size-4 animate-spin" />}
                {aiH1Loading ? "..." : "AI Başlık Oluştur"}
              </Button>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={aiH1Enabled}
                onChange={(e) => setAiH1Enabled(e.target.checked)}
                className="rounded border-input"
              />
              Sayfada bu başlığı H1 kullan
            </label>
            <Textarea
              value={aiH1Summary}
              onChange={(e) => setAiH1Summary(e.target.value)}
              placeholder="8–14 kelime, soruyu özetleyen başlık"
              className="min-h-[56px] text-sm"
            />
          </div>
        </div>

        <div className="space-y-3 rounded-xl border p-4">
          <label className="text-sm font-medium">Cevap (yayında gösterilir)</label>
          <AnswerEditor
            value={answerText}
            onChange={setAnswerText}
            placeholder="Cevabı buraya yazın"
            minHeight="280px"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Kart özeti (80–120 karakter)</label>
            <Input
              value={cardSummary}
              onChange={(e) => setCardSummary(e.target.value)}
              placeholder="Anasayfa ve liste kartlarında gösterilir"
              maxLength={140}
            />
            <Button
              variant="outline"
              size="sm"
              disabled={!answerText.trim() || aiCardSummaryLoading}
              onClick={handleAiCardSummary}
            >
              {aiCardSummaryLoading && <Loader2 className="size-4 animate-spin" />}
              {aiCardSummaryLoading ? "..." : "AI Kart Özeti Oluştur"}
            </Button>
          </div>
          <div className="space-y-2 rounded-lg border border-muted p-3">
            <label className="text-sm font-medium">İç link (cevap sonunda CTA)</label>
            <p className="text-xs text-muted-foreground">
              Soru detay sayfasında cevap kartının altında &quot;Sorunuzla ilgili rehber yazımızı inceleyebilirsiniz&quot; metni ve buton gösterilir.
            </p>
            <Input
              value={relatedGuideUrl}
              onChange={(e) => setRelatedGuideUrl(e.target.value)}
              placeholder="Örn. /hukuk-rehberi/rehber/kira-sorunlarinda-ilk-adimlar"
            />
            <Input
              value={relatedGuideLabel}
              onChange={(e) => setRelatedGuideLabel(e.target.value)}
              placeholder="Buton metni (örn. Kira sorunlarında ilk adımlar)"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-4 space-y-4">
        <h2 className="text-lg font-semibold">SEO</h2>
        <p className="text-sm text-muted-foreground">
          Slug, meta başlık ve meta açıklama yukarıdaki detaylı soru metninden üretilir.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={aiSeoLoading}
            onClick={handleAiSeo}
          >
            {aiSeoLoading && <Loader2 className="size-4 animate-spin" />}
            {aiSeoLoading ? "..." : "AI SEO Alanlarını Oluştur"}
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">SEO Slug</label>
            <Input
              value={seoSlug}
              onChange={(e) => setSeoSlug(e.target.value)}
              placeholder="kucuk-harfli-tire-ayirilmis-4-8-kelime"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Meta Title (45–60 karakter)</label>
            <Input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Doğal soru formatında"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Meta Description (140–160 karakter)</label>
            <Input
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Bilgilendirici, nötr ton"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          SEO alanlarını düzenleyip Taslak Kaydet veya Yayınla ile kaydedin.
        </p>
      </div>
    </div>
  );
}

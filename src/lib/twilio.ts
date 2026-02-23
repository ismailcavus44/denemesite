import twilio from "twilio";

console.log("🕵️‍♂️ TWILIO ENV DURUMU:", {
  sid: !!process.env.TWILIO_ACCOUNT_SID,
  token: !!process.env.TWILIO_AUTH_TOKEN,
  no: !!process.env.TWILIO_WHATSAPP_NUMBER,
});

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

export async function sendWhatsAppNotification(
  toPhoneNumber: string,
  questionSlug: string,
  categorySlug?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!accountSid || !authToken || !fromNumber) {
    return { ok: false, error: "Twilio env eksik" };
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yasalhaklariniz.com";
  const baseUrl = siteUrl.replace(/\/$/, "");
  const questionUrl = categorySlug
    ? `${baseUrl}/${categorySlug}/soru/${questionSlug}`
    : `${baseUrl}/soru/${questionSlug}`;
  const body = `Merhaba, Yasal Haklarınız Platformuna sorduğunuz soru uzman ekibimiz tarafından yanıtlanmıştır. Cevabınızı hemen okumak için linke tıklayın: ${questionUrl}`;

  try {
    const client = twilio(accountSid, authToken);
    const to = toPhoneNumber.startsWith("whatsapp:") ? toPhoneNumber : `whatsapp:${toPhoneNumber}`;
    await client.messages.create({
      body,
      from: fromNumber.startsWith("whatsapp:") ? fromNumber : `whatsapp:${fromNumber}`,
      to,
    });
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
}

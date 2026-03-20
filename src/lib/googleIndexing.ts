import { google } from "googleapis";

/** Google Indexing API ile URL'i URL_UPDATED olarak bildirir. Hata durumunda sessizce loglar. */
export async function notifyGoogleIndexing(url: string): Promise<void> {
  try {
    const credRaw = process.env.GOOGLE_CREDENTIALS;
    if (!credRaw) {
      console.warn("[google-indexing] GOOGLE_CREDENTIALS ortam değişkeni tanımlı değil.");
      return;
    }

    const cred = JSON.parse(credRaw) as { client_email?: string; private_key?: string };
    const clientEmail = cred.client_email;
    const privateKey = cred.private_key?.replace(/\\n/g, "\n");

    if (!clientEmail || !privateKey) {
      console.warn("[google-indexing] client_email veya private_key eksik.");
      return;
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/indexing"],
    });

    await auth.authorize();

    const indexing = google.indexing({ version: "v3", auth });
    await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type: "URL_UPDATED",
      },
    });
  } catch (err) {
    console.warn("[google-indexing] Hata:", err);
  }
}

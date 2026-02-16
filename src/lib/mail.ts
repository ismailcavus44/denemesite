import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer }[];
};

export async function sendMail({ to, subject, html, attachments }: SendMailOptions) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[mail] SMTP ayarları eksik, e-posta gönderilmedi.");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_SENDER_NAME || "YasalHaklariniz"}" <${process.env.SMTP_SENDER_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments: attachments?.map((a) => ({ filename: a.filename, content: a.content })),
    });
  } catch (err) {
    console.error("[mail] E-posta gönderilemedi:", err);
    throw err;
  }
}

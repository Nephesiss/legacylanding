import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

/* -------------------------------------------------------------------------- */
/*                        1. WEBHOOK & DESIGN CONFIG                          */
/* -------------------------------------------------------------------------- */

// CONFIGURATION: Customize Colors, Icons, and Role Pings here.
// To find Role IDs in Discord: Enable Developer Mode -> Right click Role -> Copy ID
// Format for Role Mention: <@&123456789012345678>
const WEBHOOK_STYLES: Record<string, { color: number; icon: string; title: string; mention?: string }> = {
  ban: {
    color: 0xef4444, // 🔴 Red
    icon: "🔨",
    title: "Unban Kérelem",
    mention: "", // Example: "<@&9876543210>" (Admin Role ID)
  },
  shop: {
    color: 0xf59e0b, // 🟡 Gold/Amber
    icon: "🛒",
    title: "Webshop Probléma",
    mention: "", // Example: "<@&1234567890>" (Owner Role ID)
  },
  bug: {
    color: 0xe85d04, // 🟠 Orange
    icon: "🐛",
    title: "Hiba Jelentés",
    mention: "", // Example: "<@&1122334455>" (Developer Role ID)
  },
  media: {
    color: 0xa855f7, // 🟣 Purple
    icon: "🎥",
    title: "Média Megkeresés",
  },
  support: {
    color: 0x3b82f6, // 🔵 Blue
    icon: "📫",
    title: "Általános Kérdés",
  },
  default: {
    color: 0x64748b, // ⚫ Slate
    icon: "📩",
    title: "Új Üzenet",
  },
};

/* -------------------------------------------------------------------------- */
/*                           2. SERVER CONFIGURATION                          */
/* -------------------------------------------------------------------------- */

const RATE_LIMIT_SECONDS = 5;
let lastSubmissionTimestamp = 0;

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER || "noreply@legacymc.hu";
const MAIL_TO = process.env.MAIL_TO || process.env.CONTACT_RECIPIENT || MAIL_FROM;

// Support both common env var names for Discord
const DISCORD_WEBHOOK_URL = process.env.CONTACT_DISCORD_WEBHOOK || process.env.DISCORD_WEBHOOK_URL;

const canSendEmail = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && MAIL_TO);
let transporter: nodemailer.Transporter | null = null;

/* -------------------------------------------------------------------------- */
/*                                3. UTILITIES                                */
/* -------------------------------------------------------------------------- */

const getTransporter = () => {
  if (!canSendEmail) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // True for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return transporter;
};

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const sanitize = (value?: string) => (value ?? "").replace(/[\u0000-\u001F\u007F]/g, "").trim();

const getSubjectLabel = (val: string) => {
  const map: Record<string, string> = {
    support: "Általános Kérdés",
    bug: "Hiba Jelentés",
    ban: "Unban Kérelem",
    shop: "Webshop Probléma",
    media: "Együttműködés",
  };
  return map[val] || val || "Egyéb";
};

const validatePayload = (payload: ContactPayload) => {
  const errors: string[] = [];
  if (!payload.name || !sanitize(payload.name)) errors.push("Név megadása kötelező.");
  if (!payload.email || !sanitize(payload.email)) errors.push("Email megadása kötelező.");
  if (!payload.message || sanitize(payload.message).length < 10)
    errors.push("Az üzenet legalább 10 karakter legyen.");
  return errors;
};

/* -------------------------------------------------------------------------- */
/*                           4. HTML EMAIL TEMPLATE                           */
/* -------------------------------------------------------------------------- */

const generateHtmlEmail = (name: string, email: string, subjectRaw: string, message: string) => {
  const subjectLabel = getSubjectLabel(subjectRaw);
  const year = new Date().getFullYear();
  const formattedMessage = message.replace(/\n/g, '<br/>');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Verdana, sans-serif; background-color: #0f0f0f; }
    .container { max-width: 600px; margin: 40px auto; background-color: #171717; border: 1px solid #333333; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #451a03 0%, #171717 100%); padding: 30px; border-bottom: 2px solid #f59e0b; text-align: center; }
    .brand { font-size: 26px; font-weight: 900; color: white; letter-spacing: 1px; text-transform: uppercase; }
    .accent { color: #f59e0b; }
    .content { padding: 40px 30px; color: #e5e5e5; }
    .label { color: #f59e0b; font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px; font-weight: bold; margin-bottom: 6px; display: block; opacity: 0.8; }
    .value { color: #ffffff; font-size: 17px; margin-bottom: 25px; display: block; font-weight: 500; }
    .badge { background-color: #f59e0b; color: #171717; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 800; display: inline-block; vertical-align: middle; }
    .message-box { background-color: #202020; border: 1px solid #333; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 25px; color: #d4d4d4; line-height: 1.6; font-size: 15px; margin-top: 10px; margin-bottom: 30px; }
    .btn { background: linear-gradient(to right, #d97706, #f59e0b); color: #171717; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 10px; font-size: 16px; box-shadow: 0 4px 6px rgba(245, 158, 11, 0.2); }
    .footer { background-color: #0a0a0a; padding: 20px; text-align: center; font-size: 12px; color: #525252; border-top: 1px solid #262626; }
    .row { display: table; width: 100%; margin-bottom: 10px; }
    .col { display: table-cell; width: 50%; vertical-align: top; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
       <span class="brand">Legacy<span class="accent">MC</span></span>
       <div style="color: #a3a3a3; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-top: 8px;">Kapcsolatfelvétel</div>
    </div>
    <div class="content">
      <div class="row">
        <div class="col">
          <span class="label">Feladó Neve</span>
          <span class="value">${name}</span>
        </div>
        <div class="col">
           <span class="label">Feladó Email</span>
           <span class="value">${email}</span>
        </div>
      </div>
      <div style="margin-bottom: 25px;">
        <span class="label">Ügy Típusa</span>
        <span class="badge">${subjectLabel}</span>
      </div>
      <span class="label">Üzenet tartalma</span>
      <div class="message-box">
        ${formattedMessage}
      </div>
      <div style="text-align: center;">
        <a href="mailto:${email}?subject=RE: [LegacyMC] ${subjectLabel}" class="btn">
          Válasz küldése (${name})
        </a>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${year} LegacyMC Server System.</p>
    </div>
  </div>
</body>
</html>
  `;
};

/* -------------------------------------------------------------------------- */
/*                              5. API HANDLER                                */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  const now = Date.now();

  // Rate limiting Check
  if (now - lastSubmissionTimestamp < RATE_LIMIT_SECONDS * 1000) {
    return NextResponse.json(
      { error: "Kérjük, várj néhány másodpercet az újabb beküldés előtt." },
      { status: 429 }
    );
  }

  // System Configuration Check
  if (!canSendEmail) {
    console.error("[CONTACT_API] Email service is NOT configured in .env variables.");
    return NextResponse.json(
      { error: "Az email szolgáltatás nincs megfelelően beállítva." },
      { status: 500 }
    );
  }

  const payload = (await request.json()) as ContactPayload;
  const errors = validatePayload(payload);

  if (errors.length) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const name = sanitize(payload.name);
  const email = sanitize(payload.email);
  const subjectRaw = sanitize(payload.subject || "support");
  const message = sanitize(payload.message);

  const subjectLabel = getSubjectLabel(subjectRaw);
  // Get IP securely behind reverse proxies if needed, otherwise fallback
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "Unknown IP";

  try {
    const mailTransporter = getTransporter();

    // 1. Send SMTP Email (HTML)
    if (mailTransporter) {
      const htmlContent = generateHtmlEmail(name, email, subjectRaw, message);
      await mailTransporter.sendMail({
        from: `LegacyMC Form <${MAIL_FROM}>`,
        to: MAIL_TO,
        replyTo: `${name} <${email}>`,
        subject: `[Kapcsolat] ${subjectLabel} - ${name}`,
        text: `Név: ${name}\nEmail: ${email}\nTéma: ${subjectLabel}\n\n${message}`,
        html: htmlContent,
      });
    }

    // 2. Send Discord Webhook (Rich Embed)
    if (DISCORD_WEBHOOK_URL) {
      try {
        const style = WEBHOOK_STYLES[subjectRaw] || WEBHOOK_STYLES.default;
        
        await fetch(DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "LegacyMC Contact Bot",
            avatar_url: "https://shop.legacymc.hu/logo.png", // Make sure this URL is publicly accessible
            content: style.mention ? `⚠️ **Staff Figyelem:** ${style.mention}` : undefined,
            embeds: [
              {
                title: `${style.icon} ${style.title}`,
                description: `>>> ${message}`, // ">>>" adds the nice visual block quote
                color: style.color,
                timestamp: new Date().toISOString(),
                author: {
                  name: `${name} | Kapcsolatfelvétel`,
                  icon_url: "https://cdn-icons-png.flaticon.com/512/847/847969.png", // Generic user icon
                },
                fields: [
                  {
                    name: "👤 Feladó Neve",
                    value: `**${name}**`,
                    inline: true,
                  },
                  {
                    name: "📧 Email Cím",
                    value: `\`${email}\``, // `code` block enables 1-click copy
                    inline: true,
                  }
                ],
                footer: {
                  text: `LegacyMC Weboldal • ${subjectLabel}`,
                  icon_url: "https://shop.legacymc.hu/logo.png",
                },
              },
            ],
          }),
        });
      } catch (webhookErr) {
        console.error("[CONTACT_API] Discord Webhook Failed:", webhookErr);
        // We continue silently so the user still gets a "Success" message because the email sent successfully
      }
    }

    lastSubmissionTimestamp = now;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CONTACT_API] Critical Error:", error);
    return NextResponse.json(
      { error: "Nem sikerült elküldeni az üzenetet. Próbáld újra később." },
      { status: 502 }
    );
  }
}
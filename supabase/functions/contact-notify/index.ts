// Supabase Edge Function "contact-notify".
// When the contact form on the Help page saves a message (table contact_messages),
// a Supabase Database Webhook calls this function, and it emails the message to the
// team inbox through Brevo (the same email service that sends the account emails).
//
// Secrets (Supabase → Edge Functions → Secrets):
//   BREVO_API_KEY   – an API key from Brevo (SMTP & API → API Keys). Never put it in the website.
//   WEBHOOK_SECRET  – any long random text; the webhook sends the same text in the header "x-webhook-secret".
// Setup steps: docs/contact-form-setup.md

const TEAM_EMAIL = 'digitalboomer.team@gmail.com';
const SENDER = { name: 'Digital Boomer', email: 'digitalboomer.team@gmail.com' };

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

Deno.serve(async (req) => {
  // Only Supabase's own webhook knows this secret, so nobody else can send emails through this function.
  const secret = Deno.env.get('WEBHOOK_SECRET');
  if (!secret || req.headers.get('x-webhook-secret') !== secret) {
    return new Response('Not allowed', { status: 401 });
  }

  let record: Record<string, string> | undefined;
  try {
    const payload = await req.json();
    if (payload?.type !== 'INSERT' || payload?.table !== 'contact_messages') {
      return new Response('Ignored', { status: 200 });
    }
    record = payload.record;
  } catch {
    return new Response('Bad request', { status: 400 });
  }
  if (!record) return new Response('Bad request', { status: 400 });

  const name = String(record.name ?? '').slice(0, 200);
  const email = String(record.email ?? '').slice(0, 320);
  const topic = String(record.topic ?? '').slice(0, 100);
  const message = String(record.message ?? '').slice(0, 5000);
  const lang = String(record.lang ?? '').slice(0, 5);
  const sent = String(record.created_at ?? '');

  const html = `
    <h2>New message from the Digital Boomer contact form</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}<br>
    <strong>Email:</strong> ${escapeHtml(email)}<br>
    <strong>Topic:</strong> ${escapeHtml(topic)}<br>
    <strong>Website language:</strong> ${escapeHtml(lang)}<br>
    <strong>Sent:</strong> ${escapeHtml(sent)}</p>
    <p style="white-space:pre-wrap;border-left:4px solid #17324D;padding-left:12px">${escapeHtml(message)}</p>
    <p>Press "Reply" to answer ${escapeHtml(name)} directly. The message is also saved in Supabase (Table Editor → contact_messages); delete it there once it is answered.</p>`;

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': Deno.env.get('BREVO_API_KEY') ?? '',
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: SENDER,
      to: [{ email: TEAM_EMAIL, name: 'Digital Boomer Team' }],
      // "Reply" in Gmail goes straight to the person who wrote.
      replyTo: email.includes('@') ? { email, name: name || email } : undefined,
      subject: `Digital Boomer contact form: ${topic || 'New message'} – ${name}`.slice(0, 200),
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    // Shows in Supabase → Edge Functions → contact-notify → Logs.
    console.error('Brevo error', response.status, await response.text());
    return new Response('Email failed', { status: 502 });
  }
  return new Response('Sent', { status: 200 });
});

# Contact form (Help page)

The form "Do you have a question or suggestion?" on the Help page saves each message in the Supabase project (servers in Frankfurt), in the table `contact_messages`. Visitors can only add a message; nobody can read messages through the website. The team reads them in the Supabase dashboard.

Code: `sendContactMessage` in `src/utils/contact.ts`.

## One-time setup in Supabase
**SQL Editor → New query**, paste and run:

```sql
create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  topic text not null default '' check (char_length(topic) <= 100),
  message text not null check (char_length(message) between 1 and 5000),
  lang text not null default 'en' check (char_length(lang) <= 5)
);

alter table public.contact_messages enable row level security;

-- Anyone may send a message. There is no "select" policy, so nobody can read messages through the website.
create policy "Anyone can send a message" on public.contact_messages
  for insert to anon, authenticated with check (true);
```

## Reading and answering messages
**Table Editor → contact_messages.** Answer from `digitalboomer.team@gmail.com` to the address in the message. Delete messages when they are answered and no longer needed (the privacy page promises this).

## Email alert for every new message (Supabase + Brevo)
Every new message is emailed to `digitalboomer.team@gmail.com` by the Edge Function `supabase/functions/contact-notify/index.ts`. "Reply" in Gmail goes straight to the person who wrote.

One-time setup:
1. **Brevo → API key.** Brevo → your name (top right) → **SMTP & API** → tab **API Keys** → **Generate a new API key**, name it `supabase-contact`. Copy it (it is shown only once). Never put it into the website or the repository.
2. **Supabase → secrets.** **Edge Functions → Secrets** (or Project Settings → Edge Functions). Add:
   - `BREVO_API_KEY` = the key from step 1
   - `WEBHOOK_SECRET` = a long random text you make up (for example 30 letters and numbers). Keep it for step 4.
3. **Supabase → function.** **Edge Functions → Deploy a new function → Via Editor**. Name: `contact-notify`. Replace the example code with the whole content of `supabase/functions/contact-notify/index.ts`, then **Deploy function**.
4. **Supabase → webhook.** **Database → Webhooks** (press "Enable webhooks" if asked) → **Create a new hook**:
   - Name: `contact-notify`, Table: `contact_messages`, Events: **Insert** only
   - Type: **Supabase Edge Functions**, function `contact-notify`, method POST, timeout 5000
   - HTTP Headers: keep the "Authorization" header Supabase offers, and add `x-webhook-secret` with the same text as `WEBHOOK_SECRET`
   - **Create webhook**
5. **Test:** send a message with the form on the Help page. Within a minute an email arrives in the team inbox.

If no email arrives: Supabase → Edge Functions → contact-notify → **Logs**. "Not allowed" means the two secret texts differ. A Brevo error about an unknown IP address means Brevo blocks API calls from new places: Brevo → Security → **Authorised IPs** → deactivate the blocking (Supabase's servers do not have a fixed address).

## Good to know
- Supabase pauses free projects after 7 days without activity. Then accounts, the contact form and the email alert stop working until someone presses "Restore" in the Supabase dashboard. Check this before tests and presentations.
- Brevo's free plan sends up to 300 emails a day, shared between account emails and these alerts.
- History: until November 2026 the site was on Netlify and used Netlify Forms. Netlify's free credits ran out, so the site moved to GitHub Pages.

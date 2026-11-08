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

## Good to know
- Supabase pauses free projects after 7 days without activity. Then accounts and the contact form stop working until someone presses "Restore" in the Supabase dashboard. Check this before tests and presentations.
- An email notification for new messages is not set up. It would need a Supabase Edge Function that sends an email through Brevo.
- History: until November 2026 the site was on Netlify and used Netlify Forms. Netlify's free credits ran out, so the site moved to GitHub Pages.

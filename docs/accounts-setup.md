# Switching on real accounts (Supabase)

The website already contains everything for accounts: sign up, email confirmation, sign in, forgotten password, and progress saved to the account. It stays off until the steps below are done. Guests can always use everything without an account.

Someone from the team has to do steps 1 to 6, because they need your own Supabase account. Never send the **service_role** key to anyone, and never put it into the website. The website only needs the **URL** and the **anon public** key; those are meant to be public.

## 1. Create the project
1. Sign up at supabase.com and create a new project.
2. Region: **Central EU (Frankfurt)**, so that personal data stays in the EU.
3. Choose a strong database password and keep it safe.

## 2. Copy the two keys into the website
In Supabase: **Project Settings → API** (or **Data API**). Copy **Project URL** and the **anon public** key.

Create a file `digital-boomer/.env.local` with:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Then build and publish again (`npm run build`, then the Netlify deploy command in CLAUDE.md). The values are put into the website when it is built. `.env.example` shows the format.

## 3. Tell Supabase the website address
**Authentication → URL Configuration**
- Site URL: `https://digital-boomer.netlify.app`
- Redirect URLs: add `https://digital-boomer.netlify.app/**` and `http://localhost:3000/**`

**Authentication → Sign In / Providers → Email**: keep **Confirm email** switched on. Minimum password length: 8.

## 4. Email texts (so links work on any device)
**Authentication → Emails → Templates.** Replace the two templates below. These links work even when the email is opened on another device than the one used to sign up.

**Confirm signup** – subject: `Bitte bestätigen Sie Ihr Konto bei Digital Boomer / Please confirm your account`

```html
<h2>Willkommen bei Digital Boomer!</h2>
<p>Sie haben gerade ein Konto erstellt. Bitte bestätigen Sie Ihre E-Mail-Adresse:</p>
<p><a href="{{ .SiteURL }}/?token_hash={{ .TokenHash }}&type=email" style="background:#17324D;color:#ffffff;padding:14px 22px;border-radius:12px;text-decoration:none;font-weight:bold;">Konto bestätigen</a></p>
<p>Wenn Sie kein Konto erstellt haben, können Sie diese E-Mail einfach löschen.</p>
<hr>
<h2>Welcome to Digital Boomer!</h2>
<p>You have just created an account. Please confirm your email address:</p>
<p><a href="{{ .SiteURL }}/?token_hash={{ .TokenHash }}&type=email" style="background:#17324D;color:#ffffff;padding:14px 22px;border-radius:12px;text-decoration:none;font-weight:bold;">Confirm my account</a></p>
<p>If you did not create an account, you can simply delete this email.</p>
```

**Reset password** – subject: `Neues Passwort für Digital Boomer / New password for Digital Boomer`

```html
<h2>Neues Passwort wählen</h2>
<p>Klicken Sie auf den Knopf, um ein neues Passwort zu wählen:</p>
<p><a href="{{ .SiteURL }}/?token_hash={{ .TokenHash }}&type=recovery" style="background:#17324D;color:#ffffff;padding:14px 22px;border-radius:12px;text-decoration:none;font-weight:bold;">Neues Passwort wählen</a></p>
<p>Wenn Sie das nicht angefordert haben, löschen Sie diese E-Mail. Ihr Passwort bleibt dann gleich.</p>
<hr>
<h2>Choose a new password</h2>
<p><a href="{{ .SiteURL }}/?token_hash={{ .TokenHash }}&type=recovery" style="background:#17324D;color:#ffffff;padding:14px 22px;border-radius:12px;text-decoration:none;font-weight:bold;">Choose a new password</a></p>
<p>If you did not ask for this, delete this email. Your password stays the same.</p>
```

## 5. Table for saved progress
**SQL Editor → New query**, paste and run:

```sql
create table if not exists public.progress (
  user_id uuid primary key references auth.users on delete cascade,
  completed text[] not null default '{}',
  saved text[] not null default '{}',
  steps jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

create policy "Read own progress" on public.progress for select using (auth.uid() = user_id);
create policy "Create own progress" on public.progress for insert with check (auth.uid() = user_id);
create policy "Change own progress" on public.progress for update using (auth.uid() = user_id);
```

Row level security means every user can only see and change their own progress.

## 6. An email sender for real users
Supabase's built-in sender is only for testing: it sends very few emails per hour and may only deliver to members of your Supabase team. For real users:
1. Create an account with an email service, for example Resend or Brevo, and verify a sending address or domain there.
2. In Supabase: **Authentication → Emails → SMTP Settings**, switch on custom SMTP and enter the details from that service.
3. Afterwards you can raise the email limit under **Authentication → Rate Limits**.

**What we use (set up 8 Nov 2026):** Brevo, with the team's own Gmail address as the verified sender and "Digital Boomer" as the sender name. Brevo sends Gmail senders from an address like `name@<account-number>.brevosend.com`, keeping the part before the @; replies go to the Gmail address. In Supabase, **Sender email** must match the Brevo sender exactly. For an address without "brevosend" (e.g. `noreply@digitalboomer.de`), the team needs its own domain and Brevo's DNS records.

**Good to know:** signing up again with an address that already has an account sends no email (Supabase does this on purpose). The website then says so and points to "Forgot password".

## Before real people use it
- Update the privacy page with the team's real contact address (a legal requirement in Germany).
- Deleting an account currently needs a team member in the Supabase dashboard (**Authentication → Users**). A "delete my account" button needs a small server function and is a good next step.

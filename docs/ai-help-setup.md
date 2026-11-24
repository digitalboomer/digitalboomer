# AI help assistant (help window)

Typed questions in the help window are answered by Google Gemini. The suggested questions keep their checked, pre-written answers, and the pre-written answers are also the fallback whenever the AI cannot answer.

How it works:
- The website (`src/components/SupportModal.tsx`, `src/utils/helpChat.ts`) sends the conversation, the language, **where the person is** (lesson and step) and up to 8 lessons that may fit, found with the site search. The lesson the person is in comes first; the **full text of the best 3 lessons** goes along, so the AI answers with the same steps people practise on the site.
- The function (`supabase/functions/help-chat/index.ts`) holds the instructions for the AI (plain language, "Sie" in German, answer from our lessons, safety rules, no financial advice) and calls Gemini with Google's official library (`@google/genai`). It answers with the text and up to 2 recommended lessons, which the website shows as buttons.
- If a model is retired, overloaded or over its quota, the function tries the next one by itself: first `GEMINI_MODEL` (default `gemini-3.5-flash-lite`), then Google's aliases `gemini-flash-lite-latest` and `gemini-flash-latest`, which always point to a current model.
- The Gemini key exists only as a Supabase secret. It is never in the website, the repository, a `.env` file or a chat.
- Limits: 40 questions per visitor per day, 1,500 for the whole site per day (constants at the top of the function). A visitor is counted with a daily-changing one-way hash of the internet address; counts are deleted after 7 days. Questions and answers are not stored, and Google is asked not to store them (`store: false`).
- Every AI answer is labelled "AI answer – can contain mistakes"; the window says it is Google Gemini (EU AI Act: people must know they talk to an AI).

## One-time setup (about 20 minutes)

### 1. Gemini API key, with billing (team Google account)
Google's terms allow only the **paid** Gemini API for apps used by people in the EU. On the paid service, Google does not use the questions to improve its products.

1. Open https://aistudio.google.com with the team account → **Get API key** → **Create API key** in a new Google Cloud project, name it `digital-boomer`.
2. In that project, switch on billing: **Set up billing** (Google Cloud → Billing → link a billing account). The cost for a student project is a few cents to a few euros per month.
3. Protect the budget: Google Cloud → **Billing → Budgets & alerts → Create budget**, for example 5 €, with email alerts at 50 % and 100 %.
4. Copy the key. Do not send it by chat or email, and never put it into the website or the repository.

### 2. Database function for the daily limits (Supabase)
**SQL Editor → New query**, paste and run:

```sql
create table if not exists public.help_chat_usage (
  day date not null default current_date,
  client text not null,
  questions int not null default 0,
  primary key (day, client)
);

-- No policies: the website cannot read or change this table, only the server function can.
alter table public.help_chat_usage enable row level security;

create or replace function public.help_chat_allow(p_client text, p_per_person int, p_per_day int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  total int;
  mine int;
begin
  delete from help_chat_usage where day < current_date - 7;
  select coalesce(sum(questions), 0) into total from help_chat_usage where day = current_date;
  if total >= p_per_day then
    return false;
  end if;
  insert into help_chat_usage (day, client, questions) values (current_date, p_client, 1)
  on conflict (day, client) do update set questions = help_chat_usage.questions + 1
  returning questions into mine;
  return mine <= p_per_person;
end;
$$;

revoke all on function public.help_chat_allow(text, int, int) from public, anon, authenticated;
```

It should say "Success. No rows returned".

### 3. Secret and function (Supabase)
1. **Edge Functions → Secrets**: add `GEMINI_API_KEY` = the key from step 1.
2. **Edge Functions → Deploy a new function → Via Editor**. Name: `help-chat`. Replace the example code with the whole content of `supabase/functions/help-chat/index.ts`, then **Deploy function**.
3. In the function's **Details / Settings**, switch **"Verify JWT with legacy secret"** (or "Enforce JWT verification") **off** and save. Our website uses the new publishable key (`sb_publishable_…`), which this check does not understand; with it on, every question fails with "401 Invalid JWT". This opens nothing: the publishable key is public anyway, and the daily limits in step 2 protect the cost.

### 4. Test before anyone sees it
1. Supabase → Edge Functions → `help-chat` → **Test** (or "Invoke"), method POST, body:
   `{"lang":"en","messages":[{"role":"user","text":"How do I send a photo on WhatsApp?"}],"lessons":[{"id":"whatsapp-photo","title":"WhatsApp: Send a Photo"}]}`
   You should get `{"answer":"…","lessonIds":["whatsapp-photo"]}`. If not, see "When something goes wrong".
2. Then ask Claude Code to test the live function with real questions (it calls the function with the site's public key; no secret is needed for this). Adjust the instructions if answers are not good enough.

### 5. Switch it on in the website
Add the line `VITE_AI_HELP=on` to `.env.production`, commit and push. The help window, the footer, the Help page and the privacy page then say "AI help assistant". Without this line the site honestly offers only pre-written answers.

Locally: put `VITE_AI_HELP=on` into `.env.development.local` (not committed) and restart `npm run dev`.

## When something goes wrong
- The window says "The AI cannot answer right now": Supabase → Edge Functions → `help-chat` → **Logs**.
  - "GEMINI_API_KEY is not set": step 3.1.
  - "Daily limit check failed … 404": the SQL from step 2 was not run.
  - "Daily limit check failed … 401": the project's legacy keys are switched off. Project Settings → API Keys → create a **secret key** (`sb_secret_…`) and add it as the secret `DB_SECRET_KEY` (step 3.1). Like every secret key, it stays in Supabase only.
  - "Model … failed 403" or "401": the key is wrong, or billing is not active on its Cloud project (step 1).
  - "Model … failed 404" for every model: Google renamed its models; set the secret `GEMINI_MODEL` to a current name from https://aistudio.google.com/docs/models.
  - "Model … failed 429" for every model: quota or budget reached; check the Cloud project.
  - No log at all, and the browser shows "401": "Verify JWT" is still on (step 3.3).
- "The AI is resting until tomorrow": the daily limits were reached. Raise the constants at the top of the function and deploy it again.
- After changing the function's code: open it in Supabase, paste the new code, **Deploy** again.
- Supabase pauses free projects after 7 days without activity; then the AI help stops too.

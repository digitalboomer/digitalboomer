# "Was this lesson easy?" (lesson feedback)

After every finished lesson, the celebration window asks "Was this lesson easy?" with three answers (Easy, Okay, Hard) and an optional comment. The answer is saved anonymously in the Supabase table `lesson_feedback`, the same way as the contact form: visitors can only add a row, nobody can read rows through the website, and the team reads them in the Supabase dashboard.

One tap on an answer saves one row. A comment, if someone writes one, is saved as a second row with the same answer and the comment text, so count answers only in rows without a comment (the queries below do that).

Stored per answer: the lesson id, the answer, the optional comment (at most 500 characters), the site language and the device chosen in the lesson (iPhone, Android or computer, if any). Not stored: names, accounts, email addresses or anything else about the person. The comment field asks people not to write personal information.

Code: `sendLessonFeedback` in `src/utils/lessonFeedback.ts`, the question in `src/components/LessonFeedback.tsx` (inside `CelebrationDialog.tsx`).

## One-time setup in Supabase
**SQL Editor → New query**, paste and run:

```sql
create table if not exists public.lesson_feedback (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  lesson_id text not null check (char_length(lesson_id) between 1 and 80),
  rating text not null check (rating in ('easy', 'okay', 'hard')),
  comment text not null default '' check (char_length(comment) <= 500),
  lang text not null default 'en' check (char_length(lang) <= 5),
  device text not null default '' check (device in ('', 'iphone', 'android', 'computer'))
);

alter table public.lesson_feedback enable row level security;

-- Anyone may send an answer. There is no "select" policy, so nobody can read answers through the website.
create policy "Anyone can rate a lesson" on public.lesson_feedback
  for insert to anon, authenticated with check (true);
```

Until this is done, the window thanks people but says their answer could not be saved.

## Reading the answers
**Table Editor → lesson_feedback** shows every answer. For an overview per lesson, run this in the **SQL Editor**:

```sql
select
  lesson_id,
  count(*) as answers,
  count(*) filter (where rating = 'easy') as easy,
  count(*) filter (where rating = 'okay') as okay,
  count(*) filter (where rating = 'hard') as hard,
  round(100.0 * count(*) filter (where rating = 'hard') / count(*)) as percent_hard
from public.lesson_feedback
where comment = ''
group by lesson_id
order by percent_hard desc, answers desc;
```

Lessons at the top are the ones people find hardest. The comments are in the `comment` column:

```sql
select created_at, lesson_id, rating, comment, lang, device
from public.lesson_feedback
where comment <> ''
order by created_at desc;
```

For the usability report (13 Jan), export the table as CSV (Table Editor → Export).

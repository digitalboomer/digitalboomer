# Digital Boomer – project guide for Claude Code

## What this is
Digital Boomer is a learning website that helps older adults with little digital experience practise everyday digital skills (WhatsApp, email, online banking, everyday AI, digital safety) step by step, in a safe sandbox.

It is a university group project for **BIS5152 Human-Centered AI Interface Design** (WiSe 2026/27, Prof. Dr. Stephan Thesmann). Team: Hatice Shamma, Sabine Müller, Daniel Moravek, Leon Kurepa, Florian Seeger, Valentin Alexander Lechler.

The first version was generated in Google AI Studio. We are now turning it into a prototype that actually works end to end.

## Course milestones (drive priorities)
- **11 Nov 2026 – Clickable low-fidelity prototype** (current goal): the core user journey must be clickable from start to finish.
- 18 Nov – first working website
- 9 Dec – accessibility report (WCAG / EAA / BITV)
- 16 Dec – beta with real AI integration
- 13 Jan – usability test report · 20 Jan – final website

## The user journey we must support
Persona: **Karl, 72**, retired, uses WhatsApp for text messages only, wants to send a photo to his family, afraid of "pressing the wrong button".

1. **Discover** – opens the site from a family link → calm welcome, clear start, no ads
2. **Choose a topic** – Messaging apps → WhatsApp → "Send a photo" → visible topic cards, task-based titles. No mandatory skill-level selection.
3. **Watch & learn** – short tutorial → read aloud, replay, plain language, numbered steps
4. **Practice & recover** (most important) – practises in a simulated WhatsApp screen, taps the wrong icon → gentle hint, retry, optional help. Never an error that stops him.
5. **Complete & return** – clear success, sees progress, can repeat the lesson. Must work **without creating an account**.

## Commands
```
npm install
npm run dev                      # http://localhost:3000
npm run build
npm run lint                     # tsc --noEmit
git push                         # publishes: GitHub Actions builds and deploys to GitHub Pages
```
Hosted at https://digitalboomer.github.io/digitalboomer/ (GitHub Pages, public repository https://github.com/digitalboomer/digitalboomer, account of digitalboomer.team@gmail.com). Every push to `main` runs `.github/workflows/deploy.yml` (lint, build, publish); the base path `/digitalboomer/` is set in `vite.config.ts`, public settings in `.env.production` (only the Supabase URL and publishable key). Moved from Netlify in November 2026 because Netlify's free deploy credits ran out; the old site https://digital-boomer.netlify.app still shows an older version until the credits reset on 6 Dec 2026. The build leaves `public/assets/aistudio`, `public/images` and `public/src` out of the published site.

## Tech stack
React 19 + TypeScript + Vite 8 + Tailwind CSS 4, `lucide-react`, `@fontsource/atkinson-hyperlegible` (self-hosted font), `motion`, `qrcode`, `@supabase/supabase-js` (accounts; Supabase project in Frankfurt, emails sent through Brevo SMTP, keys in `.env.local`). No own server yet (`express` and `@google/genai` are installed but unused).

## Code map
- `src/App.tsx` – all app state; shows the page that matches the current route
- `src/utils/router.ts` – hash routes, e.g. `#/topics`, `#/tutorial/whatsapp-photo/step/2` (old page IDs such as `#/themen` still work)
- `src/utils/progress.ts` – saves bookmarks, completed lessons and the current step in localStorage
- `src/utils/useDialogFocus.ts` – Esc, focus trap and focus return for all dialogs
- `src/components/practice/` – reusable guided practice: `GuidedPractice` (instructions, hints, "Show me"), `FreeRoam` (`#/explore/<appId>`, click around an app with no task; its tap map lives in `nextState`, and buttons with no screen give a gentle note), `PracticeTap` (anything tappable), `PhoneParts` (status bar, working keyboard, photos), `messaging/` (each app's own colours, chat list, message style and button layout, set in `apps.ts` and built in `MessengerScreen.tsx`), `SocialScreen`, `BankingScreen`, `EmailScreen`, `practiceScreens.ts` (how to add a scenario)
- `src/data/practiceLessons.ts` – all practice lessons in English and German. Messaging lessons are generated per app, so each app shows its own sequence of taps
- `src/data/services.ts` – every app, email service, social network and bank we teach, with logos (from `simple-icons`; no logo there = name tile)
- `src/screens/ServiceHubScreen.tsx` – choose your service, then what to do in it (`#/messaging`, `#/email`, `#/social`, `#/banks`)
- `src/data/socialLessons.ts`, `socialTasks.ts`, `bankingTasks.ts`, `emailTasks.ts` – lessons per service, and general lessons. The `*Tasks` files add posting, messages, standing orders, transfers abroad, forwarding, spam and more
- `src/data/safetyLessons.ts`, `src/components/ScamExample.tsx` – Digital Safety guides and tap-the-warning-sign scam examples (invented companies, addresses end in .example)
- `src/data/guideArt.ts` – a drawn picture for each guide without an app logo; lessons of an app show its logo in lists
- `src/components/practice/DesktopShell.tsx`, `src/data/computerWords.ts` – with "Computer" chosen, every phone lesson runs inside a browser or program window, with "click" wording and a typing bar instead of the phone keyboard
- `src/components/practice/EmailWeb.tsx`, `src/data/emailDesktop.ts` – email on the computer: each of the 8 services has its own website layout (Apple Mail: the Mac program), with the compose button, folders, list, reading pane and writing window where that service has them. `emailDesktopLesson` rewrites the hints to match ("Send is the blue button at the bottom left") and drops phone-only steps (opening the folder menu; going back where the email opens next to the list). Used by every email lesson in computer mode and by the "Get started on the computer" email lessons
- `src/utils/phoneType.ts`, `src/components/PhonePicker.tsx` – iPhone, Android or computer, chosen at the start of a lesson, in a service's lesson list or on the progress page (not in the settings panel). `fitsDevice` hides the "Get started on the computer" lessons unless "Computer" is chosen. Every simulated screen follows it (status bar, keyboard, back symbol, dialogs, bottom bar); messaging apps that differ on iPhone have their own layout and lesson text (`appStyle`, `appInfo` in `messaging/apps.ts`, `iphoneLesson` in `practiceLessons.ts`). Banking is phone only (`phoneOnly` in `PhonePicker`): banking apps are made for the phone, so bank lessons always show a phone and have no computer lesson
- `src/data/desktopLessons.ts`, `src/components/practice/DesktopScreens.tsx` – one lesson per service on a simulated computer (browser or program window), scaled to fit any screen
- `src/data/learningPath.ts` – what comes next after each lesson; every recommendation reads from here
- `src/utils/helpLevel.ts`, `src/components/HelpLevelPicker.tsx` – no help, tips or complete help, chosen before and during a lesson
- `src/components/PictureQuiz.tsx` – "real photo or AI?" test with 5 real CC0 photos from Wikimedia Commons and 7 AI pictures
- `src/data/aiLessons.ts` – Everyday AI lessons; a step's `example` shows a picture example from `src/components/LessonExample.tsx` (our own AI-generated images with real flaws, or drawn scenes; no videos yet)
- `src/utils/feedback.ts` – quiet click and result sounds, generated in the browser, with an on/off setting
- `src/components/Icon.tsx` – all icons (lucide), so nothing is loaded from Google
- `src/types.ts` – `PageId`, `Tutorial`, `TutorialStep`, `UserProfile`, …
- `src/data/content.ts` – all other content, in English (`*_EN`) and German (`*_DE`) versions: 6 categories, security checklist, FAQs
- `src/screens/` – one file per page (Home, Topics, Tutorials, TutorialDetail, Security, AiLessons (`#/everyday-ai`, all Everyday AI lessons), Dashboard, Auth, AboutHelp, AccessibilityPrivacy, SearchResults)
- `src/components/` – Header (with the settings panel), Footer, SupportModal, QRCodeModal, CertificateModal, CelebrationDialog (window with confetti when a lesson is finished; no confetti with reduced motion), OfficialTopicIcon
- `src/utils/speech.ts` – read aloud with the Web Speech API
- `src/i18n/translate.ts`, `src/i18n/{tr,es,hr}.json` – Turkish, Spanish and Croatian (language dropdown in the top bar). For these the site renders its English version and a live translation layer swaps every English text on the page and in read aloud for the dictionary entry (exact text, then `{0}` patterns, then sentence by sentence). Untranslated text stays English. The dictionaries were machine-written by Claude and still need a check by native speakers. Other languages: the browser's own "Translate" (guards in `main.tsx` keep React from crashing). If the browser itself is set to English, German, Turkish, Spanish or Croatian, the page tells the browser not to translate it (`translate="no"`, set early in `index.html` and in `setPageLanguage`), because the site starts in that language () and the menu has the others
- Images: `src/assets/images/` is the one in use; `public/images`, `public/assets/images`, `public/src/assets/images` and `public/assets/aistudio` are duplicates or AI Studio leftovers

## Current state: what is real and what is fake
Works: hash routing with browser Back and links to every page and step, guest start without an account, "My progress" in the header for everyone (guests also see "Sign in"; "Continue as a guest" opens My progress), progress saved in this browser with "Resume lesson" at the exact step, "Reset demo" in the footer, realistic guided practice for 12 messaging apps (message, photo, voice message, answer one message, create a group, some video calls), 8 email services with their own layouts (reply; new email with To, Subject and text, including the warnings for a missing recipient or subject; forward, attachment, search, star or flag, archive, restore from trash, report spam, unsubscribe), 9 social networks (like and comment, search, posting, messages, sending a post, following, blocking), 8 banks (balance, transfer, statement, savings, scheduled and standing orders, transfers abroad, name check, rejecting a payment, blocking a card), and Everyday AI lessons with a pre-written practice chat and picture examples, free roam for every app (not for Everyday AI), a working simulated keyboard, click sound with on/off switch, EN/DE switch, text size (3 steps), light/dark/high-contrast themes (all saved in localStorage), search, bookmarks, the phishing email mockup with clickable warning signs, quizzes, read aloud, QR code modal, Esc and focus handling in all dialogs.

Simulated, and labelled as such:
- **The help assistant is not AI.** `SupportModal.tsx` picks pre-written answers by matching words. Real Gemini integration is planned for December.
- **Accounts are real once Supabase is connected** (`src/utils/auth.ts`, setup in `docs/accounts-setup.md`): sign up with email confirmation, sign in, forgotten password, progress saved to the account. Without the two `VITE_SUPABASE_*` values the sign-in pages say that accounts are not switched on yet. Accounts stay optional; guests type their own name for the certificate.
- **The contact form is real:** the Help page form saves each message in the Supabase table `contact_messages` (insert only; the team reads them in the Supabase dashboard). A Database Webhook calls the Edge Function `supabase/functions/contact-notify`, which emails each message to the team inbox through Brevo (set up and tested Nov 2026; secrets BREVO_API_KEY and WEBHOOK_SECRET live only in Supabase). Code in `src/utils/contact.ts`, setup in `docs/contact-form-setup.md`. The help window's Email tab opens Gmail or Outlook in a new tab with a filled-in email to the team.
- **The simulated apps** are built from how the apps generally look. They are not copies of the real screens: no screenshots, real artwork or real content are used. App updates change their look, so check the flows against the real apps before a usability test.
- **The picture quiz** states which pictures are real or AI. Our AI pictures come from Google AI Studio. Keep the photo credits if you change it.
- **Bank practice** deliberately shows a neutral "Practice bank" with fictional data and layout families, never a bank's logo, name or copied design inside the simulated screen, and no login fields: that would look like phishing. Do not copy real bank apps or landing pages. Logos appear only on the choice page.

## Lesson rules
A text lesson can only be finished when every step was opened, all warning signs and exercises were done and all questions answered (`missing` in `TutorialDetailScreen.tsx`). Leaving a started, unfinished lesson asks first (`setLeaveGuard` in `router.ts`, `LeaveLessonDialog.tsx`). Printing the certificate uses its own sheet in `CertificateModal.tsx` with `@media print` in `index.css`.

## Known issues
- The extra bottom space in `GuidedPractice.tsx` (`pb-[76px]`) and the footer (`pb-24`) was for Netlify's "Powered by Netlify" badge. GitHub Pages has no badge, so this space can be reduced.
- Supabase pauses free projects after 7 days without activity (accounts and contact form then fail until "Restore" is pressed in the dashboard). Check before tests and presentations.
- `bun.lock` is out of date. The team uses npm, so `package-lock.json` is the lockfile to trust.
- The style guide says the website is in German with formal "Sie". Since Nov 2026 (Leon's decision) the site starts in the visitor's browser language if it is English, German, Turkish, Spanish or Croatian (`startLanguage` in `src/i18n/translate.ts`), otherwise in English; a choice in the language menu always wins. **Ask the team before changing the fallback language.**

## Design rules (from `docs/style-guide.md`, the full style guide)
Follow these in every change. If code and style guide disagree, the style guide wins. Service logos stay in their brand colours and remain trademarks of their owners; they only name the service. Exception: the simulated phone screens use the real apps' colours and small keyboard keys on purpose, so they feel real. Type sizes are set in `@theme` in `src/index.css`.

**Colours**
| Token | Hex | Use |
|---|---|---|
| Navy | `#17324D` | headings, navigation, primary button (one main action per page), links (always underlined), focus ring |
| Deep Teal | `#176B68` | secondary/learning buttons, progress, success |
| Off-White | `#F7F8F5` | page background |
| White | `#FFFFFF` | cards, fields, dialogs |
| Text | `#202B36` | all body text; never grey text |
| Pale Blue | `#EAF2F8` | info boxes |
| Gray | `#E5E9ED` | decorative lines only (never the only border of a control) |
| Red | `#B3261E` | errors and security warnings only, always with icon + text |
| Input border | `#667382` | 2 px border of fields and checkboxes |
| Pale teal / pale red | `#E3F1F0` / `#FDECEA` | success / error box backgrounds |
| Navy hover / pressed | `#0F2438` / `#0A1A2A` | |
| Teal hover / pressed | `#0F514F` / `#0A3D3B` | |

**Type:** Atkinson Hyperlegible, Regular 400 / Bold 700 only. Body 20 px (mobile 16, changed at Leon's request so that more fits on a phone; "Text, colours & sound" enlarges it), H1 48/36, H2 36/30, H3 28/24, buttons 20, minimum 16. Sizes in rem. Line height 1.6 body, 1.25 headings; max ~65 characters per line; left-aligned; emphasis with bold only.

**Interaction:** targets at least 44 × 44 px, buttons 48–56 px high, at least 8 px between targets. Corner radius 12 px (cards 16 px), 8 px spacing grid. Every interactive element has hover, pressed and a visible 3 px navy focus ring with 2 px gap. Nothing depends on hover.

**Content and behaviour**
- Never colour alone: every state combines colour + icon + text.
- Every icon has a visible word or an accessible label.
- Plain language, short sentences, encouraging tone; mistakes are normal. Errors say what to do.
- No autoplay, no flashing, **no time limits**; respect `prefers-reduced-motion`.
- Same header on every page; the logo leads home; current page = bold + 4 px underline; breadcrumbs and a visible "Back" on every sub-page.
- Dialogs open only on user action, have a "Close" button, close with Esc, trap focus and return it afterwards.
- Banking content uses fictional data only. Practice screens must say clearly that nothing real happens.
- Mobile: no horizontal scroll down to 320 px; layout must survive 200 % text and 400 % zoom.

## Working agreements
- Keep the prototype honest: never present a simulated feature as real (e.g. label the scripted assistant as such until real AI is connected).
- Every user-facing text exists in English and German; update both `*_EN` and `*_DE` content. New or changed English text also needs an entry in `src/i18n/tr.json`, `es.json` and `hr.json` (key = the English text, sentence by sentence for long texts), or it shows in English for those languages.
- No real personal data, no real accounts, no secrets in the code. A future Gemini key must stay server-side, never in the browser bundle.
- Prefer small, reviewable changes; run `npm run lint` and `npm run build` before finishing.
- Note which AI tools were used for what. The course requires a full overview of AI tool use.

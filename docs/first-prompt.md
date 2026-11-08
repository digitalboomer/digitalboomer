# First prompt for Claude Code

Paste this into Claude Code after opening the `digital-boomer` folder.

---

Read CLAUDE.md and docs/style-guide.md first. Our deadline is 11 November: a clickable prototype where Karl's journey (CLAUDE.md, "The user journey we must support") works from start to finish.

Before you change anything, give me a short plan for the tasks below, and tell me what you would do differently if you see a problem. Then work through them one at a time, run `npm run lint` and `npm run build` after each, and give me a one-line summary of what changed.

1. **Make install work.** Fix the esbuild version conflict so a plain `npm install` works.
2. **Real routing.** Use hash-based routes (e.g. `#/topics`, `#/tutorial/whatsapp-photo/step/2`) so the browser Back button works and every page and tutorial step can be linked or opened from a QR code. Keep the existing page IDs working.
3. **Start as a guest, save progress locally.** Remove the pre-filled "Maria Schmidt" demo user. A new visitor starts as a guest with no completed lessons. Save bookmarks, completed tutorials and the current step of each tutorial in localStorage, so "Resume lesson" on My Progress continues at the exact step. Add a "Reset demo" link in the footer so we can show a fresh start in the presentation.
4. **Guided practice: "WhatsApp: Send a photo".** This is the most important task. Add a new tutorial in the WhatsApp category, in English and German, with a simulated phone screen next to the instructions:
   - 4 steps: open the family chat → tap the paperclip → choose a photo from the album → tap send.
   - The correct target is highlighted. Only the correct tap moves to the next step.
   - A wrong tap never blocks: show a calm hint ("That was the camera. The paperclip is next to the text field."), let the user try again, and offer a "Show me" button that points to the right spot.
   - Progress shown as text and bar ("Step 2 of 4"), read-aloud for each instruction, no time limit, "Back" and "Next" always visible.
   - A clear label: "Practice mode: no real messages are sent."
   - At the end: a success message (icon + text + colour), "Practice again", and the next suggested lesson.
   - Build it as a reusable component, so we can add more practice scenarios (e.g. banking transfer) later.
5. **Honest AI guide.** Keep the scripted answers in SupportModal, but remove the fake typing delay and label it "Help assistant (pre-written answers)". Real Gemini integration comes in December.
6. **Dialogs.** All dialogs close with Esc, keep keyboard focus inside while open and return it afterwards.
7. **Small fixes.** About page: course name BIS5152 Human-Centered AI Interface Design; replace "research-backed" with "user-centered".

Do not change the visual design, fonts or default language yet; those are next week's tasks. If something in the code contradicts CLAUDE.md, ask me before deciding.

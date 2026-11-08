/** Lessons for the Everyday AI topic, in English and German. */
import { IMAGES } from '../assets/images';
import { Language, Tutorial } from '../types';

export function aiLessons(lang: Language): Tutorial[] {
  const t = (en: string, de: string) => (lang === 'en' ? en : de);
  const shared = {
    categoryId: 'ki',
    categoryTitle: t('Everyday AI', 'KI im Alltag'),
    difficulty: t('Easy', 'Einfach') as Tutorial['difficulty'],
    image: IMAGES.topicAiRobot,
  };
  const where = t('First tap the field at the bottom.', 'Tippen Sie zuerst unten auf das Feld.');
  const hints = (text: string) => ({
    menu: t(`That was the menu. ${text}`, `Das war das Menü. ${text}`),
    attach: t(`That would add a file. ${text}`, `Damit fügen Sie eine Datei hinzu. ${text}`),
    microphone: t(`That was the microphone, for speaking your question. ${text}`, `Das war das Mikrofon, um die Frage zu sprechen. ${text}`),
  });

  return [
    {
      ...shared,
      id: 'ai-first-question',
      title: t('Ask an AI Chatbot Your First Question', 'Stellen Sie einem KI-Chatbot Ihre erste Frage'),
      description: t('Try how asking a chatbot works. This practice uses one pre-written answer, not real AI.', 'Probieren Sie aus, wie man einen Chatbot fragt. Diese Übung nutzt eine vorgefertigte Antwort, keine echte KI.'),
      durationMinutes: 3,
      tags: [t('AI', 'KI'), 'Chatbot', 'ChatGPT', t('Practice', 'Übung')],
      isPopular: true,
      practice: {
        screenId: 'ai',
        kind: 'ask',
        notice: t('Practice mode: this is not real AI. The answer is pre-written.', 'Übungsmodus: Das ist keine echte KI. Die Antwort ist vorgefertigt.'),
        introTitle: t('What you will practise', 'Das üben Sie hier'),
        introText: t('You will ask a question in 2 steps. You cannot break anything, and there is no time limit.', 'Sie stellen in 2 Schritten eine Frage. Sie können nichts kaputt machen, und es gibt kein Zeitlimit.'),
        successTitle: t('Well done! You asked your first question.', 'Gut gemacht! Sie haben Ihre erste Frage gestellt.'),
        successText: t('Real chatbots write a new answer each time, and they can be wrong. Check important things with a person or a trusted source.', 'Echte Chatbots schreiben jedes Mal eine neue Antwort, und sie können sich irren. Prüfen Sie Wichtiges bei einer Person oder einer verlässlichen Quelle.'),
        nextTutorialId: 'ai-good-questions',
        labels: {
          tapHere: t('Tap here', 'Hier tippen'), phoneLabel: t('Simulated phone screen', 'Simulierter Handy-Bildschirm'), phoneBadge: t('Practice, not real', 'Übung, nicht echt'),
          appTitle: t('Practice chatbot', 'Übungs-Chatbot'), menu: t('Menu', 'Menü'), attach: t('Add a file', 'Datei hinzufügen'), microphone: t('Microphone', 'Mikrofon'), send: t('Send', 'Senden'),
          field: t('Ask anything', 'Fragen Sie etwas'), greeting: t('How can I help you?', 'Wie kann ich Ihnen helfen?'),
          suggest1: t('Pasta recipe', 'Rezept für Nudeln'), suggest2: t('Tips for roses', 'Tipps für Rosen'), suggest3: t('Birthday wish', 'Geburtstagswunsch'),
          answer: t('Here is an example of a chatbot answer: it explains things in full sentences, like a helpful person would. You can ask again if something is unclear.', 'Hier ist ein Beispiel für eine Chatbot-Antwort: Sie erklärt in ganzen Sätzen, wie eine hilfsbereite Person. Sie können nachfragen, wenn etwas unklar ist.'),
          answerNote: t('Pre-written example, not real AI.', 'Vorgefertigtes Beispiel, keine echte KI.'),
          space: t('space', 'Leerzeichen'), deleteKey: t('Delete letter', 'Buchstabe löschen'), shift: t('Capital letter', 'Großbuchstabe'),
        },
      },
      steps: [
        {
          stepNumber: 1, title: t('Tap the field', 'Tippen Sie auf das Feld'), lead: t('Tap the field at the bottom that says "Ask anything".', 'Tippen Sie unten auf das Feld „Fragen Sie etwas“.'),
          paragraphs: [t('You can write to a chatbot in normal sentences, as you would to a person.', 'Sie können einem Chatbot in normalen Sätzen schreiben, wie einer Person.')],
          practice: { screen: 'chat', targetId: 'message-field', successText: t('That was right. The keyboard is open.', 'Das war richtig. Die Tastatur ist offen.'), hints: hints(where), fallbackHint: where, showMeText: t(`The frame shows where to tap. ${where}`, `Der Rahmen zeigt, wohin Sie tippen. ${where}`) },
        },
        {
          stepNumber: 2, title: t('Write and send', 'Schreiben und senden'), lead: t('Tap a suggestion above the letters, or write your own question. Then tap send.', 'Tippen Sie einen Vorschlag über den Buchstaben, oder schreiben Sie selbst. Dann tippen Sie auf Senden.'),
          paragraphs: [t('Never write passwords or bank details in a chatbot.', 'Schreiben Sie niemals Passwörter oder Bankdaten in einen Chatbot.')],
          practice: { screen: 'typing', targetId: 'send', requiresText: true, successText: t('That was right.', 'Das war richtig.'), hints: hints(t('First write something.', 'Schreiben Sie zuerst etwas.')), fallbackHint: t('First write something. Then the send button appears.', 'Schreiben Sie zuerst etwas. Dann erscheint der Senden-Knopf.'), showMeText: t('First write something on the keyboard.', 'Schreiben Sie zuerst etwas auf der Tastatur.') },
        },
      ],
    },
    {
      ...shared,
      id: 'ai-what-is-it',
      title: t('What Is AI, in Plain Words?', 'Was ist KI, einfach erklärt?'),
      description: t('What AI can do, what it cannot do, and where you already use it.', 'Was KI kann, was sie nicht kann, und wo Sie sie schon nutzen.'),
      durationMinutes: 5,
      tags: [t('AI', 'KI'), t('Basics', 'Grundlagen')],
      steps: [
        { stepNumber: 1, title: t('A program that learned from examples', 'Ein Programm, das aus Beispielen gelernt hat'), lead: t('AI looks for patterns in huge amounts of text and pictures.', 'KI sucht Muster in riesigen Mengen an Texten und Bildern.'), paragraphs: [t('It does not think or feel like a person. It works out which words or pictures are likely to fit.', 'Sie denkt und fühlt nicht wie ein Mensch. Sie berechnet, welche Wörter oder Bilder wahrscheinlich passen.')] },
        { stepNumber: 2, example: 'ai-everyday', title: t('You already use it', 'Sie nutzen sie schon'), lead: t('AI is often built into everyday things.', 'KI steckt oft in alltäglichen Dingen.'), paragraphs: [t('For example: spam filters in email, route planning, automatic captions, and the sorting of photos on your phone.', 'Zum Beispiel: Spam-Filter bei E-Mails, Routenplanung, automatische Untertitel und das Sortieren von Fotos auf dem Handy.')] },
        { stepNumber: 3, title: t('It can be wrong', 'Sie kann sich irren'), lead: t('AI can sound very sure and still be wrong.', 'KI kann sehr sicher klingen und trotzdem falsch liegen.'), paragraphs: [t('For health, money or legal questions, always ask a real expert as well.', 'Fragen Sie bei Gesundheit, Geld oder Recht immer auch eine echte Fachperson.')], tip: t('Think of AI as a helpful assistant whose work you check.', 'Betrachten Sie KI als hilfreichen Assistenten, dessen Arbeit Sie prüfen.') },
      ],
    },
    {
      ...shared,
      id: 'ai-good-questions',
      title: t('Ask Good Questions and Get Better Answers', 'Gute Fragen stellen, bessere Antworten bekommen'),
      description: t('Three simple habits that make a chatbot far more useful, for example for letters and recipes.', 'Drei einfache Gewohnheiten machen einen Chatbot viel nützlicher, zum Beispiel für Briefe und Rezepte.'),
      durationMinutes: 5,
      tags: [t('AI', 'KI'), 'Chatbot', t('Letters', 'Briefe')],
      steps: [
        { stepNumber: 1, example: 'good-question', title: t('Say exactly what you want', 'Sagen Sie genau, was Sie möchten'), lead: t('The more detail, the better the answer.', 'Je genauer, desto besser die Antwort.'), paragraphs: [t('Instead of "Write a letter", try: "Write a short, friendly letter to my landlord. The heating has been broken since Monday."', 'Statt „Schreibe einen Brief“ besser: „Schreibe einen kurzen, freundlichen Brief an meinen Vermieter. Die Heizung ist seit Montag kaputt.“')] },
        { stepNumber: 2, title: t('Ask again', 'Fragen Sie nach'), lead: t('You can continue the conversation.', 'Sie können das Gespräch fortsetzen.'), paragraphs: [t('For example: "Please make it shorter" or "Explain that more simply." The chatbot remembers what was said in this conversation.', 'Zum Beispiel: „Bitte kürzer“ oder „Erkläre das einfacher.“ Der Chatbot merkt sich, was in diesem Gespräch gesagt wurde.')] },
        { stepNumber: 3, title: t('Read it before you use it', 'Lesen Sie, bevor Sie es verwenden'), lead: t('You are responsible for what you send.', 'Sie sind für das verantwortlich, was Sie versenden.'), paragraphs: [t('Check names, dates and facts. Change what does not sound like you.', 'Prüfen Sie Namen, Daten und Fakten. Ändern Sie, was nicht nach Ihnen klingt.')] },
      ],
    },
    {
      ...shared,
      id: 'ai-voice-assistants',
      title: t('Talk to Your Phone: Voice Assistants', 'Mit dem Handy sprechen: Sprachassistenten'),
      description: t('Set a reminder or call someone just by speaking, for example with Siri or Google Assistant.', 'Erinnerungen stellen oder jemanden anrufen, einfach durch Sprechen, zum Beispiel mit Siri oder dem Google Assistant.'),
      durationMinutes: 4,
      tags: [t('AI', 'KI'), 'Siri', 'Google', t('Voice', 'Sprache')],
      steps: [
        { stepNumber: 1, title: t('Start the assistant', 'Assistenten starten'), lead: t('Say the wake word, or press and hold the side button.', 'Sagen Sie das Aktivierungswort, oder halten Sie die Seitentaste gedrückt.'), paragraphs: [t('On an iPhone you say "Hey Siri". On many Android phones you say "Hey Google". It may need to be switched on in the settings first.', 'Beim iPhone sagen Sie „Hey Siri“. Bei vielen Android-Handys sagen Sie „Hey Google“. Eventuell müssen Sie das zuerst in den Einstellungen einschalten.')] },
        { stepNumber: 2, example: 'voice', title: t('Say what you need', 'Sagen Sie, was Sie brauchen'), lead: t('Speak normally, in short sentences.', 'Sprechen Sie normal, in kurzen Sätzen.'), paragraphs: [t('For example: "Remind me to take my tablets at 8", "Call Anna" or "What will the weather be tomorrow?"', 'Zum Beispiel: „Erinnere mich um 8 Uhr an meine Tabletten“, „Rufe Anna an“ oder „Wie wird das Wetter morgen?“')] },
        { stepNumber: 3, title: t('Your privacy', 'Ihre Privatsphäre'), lead: t('You decide whether the assistant is on.', 'Sie entscheiden, ob der Assistent an ist.'), paragraphs: [t('You can switch it off in the settings. Do not say passwords or bank details out loud.', 'Sie können ihn in den Einstellungen ausschalten. Sagen Sie Passwörter oder Bankdaten nicht laut.')] },
      ],
    },
    {
      ...shared,
      id: 'ai-fakes',
      title: t('Recognise AI Fakes: Voices, Photos and Videos', 'KI-Fälschungen erkennen: Stimmen, Fotos und Videos'),
      description: t('Criminals can fake voices and pictures. Learn the simple ways to protect yourself.', 'Kriminelle können Stimmen und Bilder fälschen. Lernen Sie einfache Wege, sich zu schützen.'),
      durationMinutes: 6,
      tags: [t('AI', 'KI'), t('Safety', 'Sicherheit'), t('Scam', 'Betrug')],
      steps: [
        { stepNumber: 1, example: 'fake-call', title: t('A familiar voice can be fake', 'Eine vertraute Stimme kann falsch sein'), lead: t('AI can imitate the voice of someone you know.', 'KI kann die Stimme einer bekannten Person nachahmen.'), paragraphs: [t('A caller who sounds like your grandchild and urgently needs money may be a criminal.', 'Ein Anrufer, der wie Ihr Enkel klingt und dringend Geld braucht, kann ein Krimineller sein.')], warning: t('Hang up and call the person back on the number you know.', 'Legen Sie auf und rufen Sie die Person unter der Ihnen bekannten Nummer zurück.') },
        { stepNumber: 2, example: 'family-word', title: t('Agree on a family password', 'Vereinbaren Sie ein Familien-Passwort'), lead: t('A word only your family knows.', 'Ein Wort, das nur Ihre Familie kennt.'), paragraphs: [t('If someone calls in an emergency, ask for this word. A fake caller will not know it.', 'Wenn jemand wegen eines Notfalls anruft, fragen Sie nach diesem Wort. Ein falscher Anrufer kennt es nicht.')] },
        { stepNumber: 3, example: 'photo-phone', title: t('Pictures and videos', 'Bilder und Videos'), lead: t('Seeing is no longer proof.', 'Sehen ist kein Beweis mehr.'), paragraphs: [t('Look for odd hands, blurry edges or strange writing. Better still: check whether a trusted news source reports the same thing.', 'Achten Sie auf seltsame Hände, unscharfe Ränder oder merkwürdige Schrift. Noch besser: Prüfen Sie, ob eine verlässliche Nachrichtenquelle dasselbe berichtet.')], tip: t('A famous person promising quick money in a video is almost always a scam.', 'Ein Prominenter, der im Video schnelles Geld verspricht, ist fast immer Betrug.') },
      ],
    },
    {
      ...shared,
      id: 'ai-privacy',
      title: t('What You Should Not Tell a Chatbot', 'Was Sie einem Chatbot nicht sagen sollten'),
      description: t('Your conversations may be saved. Learn what stays private and how to use AI safely.', 'Ihre Gespräche werden möglicherweise gespeichert. Lernen Sie, was privat bleibt und wie Sie KI sicher nutzen.'),
      durationMinutes: 4,
      tags: [t('AI', 'KI'), t('Privacy', 'Datenschutz')],
      steps: [
        { stepNumber: 1, title: t('Keep these to yourself', 'Behalten Sie das für sich'), lead: t('Passwords, PINs, bank details, your ID number and health records.', 'Passwörter, PINs, Bankdaten, Ausweisnummer und Gesundheitsunterlagen.'), paragraphs: [t('What you type may be stored and, depending on the service, used to improve it.', 'Was Sie eingeben, wird möglicherweise gespeichert und je nach Dienst zur Verbesserung genutzt.')] },
        { stepNumber: 2, example: 'private-chat', title: t('Ask without personal details', 'Fragen Sie ohne persönliche Daten'), lead: t('You get a good answer without your name.', 'Sie bekommen auch ohne Ihren Namen eine gute Antwort.'), paragraphs: [t('Instead of your neighbour\'s full name and address, write "my neighbour".', 'Schreiben Sie statt des vollen Namens und der Adresse Ihres Nachbarn einfach „mein Nachbar“.')] },
        { stepNumber: 3, title: t('Use the real app', 'Nutzen Sie die echte App'), lead: t('Copycat apps exist.', 'Es gibt Nachahmer-Apps.'), paragraphs: [t('Install apps only from the official app store and check the maker\'s name. Good chatbots do not need your bank details for a free account.', 'Installieren Sie Apps nur aus dem offiziellen App-Store und prüfen Sie den Namen des Anbieters. Gute Chatbots brauchen für ein kostenloses Konto keine Bankdaten.')] },
      ],
    },
    {
      ...shared,
      id: 'ai-spot-pictures',
      title: t('Training: Spot the AI Picture', 'Training: Das KI-Bild erkennen'),
      description: t('Practise with two real AI pictures. Learn where AI usually makes mistakes.', 'Üben Sie mit zwei echten KI-Bildern. Lernen Sie, wo KI meist Fehler macht.'),
      durationMinutes: 5,
      tags: [t('AI', 'KI'), t('Pictures', 'Bilder'), t('Safety', 'Sicherheit')],
      steps: [
        { stepNumber: 1, example: 'photo-phone', title: t('Example 1: Does it make sense?', 'Beispiel 1: Ergibt das Sinn?'), lead: t('Ask yourself: could this really happen?', 'Fragen Sie sich: Könnte das wirklich so sein?'), paragraphs: [t('AI pictures often look perfect at first. The mistakes appear when you look at the details.', 'KI-Bilder wirken zuerst oft perfekt. Die Fehler zeigen sich bei den Details.')] },
        { stepNumber: 2, example: 'photo-icons', title: t('Example 2: Read the writing', 'Beispiel 2: Lesen Sie die Schrift'), lead: t('Words in AI pictures are often wrong.', 'Wörter in KI-Bildern sind oft falsch.'), paragraphs: [t('Look at signs, labels and app names. Also check for things that appear twice.', 'Schauen Sie auf Schilder, Beschriftungen und App-Namen. Prüfen Sie auch, ob etwas doppelt vorkommt.')] },
        { stepNumber: 3, example: 'fake-video', title: t('Videos can be fake too', 'Auch Videos können falsch sein'), lead: t('Watch the mouth, eyes and voice.', 'Achten Sie auf Mund, Augen und Stimme.'), paragraphs: [t('AI keeps improving, so you cannot always see a fake. If money or fear is involved, check elsewhere before you believe it.', 'KI wird immer besser, darum erkennen Sie Fälschungen nicht immer. Wenn es um Geld oder Angst geht, prüfen Sie es anderswo, bevor Sie es glauben.')], tip: t('Not sure? Search for the story on a news website you trust.', 'Nicht sicher? Suchen Sie die Meldung auf einer Nachrichtenseite, der Sie vertrauen.') },
      ],
    },
    {
      ...shared,
      id: 'ai-real-or-ai',
      title: t('Test Yourself: Real Photo or AI?', 'Testen Sie sich: Echtes Foto oder KI?'),
      description: t('12 pictures, some real and some made by AI. Can you tell them apart? Every answer is explained.', '12 Bilder, manche echt, manche von einer KI. Erkennen Sie den Unterschied? Jede Antwort wird erklärt.'),
      durationMinutes: 8,
      tags: [t('AI', 'KI'), t('Pictures', 'Bilder'), t('Test', 'Test'), t('Safety', 'Sicherheit')],
      steps: [
        { stepNumber: 1, title: t('What to look for', 'Worauf Sie achten können'), lead: t('Hands, writing, reflections and things that make no sense.', 'Hände, Schrift, Spiegelungen und Dinge, die keinen Sinn ergeben.'), paragraphs: [t('AI pictures are often too tidy and too perfect. Real photos are often a bit messy or dull. These are only clues, not proof.', 'KI-Bilder wirken oft zu ordentlich und zu perfekt. Echte Fotos sind oft etwas unordentlich oder langweilig. Das sind nur Hinweise, keine Beweise.')], tip: t('There is no time limit, and nobody sees your result.', 'Es gibt kein Zeitlimit, und niemand sieht Ihr Ergebnis.') },
        { stepNumber: 2, example: 'picture-quiz', title: t('The test', 'Der Test'), lead: t('Look closely at each picture, then choose.', 'Schauen Sie sich jedes Bild genau an, dann wählen Sie.'), paragraphs: [t('After each answer you see what gives it away.', 'Nach jeder Antwort sehen Sie, woran man es erkennt.')] },
        { stepNumber: 3, title: t('What this means for you', 'Was das für Sie bedeutet'), lead: t('You cannot always tell from the picture alone. Check the source.', 'Am Bild allein erkennen Sie es nicht immer. Prüfen Sie die Quelle.'), paragraphs: [t('Ask: who is sharing this, and why? Does a news site you trust report the same thing? Could I look up what it shows?', 'Fragen Sie: Wer teilt das, und warum? Berichtet eine Nachrichtenseite, der Sie vertrauen, dasselbe? Kann ich nachschlagen, was es zeigt?')], warning: t('If a picture or video pushes you to pay or panic, stop and ask someone you trust.', 'Wenn ein Bild oder Video Sie zum Zahlen oder zur Panik drängt, halten Sie inne und fragen Sie eine Vertrauensperson.') },
      ],
    },
    {
      ...shared,
      id: 'ai-translate',
      title: t('Translate Texts and Menus with AI', 'Texte und Speisekarten mit KI übersetzen'),
      description: t('Useful on holiday and for foreign letters: let your phone translate for you.', 'Praktisch im Urlaub und bei fremdsprachigen Briefen: Lassen Sie Ihr Handy übersetzen.'),
      durationMinutes: 4,
      tags: [t('AI', 'KI'), t('Translate', 'Übersetzen'), t('Travel', 'Reisen')],
      steps: [
        { stepNumber: 1, example: 'translate', title: t('Type or paste the text', 'Text eingeben'), lead: t('Translation apps and chatbots can do this.', 'Übersetzungs-Apps und Chatbots können das.'), paragraphs: [t('Write: "Please translate this into English:" and then the text.', 'Schreiben Sie: „Bitte übersetze das ins Deutsche:“ und dann den Text.')] },
        { stepNumber: 2, title: t('Use your camera', 'Nutzen Sie die Kamera'), lead: t('Many apps translate what the camera sees.', 'Viele Apps übersetzen, was die Kamera sieht.'), paragraphs: [t('Point your phone at a menu or sign. The translation appears on the screen.', 'Halten Sie das Handy auf eine Speisekarte oder ein Schild. Die Übersetzung erscheint auf dem Bildschirm.')] },
        { stepNumber: 3, title: t('Be careful with important things', 'Vorsicht bei Wichtigem'), lead: t('Translations can contain mistakes.', 'Übersetzungen können Fehler enthalten.'), paragraphs: [t('For contracts, medicine or official letters, ask a person who speaks the language.', 'Bei Verträgen, Medikamenten oder amtlichen Briefen fragen Sie eine Person, die die Sprache spricht.')] },
      ],
    },
    {
      ...shared,
      id: 'ai-letters',
      title: t('Understand Complicated Letters with AI', 'Komplizierte Briefe mit KI verstehen'),
      description: t('Have official language explained in plain words, without sharing personal data.', 'Lassen Sie sich Amtsdeutsch einfach erklären, ohne persönliche Daten zu teilen.'),
      durationMinutes: 4,
      tags: [t('AI', 'KI'), t('Letters', 'Briefe')],
      steps: [
        { stepNumber: 1, title: t('Remove personal details first', 'Entfernen Sie zuerst persönliche Daten'), lead: t('Leave out names, addresses and numbers.', 'Lassen Sie Namen, Adressen und Nummern weg.'), paragraphs: [t('Only copy the sentence you do not understand.', 'Kopieren Sie nur den Satz, den Sie nicht verstehen.')] },
        { stepNumber: 2, example: 'private-chat', title: t('Ask for a simple explanation', 'Bitten Sie um eine einfache Erklärung'), lead: t('Write: "Please explain this in simple words."', 'Schreiben Sie: „Bitte erkläre das in einfachen Worten.“'), paragraphs: [t('You can ask again until it is clear.', 'Sie können nachfragen, bis es klar ist.')] },
        { stepNumber: 3, title: t('Check before you act', 'Prüfen Sie, bevor Sie handeln'), lead: t('AI does not replace advice.', 'KI ersetzt keine Beratung.'), paragraphs: [t('For deadlines or payments, ask the office that wrote to you, or a consumer advice centre.', 'Bei Fristen oder Zahlungen fragen Sie die Stelle, die Ihnen geschrieben hat, oder eine Verbraucherzentrale.')] },
      ],
    },
    {
      ...shared,
      id: 'ai-health',
      title: t('AI and Health Questions: What Is Sensible', 'KI und Gesundheitsfragen: Was sinnvoll ist'),
      description: t('A chatbot can explain words, but it does not replace your doctor.', 'Ein Chatbot kann Begriffe erklären, aber er ersetzt nicht Ihre Ärztin oder Ihren Arzt.'),
      durationMinutes: 4,
      tags: [t('AI', 'KI'), t('Health', 'Gesundheit')],
      steps: [
        { stepNumber: 1, example: 'health', title: t('What it can help with', 'Wobei sie helfen kann'), lead: t('Explaining words and preparing questions.', 'Begriffe erklären und Fragen vorbereiten.'), paragraphs: [t('For example: "Which questions could I ask my doctor about high blood pressure?"', 'Zum Beispiel: „Welche Fragen könnte ich meiner Ärztin zum Thema Bluthochdruck stellen?“')] },
        { stepNumber: 2, title: t('What it cannot do', 'Was sie nicht kann'), lead: t('It cannot examine you, and it can be wrong.', 'Sie kann Sie nicht untersuchen, und sie kann sich irren.'), paragraphs: [t('Never change or stop medicine because of a chatbot.', 'Ändern oder beenden Sie Medikamente nie wegen eines Chatbots.')], warning: t('In an emergency, call 112.', 'Im Notfall rufen Sie die 112 an.') },
      ],
    },

  ];
}

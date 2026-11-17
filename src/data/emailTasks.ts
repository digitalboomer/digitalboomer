/**
 * More email lessons per service, in English and German. Each service uses its own
 * words, e.g. Star, Flag or Favourite. Checked for Gmail: unsubscribe from newsletters
 * instead of reporting them, spam is deleted after 30 days, and mail can be moved
 * back out of the bin.
 */
import { Language, Tutorial, TutorialStep } from '../types';
import type { Service } from './services';

type Pair = [string, string];
const TERMS: Record<string, { star: Pair; starred: Pair; spam: Pair; report: Pair; trash: Pair; where: Pair }> = {
  gmail: { star: ['Star', 'Markieren'], starred: ['Starred', 'Markiert'], spam: ['Spam', 'Spam'], report: ['Report spam', 'Spam melden'], trash: ['Bin', 'Papierkorb'], where: ['The star is at the top of the email.', 'Der Stern ist oben in der E-Mail.'] },
  outlook: { star: ['Flag', 'Kennzeichnen'], starred: ['Flagged', 'Gekennzeichnet'], spam: ['Junk Email', 'Junk-E-Mail'], report: ['Report junk', 'Als Junk melden'], trash: ['Deleted Items', 'Gelöschte Elemente'], where: ['The flag symbol is at the top of the email.', 'Das Fähnchen-Symbol ist oben in der E-Mail.'] },
  applemail: { star: ['Flag', 'Markieren'], starred: ['Flagged', 'Markiert'], spam: ['Junk', 'Werbung'], report: ['Move to Junk', 'In „Werbung“ bewegen'], trash: ['Trash', 'Papierkorb'], where: ['The flag symbol is at the top of the email.', 'Das Fähnchen-Symbol ist oben in der E-Mail.'] },
  gmx: { star: ['Favourite', 'Favorit'], starred: ['Favourites', 'Favoriten'], spam: ['Spam', 'Spam'], report: ['Mark as spam', 'Als Spam markieren'], trash: ['Trash', 'Papierkorb'], where: ['The star is at the top of the email.', 'Der Stern ist oben in der E-Mail.'] },
  webde: { star: ['Favourite', 'Favorit'], starred: ['Favourites', 'Favoriten'], spam: ['Spam', 'Spam'], report: ['Mark as spam', 'Als Spam markieren'], trash: ['Trash', 'Papierkorb'], where: ['The star is at the top of the email.', 'Der Stern ist oben in der E-Mail.'] },
  tonline: { star: ['Mark', 'Markieren'], starred: ['Marked', 'Markiert'], spam: ['Spam', 'Spam'], report: ['Mark as spam', 'Als Spam markieren'], trash: ['Trash', 'Papierkorb'], where: ['The star is at the top of the email.', 'Der Stern ist oben in der E-Mail.'] },
  yahoo: { star: ['Star', 'Markieren'], starred: ['Starred', 'Markiert'], spam: ['Spam', 'Spam'], report: ['Mark as spam', 'Als Spam markieren'], trash: ['Trash', 'Papierkorb'], where: ['The star is at the top of the email.', 'Der Stern ist oben in der E-Mail.'] },
  proton: { star: ['Star', 'Markieren'], starred: ['Starred', 'Markiert'], spam: ['Spam', 'Spam'], report: ['Move to spam', 'In Spam verschieben'], trash: ['Trash', 'Papierkorb'], where: ['The star is at the top of the email.', 'Der Stern ist oben in der E-Mail.'] },
};

/** Added to every email lesson, so free roam and all lessons can show the new screens. */
export function emailExtraLabels(lang: Language, provider?: Service): Record<string, string> {
  const isEn = lang === 'en';
  const t = (en: string, de: string) => (isEn ? en : de);
  const pick = (pair: Pair) => (isEn ? pair[0] : pair[1]);
  const term = TERMS[provider?.id ?? ''] ?? TERMS.gmail;
  return {
    forward: t('Forward', 'Weiterleiten'), moreOptions: t('More options', 'Weitere Optionen'),
    starWord: pick(term.star), starredFolder: pick(term.starred), spamFolder: pick(term.spam), reportSpam: pick(term.report), trashFolder: pick(term.trash),
    sentFolder: t('Sent', 'Gesendet'), draftsFolder: t('Drafts', 'Entwürfe'), inboxFolder: t('Inbox', 'Posteingang'), folders: t('Folders', 'Ordner'),
    markUnread: t('Mark as unread', 'Als ungelesen markieren'),
    toastDeleted: t('Moved to the trash', 'In den Papierkorb verschoben'), moveToInbox: t('Move to inbox', 'In den Posteingang verschieben'),
    prizeFrom: t('Prize Office', 'Gewinn-Büro'), prizeSubject: t('You have won 5,000 euros!!!', 'Sie haben 5.000 Euro gewonnen!!!'), prizePreview: t('Click now to claim...', 'Klicken Sie jetzt...'),
    prizeBody: t('Congratulations! You have won. Enter your bank details within 24 hours.', 'Herzlichen Glückwunsch! Sie haben gewonnen. Geben Sie innerhalb von 24 Stunden Ihre Bankdaten ein.'), prizeLink: t('Claim your prize now', 'Gewinn jetzt abholen'),
    bodyClub: t('Hello everyone,\n\nWe meet on Tuesday at 7 pm.\n\nThe bowling club', 'Hallo zusammen,\n\nwir treffen uns am Dienstag um 19 Uhr.\n\nDer Kegelclub'),
    bodyNews: t('Now is the time to plant bulbs for spring.\n\nYou are receiving this because you signed up on our website.', 'Jetzt ist die Zeit, Blumenzwiebeln für den Frühling zu setzen.\n\nSie erhalten dies, weil Sie sich auf unserer Website angemeldet haben.'),
    unsubscribe: t('Unsubscribe', 'Abmelden'), unsubSure: t('Stop receiving this newsletter?', 'Diesen Newsletter nicht mehr erhalten?'), unsubYes: t('Yes, unsubscribe', 'Ja, abmelden'), noKeep: t('No, keep it', 'Nein, behalten'),
    searchMail: t('Search in emails', 'In E-Mails suchen'), searchGo: t('Search', 'Suchen'), resultsWord: t('Results', 'Ergebnisse'),
    suggestSearch1: 'Anna', suggestSearch2: t('Lunch', 'Mittagessen'), suggestSearch3: t('Invoice', 'Rechnung'),
    chooseFile: t('Choose a file', 'Datei wählen'), filePhoto: t('Photo_Garden.jpg', 'Foto_Garten.jpg'), fileDoc: t('Recipe.pdf', 'Rezept.pdf'),
    fwdText: t('Forwarded email', 'Weitergeleitete E-Mail'),
    suggestF1: t('Hello Peter', 'Hallo Peter'), suggestF2: t('For your information', 'Zu Ihrer Information'), suggestF3: t('Best wishes', 'Viele Grüße'),
    doneTitle: '', doneText: '',
  };
}

export function emailTasks(lang: Language, provider: Service, base: Tutorial): Tutorial[] {
  const isEn = lang === 'en';
  const t = (en: string, de: string) => (isEn ? en : de);
  const pick = (pair: Pair) => (isEn ? pair[0] : pair[1]);
  const name = provider.name;
  const term = TERMS[provider.id] ?? TERMS.gmail;
  const baseLabels = base.practice!.labels;

  const hints = (where: string): Record<string, string> => ({
    menu: t(`That opens your folders. ${where}`, `Damit öffnen Sie Ihre Ordner. ${where}`),
    search: t(`That is the search. ${where}`, `Das ist die Suche. ${where}`),
    compose: t(`That starts a new email. ${where}`, `Damit beginnen Sie eine neue E-Mail. ${where}`),
    'mail-anna': t(`That is Anna's email. ${where}`, `Das ist Annas E-Mail. ${where}`),
    'mail-club': t(`That is the bowling club's email. ${where}`, `Das ist die E-Mail vom Kegelclub. ${where}`),
    'mail-news': t(`That is the newsletter. ${where}`, `Das ist der Newsletter. ${where}`),
    'mail-prize': t(`That is the prize email. ${where}`, `Das ist die Gewinn-E-Mail. ${where}`),
    back: t(`That goes back. ${where}`, `Damit gehen Sie zurück. ${where}`),
    reply: t(`That would answer the sender. ${where}`, `Damit würden Sie dem Absender antworten. ${where}`),
    forward: t(`That would send the email on. ${where}`, `Damit würden Sie die E-Mail weiterleiten. ${where}`),
    archive: t(`That puts the email away. ${where}`, `Damit legen Sie die E-Mail ab. ${where}`),
    delete: t(`That would delete the email. ${where}`, `Damit würden Sie die E-Mail löschen. ${where}`),
    star: t(`That marks the email as important. ${where}`, `Damit markieren Sie die E-Mail als wichtig. ${where}`),
    'mail-more': t(`That opens more options. ${where}`, `Damit öffnen Sie weitere Optionen. ${where}`),
    attach: t(`That adds a file. ${where}`, `Damit fügen Sie eine Datei hinzu. ${where}`),
    'prize-link': t(`Stop! Never tap links in such emails. They lead to fake pages. ${where}`, `Halt! Tippen Sie nie auf Links in solchen E-Mails. Sie führen auf gefälschte Seiten. ${where}`),
    'contact-anna': t(`Anna wrote the email. For this practice, choose Peter. ${where}`, `Anna hat die E-Mail geschrieben. Wählen Sie für diese Übung Peter. ${where}`),
    'contact-peter': t(`That is Peter. For this practice, please choose Anna. ${where}`, `Das ist Peter. Für diese Übung wählen Sie bitte Anna. ${where}`),
    'folder-inbox': t(`That is your inbox. ${where}`, `Das ist Ihr Posteingang. ${where}`),
    'folder-sent': t(`Those are the emails you sent. ${where}`, `Das sind Ihre gesendeten E-Mails. ${where}`),
    'folder-spam': t(`That is where unwanted email goes. ${where}`, `Dorthin kommen unerwünschte E-Mails. ${where}`),
    'folder-trash': t(`That is where deleted email goes. ${where}`, `Dorthin kommen gelöschte E-Mails. ${where}`),
    'folder-starred': t(`Those are your marked emails. ${where}`, `Das sind Ihre markierten E-Mails. ${where}`),
    'mark-unread': t(`That would mark it as new again. ${where}`, `Damit würden Sie sie wieder als neu markieren. ${where}`),
    'result-other': t(`That is a different email. ${where}`, `Das ist eine andere E-Mail. ${where}`),
    'file-doc': t(`That is a different file. ${where}`, `Das ist eine andere Datei. ${where}`),
  });

  const step = (title: string, lead: string, paragraphs: string[], screen: string, targetId: string, where: string, options: { field?: string; requiresText?: boolean } = {}): Omit<TutorialStep, 'stepNumber'> => ({
    title, lead, paragraphs,
    practice: { ...options, screen, targetId, successText: t('That was right.', 'Das war richtig.'), hints: hints(where), fallbackHint: where, showMeText: t(`The frame shows where to tap. ${where}`, `Der Rahmen zeigt, wohin Sie tippen. ${where}`) },
  });

  const lesson = (kind: string, title: string, description: string, minutes: number, intro: string, successTitle: string, successText: string, doneTitle: string, doneText: string, steps: Omit<TutorialStep, 'stepNumber'>[]): Tutorial => ({
    ...base,
    id: `${provider.id}-${kind}`,
    title: `${name}: ${title}`,
    description,
    durationMinutes: minutes,
    tags: [t('Email', 'E-Mail'), t('Practice', 'Übung'), name, title],
    practice: {
      ...base.practice!,
      kind,
      introText: `${intro} ${t('You cannot break anything, and there is no time limit.', 'Sie können nichts kaputt machen, und es gibt kein Zeitlimit.')}`,
      successTitle,
      successText,
      labels: { ...baseLabels, ...emailExtraLabels(lang, provider), doneTitle, doneText },
    },
    steps: steps.map((s, i) => ({ ...s, stepNumber: i + 1 })),
  });

  const open = (title: string, person: string, id: string, where: string, paragraph: string) => step(title, t(`Tap the email from ${person}.`, `Tippen Sie auf die E-Mail von ${person}.`), [paragraph], 'inbox', id, where);
  const openAnna = open(t('Open the email', 'E-Mail öffnen'), 'Anna', 'mail-anna', t('The email from Anna is at the top.', 'Die E-Mail von Anna steht ganz oben.'), t('Tap the line to read the whole email.', 'Tippen Sie auf die Zeile, um die ganze E-Mail zu lesen.'));
  const whereFolders = provider.id === 'outlook' ? t('Your picture at the top left opens the folders.', 'Ihr Bild oben links öffnet die Ordner.') : provider.id === 'applemail' ? t('"Mailboxes" at the top left opens the folders.', '„Postfächer“ oben links öffnet die Ordner.') : t('The three lines at the top left open the folders.', 'Die drei Striche oben links öffnen die Ordner.');
  const openFolders = step(t('Open the folders', 'Ordner öffnen'), whereFolders, [t('Your emails are sorted into folders, like in a filing cabinet.', 'Ihre E-Mails liegen in Ordnern, wie in einem Aktenschrank.')], 'inbox-after', 'menu', whereFolders);
  const star = pick(term.star);
  const starred = pick(term.starred);
  const trash = pick(term.trash);
  const report = pick(term.report);
  const noReal = t('This was only practice.', 'Das war nur eine Übung.');

  return [
    lesson('forward', t('Forward an Email', 'Eine E-Mail weiterleiten'), t("Send Anna's invitation on to Peter.", 'Leiten Sie Annas Einladung an Peter weiter.'), 4,
      t('You will forward an email in 4 steps.', 'Sie leiten in 4 Schritten eine E-Mail weiter.'),
      t('Well done! You forwarded the email.', 'Gut gemacht! Sie haben die E-Mail weitergeleitet.'),
      t(`Check first whether the sender would be happy with that, because forwarding also shares the original text. ${noReal}`, `Prüfen Sie vorher, ob das dem Absender recht wäre, denn beim Weiterleiten geht auch der Originaltext mit. ${noReal}`),
      t('Your email was forwarded to Peter', 'Ihre E-Mail wurde an Peter weitergeleitet'), '',
      [
        openAnna,
        step(t('Tap "Forward"', 'Tippen Sie auf „Weiterleiten“'), t('It is at the bottom, next to "Reply".', 'Das ist unten, neben „Antworten“.'), [t('"Reply" goes back to the sender. "Forward" goes to someone new.', '„Antworten“ geht an den Absender zurück. „Weiterleiten“ geht an jemand Neues.')], 'mail', 'forward', t('"Forward" is at the bottom right.', '„Weiterleiten“ ist unten rechts.')),
        step(t('Choose Peter', 'Wählen Sie Peter'), t('Type a few letters of "Peter", or tap "Peter" above the letters. Then tap his name in the list.', 'Tippen Sie ein paar Buchstaben von „Peter“, oder tippen Sie „Peter“ über den Buchstaben. Dann tippen Sie auf seinen Namen in der Liste.'), [t('The subject starts with "Fwd", so Peter sees that it is forwarded.', 'Der Betreff beginnt mit „Fwd“, so sieht Peter, dass sie weitergeleitet ist.')], 'forward-to', 'contact-peter', t('First type a few letters. Then tap Peter in the list.', 'Tippen Sie zuerst ein paar Buchstaben. Dann tippen Sie in der Liste auf Peter.'), { field: 'to', requiresText: true }),
        step(t('Add a note and send', 'Notiz schreiben und senden'), t('Write a short note. Then tap send at the top right.', 'Schreiben Sie eine kurze Notiz. Dann tippen Sie oben rechts auf Senden.'), [t('A short note tells Peter why you are sending this.', 'Eine kurze Notiz sagt Peter, warum Sie das senden.')], 'forward-body', 'send', t('First write something. Then tap send at the top right.', 'Schreiben Sie zuerst etwas. Dann tippen Sie oben rechts auf Senden.'), { requiresText: true }),
      ]),
    lesson('attach', t('Send a Photo by Email', 'Ein Foto per E-Mail senden'), t('Add a photo to a new email.', 'Fügen Sie einer neuen E-Mail ein Foto hinzu.'), 6,
      t('You will write an email with a photo in 6 steps.', 'Sie schreiben in 6 Schritten eine E-Mail mit Foto.'),
      t('Well done! You sent a photo.', 'Gut gemacht! Sie haben ein Foto gesendet.'),
      t(`Only open attachments from people you know and when you expect them. ${noReal}`, `Öffnen Sie Anhänge nur von Personen, die Sie kennen, und wenn Sie sie erwarten. ${noReal}`),
      t('Your email and photo were sent', 'Ihre E-Mail und das Foto wurden gesendet'), '',
      [
        step(t('Start a new email', 'Neue E-Mail beginnen'), t('Tap the pencil button.', 'Tippen Sie auf den Stift-Knopf.'), [t('You know this from writing a new email.', 'Das kennen Sie vom Schreiben einer neuen E-Mail.')], 'inbox', 'compose', t('The pencil button starts a new email.', 'Der Stift-Knopf beginnt eine neue E-Mail.')),
        step(t('Fill in "To"', '„An“ ausfüllen'), t('Type a few letters of "Anna", or tap "Anna". Then tap her name in the list.', 'Tippen Sie ein paar Buchstaben von „Anna“, oder tippen Sie „Anna“. Dann tippen Sie auf ihren Namen in der Liste.'), [t('The phone suggests people you know.', 'Das Handy schlägt Personen vor, die Sie kennen.')], 'new-to', 'contact-anna', t('First type a few letters. Then tap Anna in the list.', 'Tippen Sie zuerst ein paar Buchstaben. Dann tippen Sie in der Liste auf Anna.'), { field: 'to', requiresText: true }),
        step(t('Fill in "Subject"', '„Betreff“ ausfüllen'), t('Write a few words. Then tap the big empty text area.', 'Schreiben Sie ein paar Wörter. Dann tippen Sie auf das große leere Textfeld.'), [t('For example: "A photo of the garden".', 'Zum Beispiel: „Ein Foto vom Garten“.')], 'new-subject', 'body-field', t('First write a subject. Then tap the empty text area.', 'Schreiben Sie zuerst einen Betreff. Dann tippen Sie auf das leere Textfeld.'), { field: 'subject', requiresText: true }),
        step(t('Tap the paper clip', 'Tippen Sie auf die Büroklammer'), provider.id === 'applemail' ? t('Tap "Add a file" under the subject.', 'Tippen Sie unter dem Betreff auf „Datei hinzufügen“.') : t('The paper clip is at the top.', 'Die Büroklammer ist oben.'), [t('In email, a paper clip always means "attachment".', 'In E-Mails bedeutet eine Büroklammer immer „Anhang“.')], 'new-attach', 'attach', provider.id === 'applemail' ? t('"Add a file" is under the subject.', '„Datei hinzufügen“ ist unter dem Betreff.') : t('The paper clip is at the top, next to send.', 'Die Büroklammer ist oben, neben Senden.')),
        step(t('Choose the photo', 'Foto wählen'), t('Tap the garden photo.', 'Tippen Sie auf das Gartenfoto.'), [t('Very large files may not go through. Most services allow about 20 megabytes.', 'Sehr große Dateien kommen vielleicht nicht durch. Die meisten Dienste erlauben etwa 20 Megabyte.')], 'attach-pick', 'file-photo', t('The photo is the first line.', 'Das Foto ist die erste Zeile.')),
        step(t('Write and send', 'Schreiben und senden'), t('The photo is attached. Write a few words, then tap send.', 'Das Foto ist angehängt. Schreiben Sie ein paar Worte und tippen Sie auf Senden.'), [t('Check that you can see the file name in the email.', 'Prüfen Sie, ob der Dateiname in der E-Mail zu sehen ist.')], 'new-body-att', 'send', t('First write something. Then tap send.', 'Schreiben Sie zuerst etwas. Dann tippen Sie auf Senden.'), { requiresText: true }),
      ]),
    lesson('search', t('Find an Old Email', 'Eine alte E-Mail finden'), t('You do not need to scroll for ages. Search for it.', 'Sie müssen nicht lange blättern. Suchen Sie danach.'), 3,
      t('You will find an email in 3 steps.', 'Sie finden in 3 Schritten eine E-Mail.'),
      t('Well done! You found the email.', 'Gut gemacht! Sie haben die E-Mail gefunden.'),
      t(`You can search for a name, a word or a date. ${noReal}`, `Sie können nach einem Namen, einem Wort oder einem Datum suchen. ${noReal}`),
      t('Email found', 'E-Mail gefunden'), t('You would read it here.', 'Hier würden Sie sie lesen.'),
      [
        step(t('Open the search', 'Suche öffnen'), provider.id === 'outlook' ? t('The magnifying glass is in the bottom bar.', 'Die Lupe ist in der unteren Leiste.') : t('Look for the magnifying glass or the search field at the top.', 'Suchen Sie oben nach der Lupe oder dem Suchfeld.'), [t('The magnifying glass means "search" in almost every app.', 'Die Lupe bedeutet in fast jeder App „Suchen“.')], 'inbox', 'search', provider.id === 'outlook' ? t('The magnifying glass is in the bottom bar.', 'Die Lupe ist in der unteren Leiste.') : t('The search is at the top.', 'Die Suche ist oben.')),
        step(t('Write and search', 'Schreiben und suchen'), t('Tap "Anna" above the letters, or type a name. Then tap the magnifying glass.', 'Tippen Sie „Anna“ über den Buchstaben, oder schreiben Sie einen Namen. Dann tippen Sie auf die Lupe.'), [t('One word is usually enough.', 'Meist genügt ein Wort.')], 'search-mail', 'send', t('First write something. Then tap the magnifying glass.', 'Schreiben Sie zuerst etwas. Dann tippen Sie auf die Lupe.'), { requiresText: true }),
        step(t('Open the result', 'Ergebnis öffnen'), t('Tap the email from Anna.', 'Tippen Sie auf die E-Mail von Anna.'), [t('The results show the newest emails first.', 'Die Ergebnisse zeigen die neuesten E-Mails zuerst.')], 'search-results', 'result-anna', t('Anna is the first line.', 'Anna ist die erste Zeile.')),
      ]),
    lesson('restore', t('Get a Deleted Email Back', 'Eine gelöschte E-Mail zurückholen'), t('Deleted by mistake? It usually waits in the trash for a while.', 'Aus Versehen gelöscht? Meist wartet sie eine Weile im Papierkorb.'), 5,
      t('You will delete an email and bring it back in 6 steps.', 'Sie löschen in 6 Schritten eine E-Mail und holen sie zurück.'),
      t('Well done! The email is back.', 'Gut gemacht! Die E-Mail ist zurück.'),
      t(`Do not wait too long, because the trash is emptied automatically after a while. ${noReal}`, `Warten Sie nicht zu lange, denn der Papierkorb wird nach einiger Zeit automatisch geleert. ${noReal}`),
      t('The email is back in your inbox', 'Die E-Mail ist wieder im Posteingang'), '',
      [
        open(t('Open the email', 'E-Mail öffnen'), t('the bowling club', 'dem Kegelclub'), 'mail-club', t('The bowling club is the second line.', 'Der Kegelclub ist die zweite Zeile.'), t('Imagine you are about to delete this by mistake.', 'Stellen Sie sich vor, Sie löschen diese gleich aus Versehen.')),
        step(t('Delete it', 'Löschen'), t('Tap the bin symbol at the top.', 'Tippen Sie oben auf das Papierkorb-Symbol.'), [t('Nothing is lost yet. It goes to the trash first.', 'Noch ist nichts verloren. Sie kommt zuerst in den Papierkorb.')], 'mail', 'delete', t('The bin symbol is at the top.', 'Das Papierkorb-Symbol ist oben.')),
        openFolders,
        step(t(`Open "${trash}"`, `„${trash}“ öffnen`), t(`Tap "${trash}".`, `Tippen Sie auf „${trash}“.`), [t('Deleted emails are kept here for a while.', 'Gelöschte E-Mails bleiben hier eine Weile.')], 'folders', 'folder-trash', t(`"${trash}" is the last line.`, `„${trash}“ ist die letzte Zeile.`)),
        step(t('Open the email', 'E-Mail öffnen'), t('Tap the email from the bowling club.', 'Tippen Sie auf die E-Mail vom Kegelclub.'), [t('There it is.', 'Da ist sie.')], 'trash', 'trash-club', t('The email is the first line.', 'Die E-Mail ist die erste Zeile.')),
        step(t('Move it back', 'Zurückverschieben'), t('Tap "Move to inbox".', 'Tippen Sie auf „In den Posteingang verschieben“.'), [t('In your app this may be behind the three dots or a folder symbol.', 'In Ihrer App liegt das vielleicht hinter den drei Punkten oder einem Ordner-Symbol.')], 'trash-mail', 'move-inbox', t('The button is at the bottom.', 'Der Knopf ist unten.')),
      ]),
    lesson('spam', t('Report a Suspicious Email', 'Eine verdächtige E-Mail melden'), t('You won a prize you never entered? Report it, and do not click.', 'Sie haben etwas gewonnen, ohne mitzumachen? Melden Sie es, und klicken Sie nicht.'), 4,
      t('You will report a fake prize email in 3 steps.', 'Sie melden in 3 Schritten eine falsche Gewinn-E-Mail.'),
      t('Well done! You reported it.', 'Gut gemacht! Sie haben sie gemeldet.'),
      t(`Newsletters you once signed up for are different: unsubscribe from those instead. ${noReal}`, `Newsletter, für die Sie sich einmal angemeldet haben, sind etwas anderes: Melden Sie sich dort stattdessen ab. ${noReal}`),
      t('Email moved to spam', 'E-Mail in Spam verschoben'), t('Your email service learns from this.', 'Ihr E-Mail-Dienst lernt daraus.'),
      [
        open(t('Open the email', 'E-Mail öffnen'), t('the "Prize Office"', 'dem „Gewinn-Büro“'), 'mail-prize', t('The prize email is the last line.', 'Die Gewinn-E-Mail ist die letzte Zeile.'), t('Opening it is usually harmless. Links and attachments are the danger.', 'Das Öffnen ist meist harmlos. Gefährlich sind Links und Anhänge.')),
        step(t('Open the options', 'Optionen öffnen'), t('Tap the three dots at the top right. Do not tap the link.', 'Tippen Sie oben rechts auf die drei Punkte. Tippen Sie nicht auf den Link.'), [t('Warning signs: a big prize you never entered, a rush, and a request for bank details.', 'Warnzeichen: ein großer Gewinn ohne Teilnahme, Zeitdruck und die Frage nach Bankdaten.')], 'mail', 'mail-more', t('The three dots are at the top right.', 'Die drei Punkte sind oben rechts.')),
        step(t(`Tap "${report}"`, `Tippen Sie auf „${report}“`), t('It is in the list.', 'Das steht in der Liste.'), [t('The email moves to the spam folder, and similar ones are caught more often.', 'Die E-Mail wandert in den Spam-Ordner, und ähnliche werden öfter erkannt.')], 'mail-menu', 'report-spam', t(`"${report}" is the first line.`, `„${report}“ ist die erste Zeile.`)),
      ]),
    lesson('star', t(`Mark an Important Email`, `Eine wichtige E-Mail markieren`), t('Mark an email so you can find it again quickly.', 'Markieren Sie eine E-Mail, damit Sie sie schnell wiederfinden.'), 4,
      t('You will mark an email and find it again in 5 steps.', 'Sie markieren in 5 Schritten eine E-Mail und finden sie wieder.'),
      t('Well done! You marked the email.', 'Gut gemacht! Sie haben die E-Mail markiert.'),
      t(`${name} keeps these in "${starred}". ${noReal}`, `${name} bewahrt sie in „${starred}“ auf. ${noReal}`),
      t('You found your marked email', 'Sie haben Ihre markierte E-Mail gefunden'), '',
      [
        openAnna,
        step(t(`Tap "${star}"`, `Tippen Sie auf „${star}“`), pick(term.where), [t('Tap again to remove it. Other people cannot see this mark.', 'Ein weiteres Tippen nimmt es zurück. Andere sehen diese Markierung nicht.')], 'mail', 'star', pick(term.where)),
        step(t('Go back', 'Zurückgehen'), t('Tap the arrow at the top left.', 'Tippen Sie oben links auf den Pfeil.'), [t('The email stays in your inbox.', 'Die E-Mail bleibt in Ihrem Posteingang.')], 'mail-starred', 'back', t('The arrow is at the top left.', 'Der Pfeil ist oben links.')),
        openFolders,
        step(t(`Open "${starred}"`, `„${starred}“ öffnen`), t(`Tap "${starred}".`, `Tippen Sie auf „${starred}“.`), [t('Here you see all your marked emails together.', 'Hier sehen Sie alle markierten E-Mails zusammen.')], 'folders', 'folder-starred', t(`"${starred}" is the second line.`, `„${starred}“ ist die zweite Zeile.`)),
      ]),
    lesson('unsubscribe', t('Unsubscribe from a Newsletter', 'Einen Newsletter abbestellen'), t('Too many newsletters? Stop one properly.', 'Zu viele Newsletter? Bestellen Sie einen richtig ab.'), 3,
      t('You will stop a newsletter in 3 steps.', 'Sie bestellen in 3 Schritten einen Newsletter ab.'),
      t('Well done! You unsubscribed.', 'Gut gemacht! Sie haben sich abgemeldet.'),
      t(`Only do this for newsletters you know. For suspicious emails, use report instead, because a fake "Unsubscribe" link can be a trap. ${noReal}`, `Tun Sie das nur bei Newslettern, die Sie kennen. Bei verdächtigen E-Mails nutzen Sie „Melden“, denn ein falscher Abmelde-Link kann eine Falle sein. ${noReal}`),
      t('You have unsubscribed', 'Sie haben sich abgemeldet'), t('It can take a few days until no more arrive.', 'Es kann einige Tage dauern, bis keine mehr kommen.'),
      [
        open(t('Open the newsletter', 'Newsletter öffnen'), t('the garden newsletter', 'dem Garten-Newsletter'), 'mail-news', t('The newsletter is the third line.', 'Der Newsletter ist die dritte Zeile.'), t('Unsubscribing is better than reporting it as spam, if you once signed up yourself.', 'Abmelden ist besser als Spam melden, wenn Sie sich selbst einmal angemeldet haben.')),
        step(t('Tap "Unsubscribe"', 'Tippen Sie auf „Abmelden“'), t('It is at the top of the email, near the sender.', 'Das steht oben in der E-Mail, beim Absender.'), [t('Often it is also at the very end of the newsletter, in small print.', 'Oft steht es auch ganz am Ende des Newsletters, im Kleingedruckten.')], 'mail', 'unsubscribe', t('"Unsubscribe" is near the sender.', '„Abmelden“ steht beim Absender.')),
        step(t('Confirm', 'Bestätigen'), t('Tap "Yes, unsubscribe".', 'Tippen Sie auf „Ja, abmelden“.'), [t('You never need a password or bank details for this.', 'Dafür brauchen Sie nie ein Passwort oder Bankdaten.')], 'unsub-confirm', 'unsub-yes', t('The coloured button confirms it.', 'Der farbige Knopf bestätigt es.')),
      ]),
    lesson('archive', t('Archive Instead of Delete', 'Archivieren statt löschen'), t('Tidy your inbox without losing anything.', 'Räumen Sie Ihren Posteingang auf, ohne etwas zu verlieren.'), 2,
      t('You will archive an email in 2 steps.', 'Sie archivieren in 2 Schritten eine E-Mail.'),
      t('Well done! You archived the email.', 'Gut gemacht! Sie haben die E-Mail archiviert.'),
      t(`The email is out of the way, but you can still find it with the search. Deleted email disappears after a while. ${noReal}`, `Die E-Mail ist aus dem Weg, aber Sie finden sie weiter über die Suche. Gelöschte E-Mails verschwinden nach einer Weile. ${noReal}`),
      t('Email archived', 'E-Mail archiviert'), t('It has left the inbox, but it still exists.', 'Sie ist aus dem Posteingang, aber weiter vorhanden.'),
      [
        openAnna,
        step(t('Tap the archive symbol', 'Tippen Sie auf das Archiv-Symbol'), t('It looks like a box, at the top, next to the bin.', 'Es sieht aus wie eine Kiste, oben, neben dem Papierkorb.'), [t('Good for emails you are finished with but may need later, like invoices.', 'Gut für E-Mails, mit denen Sie fertig sind, die Sie aber später vielleicht brauchen, wie Rechnungen.')], 'mail', 'archive', t('The box is at the top, next to the bin.', 'Die Kiste ist oben, neben dem Papierkorb.')),
      ]),
  ];
}

/** Text lessons that apply to every email service. */
export function generalEmailLessons(lang: Language, base: Tutorial): Tutorial[] {
  const isEn = lang === 'en';
  const t = (en: string, de: string) => (isEn ? en : de);
  const shared = { categoryId: base.categoryId, categoryTitle: base.categoryTitle, difficulty: base.difficulty, image: base.image };
  return [
    {
      ...shared,
      id: 'email-account',
      title: t('Your Email Account: Address, Password and Recovery', 'Ihr E-Mail-Konto: Adresse, Passwort und Wiederherstellung'),
      description: t('How an email address is built, why your email password matters most, and how to get back in if you forget it.', 'Wie eine E-Mail-Adresse aufgebaut ist, warum Ihr E-Mail-Passwort das wichtigste ist, und wie Sie wieder hineinkommen, wenn Sie es vergessen.'),
      durationMinutes: 6,
      tags: [t('Email', 'E-Mail'), t('Basics', 'Grundlagen'), t('Safety', 'Sicherheit')],
      steps: [
        { stepNumber: 1, title: t('How an email address is built', 'Wie eine E-Mail-Adresse aufgebaut ist'), lead: t('Name, the @ sign, and the service.', 'Name, das @-Zeichen und der Dienst.'), paragraphs: [t('Example: maria.schmidt@example.de. Before the @ is the name you chose. After the @ is the email service, for example gmx.de or gmail.com.', 'Beispiel: maria.schmidt@example.de. Vor dem @ steht der Name, den Sie gewählt haben. Nach dem @ steht der E-Mail-Dienst, zum Beispiel gmx.de oder gmail.com.'), t('Every letter and dot counts. If one is missing, the email does not arrive.', 'Jeder Buchstabe und jeder Punkt zählt. Fehlt einer, kommt die E-Mail nicht an.'), t('On a phone keyboard, you find the @ sign on the keyboard for email fields, or by tapping "123".', 'Auf der Handy-Tastatur finden Sie das @-Zeichen auf der Tastatur für E-Mail-Felder, oder über „123“.')], tip: t('A simple address with your first and last name is easy to give out on the phone.', 'Eine einfache Adresse mit Vor- und Nachname lässt sich am Telefon leicht weitergeben.') },
        { stepNumber: 2, title: t('Your most important password', 'Ihr wichtigstes Passwort'), lead: t('Your email is the key to your other accounts.', 'Ihre E-Mail ist der Schlüssel zu Ihren anderen Konten.'), paragraphs: [t('When you forget a password for a shop or another service, the reset link comes by email. Whoever controls your email can reset many other passwords.', 'Vergessen Sie ein Passwort für einen Shop oder einen anderen Dienst, kommt der Link zum Zurücksetzen per E-Mail. Wer Ihre E-Mail kontrolliert, kann viele andere Passwörter zurücksetzen.'), t('So use a long password for your email that you use nowhere else, and switch on two-step login.', 'Nehmen Sie für Ihre E-Mail also ein langes Passwort, das Sie nirgendwo sonst nutzen, und schalten Sie die Anmeldung in zwei Schritten ein.')], warning: t('Your email service never asks for your password in an email.', 'Ihr E-Mail-Dienst fragt nie per E-Mail nach Ihrem Passwort.') },
        { stepNumber: 3, title: t('Prepare for a forgotten password', 'Für ein vergessenes Passwort vorsorgen'), lead: t('Add a phone number or a second email address now.', 'Hinterlegen Sie jetzt eine Telefonnummer oder eine zweite E-Mail-Adresse.'), paragraphs: [t('In the account settings, look for "Recovery", "Security" or "Contact details". There you can add your mobile number.', 'Suchen Sie in den Kontoeinstellungen „Wiederherstellung“, „Sicherheit“ oder „Kontaktdaten“. Dort können Sie Ihre Handynummer hinterlegen.'), t('If you forget the password, tap "Forgot password?" on the login page. The service then sends a code to that number.', 'Vergessen Sie das Passwort, tippen Sie auf der Anmeldeseite auf „Passwort vergessen?“. Der Dienst schickt dann einen Code an diese Nummer.')], tip: t('Write down your email address and where you keep the password, and keep the note at home in a safe place.', 'Schreiben Sie Ihre E-Mail-Adresse auf und wo Sie das Passwort aufbewahren, und legen Sie den Zettel zu Hause an einen sicheren Ort.') },
        { stepNumber: 4, title: t('Free email services and adverts', 'Kostenlose E-Mail-Dienste und Werbung'), lead: t('Free services are paid for with adverts.', 'Kostenlose Dienste werden mit Werbung bezahlt.'), paragraphs: [t('Gmail, GMX, WEB.DE and others are free. In return they show adverts, sometimes between your emails.', 'Gmail, GMX, WEB.DE und andere sind kostenlos. Dafür zeigen sie Werbung, manchmal zwischen Ihren E-Mails.'), t('Adverts are often marked with a small "Ad" or "Anzeige". They are not real emails and you do not have to answer them.', 'Werbung ist oft mit einem kleinen „Anzeige“ oder „Ad“ gekennzeichnet. Sie ist keine echte E-Mail, und Sie müssen nicht darauf antworten.')], tip: t('You do not need to buy a paid plan for everyday email.', 'Für alltägliche E-Mails müssen Sie kein Bezahl-Paket kaufen.') },
      ],
    },
    {
      ...shared,
      id: 'email-cc-bcc',
      title: t('To, Cc and Bcc: What Is the Difference?', 'An, Cc und Bcc: Was ist der Unterschied?'),
      description: t('Write to several people, without sharing everyone\'s address.', 'Schreiben Sie mehreren Personen, ohne alle Adressen preiszugeben.'),
      durationMinutes: 4,
      tags: [t('Email', 'E-Mail')],
      steps: [
        { stepNumber: 1, title: t('To and Cc', 'An und Cc'), lead: t('"To" is for whoever should act. "Cc" is for information.', '„An“ ist für alle, die handeln sollen. „Cc“ ist zur Information.'), paragraphs: [t('Cc means "carbon copy". Everyone can see who else received the email.', 'Cc heißt „Kopie“. Alle sehen, wer die E-Mail noch bekommen hat.'), t('Example: you write to the landlord about a broken heater and put your son in Cc, so that he knows about it too.', 'Beispiel: Sie schreiben dem Vermieter wegen einer kaputten Heizung und setzen Ihren Sohn in Cc, damit er auch Bescheid weiß.'), t('To add several people, separate their addresses with a comma, or add them one after the other.', 'Mehrere Personen fügen Sie hinzu, indem Sie die Adressen mit Komma trennen oder nacheinander eintragen.')] },
        { stepNumber: 2, title: t('Bcc', 'Bcc'), lead: t('Bcc hides the addresses from the others.', 'Bcc verbirgt die Adressen vor den anderen.'), paragraphs: [t('Use it when writing to many people who do not know each other, for example an invitation from your club.', 'Nutzen Sie es, wenn Sie vielen Menschen schreiben, die sich nicht kennen, zum Beispiel bei einer Einladung vom Verein.'), t('Everyone receives the email, but nobody sees the other addresses. That protects their privacy and prevents long chains of "Reply all".', 'Alle bekommen die E-Mail, aber niemand sieht die anderen Adressen. Das schützt die Privatsphäre und verhindert lange Ketten mit „Allen antworten“.')], tip: t('In many phone apps, you first tap the "Cc" line or a small arrow to see Bcc.', 'In vielen Handy-Apps tippen Sie zuerst auf die Zeile „Cc“ oder einen kleinen Pfeil, um Bcc zu sehen.') },
        { stepNumber: 3, title: t('"Reply all"', '„Allen antworten“'), lead: t('Think before you use it.', 'Überlegen Sie vorher.'), paragraphs: [t('"Reply" goes only to the sender. "Reply all" goes to everyone. A private answer belongs in "Reply".', '„Antworten“ geht nur an den Absender. „Allen antworten“ geht an alle. Eine private Antwort gehört in „Antworten“.'), t('Use "Reply all" when everyone needs the answer, for example to agree on a date for a family party.', 'Nutzen Sie „Allen antworten“, wenn alle die Antwort brauchen, zum Beispiel um einen Termin für ein Familienfest abzustimmen.')] },
      ],
    },
    {
      ...shared,
      id: 'email-away-message',
      title: t('Away on Holiday: The Automatic Reply', 'Im Urlaub: Die automatische Antwort'),
      description: t('Your email can answer for you while you are away. Think about what it says.', 'Ihre E-Mail kann für Sie antworten, während Sie weg sind. Überlegen Sie, was sie sagt.'),
      durationMinutes: 4,
      tags: [t('Email', 'E-Mail'), t('Settings', 'Einstellungen')],
      steps: [
        { stepNumber: 1, title: t('What it does', 'Was sie tut'), lead: t('It answers every email automatically, for as long as you choose.', 'Sie beantwortet jede E-Mail automatisch, so lange Sie möchten.'), paragraphs: [t('Useful when you are in hospital, on holiday or simply offline for a while. People then know that an answer will take longer.', 'Nützlich, wenn Sie im Krankenhaus, im Urlaub oder einfach eine Weile offline sind. Dann wissen die anderen, dass eine Antwort länger dauert.'), t('You do not need it for short absences. Nobody expects an answer within the hour.', 'Für kurze Abwesenheiten brauchen Sie sie nicht. Niemand erwartet eine Antwort innerhalb einer Stunde.')] },
        { stepNumber: 2, title: t('Where to find it', 'Wo Sie es finden'), lead: t('It is in the settings.', 'Das steht in den Einstellungen.'), paragraphs: [t('Look for "Vacation responder", "Automatic replies" or "Abwesenheitsnotiz". Some services only offer this on their website.', 'Suchen Sie nach „Abwesenheitsnotiz“, „Automatische Antworten“ oder „Urlaubsantwort“. Manche Dienste bieten das nur auf ihrer Website an.'), t('Set a start and an end date. Then you cannot forget to switch it off.', 'Stellen Sie ein Start- und ein Enddatum ein. Dann können Sie nicht vergessen, sie auszuschalten.')] },
        { stepNumber: 3, title: t('What to write', 'Was Sie schreiben'), lead: t('Keep it short and general.', 'Halten Sie es kurz und allgemein.'), paragraphs: [t('"Thank you for your email. I will answer as soon as I can."', '„Danke für Ihre E-Mail. Ich antworte, sobald ich kann.“'), t('If something is urgent, you can name someone else to contact, for example a colleague from the club.', 'Wenn etwas dringend ist, können Sie eine andere Ansprechperson nennen, zum Beispiel jemanden aus dem Verein.')], warning: t('Do not write that your home is empty or for how long. The reply can reach strangers.', 'Schreiben Sie nicht, dass Ihr Zuhause leer ist oder wie lange. Die Antwort kann auch Fremde erreichen.') },
      ],
    },
    {
      ...shared,
      id: 'email-write-well',
      title: t('Write a Clear Email', 'Eine klare E-Mail schreiben'),
      description: t('Subject, greeting, message, goodbye. Simple building blocks.', 'Betreff, Anrede, Nachricht, Gruß. Einfache Bausteine.'),
      durationMinutes: 4,
      tags: [t('Email', 'E-Mail')],
      steps: [
        { stepNumber: 1, title: t('A clear subject', 'Ein klarer Betreff'), lead: t('It says what it is about, in a few words.', 'Er sagt in wenigen Worten, worum es geht.'), paragraphs: [t('"Question about invoice 2041" is better than "Hello".', '„Frage zu Rechnung 2041“ ist besser als „Hallo“.'), t('The subject is the first thing the other person sees in their inbox. A clear subject helps them find your email again later.', 'Der Betreff ist das Erste, was die andere Person in ihrem Posteingang sieht. Ein klarer Betreff hilft ihr, Ihre E-Mail später wiederzufinden.')] },
        { stepNumber: 2, title: t('Greeting and message', 'Anrede und Nachricht'), lead: t('Say first what you want.', 'Sagen Sie zuerst, was Sie möchten.'), paragraphs: [t('Short sentences are easy to read. Write as politely as you would in a letter.', 'Kurze Sätze sind leicht zu lesen. Schreiben Sie so höflich wie in einem Brief.'), t('For offices and companies, "Dear Sir or Madam" or "Dear Mr Weber" is right. For family, "Hello Anna" is fine.', 'Für Ämter und Firmen passt „Sehr geehrte Damen und Herren“ oder „Sehr geehrter Herr Weber“. Für die Familie ist „Hallo Anna“ in Ordnung.'), t('Mention numbers that help: your customer number, the date of a letter, or an invoice number. Never your password or PIN.', 'Nennen Sie Nummern, die helfen: Ihre Kundennummer, das Datum eines Briefs oder eine Rechnungsnummer. Nie Ihr Passwort oder Ihre PIN.')] },
        { stepNumber: 3, title: t('Check before sending', 'Vor dem Senden prüfen'), lead: t('Is the address right? Is the attachment there?', 'Stimmt die Adresse? Ist der Anhang dabei?'), paragraphs: [t('Once sent, an email can rarely be taken back.', 'Einmal gesendet, lässt sich eine E-Mail kaum zurückholen.'), t('End with a greeting and your name, for example "Kind regards, Maria Schmidt".', 'Schließen Sie mit einem Gruß und Ihrem Namen, zum Beispiel „Mit freundlichen Grüßen, Maria Schmidt“.')], tip: t('Fill in the recipient last, so nothing goes out by accident.', 'Füllen Sie den Empfänger zuletzt aus, dann geht nichts aus Versehen raus.') },
      ],
    },
  ];
}

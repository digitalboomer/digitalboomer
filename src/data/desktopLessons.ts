/**
 * One lesson per service on a computer: in the browser or the installed program.
 * Linking: checked for WhatsApp, Signal and Telegram (scan a code from the
 * computer with the phone, under "Linked devices" or "Devices"). Signal has no
 * website, only a program. Banking always uses a neutral practice bank.
 */
import { Language, Tutorial, TutorialStep } from '../types';
import type { Service } from './services';

type Pair = [string, string];
export const MESSAGING_DESKTOP: Record<string, { window: string; url?: string; mode: 'qr' | 'login'; how: Pair }> = {
  whatsapp: { window: 'WhatsApp', url: 'web.whatsapp.com', mode: 'qr', how: ['1. Open WhatsApp on your phone.\n2. Open "Linked devices" (in the settings, or the menu with three dots).\n3. Tap "Link a device" and point the phone at the code.', '1. Öffnen Sie WhatsApp auf dem Handy.\n2. Öffnen Sie „Verknüpfte Geräte“ (in den Einstellungen oder im Menü mit drei Punkten).\n3. Tippen Sie auf „Gerät hinzufügen“ und halten Sie das Handy auf den Code.'] },
  signal: { window: 'Signal Desktop', mode: 'qr', how: ['1. Open Signal on your phone.\n2. Go to Settings, then "Linked devices".\n3. Tap the plus sign and point the phone at the code.', '1. Öffnen Sie Signal auf dem Handy.\n2. Gehen Sie zu Einstellungen, dann „Gekoppelte Geräte“.\n3. Tippen Sie auf das Plus und halten Sie das Handy auf den Code.'] },
  telegram: { window: 'Telegram Desktop', mode: 'qr', how: ['1. Open Telegram on your phone.\n2. Go to Settings, then "Devices".\n3. Tap "Link Desktop Device" and point the phone at the code.', '1. Öffnen Sie Telegram auf dem Handy.\n2. Gehen Sie zu Einstellungen, dann „Geräte“.\n3. Tippen Sie auf „Desktop-Gerät verbinden“ und halten Sie das Handy auf den Code.'] },
  messenger: { window: 'Facebook', url: 'facebook.com/messages', mode: 'login', how: ['Messenger on the computer runs in the browser, at facebook.com/messages. Sign in there with your Facebook account.', 'Messenger am Computer läuft im Browser, unter facebook.com/messages. Melden Sie sich dort mit Ihrem Facebook-Konto an.'] },
  imessage: { window: 'Messages', mode: 'login', how: ['On a Mac, open the "Messages" app and sign in with the same Apple Account as on your iPhone. On Windows there is no iMessage app.', 'Öffnen Sie am Mac die App „Nachrichten“ und melden Sie sich mit demselben Apple Account wie am iPhone an. Für Windows gibt es keine iMessage-App.'] },
  sms: { window: 'Google Messages', url: 'messages.google.com/web', mode: 'qr', how: ['For Android phones: open messages.google.com/web on the computer. In the Messages app on your phone, open the menu and choose device pairing, then scan the code. With an iPhone, use the Messages app on a Mac instead.', 'Für Android-Handys: Öffnen Sie am Computer messages.google.com/web. Öffnen Sie in der Nachrichten-App am Handy das Menü und wählen Sie die Geräte-Kopplung, dann scannen Sie den Code. Mit einem iPhone nutzen Sie stattdessen die Nachrichten-App am Mac.'] },
  threema: { window: 'Threema Desktop', mode: 'qr', how: ['Install Threema Desktop. It shows a code. In Threema on your phone, open the settings for linked devices and scan the code. Follow the steps in the app, as they can change.', 'Installieren Sie Threema Desktop. Es zeigt einen Code. Öffnen Sie in Threema am Handy die Einstellungen für verknüpfte Geräte und scannen Sie den Code. Folgen Sie den Schritten in der App, da sie sich ändern können.'] },
  viber: { window: 'Viber', mode: 'qr', how: ['Install Viber for the computer. It shows a code. Scan it with Viber on your phone. The app shows you where the scanner is.', 'Installieren Sie Viber für den Computer. Es zeigt einen Code. Scannen Sie ihn mit Viber am Handy. Die App zeigt Ihnen, wo der Scanner ist.'] },
  line: { window: 'LINE', mode: 'qr', how: ['Install LINE for the computer. Log in by scanning the code with LINE on your phone, or with your email address.', 'Installieren Sie LINE für den Computer. Melden Sie sich an, indem Sie den Code mit LINE am Handy scannen, oder mit Ihrer E-Mail-Adresse.'] },
  wechat: { window: 'WeChat', mode: 'qr', how: ['Install WeChat for the computer. Scan the code with WeChat on your phone, then confirm on the phone.', 'Installieren Sie WeChat für den Computer. Scannen Sie den Code mit WeChat am Handy, dann bestätigen Sie am Handy.'] },
  discord: { window: 'Discord', url: 'discord.com/app', mode: 'login', how: ['Open discord.com in the browser, or install the program. Sign in with your account, or scan the code with Discord on your phone.', 'Öffnen Sie discord.com im Browser, oder installieren Sie das Programm. Melden Sie sich mit Ihrem Konto an, oder scannen Sie den Code mit Discord am Handy.'] },
  teams: { window: 'Microsoft Teams', mode: 'login', how: ['Install Teams, or open it in the browser. Sign in with your Microsoft account.', 'Installieren Sie Teams, oder öffnen Sie es im Browser. Melden Sie sich mit Ihrem Microsoft-Konto an.'] },
};

export const EMAIL_URL: Record<string, string | undefined> = {
  gmail: 'mail.google.com', outlook: 'outlook.live.com', applemail: undefined, gmx: 'www.gmx.net', webde: 'web.de', tonline: 'email.t-online.de', yahoo: 'mail.yahoo.com', proton: 'mail.proton.me',
};
export const SOCIAL_URL: Record<string, string> = {
  facebook: 'www.facebook.com', instagram: 'www.instagram.com', youtube: 'www.youtube.com', tiktok: 'www.tiktok.com', x: 'x.com', linkedin: 'www.linkedin.com', pinterest: 'www.pinterest.com', threads: 'www.threads.com', reddit: 'www.reddit.com',
};

export function desktopLesson(lang: Language, service: Service, base: Tutorial): Tutorial {
  const isEn = lang === 'en';
  const t = (en: string, de: string) => (isEn ? en : de);
  const pick = (pair: Pair) => (isEn ? pair[0] : pair[1]);
  const name = service.name;
  const step = (title: string, lead: string, paragraphs: string[], screen: string, targetId: string, where: string, options: { field?: string; requiresText?: boolean } = {}): Omit<TutorialStep, 'stepNumber'> => ({
    title, lead, paragraphs,
    practice: { ...options, screen, targetId, successText: t('That was right.', 'Das war richtig.'), hints: {}, fallbackHint: where, showMeText: t(`The frame shows where to click. ${where}`, `Der Rahmen zeigt, wohin Sie klicken. ${where}`) },
  });
  const lockLabels = { lockLabel: t('Information about this website', 'Informationen zu dieser Website'), lockSecure: t('The connection is secure', 'Die Verbindung ist sicher') };
  const typingNote = t('Type with your computer keyboard, or click one of the suggested words under the field.', 'Tippen Sie mit der Computertastatur, oder klicken Sie auf eines der vorgeschlagenen Wörter unter dem Feld.');
  const lockStep = (url: string) => step(
    t('Check the address', 'Adresse prüfen'),
    t('Click the small lock at the left of the address bar.', 'Klicken Sie auf das kleine Schloss links in der Adressleiste.'),
    [t(`The address must be exactly ${url}. Criminals build copies with similar addresses, so type it yourself or use a saved bookmark.`, `Die Adresse muss genau ${url} lauten. Kriminelle bauen Kopien mit ähnlichen Adressen, darum tippen Sie sie selbst ein oder nutzen ein gespeichertes Lesezeichen.`), t('The lock means the connection is encrypted. It does not prove that the site is genuine, so the address matters most.', 'Das Schloss bedeutet, dass die Verbindung verschlüsselt ist. Es beweist nicht, dass die Seite echt ist, darum zählt vor allem die Adresse.')],
    url.includes('uebungsbank') ? 'web-bank' : 'web-inbox', 'address-lock', t('The lock is at the very left of the address bar, at the top.', 'Das Schloss ist ganz links in der Adressleiste, oben.'));

  let labels: Record<string, string> = { ...base.practice!.labels, ...lockLabels };
  let steps: Omit<TutorialStep, 'stepNumber'>[] = [];
  let screenId = '';
  let intro = '';
  let successText = '';
  let description = '';

  if (service.group === 'messaging') {
    const m = MESSAGING_DESKTOP[service.id];
    screenId = 'desktop-messenger';
    labels = {
      ...labels, deskWindow: m.window, ...(m.url ? { deskUrl: m.url } : {}), linkMode: m.mode, linkHow: pick(m.how),
      linkTitle: m.mode === 'qr' ? t(`Use ${name} on your computer`, `${name} am Computer nutzen`) : t(`Sign in to ${name}`, `Bei ${name} anmelden`),
      linkButton: m.mode === 'qr' ? t('Practice: I have scanned the code', 'Übung: Ich habe den Code gescannt') : t('Practice: I am signed in', 'Übung: Ich bin angemeldet'),
      signInTitle: t('Your account', 'Ihr Konto'), selectChat: t('Click a chat on the left to read and write.', 'Klicken Sie links auf einen Chat, um zu lesen und zu schreiben.'),
    };
    description = t(`Write messages on the big screen. Your chats stay the same as on your phone.`, `Schreiben Sie Nachrichten am großen Bildschirm. Ihre Chats bleiben dieselben wie am Handy.`);
    intro = t('You will connect the computer and write to Anna in 4 steps.', 'Sie verbinden den Computer und schreiben Anna in 4 Schritten.');
    successText = t(`On a computer you share with others, sign out or unlink it afterwards, in the app's settings. ${m.url ? 'In the browser you can also simply close the tab.' : ''}`, `An einem Computer, den auch andere nutzen, melden Sie sich danach ab oder heben die Verknüpfung auf, in den Einstellungen der App. ${m.url ? 'Im Browser können Sie auch einfach den Tab schließen.' : ''}`);
    steps = [
      step(m.mode === 'qr' ? t('Connect your phone', 'Handy verbinden') : t('Sign in', 'Anmelden'), m.mode === 'qr' ? t('Read how it works. Then click the green button.', 'Lesen Sie, wie es geht. Dann klicken Sie auf den farbigen Knopf.') : t('Read how it works. Then click the button.', 'Lesen Sie, wie es geht. Dann klicken Sie auf den Knopf.'),
        [m.mode === 'qr' ? t('In real life you scan this code with your phone once. Here you only click the button. Never scan codes that strangers send you.', 'Im echten Leben scannen Sie diesen Code einmal mit dem Handy. Hier klicken Sie nur auf den Knopf. Scannen Sie nie Codes, die Ihnen Fremde schicken.') : t('Here you do not enter anything. Never type your password on a practice site.', 'Hier geben Sie nichts ein. Tippen Sie Ihr Passwort nie auf einer Übungsseite ein.')],
        'desk-link', 'scanned', t('The button is under the instructions.', 'Der Knopf ist unter der Anleitung.')),
      step(t('Open the chat with Anna', 'Chat mit Anna öffnen'), t('Click "Anna" in the list on the left.', 'Klicken Sie links in der Liste auf „Anna“.'), [t('Your chats are on the left, the open chat on the right.', 'Links stehen Ihre Chats, rechts der geöffnete Chat.')], 'desk-list', 'chat-anna', t('Anna is the second line on the left.', 'Anna ist links die zweite Zeile.')),
      step(t('Click the text field', 'Ins Textfeld klicken'), t('Click the field at the bottom right.', 'Klicken Sie auf das Feld unten rechts.'), [t('The blinking line shows where your text will appear.', 'Der blinkende Strich zeigt, wo Ihr Text erscheint.')], 'desk-chat', 'message-field', t('The text field is at the bottom of the chat.', 'Das Textfeld ist unten im Chat.')),
      step(t('Write and send', 'Schreiben und senden'), typingNote, [t('On a real computer, the Enter key also sends the message.', 'Am echten Computer sendet auch die Eingabetaste die Nachricht.')], 'desk-typing', 'send', t('First write something. Then the send button appears on the right.', 'Schreiben Sie zuerst etwas. Dann erscheint rechts der Senden-Knopf.'), { requiresText: true }),
    ];
  } else if (service.group === 'email') {
    const url = EMAIL_URL[service.id];
    screenId = 'desktop-email';
    labels = { ...labels, deskWindow: url ? name : 'Mail', ...(url ? { deskUrl: url } : {}), brandColor: service.color, brandText: service.fg };
    description = t('Write an email on the computer, with a big screen and a real keyboard.', 'Schreiben Sie eine E-Mail am Computer, mit großem Bildschirm und echter Tastatur.');
    intro = url ? t(`You will check the address and write an email in ${name} in the browser, in 5 steps.`, `Sie prüfen die Adresse und schreiben in ${name} im Browser eine E-Mail, in 5 Schritten.`) : t('You will write an email in the Mail app on a Mac, in 4 steps.', 'Sie schreiben in der Mail-App am Mac eine E-Mail, in 4 Schritten.');
    successText = t('On a shared computer, always sign out afterwards: click your picture or name at the top right, then "Sign out".', 'An einem gemeinsam genutzten Computer melden Sie sich danach immer ab: Klicken Sie oben rechts auf Ihr Bild oder Ihren Namen, dann auf „Abmelden“.');
    const composeStep = step(t('Start a new email', 'Neue E-Mail beginnen'), t(`Click "${labels.compose}" at the top left.`, `Klicken Sie oben links auf „${labels.compose}“.`), [t('A window for writing opens. The inbox stays visible behind it.', 'Ein Fenster zum Schreiben öffnet sich. Der Posteingang bleibt dahinter sichtbar.')], url ? 'web-checked' : 'web-inbox', 'compose', t('The button is at the top left.', 'Der Knopf ist oben links.'));
    steps = [
      ...(url ? [lockStep(url)] : []),
      composeStep,
      step(t('Fill in "To"', '„An“ ausfüllen'), t('Type "Anna", or click "Anna" under the window. Then click her name in the list.', 'Tippen Sie „Anna“, oder klicken Sie unter dem Fenster auf „Anna“. Dann klicken Sie auf ihren Namen in der Liste.'), [t('The computer suggests people you have written to.', 'Der Computer schlägt Personen vor, denen Sie schon geschrieben haben.')], 'web-to', 'contact-anna', t('First type a few letters. Then click Anna in the list.', 'Tippen Sie zuerst ein paar Buchstaben. Dann klicken Sie in der Liste auf Anna.'), { field: 'to', requiresText: true }),
      step(t('Fill in "Subject"', '„Betreff“ ausfüllen'), t('Write a few words. Then click the big empty area below.', 'Schreiben Sie ein paar Wörter. Dann klicken Sie auf die große leere Fläche darunter.'), [typingNote], 'web-subject', 'body-field', t('First write a subject. Then click the empty area below it.', 'Schreiben Sie zuerst einen Betreff. Dann klicken Sie auf die leere Fläche darunter.'), { field: 'subject', requiresText: true }),
      step(t('Write and send', 'Schreiben und senden'), t('Write your message. Then click "Send".', 'Schreiben Sie Ihre Nachricht. Dann klicken Sie auf „Senden“.'), [typingNote], 'web-body', 'send', t('First write something. Then click "Send".', 'Schreiben Sie zuerst etwas. Dann klicken Sie auf „Senden“.'), { requiresText: true }),
    ];
  } else if (service.group === 'social') {
    const url = SOCIAL_URL[service.id];
    screenId = 'desktop-social';
    labels = {
      ...labels, deskWindow: name, deskUrl: url, brandColor: service.color === '#000000' ? '#1D9BF0' : service.color,
      navHome: t('Home', 'Startseite'), navFriends: t('Friends', 'Freunde'), navAlerts: t('Notifications', 'Benachrichtigungen'),
      likeIcon: ['facebook', 'linkedin', 'youtube'].includes(service.id) ? 'thumb' : 'heart', doneDesk: t('Your comment was posted', 'Ihr Kommentar wurde veröffentlicht'),
    };
    description = t(`Use ${name} in the browser, with more space for pictures and text.`, `Nutzen Sie ${name} im Browser, mit mehr Platz für Bilder und Text.`);
    intro = t('You will react to a post in 3 steps.', 'Sie reagieren in 3 Schritten auf einen Beitrag.');
    successText = t(`Check that the address is really ${url}. On a shared computer, log out afterwards using the menu under your picture.`, `Prüfen Sie, ob die Adresse wirklich ${url} lautet. An einem gemeinsamen Computer melden Sie sich danach über das Menü unter Ihrem Bild ab.`);
    steps = [
      step(t(`Click "${labels.like}"`, `Klicken Sie auf „${labels.like}“`), t('It is under the photo, on the left.', 'Das steht unter dem Foto, links.'), [t('On the computer you click with the mouse instead of tapping.', 'Am Computer klicken Sie mit der Maus, statt zu tippen.')], 'web-feed', 'like', t(`"${labels.like}" is under the photo, on the left.`, `„${labels.like}“ steht unter dem Foto, links.`)),
      step(t('Open the comments', 'Kommentare öffnen'), t(`Click "${labels.comment}" next to it.`, `Klicken Sie daneben auf „${labels.comment}“.`), [t('A field for your comment opens under the post.', 'Unter dem Beitrag öffnet sich ein Feld für Ihren Kommentar.')], 'web-liked', 'comment', t(`"${labels.comment}" is in the middle under the photo.`, `„${labels.comment}“ steht in der Mitte unter dem Foto.`)),
      step(t('Write and send', 'Schreiben und senden'), typingNote, [t('Others can see your comment, so only write what you would also say out loud.', 'Andere sehen Ihren Kommentar, schreiben Sie also nur, was Sie auch laut sagen würden.')], 'web-comment', 'send', t('First write something. Then the send button appears on the right.', 'Schreiben Sie zuerst etwas. Dann erscheint rechts der Senden-Knopf.'), { requiresText: true }),
    ];
  } else {
    const url = 'banking.uebungsbank.example';
    screenId = 'desktop-bank';
    labels = {
      ...labels, deskUrl: url, welcomeDesk: t('Welcome to your online banking', 'Willkommen in Ihrem Online-Banking'), logout: t('Log out', 'Abmelden'),
      approveDesk: t('Approve the payment on your phone, as you would with your approval app. Check the amount there first.', 'Geben Sie die Zahlung am Handy frei, wie mit Ihrer Freigabe-App. Prüfen Sie dort zuerst den Betrag.'),
      logoutHint: t('Done. Now log out at the top right.', 'Fertig. Melden Sie sich jetzt oben rechts ab.'), loggedOut: t('You are logged out', 'Sie sind abgemeldet'),
      loggedOutText: t('Close the browser tab as well. Always do this, especially on a shared computer.', 'Schließen Sie auch den Browser-Tab. Tun Sie das immer, besonders an einem gemeinsam genutzten Computer.'),
    };
    description = t('Make a transfer in your bank\'s website, check the address, and log out properly.', 'Machen Sie eine Überweisung auf der Website Ihrer Bank, prüfen Sie die Adresse, und melden Sie sich richtig ab.');
    intro = t('You start already logged in, because this is practice. You will make a transfer in 7 steps.', 'Sie starten schon angemeldet, weil das eine Übung ist. Sie machen eine Überweisung in 7 Schritten.');
    successText = t(`Open your bank's website only by typing the address yourself or from a saved bookmark, never from a link in an email. ${name}'s real website looks different from this practice bank.`, `Öffnen Sie die Website Ihrer Bank nur, indem Sie die Adresse selbst eintippen oder ein gespeichertes Lesezeichen nutzen, nie über einen Link in einer E-Mail. Die echte Website von ${name} sieht anders aus als diese Übungsbank.`);
    steps = [
      lockStep(url),
      step(t('Open "Transfer"', '„Überweisung“ öffnen'), t('Click "Transfer" in the menu on the left.', 'Klicken Sie links im Menü auf „Überweisung“.'), [t('On the computer, menus are often on the left side.', 'Am Computer stehen Menüs oft links.')], 'web-bank-ok', 'transfer', t('"Transfer" is the second line on the left.', '„Überweisung“ ist links die zweite Zeile.')),
      step(t('Choose the person', 'Person wählen'), t('Click "Anna Beispiel".', 'Klicken Sie auf „Anna Beispiel“.'), [t('Saved people make it quicker and safer.', 'Gespeicherte Personen machen es schneller und sicherer.')], 'web-recipient', 'person-anna', t('Anna is the first line.', 'Anna ist die erste Zeile.')),
      step(t('Choose the amount', 'Betrag wählen'), t(`Click "${labels.amount}".`, `Klicken Sie auf „${labels.amount}“.`), [t('In the real website you type the amount yourself.', 'Auf der echten Website tippen Sie den Betrag selbst ein.')], 'web-amount', 'amount-right', t('The amount is the button at the top right.', 'Der Betrag ist der Knopf oben rechts.')),
      step(t('Check and confirm', 'Prüfen und bestätigen'), t('Read everything, then click the coloured button.', 'Lesen Sie alles, dann klicken Sie auf den farbigen Knopf.'), [t('The bank also checks that the name belongs to the IBAN.', 'Die Bank prüft auch, ob der Name zur IBAN gehört.')], 'web-check', 'confirm', t('The confirm button is the coloured one.', 'Der Bestätigen-Knopf ist der farbige.')),
      step(t('Approve on your phone', 'Am Handy freigeben'), t('Click "Approve" on the phone shown on the right.', 'Klicken Sie auf dem Handy rechts auf „Freigeben“.'), [t('Only approve what you started yourself, and check the amount.', 'Geben Sie nur frei, was Sie selbst begonnen haben, und prüfen Sie den Betrag.')], 'web-approve', 'approve-ok', t('"Approve" is on the phone on the right.', '„Freigeben“ ist auf dem Handy rechts.')),
      step(t('Log out', 'Abmelden'), t('Click "Log out" at the top right.', 'Klicken Sie oben rechts auf „Abmelden“.'), [t('Logging out properly protects your account, especially on a shared computer.', 'Richtig abmelden schützt Ihr Konto, besonders an einem gemeinsamen Computer.')], 'web-bank-done', 'logout', t('"Log out" is at the top right.', '„Abmelden“ ist oben rechts.')),
    ];
  }

  return {
    ...base,
    id: `${service.id}-desktop`,
    title: t(`${name}: Get Started on the Computer`, `${name}: Am Computer einrichten`),
    description,
    durationMinutes: steps.length + 2,
    tags: [name, t('Computer', 'Computer'), t('Practice', 'Übung')],
    practice: {
      ...base.practice!,
      screenId,
      device: 'desktop',
      kind: 'desktop',
      notice: t('Practice mode on a simulated computer: nothing real is sent, and you never enter real login data here.', 'Übungsmodus an einem simulierten Computer: Nichts Echtes wird gesendet, und Sie geben hier nie echte Zugangsdaten ein.'),
      introText: `${intro} ${t('There is no time limit.', 'Es gibt kein Zeitlimit.')}`,
      successTitle: t('Well done! You did it on the computer.', 'Gut gemacht! Sie haben es am Computer geschafft.'),
      successText: `${successText} ${t('This was only practice.', 'Das war nur eine Übung.')}`,
      labels,
    },
    steps: steps.map((s, i) => ({ ...s, stepNumber: i + 1 })),
  };
}

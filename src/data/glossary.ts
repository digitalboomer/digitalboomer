/**
 * "Digital words explained": plain explanations of the words our lessons use.
 * Shown on the glossary page (/glossary) and as "Words explained" buttons under each lesson
 * step that uses a word (`wordsIn`). The lesson text itself is never changed, so the live
 * translation into Turkish, Spanish and Croatian keeps working.
 *
 * `match` lists the forms that count as the word in English and German (whole words,
 * any capitals). Keep explanations to one or two short sentences and an example.
 */
import type { Language } from '../types';

interface Entry {
  id: string;
  term: [string, string];
  match: [string[], string[]];
  text: [string, string];
  example?: [string, string];
  lessons?: string[];
}

const ENTRIES: Entry[] = [
  { id: 'app', term: ['App', 'App'], match: [['app', 'apps'], ['app', 'apps']],
    text: ['A program on your phone or tablet that does one job, for example WhatsApp for messages or your bank\'s app for your account.', 'Ein Programm auf Handy oder Tablet, das eine Aufgabe erledigt, zum Beispiel WhatsApp für Nachrichten oder die App Ihrer Bank für Ihr Konto.'],
    example: ['You open an app by tapping its small picture on the home screen.', 'Sie öffnen eine App, indem Sie auf ihr kleines Bild auf dem Startbildschirm tippen.'], lessons: ['messaging-choose-app'] },
  { id: 'app-store', term: ['App Store and Play Store', 'App Store und Play Store'], match: [['app store', 'play store'], ['app store', 'app-store', 'play store']],
    text: ['The shop on your phone where you get apps: the App Store on the iPhone, the Google Play Store on Android phones. Many apps there are free.', 'Der Laden auf Ihrem Handy, in dem Sie Apps bekommen: der App Store auf dem iPhone, der Google Play Store auf Android-Handys. Viele Apps dort sind kostenlos.'],
    example: ['Install apps only from there, not from links in messages.', 'Installieren Sie Apps nur von dort, nicht über Links in Nachrichten.'] },
  { id: 'home-screen', term: ['Home screen', 'Startbildschirm'], match: [['home screen'], ['startbildschirm']],
    text: ['The first screen of your phone, with the small pictures of your apps.', 'Der erste Bildschirm Ihres Handys, mit den kleinen Bildern Ihrer Apps.'] },
  { id: 'settings', term: ['Settings', 'Einstellungen'], match: [['settings'], ['einstellungen']],
    text: ['The place in your phone or in an app where you change how it works: text size, sound, privacy and more. It often has a gear symbol.', 'Der Ort im Handy oder in einer App, an dem Sie ändern, wie sie funktioniert: Schriftgröße, Ton, Datenschutz und mehr. Er hat oft ein Zahnrad-Symbol.'] },
  { id: 'update', term: ['Update', 'Update'], match: [['update', 'updates'], ['update', 'updates', 'aktualisierung', 'aktualisierungen']],
    text: ['A new version of an app or of your phone\'s system. Updates fix mistakes and close security gaps.', 'Eine neue Version einer App oder des Handy-Systems. Updates beheben Fehler und schließen Sicherheitslücken.'],
    example: ['When your phone offers an update, install it, ideally overnight on the charger.', 'Wenn Ihr Handy ein Update anbietet, installieren Sie es, am besten über Nacht am Ladekabel.'], lessons: ['safety-updates'] },
  { id: 'install', term: ['Install', 'Installieren'], match: [['install', 'installed', 'installing'], ['installieren', 'installiert']],
    text: ['Putting an app onto your phone so that you can use it.', 'Eine App auf Ihr Handy holen, damit Sie sie nutzen können.'],
    example: ['Install apps only from the App Store or the Play Store.', 'Installieren Sie Apps nur aus dem App Store oder dem Play Store.'] },
  { id: 'download', term: ['Download', 'Herunterladen (Download)'], match: [['download', 'downloads', 'downloaded'], ['herunterladen', 'heruntergeladen', 'download']],
    text: ['Copying something from the internet onto your phone or computer, such as an app, a photo or a document.', 'Etwas aus dem Internet auf Handy oder Computer kopieren, zum Beispiel eine App, ein Foto oder ein Dokument.'] },
  { id: 'notification', term: ['Notification', 'Benachrichtigung'], match: [['notification', 'notifications'], ['benachrichtigung', 'benachrichtigungen', 'mitteilung', 'mitteilungen']],
    text: ['A short message that an app shows on your screen, for example "New message from Anna".', 'Eine kurze Meldung, die eine App auf Ihrem Bildschirm zeigt, zum Beispiel „Neue Nachricht von Anna“.'],
    example: ['You can switch notifications off for each app in the settings.', 'Benachrichtigungen können Sie für jede App in den Einstellungen ausschalten.'] },
  { id: 'screenshot', term: ['Screenshot', 'Bildschirmfoto (Screenshot)'], match: [['screenshot', 'screenshots'], ['screenshot', 'bildschirmfoto']],
    text: ['A photo of what is on your screen right now. You take one by pressing two buttons at the same time; which ones depends on your phone.', 'Ein Foto von dem, was gerade auf Ihrem Bildschirm ist. Sie machen es, indem Sie zwei Tasten gleichzeitig drücken; welche, hängt vom Handy ab.'] },
  { id: 'link', term: ['Link', 'Link'], match: [['link', 'links'], ['link', 'links']],
    text: ['A word or an address you can tap to open a page or a file.', 'Ein Wort oder eine Adresse, die Sie antippen, um eine Seite oder Datei zu öffnen.'],
    example: ['Be careful with links in unexpected emails and messages: they can lead to fake pages.', 'Vorsicht bei Links in unerwarteten E-Mails und Nachrichten: Sie können auf gefälschte Seiten führen.'], lessons: ['safety-phishing-examples'] },
  { id: 'browser', term: ['Browser', 'Browser'], match: [['browser', 'browsers'], ['browser']],
    text: ['The app you use to look at websites, for example Chrome, Safari, Firefox or Edge.', 'Die App, mit der Sie Websites ansehen, zum Beispiel Chrome, Safari, Firefox oder Edge.'] },
  { id: 'web-address', term: ['Internet address', 'Internetadresse'], match: [['web address', 'internet address', 'address bar', 'url'], ['internetadresse', 'adresszeile', 'url']],
    text: ['The address of a website, such as www.example.com. It is shown in the address bar at the top of the browser.', 'Die Adresse einer Website, zum Beispiel www.example.com. Sie steht in der Adresszeile oben im Browser.'],
    example: ['Check it before you type a password: fake websites use addresses that look almost right.', 'Prüfen Sie sie, bevor Sie ein Passwort eingeben: Gefälschte Websites nutzen Adressen, die fast richtig aussehen.'], lessons: ['safety-fake-websites'] },
  { id: 'wifi', term: ['Wi-Fi', 'WLAN'], match: [['wi-fi', 'wifi'], ['wlan']],
    text: ['Internet without a cable, at home or in a café. At home it costs nothing extra.', 'Internet ohne Kabel, zu Hause oder im Café. Zu Hause kostet es nichts extra.'],
    example: ['In public Wi-Fi, do not do your online banking.', 'Im öffentlichen WLAN machen Sie besser kein Online-Banking.'], lessons: ['safety-wifi'] },
  { id: 'mobile-data', term: ['Mobile data', 'Mobile Daten'], match: [['mobile data'], ['mobile daten', 'datenvolumen']],
    text: ['Internet through your phone contract, when there is no Wi-Fi. Your contract includes a certain amount each month.', 'Internet über Ihren Handyvertrag, wenn kein WLAN da ist. In Ihrem Vertrag ist eine bestimmte Menge pro Monat enthalten.'] },
  { id: 'cloud', term: ['Cloud', 'Cloud'], match: [['cloud', 'icloud'], ['cloud', 'icloud']],
    text: ['Storage on a company\'s computers on the internet, for example iCloud or Google Drive.', 'Speicher auf den Computern einer Firma im Internet, zum Beispiel iCloud oder Google Drive.'],
    example: ['Photos kept in the cloud are safe even if your phone is lost.', 'Fotos in der Cloud sind sicher, auch wenn das Handy verloren geht.'] },
  { id: 'backup', term: ['Backup', 'Sicherung (Backup)'], match: [['backup', 'backups', 'back up'], ['backup', 'sicherung', 'chat-backup']],
    text: ['A copy of your data, such as chats and photos, kept outside your phone.', 'Eine Kopie Ihrer Daten, zum Beispiel Chats und Fotos, außerhalb Ihres Handys.'],
    example: ['With a backup you get everything back on a new phone.', 'Mit einer Sicherung bekommen Sie auf einem neuen Handy alles zurück.'], lessons: ['messaging-new-phone'] },
  { id: 'account', term: ['Account', 'Konto (Account)'], match: [['account', 'accounts'], ['konto', 'konten', 'account']],
    text: ['Your personal access to a service, for example to WhatsApp or your email, with your name or email address and a password.', 'Ihr persönlicher Zugang zu einem Dienst, zum Beispiel zu WhatsApp oder Ihrer E-Mail, mit Name oder E-Mail-Adresse und Passwort. Bei der Bank heißt auch Ihr Bankkonto „Konto“.'] },
  { id: 'sign-in', term: ['Sign in', 'Anmelden'], match: [['sign in', 'signed in', 'log in', 'login'], ['anmelden', 'anmeldung', 'einloggen']],
    text: ['Opening your account by entering your email address or name and your password.', 'Ihr Konto öffnen, indem Sie E-Mail-Adresse oder Namen und Passwort eingeben.'] },
  { id: 'password', term: ['Password', 'Passwort'], match: [['password', 'passwords'], ['passwort', 'passwörter', 'kennwort']],
    text: ['A secret word that protects an account. Use a long one, and a different one for every account.', 'Ein geheimes Wort, das ein Konto schützt. Nehmen Sie ein langes, und für jedes Konto ein anderes.'],
    example: ['Nobody from your bank or an app will ever ask you for it.', 'Niemand von Ihrer Bank oder einer App fragt Sie je danach.'], lessons: ['passwoerter-erstellen'] },
  { id: 'pin', term: ['PIN', 'PIN'], match: [['pin', 'pins'], ['pin', 'geheimzahl']],
    text: ['A short secret number, for example for your bank card or to unlock your phone.', 'Eine kurze Geheimzahl, zum Beispiel für Ihre Bankkarte oder um das Handy zu entsperren.'],
    example: ['Never tell anyone your PIN, not even the bank or the police.', 'Sagen Sie Ihre PIN niemandem, auch nicht der Bank oder der Polizei.'] },
  { id: 'code', term: ['Code (one-time code)', 'Code (Einmal-Code)'], match: [['code', 'codes'], ['code', 'codes', 'bestätigungscode']],
    text: ['A number that a service sends you by text message or shows in an app, to check that it is really you.', 'Eine Zahl, die Ihnen ein Dienst per SMS schickt oder in einer App zeigt, um zu prüfen, dass Sie es wirklich sind.'],
    example: ['Never pass on a code, not even to friends.', 'Geben Sie einen Code nie weiter, auch nicht an Freunde.'], lessons: ['safety-account-code'] },
  { id: 'two-step', term: ['Two-step verification', 'Bestätigung in zwei Schritten'], match: [['two-step', 'two-factor', '2fa'], ['zwei schritten', 'zwei-faktor', 'zwei-schritt']],
    text: ['A second lock for your account: after the password you also confirm with a code or in an app on your phone.', 'Ein zweites Schloss für Ihr Konto: Nach dem Passwort bestätigen Sie zusätzlich mit einem Code oder in einer App auf dem Handy.'], lessons: ['safety-2fa'] },
  { id: 'email-address', term: ['Email address', 'E-Mail-Adresse'], match: [['email address', 'email addresses'], ['e-mail-adresse', 'e-mail-adressen']],
    text: ['Your address for emails, for example anna@example.com. The part after the @ is your email service.', 'Ihre Adresse für E-Mails, zum Beispiel anna@example.com. Der Teil nach dem @ ist Ihr E-Mail-Dienst.'] },
  { id: 'attachment', term: ['Attachment', 'Anhang'], match: [['attachment', 'attachments'], ['anhang', 'anhänge']],
    text: ['A file sent along with an email, such as a photo or a PDF document.', 'Eine Datei, die mit einer E-Mail mitgeschickt wird, zum Beispiel ein Foto oder ein PDF-Dokument.'],
    example: ['Only open attachments you expect, from people you know.', 'Öffnen Sie nur Anhänge, die Sie erwarten, von Menschen, die Sie kennen.'], lessons: ['e-mail-anhaenge-pruefen'] },
  { id: 'spam', term: ['Spam', 'Spam'], match: [['spam'], ['spam']],
    text: ['Unwanted email, often advertising or scams. Your email service moves most of it into the spam folder by itself.', 'Unerwünschte E-Mails, oft Werbung oder Betrug. Ihr E-Mail-Dienst verschiebt die meisten von selbst in den Spam-Ordner.'] },
  { id: 'phishing', term: ['Phishing', 'Phishing'], match: [['phishing'], ['phishing']],
    text: ['Fake emails, messages or websites that try to steal your passwords or bank details. They often pretend to come from your bank or a parcel service.', 'Gefälschte E-Mails, Nachrichten oder Websites, die Ihre Passwörter oder Bankdaten stehlen wollen. Sie geben sich oft als Ihre Bank oder ein Paketdienst aus.'], lessons: ['phishing-erkennen'] },
  { id: 'scam', term: ['Scam', 'Betrug'], match: [['scam', 'scams', 'scammer', 'scammers'], ['betrug', 'betrüger']],
    text: ['A trick to get your money or your data. Warning signs: hurry, secrecy, and unusual ways to pay.', 'Ein Trick, um an Ihr Geld oder Ihre Daten zu kommen. Warnzeichen: Eile, Geheimhaltung und ungewöhnliche Zahlungswege.'], lessons: ['safety-what-if'] },
  { id: 'qr-code', term: ['QR code', 'QR-Code'], match: [['qr code', 'qr codes'], ['qr-code', 'qr-codes']],
    text: ['A square pattern you scan with your phone\'s camera. It usually opens a website.', 'Ein quadratisches Muster, das Sie mit der Handykamera scannen. Meist öffnet es eine Website.'],
    example: ['Check the address it opens before you type anything there.', 'Prüfen Sie die Adresse, die sich öffnet, bevor Sie dort etwas eingeben.'], lessons: ['safety-qr'] },
  { id: 'chat', term: ['Chat', 'Chat'], match: [['chat', 'chats'], ['chat', 'chats']],
    text: ['A written conversation in a messaging app, with one person or with a group.', 'Ein schriftliches Gespräch in einer Nachrichten-App, mit einer Person oder einer Gruppe.'] },
  { id: 'group-chat', term: ['Group chat', 'Gruppenchat'], match: [['group chat', 'group chats', 'group', 'groups'], ['gruppenchat', 'gruppe', 'gruppen']],
    text: ['A chat with several people at once. Everyone in the group reads what you write there.', 'Ein Chat mit mehreren Menschen zugleich. Alle in der Gruppe lesen, was Sie dort schreiben.'], lessons: ['messaging-groups'] },
  { id: 'voice-message', term: ['Voice message', 'Sprachnachricht'], match: [['voice message', 'voice messages'], ['sprachnachricht', 'sprachnachrichten']],
    text: ['A short recording of your voice, sent instead of a typed message.', 'Eine kurze Aufnahme Ihrer Stimme, die Sie statt einer getippten Nachricht senden.'] },
  { id: 'video-call', term: ['Video call', 'Videoanruf'], match: [['video call', 'video calls'], ['videoanruf', 'videoanrufe', 'videotelefonie']],
    text: ['A call in which you see each other on the screen. It uses the internet, so on Wi-Fi it costs nothing extra.', 'Ein Anruf, bei dem Sie sich auf dem Bildschirm sehen. Er läuft über das Internet und kostet im WLAN nichts extra.'], lessons: ['videotelefonie-familie'] },
  { id: 'emoji', term: ['Emoji', 'Emoji'], match: [['emoji', 'emojis'], ['emoji', 'emojis']],
    text: ['A small picture in a message, such as a smiling face or a thumbs up.', 'Ein kleines Bild in einer Nachricht, zum Beispiel ein lachendes Gesicht oder ein Daumen hoch.'] },
  { id: 'contacts', term: ['Contacts', 'Kontakte'], match: [['contacts', 'address book'], ['kontakte', 'adressbuch']],
    text: ['The address book in your phone or your email: names with phone numbers and email addresses.', 'Das Adressbuch in Ihrem Handy oder Ihrer E-Mail: Namen mit Telefonnummern und E-Mail-Adressen.'] },
  { id: 'profile', term: ['Profile', 'Profil'], match: [['profile', 'profiles'], ['profil', 'profile']],
    text: ['Your page in an app or on social media, with your name, your picture and what you share.', 'Ihre Seite in einer App oder in sozialen Medien, mit Ihrem Namen, Ihrem Bild und dem, was Sie teilen.'] },
  { id: 'post', term: ['Post', 'Beitrag (Post)'], match: [['post', 'posts', 'posting'], ['beitrag', 'beiträge', 'posten']],
    text: ['Something you publish on social media: a text, a photo or a video.', 'Etwas, das Sie in sozialen Medien veröffentlichen: ein Text, ein Foto oder ein Video.'],
    example: ['Check who can see it before you post.', 'Prüfen Sie vor dem Posten, wer es sehen kann.'], lessons: ['social-before-posting'] },
  { id: 'block', term: ['Block', 'Blockieren'], match: [['block', 'blocked', 'blocking'], ['blockieren', 'blockiert']],
    text: ['Stopping someone from contacting you in an app. Usually the other person is not told.', 'Jemanden daran hindern, Sie in einer App zu kontaktieren. Meist erfährt die andere Person davon nichts.'], lessons: ['whatsapp-block'] },
  { id: 'cookies', term: ['Cookies', 'Cookies'], match: [['cookie', 'cookies'], ['cookie', 'cookies']],
    text: ['Small notes a website stores in your browser, for example to remember your language. A cookie banner asks whether it may store more.', 'Kleine Notizen, die eine Website in Ihrem Browser speichert, zum Beispiel um sich Ihre Sprache zu merken. Ein Cookie-Hinweis fragt, ob sie mehr speichern darf.'],
    example: ['"Reject" or "Only necessary" is always fine.', '„Ablehnen“ oder „Nur notwendige“ ist immer in Ordnung.'] },
  { id: 'online-banking', term: ['Online banking', 'Online-Banking'], match: [['online banking'], ['online-banking']],
    text: ['Doing your banking on the internet: checking your balance and making transfers. Your bank\'s own app is the safest way.', 'Bankgeschäfte im Internet erledigen: Kontostand prüfen und Überweisungen machen. Die eigene App Ihrer Bank ist der sicherste Weg.'], lessons: ['online-banking-grundlagen'] },
  { id: 'iban', term: ['IBAN', 'IBAN'], match: [['iban'], ['iban']],
    text: ['The number of a bank account, for transfers. In Germany it starts with "DE" and has 22 characters.', 'Die Nummer eines Bankkontos, für Überweisungen. In Deutschland beginnt sie mit „DE“ und hat 22 Zeichen.'] },
  { id: 'tan', term: ['TAN and approval app', 'TAN und Freigabe-App'], match: [['tan', 'pushtan', 'phototan', 'approve', 'approval'], ['tan', 'pushtan', 'phototan', 'freigabe', 'freigeben']],
    text: ['A one-time code or a confirmation in your bank\'s app, with which you approve a payment.', 'Ein Einmal-Code oder eine Bestätigung in der App Ihrer Bank, mit der Sie eine Zahlung freigeben.'],
    example: ['Only approve payments you started yourself.', 'Geben Sie nur Zahlungen frei, die Sie selbst begonnen haben.'], lessons: ['banking-approve'] },
  { id: 'ai', term: ['AI and chatbots', 'KI und Chatbots'], match: [['ai', 'chatbot', 'chatbots', 'artificial intelligence', 'chatgpt'], ['ki', 'chatbot', 'chatbots', 'künstliche intelligenz', 'chatgpt']],
    text: ['A chatbot is a program you can write to like a person, for example ChatGPT. It answers with the help of artificial intelligence (AI), and it can be wrong.', 'Ein Chatbot ist ein Programm, dem Sie wie einem Menschen schreiben können, zum Beispiel ChatGPT. Es antwortet mit künstlicher Intelligenz (KI) und kann sich irren.'], lessons: ['ai-what-is-it'] },
];

export interface GlossaryWord {
  id: string;
  term: string;
  text: string;
  example?: string;
  lessons: string[];
}

const pickLang = (lang: Language) => (pair: [string, string]) => (lang === 'en' ? pair[0] : pair[1]);

/** All words in one language, sorted A to Z. */
export function glossary(lang: Language): GlossaryWord[] {
  const pick = pickLang(lang);
  return ENTRIES.map((e) => ({ id: e.id, term: pick(e.term), text: pick(e.text), example: e.example && pick(e.example), lessons: e.lessons ?? [] }))
    .sort((a, b) => a.term.localeCompare(b.term, lang));
}

export function glossaryWord(id: string, lang: Language): GlossaryWord | undefined {
  return glossary(lang).find((w) => w.id === id);
}

const PATTERNS: Partial<Record<Language, { id: string; re: RegExp }[]>> = {};
function patterns(lang: Language) {
  if (!PATTERNS[lang]) {
    const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+');
    PATTERNS[lang] = ENTRIES.map((e) => ({
      id: e.id,
      re: new RegExp(`(?<![\\p{L}\\p{N}])(?:${e.match[lang === 'en' ? 0 : 1].map(escape).join('|')})(?![\\p{L}\\p{N}])`, 'iu'),
    }));
  }
  return PATTERNS[lang]!;
}

/** The glossary words that appear in these texts, in the order they first appear (at most `max`). */
export function wordsIn(texts: (string | undefined)[], lang: Language, max = 4): GlossaryWord[] {
  const text = texts.filter(Boolean).join(' \n ');
  const found = patterns(lang)
    .map(({ id, re }) => ({ id, at: text.search(re) }))
    .filter((f) => f.at >= 0)
    .sort((a, b) => a.at - b.at)
    .slice(0, max);
  const words = glossary(lang);
  return found.map((f) => words.find((w) => w.id === f.id)!).filter(Boolean);
}

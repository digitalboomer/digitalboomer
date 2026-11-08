/**
 * Digital Safety guides and scam examples, in English and German. Every company
 * and address is invented, and addresses end in .example so that none can work.
 * The hotlines are real: 116 116 (German card blocking) and 110 (police).
 */
import { IMAGES } from '../assets/images';
import type { Language, Tutorial } from '../types';

export interface ScamBlock {
  text: string;
  /** The number of the warning sign this part of the message shows. */
  sign?: number;
  kind?: 'label' | 'title' | 'body' | 'button' | 'small';
}

export interface ScamCard {
  kind: 'email' | 'sms' | 'chat' | 'call' | 'popup' | 'shop' | 'qr' | 'file';
  heading: string;
  blocks: ScamBlock[];
  signs: { title: string; text: string }[];
  advice: string;
}

export function scamExamples(lang: Language): Record<string, ScamCard> {
  const en = lang === 'en';
  const t = (a: string, b: string) => (en ? a : b);
  return {
    bank: {
      kind: 'email',
      heading: t('Email from your "bank"', 'E-Mail von Ihrer „Bank“'),
      blocks: [
        { kind: 'label', sign: 1, text: t('From: Musterbank Security <alert@musterbank-sicherheit.example>', 'Von: Musterbank Sicherheit <alert@musterbank-sicherheit.example>') },
        { kind: 'title', sign: 2, text: t('URGENT: your account will be blocked in 24 hours', 'DRINGEND: Ihr Konto wird in 24 Stunden gesperrt') },
        { kind: 'body', sign: 3, text: t('Dear customer,', 'Sehr geehrter Kunde,') },
        { kind: 'body', text: t('We have noticed unusual activity. Please confirm your access details now.', 'Wir haben ungewöhnliche Aktivitäten festgestellt. Bitte bestätigen Sie jetzt Ihre Zugangsdaten.') },
        { kind: 'button', sign: 4, text: t('Enter PIN and password', 'PIN und Passwort eingeben') },
      ],
      signs: [
        { title: t('A strange address', 'Eine seltsame Adresse'), text: t('The name looks right, but the part after the @ does not belong to your bank.', 'Der Name wirkt richtig, aber der Teil nach dem @ gehört nicht zu Ihrer Bank.') },
        { title: t('Time pressure', 'Zeitdruck'), text: t('Panic is meant to stop you from thinking. Real banks do not threaten you like this.', 'Panik soll Sie vom Nachdenken abhalten. Echte Banken drohen nicht so.') },
        { title: t('No name', 'Kein Name'), text: t('Your bank knows your name. "Dear customer" goes out to thousands.', 'Ihre Bank kennt Ihren Namen. „Sehr geehrter Kunde“ geht an Tausende.') },
        { title: t('It asks for secrets', 'Es fragt nach Geheimem'), text: t('No bank ever asks for your PIN or password by email.', 'Keine Bank fragt je per E-Mail nach PIN oder Passwort.') },
      ],
      advice: t('Do not tap anything. If you are worried, open your banking app yourself, or call the number on your bank card.', 'Tippen Sie nichts an. Wenn Sie besorgt sind, öffnen Sie selbst Ihre Banking-App, oder rufen Sie die Nummer auf Ihrer Bankkarte an.'),
    },
    parcel: {
      kind: 'email',
      heading: t('Email about a parcel', 'E-Mail zu einem Paket'),
      blocks: [
        { kind: 'label', sign: 1, text: 'PaketBlitz <info@paketblitz-zustellung24.example>' },
        { kind: 'title', text: t('Your parcel could not be delivered', 'Ihr Paket konnte nicht zugestellt werden') },
        { kind: 'body', sign: 2, text: t('A customs fee of 1.99 euros is open. Pay it so that we can deliver.', 'Es ist eine Zollgebühr von 1,99 Euro offen. Zahlen Sie, damit wir liefern können.') },
        { kind: 'button', sign: 3, text: t('Pay by card now', 'Jetzt mit Karte zahlen') },
      ],
      signs: [
        { title: t('An odd sender', 'Ein seltsamer Absender'), text: t('Long addresses with extra words such as "zustellung24" are a warning sign.', 'Lange Adressen mit Zusatzwörtern wie „zustellung24“ sind ein Warnzeichen.') },
        { title: t('A tiny amount', 'Ein winziger Betrag'), text: t('The small sum is bait. The criminals want your card details, not the 1.99 euros.', 'Die kleine Summe ist ein Köder. Die Kriminellen wollen Ihre Kartendaten, nicht die 1,99 Euro.') },
        { title: t('Card details for a parcel', 'Kartendaten für ein Paket'), text: t('Are you even expecting a parcel? Check on the delivery company\'s own website or app.', 'Erwarten Sie überhaupt ein Paket? Prüfen Sie es auf der Website oder in der App des Lieferdienstes selbst.') },
      ],
      advice: t('Delete it. Check real deliveries with the tracking number from the shop where you ordered.', 'Löschen Sie sie. Echte Lieferungen prüfen Sie mit der Sendungsnummer aus dem Shop, in dem Sie bestellt haben.'),
    },
    tax: {
      kind: 'email',
      heading: t('Email about a tax refund', 'E-Mail zu einer Steuererstattung'),
      blocks: [
        { kind: 'label', sign: 1, text: t('Tax Office <refund@tax-office-germany.example>', 'Finanzamt <erstattung@finanzamt-erstattung.example>') },
        { kind: 'title', sign: 2, text: t('You will get 842.50 euros back!', 'Sie erhalten 842,50 Euro zurück!') },
        { kind: 'body', sign: 3, text: t('Enter your bank details and tax number within 3 days, or your claim expires.', 'Geben Sie innerhalb von 3 Tagen Bankdaten und Steuernummer ein, sonst verfällt Ihr Anspruch.') },
        { kind: 'button', text: t('Claim refund', 'Erstattung anfordern') },
      ],
      signs: [
        { title: t('Offices write by post', 'Ämter schreiben per Post'), text: t('Tax offices do not usually announce refunds in an email from an unknown address.', 'Finanzämter kündigen Erstattungen in der Regel nicht per E-Mail von einer unbekannten Adresse an.') },
        { title: t('A lovely surprise', 'Eine schöne Überraschung'), text: t('Unexpected money makes us careless. That is exactly the plan.', 'Unerwartetes Geld macht uns unvorsichtig. Genau das ist der Plan.') },
        { title: t('A deadline, plus your data', 'Eine Frist und Ihre Daten'), text: t('A short deadline and a request for bank details together are a very clear warning.', 'Eine kurze Frist und die Frage nach Bankdaten zusammen sind eine sehr deutliche Warnung.') },
      ],
      advice: t('Delete it. If you are unsure, call your tax office on the number from one of its letters.', 'Löschen Sie sie. Im Zweifel rufen Sie Ihr Finanzamt unter der Nummer aus einem seiner Briefe an.'),
    },
    stream: {
      kind: 'email',
      heading: t('Email about your subscription', 'E-Mail zu Ihrem Abo'),
      blocks: [
        { kind: 'label', sign: 1, text: 'StreamNow <billing@streamnow-konto.example>' },
        { kind: 'title', text: t('Your payment failed', 'Ihre Zahlung ist fehlgeschlagen') },
        { kind: 'body', sign: 2, text: t('Dear user, update you payment detail or you lost access today.', 'Lieber Benutzer, aktualisieren Sie ihre Zahlung Daten oder sie verlieren heute Zugang.') },
        { kind: 'button', sign: 3, text: t('Update payment details', 'Zahlungsdaten aktualisieren') },
      ],
      signs: [
        { title: t('Not the real address', 'Nicht die echte Adresse'), text: t('Compare it with earlier emails from the same company.', 'Vergleichen Sie sie mit früheren E-Mails derselben Firma.') },
        { title: t('Clumsy language', 'Holprige Sprache'), text: t('Spelling mistakes are a clue, although AI now writes many fake emails without mistakes.', 'Rechtschreibfehler sind ein Hinweis, auch wenn KI viele gefälschte E-Mails inzwischen fehlerfrei schreibt.') },
        { title: t('The button in the email', 'Der Knopf in der E-Mail'), text: t('It leads to a copied page. Do you even have this subscription? Open the app yourself and look.', 'Er führt zu einer kopierten Seite. Haben Sie dieses Abo überhaupt? Öffnen Sie selbst die App und schauen Sie nach.') },
      ],
      advice: t('Never pay through the link. Open the app or type the website address yourself.', 'Zahlen Sie nie über den Link. Öffnen Sie die App oder tippen Sie die Website-Adresse selbst ein.'),
    },
    friend: {
      kind: 'email',
      heading: t('Email from a "friend"', 'E-Mail von einem „Freund“'),
      blocks: [
        { kind: 'label', text: 'Peter Muster <peter.muster@beispiel.example>' },
        { kind: 'title', sign: 1, text: t('Please help me!!', 'Bitte hilf mir!!') },
        { kind: 'body', sign: 2, text: t('I am stuck abroad and my wallet was stolen. Please send 400 euros today. I cannot talk on the phone right now.', 'Ich sitze im Ausland fest, und meine Geldbörse wurde gestohlen. Bitte schick mir heute 400 Euro. Telefonieren kann ich gerade nicht.') },
      ],
      signs: [
        { title: t('The address can be right', 'Die Adresse kann stimmen'), text: t('If Peter\'s account was hacked, the email really comes from his address. So the sender alone proves nothing.', 'Wurde Peters Konto gehackt, kommt die E-Mail wirklich von seiner Adresse. Der Absender allein beweist also nichts.') },
        { title: t('Money, and no phone call', 'Geld, und kein Anruf'), text: t('The excuse for not talking is the giveaway. Criminals avoid your hearing the wrong voice.', 'Die Ausrede, nicht zu telefonieren, verrät es. Kriminelle wollen nicht, dass Sie die falsche Stimme hören.') },
      ],
      advice: t('Call Peter on the number you already have, not one from the email.', 'Rufen Sie Peter unter der Nummer an, die Sie schon haben, nicht unter einer aus der E-Mail.'),
    },
    'sms-parcel': {
      kind: 'sms',
      heading: t('Text message about a parcel', 'SMS zu einem Paket'),
      blocks: [
        { kind: 'label', sign: 1, text: '+49 170 0000000' },
        { kind: 'body', sign: 2, text: t('Your parcel is waiting. Confirm your address today:', 'Ihr Paket wartet. Bestätigen Sie heute Ihre Adresse:') },
        { kind: 'button', sign: 3, text: 'pkt-blitz.example/a7x' },
      ],
      signs: [
        { title: t('A private number', 'Eine private Nummer'), text: t('Delivery companies do not normally write from a random mobile number.', 'Lieferdienste schreiben normalerweise nicht von einer beliebigen Handynummer.') },
        { title: t('No details', 'Keine Einzelheiten'), text: t('No name and no parcel number: the same text goes to thousands of people.', 'Kein Name und keine Paketnummer: Derselbe Text geht an Tausende.') },
        { title: t('A short, strange link', 'Ein kurzer, seltsamer Link'), text: t('The link may install a harmful app or ask for card details.', 'Der Link kann eine schädliche App installieren oder nach Kartendaten fragen.') },
      ],
      advice: t('Do not tap the link. Delete the message, and block the number if you like.', 'Tippen Sie nicht auf den Link. Löschen Sie die Nachricht, und blockieren Sie die Nummer, wenn Sie möchten.'),
    },
    'hi-mum': {
      kind: 'chat',
      heading: t('Chat message: "Hi Mum"', 'Chat-Nachricht: „Hallo Mama“'),
      blocks: [
        { kind: 'label', sign: 1, text: t('Unknown number', 'Unbekannte Nummer') },
        { kind: 'body', sign: 2, text: t('Hi Mum, my phone broke. This is my new number. Please delete the old one.', 'Hallo Mama, mein Handy ist kaputt. Das ist meine neue Nummer. Bitte lösch die alte.') },
        { kind: 'body', sign: 3, text: t('I have to pay an urgent bill today and my banking does not work on the new phone. Can you transfer 1,200 euros? I will pay you back tomorrow.', 'Ich muss heute dringend eine Rechnung bezahlen, und mein Banking geht auf dem neuen Handy nicht. Kannst du 1.200 Euro überweisen? Ich zahle es morgen zurück.') },
      ],
      signs: [
        { title: t('A new number', 'Eine neue Nummer'), text: t('They do not even use a name. The message fits any mother or father.', 'Es fällt nicht einmal ein Name. Die Nachricht passt auf jede Mutter und jeden Vater.') },
        { title: t('"Delete the old number"', '„Lösch die alte Nummer“'), text: t('This stops you from checking with your real child.', 'So sollen Sie nicht bei Ihrem echten Kind nachfragen.') },
        { title: t('Urgent money', 'Dringend Geld'), text: t('An urgent bill plus a banking problem is the classic story of this scam.', 'Eine dringende Rechnung und ein Banking-Problem sind die klassische Geschichte bei diesem Betrug.') },
      ],
      advice: t('Call your child on the old number, or ask a question only your child can answer. Do not send money.', 'Rufen Sie Ihr Kind unter der alten Nummer an, oder stellen Sie eine Frage, die nur Ihr Kind beantworten kann. Senden Sie kein Geld.'),
    },
    grandchild: {
      kind: 'call',
      heading: t('Call from a "grandchild"', 'Anruf vom „Enkelkind“'),
      blocks: [
        { kind: 'label', text: t('Unknown number', 'Unbekannte Nummer') },
        { kind: 'body', sign: 1, text: t('"Guess who this is, Grandma!"', '„Rate mal, wer hier ist, Oma!“') },
        { kind: 'body', sign: 2, text: t('"I had an accident. I need 8,000 euros today. Please do not tell anyone."', '„Ich hatte einen Unfall. Ich brauche heute 8.000 Euro. Bitte sag es niemandem.“') },
        { kind: 'body', sign: 3, text: t('"A friend of mine will come by and collect it."', '„Ein Freund von mir kommt vorbei und holt es ab.“') },
      ],
      signs: [
        { title: t('You supply the name', 'Sie nennen den Namen'), text: t('You say "Is that Max?", and from then on the caller is Max.', 'Sie fragen „Bist du das, Max?“, und ab dann ist der Anrufer Max.') },
        { title: t('Money and secrecy', 'Geld und Geheimhaltung'), text: t('Secrecy stops you from checking. AI can also imitate a familiar voice.', 'Geheimhaltung soll Sie vom Prüfen abhalten. KI kann auch eine vertraute Stimme nachahmen.') },
        { title: t('A stranger collects it', 'Ein Fremder holt es ab'), text: t('Your family would never send a stranger for your savings.', 'Ihre Familie würde nie einen Fremden wegen Ihrer Ersparnisse schicken.') },
      ],
      advice: t('Hang up, and call your grandchild on the number you know. Agree on a family password beforehand.', 'Legen Sie auf, und rufen Sie Ihr Enkelkind unter der bekannten Nummer an. Vereinbaren Sie vorab ein Familien-Passwort.'),
    },
    police: {
      kind: 'call',
      heading: t('Call from the "police"', 'Anruf von der „Polizei“'),
      blocks: [
        { kind: 'label', sign: 1, text: t('The display shows: 110', 'Das Display zeigt: 110') },
        { kind: 'body', sign: 2, text: t('"We caught burglars in your street. They had a list with your name on it."', '„Wir haben in Ihrer Straße Einbrecher gefasst. Sie hatten eine Liste mit Ihrem Namen.“') },
        { kind: 'body', sign: 3, text: t('"Your money is not safe. An officer will collect it for safekeeping."', '„Ihr Geld ist nicht sicher. Ein Beamter holt es zur Verwahrung ab.“') },
      ],
      signs: [
        { title: t('110 on the display', '110 auf dem Display'), text: t('Criminals can fake the number on the display. The real police never call you from 110.', 'Kriminelle können die Nummer auf dem Display fälschen. Die echte Polizei ruft nie von der 110 an.') },
        { title: t('A frightening story', 'Eine beängstigende Geschichte'), text: t('Fear is meant to make you obey without checking.', 'Angst soll Sie dazu bringen, ohne Prüfung zu gehorchen.') },
        { title: t('Handing over valuables', 'Wertsachen übergeben'), text: t('The police never collect money or valuables for safekeeping.', 'Die Polizei holt niemals Geld oder Wertsachen zur Verwahrung ab.') },
      ],
      advice: t('Hang up. Then dial 110 yourself, and report the call.', 'Legen Sie auf. Wählen Sie dann selbst die 110, und melden Sie den Anruf.'),
    },
    tech: {
      kind: 'call',
      heading: t('Call from "computer support"', 'Anruf vom „Computer-Support“'),
      blocks: [
        { kind: 'body', sign: 1, text: t('"We are calling from technical support. Your computer has a virus."', '„Wir rufen vom technischen Support an. Ihr Computer hat einen Virus.“') },
        { kind: 'body', sign: 2, text: t('"Please install this program, so that I can see your screen."', '„Bitte installieren Sie dieses Programm, damit ich Ihren Bildschirm sehen kann.“') },
        { kind: 'body', sign: 3, text: t('"Now log in to your online banking, so that I can check it."', '„Melden Sie sich jetzt im Online-Banking an, damit ich es prüfen kann.“') },
      ],
      signs: [
        { title: t('They called you', 'Man hat Sie angerufen'), text: t('Big software companies do not call you about viruses.', 'Große Softwarefirmen rufen nicht wegen Viren an.') },
        { title: t('Remote access', 'Fernzugriff'), text: t('With this program the caller controls your computer. Only allow this for someone you know.', 'Mit diesem Programm steuert der Anrufer Ihren Computer. Erlauben Sie das nur Menschen, die Sie kennen.') },
        { title: t('Your banking', 'Ihr Banking'), text: t('This is the actual goal: access to your money.', 'Das ist das eigentliche Ziel: Zugriff auf Ihr Geld.') },
      ],
      advice: t('Hang up. If you already let them in, switch the computer off and ask someone you trust or a repair shop for help, and tell your bank.', 'Legen Sie auf. Haben Sie schon Zugriff erlaubt, schalten Sie den Computer aus, holen Sie sich Hilfe bei einer Vertrauensperson oder Werkstatt, und informieren Sie Ihre Bank.'),
    },
    popup: {
      kind: 'popup',
      heading: t('A scary window on your screen', 'Ein beängstigendes Fenster auf dem Bildschirm'),
      blocks: [
        { kind: 'title', sign: 1, text: t('WARNING! 5 VIRUSES FOUND!', 'WARNUNG! 5 VIREN GEFUNDEN!') },
        { kind: 'body', sign: 2, text: t('Your data will be deleted in 2:59 minutes.', 'Ihre Daten werden in 2:59 Minuten gelöscht.') },
        { kind: 'body', sign: 3, text: t('Call support immediately: 0800 000 0000', 'Rufen Sie sofort den Support an: 0800 000 0000') },
        { kind: 'button', sign: 4, text: t('Download cleaner', 'Reinigungsprogramm laden') },
      ],
      signs: [
        { title: t('Shouting', 'Großbuchstaben'), text: t('A website cannot look inside your computer and count viruses.', 'Eine Website kann nicht in Ihren Computer schauen und Viren zählen.') },
        { title: t('A countdown', 'Ein Countdown'), text: t('The clock is only there to scare you. Nothing happens when it runs out.', 'Die Uhr soll Ihnen nur Angst machen. Wenn sie abläuft, passiert nichts.') },
        { title: t('A phone number', 'Eine Telefonnummer'), text: t('Real security warnings never ask you to call a number.', 'Echte Sicherheitswarnungen fordern nie zu einem Anruf auf.') },
        { title: t('A download', 'Ein Download'), text: t('The "cleaner" is the actual harmful program.', 'Das „Reinigungsprogramm“ ist das eigentliche Schadprogramm.') },
      ],
      advice: t('Close the browser. If that does not work, restart the device. Your computer is almost certainly fine.', 'Schließen Sie den Browser. Klappt das nicht, starten Sie das Gerät neu. Ihr Computer ist fast sicher in Ordnung.'),
    },
    qr: {
      kind: 'qr',
      heading: t('A QR code on a parking meter', 'Ein QR-Code an einer Parkuhr'),
      blocks: [
        { kind: 'body', sign: 1, text: t('A sticker on the meter: "Scan to pay quickly"', 'Ein Aufkleber auf der Parkuhr: „Scannen und schnell zahlen“') },
        { kind: 'label', sign: 2, text: t('The phone shows: parken-schnell-zahlen.example', 'Das Handy zeigt: parken-schnell-zahlen.example') },
        { kind: 'button', sign: 3, text: t('Enter card number', 'Kartennummer eingeben') },
      ],
      signs: [
        { title: t('Stuck on top', 'Darübergeklebt'), text: t('Look closely. Is the code a sticker on top of something else? Anyone can do that.', 'Schauen Sie genau hin. Klebt der Code auf etwas anderem? Das kann jeder machen.') },
        { title: t('Read the address', 'Lesen Sie die Adresse'), text: t('Your phone shows the address before opening it. Does it really belong to the city?', 'Ihr Handy zeigt die Adresse vor dem Öffnen. Gehört sie wirklich zur Stadt?') },
        { title: t('Card details straight away', 'Sofort Kartendaten'), text: t('Pay at the machine, or with an app you already know.', 'Zahlen Sie am Automaten, oder mit einer App, die Sie schon kennen.') },
      ],
      advice: t('Do not enter anything. Pay at the machine, and tell the operator about the sticker.', 'Geben Sie nichts ein. Zahlen Sie am Automaten, und melden Sie den Aufkleber dem Betreiber.'),
    },
    code: {
      kind: 'chat',
      heading: t('Someone asks for your code', 'Jemand fragt nach Ihrem Code'),
      blocks: [
        { kind: 'label', sign: 1, text: t('Chat from a friend\'s account', 'Chat vom Konto einer Freundin') },
        { kind: 'body', sign: 2, text: t('"Sorry, a code was sent to you by mistake. Can you send it to me? It is urgent."', '„Entschuldige, dir wurde aus Versehen ein Code geschickt. Kannst du ihn mir schicken? Es ist dringend.“') },
        { kind: 'button', sign: 3, text: t('Your code: 482 913', 'Ihr Code: 482 913') },
      ],
      signs: [
        { title: t('The friend may be hacked', 'Die Freundin ist vielleicht gehackt'), text: t('A familiar name does not mean that your friend is writing.', 'Ein bekannter Name heißt nicht, dass Ihre Freundin schreibt.') },
        { title: t('"By mistake"', '„Aus Versehen“'), text: t('Codes are never sent to the wrong person by mistake. Someone is trying to log in as you.', 'Codes gehen nie aus Versehen an die falsche Person. Jemand versucht, sich als Sie anzumelden.') },
        { title: t('The code is the key', 'Der Code ist der Schlüssel'), text: t('Whoever has this code can take over your account.', 'Wer diesen Code hat, kann Ihr Konto übernehmen.') },
      ],
      advice: t('Never pass on a code, not to anyone. Call your friend on the phone to warn them.', 'Geben Sie einen Code nie weiter, an niemanden. Rufen Sie Ihre Freundin an, um sie zu warnen.'),
    },
    shop: {
      kind: 'shop',
      heading: t('A bargain in an online shop', 'Ein Schnäppchen in einem Online-Shop'),
      blocks: [
        { kind: 'label', sign: 1, text: 'bestpreis-elektro24.example' },
        { kind: 'title', sign: 2, text: t('E-bike, 75% off: only 499 euros instead of 1,999!', 'E-Bike, 75 % günstiger: nur 499 Euro statt 1.999!') },
        { kind: 'body', sign: 3, text: t('Only 2 left! Offer ends in 04:12.', 'Nur noch 2 Stück! Angebot endet in 04:12.') },
        { kind: 'body', sign: 4, text: t('Payment: bank transfer in advance only', 'Zahlung: nur Vorkasse per Überweisung') },
        { kind: 'small', sign: 5, text: t('Imprint: none. Contact: a form only.', 'Impressum: keines. Kontakt: nur ein Formular.') },
      ],
      signs: [
        { title: t('An odd address', 'Eine seltsame Adresse'), text: t('Long names with numbers are a warning. Search the name plus the word "experience" or "scam".', 'Lange Namen mit Zahlen sind eine Warnung. Suchen Sie den Namen zusammen mit „Erfahrungen“ oder „Betrug“.') },
        { title: t('Too cheap', 'Zu billig'), text: t('A huge discount on an expensive product is the classic bait.', 'Ein riesiger Rabatt auf ein teures Produkt ist der klassische Köder.') },
        { title: t('Pressure', 'Druck'), text: t('Fake stock counts and countdowns are meant to rush you.', 'Falsche Lagerzahlen und Countdowns sollen Sie hetzen.') },
        { title: t('Payment in advance only', 'Nur Vorkasse'), text: t('Once transferred, your money is usually gone. Prefer buying on account or a method with buyer protection.', 'Einmal überwiesen, ist Ihr Geld meist weg. Bevorzugen Sie Kauf auf Rechnung oder eine Zahlart mit Käuferschutz.') },
        { title: t('No imprint', 'Kein Impressum'), text: t('German shops must name a company, an address and contact details.', 'Deutsche Shops müssen Firma, Adresse und Kontaktdaten angeben.') },
      ],
      advice: t('Do not buy there. If you already paid, call your bank at once and report it to the police.', 'Kaufen Sie dort nicht. Haben Sie schon bezahlt, rufen Sie sofort Ihre Bank an und erstatten Sie Anzeige bei der Polizei.'),
    },
    attachment: {
      kind: 'file',
      heading: t('An email with an attachment', 'Eine E-Mail mit Anhang'),
      blocks: [
        { kind: 'label', text: 'Rechnungsstelle <invoice@rechnung-service.example>' },
        { kind: 'title', sign: 1, text: t('Final reminder: invoice unpaid', 'Letzte Mahnung: Rechnung offen') },
        { kind: 'body', sign: 2, text: t('You ordered goods worth 389.90 euros. See the attachment.', 'Sie haben Waren im Wert von 389,90 Euro bestellt. Siehe Anhang.') },
        { kind: 'button', sign: 3, text: 'Rechnung_2041.pdf.zip' },
      ],
      signs: [
        { title: t('A threat', 'Eine Drohung'), text: t('A "final reminder" without any earlier letter is meant to scare you.', 'Eine „letzte Mahnung“ ohne frühere Briefe soll Ihnen Angst machen.') },
        { title: t('Did you order this?', 'Haben Sie das bestellt?'), text: t('If you ordered nothing, you do not need to look inside.', 'Wenn Sie nichts bestellt haben, müssen Sie nicht hineinschauen.') },
        { title: t('A double ending', 'Eine doppelte Endung'), text: t('It looks like a PDF, but the last ending counts: .zip. It may contain a harmful program.', 'Es sieht aus wie ein PDF, aber die letzte Endung zählt: .zip. Darin kann ein Schadprogramm stecken.') },
      ],
      advice: t('Do not open it. Delete the email. Real reminders can also be checked with the shop, using your order confirmation.', 'Öffnen Sie sie nicht. Löschen Sie die E-Mail. Echte Mahnungen können Sie auch beim Shop prüfen, mit Ihrer Bestellbestätigung.'),
    },
  };
}

/** Adds examples and more steps to the older safety guides. */
export function enrichSafetyLessons(tutorials: Tutorial[], lang: Language): void {
  const en = lang === 'en';
  const t = (a: string, b: string) => (en ? a : b);
  const find = (id: string) => tutorials.find((x) => x.id === id);
  const shop = find('fake-shops-entlarven');
  if (shop && shop.steps.length === 1) {
    shop.steps.push(
      { stepNumber: 2, example: 'scam:shop', title: t('An example: find the 5 warning signs', 'Ein Beispiel: Finden Sie die 5 Warnzeichen'), lead: t('Tap each numbered mark.', 'Tippen Sie auf jede nummerierte Markierung.'), paragraphs: [t('This shop is invented, but real fake shops look just like it.', 'Dieser Shop ist erfunden, aber echte Fake-Shops sehen genauso aus.')] },
      { stepNumber: 3, title: t('Check before you pay', 'Prüfen Sie vor dem Bezahlen'), lead: t('Two minutes can save you a lot of money.', 'Zwei Minuten können viel Geld sparen.'), paragraphs: [t('Search the name of the shop together with "scam" or "experience".', 'Suchen Sie den Namen des Shops zusammen mit „Betrug“ oder „Erfahrungen“.'), t('In Germany, the consumer advice centres offer a "Fakeshop-Finder" to check shops.', 'In Deutschland bieten die Verbraucherzentralen einen „Fakeshop-Finder“ zum Prüfen an.')], warning: t('Already paid? Call your bank immediately and go to the police.', 'Schon bezahlt? Rufen Sie sofort Ihre Bank an und gehen Sie zur Polizei.') },
    );
  }
  const mail = find('e-mail-anhaenge-pruefen');
  if (mail && mail.steps.length === 1) {
    mail.steps.push(
      { stepNumber: 2, example: 'scam:attachment', title: t('An example: find the warning signs', 'Ein Beispiel: Finden Sie die Warnzeichen'), lead: t('Tap each numbered mark.', 'Tippen Sie auf jede nummerierte Markierung.'), paragraphs: [t('Reminders with attachments are a popular trick.', 'Mahnungen mit Anhang sind ein beliebter Trick.')] },
      { stepNumber: 3, title: t('If you opened it anyway', 'Wenn Sie ihn doch geöffnet haben'), lead: t('Stay calm and act step by step.', 'Bleiben Sie ruhig und gehen Sie Schritt für Schritt vor.'), paragraphs: [t('Disconnect from the internet and ask someone you trust or a repair shop for help.', 'Trennen Sie die Internetverbindung und holen Sie sich Hilfe bei einer Vertrauensperson oder Werkstatt.'), t('From another device, change important passwords, starting with your email.', 'Ändern Sie von einem anderen Gerät wichtige Passwörter, zuerst das Ihrer E-Mail.')] },
    );
  }
  const pass = find('passwoerter-erstellen');
  if (pass && pass.steps.length === 2) {
    pass.steps.push(
      { stepNumber: 3, title: t('Where to keep your passwords', 'Wo Sie Passwörter aufbewahren'), lead: t('A notebook at home is better than the same password everywhere.', 'Ein Notizbuch zu Hause ist besser als überall dasselbe Passwort.'), paragraphs: [t('Keep it safe and away from your computer, and do not label it "Passwords". It should never travel in your handbag.', 'Bewahren Sie es sicher und nicht beim Computer auf, und beschriften Sie es nicht mit „Passwörter“. Es gehört nicht in die Handtasche.'), t('A password manager is an app that remembers them all behind one strong password. Ask someone you trust to help set it up.', 'Ein Passwort-Manager ist eine App, die alle hinter einem starken Passwort speichert. Bitten Sie eine Vertrauensperson um Hilfe beim Einrichten.')] },
    );
  }
}

/** The new Digital Safety guides. */
export function safetyLessons(lang: Language): Tutorial[] {
  const en = lang === 'en';
  const t = (a: string, b: string) => (en ? a : b);
  const shared = { categoryId: 'sicherheit', categoryTitle: t('Digital Safety', 'Digitale Sicherheit'), difficulty: t('Easy', 'Einfach') as Tutorial['difficulty'], image: IMAGES.topicSafety };
  const tap = t('Tap each numbered mark to see why it is suspicious.', 'Tippen Sie auf jede nummerierte Markierung, um zu sehen, warum sie verdächtig ist.');
  return [
    {
      ...shared, id: 'safety-phishing-examples',
      title: t('Phishing Emails: 5 Examples to Practise On', 'Phishing-E-Mails: 5 Beispiele zum Üben'),
      description: t('Bank, parcel, tax office, subscription and a hacked friend. Find the warning signs yourself.', 'Bank, Paket, Finanzamt, Abo und ein gehackter Freund. Finden Sie die Warnzeichen selbst.'),
      durationMinutes: 12, tags: [t('Phishing', 'Phishing'), t('Email', 'E-Mail'), t('Examples', 'Beispiele')], isPopular: true,
      steps: [
        { stepNumber: 1, example: 'scam:bank', title: t('Example 1: The "bank"', 'Beispiel 1: Die „Bank“'), lead: tap, paragraphs: [t('The most common trick of all.', 'Der häufigste Trick überhaupt.')] },
        { stepNumber: 2, example: 'scam:parcel', title: t('Example 2: The parcel', 'Beispiel 2: Das Paket'), lead: tap, paragraphs: [t('It works so well because many of us are expecting a parcel.', 'Das klappt so gut, weil viele von uns gerade ein Paket erwarten.')] },
        { stepNumber: 3, example: 'scam:tax', title: t('Example 3: The tax refund', 'Beispiel 3: Die Steuererstattung'), lead: tap, paragraphs: [t('Good news can be a trap as well.', 'Auch gute Nachrichten können eine Falle sein.')] },
        { stepNumber: 4, example: 'scam:stream', title: t('Example 4: The subscription', 'Beispiel 4: Das Abo'), lead: tap, paragraphs: [t('Are you even a customer of this company?', 'Sind Sie überhaupt Kunde dieser Firma?')] },
        { stepNumber: 5, example: 'scam:friend', title: t('Example 5: The friend', 'Beispiel 5: Der Freund'), lead: tap, paragraphs: [t('Here the sender\'s address is even correct.', 'Hier stimmt sogar die Adresse des Absenders.')] },
        { stepNumber: 6, visualType: 'quiz', title: t('Test yourself', 'Testen Sie sich'), lead: t('Three questions on what you have just seen.', 'Drei Fragen zu dem, was Sie gerade gesehen haben.'), paragraphs: [t('You can change your answer at any time.', 'Sie können Ihre Antwort jederzeit ändern.')] },
      ],
      quiz: [
        { id: 'pe1', question: t('An email has no spelling mistakes. Is it therefore genuine?', 'Eine E-Mail hat keine Rechtschreibfehler. Ist sie deshalb echt?'), options: [t('Yes, scammers always make mistakes.', 'Ja, Betrüger machen immer Fehler.'), t('No. AI can write fake emails without mistakes.', 'Nein. KI schreibt gefälschte E-Mails auch fehlerfrei.')], correctIndex: 1, explanation: t('Right. Look at what the email wants from you, not only at the spelling.', 'Richtig. Achten Sie darauf, was die E-Mail von Ihnen will, nicht nur auf die Rechtschreibung.') },
        { id: 'pe2', question: t('Peter emails you: "Please send 400 euros, I cannot talk now." What do you do?', 'Peter schreibt: „Bitte schick 400 Euro, ich kann gerade nicht reden.“ Was tun Sie?'), options: [t('Send it, because it is his address.', 'Überweisen, denn es ist seine Adresse.'), t('Reply and ask if it is really him.', 'Antworten und fragen, ob er es wirklich ist.'), t('Call Peter on the number I already have.', 'Peter unter der Nummer anrufen, die ich schon habe.')], correctIndex: 2, explanation: t('Right. If his account was hacked, a reply goes straight to the criminal.', 'Richtig. Wurde sein Konto gehackt, geht eine Antwort direkt an den Täter.') },
        { id: 'pe3', question: t('What is the safest way to check a message from your bank?', 'Wie prüfen Sie eine Nachricht Ihrer Bank am sichersten?'), options: [t('Open my banking app myself, or call the number on my card.', 'Selbst die Banking-App öffnen, oder die Nummer auf meiner Karte anrufen.'), t('Tap the button in the email and look at the page.', 'Auf den Knopf in der E-Mail tippen und die Seite ansehen.')], correctIndex: 0, explanation: t('Right. Always take your own route, never the one in the message.', 'Richtig. Gehen Sie immer Ihren eigenen Weg, nie den aus der Nachricht.') },
      ],
    },
    {
      ...shared, id: 'safety-sms-scams',
      title: t('Fake Text Messages: Parcels and "Hi Mum"', 'Falsche Nachrichten: Pakete und „Hallo Mama“'),
      description: t('Two tricks that reach almost everyone. See them, and know what to do.', 'Zwei Tricks, die fast jeden erreichen. Erkennen Sie sie, und wissen Sie, was zu tun ist.'),
      durationMinutes: 7, tags: [t('SMS', 'SMS'), t('Chat', 'Chat'), t('Examples', 'Beispiele')],
      steps: [
        { stepNumber: 1, example: 'scam:sms-parcel', title: t('The parcel text', 'Die Paket-SMS'), lead: tap, paragraphs: [t('It arrives as an ordinary text message.', 'Sie kommt als gewöhnliche SMS.')] },
        { stepNumber: 2, example: 'scam:hi-mum', title: t('"Hi Mum, this is my new number"', '„Hallo Mama, das ist meine neue Nummer“'), lead: tap, paragraphs: [t('This one arrives on WhatsApp and other chat apps.', 'Diese kommt über WhatsApp und andere Chat-Apps.')] },
        { stepNumber: 3, visualType: 'quiz', title: t('Test yourself', 'Testen Sie sich'), lead: t('Two short questions.', 'Zwei kurze Fragen.'), paragraphs: [t('Mistakes are fine, and each answer is explained.', 'Fehler sind in Ordnung, und jede Antwort wird erklärt.')] },
      ],
      quiz: [
        { id: 'sm1', question: t('"Hi Mum, new number. Please send money." What is the best first step?', '„Hallo Mama, neue Nummer. Bitte schick Geld.“ Was ist der beste erste Schritt?'), options: [t('Call my child on the old number.', 'Mein Kind unter der alten Nummer anrufen.'), t('Save the new number.', 'Die neue Nummer speichern.')], correctIndex: 0, explanation: t('Right. A quick call clears it up.', 'Richtig. Ein kurzer Anruf klärt es.') },
        { id: 'sm2', question: t('You tapped a link in a text and installed an app. What now?', 'Sie haben auf einen Link getippt und eine App installiert. Was nun?'), options: [t('Wait and see.', 'Abwarten.'), t('Get help, call my bank, and change my passwords.', 'Hilfe holen, meine Bank anrufen und Passwörter ändern.')], correctIndex: 1, explanation: t('Right. Act quickly, and do not be ashamed. This happens to many people.', 'Richtig. Handeln Sie schnell, und schämen Sie sich nicht. Das passiert vielen.') },
      ],
    },
    {
      ...shared, id: 'safety-phone-scams',
      title: t('Scam Calls: Grandchild, Police and "Support"', 'Betrugsanrufe: Enkel, Polizei und „Support“'),
      description: t('Three stories that cost people their savings, and one simple answer: hang up.', 'Drei Geschichten, die Menschen ihre Ersparnisse kosten, und eine einfache Antwort: auflegen.'),
      durationMinutes: 9, tags: [t('Phone', 'Telefon'), t('Scam', 'Betrug'), t('Examples', 'Beispiele')],
      steps: [
        { stepNumber: 1, example: 'scam:grandchild', title: t('The grandchild trick', 'Der Enkeltrick'), lead: tap, paragraphs: [t('Anyone can fall for this, even very careful people.', 'Darauf kann jeder hereinfallen, auch sehr vorsichtige Menschen.')] },
        { stepNumber: 2, example: 'scam:police', title: t('The false police officer', 'Der falsche Polizist'), lead: tap, paragraphs: [t('The caller sounds calm, friendly and official.', 'Der Anrufer klingt ruhig, freundlich und amtlich.')] },
        { stepNumber: 3, example: 'scam:tech', title: t('The false support worker', 'Der falsche Support'), lead: tap, paragraphs: [t('The caller often claims to be from a famous software company.', 'Der Anrufer gibt sich oft als Mitarbeiter einer bekannten Softwarefirma aus.')] },
        { stepNumber: 4, title: t('Your answer to all of them', 'Ihre Antwort auf alle'), lead: t('You are allowed to hang up. It is not rude.', 'Sie dürfen auflegen. Das ist nicht unhöflich.'), paragraphs: [t('Then call back on a number you already know, and talk to someone you trust.', 'Rufen Sie dann unter einer Nummer zurück, die Sie schon kennen, und sprechen Sie mit einer Vertrauensperson.'), t('Do not put your name or address in the phone book if you do not have to.', 'Lassen Sie Namen und Adresse nicht im Telefonbuch stehen, wenn es nicht sein muss.')], warning: t('Never hand money or valuables to a stranger at your door.', 'Übergeben Sie nie Geld oder Wertsachen an Fremde an Ihrer Tür.') },
        { stepNumber: 5, visualType: 'quiz', title: t('Test yourself', 'Testen Sie sich'), lead: t('Two short questions.', 'Zwei kurze Fragen.'), paragraphs: [t('Each answer is explained.', 'Jede Antwort wird erklärt.')] },
      ],
      quiz: [
        { id: 'ph1', question: t('The display shows 110, and the caller says you are in danger. What do you do?', 'Das Display zeigt 110, und der Anrufer sagt, Sie seien in Gefahr. Was tun Sie?'), options: [t('Hang up and dial 110 myself.', 'Auflegen und selbst die 110 wählen.'), t('Believe it, because the number is right.', 'Glauben, denn die Nummer stimmt.')], correctIndex: 0, explanation: t('Right. Numbers on the display can be faked, and the real police do not call from 110.', 'Richtig. Display-Nummern lassen sich fälschen, und die echte Polizei ruft nicht von der 110 an.') },
        { id: 'ph2', question: t('"Support" says your computer has a virus and wants access. What do you do?', 'Der „Support“ sagt, Ihr Computer habe einen Virus, und will Zugriff. Was tun Sie?'), options: [t('Allow it, they want to help.', 'Erlauben, sie wollen ja helfen.'), t('Hang up.', 'Auflegen.')], correctIndex: 1, explanation: t('Right. These companies do not call you about viruses.', 'Richtig. Diese Firmen rufen nicht wegen Viren an.') },
      ],
    },
    {
      ...shared, id: 'safety-popups',
      title: t('Scary Pop-ups: "Your Computer Has a Virus"', 'Beängstigende Fenster: „Ihr Computer hat einen Virus“'),
      description: t('A loud warning fills the screen. It is almost always harmless, as long as you do not call or download.', 'Eine laute Warnung füllt den Bildschirm. Fast immer harmlos, solange Sie nicht anrufen oder etwas laden.'),
      durationMinutes: 4, tags: [t('Virus', 'Virus'), t('Browser', 'Browser'), t('Examples', 'Beispiele')],
      steps: [
        { stepNumber: 1, example: 'scam:popup', title: t('An example', 'Ein Beispiel'), lead: tap, paragraphs: [t('It may even play a siren.', 'Manchmal heult sogar eine Sirene.')] },
        { stepNumber: 2, title: t('How to get rid of it', 'Wie Sie es loswerden'), lead: t('Close the browser. That is usually all.', 'Schließen Sie den Browser. Das ist meist alles.'), paragraphs: [t('On a phone, close the browser app. On a computer, if nothing reacts, restart the device.', 'Am Handy schließen Sie die Browser-App. Am Computer starten Sie das Gerät neu, falls nichts reagiert.')], tip: t('When the browser asks whether to restore the last pages, say no.', 'Wenn der Browser fragt, ob er die letzten Seiten wiederherstellen soll, sagen Sie nein.') },
      ],
    },
    {
      ...shared, id: 'safety-qr',
      title: t('QR Codes: Look Before You Scan', 'QR-Codes: Erst schauen, dann scannen'),
      description: t('A sticker on a parking meter can lead to a fake payment page.', 'Ein Aufkleber auf der Parkuhr kann zu einer falschen Bezahlseite führen.'),
      durationMinutes: 4, tags: [t('QR code', 'QR-Code'), t('Payment', 'Bezahlen'), t('Examples', 'Beispiele')],
      steps: [
        { stepNumber: 1, title: t('What a QR code is', 'Was ein QR-Code ist'), lead: t('A square that hides a website address.', 'Ein Quadrat, das eine Website-Adresse verbirgt.'), paragraphs: [t('You cannot read where it leads until you scan it. Most QR codes are harmless, for example on a restaurant menu.', 'Wohin er führt, sehen Sie erst beim Scannen. Die meisten QR-Codes sind harmlos, zum Beispiel auf einer Speisekarte.')] },
        { stepNumber: 2, example: 'scam:qr', title: t('An example', 'Ein Beispiel'), lead: tap, paragraphs: [t('Fake codes also arrive by post, in letters that look official.', 'Falsche Codes kommen auch per Post, in Briefen, die amtlich aussehen.')] },
      ],
    },
    {
      ...shared, id: 'safety-2fa',
      title: t('The Second Lock: Codes and Two-Step Login', 'Das zweite Schloss: Codes und Anmeldung in zwei Schritten'),
      description: t('Why services send you a code, and the one rule that protects your accounts.', 'Warum Dienste Ihnen einen Code schicken, und die eine Regel, die Ihre Konten schützt.'),
      durationMinutes: 5, tags: [t('Login', 'Anmeldung'), t('Code', 'Code'), t('Examples', 'Beispiele')],
      steps: [
        { stepNumber: 1, title: t('Password plus code', 'Passwort plus Code'), lead: t('Like a door with two locks.', 'Wie eine Tür mit zwei Schlössern.'), paragraphs: [t('Even if someone has your password, they cannot log in without the code on your phone.', 'Selbst wenn jemand Ihr Passwort hat, kommt er ohne den Code auf Ihrem Handy nicht hinein.'), t('Switch it on at least for your email. You will find it in the account settings, under "Security".', 'Schalten Sie es mindestens für Ihre E-Mail ein. Sie finden es in den Kontoeinstellungen unter „Sicherheit“.')] },
        { stepNumber: 2, example: 'scam:code', title: t('The rule: never pass on a code', 'Die Regel: Geben Sie nie einen Code weiter'), lead: tap, paragraphs: [t('A code you did not request means someone is trying to get in.', 'Ein Code, den Sie nicht angefordert haben, bedeutet: Jemand versucht hineinzukommen.')], warning: t('If you get a code you did not ask for, ignore it and change your password.', 'Bekommen Sie einen Code, den Sie nicht angefordert haben, ignorieren Sie ihn und ändern Sie Ihr Passwort.') },
      ],
    },
    {
      ...shared, id: 'safety-updates',
      title: t('Updates: Why They Protect You', 'Updates: Warum sie Sie schützen'),
      description: t('That annoying message closes security holes. Here is how to stay up to date.', 'Diese lästige Meldung schließt Sicherheitslücken. So bleiben Sie auf dem neuesten Stand.'),
      durationMinutes: 4, tags: [t('Updates', 'Updates'), t('Phone', 'Handy')],
      steps: [
        { stepNumber: 1, title: t('What an update does', 'Was ein Update tut'), lead: t('It repairs weak spots that criminals look for.', 'Es repariert Schwachstellen, nach denen Kriminelle suchen.'), paragraphs: [t('Install updates for your phone and apps soon after they appear. Switch on automatic updates in the settings.', 'Installieren Sie Updates für Handy und Apps bald nach dem Erscheinen. Schalten Sie in den Einstellungen automatische Updates ein.')] },
        { stepNumber: 2, title: t('Where updates really come from', 'Woher Updates wirklich kommen'), lead: t('From your device settings or the app store.', 'Aus den Geräteeinstellungen oder dem App-Store.'), paragraphs: [t('A website or email telling you to install an "update" is a trick. Very old devices stop receiving updates, so ask a shop whether yours is still safe.', 'Eine Website oder E-Mail, die zu einem „Update“ auffordert, ist ein Trick. Sehr alte Geräte bekommen irgendwann keine Updates mehr. Fragen Sie im Fachgeschäft, ob Ihres noch sicher ist.')] },
      ],
    },
    {
      ...shared, id: 'safety-wifi',
      title: t('Free Wi-Fi: Safe on the Go', 'Kostenloses WLAN: Sicher unterwegs'),
      description: t('In the café or at the station: what you can do there, and what should wait until later.', 'Im Café oder am Bahnhof: Was Sie dort tun können, und was warten sollte.'),
      durationMinutes: 3, tags: [t('Wi-Fi', 'WLAN'), t('Travel', 'Reisen')],
      steps: [
        { stepNumber: 1, title: t('Check the name', 'Prüfen Sie den Namen'), lead: t('Ask the staff for the correct network name.', 'Fragen Sie das Personal nach dem richtigen Netzwerknamen.'), paragraphs: [t('Anyone can create a network called "Free Café Wi-Fi".', 'Jeder kann ein Netzwerk namens „Café WLAN gratis“ einrichten.')] },
        { stepNumber: 2, title: t('Save banking for later', 'Banking für später aufheben'), lead: t('Reading the news is fine. Banking can wait, or use mobile data.', 'Nachrichten lesen ist in Ordnung. Banking kann warten, oder nutzen Sie mobile Daten.'), paragraphs: [t('Do not enter a password on a pop-up page that appears after connecting, and never your email password.', 'Geben Sie auf einer Seite, die nach dem Verbinden erscheint, kein Passwort ein, schon gar nicht Ihr E-Mail-Passwort.')] },
      ],
    },
    {
      ...shared, id: 'safety-lost-phone',
      title: t('Phone Lost or Stolen: What to Do', 'Handy verloren oder gestohlen: Was tun?'),
      description: t('Stay calm. Here are the steps, in order. Best read before it happens.', 'Bleiben Sie ruhig. Hier sind die Schritte der Reihe nach. Am besten lesen, bevor es passiert.'),
      durationMinutes: 4, tags: [t('Phone', 'Handy'), t('Emergency', 'Notfall')],
      steps: [
        { stepNumber: 1, title: t('Prepare now', 'Jetzt vorbereiten'), lead: t('A screen lock is the most important protection.', 'Eine Bildschirmsperre ist der wichtigste Schutz.'), paragraphs: [t('Switch on "Find My iPhone" or "Find My Device". Write down the phone\'s IMEI number, which you get by dialling *#06#.', 'Schalten Sie „Wo ist?“ oder „Mein Gerät finden“ ein. Notieren Sie die IMEI-Nummer des Handys. Sie erscheint, wenn Sie *#06# wählen.')] },
        { stepNumber: 2, title: t('If it is gone', 'Wenn es weg ist'), lead: t('Locate it, block the SIM card, and warn your bank.', 'Orten, SIM-Karte sperren, Bank warnen.'), paragraphs: [t('Try locating it from another device. Call your phone provider to block the SIM. Call your bank if banking apps are on it. If it was stolen, report it to the police.', 'Versuchen Sie, es von einem anderen Gerät zu orten. Rufen Sie Ihren Anbieter an, um die SIM zu sperren. Rufen Sie Ihre Bank an, wenn Banking-Apps darauf sind. Wurde es gestohlen, erstatten Sie Anzeige.')], tip: t('The German hotline 116 116 can also help block cards.', 'Der Sperr-Notruf 116 116 hilft auch beim Sperren von Karten.') },
        { stepNumber: 3, title: t('Afterwards', 'Danach'), lead: t('Change important passwords.', 'Ändern Sie wichtige Passwörter.'), paragraphs: [t('Start with your email. Tell family that messages from your number may not be from you.', 'Beginnen Sie mit Ihrer E-Mail. Sagen Sie der Familie, dass Nachrichten von Ihrer Nummer vielleicht nicht von Ihnen sind.')] },
      ],
    },
    {
      ...shared, id: 'safety-what-if',
      title: t('I Fell for a Scam. What Now?', 'Ich bin auf Betrug hereingefallen. Was nun?'),
      description: t('It can happen to anyone. Here is a calm plan, step by step.', 'Das kann jedem passieren. Hier ist ein ruhiger Plan, Schritt für Schritt.'),
      durationMinutes: 5, tags: [t('Emergency', 'Notfall'), t('Scam', 'Betrug')],
      steps: [
        { stepNumber: 1, title: t('It is not your fault', 'Es ist nicht Ihre Schuld'), lead: t('Criminals do this for a living. Being quick matters more than being embarrassed.', 'Kriminelle machen das beruflich. Schnelligkeit ist wichtiger als Scham.'), paragraphs: [t('Tell someone you trust. They can help you stay calm and make the calls with you.', 'Sagen Sie es einer Vertrauensperson. Sie kann Ihnen helfen, ruhig zu bleiben, und mit Ihnen telefonieren.')] },
        { stepNumber: 2, title: t('Protect your money', 'Schützen Sie Ihr Geld'), lead: t('Call your bank straight away.', 'Rufen Sie sofort Ihre Bank an.'), paragraphs: [t('Use the number on your bank card, or the German blocking hotline 116 116. Ask whether a transfer can still be stopped.', 'Nutzen Sie die Nummer auf Ihrer Bankkarte oder den Sperr-Notruf 116 116. Fragen Sie, ob sich eine Überweisung noch stoppen lässt.')] },
        { stepNumber: 3, title: t('Protect your accounts', 'Schützen Sie Ihre Konten'), lead: t('Change the password that was given away.', 'Ändern Sie das verratene Passwort.'), paragraphs: [t('Change it everywhere you use it, starting with your email. If you allowed remote access, have the device checked.', 'Ändern Sie es überall, wo Sie es nutzen, zuerst bei Ihrer E-Mail. Haben Sie Fernzugriff erlaubt, lassen Sie das Gerät prüfen.')] },
        { stepNumber: 4, title: t('Report it', 'Melden Sie es'), lead: t('Go to the police, even for small amounts.', 'Gehen Sie zur Polizei, auch bei kleinen Beträgen.'), paragraphs: [t('Bring screenshots, emails and account details. Many German federal states also offer an online police station. Consumer advice centres can advise you too.', 'Bringen Sie Screenshots, E-Mails und Kontodaten mit. Viele Bundesländer bieten auch eine Online-Wache an. Auch Verbraucherzentralen beraten Sie.')], warning: t('Be careful of people who offer to get your money back for a fee. That is often the next scam.', 'Vorsicht bei Menschen, die Ihr Geld gegen Gebühr zurückholen wollen. Das ist oft der nächste Betrug.') },
      ],
    },
  ];
}

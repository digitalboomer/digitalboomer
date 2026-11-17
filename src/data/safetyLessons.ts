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
  const shared = { categoryId: 'sicherheit', categoryTitle: t('Digital safety', 'Digitale Sicherheit'), difficulty: t('Easy', 'Einfach') as Tutorial['difficulty'], image: IMAGES.topicSafety };
  const tap = t('Tap each numbered mark to see why it is suspicious.', 'Tippen Sie auf jede nummerierte Markierung, um zu sehen, warum sie verdächtig ist.');
  return [
    {
      ...shared, id: 'safety-phishing-examples',
      title: t('Phishing Emails: 5 Examples to Practise On', 'Phishing-E-Mails: 5 Beispiele zum Üben'),
      description: t('Bank, parcel, tax office, subscription and a hacked friend. Find the warning signs yourself.', 'Bank, Paket, Finanzamt, Abo und ein gehackter Freund. Finden Sie die Warnzeichen selbst.'),
      durationMinutes: 14, tags: [t('Phishing', 'Phishing'), t('Email', 'E-Mail'), t('Examples', 'Beispiele')], isPopular: true,
      steps: [
        { stepNumber: 1, example: 'scam:bank', title: t('Example 1: The "bank"', 'Beispiel 1: Die „Bank“'), lead: tap, paragraphs: [t('The most common trick of all.', 'Der häufigste Trick überhaupt.'), t('The email looks like it comes from your bank and says your account is in danger. The aim is to make you enter your login details on a copied page.', 'Die E-Mail sieht aus, als käme sie von Ihrer Bank, und sagt, Ihr Konto sei in Gefahr. Ziel ist, dass Sie Ihre Zugangsdaten auf einer kopierten Seite eingeben.')] },
        { stepNumber: 2, example: 'scam:parcel', title: t('Example 2: The parcel', 'Beispiel 2: Das Paket'), lead: tap, paragraphs: [t('It works so well because many of us are expecting a parcel.', 'Das klappt so gut, weil viele von uns gerade ein Paket erwarten.'), t('Real delivery companies tell you about customs fees in their own app or on a card in your letterbox. They do not ask for card details by email.', 'Echte Lieferdienste melden Zollgebühren in ihrer eigenen App oder mit einer Karte im Briefkasten. Sie fragen nicht per E-Mail nach Kartendaten.')] },
        { stepNumber: 3, example: 'scam:tax', title: t('Example 3: The tax refund', 'Beispiel 3: Die Steuererstattung'), lead: tap, paragraphs: [t('Good news can be a trap as well.', 'Auch gute Nachrichten können eine Falle sein.'), t('When money is promised, we want to act quickly. That is exactly why criminals offer refunds, prizes and gifts.', 'Wenn Geld versprochen wird, wollen wir schnell handeln. Genau deshalb bieten Kriminelle Erstattungen, Gewinne und Geschenke an.')] },
        { stepNumber: 4, example: 'scam:stream', title: t('Example 4: The subscription', 'Beispiel 4: Das Abo'), lead: tap, paragraphs: [t('Are you even a customer of this company?', 'Sind Sie überhaupt Kunde dieser Firma?'), t('Fake emails about streaming, phone contracts or online shops go out to thousands of people. Some of them happen to be customers, and those are the ones who click.', 'Falsche E-Mails zu Streaming, Handyverträgen oder Online-Shops gehen an Tausende. Einige davon sind zufällig Kunden, und genau die klicken.')] },
        { stepNumber: 5, example: 'scam:friend', title: t('Example 5: The friend', 'Beispiel 5: Der Freund'), lead: tap, paragraphs: [t('Here the sender\'s address is even correct.', 'Hier stimmt sogar die Adresse des Absenders.'), t('When an email account is hacked, criminals write to everyone in its address book. So a familiar name alone is no proof.', 'Wird ein E-Mail-Konto gehackt, schreiben Kriminelle an alle im Adressbuch. Ein bekannter Name allein ist also kein Beweis.')] },
        { stepNumber: 6, title: t('What to do with a suspicious email', 'Was Sie mit einer verdächtigen E-Mail tun'), lead: t('Do not reply, do not click, do not open attachments.', 'Nicht antworten, nicht klicken, keine Anhänge öffnen.'), paragraphs: [t('Mark the email as spam or junk, then delete it. This also helps your email service recognise similar emails.', 'Markieren Sie die E-Mail als Spam oder Junk, und löschen Sie sie dann. Das hilft Ihrem E-Mail-Dienst auch, ähnliche E-Mails zu erkennen.'), t('If you are worried, check in your own way: open the app, or call the number you already know.', 'Wenn Sie besorgt sind, prüfen Sie es auf Ihrem eigenen Weg: Öffnen Sie die App, oder rufen Sie die Nummer an, die Sie schon kennen.'), t('Already clicked or typed something in? Change that password straight away, and call your bank if it was about money.', 'Schon geklickt oder etwas eingegeben? Ändern Sie sofort dieses Passwort, und rufen Sie Ihre Bank an, wenn es um Geld ging.')], tip: t('Opening and reading an email is usually harmless. The danger lies in links, attachments and what you type in.', 'Eine E-Mail zu öffnen und zu lesen, ist meist harmlos. Die Gefahr liegt in Links, Anhängen und dem, was Sie eingeben.') },
        { stepNumber: 7, visualType: 'quiz', title: t('Test yourself', 'Testen Sie sich'), lead: t('Three questions on what you have just seen.', 'Drei Fragen zu dem, was Sie gerade gesehen haben.'), paragraphs: [t('You can change your answer at any time.', 'Sie können Ihre Antwort jederzeit ändern.')] },
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
      durationMinutes: 8, tags: [t('SMS', 'SMS'), t('Chat', 'Chat'), t('Examples', 'Beispiele')],
      steps: [
        { stepNumber: 1, example: 'scam:sms-parcel', title: t('The parcel text', 'Die Paket-SMS'), lead: tap, paragraphs: [t('It arrives as an ordinary text message.', 'Sie kommt als gewöhnliche SMS.'), t('The link often leads to a page that asks for card details, or it tries to install an app. On Android phones such an app can read your messages and codes.', 'Der Link führt oft zu einer Seite, die nach Kartendaten fragt, oder er will eine App installieren. Auf Android-Handys kann so eine App Ihre Nachrichten und Codes mitlesen.')] },
        { stepNumber: 2, example: 'scam:hi-mum', title: t('"Hi Mum, this is my new number"', '„Hallo Mama, das ist meine neue Nummer“'), lead: tap, paragraphs: [t('This one arrives on WhatsApp and other chat apps.', 'Diese kommt über WhatsApp und andere Chat-Apps.'), t('The criminals chat for a while first, so it feels real. Only then do they ask for money, usually for a bill that has to be paid today.', 'Die Kriminellen schreiben erst eine Weile, damit es echt wirkt. Erst dann bitten sie um Geld, meist für eine Rechnung, die heute bezahlt werden muss.')] },
        { stepNumber: 3, title: t('What to do with such messages', 'Was Sie mit solchen Nachrichten tun'), lead: t('Do not reply and do not tap the link.', 'Antworten Sie nicht, und tippen Sie nicht auf den Link.'), paragraphs: [t('Even a reply like "Stop" tells the senders that your number is in use. Then you get more messages.', 'Selbst eine Antwort wie „Stopp“ verrät den Absendern, dass Ihre Nummer benutzt wird. Dann bekommen Sie mehr Nachrichten.'), t('Block the number and delete the message. In WhatsApp, you can also tap "Report" on a message from an unknown number.', 'Blockieren Sie die Nummer, und löschen Sie die Nachricht. In WhatsApp können Sie bei einer unbekannten Nummer auch auf „Melden“ tippen.'), t('Tell your family about these tricks. A short warning can protect your friends too.', 'Erzählen Sie Ihrer Familie von diesen Tricks. Eine kurze Warnung kann auch Ihre Freunde schützen.')], tip: t('Agree with your children: a new number is only real after a short phone call.', 'Vereinbaren Sie mit Ihren Kindern: Eine neue Nummer gilt erst nach einem kurzen Anruf.') },
        { stepNumber: 4, visualType: 'quiz', title: t('Test yourself', 'Testen Sie sich'), lead: t('Two short questions.', 'Zwei kurze Fragen.'), paragraphs: [t('Mistakes are fine, and each answer is explained.', 'Fehler sind in Ordnung, und jede Antwort wird erklärt.')] },
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
      durationMinutes: 10, tags: [t('Phone', 'Telefon'), t('Scam', 'Betrug'), t('Examples', 'Beispiele')],
      steps: [
        { stepNumber: 1, example: 'scam:grandchild', title: t('The grandchild trick', 'Der Enkeltrick'), lead: tap, paragraphs: [t('Anyone can fall for this, even very careful people.', 'Darauf kann jeder hereinfallen, auch sehr vorsichtige Menschen.'), t('The callers are trained. They speak quickly, sound upset and never give you a quiet moment to think.', 'Die Anrufer sind geschult. Sie sprechen schnell, klingen aufgeregt und lassen Ihnen keinen ruhigen Moment zum Nachdenken.')] },
        { stepNumber: 2, example: 'scam:police', title: t('The false police officer', 'Der falsche Polizist'), lead: tap, paragraphs: [t('The caller sounds calm, friendly and official.', 'Der Anrufer klingt ruhig, freundlich und amtlich.'), t('Often several "officers" take turns on the phone, and the call lasts for hours. They may also tell you not to talk to your bank, because "the bank is involved".', 'Oft wechseln sich mehrere „Beamte“ am Telefon ab, und der Anruf dauert Stunden. Vielleicht sagen sie auch, Sie sollen nicht mit Ihrer Bank sprechen, weil „die Bank mit drinsteckt“.')] },
        { stepNumber: 3, example: 'scam:tech', title: t('The false support worker', 'Der falsche Support'), lead: tap, paragraphs: [t('The caller often claims to be from a famous software company.', 'Der Anrufer gibt sich oft als Mitarbeiter einer bekannten Softwarefirma aus.'), t('They often speak English or broken German and sound very technical. That is meant to make you feel you cannot judge it yourself.', 'Oft sprechen sie Englisch oder gebrochenes Deutsch und klingen sehr technisch. Sie sollen das Gefühl bekommen, es selbst nicht beurteilen zu können.')] },
        { stepNumber: 4, title: t('Your answer to all of them', 'Ihre Antwort auf alle'), lead: t('You are allowed to hang up. It is not rude.', 'Sie dürfen auflegen. Das ist nicht unhöflich.'), paragraphs: [t('Then call back on a number you already know, and talk to someone you trust.', 'Rufen Sie dann unter einer Nummer zurück, die Sie schon kennen, und sprechen Sie mit einer Vertrauensperson.'), t('Before you call back, wait a moment or use another phone. Some criminals stay on the line and pretend to be the person you are calling.', 'Warten Sie vor dem Rückruf einen Moment, oder nutzen Sie ein anderes Telefon. Manche Kriminelle bleiben in der Leitung und geben sich als die angerufene Person aus.'), t('Do not put your name or address in the phone book if you do not have to.', 'Lassen Sie Namen und Adresse nicht im Telefonbuch stehen, wenn es nicht sein muss.')], warning: t('Never hand money or valuables to a stranger at your door.', 'Übergeben Sie nie Geld oder Wertsachen an Fremde an Ihrer Tür.') },
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
      durationMinutes: 5, tags: [t('Virus', 'Virus'), t('Browser', 'Browser'), t('Examples', 'Beispiele')],
      steps: [
        { stepNumber: 1, example: 'scam:popup', title: t('An example', 'Ein Beispiel'), lead: tap, paragraphs: [t('It may even play a siren.', 'Manchmal heult sogar eine Sirene.'), t('Such windows often appear after a mistyped address or a click on an advert. They are only a website that pretends to be a warning from your computer.', 'Solche Fenster erscheinen oft nach einer vertippten Adresse oder einem Klick auf Werbung. Sie sind nur eine Website, die sich als Warnung Ihres Computers ausgibt.')] },
        { stepNumber: 2, title: t('How to get rid of it', 'Wie Sie es loswerden'), lead: t('Close the browser. That is usually all.', 'Schließen Sie den Browser. Das ist meist alles.'), paragraphs: [t('On a phone, close the browser app. On a computer, click the X at the top right of the browser window.', 'Am Handy schließen Sie die Browser-App. Am Computer klicken Sie oben rechts im Browserfenster auf das X.'), t('If nothing reacts, restart the device. Your files are not deleted by this.', 'Reagiert nichts, starten Sie das Gerät neu. Ihre Dateien werden dadurch nicht gelöscht.')], tip: t('When the browser asks whether to restore the last pages, say no.', 'Wenn der Browser fragt, ob er die letzten Seiten wiederherstellen soll, sagen Sie nein.') },
        { stepNumber: 3, title: t('If you already called or downloaded something', 'Wenn Sie schon angerufen oder etwas geladen haben'), lead: t('Act now, calmly and step by step.', 'Handeln Sie jetzt, ruhig und Schritt für Schritt.'), paragraphs: [t('If you are still on the phone, hang up. Do not pay anything and do not give anyone access to your computer.', 'Sind Sie noch am Telefon, legen Sie auf. Zahlen Sie nichts, und geben Sie niemandem Zugriff auf Ihren Computer.'), t('If you allowed access, switch the computer off. Ask someone you trust or a repair shop to check it.', 'Haben Sie Zugriff erlaubt, schalten Sie den Computer aus. Bitten Sie eine Vertrauensperson oder eine Werkstatt, ihn zu prüfen.'), t('From another device, change your important passwords. If you paid or did banking during the call, call your bank.', 'Ändern Sie von einem anderen Gerät Ihre wichtigen Passwörter. Haben Sie während des Anrufs gezahlt oder Banking gemacht, rufen Sie Ihre Bank an.')] },
      ],
    },
    {
      ...shared, id: 'safety-fake-websites',
      title: t('Fake Websites: Check the Address Before You Type', 'Falsche Websites: Erst die Adresse prüfen, dann tippen'),
      description: t('Copied pages look just like your bank or a shop. The address shows who is really behind them.', 'Kopierte Seiten sehen aus wie Ihre Bank oder ein Shop. Die Adresse zeigt, wer wirklich dahintersteckt.'),
      durationMinutes: 6, tags: [t('Websites', 'Websites'), t('Browser', 'Browser'), t('Safety', 'Sicherheit')],
      steps: [
        { stepNumber: 1, title: t('Read the address', 'Lesen Sie die Adresse'), lead: t('The address is at the top of the browser, above the page.', 'Die Adresse steht oben im Browser, über der Seite.'), paragraphs: [t('A copied page can look exactly like the real one. Pictures and logos are easy to copy, but the address is not.', 'Eine kopierte Seite kann genauso aussehen wie die echte. Bilder und Logos lassen sich leicht kopieren, die Adresse nicht.'), t('Look at the part just before the first single slash "/". The words right before ".de" or ".com" name the real owner.', 'Schauen Sie auf den Teil kurz vor dem ersten einzelnen Schrägstrich „/“. Die Wörter direkt vor „.de“ oder „.com“ nennen den echten Inhaber.'), t('Example: "musterbank.de/login" belongs to Musterbank. "musterbank.de.login-check.example/" belongs to someone else, even though "musterbank" appears in it.', 'Beispiel: „musterbank.de/login“ gehört der Musterbank. „musterbank.de.login-check.example/“ gehört jemand anderem, obwohl „musterbank“ darin vorkommt.')], tip: t('On a phone, tap the address bar to see the full address.', 'Am Handy tippen Sie auf die Adressleiste, um die ganze Adresse zu sehen.') },
        { stepNumber: 2, title: t('The lock symbol is not a seal of approval', 'Das Schloss ist kein Gütesiegel'), lead: t('It only means that the connection is encrypted.', 'Es bedeutet nur, dass die Verbindung verschlüsselt ist.'), paragraphs: [t('Many browsers show a small lock or a settings symbol next to the address. It shows that nobody can listen in on the way.', 'Viele Browser zeigen ein kleines Schloss oder ein Einstellungssymbol neben der Adresse. Es zeigt, dass unterwegs niemand mitlesen kann.'), t('It does not show who runs the page. Fake pages have a lock too.', 'Es zeigt nicht, wer die Seite betreibt. Auch falsche Seiten haben ein Schloss.')] },
        { stepNumber: 3, title: t('Take your own way in', 'Gehen Sie Ihren eigenen Weg'), lead: t('Use a bookmark, the app, or type the address yourself.', 'Nutzen Sie ein Lesezeichen, die App, oder tippen Sie die Adresse selbst.'), paragraphs: [t('For your bank, email and shops you use often, save a bookmark once. Then you always land on the right page.', 'Speichern Sie für Bank, E-Mail und Shops, die Sie oft nutzen, einmal ein Lesezeichen. Dann landen Sie immer auf der richtigen Seite.'), t('Be careful with search results marked "Sponsored" or "Ad". Criminals sometimes pay for adverts that lead to fake bank pages.', 'Vorsicht bei Suchergebnissen mit dem Hinweis „Gesponsert“ oder „Anzeige“. Kriminelle bezahlen manchmal Werbung, die zu falschen Bankseiten führt.'), t('Links in emails and text messages are the most common way to fake pages. Do not use them for logging in.', 'Links in E-Mails und SMS sind der häufigste Weg zu falschen Seiten. Nutzen Sie sie nicht zum Anmelden.')] },
        { stepNumber: 4, title: t('Already typed something in?', 'Schon etwas eingegeben?'), lead: t('Act quickly. It is not too late.', 'Handeln Sie schnell. Es ist nicht zu spät.'), paragraphs: [t('Change the password on the real website or in the real app straight away, and everywhere you use the same one.', 'Ändern Sie das Passwort sofort auf der echten Website oder in der echten App, und überall, wo Sie dasselbe nutzen.'), t('If you entered bank or card details, call your bank or the blocking hotline 116 116.', 'Haben Sie Bank- oder Kartendaten eingegeben, rufen Sie Ihre Bank oder den Sperr-Notruf 116 116 an.')], warning: t('Your bank never asks you to log in through a link in an email or text message.', 'Ihre Bank bittet Sie nie, sich über einen Link in einer E-Mail oder SMS anzumelden.') },
      ],
    },
    {
      ...shared, id: 'safety-qr',
      title: t('QR Codes: Look Before You Scan', 'QR-Codes: Erst schauen, dann scannen'),
      description: t('A sticker on a parking meter can lead to a fake payment page.', 'Ein Aufkleber auf der Parkuhr kann zu einer falschen Bezahlseite führen.'),
      durationMinutes: 5, tags: [t('QR code', 'QR-Code'), t('Payment', 'Bezahlen'), t('Examples', 'Beispiele')],
      steps: [
        { stepNumber: 1, title: t('What a QR code is', 'Was ein QR-Code ist'), lead: t('A square that hides a website address.', 'Ein Quadrat, das eine Website-Adresse verbirgt.'), paragraphs: [t('You cannot read where it leads until you scan it. Most QR codes are harmless, for example on a restaurant menu.', 'Wohin er führt, sehen Sie erst beim Scannen. Die meisten QR-Codes sind harmlos, zum Beispiel auf einer Speisekarte.'), t('To scan one, open the camera app and hold the phone over the code. A short address appears on the screen. Only when you tap it does the page open.', 'Zum Scannen öffnen Sie die Kamera-App und halten das Handy über den Code. Eine kurze Adresse erscheint auf dem Bildschirm. Erst wenn Sie darauf tippen, öffnet sich die Seite.')] },
        { stepNumber: 2, example: 'scam:qr', title: t('An example', 'Ein Beispiel'), lead: tap, paragraphs: [t('Fake codes also arrive by post, in letters that look official.', 'Falsche Codes kommen auch per Post, in Briefen, die amtlich aussehen.'), t('Some letters claim to come from your bank and ask you to "confirm" your details by scanning. Your bank does not do that.', 'Manche Briefe behaupten, von Ihrer Bank zu kommen, und bitten Sie, Ihre Daten per Scan zu „bestätigen“. Das macht Ihre Bank nicht.')] },
        { stepNumber: 3, title: t('Scanning safely', 'Sicher scannen'), lead: t('Read the address before you tap it.', 'Lesen Sie die Adresse, bevor Sie darauf tippen.'), paragraphs: [t('Does the address belong to the restaurant, the city or the company that put up the code? If not, do not open it.', 'Gehört die Adresse zum Restaurant, zur Stadt oder zur Firma, die den Code aufgehängt hat? Wenn nicht, öffnen Sie sie nicht.'), t('If a code asks you to pay, log in or install an app, take your own way instead: the official app, the machine, or the website you type yourself.', 'Will ein Code, dass Sie zahlen, sich anmelden oder eine App installieren, gehen Sie lieber Ihren eigenen Weg: die offizielle App, den Automaten oder die Website, die Sie selbst eintippen.')], tip: t('Not sure? Ask at the counter or call the number you know.', 'Unsicher? Fragen Sie am Schalter, oder rufen Sie die Nummer an, die Sie kennen.') },
      ],
    },
    {
      ...shared, id: 'safety-2fa',
      title: t('The Second Lock: Codes and Two-Step Login', 'Das zweite Schloss: Codes und Anmeldung in zwei Schritten'),
      description: t('Why services send you a code, and the one rule that protects your accounts.', 'Warum Dienste Ihnen einen Code schicken, und die eine Regel, die Ihre Konten schützt.'),
      durationMinutes: 7, tags: [t('Login', 'Anmeldung'), t('Code', 'Code'), t('Examples', 'Beispiele')],
      steps: [
        { stepNumber: 1, title: t('Password plus code', 'Passwort plus Code'), lead: t('Like a door with two locks.', 'Wie eine Tür mit zwei Schlössern.'), paragraphs: [t('Even if someone has your password, they cannot log in without the code on your phone.', 'Selbst wenn jemand Ihr Passwort hat, kommt er ohne den Code auf Ihrem Handy nicht hinein.'), t('The second lock can be a code in a text message, a code in a special app, or a question on your phone such as "Is this you trying to log in?".', 'Das zweite Schloss kann ein Code per SMS sein, ein Code in einer besonderen App, oder eine Frage auf Ihrem Handy wie „Versuchen Sie gerade, sich anzumelden?“.'), t('Your bank already works this way: you approve payments in an app or with a code.', 'Ihre Bank arbeitet schon so: Sie geben Zahlungen in einer App oder mit einem Code frei.')] },
        { stepNumber: 2, example: 'scam:code', title: t('The rule: never pass on a code', 'Die Regel: Geben Sie nie einen Code weiter'), lead: tap, paragraphs: [t('A code you did not request means someone is trying to get in.', 'Ein Code, den Sie nicht angefordert haben, bedeutet: Jemand versucht hineinzukommen.'), t('The same goes for a question on your phone that you did not expect. Tap "No" or "Deny", never "Yes".', 'Dasselbe gilt für eine Frage auf Ihrem Handy, die Sie nicht erwartet haben. Tippen Sie auf „Nein“ oder „Ablehnen“, nie auf „Ja“.')], warning: t('If you get a code you did not ask for, ignore it and change your password.', 'Bekommen Sie einen Code, den Sie nicht angefordert haben, ignorieren Sie ihn und ändern Sie Ihr Passwort.') },
        { stepNumber: 3, title: t('Switch it on', 'So schalten Sie es ein'), lead: t('Start with your email account. It is the key to all the others.', 'Beginnen Sie mit Ihrem E-Mail-Konto. Es ist der Schlüssel zu allen anderen.'), paragraphs: [t('Open the account settings and look for "Security", then for "Two-step verification" or "2-step login". The service guides you through it.', 'Öffnen Sie die Kontoeinstellungen, und suchen Sie „Sicherheit“, dann „Bestätigung in zwei Schritten“ oder „Zwei-Faktor“. Der Dienst führt Sie hindurch.'), t('Many services give you backup codes. Write them down and keep them at home, for the day your phone is lost.', 'Viele Dienste geben Ihnen Ersatzcodes. Schreiben Sie sie auf und bewahren Sie sie zu Hause auf, für den Tag, an dem Ihr Handy verloren geht.')], tip: t('Getting a new phone? Move your codes to it before you reset the old one.', 'Bekommen Sie ein neues Handy? Übertragen Sie Ihre Codes darauf, bevor Sie das alte zurücksetzen.') },
      ],
    },
    {
      ...shared, id: 'safety-updates',
      title: t('Updates: Why They Protect You', 'Updates: Warum sie Sie schützen'),
      description: t('That annoying message closes security holes. Here is how to stay up to date.', 'Diese lästige Meldung schließt Sicherheitslücken. So bleiben Sie auf dem neuesten Stand.'),
      durationMinutes: 5, tags: [t('Updates', 'Updates'), t('Phone', 'Handy')],
      steps: [
        { stepNumber: 1, title: t('What an update does', 'Was ein Update tut'), lead: t('It repairs weak spots that criminals look for.', 'Es repariert Schwachstellen, nach denen Kriminelle suchen.'), paragraphs: [t('Software is never perfect. When a weak spot becomes known, the maker repairs it and sends out an update.', 'Software ist nie perfekt. Wird eine Schwachstelle bekannt, repariert der Hersteller sie und verschickt ein Update.'), t('Install updates for your phone and apps soon after they appear. Switch on automatic updates in the settings.', 'Installieren Sie Updates für Handy und Apps bald nach dem Erscheinen. Schalten Sie in den Einstellungen automatische Updates ein.')] },
        { stepNumber: 2, title: t('Where updates really come from', 'Woher Updates wirklich kommen'), lead: t('From your device settings or the app store.', 'Aus den Geräteeinstellungen oder dem App-Store.'), paragraphs: [t('On an iPhone: Settings, General, Software Update. On Android phones: Settings, System or Software update. App updates come from the App Store or the Google Play Store.', 'Am iPhone: Einstellungen, Allgemein, Softwareupdate. Bei Android-Handys: Einstellungen, System oder Software-Update. App-Updates kommen aus dem App Store oder dem Google Play Store.'), t('A website or email telling you to install an "update" is a trick. Very old devices stop receiving updates, so ask a shop whether yours is still safe.', 'Eine Website oder E-Mail, die zu einem „Update“ auffordert, ist ein Trick. Sehr alte Geräte bekommen irgendwann keine Updates mehr. Fragen Sie im Fachgeschäft, ob Ihres noch sicher ist.')] },
        { stepNumber: 3, title: t('Installing an update calmly', 'Ein Update in Ruhe installieren'), lead: t('Choose a quiet moment, for example in the evening.', 'Wählen Sie einen ruhigen Moment, zum Beispiel am Abend.'), paragraphs: [t('Connect to your home Wi-Fi and charge the battery, or plug the phone in.', 'Verbinden Sie sich mit Ihrem WLAN zu Hause, und laden Sie den Akku, oder stecken Sie das Handy an.'), t('A large update can take half an hour. The phone restarts on its own and may show a black screen for a while. That is normal.', 'Ein großes Update kann eine halbe Stunde dauern. Das Handy startet von selbst neu und zeigt vielleicht eine Weile einen schwarzen Bildschirm. Das ist normal.'), t('Your photos, contacts and messages stay where they are.', 'Ihre Fotos, Kontakte und Nachrichten bleiben, wo sie sind.')], tip: t('Afterwards, some buttons may look a little different. Take your time to find them again.', 'Danach sehen manche Knöpfe vielleicht etwas anders aus. Nehmen Sie sich Zeit, sie wiederzufinden.') },
      ],
    },
    {
      ...shared, id: 'safety-wifi',
      title: t('Free Wi-Fi: Safe on the Go', 'Kostenloses WLAN: Sicher unterwegs'),
      description: t('In the café or at the station: what you can do there, and what should wait until later.', 'Im Café oder am Bahnhof: Was Sie dort tun können, und was warten sollte.'),
      durationMinutes: 5, tags: [t('Wi-Fi', 'WLAN'), t('Travel', 'Reisen')],
      steps: [
        { stepNumber: 1, title: t('Check the name', 'Prüfen Sie den Namen'), lead: t('Ask the staff for the correct network name.', 'Fragen Sie das Personal nach dem richtigen Netzwerknamen.'), paragraphs: [t('Anyone can create a network called "Free Café Wi-Fi".', 'Jeder kann ein Netzwerk namens „Café WLAN gratis“ einrichten.'), t('Free Wi-Fi is shared by everyone in the room. Many networks are open, without a password, so careless use can let others see more than you would like.', 'Ein kostenloses WLAN teilen sich alle im Raum. Viele Netze sind offen, ohne Passwort. Bei sorglosem Umgang sehen andere vielleicht mehr, als Ihnen lieb ist.')] },
        { stepNumber: 2, title: t('Save banking for later', 'Banking für später aufheben'), lead: t('Reading the news is fine. Banking can wait, or use mobile data.', 'Nachrichten lesen ist in Ordnung. Banking kann warten, oder nutzen Sie mobile Daten.'), paragraphs: [t('Do not enter a password on a pop-up page that appears after connecting, and never your email password.', 'Geben Sie auf einer Seite, die nach dem Verbinden erscheint, kein Passwort ein, schon gar nicht Ihr E-Mail-Passwort.'), t('Mobile data from your phone contract is safer on the go. Many contracts include enough data for banking and messages.', 'Unterwegs sind die mobilen Daten Ihres Handyvertrags sicherer. Viele Verträge enthalten genug Daten für Banking und Nachrichten.')] },
        { stepNumber: 3, title: t('Wi-Fi at home', 'WLAN zu Hause'), lead: t('Your home network should have a password.', 'Ihr Netz zu Hause sollte ein Passwort haben.'), paragraphs: [t('The password is usually printed on a sticker under your router, the box from your internet provider. That password is fine to use.', 'Das Passwort steht meist auf einem Aufkleber unter Ihrem Router, dem Kasten von Ihrem Internetanbieter. Dieses Passwort können Sie gut verwenden.'), t('Give it only to people you trust. Many routers can also offer a separate guest network for visitors.', 'Geben Sie es nur Menschen, denen Sie vertrauen. Viele Router bieten auch ein eigenes Gäste-WLAN für Besuch an.')], tip: t('On the go, switch off "connect automatically" for networks you do not know.', 'Schalten Sie unterwegs „Automatisch verbinden“ für fremde Netze aus.') },
      ],
    },
    {
      ...shared, id: 'safety-lost-phone',
      title: t('Phone Lost or Stolen: What to Do', 'Handy verloren oder gestohlen: Was tun?'),
      description: t('Stay calm. Here are the steps, in order. Best read before it happens.', 'Bleiben Sie ruhig. Hier sind die Schritte der Reihe nach. Am besten lesen, bevor es passiert.'),
      durationMinutes: 6, tags: [t('Phone', 'Handy'), t('Emergency', 'Notfall')],
      steps: [
        { stepNumber: 1, title: t('Prepare now', 'Jetzt vorbereiten'), lead: t('A screen lock is the most important protection.', 'Eine Bildschirmsperre ist der wichtigste Schutz.'), paragraphs: [t('Use a PIN, your fingerprint or your face to unlock the phone. Then a finder cannot simply look at your messages or banking.', 'Entsperren Sie das Handy mit PIN, Fingerabdruck oder Gesicht. Dann kann ein Finder nicht einfach Ihre Nachrichten oder Ihr Banking ansehen.'), t('Switch on "Find My iPhone" or "Find My Device". Write down the phone\'s IMEI number, which you get by dialling *#06#.', 'Schalten Sie „Wo ist?“ oder „Mein Gerät finden“ ein. Notieren Sie die IMEI-Nummer des Handys. Sie erscheint, wenn Sie *#06# wählen.'), t('Keep a list of important phone numbers at home: your bank, your phone provider and a family member.', 'Bewahren Sie zu Hause eine Liste wichtiger Nummern auf: Ihre Bank, Ihr Handyanbieter und ein Familienmitglied.')] },
        { stepNumber: 2, title: t('Locate it first', 'Zuerst orten'), lead: t('Maybe it is just in a coat pocket.', 'Vielleicht steckt es nur in einer Jackentasche.'), paragraphs: [t('Call your number from another phone. Then, on a computer or a family member\'s phone, open "Find My" for an iPhone or "Find My Device" from Google for Android, and sign in.', 'Rufen Sie Ihre Nummer von einem anderen Telefon an. Öffnen Sie dann am Computer oder auf dem Handy eines Familienmitglieds „Wo ist?“ für ein iPhone oder „Mein Gerät finden“ von Google für Android, und melden Sie sich an.'), t('The map shows where the phone was last. You can make it ring loudly, even when it is on silent.', 'Die Karte zeigt, wo das Handy zuletzt war. Sie können es laut klingeln lassen, auch wenn es lautlos gestellt ist.')], tip: t('If it is somewhere strange, do not go there yourself. Tell the police.', 'Ist es an einem fremden Ort, gehen Sie nicht selbst hin. Sagen Sie es der Polizei.') },
        { stepNumber: 3, title: t('Lock it and block the SIM card', 'Sperren und SIM-Karte sperren'), lead: t('If it stays lost, protect your accounts.', 'Bleibt es verschwunden, schützen Sie Ihre Konten.'), paragraphs: [t('In "Find My" you can lock the phone and show a message with a phone number on its screen. If it was stolen, you can also erase it from there.', 'In „Wo ist?“ können Sie das Handy sperren und eine Nachricht mit einer Telefonnummer auf dem Bildschirm zeigen. Wurde es gestohlen, können Sie es dort auch löschen.'), t('Call your phone provider to block the SIM card. Call your bank if banking apps are on it. If it was stolen, report it to the police and bring the IMEI number.', 'Rufen Sie Ihren Anbieter an, um die SIM-Karte zu sperren. Rufen Sie Ihre Bank an, wenn Banking-Apps darauf sind. Wurde es gestohlen, erstatten Sie Anzeige und nehmen Sie die IMEI-Nummer mit.')], tip: t('The German hotline 116 116 can also help block cards.', 'Der Sperr-Notruf 116 116 hilft auch beim Sperren von Karten.') },
        { stepNumber: 4, title: t('Afterwards', 'Danach'), lead: t('Change important passwords.', 'Ändern Sie wichtige Passwörter.'), paragraphs: [t('Start with your email. Tell family that messages from your number may not be from you.', 'Beginnen Sie mit Ihrer E-Mail. Sagen Sie der Familie, dass Nachrichten von Ihrer Nummer vielleicht nicht von Ihnen sind.'), t('Your provider can send you a new SIM card with your old number. If you had a backup, your contacts and photos come back on the new phone.', 'Ihr Anbieter kann Ihnen eine neue SIM-Karte mit Ihrer alten Nummer schicken. Hatten Sie eine Sicherung, kommen Kontakte und Fotos auf das neue Handy zurück.')] },
      ],
    },
    {
      ...shared, id: 'safety-what-if',
      title: t('I Fell for a Scam. What Now?', 'Ich bin auf Betrug hereingefallen. Was nun?'),
      description: t('It can happen to anyone. Here is a calm plan, step by step.', 'Das kann jedem passieren. Hier ist ein ruhiger Plan, Schritt für Schritt.'),
      durationMinutes: 6, tags: [t('Emergency', 'Notfall'), t('Scam', 'Betrug')],
      steps: [
        { stepNumber: 1, title: t('It is not your fault', 'Es ist nicht Ihre Schuld'), lead: t('Criminals do this for a living. Being quick matters more than being embarrassed.', 'Kriminelle machen das beruflich. Schnelligkeit ist wichtiger als Scham.'), paragraphs: [t('Every day, careful and clever people are tricked. The criminals use fear, hurry and kindness, and they are very practised.', 'Jeden Tag werden vorsichtige und kluge Menschen getäuscht. Die Kriminellen nutzen Angst, Eile und Hilfsbereitschaft, und sie sind sehr geübt.'), t('Tell someone you trust. They can help you stay calm and make the calls with you.', 'Sagen Sie es einer Vertrauensperson. Sie kann Ihnen helfen, ruhig zu bleiben, und mit Ihnen telefonieren.')] },
        { stepNumber: 2, title: t('Protect your money', 'Schützen Sie Ihr Geld'), lead: t('Call your bank straight away.', 'Rufen Sie sofort Ihre Bank an.'), paragraphs: [t('Use the number on your bank card, or the German blocking hotline 116 116. Ask whether a transfer can still be stopped.', 'Nutzen Sie die Nummer auf Ihrer Bankkarte oder den Sperr-Notruf 116 116. Fragen Sie, ob sich eine Überweisung noch stoppen lässt.'), t('The faster you call, the better the chance. A transfer that has just been made can sometimes still be held back.', 'Je schneller Sie anrufen, desto besser die Chance. Eine gerade erst gemachte Überweisung lässt sich manchmal noch aufhalten.')] },
        { stepNumber: 3, title: t('Protect your accounts', 'Schützen Sie Ihre Konten'), lead: t('Change the password that was given away.', 'Ändern Sie das verratene Passwort.'), paragraphs: [t('Change it everywhere you use it, starting with your email. If you allowed remote access, have the device checked.', 'Ändern Sie es überall, wo Sie es nutzen, zuerst bei Ihrer E-Mail. Haben Sie Fernzugriff erlaubt, lassen Sie das Gerät prüfen.'), t('Switch on two-step login where you can. Then a stolen password alone is no longer enough.', 'Schalten Sie, wo es geht, die Anmeldung in zwei Schritten ein. Dann reicht ein gestohlenes Passwort allein nicht mehr.')] },
        { stepNumber: 4, title: t('Report it', 'Melden Sie es'), lead: t('Go to the police, even for small amounts.', 'Gehen Sie zur Polizei, auch bei kleinen Beträgen.'), paragraphs: [t('Bring screenshots, emails and account details. Many German federal states also offer an online police station. Consumer advice centres can advise you too.', 'Bringen Sie Screenshots, E-Mails und Kontodaten mit. Viele Bundesländer bieten auch eine Online-Wache an. Auch Verbraucherzentralen beraten Sie.'), t('Do not delete the messages. They help the police, and your bank may need the report.', 'Löschen Sie die Nachrichten nicht. Sie helfen der Polizei, und Ihre Bank braucht vielleicht die Anzeige.')], warning: t('Be careful of people who offer to get your money back for a fee. That is often the next scam.', 'Vorsicht bei Menschen, die Ihr Geld gegen Gebühr zurückholen wollen. Das ist oft der nächste Betrug.') },
      ],
    },
  ];
}

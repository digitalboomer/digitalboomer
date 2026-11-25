/**
 * "Block a stranger" for each messaging app, following how that app really does it (see `blockFlow`
 * in components/practice/messaging/apps.ts for the sources). Apps differ a lot:
 * - who the stranger is: a phone number (WhatsApp, SMS, iMessage, Viber) or a name they chose themselves;
 * - where they land: the normal chat list, or a separate requests inbox (Messenger, LINE, Discord);
 * - where "Block" is: a bar in the chat, the request buttons, the person's profile, or pressing and holding;
 * - how reporting works: a box to tick, a "Block and report" choice, or a separate "Report" elsewhere.
 * Screens are drawn by `BlockScreens` in MessengerScreen.tsx from the `bk*` labels below.
 */
import type { Language, TutorialStep } from '../types';
import { strangerKind, type BlockFlow } from '../components/practice/messaging/apps';

type Step = (
  lang: Language, stepNumber: number, title: string, lead: string, paragraphs: string[], screen: string, targetId: string, where: string, successText: string,
  options?: { hold?: boolean },
) => TutorialStep;

export interface BlockLesson {
  title: string;
  description: string;
  introText: string;
  successTitle: string;
  successText: string;
  tags: string[];
  labels: Record<string, string>;
  steps: TutorialStep[];
}

/** Flows in which blocking and reporting happen together. The others block, and say where reporting is. */
const REPORTS: BlockFlow[] = ['wa-android', 'wa-iphone', 'signal', 'telegram', 'gmessages', 'viber'];

const NAMES: Record<BlockFlow, string> = {
  'wa-android': '+49 000 1234 567', 'wa-iphone': '+49 000 1234 567', apple: '+49 000 1234 567', gmessages: '+49 000 1234 567', viber: '+49 000 1234 567',
  signal: 'Sarah', telegram: 'Sarah Becker', messenger: 'Sarah Becker', threema: '~Sarah', line: 'Sarah', discord: 'sarah.becker88',
};

export function blockLesson(lang: Language, appName: string, flow: BlockFlow, step: Step, youKnow: string): BlockLesson {
  const isEn = lang === 'en';
  const t = (en: string, de: string) => (isEn ? en : de);
  const who = NAMES[flow];
  const byNumber = strangerKind(flow) === 'number';
  const reports = REPORTS.includes(flow);
  const right = t('That was right.', 'Das war richtig.');
  const asks = t('That was right. The app asks to make sure.', 'Das war richtig. Die App fragt zur Sicherheit nach.');
  const neverAnswer = t('Opening it is safe. Just do not tap any link in it, and do not answer.', 'Öffnen ist ungefährlich. Tippen Sie nur auf keinen Link darin, und antworten Sie nicht.');
  const trick = byNumber
    ? t('That was right. This is the "Hi Mum" trick: a stranger pretends to be your child.', 'Das war richtig. Das ist der „Hallo Mama“-Trick: Eine fremde Person gibt sich als Ihr Kind aus.')
    : t('That was right. Someone you do not know claims to know your family, and soon asks for money.', 'Das war richtig. Jemand Unbekanntes behauptet, Ihre Familie zu kennen, und bittet bald um Geld.');
  const checkFamily = t('If your real child might be involved, call them on the number you know to check.', 'Könnte Ihr echtes Kind betroffen sein, rufen Sie es unter der Nummer an, die Sie kennen, und fragen Sie nach.');
  const nameOnly = t(`In ${appName}, strangers can show any name and photo they like. A name you know proves nothing.`, `In ${appName} können Fremde jeden Namen und jedes Foto zeigen, das sie möchten. Ein bekannter Name beweist nichts.`);

  const steps: TutorialStep[] = [];
  const add = (title: string, lead: string, paragraphs: string[], screen: string, target: string, where: string, success: string, options?: { hold?: boolean }) =>
    steps.push(step(lang, steps.length + 1, title, lead, paragraphs, screen, target, where, success, options));

  const openChat = (where: string, lead = t('Tap the line at the top.', 'Tippen Sie auf die oberste Zeile.')) =>
    add(byNumber ? t('Open the message from the unknown number', 'Öffnen Sie die Nachricht der unbekannten Nummer') : t(`Open the message from "${who}"`, `Öffnen Sie die Nachricht von „${who}“`),
      lead, [neverAnswer], flow === 'messenger' || flow === 'line' || flow === 'discord' ? 'bk-requests' : 'bk-list', 'chat-stranger', where, trick);

  // Labels shared by all flows: the stranger, their messages and the note after blocking.
  const labels: Record<string, string> = {
    strangerNumber: who,
    strangerLast: byNumber ? t('Hi Mum, this is my new number', 'Hallo Mama, das ist meine neue Nummer') : t('Hello! I am a friend of your son.', 'Hallo! Ich bin ein Freund Ihres Sohnes.'),
    strangerOne: byNumber ? t('Hi Mum, my phone broke. This is my new number.', 'Hallo Mama, mein Handy ist kaputt. Das ist meine neue Nummer.') : t('Hello! I am a friend of your son. He lost his phone and asked me to write to you.', 'Hallo! Ich bin ein Freund Ihres Sohnes. Er hat sein Handy verloren und mich gebeten, Ihnen zu schreiben.'),
    strangerTwo: byNumber ? t('Can you help me pay a bill today?', 'Kannst du mir heute helfen, eine Rechnung zu bezahlen?') : t('He needs help paying a bill today. Can you send money?', 'Er braucht heute Hilfe bei einer Rechnung. Können Sie Geld schicken?'),
    notInContacts: byNumber ? t('Not in your contacts', 'Nicht in Ihren Kontakten') : t('Not a contact', 'Kein Kontakt'),
    blockedNote: t('You blocked this contact', 'Sie haben diesen Kontakt blockiert'),
    blockedFooter: t('You cannot exchange messages with a blocked contact.', 'Mit einem blockierten Kontakt können Sie keine Nachrichten austauschen.'),
    cancelWord: t('Cancel', 'Abbrechen'),
  };

  let successText = '';
  switch (flow) {
    case 'wa-android':
    case 'telegram': {
      const isWa = flow === 'wa-android';
      Object.assign(labels, isWa ? {
        bkBanner: t('Not in your contacts', 'Nicht in Ihren Kontakten'), bkBlock: t('Block', 'Blockieren'), bkAdd: t('Add', 'Hinzufügen'),
        bkTitle: t(`Block ${who}?`, `${who} blockieren?`),
        bkBody: t('Blocked contacts will no longer be able to call you or send you messages. This contact will not be notified.', 'Blockierte Kontakte können dich nicht mehr anrufen oder dir Nachrichten senden. Dieser Kontakt wird nicht benachrichtigt.'),
        bkCheck: t('Report to WhatsApp', 'An WhatsApp melden'), bkOk: t('Block', 'Blockieren'),
      } : {
        bkBlock: t('Block user', 'Nutzer blockieren'), bkAdd: t('Add contact', 'Kontakt hinzufügen'),
        bkTitle: t(`Block ${who}`, `${who} blockieren`),
        bkBody: t(`Do you want to block ${who} from messaging and calling you on Telegram?`, `Möchtest du ${who} blockieren, damit sie dir auf Telegram nicht mehr schreiben oder dich anrufen kann?`),
        bkCheck: t('Report spam', 'Spam melden'), bkCheck2: t('Delete this chat', 'Diesen Chat löschen'), bkOk: t('Block user', 'Nutzer blockieren'),
      });
      openChat(t('The unknown chat is the top line.', 'Der unbekannte Chat ist die oberste Zeile.'));
      add(t(`Tap "${labels.bkBlock}"`, `Tippen Sie auf „${labels.bkBlock}“`),
        isWa ? t('WhatsApp shows a bar above messages from numbers that are not in your contacts.', 'WhatsApp zeigt über Nachrichten von Nummern, die nicht in Ihren Kontakten sind, eine Leiste.') : t('Telegram shows a bar at the top of chats with people who are not in your contacts.', 'Telegram zeigt oben in Chats mit Menschen, die nicht in Ihren Kontakten sind, eine Leiste.'),
        [isWa ? checkFamily : nameOnly],
        'bk-chat', 'block-start', t(`"${labels.bkBlock}" is in the bar at the top, on the left.`, `„${labels.bkBlock}“ ist in der Leiste oben, links.`), asks);
      add(t(`Tick "${labels.bkCheck}"`, `Haken Sie „${labels.bkCheck}“ an`), t('Tap the box, so the app learns about this sender.', 'Tippen Sie auf das Kästchen, damit die App von diesem Absender erfährt.'),
        [isWa ? t('WhatsApp then receives the last messages from this number. The other person is not told who reported them.', 'WhatsApp erhält dann die letzten Nachrichten dieser Nummer. Die andere Person erfährt nicht, wer sie gemeldet hat.') : t('"Delete this chat" can stay as it is.', '„Diesen Chat löschen“ kann so bleiben.')],
        'bk-dialog', 'report-check', t('The box is under the question, above the buttons.', 'Das Kästchen ist unter der Frage, über den Knöpfen.'), t('That was right. The box is ticked.', 'Das war richtig. Das Kästchen ist angehakt.'));
      add(t(`Tap "${labels.bkOk}"`, `Tippen Sie auf „${labels.bkOk}“`), t('Confirm with the button at the bottom right.', 'Bestätigen Sie mit dem Knopf unten rechts.'),
        [t('Cancel would close this without blocking.', 'Abbrechen würde das schließen, ohne zu blockieren.')],
        'bk-dialog2', 'block-ok', t(`"${labels.bkOk}" is at the bottom right.`, `„${labels.bkOk}“ ist unten rechts.`), right);
      break;
    }
    case 'wa-iphone':
    case 'signal':
    case 'viber': {
      const isSignal = flow === 'signal';
      Object.assign(labels, flow === 'wa-iphone' ? {
        bkBanner: t('Not in your contacts', 'Nicht in deinen Kontakten'), bkBlock: t('Block', 'Blockieren'), bkAdd: t('Add', 'Hinzufügen'),
        bkTitle: t(`Block ${who}?`, `${who} blockieren?`), bkBody: t('Blocked contacts will no longer be able to call you or send you messages.', 'Blockierte Kontakte können dich nicht mehr anrufen oder dir Nachrichten senden.'),
        bkOpt1: t('Block and report', 'Blockieren und melden'), bkOpt2: t('Block', 'Blockieren'),
      } : isSignal ? {
        bkBanner: t(`Let ${who} message you and share your name and photo with them? They won't know you've seen their messages until you accept.`, `Darf ${who} dir schreiben, und möchtest du deinen Namen und dein Foto mit ihr teilen? Sie erfährt erst, dass du ihre Nachrichten gesehen hast, wenn du annimmst.`),
        bkBlock: t('Block', 'Blockieren'), bkThird: t('Report', 'Melden'), bkAccept: t('Accept', 'Annehmen'),
        bkTitle: t(`Block ${who}?`, `${who} blockieren?`), bkBody: t("Blocked people won't be able to call you or send you messages.", 'Blockierte Personen können dich nicht anrufen und dir keine Nachrichten senden.'),
        bkOpt1: t('Report spam and block', 'Spam melden und blockieren'), bkOpt2: t('Block', 'Blockieren'),
      } : {
        bkBanner: t(`${who} is not in your contacts`, `${who} ist nicht in deinen Kontakten`), bkBlock: t('Block', 'Blockieren'), bkAdd: t('Add contact', 'Kontakt hinzufügen'),
        bkTitle: t(`Block ${who}?`, `${who} blockieren?`), bkBody: t('Blocked contacts cannot call you or send you messages.', 'Blockierte Kontakte können dich nicht anrufen und dir keine Nachrichten senden.'),
        bkOpt1: t('Block and report spam', 'Blockieren und als Spam melden'), bkOpt2: t('Block', 'Blockieren'),
      });
      openChat(isSignal ? t('The message request is the top line.', 'Die Nachrichtenanfrage ist die oberste Zeile.') : t('The unknown number is the top line.', 'Die unbekannte Nummer ist die oberste Zeile.'),
        isSignal ? t(`Tap the line with "${who}" at the top.`, `Tippen Sie oben auf die Zeile mit „${who}“.`) : undefined);
      add(t('Tap "Block"', 'Tippen Sie auf „Blockieren“'),
        isSignal ? t('Signal shows three buttons under a message request: Block, Report and Accept.', 'Signal zeigt unter einer Nachrichtenanfrage drei Knöpfe: Blockieren, Melden und Annehmen.')
          : flow === 'viber' ? t('Viber shows a banner above messages from numbers that are not in your contacts.', 'Viber zeigt über Nachrichten von Nummern, die nicht in Ihren Kontakten sind, ein Banner.')
            : t('WhatsApp shows a bar above messages from numbers that are not in your contacts.', 'WhatsApp zeigt über Nachrichten von Nummern, die nicht in Ihren Kontakten sind, eine Leiste.'),
        [isSignal ? t('Until you accept, the person cannot see that you have read the messages. "Accept" would let them keep writing to you.', 'Solange Sie nicht annehmen, sieht die Person nicht, dass Sie die Nachrichten gelesen haben. „Annehmen“ würde ihr erlauben, Ihnen weiter zu schreiben.') : checkFamily],
        'bk-chat', 'block-start', isSignal ? t('"Block" is the first of the three buttons at the bottom.', '„Blockieren“ ist der erste der drei Knöpfe unten.') : t('"Block" is in the bar at the top.', '„Blockieren“ ist in der Leiste oben.'), asks);
      add(t(`Tap "${labels.bkOpt1}"`, `Tippen Sie auf „${labels.bkOpt1}“`), t('This blocks the sender and tells the app about them in one step.', 'Damit blockieren Sie den Absender und melden ihn der App in einem Schritt.'),
        [t('"Block" alone would also stop the messages, but would not report them. The other person is not told who reported them.', '„Blockieren“ allein würde die Nachrichten auch stoppen, aber nicht melden. Die andere Person erfährt nicht, wer sie gemeldet hat.')],
        'bk-sheet', 'block-report', t(`"${labels.bkOpt1}" is the first choice.`, `„${labels.bkOpt1}“ ist die erste Auswahl.`), right);
      break;
    }
    case 'gmessages':
      Object.assign(labels, {
        bkArchive: t('Archive', 'Archivieren'), bkDelete: t('Delete', 'Löschen'), bkBlock: t('Block', 'Blockieren'),
        bkTitle: t(`Block ${who}?`, `${who} blockieren?`), bkBody: t('You will no longer receive calls and texts from this number.', 'Du erhältst von dieser Nummer keine Anrufe und SMS mehr.'),
        bkCheck: t('Report spam', 'Spam melden'), bkOk: 'OK',
      });
      add(t('Press and hold the unknown message', 'Halten Sie die unbekannte Nachricht gedrückt'), t('Put your finger on the top line and keep it there for a moment.', 'Legen Sie den Finger auf die oberste Zeile und lassen Sie ihn einen Moment dort.'),
        [t('You do not need to open the message. Pressing and holding selects it, and buttons appear at the top.', 'Sie müssen die Nachricht nicht öffnen. Gedrückt halten wählt sie aus, und oben erscheinen Knöpfe.')],
        'bk-list', 'chat-stranger', t('The unknown number is the top line.', 'Die unbekannte Nummer ist die oberste Zeile.'), t('That was right. The conversation is selected.', 'Das war richtig. Die Unterhaltung ist ausgewählt.'), { hold: true });
      add(t('Tap the block symbol', 'Tippen Sie auf das Blockieren-Symbol'), t('It is the round symbol with a line through it, at the top.', 'Das ist das runde Symbol mit einem Strich, oben.'),
        [t('The bin would only delete the conversation. The number could keep writing to you.', 'Der Papierkorb würde nur die Unterhaltung löschen. Die Nummer könnte Ihnen weiter schreiben.')],
        'bk-hold', 'bk-block', t('The block symbol is at the top right, next to the bin.', 'Das Blockieren-Symbol ist oben rechts, neben dem Papierkorb.'), asks);
      add(t('Tick "Report spam"', 'Haken Sie „Spam melden“ an'), t('Tap the box, so Google learns about this number.', 'Tippen Sie auf das Kästchen, damit Google von dieser Nummer erfährt.'),
        [t('Google then receives the number and its last messages, and the message moves to "Spam & blocked".', 'Google erhält dann die Nummer und ihre letzten Nachrichten, und die Nachricht kommt in „Spam und blockiert“.')],
        'bk-dialog', 'report-check', t('The box is under the question, above the buttons.', 'Das Kästchen ist unter der Frage, über den Knöpfen.'), t('That was right. The box is ticked.', 'Das war richtig. Das Kästchen ist angehakt.'));
      add(t('Tap "OK"', 'Tippen Sie auf „OK“'), t('Confirm with the button at the bottom right.', 'Bestätigen Sie mit dem Knopf unten rechts.'),
        [t('Cancel would close this without blocking.', 'Abbrechen würde das schließen, ohne zu blockieren.')],
        'bk-dialog2', 'block-ok', t('"OK" is at the bottom right.', '„OK“ ist unten rechts.'), right);
      break;
    case 'messenger':
      Object.assign(labels, {
        bkChats: t('Chats', 'Chats'), bkMarketplace: 'Marketplace', bkRequests: t('Message requests', 'Nachrichtenanfragen'), bkArchived: t('Archive', 'Archiv'),
        bkBanner: t(`${who} wants to send you a message. They won't know you've seen it unless you reply.`, `${who} möchte dir eine Nachricht senden. Sie erfährt nicht, dass du sie gesehen hast, solange du nicht antwortest.`),
        bkBlock: t('Block', 'Blockieren'), bkThird: t('Delete', 'Löschen'), bkAccept: t('Accept', 'Annehmen'),
        bkTitle: t(`Block ${who}?`, `${who} blockieren?`),
        bkOpt1: t('Block messages and calls', 'Nachrichten und Anrufe blockieren'), bkOpt1Info: t("They won't be able to message or call you on Messenger or Facebook chat.", 'Sie kann dir im Messenger und im Facebook-Chat nicht mehr schreiben oder dich anrufen.'),
        bkOpt2: t('Block on Facebook', 'Auf Facebook blockieren'), bkOpt2Info: t('This also blocks their profile on Facebook.', 'Damit blockieren Sie auch ihr Profil auf Facebook.'),
        bkConfirmBody: t(`${who} won't be able to message or call you.`, `${who} kann dir keine Nachrichten mehr senden und dich nicht anrufen.`), bkOk: t('Block', 'Blockieren'),
      });
      add(t('Open the menu', 'Öffnen Sie das Menü'), t('Tap the three lines at the top left.', 'Tippen Sie oben links auf die drei Striche.'),
        [t('Messages from people who are not your friends do not appear in your chats. Messenger keeps them apart as "Message requests".', 'Nachrichten von Menschen, die nicht Ihre Freunde sind, erscheinen nicht in Ihren Chats. Messenger legt sie als „Nachrichtenanfragen“ beiseite.')],
        'bk-list', 'menu', t('The three lines are at the top left, next to "messenger".', 'Die drei Striche sind oben links, neben „messenger“.'), t('That was right. The menu is open.', 'Das war richtig. Das Menü ist offen.'));
      add(t('Tap "Message requests"', 'Tippen Sie auf „Nachrichtenanfragen“'), t('It is the third line in the menu.', 'Das ist die dritte Zeile im Menü.'),
        [t('The small number shows how many requests are waiting.', 'Die kleine Zahl zeigt, wie viele Anfragen warten.')],
        'bk-drawer', 'bk-requests-row', t('"Message requests" is the third line.', '„Nachrichtenanfragen“ ist die dritte Zeile.'), t('That was right.', 'Das war richtig.'));
      openChat(t(`The request from "${who}" is the top line.`, `Die Anfrage von „${who}“ ist die oberste Zeile.`), t(`Tap the request from "${who}".`, `Tippen Sie auf die Anfrage von „${who}“.`));
      add(t('Tap "Block"', 'Tippen Sie auf „Blockieren“'), t('Messenger shows three buttons under a message request.', 'Messenger zeigt unter einer Nachrichtenanfrage drei Knöpfe.'),
        [nameOnly, t('"Accept" would move the chat to your normal chats.', '„Annehmen“ würde den Chat zu Ihren normalen Chats verschieben.')],
        'bk-chat', 'block-start', t('"Block" is the first of the three buttons at the bottom.', '„Blockieren“ ist der erste der drei Knöpfe unten.'), asks);
      add(t('Tap "Block messages and calls"', 'Tippen Sie auf „Nachrichten und Anrufe blockieren“'), t('It stops this profile from writing to you or calling you.', 'Damit kann dieses Profil Ihnen nicht mehr schreiben oder Sie anrufen.'),
        [t('"Block on Facebook" would also block the profile on Facebook. Both are fine.', '„Auf Facebook blockieren“ würde das Profil auch auf Facebook blockieren. Beides ist in Ordnung.')],
        'bk-sheet', 'block-report', t('"Block messages and calls" is the first choice.', '„Nachrichten und Anrufe blockieren“ ist die erste Auswahl.'), asks);
      add(t('Tap "Block"', 'Tippen Sie auf „Blockieren“'), t('Confirm with the blue button.', 'Bestätigen Sie mit dem blauen Knopf.'),
        [t('The other person is not told that you blocked them.', 'Die andere Person erfährt nicht, dass Sie sie blockiert haben.')],
        'bk-confirm', 'block-ok', t('"Block" is the blue button at the bottom.', '„Blockieren“ ist der blaue Knopf unten.'), right);
      successText = t(`${who} can no longer message or call you on Messenger. To report the profile too, open the chat, tap the name at the top and choose "Report".`, `${who} kann Ihnen im Messenger nicht mehr schreiben und Sie nicht anrufen. Um das Profil auch zu melden, öffnen Sie den Chat, tippen oben auf den Namen und wählen „Melden“.`);
      break;
    case 'apple':
      Object.assign(labels, {
        bkBanner: t('This sender is not in your contact list.', 'Dieser Absender ist nicht in deiner Kontaktliste.'), bkReportSpam: t('Report Spam', 'Spam melden'),
        bkCall: t('Call', 'Anrufen'), bkFaceTime: 'FaceTime', bkInfo: t('Info', 'Info'),
        bkRow1: t('Send My Current Location', 'Meinen aktuellen Standort senden'), bkRow2: t('Share My Location', 'Meinen Standort teilen'),
        bkBlockContact: t('Block Contact', 'Kontakt blockieren'),
        bkBody: t('You will not receive phone calls, messages, or FaceTime from people on the block list.', 'Du erhältst keine Anrufe, Nachrichten oder FaceTime-Anrufe von Personen auf der Liste blockierter Kontakte.'),
        bkOk: t('Block Contact', 'Kontakt blockieren'),
      });
      openChat(t('The unknown number is the top line.', 'Die unbekannte Nummer ist die oberste Zeile.'));
      add(t('Tap the icon at the top', 'Tippen Sie oben auf das Symbol'), t('Tap the round picture above the number.', 'Tippen Sie auf das runde Bild über der Nummer.'),
        [t('Under the message you also see "Report Spam". It reports the number to Apple and deletes the conversation. Block first, so it cannot write again.', 'Unter der Nachricht sehen Sie auch „Spam melden“. Damit melden Sie die Nummer an Apple und löschen die Unterhaltung. Blockieren Sie zuerst, damit sie nicht wieder schreiben kann.')],
        'bk-chat', 'bk-header', t('The round icon is at the top, in the middle.', 'Das runde Symbol ist oben in der Mitte.'), t('That was right. Some buttons have appeared.', 'Das war richtig. Einige Knöpfe sind erschienen.'));
      add(t('Tap "Info"', 'Tippen Sie auf „Info“'), t('It is the last of the round buttons.', 'Das ist der letzte der runden Knöpfe.'),
        [t('The other buttons would call this number. Do not call back strangers.', 'Die anderen Knöpfe würden diese Nummer anrufen. Rufen Sie Fremde nicht zurück.')],
        'bk-pop', 'bk-info', t('"Info" is the round button on the right.', '„Info“ ist der runde Knopf rechts.'), t('That was right. The details are open.', 'Das war richtig. Die Details sind offen.'));
      add(t('Tap "Block Contact"', 'Tippen Sie auf „Kontakt blockieren“'), t('It is in red, at the bottom of the list.', 'Das steht in Rot, ganz unten in der Liste.'),
        [t('On a real iPhone you may need to scroll down to see it.', 'Am echten iPhone müssen Sie dafür eventuell nach unten wischen.')],
        'bk-details', 'bk-block', t('"Block Contact" is the red line at the bottom.', '„Kontakt blockieren“ ist die rote Zeile unten.'), asks);
      add(t('Tap "Block Contact" again', 'Tippen Sie noch einmal auf „Kontakt blockieren“'), t('Confirm with the red choice.', 'Bestätigen Sie mit der roten Auswahl.'),
        [t('Cancel would close this without blocking.', 'Abbrechen würde das schließen, ohne zu blockieren.')],
        'bk-confirm', 'block-ok', t('"Block Contact" is the red choice.', '„Kontakt blockieren“ ist die rote Auswahl.'), right);
      successText = t('This number can no longer call you, send you messages or FaceTime you. To report it to Apple as well, tap "Report Spam" under the message: that also deletes the conversation.', 'Diese Nummer kann Sie nicht mehr anrufen, Ihnen keine Nachrichten senden und Sie nicht per FaceTime erreichen. Um sie auch an Apple zu melden, tippen Sie unter der Nachricht auf „Spam melden“: Das löscht auch die Unterhaltung.');
      break;
    case 'threema':
      Object.assign(labels, {
        bkId: 'Threema-ID: W7X3K9PQ', bkLevel: t('Verification level: unverified', 'Vertrauensstufe: nicht überprüft'),
        bkMore: t('More options', 'Weitere Optionen'), bkEdit: t('Edit', 'Bearbeiten'), bkShare: t('Share contact', 'Kontakt teilen'), bkBlockContact: t('Block contact', 'Kontakt blockieren'),
      });
      openChat(t(`The chat with "${who}" is the top line.`, `Der Chat mit „${who}“ ist die oberste Zeile.`), t(`Tap the line with "${who}" at the top.`, `Tippen Sie oben auf die Zeile mit „${who}“.`));
      add(t('Tap the profile picture at the top', 'Tippen Sie oben auf das Profilbild'), t('This opens the contact details.', 'Damit öffnen Sie die Kontaktdetails.'),
        [t('Threema shows strangers with their Threema ID and the name they chose, marked with a "~". The red dot means: not verified.', 'Threema zeigt Fremde mit ihrer Threema-ID und dem Namen, den sie selbst gewählt haben, mit einem „~“ davor. Der rote Punkt heißt: nicht überprüft.')],
        'bk-chat', 'bk-header', t('The profile picture is at the top left, next to the name.', 'Das Profilbild ist oben links, neben dem Namen.'), t('That was right. The contact details are open.', 'Das war richtig. Die Kontaktdetails sind offen.'));
      add(t('Open the menu', 'Öffnen Sie das Menü'), t('Tap the three dots at the top right.', 'Tippen Sie oben rechts auf die drei Punkte.'),
        [t('On an iPhone, "Block contact" is further down in the details instead.', 'Auf dem iPhone steht „Kontakt blockieren“ stattdessen weiter unten in den Details.')],
        'bk-details', 'bk-more', t('The three dots are at the top right.', 'Die drei Punkte sind oben rechts.'), t('That was right. The menu is open.', 'Das war richtig. Das Menü ist offen.'));
      add(t('Tap "Block contact"', 'Tippen Sie auf „Kontakt blockieren“'), t('It is the last line in the menu.', 'Das ist die letzte Zeile im Menü.'),
        [t('The other person is not told that you blocked them.', 'Die andere Person erfährt nicht, dass Sie sie blockiert haben.')],
        'bk-moremenu', 'bk-block', t('"Block contact" is the last line.', '„Kontakt blockieren“ ist die letzte Zeile.'), right);
      successText = t(`${who} can no longer send you messages. If Threema marks a chat as possible spam, it offers "Report" right in the chat. You can also turn on "Block unknown" in the privacy settings.`, `${who} kann Ihnen keine Nachrichten mehr senden. Markiert Threema einen Chat als möglichen Spam, bietet es direkt im Chat „Melden“ an. In den Datenschutz-Einstellungen können Sie außerdem „Unbekannte blockieren“ einschalten.`);
      break;
    case 'line':
      Object.assign(labels, {
        bkRequests: t('Chat requests', 'Chat-Anfragen'), bkRequestsTitle: t('Requests from non-friends', 'Anfragen von Nicht-Freunden'),
        bkBanner: t(`${who} isn't your friend yet.`, `${who} ist noch nicht dein Freund.`), bkAdd: t('Add friend', 'Als Freund hinzufügen'), bkBlock: t('Block', 'Blockieren'), bkThird: t('Report', 'Melden'),
        bkTitle: t(`Block ${who}?`, `${who} blockieren?`), bkConfirmBody: t("You won't receive messages or calls from this user.", 'Du erhältst von diesem Nutzer keine Nachrichten und Anrufe mehr.'), bkOk: t('Block', 'Blockieren'),
      });
      add(t('Open the chat requests', 'Öffnen Sie die Chat-Anfragen'), t('Tap the line "Chat requests" at the top.', 'Tippen Sie oben auf die Zeile „Chat-Anfragen“.'),
        [t('Messages from people who are not your friends wait there, apart from your other chats.', 'Nachrichten von Menschen, die nicht Ihre Freunde sind, warten dort, getrennt von Ihren anderen Chats.')],
        'bk-list', 'bk-requests-row', t('"Chat requests" is the top line.', '„Chat-Anfragen“ ist die oberste Zeile.'), t('That was right.', 'Das war richtig.'));
      openChat(t(`The chat with "${who}" is the top line.`, `Der Chat mit „${who}“ ist die oberste Zeile.`), t(`Tap the chat with "${who}".`, `Tippen Sie auf den Chat mit „${who}“.`));
      add(t('Tap "Block"', 'Tippen Sie auf „Blockieren“'), t('LINE shows a bar with three buttons in chats with people who are not your friends.', 'LINE zeigt in Chats mit Menschen, die nicht Ihre Freunde sind, eine Leiste mit drei Knöpfen.'),
        [nameOnly],
        'bk-chat', 'block-start', t('"Block" is the middle button in the bar at the top.', '„Blockieren“ ist der mittlere Knopf in der Leiste oben.'), asks);
      add(t('Tap "Block" again', 'Tippen Sie noch einmal auf „Blockieren“'), t('Confirm with the green button.', 'Bestätigen Sie mit dem grünen Knopf.'),
        [t('Cancel would close this without blocking.', 'Abbrechen würde das schließen, ohne zu blockieren.')],
        'bk-confirm', 'block-ok', t('"Block" is the green button.', '„Blockieren“ ist der grüne Knopf.'), right);
      successText = t(`${who} can no longer message or call you. "Report" is right next to "Block" if you also want to tell LINE: it sends LINE the recent messages, and the person is not told who reported them.`, `${who} kann Ihnen nicht mehr schreiben und Sie nicht anrufen. „Melden“ steht direkt neben „Blockieren“, wenn Sie es auch LINE sagen möchten: LINE erhält dann die letzten Nachrichten, und die Person erfährt nicht, wer sie gemeldet hat.`);
      break;
    case 'discord':
      Object.assign(labels, {
        bkRequests: t('Message Requests', 'Nachrichtenanfragen'), bkBanner: t(`${who} wants to message you. You don't share any friends.`, `${who} möchte dir schreiben. Ihr habt keine gemeinsamen Freunde.`),
        bkAccept: t('Accept', 'Annehmen'), bkThird: t('Ignore', 'Ignorieren'),
        bkMore: t('More', 'Mehr'), bkReportUser: t('Report User Profile', 'Nutzerprofil melden'), bkBlockContact: t('Block', 'Blockieren'),
        bkTitle: t(`Block ${who}?`, `${who} blockieren?`), bkConfirmBody: t(`Are you sure you want to block ${who}? They won't be able to message you.`, `Möchtest du ${who} wirklich blockieren? Sie kann dir dann keine Nachrichten senden.`), bkOk: t('Block', 'Blockieren'),
      });
      add(t('Open the message requests', 'Öffnen Sie die Nachrichtenanfragen'), t('Tap "Message Requests" at the top of your messages.', 'Tippen Sie oben in Ihren Nachrichten auf „Nachrichtenanfragen“.'),
        [t('Discord keeps messages from people you are not friends with apart, so you can look at them first.', 'Discord legt Nachrichten von Menschen, mit denen Sie nicht befreundet sind, beiseite, damit Sie sie zuerst ansehen können.')],
        'bk-list', 'bk-requests-row', t('"Message Requests" is the top line.', '„Nachrichtenanfragen“ ist die oberste Zeile.'), t('That was right.', 'Das war richtig.'));
      openChat(t(`The request from "${who}" is the top line.`, `Die Anfrage von „${who}“ ist die oberste Zeile.`), t(`Tap the request from "${who}".`, `Tippen Sie auf die Anfrage von „${who}“.`));
      add(t('Tap the name at the top', 'Tippen Sie oben auf den Namen'), t('This opens the profile.', 'Damit öffnen Sie das Profil.'),
        [nameOnly, t('"Ignore" would only hide the request. The person could write again.', '„Ignorieren“ würde die Anfrage nur ausblenden. Die Person könnte wieder schreiben.')],
        'bk-chat', 'bk-header', t('The name is at the top of the chat.', 'Der Name steht oben im Chat.'), t('That was right. The profile is open.', 'Das war richtig. Das Profil ist offen.'));
      add(t('Open the menu', 'Öffnen Sie das Menü'), t('Tap the three dots at the top right of the profile.', 'Tippen Sie oben rechts im Profil auf die drei Punkte.'),
        [t('Here you find "Block" and "Report".', 'Hier finden Sie „Blockieren“ und „Melden“.')],
        'bk-details', 'bk-more', t('The three dots are at the top right.', 'Die drei Punkte sind oben rechts.'), t('That was right. The menu is open.', 'Das war richtig. Das Menü ist offen.'));
      add(t('Tap "Block"', 'Tippen Sie auf „Blockieren“'), t('It is the red line in the menu.', 'Das ist die rote Zeile im Menü.'),
        [t('"Report User Profile" would tell Discord about the profile, without blocking it.', '„Nutzerprofil melden“ würde Discord über das Profil informieren, ohne es zu blockieren.')],
        'bk-moremenu', 'bk-block', t('"Block" is the red line.', '„Blockieren“ ist die rote Zeile.'), asks);
      add(t('Tap "Block" again', 'Tippen Sie noch einmal auf „Blockieren“'), t('Confirm with the red button.', 'Bestätigen Sie mit dem roten Knopf.'),
        [t('Cancel would close this without blocking.', 'Abbrechen würde das schließen, ohne zu blockieren.')],
        'bk-confirm', 'block-ok', t('"Block" is the red button.', '„Blockieren“ ist der rote Knopf.'), right);
      successText = t(`${who} can no longer send you messages. To report them too, open their profile again and choose "Report User Profile", or press and hold a message and choose "Report Message".`, `${who} kann Ihnen keine Nachrichten mehr senden. Um die Person auch zu melden, öffnen Sie ihr Profil erneut und wählen „Nutzerprofil melden“, oder halten Sie eine Nachricht gedrückt und wählen „Nachricht melden“.`);
      break;
  }

  if (!successText) {
    successText = t('It can no longer send you messages or call you in this app, and the app was told about it. Blocked someone by mistake? You can unblock them in the app\'s settings, under privacy.', 'Der Absender kann Ihnen in dieser App keine Nachrichten mehr senden und Sie nicht anrufen, und die App weiß Bescheid. Aus Versehen blockiert? In den Einstellungen der App, unter Datenschutz, heben Sie es wieder auf.');
  }
  const n = steps.length;
  const sender = byNumber ? t('a number you do not know', 'einer Nummer, die Sie nicht kennen') : t('someone you do not know', 'jemandem, den Sie nicht kennen');
  return {
    title: reports ? t(`${appName}: Block and Report a Stranger`, `${appName}: Fremde blockieren und melden`) : t(`${appName}: Block a Stranger`, `${appName}: Fremde blockieren`),
    description: reports
      ? t('A stranger writes to you, perhaps with a scam. Practise blocking and reporting them, so they cannot write to you again.', 'Eine fremde Person schreibt Ihnen, vielleicht mit einem Betrug. Üben Sie, sie zu blockieren und zu melden, damit sie Ihnen nicht mehr schreiben kann.')
      : t(`A stranger writes to you, perhaps with a scam. Practise blocking them in ${appName}, step by step, so they cannot write to you again.`, `Eine fremde Person schreibt Ihnen, vielleicht mit einem Betrug. Üben Sie Schritt für Schritt, sie in ${appName} zu blockieren, damit sie Ihnen nicht mehr schreiben kann.`),
    introText: t(`A message arrives from ${sender}. You will ${reports ? 'block and report' : 'block'} them in ${n} steps. ${youKnow}`, `Eine Nachricht kommt von ${sender}. Sie ${reports ? 'blockieren und melden' : 'blockieren'} die Person in ${n} Schritten. ${youKnow}`),
    successTitle: byNumber ? t('Well done! The number is blocked.', 'Gut gemacht! Die Nummer ist blockiert.') : t('Well done! The stranger is blocked.', 'Gut gemacht! Die fremde Person ist blockiert.'),
    successText: `${successText} ${t('This was only practice.', 'Das war nur eine Übung.')}`,
    tags: [t('Block', 'Blockieren'), ...(reports ? [t('Report', 'Melden')] : []), byNumber ? t('Unknown number', 'Unbekannte Nummer') : t('Stranger', 'Fremde'), t('Safety', 'Sicherheit')],
    labels,
    steps,
  };
}

/**
 * Text lessons that apply to every messaging app: choosing an app, privacy
 * settings in chats, and group chats. Shown under "Good to know" on #/messaging.
 */
import { IMAGES } from '../assets/images';
import type { Language, Tutorial } from '../types';

export function generalMessagingLessons(lang: Language): Tutorial[] {
  const en = lang === 'en';
  const t = (a: string, b: string) => (en ? a : b);
  const shared = {
    categoryId: 'messaging',
    categoryTitle: t('Messaging apps', 'Nachrichten-Apps'),
    difficulty: t('Easy', 'Einfach') as Tutorial['difficulty'],
    image: IMAGES.topicWhatsappPhone,
  };
  return [
    {
      ...shared,
      id: 'send-photo-overview',
      title: t('Send a Photo from Your Phone: Which Way?', 'Ein Foto vom Handy verschicken: Welcher Weg?'),
      description: t('WhatsApp, email or text message: which way suits the person you want to send a photo to, and where to practise it.', 'WhatsApp, E-Mail oder SMS: welcher Weg zu der Person passt, der Sie ein Foto schicken möchten, und wo Sie ihn üben.'),
      durationMinutes: 4,
      tags: [t('Photo', 'Foto'), t('WhatsApp', 'WhatsApp'), t('Email', 'E-Mail')],
      steps: [
        {
          stepNumber: 1, title: t('Which way suits you?', 'Welcher Weg passt?'), lead: t('It depends on who should get the photo.', 'Es kommt darauf an, wer das Foto bekommen soll.'),
          paragraphs: [
            t('Does the person use WhatsApp or another messaging app? Then send the photo in a chat. It is the quickest way, and it costs nothing extra.', 'Nutzt die Person WhatsApp oder eine andere Nachrichten-App? Dann schicken Sie das Foto in einem Chat. Das ist der schnellste Weg und kostet nichts extra.'),
            t('Does the person not use messaging apps, or would you like to send several photos with a longer text? Then use email.', 'Nutzt die Person keine Nachrichten-Apps, oder möchten Sie mehrere Fotos mit einem längeren Text schicken? Dann nehmen Sie die E-Mail.'),
            t('Every mobile phone can also receive a photo by text message (MMS). Depending on your contract, it can cost a little.', 'Jedes Handy kann ein Foto auch per SMS empfangen (MMS). Je nach Vertrag kann das etwas kosten.'),
          ],
        },
        {
          stepNumber: 2, title: t('In WhatsApp or another messaging app', 'In WhatsApp oder einer anderen Nachrichten-App'), lead: t('Open the chat, tap the paper clip or the plus, choose the photo and send it.', 'Öffnen Sie den Chat, tippen Sie auf die Büroklammer oder das Plus, wählen Sie das Foto und senden Sie es.'),
          paragraphs: [
            t('Before sending you can add a few words, for example "Our garden today".', 'Vor dem Senden können Sie ein paar Worte dazuschreiben, zum Beispiel „Unser Garten heute“.'),
            t('Practise it step by step on a phone screen that looks like WhatsApp. Nothing is really sent.', 'Üben Sie es Schritt für Schritt auf einem Bildschirm, der wie WhatsApp aussieht. Es wird nichts wirklich gesendet.'),
          ],
          links: [
            { label: t('Practise: WhatsApp: Send a Photo', 'Üben: WhatsApp: Ein Foto senden'), page: 'tutorial-detail', tutorialId: 'whatsapp-photo' },
            { label: t('Other messaging apps', 'Andere Nachrichten-Apps'), page: 'nachrichten-apps' },
          ],
        },
        {
          stepNumber: 3, title: t('By email', 'Per E-Mail'), lead: t('Add the photo as an attachment.', 'Fügen Sie das Foto als Anhang hinzu.'),
          paragraphs: [
            t('Write a new email, tap the paper clip, choose the photo, and send the email as usual.', 'Schreiben Sie eine neue E-Mail, tippen Sie auf die Büroklammer, wählen Sie das Foto, und senden Sie die E-Mail wie gewohnt.'),
            t('Choose your email service to practise it on a screen that looks like it: Gmail, Outlook, GMX, WEB.DE and more.', 'Wählen Sie Ihren E-Mail-Dienst, um es auf einem passenden Bildschirm zu üben: Gmail, Outlook, GMX, WEB.DE und mehr.'),
          ],
          links: [
            { label: t('Practise: Gmail: Send a Photo by Email', 'Üben: Gmail: Ein Foto per E-Mail senden'), page: 'tutorial-detail', tutorialId: 'gmail-attach' },
            { label: t('Other email services', 'Andere E-Mail-Dienste'), page: 'email-apps' },
          ],
        },
        {
          stepNumber: 4, title: t('Start from the photo itself', 'Beim Foto selbst beginnen'), lead: t('This works with every app.', 'Das klappt mit jeder App.'),
          paragraphs: [
            t('Open the Photos or Gallery app and tap the photo. Then tap the share symbol: a square with an arrow on the iPhone, three connected dots on Android.', 'Öffnen Sie die App Fotos oder Galerie und tippen Sie auf das Foto. Tippen Sie dann auf das Teilen-Symbol: ein Quadrat mit Pfeil am iPhone, drei verbundene Punkte bei Android.'),
            t('Now choose WhatsApp, Mail or Messages, and then the person.', 'Wählen Sie jetzt WhatsApp, Mail oder Nachrichten, und dann die Person.'),
          ],
          tip: t('Photos of other people: ask them first before you send them on.', 'Fotos von anderen Menschen: Fragen Sie sie, bevor Sie sie weiterschicken.'),
        },
      ],
    },
    {
      ...shared,
      id: 'messaging-choose-app',
      title: t('Which Messaging App? A Short Overview', 'Welche Nachrichten-App? Ein kurzer Überblick'),
      description: t('WhatsApp, Signal, SMS and more: what they have in common, how they differ, and what they cost.', 'WhatsApp, Signal, SMS und mehr: was sie gemeinsam haben, wie sie sich unterscheiden und was sie kosten.'),
      durationMinutes: 5,
      tags: [t('Messaging', 'Nachrichten'), t('Basics', 'Grundlagen')],
      steps: [
        {
          stepNumber: 1, title: t('Use the app your family uses', 'Nutzen Sie die App Ihrer Familie'), lead: t('You can only write to people who have the same app.', 'Sie können nur Menschen schreiben, die dieselbe App haben.'),
          paragraphs: [
            t('A WhatsApp message only reaches people who also use WhatsApp. So the best app is the one your family and friends already use.', 'Eine WhatsApp-Nachricht erreicht nur Menschen, die auch WhatsApp nutzen. Die beste App ist also die, die Ihre Familie und Ihre Freunde schon nutzen.'),
            t('In Germany that is usually WhatsApp. Some families prefer Signal or Threema, because these apps collect less data.', 'In Deutschland ist das meist WhatsApp. Manche Familien nutzen lieber Signal oder Threema, weil diese Apps weniger Daten sammeln.'),
            t('You can have several apps on one phone. Each one shows its own chats.', 'Sie können mehrere Apps auf einem Handy haben. Jede zeigt ihre eigenen Chats.'),
          ],
          tip: t('Ask your family: "Which app do you use to write to each other?"', 'Fragen Sie Ihre Familie: „Mit welcher App schreibt ihr euch?“'),
        },
        {
          stepNumber: 2, title: t('Apps and SMS: the difference', 'Apps und SMS: der Unterschied'), lead: t('Apps send over the internet, SMS over the phone network.', 'Apps senden über das Internet, SMS über das Handynetz.'),
          paragraphs: [
            t('Messaging apps need the internet, either your Wi-Fi or the mobile data of your contract. Messages, photos and calls cost nothing extra.', 'Nachrichten-Apps brauchen Internet, entweder Ihr WLAN oder die mobilen Daten Ihres Vertrags. Nachrichten, Fotos und Anrufe kosten nichts extra.'),
            t('An SMS works without internet and reaches every mobile phone, even a very simple one. Many contracts include SMS, otherwise each one costs a few cents.', 'Eine SMS funktioniert ohne Internet und erreicht jedes Handy, auch ein ganz einfaches. Viele Verträge enthalten SMS, sonst kostet jede ein paar Cent.'),
            t('On an iPhone, messages between iPhones are blue (iMessage, over the internet). Green bubbles are SMS.', 'Auf dem iPhone sind Nachrichten zwischen iPhones blau (iMessage, über das Internet). Grüne Blasen sind SMS.'),
          ],
        },
        {
          stepNumber: 3, title: t('Getting started with a new app', 'Mit einer neuen App beginnen'), lead: t('Install it from the official store and confirm your phone number.', 'Installieren Sie sie aus dem offiziellen Store, und bestätigen Sie Ihre Telefonnummer.'),
          paragraphs: [
            t('Download the app from the App Store on an iPhone or the Google Play Store on Android. Most messaging apps are free.', 'Laden Sie die App aus dem App Store am iPhone oder aus dem Google Play Store bei Android. Die meisten Nachrichten-Apps sind kostenlos.'),
            t('The app sends you a code by SMS to check that the number is yours. Type it in, and you are ready.', 'Die App schickt Ihnen einen Code per SMS, um zu prüfen, dass die Nummer Ihnen gehört. Tippen Sie ihn ein, und Sie sind fertig.'),
            t('The app may ask to see your contacts. If you allow it, it shows which of your contacts already use the app.', 'Die App fragt vielleicht nach Ihren Kontakten. Erlauben Sie es, zeigt sie, wer von Ihren Kontakten die App schon nutzt.'),
          ],
          warning: t('The code from the SMS is only for you. Never send it to anyone, even if they say it was sent by mistake.', 'Der Code aus der SMS ist nur für Sie. Schicken Sie ihn nie jemandem, auch wenn es heißt, er sei aus Versehen gekommen.'),
        },
      ],
    },
    {
      ...shared,
      id: 'messaging-privacy',
      title: t('Chat Privacy: Ticks, Last Seen and Profile Photo', 'Privatsphäre im Chat: Häkchen, zuletzt online und Profilbild'),
      description: t('Decide what others can see about you, and what to do with messages from strangers.', 'Entscheiden Sie, was andere über Sie sehen, und was Sie mit Nachrichten von Fremden tun.'),
      durationMinutes: 6,
      tags: [t('Messaging', 'Nachrichten'), t('Privacy', 'Privatsphäre')],
      steps: [
        {
          stepNumber: 1, title: t('What others can see', 'Was andere sehen können'), lead: t('Your profile photo, your name and when you were last online.', 'Ihr Profilbild, Ihr Name und wann Sie zuletzt online waren.'),
          paragraphs: [
            t('In many apps, anyone who has your number can see your profile photo and a short info text. Some also see "last seen" with a time.', 'In vielen Apps sieht jeder, der Ihre Nummer hat, Ihr Profilbild und einen kurzen Infotext. Manche sehen auch „zuletzt online“ mit Uhrzeit.'),
            t('Read receipts show the sender that you have read a message. In WhatsApp these are the two blue ticks.', 'Lesebestätigungen zeigen dem Absender, dass Sie eine Nachricht gelesen haben. In WhatsApp sind das die zwei blauen Häkchen.'),
          ],
        },
        {
          stepNumber: 2, title: t('Change the settings', 'Die Einstellungen ändern'), lead: t('You decide who sees what.', 'Sie entscheiden, wer was sieht.'),
          paragraphs: [
            t('Open the settings of the app and look for "Privacy". In WhatsApp: Settings, Privacy.', 'Öffnen Sie die Einstellungen der App, und suchen Sie „Datenschutz“ oder „Privatsphäre“. In WhatsApp: Einstellungen, Datenschutz.'),
            t('For profile photo, info and last seen, choose "My contacts". Then only people you have saved can see them.', 'Wählen Sie für Profilbild, Info und Zuletzt online „Meine Kontakte“. Dann sehen nur Menschen, die Sie gespeichert haben, diese Angaben.'),
            t('You can switch off read receipts. Then you also no longer see whether others have read your messages.', 'Lesebestätigungen können Sie ausschalten. Dann sehen Sie aber auch nicht mehr, ob andere Ihre Nachrichten gelesen haben.'),
          ],
          tip: t('Choose a profile photo that does not show your house, your car number plate or your grandchildren.', 'Wählen Sie ein Profilbild, das nicht Ihr Haus, Ihr Autokennzeichen oder Ihre Enkel zeigt.'),
        },
        {
          stepNumber: 3, title: t('Messages from strangers', 'Nachrichten von Fremden'), lead: t('Do not reply, block, and report.', 'Nicht antworten, blockieren und melden.'),
          paragraphs: [
            t('When an unknown number writes to you, many apps show "Block" and "Report" at the bottom of the chat.', 'Schreibt Ihnen eine unbekannte Nummer, zeigen viele Apps unten im Chat „Blockieren“ und „Melden“.'),
            t('A blocked number can no longer write to you or call you in the app. The other person is not told.', 'Eine blockierte Nummer kann Ihnen in der App nicht mehr schreiben oder Sie anrufen. Die andere Person erfährt das nicht.'),
            t('Being added to a group by strangers? In the privacy settings, under "Groups", choose "My contacts".', 'Werden Sie von Fremden in Gruppen eingeladen? Wählen Sie in den Datenschutz-Einstellungen unter „Gruppen“ „Meine Kontakte“.'),
          ],
          warning: t('Never send money or codes to someone you only know from a chat.', 'Senden Sie nie Geld oder Codes an jemanden, den Sie nur aus einem Chat kennen.'),
        },
      ],
    },
    {
      ...shared,
      id: 'messaging-groups',
      title: t('Group Chats Without Stress: Mute, Leave, Stay Polite', 'Gruppenchats ohne Stress: stummschalten, verlassen, freundlich bleiben'),
      description: t('Family groups, club groups, neighbour groups. How to keep the overview and the peace.', 'Familiengruppe, Vereinsgruppe, Nachbarschaftsgruppe. So behalten Sie den Überblick und Ihre Ruhe.'),
      durationMinutes: 5,
      tags: [t('Messaging', 'Nachrichten'), t('Groups', 'Gruppen')],
      steps: [
        {
          stepNumber: 1, title: t('Too many messages? Mute the group', 'Zu viele Nachrichten? Gruppe stummschalten'), lead: t('Your phone stays quiet, and you read when you have time.', 'Ihr Handy bleibt still, und Sie lesen, wann Sie Zeit haben.'),
          paragraphs: [
            t('Open the group and tap its name at the top. Look for "Mute" or "Notifications", and choose how long, for example "Always".', 'Öffnen Sie die Gruppe, und tippen Sie oben auf ihren Namen. Suchen Sie „Stummschalten“ oder „Benachrichtigungen“, und wählen Sie die Dauer, zum Beispiel „Immer“.'),
            t('You still receive every message. Only the sound and the pop-up message stop.', 'Sie bekommen weiterhin jede Nachricht. Nur Ton und Hinweis fallen weg.'),
          ],
          tip: t('If someone mentions you with @ and your name, many apps still let you know.', 'Erwähnt Sie jemand mit @ und Ihrem Namen, sagen Ihnen viele Apps trotzdem Bescheid.'),
        },
        {
          stepNumber: 2, title: t('Good manners in groups', 'Gute Umgangsformen in Gruppen'), lead: t('Everyone reads along.', 'Alle lesen mit.'),
          paragraphs: [
            t('A message in a group goes to everyone in it. Personal matters are better sent to one person directly.', 'Eine Nachricht in einer Gruppe geht an alle darin. Persönliches schicken Sie besser direkt an eine Person.'),
            t('Not everyone wants to be in every group. Ask first before you add someone.', 'Nicht jeder möchte in jeder Gruppe sein. Fragen Sie, bevor Sie jemanden hinzufügen.'),
            t('Chain letters, warnings "to forward to everyone" and miracle cures are often untrue. Do not forward them.', 'Kettenbriefe, Warnungen „bitte an alle weiterleiten“ und Wundermittel stimmen oft nicht. Leiten Sie sie nicht weiter.'),
          ],
        },
        {
          stepNumber: 3, title: t('Leaving a group', 'Eine Gruppe verlassen'), lead: t('That is allowed, and it is not rude.', 'Das ist erlaubt und nicht unhöflich.'),
          paragraphs: [
            t('Tap the group name at the top, scroll down and tap "Exit group" or "Leave group".', 'Tippen Sie oben auf den Gruppennamen, scrollen Sie nach unten, und tippen Sie auf „Gruppe verlassen“.'),
            t('In many apps the others see a short note that you have left. A friendly goodbye message first is a nice gesture.', 'In vielen Apps sehen die anderen einen kurzen Hinweis, dass Sie gegangen sind. Eine freundliche Abschiedsnachricht vorher ist eine nette Geste.'),
          ],
          tip: t('If you only want peace and quiet, muting is enough. Then you stay in the group.', 'Wenn Sie nur Ruhe möchten, reicht Stummschalten. Dann bleiben Sie in der Gruppe.'),
        },
      ],
    },
  ];
}

/**
 * All guided-practice lessons, in English and German. The messaging lessons are
 * generated per app, so every app shows its own real sequence of taps. Interfaces
 * change with app updates, so check these flows against the real apps now and then.
 */
import { approvalNote, bankingTasks, bankWhere, generalBankingLessons } from './bankingTasks';
import { emailExtraLabels, emailTasks, generalEmailLessons } from './emailTasks';
import { moreGeneralSocialLessons, socialTasks } from './socialTasks';
import { desktopLesson } from './desktopLessons';
import { IMAGES } from '../assets/images';
import { Tutorial, TutorialStep, Language } from '../types';
import { APP_IDS, appInfo, appStyle, type AppId } from '../components/practice/messaging/apps';
import { SERVICES, Service } from './services';
import { generalSocialLessons, socialLessons } from './socialLessons';
import { aiLessons } from './aiLessons';

const common = {
  en: {
    tapHere: 'Tap here',
    you: 'You', eva: 'Eva', chipsWa: 'All|Unread|Favourites|Groups', tabsTg: 'All|Family|Groups', tabsThreema: 'Contacts|Messages|Groups', createStory: 'Story', messagesTitle: 'Messages', searchConversations: 'Search conversations', startChat: 'Start chat', chatsTitle: 'Chats', wechatTitle: 'WeChat', directMessages: 'Messages', chatTitle: 'Chat', messageWord: 'Message', emoji: 'Emoji',
    replyWord: 'Reply', forwardWord: 'Forward', copyWord: 'Copy', deleteWord: 'Delete', newGroup: 'New group', newContact: 'New contact', addPeople: 'Tap the people you want to add', nextWord: 'Next', createWord: 'Create', groupNameLabel: 'Group name', groupNameHint: 'Type a name', groupMembers: 'Members: Anna, Peter, You', defaultGroup: 'Family trip', groupCreated: 'You created this group', recordingNote: 'Recording. In the real app, letting go usually sends it. Here, tap send.', replyVoice: 'Lovely to hear your voice!',
    suggestG1: 'Family trip', suggestG2: 'Grandchildren', suggestG3: 'Birthday',
    phoneLabel: 'Simulated phone screen',
    phoneBadge: 'Practice, not real',
    family: 'Family', familyLast: 'See you on Sunday!', anna: 'Anna', annaLast: 'Thank you for the recipe.',
    peter: 'Peter', club: 'Bowling club', clubLast: 'Next Tuesday at 6 pm.', yesterday: 'Yesterday', today: 'Today',
    members: 'Anna, Peter, You', isTyping: 'Anna is typing...', edit: 'Edit',
    search: 'Search', menu: 'Menu', newChat: 'New chat', back: 'Back', videoCall: 'Video call', voiceCall: 'Voice call',
    bubbleOne: 'Hello everyone!', bubbleTwo: 'How is the garden doing?',
    camera: 'Camera', microphone: 'Microphone', like: 'Thumbs up', send: 'Send', close: 'Close', crop: 'Crop',
    gallery: 'Gallery', photosMenu: 'Photos', location: 'Location', contact: 'Contact', document: 'Document', audio: 'Audio',
    recents: 'Recent photos', caption: 'Add a caption', captionShort: 'Add words',
    photoFlowers: 'Flowers', photoWoman: 'On the sofa', photoCake: 'Cake', photoMountain: 'Mountain', photoMan: 'At the laptop', photoSun: 'Sunset',
    defaultMessage: 'Hello everyone!', replyPhoto: 'What lovely flowers! Thank you.', replyMessage: 'Nice to hear from you!',
    statusSent: 'Sent', statusDelivered: 'Delivered', statusRead: 'Read',
    suggest1: 'Hello', suggest2: 'Thank you', suggest3: 'See you soon',
    space: 'space', deleteKey: 'Delete letter', shift: 'Capital letter',
    calling: 'Ringing...', inCall: 'In call', noRealCall: 'Practice only: nobody is really being called.',
    speaker: 'Speaker', mute: 'Microphone off', hangup: 'End call', callEnded: 'Video call ended',
  },
  de: {
    tapHere: 'Hier tippen',
    you: 'Sie', eva: 'Eva', chipsWa: 'Alle|Ungelesen|Favoriten|Gruppen', tabsTg: 'Alle|Familie|Gruppen', tabsThreema: 'Kontakte|Nachrichten|Gruppen', createStory: 'Story', messagesTitle: 'Nachrichten', searchConversations: 'Unterhaltungen suchen', startChat: 'Chat starten', chatsTitle: 'Chats', wechatTitle: 'WeChat', directMessages: 'Nachrichten', chatTitle: 'Chat', messageWord: 'Nachricht', emoji: 'Emoji',
    replyWord: 'Antworten', forwardWord: 'Weiterleiten', copyWord: 'Kopieren', deleteWord: 'Löschen', newGroup: 'Neue Gruppe', newContact: 'Neuer Kontakt', addPeople: 'Tippen Sie auf die Personen, die Sie hinzufügen möchten', nextWord: 'Weiter', createWord: 'Erstellen', groupNameLabel: 'Gruppenname', groupNameHint: 'Namen eingeben', groupMembers: 'Mitglieder: Anna, Peter, Sie', defaultGroup: 'Familienausflug', groupCreated: 'Sie haben diese Gruppe erstellt', recordingNote: 'Aufnahme läuft. In der echten App wird sie beim Loslassen meist gesendet. Hier tippen Sie auf Senden.', replyVoice: 'Schön, Ihre Stimme zu hören!',
    suggestG1: 'Familienausflug', suggestG2: 'Enkelkinder', suggestG3: 'Geburtstag',
    phoneLabel: 'Simulierter Handy-Bildschirm',
    phoneBadge: 'Übung, nicht echt',
    family: 'Familie', familyLast: 'Bis Sonntag!', anna: 'Anna', annaLast: 'Danke für das Rezept.',
    peter: 'Peter', club: 'Kegelclub', clubLast: 'Nächsten Dienstag um 18 Uhr.', yesterday: 'Gestern', today: 'Heute',
    members: 'Anna, Peter, Sie', isTyping: 'Anna schreibt...', edit: 'Bearbeiten',
    search: 'Suchen', menu: 'Menü', newChat: 'Neuer Chat', back: 'Zurück', videoCall: 'Videoanruf', voiceCall: 'Sprachanruf',
    bubbleOne: 'Hallo zusammen!', bubbleTwo: 'Was macht der Garten?',
    camera: 'Kamera', microphone: 'Mikrofon', like: 'Daumen hoch', send: 'Senden', close: 'Schließen', crop: 'Zuschneiden',
    gallery: 'Galerie', photosMenu: 'Fotos', location: 'Standort', contact: 'Kontakt', document: 'Dokument', audio: 'Audio',
    recents: 'Neueste Fotos', caption: 'Text hinzufügen', captionShort: 'Text hinzufügen',
    photoFlowers: 'Blumen', photoWoman: 'Auf dem Sofa', photoCake: 'Kuchen', photoMountain: 'Berg', photoMan: 'Am Laptop', photoSun: 'Sonnenuntergang',
    defaultMessage: 'Hallo zusammen!', replyPhoto: 'Was für schöne Blumen! Danke.', replyMessage: 'Schön, von Ihnen zu hören!',
    statusSent: 'Gesendet', statusDelivered: 'Zugestellt', statusRead: 'Gelesen',
    suggest1: 'Hallo', suggest2: 'Danke', suggest3: 'Bis bald',
    space: 'Leerzeichen', deleteKey: 'Buchstabe löschen', shift: 'Großbuchstabe',
    calling: 'Es klingelt...', inCall: 'Im Gespräch', noRealCall: 'Nur Übung: Es wird niemand wirklich angerufen.',
    speaker: 'Lautsprecher', mute: 'Mikrofon aus', hangup: 'Auflegen', callEnded: 'Videoanruf beendet',
  },
};

/** What a wrong tap was, for the calm hint: "That was the camera." */
const tapNames: Record<string, { en: string; de: string }> = {
  'chat-anna': { en: 'the chat with Anna', de: 'der Chat mit Anna' },
  'chat-club': { en: 'the bowling club', de: 'der Kegelclub' },
  search: { en: 'the search', de: 'die Suche' },
  menu: { en: 'the menu', de: 'das Menü' },
  'new-chat': { en: 'the button for a new chat', de: 'der Knopf für einen neuen Chat' },
  back: { en: 'the way back', de: 'der Weg zurück' },
  'video-call': { en: 'the video call', de: 'der Videoanruf' },
  'voice-call': { en: 'the voice call', de: 'der Sprachanruf' },
  camera: { en: 'the camera', de: 'die Kamera' },
  microphone: { en: 'the microphone, for voice messages', de: 'das Mikrofon für Sprachnachrichten' },
  like: { en: 'the thumbs up', de: 'der Daumen hoch' },
  'message-field': { en: 'the text field, for writing', de: 'das Textfeld zum Schreiben' },
  attach: { en: 'the button for adding photos', de: 'der Knopf für Fotos' },
  'att-camera': { en: 'the camera', de: 'die Kamera' },
  'att-location': { en: 'your location', de: 'Ihr Standort' },
  'att-contact': { en: 'a contact', de: 'ein Kontakt' },
  'att-document': { en: 'a document', de: 'ein Dokument' },
  'att-audio': { en: 'audio', de: 'Audio' },
  'close-gallery': { en: 'the button that closes your photos', de: 'der Knopf, der Ihre Fotos schließt' },
  'close-preview': { en: 'the button that closes the photo', de: 'der Knopf, der das Foto schließt' },
  crop: { en: 'the button for cropping the photo', de: 'der Knopf zum Zuschneiden' },
  'caption-field': { en: 'the field for adding words. You do not have to', de: 'das Feld für Text. Das müssen Sie nicht nutzen' },
  'photo-woman': { en: 'another photo. In real life you could send it', de: 'ein anderes Foto. Im echten Leben könnten Sie es senden' },
  'photo-cake': { en: 'the cake. In real life you could send it', de: 'der Kuchen. Im echten Leben könnten Sie ihn senden' },
  'photo-mountain': { en: 'the mountain. In real life you could send it', de: 'der Berg. Im echten Leben könnten Sie ihn senden' },
  'photo-man': { en: 'another photo. In real life you could send it', de: 'ein anderes Foto. Im echten Leben könnten Sie es senden' },
  'photo-sun': { en: 'the sunset. In real life you could send it', de: 'der Sonnenuntergang. Im echten Leben könnten Sie ihn senden' },
  emoji: { en: 'the button for emojis', de: 'der Knopf für Emojis' },
  'bubble-anna': { en: 'Anna\'s message', de: 'Annas Nachricht' },
  'menu-forward': { en: 'Forward, which sends it to someone else', de: 'Weiterleiten, das schickt sie an jemand anderen' },
  'menu-copy': { en: 'Copy', de: 'Kopieren' },
  'menu-delete': { en: 'Delete', de: 'Löschen' },
  'rec-delete': { en: 'the bin, which throws the recording away', de: 'der Papierkorb, der die Aufnahme verwirft' },
  'new-contact': { en: 'the button for a new contact', de: 'der Knopf für einen neuen Kontakt' },
  'pick-eva': { en: 'Eva. For this practice, please choose Anna and Peter', de: 'Eva. Für diese Übung wählen Sie bitte Anna und Peter' },
  'pick-anna': { en: 'Anna, she is already chosen', de: 'Anna, sie ist schon ausgewählt' },
  speaker: { en: 'the speaker', de: 'der Lautsprecher' },
  flip: { en: 'the camera', de: 'die Kamera' },
  mute: { en: 'the button for your microphone', de: 'der Knopf für Ihr Mikrofon' },
};

function hintsFor(lang: Language, where: string): Record<string, string> {
  const start = lang === 'en' ? 'That was' : 'Das war';
  return Object.fromEntries(Object.entries(tapNames).map(([id, name]) => [id, `${start} ${name[lang]}. ${where}`]));
}

function practiceStep(
  lang: Language,
  stepNumber: number,
  title: string,
  lead: string,
  paragraphs: string[],
  screen: string,
  targetId: string,
  where: string,
  successText: string,
  options: { field?: string; requiresText?: boolean; hold?: boolean } = {},
): TutorialStep {
  return {
    stepNumber,
    title,
    lead,
    paragraphs,
    practice: {
      ...options,
      screen,
      targetId,
      successText,
      hints: hintsFor(lang, where),
      fallbackHint: where,
      showMeText: lang === 'en' ? `The frame shows where to tap. ${where}` : `Der Rahmen zeigt, wohin Sie tippen. ${where}`,
    },
  };
}

function messagingLessons(lang: Language, app: AppId, platform: 'iphone' | 'android' = 'android'): Tutorial[] {
  const isEn = lang === 'en';
  const t = (en: string, de: string) => (isEn ? en : de);
  const info = appInfo(app, platform);
  const style = appStyle(app, platform);
  const name = info.name;
  const whereFamily = t('The family chat is the line called "Family".', 'Der Familien-Chat ist die Zeile „Familie“.');
  const whereSend = t(
    `The send button is ${style.preview === 'full' ? 'round, at the bottom right' : 'at the bottom right, next to the photo'}.`,
    `Der Senden-Knopf ist ${style.preview === 'full' ? 'rund und unten rechts' : 'unten rechts neben dem Foto'}.`,
  );
  const attachName = t(info.attachEn, info.attachDe);
  const attachCap = attachName.charAt(0).toUpperCase() + attachName.slice(1);

  const labels: Record<string, string> = {
    ...common[lang],
    appTitle: name,
    field: t(info.fieldEn, info.fieldDe),
    attach: attachCap,
  };

  const base = (kind: string, id: string, title: string, description: string, duration: number, nextTutorialId: string, successTitle: string, successText: string, notice: string, introText: string, steps: TutorialStep[]): Tutorial => ({
    id,
    title,
    categoryId: 'messaging',
    categoryTitle: t('Messaging Apps', 'Nachrichten-Apps'),
    description,
    durationMinutes: duration,
    difficulty: t('Easy', 'Einfach') as Tutorial['difficulty'],
    image: IMAGES.topicWhatsappPhone,
    tags: [name, t('Practice', 'Übung'), t('Family', 'Familie'), ...(kind === 'photo' ? [t('Photo', 'Foto')] : kind === 'call' ? [t('Video call', 'Videoanruf')] : [t('Message', 'Nachricht')])],
    isPopular: id === 'whatsapp-photo',
    practice: {
      screenId: 'messenger',
      appId: app,
      kind,
      notice,
      introTitle: t('What you will practise', 'Das üben Sie hier'),
      introText,
      successTitle,
      successText,
      nextTutorialId,
      labels,
    },
    steps,
  });

  const noticeMessage = t('Practice mode: no real messages are sent.', 'Übungsmodus: Es werden keine echten Nachrichten gesendet.');
  const familyStep = (n: number, success: string) =>
    practiceStep(lang, n, t('Open the family chat', 'Öffnen Sie den Familien-Chat'), t('Tap the line called "Family".', 'Tippen Sie auf die Zeile „Familie“.'),
      [t('Your chats are listed one below the other. The small number shows how many new messages are waiting.', 'Ihre Chats stehen untereinander. Die kleine Zahl zeigt, wie viele neue Nachrichten warten.')],
      'list', 'chat-family', whereFamily, success);

  // Send a photo
  const photoSteps: TutorialStep[] = [familyStep(1, t('That was right. The family chat is open.', 'Das war richtig. Der Familien-Chat ist offen.'))];
  photoSteps.push(practiceStep(lang, 2, t(`Tap ${attachName}`, `Tippen Sie auf ${attachName}`), t(info.attachWhereEn, info.attachWhereDe),
    [t('With it you add a photo to your message.', 'Damit fügen Sie Ihrer Nachricht ein Foto hinzu.'), ...(info.noteEn ? [t(info.noteEn, info.noteDe ?? '')] : [])],
    'chat', 'attach', t(info.attachWhereEn, info.attachWhereDe),
    style.hasMenu ? t('That was right. A small menu has opened.', 'Das war richtig. Ein kleines Menü ist offen.') : t('That was right. Your photos are open.', 'Das war richtig. Ihre Fotos sind offen.')));
  if (style.hasMenu) {
    const menuName = app === 'imessage' || style.iosChrome ? t('Photos', 'Fotos') : t('Gallery', 'Galerie');
    const whereMenu = t(`"${menuName}" is the first line in the menu, with a purple circle.`, `„${menuName}“ ist die erste Zeile im Menü, mit einem lila Kreis.`);
    photoSteps.push(practiceStep(lang, 3, t(`Tap "${menuName}"`, `Tippen Sie auf „${menuName}“`), whereMenu,
      [t('Here you choose what you want to send. Your saved photos are in the gallery.', 'Hier wählen Sie, was Sie senden möchten. Ihre gespeicherten Fotos sind in der Galerie.')],
      'attach', 'gallery', whereMenu, t('That was right. Your photos are open.', 'Das war richtig. Ihre Fotos sind offen.')));
  }
  const whereFlowers = t('For this practice, please tap the flowers, at the top left.', 'Für diese Übung tippen Sie bitte auf die Blumen, oben links.');
  photoSteps.push(practiceStep(lang, photoSteps.length + 1, t('Choose a photo', 'Wählen Sie ein Foto'), t('Tap the photo with the flowers.', 'Tippen Sie auf das Foto mit den Blumen.'),
    [t('In real life you can choose any photo you like.', 'Im echten Leben können Sie jedes Foto wählen, das Ihnen gefällt.')],
    'gallery', 'photo-flowers', whereFlowers, t('That was right. You can check the photo now.', 'Das war richtig. Jetzt können Sie das Foto prüfen.')));
  photoSteps.push(practiceStep(lang, photoSteps.length + 1, t('Tap send', 'Tippen Sie auf Senden'),
    t(style.preview === 'full' ? 'Tap the round button at the bottom right.' : 'Tap the button at the bottom right.', style.preview === 'full' ? 'Tippen Sie unten rechts auf den runden Knopf.' : 'Tippen Sie unten rechts auf den Knopf.'),
    [t('You can see the photo before you send it. So you can check that it is the right one.', 'Sie sehen das Foto, bevor Sie es senden. So können Sie prüfen, ob es das richtige ist.')],
    style.preview === 'full' ? 'preview' : 'inline', 'send', whereSend, t('That was right.', 'Das war richtig.')));

  const statusExplain = style.status === 'ticks-blue'
    ? t('Watch the ticks: one grey tick means sent, two grey ticks mean delivered, two blue ticks mean read.', 'Achten Sie auf die Häkchen: ein graues Häkchen heißt gesendet, zwei graue heißen zugestellt, zwei blaue heißen gelesen.')
    : style.status === 'ticks-accent'
    ? t('Watch the ticks: one tick means sent, two ticks mean read.', 'Achten Sie auf die Häkchen: ein Häkchen heißt gesendet, zwei heißen gelesen.')
    : style.status === 'circle'
    ? t('The small circle next to the time shows that your message arrived.', 'Der kleine Kreis neben der Uhrzeit zeigt, dass Ihre Nachricht angekommen ist.')
    : t('The small word under the message shows that it arrived.', 'Das kleine Wort unter der Nachricht zeigt, dass sie angekommen ist.');

  const lessons: Tutorial[] = [
    base('message', `${app}-message`, t(`${name}: Send a Message`, `${name}: Eine Nachricht senden`),
      t(`Practise writing a message in ${name} on a simulated phone, with a keyboard that really types.`, `Üben Sie am simulierten Handy, in ${name} eine Nachricht zu schreiben, mit einer Tastatur, die wirklich tippt.`),
      4, `${app}-photo`, t('Well done! You sent a message.', 'Gut gemacht! Sie haben eine Nachricht gesendet.'),
      t(`${statusExplain} This was only practice, so nobody really received it.`, `${statusExplain} Das war nur eine Übung, es hat also niemand wirklich etwas erhalten.`),
      noticeMessage,
      t('You will write a short message to your family in 3 steps. You cannot break anything, and there is no time limit.', 'Sie schreiben Ihrer Familie in 3 Schritten eine kurze Nachricht. Sie können nichts kaputt machen, und es gibt kein Zeitlimit.'),
      [
        familyStep(1, t('That was right. The family chat is open.', 'Das war richtig. Der Familien-Chat ist offen.')),
        practiceStep(lang, 2, t('Tap the text field', 'Tippen Sie auf das Textfeld'), labels.field ? t(`Tap the field at the bottom that says "${labels.field}".`, `Tippen Sie unten auf das Feld „${labels.field}“.`) : t('Tap the white field at the bottom.', 'Tippen Sie unten auf das weiße Feld.'),
          [t('The keyboard then opens by itself.', 'Danach öffnet sich die Tastatur von selbst.')],
          'chat', 'message-field', t('The text field is at the bottom of the screen.', 'Das Textfeld ist unten auf dem Bildschirm.'), t('That was right. The keyboard is open.', 'Das war richtig. Die Tastatur ist offen.')),
        practiceStep(lang, 3, t('Write and send', 'Schreiben und senden'), t('Tap letters to write something, or tap a word above the letters. Then tap send.', 'Tippen Sie Buchstaben, oder tippen Sie ein Wort über den Buchstaben. Dann tippen Sie auf Senden.'),
          [t('A typing mistake is no problem: the key with the small cross deletes the last letter. The send button appears as soon as you have written something.', 'Ein Tippfehler ist kein Problem: Die Taste mit dem kleinen Kreuz löscht den letzten Buchstaben. Der Senden-Knopf erscheint, sobald Sie etwas geschrieben haben.')],
          'typing', 'send', t('First write something on the keyboard. Then the send button appears next to the text.', 'Schreiben Sie zuerst etwas auf der Tastatur. Dann erscheint der Senden-Knopf neben dem Text.'), t('That was right.', 'Das war richtig.'), { requiresText: true }),
      ]),
    base('photo', `${app}-photo`, t(`${name}: Send a Photo`, `${name}: Ein Foto senden`),
      t(`Practise sending a photo to your family in ${name} on a simulated phone. Mistakes are no problem, and nothing is really sent.`, `Üben Sie am simulierten Handy, Ihrer Familie in ${name} ein Foto zu schicken. Fehler sind kein Problem, und es wird nichts wirklich gesendet.`),
      5, app === 'whatsapp' ? 'whatsapp-message' : style.hasVideoCall ? `${app}-call` : `${app}-message`,
      t('Well done! You sent the photo.', 'Gut gemacht! Sie haben das Foto gesendet.'),
      t(`${statusExplain} This was only practice, so nobody really received it.`, `${statusExplain} Das war nur eine Übung, es hat also niemand wirklich etwas erhalten.`),
      noticeMessage,
      t(`You will send a photo to your family in ${photoSteps.length} steps. You cannot break anything, and there is no time limit.`, `Sie schicken Ihrer Familie in ${photoSteps.length} Schritten ein Foto. Sie können nichts kaputt machen, und es gibt kein Zeitlimit.`),
      photoSteps),
  ];

  // Harder tasks
  const youKnow = t('This task has more steps, but you cannot break anything, and there is no time limit.', 'Diese Aufgabe hat mehr Schritte, aber Sie können nichts kaputt machen, und es gibt kein Zeitlimit.');
  const wherePeter = t("Peter's message is the lowest one in the chat.", 'Peters Nachricht ist die unterste im Chat.');
  const whereMic = t('The microphone is at the bottom, near the text field.', 'Das Mikrofon ist unten beim Textfeld.');

  lessons.push(base('voice', `${app}-voice`, t(`${name}: Send a Voice Message`, `${name}: Eine Sprachnachricht senden`),
    t(`Speak instead of typing. Practise recording a voice message in ${name}.`, `Sprechen statt tippen. Üben Sie in ${name}, eine Sprachnachricht aufzunehmen.`),
    4, `${app}-message`, t('Well done! You sent a voice message.', 'Gut gemacht! Sie haben eine Sprachnachricht gesendet.'),
    t('The small play symbol lets others listen to it. This was only practice, and nothing was recorded.', 'Mit dem kleinen Play-Symbol können andere sie anhören. Das war nur eine Übung, und es wurde nichts aufgenommen.'),
    noticeMessage,
    t(`You will record a voice message in 3 steps. ${youKnow}`, `Sie nehmen in 3 Schritten eine Sprachnachricht auf. ${youKnow}`),
    [
      familyStep(1, t('That was right. The family chat is open.', 'Das war richtig. Der Familien-Chat ist offen.')),
      practiceStep(lang, 2, t('Press and hold the microphone', 'Halten Sie das Mikrofon gedrückt'), t('Put your finger on the microphone and keep it there for a moment.', 'Legen Sie den Finger auf das Mikrofon und lassen Sie ihn einen Moment dort.'),
        [t('On a real phone, the recording runs for as long as you hold it. Nothing is recorded here.', 'Am echten Handy läuft die Aufnahme, solange Sie gedrückt halten. Hier wird nichts aufgenommen.')],
        'chat', 'microphone', whereMic, t('That was right. It is recording.', 'Das war richtig. Die Aufnahme läuft.'), { hold: true }),
      practiceStep(lang, 3, t('Send the recording', 'Aufnahme senden'), t('Tap the send button. To throw it away, you would tap the bin.', 'Tippen Sie auf Senden. Zum Verwerfen würden Sie auf den Papierkorb tippen.'),
        [t('Made a mistake? A voice message can be thrown away before it is sent.', 'Versprochen? Eine Sprachnachricht lässt sich vor dem Senden verwerfen.')],
        'recording', 'send', t('The send button is at the bottom right.', 'Der Senden-Knopf ist unten rechts.'), t('That was right.', 'Das war richtig.')),
    ]));

  if (app !== 'sms') {
    lessons.push(base('reply', `${app}-reply`, t(`${name}: Answer One Specific Message`, `${name}: Auf eine bestimmte Nachricht antworten`),
      t('In a busy group chat, show exactly which message you are answering.', 'Zeigen Sie in einem vollen Gruppen-Chat genau, auf welche Nachricht Sie antworten.'),
      5, `${app}-voice`, t('Well done! You answered one specific message.', 'Gut gemacht! Sie haben auf eine bestimmte Nachricht geantwortet.'),
      t('Everyone can now see which message you meant. This was only practice.', 'Alle sehen jetzt, welche Nachricht Sie meinten. Das war nur eine Übung.'),
      noticeMessage,
      t(`You will answer Peter's question in 4 steps. ${youKnow}`, `Sie antworten in 4 Schritten auf Peters Frage. ${youKnow}`),
      [
        familyStep(1, t('That was right. The family chat is open.', 'Das war richtig. Der Familien-Chat ist offen.')),
        practiceStep(lang, 2, t("Press and hold Peter's message", 'Halten Sie Peters Nachricht gedrückt'), t('Put your finger on the message and keep it there for a moment.', 'Legen Sie den Finger auf die Nachricht und lassen Sie ihn einen Moment dort.'),
          [t('Pressing and holding opens extra choices in almost every app.', 'Gedrückt halten öffnet in fast jeder App weitere Möglichkeiten.')],
          'hold', 'bubble-peter', wherePeter, t('That was right. A menu has opened.', 'Das war richtig. Ein Menü ist offen.'), { hold: true }),
        practiceStep(lang, 3, t('Tap "Reply"', 'Tippen Sie auf „Antworten“'), t('Choose the first line in the menu.', 'Wählen Sie die erste Zeile im Menü.'),
          [t('Forward would send the message to someone else.', 'Weiterleiten würde die Nachricht an jemand anderen schicken.')],
          'msgmenu', 'menu-reply', t('"Reply" is the first line in the menu.', '„Antworten“ ist die erste Zeile im Menü.'), t('That was right. Now write your answer.', 'Das war richtig. Jetzt schreiben Sie Ihre Antwort.')),
        practiceStep(lang, 4, t('Write and send', 'Schreiben und senden'), t('Tap letters or a word above the letters. Then tap send.', 'Tippen Sie Buchstaben oder ein Wort über den Buchstaben. Dann tippen Sie auf Senden.'),
          [t("Above the field you can see Peter's message that you are answering.", 'Über dem Feld sehen Sie Peters Nachricht, auf die Sie antworten.')],
          'reply-typing', 'send', t('First write something on the keyboard. Then the send button appears.', 'Schreiben Sie zuerst etwas auf der Tastatur. Dann erscheint der Senden-Knopf.'), t('That was right.', 'Das war richtig.'), { requiresText: true }),
      ]));
  }

  if (app !== 'sms' && app !== 'imessage') {
    const whereNew = t('The button for a new chat has a pencil or a plus sign on it.', 'Der Knopf für einen neuen Chat zeigt einen Stift oder ein Pluszeichen.');
    lessons.push(base('group', `${app}-group`, t(`${name}: Create a Group`, `${name}: Eine Gruppe erstellen`),
      t('Write to several people at once. Create your own group, for example for the family.', 'Schreiben Sie mehreren Personen gleichzeitig. Erstellen Sie eine eigene Gruppe, zum Beispiel für die Familie.'),
      6, `${app}-reply`, t('Well done! You created a group.', 'Gut gemacht! Sie haben eine Gruppe erstellt.'),
      t('Everything you now write here reaches everyone in the group. Only add people you know. This was only practice, so no group was created.', 'Alles, was Sie jetzt hier schreiben, erreicht alle in der Gruppe. Fügen Sie nur Menschen hinzu, die Sie kennen. Das war nur eine Übung, es wurde keine Gruppe erstellt.'),
      t('Practice mode: no real group is created, and nobody is told.', 'Übungsmodus: Es wird keine echte Gruppe erstellt, und niemand wird benachrichtigt.'),
      t(`You will create a group with Anna and Peter in 6 steps. ${youKnow}`, `Sie erstellen in 6 Schritten eine Gruppe mit Anna und Peter. ${youKnow}`),
      [
        practiceStep(lang, 1, t('Start a new chat', 'Neuen Chat beginnen'), whereNew, [t('You find this in the chat list.', 'Das finden Sie in der Chat-Liste.')], 'list', 'new-chat', whereNew, t('That was right.', 'Das war richtig.')),
        practiceStep(lang, 2, t('Tap "New group"', 'Tippen Sie auf „Neue Gruppe“'), t('It is the first line.', 'Das ist die erste Zeile.'), [t('Some apps call it "Create group".', 'Manche Apps nennen es „Gruppe erstellen“.')], 'newchat', 'new-group', t('"New group" is the first line.', '„Neue Gruppe“ ist die erste Zeile.'), t('That was right. Now choose the people.', 'Das war richtig. Jetzt wählen Sie die Personen.')),
        practiceStep(lang, 3, t('Choose Anna', 'Wählen Sie Anna'), t('Tap the line with Anna.', 'Tippen Sie auf die Zeile mit Anna.'), [t('A check mark shows who is chosen.', 'Ein Häkchen zeigt, wer ausgewählt ist.')], 'pick0', 'pick-anna', t('Anna is the first line.', 'Anna ist die erste Zeile.'), t('That was right. Anna is chosen.', 'Das war richtig. Anna ist ausgewählt.')),
        practiceStep(lang, 4, t('Choose Peter', 'Wählen Sie Peter'), t('Tap the line with Peter.', 'Tippen Sie auf die Zeile mit Peter.'), [t('You can add as many people as you like.', 'Sie können beliebig viele Personen hinzufügen.')], 'pick1', 'pick-peter', t('Peter is the second line.', 'Peter ist die zweite Zeile.'), t('That was right. Peter is chosen.', 'Das war richtig. Peter ist ausgewählt.')),
        practiceStep(lang, 5, t('Tap "Next"', 'Tippen Sie auf „Weiter“'), t('The button is at the bottom right.', 'Der Knopf ist unten rechts.'), [t('Check first that the right people have a check mark.', 'Prüfen Sie zuerst, ob die richtigen Personen ein Häkchen haben.')], 'pick2', 'pick-next', t('"Next" is at the bottom right.', '„Weiter“ ist unten rechts.'), t('That was right. Now give it a name.', 'Das war richtig. Jetzt geben Sie ihr einen Namen.')),
        practiceStep(lang, 6, t('Name the group and create it', 'Gruppe benennen und erstellen'), t('Write a name, or tap a word above the letters. Then tap "Create".', 'Schreiben Sie einen Namen, oder tippen Sie ein Wort über den Buchstaben. Dann tippen Sie auf „Erstellen“.'), [t('Everyone in the group can see this name.', 'Alle in der Gruppe sehen diesen Namen.')], 'groupname', 'send', t('First write a name. Then the "Create" button appears.', 'Schreiben Sie zuerst einen Namen. Dann erscheint der Knopf „Erstellen“.'), t('That was right.', 'Das war richtig.'), { field: 'groupName', requiresText: true }),
      ]));
  }

  if (style.hasVideoCall) {
    const whereVideo = t('The video symbol is at the top right of the chat.', 'Das Video-Symbol ist oben rechts im Chat.');
    const whereEnd = t('The red button at the bottom right ends the call.', 'Der rote Knopf unten rechts beendet den Anruf.');
    lessons.push(base('call', `${app}-call`, t(`${name}: Make a Video Call`, `${name}: Einen Videoanruf machen`),
      t(`Practise starting and ending a video call in ${name}. Nobody is really called.`, `Üben Sie, in ${name} einen Videoanruf zu starten und zu beenden. Es wird niemand wirklich angerufen.`),
      3, `${app}-message`, t('Well done! You made a video call.', 'Gut gemacht! Sie haben einen Videoanruf gemacht.'),
      t('You can see the call in the chat afterwards. This was only practice, so nobody was really called.', 'Den Anruf sehen Sie danach im Chat. Das war nur eine Übung, es wurde also niemand wirklich angerufen.'),
      t('Practice mode: nobody is really called.', 'Übungsmodus: Es wird niemand wirklich angerufen.'),
      t('You will start and end a video call in 3 steps. You cannot break anything, and there is no time limit.', 'Sie starten und beenden in 3 Schritten einen Videoanruf. Sie können nichts kaputt machen, und es gibt kein Zeitlimit.'),
      [
        familyStep(1, t('That was right. The family chat is open.', 'Das war richtig. Der Familien-Chat ist offen.')),
        practiceStep(lang, 2, t('Tap the video symbol', 'Tippen Sie auf das Video-Symbol'), whereVideo,
          [t('It looks like a small film camera. The telephone next to it starts a call without a picture.', 'Es sieht aus wie eine kleine Filmkamera. Das Telefon daneben startet einen Anruf ohne Bild.')],
          'chat', 'video-call', whereVideo, t('That was right. It is ringing.', 'Das war richtig. Es klingelt.')),
        practiceStep(lang, 3, t('End the call', 'Beenden Sie den Anruf'), t('When you have finished talking, tap the red button.', 'Wenn Sie fertig gesprochen haben, tippen Sie auf den roten Knopf.'),
          [t('Take your time. The other buttons switch your microphone and camera on or off.', 'Nehmen Sie sich Zeit. Die anderen Knöpfe schalten Ihr Mikrofon und Ihre Kamera an oder aus.')],
          'call', 'hangup', whereEnd, t('That was right.', 'Das war richtig.')),
      ]));
  }
  return lessons;
}

/** Each bank's practice screens follow how that bank's app is organised (see BankingScreen). */
const BANK_LAYOUT: Record<string, string> = { sparkasse: 'action', volksbank: 'vr', deutschebank: 'db', commerzbank: 'cb', postbank: 'pb', ing: 'ing', dkb: 'dkb', n26: 'neo' };

function bankingLesson(lang: Language, bank?: Service, mode: 'transfer' | 'balance' = 'transfer'): Tutorial {
  const isEn = lang === 'en';
  const t = (en: string, de: string) => (isEn ? en : de);
  const layout = BANK_LAYOUT[bank?.id ?? ''] ?? 'classic';
  const hints = (where: string): Record<string, string> => ({
    statements: t(`That shows your past payments. ${where}`, `Dort sehen Sie Ihre bisherigen Zahlungen. ${where}`),
    account: t(`That opens your account. ${where}`, `Damit öffnen Sie Ihr Konto. ${where}`),
    transfer: t(`That starts a transfer. ${where}`, `Damit beginnen Sie eine Überweisung. ${where}`),
    'send-money': t(`That is for sending money. ${where}`, `Damit senden Sie Geld. ${where}`),
    standing: t(`A standing order pays the same amount regularly. ${where}`, `Ein Dauerauftrag zahlt regelmäßig denselben Betrag. ${where}`),
    'own-transfer': t(`That moves money between your own accounts. ${where}`, `Damit bewegen Sie Geld zwischen Ihren eigenen Konten. ${where}`),
    back: t(`That would go back. ${where}`, `Damit gehen Sie zurück. ${where}`),
    'person-peter': t(`That is Peter. ${where}`, `Das ist Peter. ${where}`),
    'person-new': t(`There you could enter someone new. ${where}`, `Dort könnten Sie jemand Neues eingeben. ${where}`),
    'amount-0': t(`That is a different amount. ${where}`, `Das ist ein anderer Betrag. ${where}`),
    'amount-2': t(`That is a different amount. ${where}`, `Das ist ein anderer Betrag. ${where}`),
    'amount-3': t(`That is a different amount. ${where}`, `Das ist ein anderer Betrag. ${where}`),
    cancel: t(`That would cancel the transfer. No money would move. ${where}`, `Damit brechen Sie die Überweisung ab. Es würde kein Geld fließen. ${where}`),
    'payment-two': t(`That is another payment. ${where}`, `Das ist eine andere Zahlung. ${where}`),
    'payment-three': t(`That is another payment. ${where}`, `Das ist eine andere Zahlung. ${where}`),
  });
  const list: TutorialStep[] = [];
  const step = (title: string, lead: string, paragraphs: string[], screen: string, targetId: string, where: string, successText: string) => {
    list.push({
      stepNumber: list.length + 1, title, lead, paragraphs,
      practice: { screen, targetId, successText, hints: hints(where), fallbackHint: where, showMeText: t(`The frame shows where to tap. ${where}`, `Der Rahmen zeigt, wohin Sie tippen. ${where}`) },
    });
  };

  const whereUnlock = t('"Unlock" is the big button at the bottom.', '„Entsperren“ ist der große Knopf unten.');
  step(t('Open and unlock the app', 'App öffnen und entsperren'), t('Tap "Unlock".', 'Tippen Sie auf „Entsperren“.'),
    [t('In a real banking app you now enter your app password, or use your fingerprint or face. Here you enter nothing. Never enter real login data on a practice site.', 'In einer echten Banking-App geben Sie jetzt Ihr App-Passwort ein, oder nutzen Fingerabdruck oder Gesicht. Hier geben Sie nichts ein. Geben Sie echte Zugangsdaten niemals auf einer Übungsseite ein.')],
    'unlock', 'unlock', whereUnlock, t('That was right. You are on the home screen of the app.', 'Das war richtig. Sie sind auf der Startseite der App.'));

  if (mode === 'balance') {
    const whereAcc = bankWhere(lang, layout).account;
    step(t('Open your account', 'Konto öffnen'), whereAcc, [t('The first thing you usually see is how much money is in the account.', 'Als Erstes sehen Sie meist, wie viel Geld auf dem Konto ist.')], 'overview', 'account', whereAcc, t('That was right. These are your latest payments.', 'Das war richtig. Das sind Ihre letzten Zahlungen.'));
    const wherePay = t('The supermarket is the first line.', 'Der Supermarkt ist die erste Zeile.');
    step(t('Look at one payment', 'Eine Zahlung ansehen'), t('Tap the payment to the supermarket.', 'Tippen Sie auf die Zahlung an den Supermarkt.'), [t('Look through your payments regularly. If you do not recognise one, call your bank using the number on your bank card.', 'Schauen Sie Ihre Zahlungen regelmäßig durch. Kennen Sie eine nicht, rufen Sie Ihre Bank unter der Nummer auf Ihrer Bankkarte an.')], 'payments', 'payment-one', wherePay, t('That was right.', 'Das war richtig.'));
  } else {
    if (layout === 'action') {
      const whereSend = t('"Send money" is the first round button under "Quick access".', '„Geld senden“ ist der erste runde Knopf unter „Schnellzugriffe“.');
      step(t('Tap "Send money"', 'Tippen Sie auf „Geld senden“'), whereSend, [t('The start page shows your accounts. Actions you often need are under "Quick access".', 'Die Startseite zeigt Ihre Konten. Häufige Aktionen finden Sie unter „Schnellzugriffe“.')], 'overview', 'send-money', whereSend, t('That was right. A short list has opened.', 'Das war richtig. Eine kurze Liste ist offen.'));
      const whereT = t('"Transfer" is the first line.', '„Überweisung“ ist die erste Zeile.');
      step(t('Choose "Transfer"', 'Wählen Sie „Überweisung“'), whereT, [t('A standing order is a payment that repeats on its own.', 'Ein Dauerauftrag ist eine Zahlung, die sich von selbst wiederholt.')], 'sendmenu', 'transfer', whereT, t('That was right. Now choose who gets the money.', 'Das war richtig. Jetzt wählen Sie, wer das Geld bekommt.'));
    } else {
      const whereT = bankWhere(lang, layout).transfer;
      step(t('Find the transfer', 'Überweisung finden'), t(`Tap "Transfer". ${whereT}`, `Tippen Sie auf „Überweisung“. ${whereT}`), [t('You start on the home screen with your account. Every bank arranges this a little differently.', 'Sie starten auf der Startseite mit Ihrem Konto. Jede Bank ordnet das etwas anders an.')], 'overview', 'transfer', whereT, t('That was right. Now choose who gets the money.', 'Das war richtig. Jetzt wählen Sie, wer das Geld bekommt.'));
    }
    step(t('Choose the person', 'Person wählen'), t('Tap "Anna Beispiel".', 'Tippen Sie auf „Anna Beispiel“.'), [t('People you have paid before are saved here.', 'Personen, denen Sie schon einmal Geld geschickt haben, sind hier gespeichert.')], 'recipient', 'person-anna', t('Anna is the first line.', 'Anna ist die erste Zeile.'), t('That was right. Now choose the amount.', 'Das war richtig. Jetzt wählen Sie den Betrag.'));
    step(t('Choose the amount', 'Betrag wählen'), t('Tap "25,00 €".', 'Tippen Sie auf „25,00 €“.'), [t('Take your time to check the amount.', 'Nehmen Sie sich Zeit, den Betrag zu prüfen.')], 'amount', 'amount-right', t('25 euros is the button at the top right.', '25 Euro ist der Knopf oben rechts.'), t('That was right. Now check everything.', 'Das war richtig. Jetzt prüfen Sie alles.'));
    step(t('Check and confirm', 'Prüfen und bestätigen'), t('Check the name and the amount. Then tap "Confirm transfer".', 'Prüfen Sie Name und Betrag. Dann tippen Sie auf „Überweisung bestätigen“.'), [t('This is the most important moment. Only confirm if everything is right.', 'Das ist der wichtigste Moment. Bestätigen Sie nur, wenn alles stimmt.')], 'check', 'confirm', t('The confirm button is the coloured one.', 'Der Bestätigen-Knopf ist der farbige.'), t('That was right. Now approve the payment.', 'Das war richtig. Jetzt geben Sie die Zahlung frei.'));
    const whereOk = t('"Approve" is the coloured button.', '„Freigeben“ ist der farbige Knopf.');
    step(t('Approve the payment', 'Zahlung freigeben'), t('Check the details again. Then tap "Approve".', 'Prüfen Sie die Angaben noch einmal. Dann tippen Sie auf „Freigeben“.'), [t('Real banks ask for a second confirmation, often in an extra app or with a code. Only approve payments you started yourself.', 'Echte Banken verlangen eine zweite Bestätigung, oft in einer Extra-App oder mit einem Code. Geben Sie nur Zahlungen frei, die Sie selbst begonnen haben.')], 'approve', 'approve-ok', whereOk, t('That was right.', 'Das war richtig.'));
  }

  const id = bank ? `${bank.id}-${mode}` : mode === 'transfer' ? 'banking-transfer-practice' : 'banking-balance-practice';
  return {
    id,
    title: mode === 'balance'
      ? (bank ? t(`${bank.name}: Check Your Balance and Payments`, `${bank.name}: Kontostand und Zahlungen prüfen`) : t('Online Banking: Check Your Balance', 'Online-Banking: Kontostand prüfen'))
      : (bank ? t(`${bank.name}: Practise a Transfer`, `${bank.name}: Überweisung üben`) : t('Online Banking: Make a Transfer', 'Online-Banking: Eine Überweisung machen')),
    categoryId: 'banking',
    categoryTitle: t('Online Banking', 'Online-Banking'),
    description: mode === 'balance'
      ? t('Open the app and see how much money you have and what you paid. All data is made up.', 'Öffnen Sie die App und sehen Sie, wie viel Geld Sie haben und was Sie bezahlt haben. Alle Daten sind erfunden.')
      : t('Start in the app\'s home screen and make a transfer, with made-up money.', 'Starten Sie auf der Startseite der App und machen Sie eine Überweisung, mit erfundenem Geld.'),
    durationMinutes: mode === 'balance' ? 3 : 6,
    difficulty: t('Easy', 'Einfach') as Tutorial['difficulty'],
    image: IMAGES.topicBankingPhone,
    tags: [t('Banking', 'Banking'), mode === 'balance' ? t('Balance', 'Kontostand') : t('Transfer', 'Überweisung'), t('Practice', 'Übung'), ...(bank ? [bank.name] : [])],
    practice: {
      screenId: 'banking',
      appId: bank?.id,
      kind: mode,
      notice: bank
        ? t(`Practice mode: this is not the real ${bank.name} app, and yours looks different. The money is made up.`, `Übungsmodus: Das ist nicht die echte ${bank.name}-App, Ihre sieht anders aus. Das Geld ist erfunden.`)
        : t('Practice mode: this bank is made up. No real money moves.', 'Übungsmodus: Diese Bank ist erfunden. Es fließt kein echtes Geld.'),
      introTitle: t('What you will practise', 'Das üben Sie hier'),
      introText: mode === 'balance'
        ? t(`You will check your balance and a payment in ${list.length} steps. There is no time limit.`, `Sie prüfen in ${list.length} Schritten Ihren Kontostand und eine Zahlung. Es gibt kein Zeitlimit.`)
        : t(`You will send 25 euros to Anna in ${list.length} steps, starting from the app's home screen. There is no time limit.`, `Sie überweisen Anna in ${list.length} Schritten 25 Euro, von der Startseite der App aus. Es gibt kein Zeitlimit.`),
      successTitle: mode === 'balance' ? t('Well done! You checked your account.', 'Gut gemacht! Sie haben Ihr Konto geprüft.') : t('Well done! You made a transfer.', 'Gut gemacht! Sie haben eine Überweisung gemacht.'),
      successText: `${bank ? `${t(bank.aboutEn, bank.aboutDe)} ` : ''}${t('Never give your approval code or password to anyone, not even on the phone.', 'Geben Sie Ihren Freigabe-Code oder Ihr Passwort niemals weiter, auch nicht am Telefon.')}`,
      nextTutorialId: mode === 'balance' && bank ? `${bank.id}-transfer` : 'online-banking-grundlagen',
      labels: {
        tapHere: common[lang].tapHere, phoneLabel: common[lang].phoneLabel, phoneBadge: common[lang].phoneBadge, back: common[lang].back,
        layout, brandColor: bank?.color ?? '#14457A', brandText: bank?.fg ?? '#FFFFFF', // the bank's colour as an accent; name and mark stay "Practice bank"
        bankName: t('Practice bank', 'Übungsbank'), fictional: t('Not real', 'Nicht echt'), account: t('Current account', 'Girokonto'),
        unlock: t('Unlock', 'Entsperren'), unlockNote: t('In the real app you enter your password here. Here, enter nothing.', 'In der echten App geben Sie hier Ihr Passwort ein. Hier geben Sie nichts ein.'),
        balance: '1.250,00 €', balanceAfter: '1.225,00 €', transfer: t('Transfer', 'Überweisung'), statements: t('Payments', 'Umsätze'), sendMoney: t('Send money', 'Geld senden'),
        standing: t('Standing order', 'Dauerauftrag'), ownTransfer: t('Between my accounts', 'Zwischen meinen Konten'),
        navHome: t('Home', 'Start'), navMoney: t('Accounts', 'Konten'), navOffers: t('Saving', 'Sparen'), navMore: bankWhere(lang, layout).moreLabel, navCard: t('Card', 'Karte'),
        latest: t('Latest payment', 'Letzte Zahlung'), bookingOne: t('Supermarket', 'Supermarkt'), bookingTwo: t('Pharmacy', 'Apotheke'), bookingThree: t('Pension', 'Rente'),
        dateLabel: t('Date', 'Datum'), dateValue: t('Yesterday', 'Gestern'), bookingPurpose: t('Card payment', 'Kartenzahlung'),
        whoGets: t('Who should get the money?', 'Wer soll das Geld bekommen?'), recipient: 'Anna Beispiel', peterFull: 'Peter Muster',
        newRecipient: t('Someone new', 'Jemand Neues'), to: t('To', 'An'), howMuch: t('How much?', 'Wie viel?'), amount: '25,00 €',
        purposeHint: t('In a real app you type the amount yourself.', 'In einer echten App tippen Sie den Betrag selbst ein.'),
        checkTitle: t('Please check', 'Bitte prüfen'), amountLabel: t('Amount', 'Betrag'), purpose: t('Reference', 'Verwendungszweck'),
        purposeText: t('Birthday present', 'Geburtstagsgeschenk'), confirm: t('Confirm transfer', 'Überweisung bestätigen'), cancel: t('Cancel', 'Abbrechen'),
        approveTitle: t('Approve this payment?', 'Diese Zahlung freigeben?'), approveText: approvalNote(lang, bank),
        nameCheck: t('Name check', 'Namensprüfung'), nameOk: t('Name matches', 'Name stimmt überein'), approveButton: t('Approve', 'Freigeben'),
        doneTitle: t('Transfer completed', 'Überweisung ausgeführt'), newBalance: t('New balance', 'Neuer Kontostand'),
        noRealMoney: t('Practice only: no real money moved.', 'Nur Übung: Es ist kein echtes Geld geflossen.'),
      },
    },
    steps: list,
  };
}

function emailLesson(lang: Language, provider?: Service, mode: 'reply' | 'new' = 'reply'): Tutorial {
  const isEn = lang === 'en';
  const t = (en: string, de: string) => (isEn ? en : de);
  const hints = (where: string): Record<string, string> => ({
    menu: t(`That was the menu. ${where}`, `Das war das Menü. ${where}`),
    search: t(`That was the search. ${where}`, `Das war die Suche. ${where}`),
    'mail-anna': t(`That opens Anna's email. ${where}`, `Damit öffnen Sie Annas E-Mail. ${where}`),
    'mail-club': t(`That was the bowling club's email. ${where}`, `Das war die E-Mail vom Kegelclub. ${where}`),
    'mail-news': t(`That was the newsletter. ${where}`, `Das war der Newsletter. ${where}`),
    compose: t(`That would start a new email. ${where}`, `Damit beginnen Sie eine neue E-Mail. ${where}`),
    back: t(`That would leave this screen. ${where}`, `Damit verlassen Sie diesen Bildschirm. ${where}`),
    archive: t(`That would put the email away. ${where}`, `Damit legen Sie die E-Mail ab. ${where}`),
    delete: t(`That would delete the email. Nothing happens in this practice. ${where}`, `Damit löschen Sie die E-Mail. In dieser Übung passiert nichts. ${where}`),
    attach: t(`That would add a file. ${where}`, `Damit fügen Sie eine Datei hinzu. ${where}`),
    'contact-peter': t(`That is Peter. For this practice, please choose Anna. ${where}`, `Das ist Peter. Für diese Übung wählen Sie bitte Anna. ${where}`),
  });
  const step = (n: number, title: string, lead: string, paragraphs: string[], screen: string, targetId: string, where: string, successText: string, options: { field?: string; requiresText?: boolean; sendHint?: string } = {}): TutorialStep => {
    const { sendHint, ...rest } = options;
    return {
      stepNumber: n, title, lead, paragraphs,
      practice: {
        ...rest, screen, targetId, successText,
        hints: { ...hints(where), ...(sendHint ? { send: sendHint } : {}) },
        fallbackHint: where,
        showMeText: t(`The frame shows where to tap. ${where}`, `Der Rahmen zeigt, wohin Sie tippen. ${where}`),
      },
    };
  };
  const composeWord: Record<string, { en: string; de: string }> = {
    gmail: { en: 'Compose', de: 'Schreiben' },
    outlook: { en: 'New mail', de: 'Neue E-Mail' },
    applemail: { en: 'New Message', de: 'Neue E-Mail' },
    yahoo: { en: 'Compose', de: 'Verfassen' },
    proton: { en: 'New message', de: 'Neue Nachricht' },
    gmx: { en: 'Write email', de: 'E-Mail schreiben' },
    webde: { en: 'Write email', de: 'E-Mail schreiben' },
    tonline: { en: 'Write email', de: 'E-Mail schreiben' },
  };
  const compose = composeWord[provider?.id ?? '']?.[lang] ?? t('Write', 'Schreiben');
  const whereCompose: Record<string, { en: string; de: string }> = {
    applemail: { en: 'The square with the pencil is at the bottom right.', de: 'Das Quadrat mit dem Stift ist unten rechts.' },
    outlook: { en: 'The round pencil button is at the bottom right.', de: 'Der Knopf mit dem Stift ist unten rechts.' },
  };
  const whereWrite = (provider?.id === 'webde' ? { en: 'The wide yellow button is at the bottom.', de: 'Der breite gelbe Knopf ist unten.' }[lang] : undefined) ?? whereCompose[provider?.id ?? '']?.[lang] ?? t(`The button with the pencil is at the bottom right.`, `Der Knopf mit dem Stift ist unten rechts.`);
  const writeWarning = t('You need a recipient first. Type the name, then tap the person.', 'Sie brauchen zuerst einen Empfänger. Geben Sie den Namen ein und tippen Sie auf die Person.');
  const subjectWarning = t('The app is asking whether to send without a subject. A subject tells the other person what it is about. Please add one first.', 'Die App fragt, ob Sie ohne Betreff senden möchten. Ein Betreff sagt der anderen Person, worum es geht. Bitte fügen Sie zuerst einen hinzu.');

  return {
    id: provider ? `${provider.id}-${mode}` : 'email-reply-practice',
    title: mode === 'new'
      ? t(`${provider?.name}: Write a New Email`, `${provider?.name}: Eine neue E-Mail schreiben`)
      : provider ? t(`${provider.name}: Answer an Email`, `${provider.name}: Eine E-Mail beantworten`) : t('Email: Answer an Email', 'E-Mail: Eine E-Mail beantworten'),
    categoryId: 'email',
    categoryTitle: t('Email', 'E-Mail'),
    description: mode === 'new'
      ? t('Write a complete new email on a simulated phone: recipient, subject and text.', 'Schreiben Sie am simulierten Handy eine vollständige neue E-Mail: Empfänger, Betreff und Text.')
      : t('Open an email from Anna and write a short answer on a simulated phone.', 'Öffnen Sie eine E-Mail von Anna und schreiben Sie am simulierten Handy eine kurze Antwort.'),
    durationMinutes: mode === 'new' ? 6 : 4,
    difficulty: t('Easy', 'Einfach') as Tutorial['difficulty'],
    image: IMAGES.topicEmail,
    tags: [t('Email', 'E-Mail'), t('Practice', 'Übung'), ...(provider ? [provider.name] : [])],
    practice: {
      screenId: 'email',
      appId: provider?.id,
      kind: mode,
      notice: t('Practice mode: no real emails are sent.', 'Übungsmodus: Es werden keine echten E-Mails gesendet.'),
      introTitle: t('What you will practise', 'Das üben Sie hier'),
      introText: mode === 'new'
        ? t('You will write a complete email in 4 steps: who it goes to, the subject, and your text. You cannot break anything, and there is no time limit.', 'Sie schreiben in 4 Schritten eine vollständige E-Mail: an wen sie geht, den Betreff und Ihren Text. Sie können nichts kaputt machen, und es gibt kein Zeitlimit.')
        : t('You will answer an email in 3 steps. You cannot break anything, and there is no time limit.', 'Sie beantworten in 3 Schritten eine E-Mail. Sie können nichts kaputt machen, und es gibt kein Zeitlimit.'),
      successTitle: mode === 'new' ? t('Well done! You sent an email.', 'Gut gemacht! Sie haben eine E-Mail gesendet.') : t('Well done! You answered the email.', 'Gut gemacht! Sie haben die E-Mail beantwortet.'),
      successText: t('Remember: without a recipient an email cannot be sent, and a subject tells the other person what it is about. This was only practice.', 'Denken Sie daran: Ohne Empfänger lässt sich keine E-Mail senden, und ein Betreff sagt der anderen Person, worum es geht. Das war nur eine Übung.'),
      nextTutorialId: provider && mode === 'reply' ? `${provider.id}-new` : 'phishing-erkennen',
      labels: {
        tapHere: common[lang].tapHere, phoneLabel: common[lang].phoneLabel, phoneBadge: common[lang].phoneBadge,
        appTitle: provider?.name ?? t('Email', 'E-Mail'),
        back: common[lang].back, close: common[lang].close, menu: common[lang].menu, search: t('Search in emails', 'In E-Mails suchen'), you: common[lang].you,
        inbox: t('Inbox', 'Posteingang'), primary: t('Primary', 'Allgemein'), focused: t('Focused', 'Relevant'), other: t('Other', 'Sonstige'), mailboxes: t('Mailboxes', 'Postfächer'), edit: common[lang].edit,
        chipAll: t('All', 'Alle'), chipUnread: t('Unread', 'Ungelesen'), chipStarred: t('Starred', 'Markiert'), updatedNow: t('Updated just now', 'Gerade aktualisiert'),
        navMail: t('Mail', 'E-Mail'), navMeet: 'Meet', navCalendar: t('Calendar', 'Kalender'),
        anna: 'Anna Beispiel', peter: 'Peter Muster', club: common[lang].club, news: t('Garden newsletter', 'Garten-Newsletter'),
        mailAnna: 'anna@beispiel.example', mailPeter: 'peter@beispiel.example', myMail: 'ich@beispiel.example',
        yesterday: common[lang].yesterday, compose,
        subjectAnna: t('Lunch on Sunday?', 'Mittagessen am Sonntag?'), previewAnna: t('Hello! Do you have time...', 'Hallo! Haben Sie Zeit...'),
        subjectClub: t('Next meeting', 'Nächstes Treffen'), previewClub: t('We meet on Tuesday...', 'Wir treffen uns am Dienstag...'),
        subjectNews: t('Tips for autumn', 'Tipps für den Herbst'), previewNews: t('Now is the time to...', 'Jetzt ist die Zeit...'),
        bodyAnna: t('Hello!\n\nDo you have time for lunch on Sunday at 12?\n\nBest wishes,\nAnna', 'Hallo!\n\nHaben Sie am Sonntag um 12 Uhr Zeit zum Mittagessen?\n\nViele Grüße\nAnna'),
        toMe: t('to me', 'an mich'), reply: t('Reply', 'Antworten'), archive: t('Archive', 'Archivieren'), deleteMail: t('Delete', 'Löschen'),
        attachMail: t('Add a file', 'Datei hinzufügen'), send: common[lang].send, cancelWord: t('Cancel', 'Abbrechen'),
        toLabel: t('To', 'An'), ccLabel: 'Cc', fromLabel: t('From', 'Von'), subjectLabel: t('Subject', 'Betreff'), writeHere: t('Write your text here', 'Schreiben Sie hier Ihren Text'),
        suggest1: t('Hello Anna', 'Hallo Anna'), suggest2: t('Yes, gladly', 'Ja, gerne'), suggest3: t('Best wishes', 'Viele Grüße'),
        subj1: t('Lunch on Sunday', 'Mittagessen am Sonntag'), subj2: t('A question', 'Eine Frage'), subj3: t('Greetings', 'Grüße'),
        space: common[lang].space, deleteKey: common[lang].deleteKey, shift: common[lang].shift,
        sent: t('Your email was sent', 'Ihre E-Mail wurde gesendet'), defaultMessage: t('Yes, gladly', 'Ja, gerne'),
        noRealMail: t('Practice only: no real email was sent.', 'Nur Übung: Es wurde keine echte E-Mail gesendet.'),
        okWord: t('OK', 'OK'),
        alertToTitle: t('Add a recipient', 'Empfänger hinzufügen'),
        alertToText: t('Add at least one recipient before sending.', 'Fügen Sie vor dem Senden mindestens einen Empfänger hinzu.'),
        alertSubjectTitle: t('Send without a subject?', 'Ohne Betreff senden?'),
        alertSubjectText: t('This email has no subject yet.', 'Diese E-Mail hat noch keinen Betreff.'),
        alertSubjectBack: t('Add a subject', 'Betreff hinzufügen'),
        ...emailExtraLabels(lang, provider),
      },
    },
    steps: mode === 'new' ? [
      step(1, t('Start a new email', 'Neue E-Mail beginnen'), whereWrite, [t('Here you see all the emails you have received.', 'Hier sehen Sie alle E-Mails, die Sie erhalten haben.')], 'inbox', 'compose', whereWrite, t('That was right. Now say who it is for.', 'Das war richtig. Jetzt geben Sie an, für wen sie ist.')),
      step(2, t('Who is it for? Fill in "To"', 'Für wen ist sie? Füllen Sie „An“ aus'), t('Type the first letters of "Anna", or tap "Anna" above the letters. Then tap her name in the list.', 'Tippen Sie die ersten Buchstaben von „Anna“, oder tippen Sie „Anna“ über den Buchstaben. Dann tippen Sie auf ihren Namen in der Liste.'), [t('Without a recipient, an email cannot be sent. The phone suggests people you have written to, so you do not need to know the whole address.', 'Ohne Empfänger lässt sich eine E-Mail nicht senden. Das Handy schlägt Personen vor, denen Sie schon geschrieben haben, Sie müssen also nicht die ganze Adresse kennen.')], 'new-to', 'contact-anna', t('First type a few letters. Then tap Anna in the list under the "To" line.', 'Tippen Sie zuerst ein paar Buchstaben. Dann tippen Sie in der Liste unter der Zeile „An“ auf Anna.'), t('That was right. Anna is the recipient.', 'Das war richtig. Anna ist die Empfängerin.'), { field: 'to', requiresText: true, sendHint: writeWarning }),
      step(3, t('What is it about? Fill in "Subject"', 'Worum geht es? Füllen Sie „Betreff“ aus'), t('Write a few words, or tap a suggestion above the letters. Then tap the big empty text area.', 'Schreiben Sie ein paar Wörter, oder tippen Sie einen Vorschlag über den Buchstaben. Dann tippen Sie auf das große leere Textfeld.'), [t('The subject is the first thing Anna sees in her inbox. Without one, most email apps ask whether you really want to send.', 'Den Betreff sieht Anna zuerst in ihrem Posteingang. Ohne Betreff fragen die meisten E-Mail-Apps, ob Sie wirklich senden möchten.')], 'new-subject', 'body-field', t('First write a subject. Then tap the empty text area under it.', 'Schreiben Sie zuerst einen Betreff. Dann tippen Sie auf das leere Textfeld darunter.'), t('That was right. Now write your text.', 'Das war richtig. Jetzt schreiben Sie Ihren Text.'), { field: 'subject', requiresText: true, sendHint: subjectWarning }),
      step(4, t('Write your text and send', 'Text schreiben und senden'), t('Write your message. Then tap the send button at the top right.', 'Schreiben Sie Ihre Nachricht. Dann tippen Sie oben rechts auf den Senden-Knopf.'), [t('Before sending, look once more: is the name right, and does the subject fit?', 'Schauen Sie vor dem Senden noch einmal: Stimmt der Name, und passt der Betreff?')], 'new-body', 'send', t('First write some text. Then tap the send button at the top right.', 'Schreiben Sie zuerst etwas Text. Dann tippen Sie oben rechts auf den Senden-Knopf.'), t('That was right.', 'Das war richtig.'), { requiresText: true }),
    ] : [
      step(1, t('Open the email', 'E-Mail öffnen'), t('Tap the email from Anna.', 'Tippen Sie auf die E-Mail von Anna.'), [t('New emails are shown in bold or with a dot.', 'Neue E-Mails stehen in fetter Schrift oder haben einen Punkt.')], 'inbox', 'mail-anna', t('The email from Anna is at the top.', 'Die E-Mail von Anna steht ganz oben.'), t('That was right. You can read the email now.', 'Das war richtig. Jetzt können Sie die E-Mail lesen.')),
      step(2, t('Tap "Reply"', 'Tippen Sie auf „Antworten“'), t('Read the email. Then tap "Reply" at the bottom.', 'Lesen Sie die E-Mail. Dann tippen Sie unten auf „Antworten“.'), [t('Your email app then fills in the recipient and the subject for you.', 'Ihre E-Mail-App füllt dann Empfänger und Betreff für Sie aus.')], 'mail', 'reply', t('"Reply" is at the bottom of the screen.', '„Antworten“ ist unten auf dem Bildschirm.'), t('That was right. Look: "To" and "Subject" are already filled in.', 'Das war richtig. Schauen Sie: „An“ und „Betreff“ sind schon ausgefüllt.')),
      step(3, t('Check, write and send', 'Prüfen, schreiben und senden'), t('"To" is Anna, and the subject starts with "Re:", which means it is an answer. Write your text, then tap send at the top right.', '„An“ ist Anna, und der Betreff beginnt mit „Re:“, das heißt, es ist eine Antwort. Schreiben Sie Ihren Text und tippen Sie oben rechts auf Senden.'), [t('The send button is at the top right in most email apps.', 'Der Senden-Knopf ist in den meisten E-Mail-Apps oben rechts.')], 'reply', 'send', t('First write some text. Then tap send at the top right.', 'Schreiben Sie zuerst etwas Text. Dann tippen Sie oben rechts auf Senden.'), t('That was right.', 'Das war richtig.'), { requiresText: true }),
    ],
  };
}


/** A messaging lesson as it looks on iPhone. Lessons of other apps are the same on both phones. */
const iphoneCache: Partial<Record<Language, Tutorial[]>> = {};
export function iphoneLesson(lang: Language, tutorial: Tutorial): Tutorial {
  if (tutorial.practice?.screenId !== 'messenger' || !tutorial.practice.appId) return tutorial;
  if (!iphoneCache[lang]) iphoneCache[lang] = APP_IDS.flatMap((app) => messagingLessons(lang, app, 'iphone'));
  const variant = iphoneCache[lang]!.find((t) => t.id === tutorial.id);
  if (!variant) return tutorial;
  return { ...variant, image: tutorial.image, nextIds: tutorial.nextIds, practice: { ...variant.practice!, nextTutorialId: tutorial.practice.nextTutorialId } };
}

const cache: Partial<Record<Language, Tutorial[]>> = {};

export function practiceLessons(lang: Language): Tutorial[] {
  if (!cache[lang]) {
    const services = (group: Service['group']) => SERVICES.filter((service) => service.group === group);
    cache[lang] = [
      ...APP_IDS.flatMap((app) => {
        const lessons = messagingLessons(lang, app);
        const service = SERVICES.find((s) => s.id === app);
        return service ? [...lessons, desktopLesson(lang, service, lessons[0])] : lessons;
      }),
      bankingLesson(lang),
      bankingLesson(lang, undefined, 'balance'),
      ...services('banking').flatMap((bank) => {
        const transfer = bankingLesson(lang, bank, 'transfer');
        return [bankingLesson(lang, bank, 'balance'), transfer, ...bankingTasks(lang, bank, transfer, BANK_LAYOUT[bank.id] ?? 'classic')]; // phone only: banking apps are made for the phone
      }),
      ...generalBankingLessons(lang, bankingLesson(lang)),
      emailLesson(lang),
      ...services('email').flatMap((provider) => {
        const reply = emailLesson(lang, provider, 'reply');
        return [reply, emailLesson(lang, provider, 'new'), ...emailTasks(lang, provider, reply), desktopLesson(lang, provider, emailLesson(lang, provider, 'new'))];
      }),
      ...generalEmailLessons(lang, emailLesson(lang)),
      ...services('social').flatMap((service) => {
        const basics = socialLessons(lang, service);
        return [...basics, ...socialTasks(lang, service, basics[0]), desktopLesson(lang, service, basics[0])];
      }),
      ...generalSocialLessons(lang),
      ...moreGeneralSocialLessons(lang, generalSocialLessons(lang)[0]),
      ...aiLessons(lang),
    ];
  }
  return cache[lang]!;
}

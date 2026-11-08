/**
 * More social media lessons per platform, in English and German: posting, messages,
 * sending a post on, following and blocking. Each platform uses its own words and
 * button places. Nothing is published. Checked: Instagram's bottom bar has messages
 * in it, TikTok messages sit behind Inbox, YouTube brought messages back in 2026.
 */
import { Language, Tutorial, TutorialStep } from '../types';
import type { Service } from './services';

type Pair = [string, string];
interface Platform {
  publish: Pair;
  inbox: Pair;
  follow: Pair;
  block: Pair;
  whereNew: Pair;
  whereInbox: Pair;
  whereShare: Pair;
  /** The first thing to choose is a picture, not text. */
  photoFirst?: boolean;
  community?: boolean;
  inboxNote?: Pair;
}

const PLATFORMS: Record<string, Platform> = {
  facebook: { publish: ['Post', 'Posten'], inbox: ['Messenger', 'Messenger'], follow: ['Add friend', 'Freund hinzufügen'], block: ['Block', 'Blockieren'], whereNew: ['The plus sign is at the top.', 'Das Pluszeichen ist oben.'], whereInbox: ['The speech bubble is at the top right.', 'Die Sprechblase ist oben rechts.'], whereShare: ['"Share" is under the photo, on the right.', '„Teilen“ steht unter dem Foto, rechts.'], inboxNote: ['Facebook messages open in its Messenger section or app.', 'Facebook-Nachrichten öffnen sich im Bereich oder in der App Messenger.'] },
  instagram: { publish: ['Share', 'Teilen'], inbox: ['Messages', 'Nachrichten'], follow: ['Follow', 'Folgen'], block: ['Block', 'Blockieren'], whereNew: ['The plus sign is at the top left.', 'Das Pluszeichen ist oben links.'], whereInbox: ['The paper plane is in the middle of the bottom bar.', 'Der Papierflieger ist in der Mitte der unteren Leiste.'], whereShare: ['The paper plane is under the photo.', 'Der Papierflieger ist unter dem Foto.'], photoFirst: true, inboxNote: ['Instagram changes its bar from time to time. On older versions, messages are at the top right.', 'Instagram ändert die Leiste ab und zu. In älteren Versionen sind Nachrichten oben rechts.'] },
  youtube: { publish: ['Post', 'Posten'], inbox: ['Messages', 'Nachrichten'], follow: ['Subscribe', 'Abonnieren'], block: ['Block', 'Blockieren'], whereNew: ['The plus sign is in the middle of the bottom bar.', 'Das Pluszeichen ist in der Mitte der unteren Leiste.'], whereInbox: ['The speech bubble is at the top, next to the magnifying glass.', 'Die Sprechblase ist oben, neben der Lupe.'], whereShare: ['"Share" is under the video title.', '„Teilen“ steht unter dem Videotitel.'], photoFirst: true, inboxNote: ['YouTube brought messages back in 2026, step by step. You may not have them yet, and you must be an adult to use them.', 'YouTube hat Nachrichten 2026 schrittweise zurückgebracht. Vielleicht haben Sie sie noch nicht, und Sie müssen volljährig sein.'] },
  tiktok: { publish: ['Post', 'Posten'], inbox: ['Inbox', 'Inbox'], follow: ['Follow', 'Folgen'], block: ['Block', 'Blockieren'], whereNew: ['The plus sign is in the middle of the bottom bar.', 'Das Pluszeichen ist in der Mitte der unteren Leiste.'], whereInbox: ['The envelope is in the bottom bar, second from the right.', 'Der Umschlag ist in der unteren Leiste, an zweiter Stelle von rechts.'], whereShare: ['The arrow is on the right side of the video, at the bottom.', 'Der Pfeil ist rechts neben dem Video, unten.'], photoFirst: true, inboxNote: ['In the real app, Inbox first shows your activity. Messages are behind the symbol at the top right. By default only people who follow each other can write.', 'In der echten App zeigt die Inbox zuerst Ihre Aktivität. Nachrichten liegen hinter dem Symbol oben rechts. Standardmäßig können nur Personen schreiben, die sich gegenseitig folgen.'] },
  x: { publish: ['Post', 'Posten'], inbox: ['Messages', 'Nachrichten'], follow: ['Follow', 'Folgen'], block: ['Block', 'Blockieren'], whereNew: ['The blue plus sign is at the bottom right.', 'Das blaue Pluszeichen ist unten rechts.'], whereInbox: ['The envelope is at the far right of the bottom bar.', 'Der Umschlag ist ganz rechts in der unteren Leiste.'], whereShare: ['The share symbol is under the post, on the far right.', 'Das Teilen-Symbol ist unter dem Beitrag, ganz rechts.'], inboxNote: ['X may also call this area "Chat".', 'X nennt diesen Bereich vielleicht auch „Chat“.'] },
  linkedin: { publish: ['Post', 'Posten'], inbox: ['Messaging', 'Nachrichten'], follow: ['Connect', 'Vernetzen'], block: ['Block', 'Blockieren'], whereNew: ['The plus sign is in the middle of the bottom bar.', 'Das Pluszeichen ist in der Mitte der unteren Leiste.'], whereInbox: ['The speech bubble is at the top right.', 'Die Sprechblase ist oben rechts.'], whereShare: ['"Send" is under the post, on the far right.', '„Senden“ steht unter dem Beitrag, ganz rechts.'] },
  pinterest: { publish: ['Publish', 'Veröffentlichen'], inbox: ['Inbox', 'Inbox'], follow: ['Follow', 'Folgen'], block: ['Block', 'Blockieren'], whereNew: ['The plus sign is in the middle of the bottom bar.', 'Das Pluszeichen ist in der Mitte der unteren Leiste.'], whereInbox: ['The envelope is in the bottom bar, second from the right.', 'Der Umschlag ist in der unteren Leiste, an zweiter Stelle von rechts.'], whereShare: ['The share symbol is under the picture.', 'Das Teilen-Symbol ist unter dem Bild.'], photoFirst: true },
  threads: { publish: ['Post', 'Posten'], inbox: ['Messages', 'Nachrichten'], follow: ['Follow', 'Folgen'], block: ['Block', 'Blockieren'], whereNew: ['The plus sign is in the middle of the bottom bar.', 'Das Pluszeichen ist in der Mitte der unteren Leiste.'], whereInbox: ['The paper plane is at the top right.', 'Der Papierflieger ist oben rechts.'], whereShare: ['The paper plane is under the post, on the far right.', 'Der Papierflieger ist unter dem Beitrag, ganz rechts.'], inboxNote: ['Threads is still changing where messages are. Yours may be somewhere else.', 'Threads ändert noch, wo Nachrichten liegen. Bei Ihnen sind sie vielleicht woanders.'] },
  reddit: { publish: ['Post', 'Posten'], inbox: ['Chat', 'Chat'], follow: ['Join', 'Beitreten'], block: ['Mute community', 'Community stummschalten'], whereNew: ['The plus sign is in the middle of the bottom bar.', 'Das Pluszeichen ist in der Mitte der unteren Leiste.'], whereInbox: ['The envelope is in the bottom bar, second from the right.', 'Der Umschlag ist in der unteren Leiste, an zweiter Stelle von rechts.'], whereShare: ['"Share" is next to "Comment".', '„Teilen“ steht neben „Kommentar“.'], community: true },
};

/** Added to every social lesson, so free roam and all lessons can show the new screens. */
export function socialExtraLabels(lang: Language, service: Service): Record<string, string> {
  const isEn = lang === 'en';
  const t = (en: string, de: string) => (isEn ? en : de);
  const pick = (pair: Pair) => (isEn ? pair[0] : pair[1]);
  const p = PLATFORMS[service.id] ?? PLATFORMS.facebook;
  return {
    publish: pick(p.publish), inboxWord: pick(p.inbox), followWord: pick(p.follow), blockWord: pick(p.block),
    followingWord: service.id === 'youtube' ? t('Subscribed', 'Abonniert') : service.id === 'reddit' ? t('Joined', 'Beigetreten') : service.id === 'linkedin' ? t('Pending', 'Ausstehend') : service.id === 'facebook' ? t('Request sent', 'Anfrage gesendet') : t('Following', 'Folge ich'),
    profileLabel: service.id === 'reddit' ? 'r/' + t('Garden', 'Garten') : 'Anna Beispiel',
    openProfile: t("Open Anna's page", 'Annas Seite öffnen'),
    profileStats: t('128 posts · 340 followers', '128 Beiträge · 340 Abonnenten'),
    moreOptions: t('More options', 'Weitere Optionen'), reportWord: t('Report', 'Melden'), cancelWord: t('Cancel', 'Abbrechen'),
    blockSure: t('Blocked accounts can no longer contact you. They are not told about it.', 'Blockierte Konten können Sie nicht mehr kontaktieren. Sie erfahren davon nichts.'),
    sendTo: t('Send to', 'Senden an'), copyLink: t('Copy link', 'Link kopieren'), peter: 'Peter Muster',
    writePost: t('What would you like to share?', 'Was möchten Sie teilen?'), writeCaption: t('Write a caption', 'Bildunterschrift schreiben'),
    suggestP1: t('My garden', 'Mein Garten'), suggestP2: t('A lovely day', 'Ein schöner Tag'), suggestP3: t('Hello everyone', 'Hallo zusammen'),
    suggestM1: t('Hello Anna', 'Hallo Anna'), suggestM2: t('How are you?', 'Wie geht es dir?'), suggestM3: t('See you soon', 'Bis bald'),
    writeMessage: t('Write a message', 'Nachricht schreiben'), annaMessage: t('Did you see my flowers?', 'Hast du meine Blumen gesehen?'), peterMessage: t('See you on Tuesday', 'Bis Dienstag'),
    choosePhoto: t('Choose a photo', 'Foto wählen'), flowers: t('Flowers', 'Blumen'), sunset: t('Sunset', 'Sonnenuntergang'), sea: t('Sea', 'Meer'),
    chooseCommunity: t('Choose a community', 'Community wählen'), gardenCommunity: 'r/' + t('Garden', 'Garten'), recipeCommunity: 'r/' + t('Recipes', 'Rezepte'),
    noRealAction: t('Practice only: nothing really happened, and nobody was told.', 'Nur Übung: Es ist nichts wirklich passiert, und niemand wurde benachrichtigt.'),
    doneLike: t('Your comment', 'Ihr Kommentar'),
  };
}

export function socialTasks(lang: Language, service: Service, base: Tutorial): Tutorial[] {
  const isEn = lang === 'en';
  const t = (en: string, de: string) => (isEn ? en : de);
  const pick = (pair: Pair) => (isEn ? pair[0] : pair[1]);
  const p = PLATFORMS[service.id] ?? PLATFORMS.facebook;
  const name = service.name;
  const extra = socialExtraLabels(lang, service);
  const baseLabels = base.practice!.labels;

  const hints = (where: string): Record<string, string> => ({
    search: t(`That was the search. ${where}`, `Das war die Suche. ${where}`),
    'new-post': t(`That would start your own post. ${where}`, `Damit beginnen Sie einen eigenen Beitrag. ${where}`),
    like: t(`That shows you like the post. ${where}`, `Damit zeigen Sie, dass Ihnen der Beitrag gefällt. ${where}`),
    comment: t(`That opens the comments. ${where}`, `Damit öffnen Sie die Kommentare. ${where}`),
    share: t(`That sends the post to someone. ${where}`, `Damit senden Sie den Beitrag an jemanden. ${where}`),
    repost: t(`That would show the post to everyone who follows you. ${where}`, `Das würde den Beitrag allen zeigen, die Ihnen folgen. ${where}`),
    inbox: t(`That opens your messages. ${where}`, `Damit öffnen Sie Ihre Nachrichten. ${where}`),
    profile: t(`That opens Anna's page. ${where}`, `Damit öffnen Sie Annas Seite. ${where}`),
    back: t(`That goes back. ${where}`, `Damit gehen Sie zurück. ${where}`),
    'dm-peter': t(`That is your chat with Peter. ${where}`, `Das ist Ihr Chat mit Peter. ${where}`),
    'dm-anna': t(`That is your chat with Anna. ${where}`, `Das ist Ihr Chat mit Anna. ${where}`),
    'share-anna': t(`Anna wrote the post herself. ${where}`, `Anna hat den Beitrag selbst geschrieben. ${where}`),
    'share-link': t(`That copies a link, which also works, but not in this practice. ${where}`, `Das kopiert einen Link. Das geht auch, aber nicht in dieser Übung. ${where}`),
    'report-user': t(`Report if someone breaks the rules. Here you want to block. ${where}`, `Melden Sie, wenn jemand gegen Regeln verstößt. Hier möchten Sie blockieren. ${where}`),
    'menu-cancel': t(`That would close the list. ${where}`, `Damit schließen Sie die Liste. ${where}`),
    'post-photo-2': t(`Any photo would work. For this practice, choose the flowers. ${where}`, `Jedes Foto ginge. Wählen Sie für diese Übung die Blumen. ${where}`),
    'post-photo-3': t(`Any photo would work. For this practice, choose the flowers. ${where}`, `Jedes Foto ginge. Wählen Sie für diese Übung die Blumen. ${where}`),
    'community-recipes': t(`That is a different community. ${where}`, `Das ist eine andere Community. ${where}`),
  });

  const step = (title: string, lead: string, paragraphs: string[], screen: string, targetId: string, where: string, requiresText = false): Omit<TutorialStep, 'stepNumber'> => ({
    title, lead, paragraphs,
    practice: { requiresText, screen, targetId, successText: t('That was right.', 'Das war richtig.'), hints: hints(where), fallbackHint: where, showMeText: t(`The frame shows where to tap. ${where}`, `Der Rahmen zeigt, wohin Sie tippen. ${where}`) },
  });

  const lesson = (kind: string, title: string, description: string, intro: string, successTitle: string, successText: string, doneTitle: string, doneText: string, steps: Omit<TutorialStep, 'stepNumber'>[]): Tutorial => ({
    ...base,
    id: `${service.id}-${kind}`,
    title: `${name}: ${title}`,
    description,
    tags: [name, t('Social media', 'Soziale Medien'), t('Practice', 'Übung'), title],
    practice: {
      ...base.practice!,
      kind,
      introText: `${intro} ${t('You cannot break anything, and there is no time limit.', 'Sie können nichts kaputt machen, und es gibt kein Zeitlimit.')}`,
      successTitle,
      successText,
      labels: { ...baseLabels, ...extra, doneTitle, doneText },
    },
    steps: steps.map((s, i) => ({ ...s, stepNumber: i + 1 })),
  });

  const whereNew = pick(p.whereNew);
  const whereInbox = pick(p.whereInbox);
  const whereShare = pick(p.whereShare);
  const publish = pick(p.publish);
  const follow = pick(p.follow);
  const block = pick(p.block);
  const inboxName = pick(p.inbox);
  const whereProfile = service.id === 'reddit' ? t('The community name is above the post.', 'Der Community-Name steht über dem Beitrag.') : t("Anna's picture is next to her post.", 'Annas Bild ist neben ihrem Beitrag.');
  const openProfile = service.id === 'reddit'
    ? step(t('Open the community', 'Community öffnen'), whereProfile, [t('On Reddit you join communities on a topic, rather than following people.', 'Auf Reddit treten Sie Communitys zu einem Thema bei, statt Personen zu folgen.')], 'feed', 'profile', whereProfile)
    : step(t("Open Anna's page", 'Annas Seite öffnen'), whereProfile, [t('A tap on the picture or name opens a person\'s page.', 'Ein Tipp auf Bild oder Name öffnet die Seite einer Person.')], 'feed', 'profile', whereProfile);

  const postSteps: Omit<TutorialStep, 'stepNumber'>[] = [
    step(t('Start a new post', 'Neuen Beitrag beginnen'), whereNew, [t(`This is where everything you publish on ${name} starts.`, `Hier beginnt alles, was Sie auf ${name} veröffentlichen.`)], 'feed', 'new-post', whereNew),
  ];
  if (p.photoFirst) postSteps.push(step(t('Choose a photo', 'Foto wählen'), t('Tap the photo with the flowers.', 'Tippen Sie auf das Foto mit den Blumen.'), [t(`${name} is built around pictures and videos, so you choose one first. Only share photos of other people if they agree.`, `${name} dreht sich um Bilder und Videos, darum wählen Sie zuerst eines. Teilen Sie Fotos von anderen nur, wenn diese einverstanden sind.`)], 'post-gallery', 'post-photo-flowers', t('The flowers are the first picture.', 'Die Blumen sind das erste Bild.')));
  if (p.community) postSteps.push(step(t('Choose a community', 'Community wählen'), t('Tap "r/Garden".', 'Tippen Sie auf „r/Garten“.'), [t('On Reddit, every post belongs to a community. Each community has its own rules, so read them first.', 'Auf Reddit gehört jeder Beitrag zu einer Community. Jede hat eigene Regeln, lesen Sie diese zuerst.')], 'post-community', 'community-garden', t('r/Garden is the first line.', 'r/Garten ist die erste Zeile.')));
  postSteps.push(step(t(`Write and tap "${publish}"`, `Schreiben und auf „${publish}“ tippen`), t(`Write a few words, or tap a word above the letters. Then tap "${publish}" at the top right.`, `Schreiben Sie ein paar Wörter, oder tippen Sie ein Wort über den Buchstaben. Dann tippen Sie oben rechts auf „${publish}“.`), [t('Think about who can see it. Do not share your address, phone number or holiday plans.', 'Überlegen Sie, wer das sehen kann. Teilen Sie weder Adresse noch Telefonnummer oder Urlaubspläne.')], 'post-write', 'send', t(`First write something. Then tap "${publish}" at the top right.`, `Schreiben Sie zuerst etwas. Dann tippen Sie oben rechts auf „${publish}“.`), true));

  const list: Tutorial[] = [
    lesson('post', t('Publish Your Own Post', 'Einen eigenen Beitrag veröffentlichen'),
      t(`Write your first post on ${name}. Nothing is really published.`, `Schreiben Sie Ihren ersten Beitrag auf ${name}. Nichts wird wirklich veröffentlicht.`),
      t(`You will create a post in ${postSteps.length} steps.`, `Sie erstellen in ${postSteps.length} Schritten einen Beitrag.`),
      t('Well done! You published a post.', 'Gut gemacht! Sie haben einen Beitrag veröffentlicht.'),
      t('In the real app you can delete your post later, using the three dots on it. But others may already have seen it. This was only practice.', 'In der echten App können Sie Ihren Beitrag später über die drei Punkte löschen. Andere haben ihn aber vielleicht schon gesehen. Das war nur eine Übung.'),
      t('Your post', 'Ihr Beitrag'), '', postSteps),
    lesson('message', t('Send a Private Message', 'Eine private Nachricht senden'),
      t(`Write to one person on ${name}. Only the two of you can see it.`, `Schreiben Sie einer Person auf ${name}. Nur Sie beide können das sehen.`),
      t('You will send Anna a message in 3 steps.', 'Sie senden Anna in 3 Schritten eine Nachricht.'),
      t('Well done! You sent a message.', 'Gut gemacht! Sie haben eine Nachricht gesendet.'),
      t('Be careful with messages from strangers. Never send money or codes because of a message, even if it seems to be from someone you know. This was only practice.', 'Seien Sie vorsichtig bei Nachrichten von Fremden. Senden Sie nie Geld oder Codes wegen einer Nachricht, selbst wenn sie von jemandem zu kommen scheint, den Sie kennen. Das war nur eine Übung.'),
      t('Your message to Anna', 'Ihre Nachricht an Anna'), '',
      [
        step(t(`Open "${inboxName}"`, `„${inboxName}“ öffnen`), whereInbox, p.inboxNote ? [pick(p.inboxNote)] : [t('Here you find all your private conversations.', 'Hier finden Sie alle Ihre privaten Unterhaltungen.')], 'feed', 'inbox', whereInbox),
        step(t('Open the chat with Anna', 'Chat mit Anna öffnen'), t('Tap "Anna Beispiel".', 'Tippen Sie auf „Anna Beispiel“.'), [t('The newest conversation is usually at the top.', 'Die neueste Unterhaltung steht meist oben.')], 'inbox', 'dm-anna', t('Anna is the first line.', 'Anna ist die erste Zeile.')),
        step(t('Write and send', 'Schreiben und senden'), t('Write a message or tap a word above the letters. Then tap send.', 'Schreiben Sie eine Nachricht oder tippen Sie ein Wort über den Buchstaben. Dann tippen Sie auf Senden.'), [t('The send button appears as soon as you have written something.', 'Der Senden-Knopf erscheint, sobald Sie etwas geschrieben haben.')], 'dm', 'send', t('First write something. Then the send button appears.', 'Schreiben Sie zuerst etwas. Dann erscheint der Senden-Knopf.'), true),
      ]),
    lesson('share', t('Send a Post to Someone', 'Einen Beitrag an jemanden senden'),
      t('You saw something nice? Send it to Peter.', 'Sie haben etwas Schönes gesehen? Senden Sie es an Peter.'),
      t('You will send a post to Peter in 3 steps.', 'Sie senden Peter in 3 Schritten einen Beitrag.'),
      t('Well done! You sent the post.', 'Gut gemacht! Sie haben den Beitrag gesendet.'),
      t('Before sharing news, check that it is true. Falsehoods often spread through friendly forwarding. This was only practice.', 'Prüfen Sie Nachrichten vor dem Teilen darauf, ob sie stimmen. Falsches verbreitet sich oft durch freundliches Weiterleiten. Das war nur eine Übung.'),
      t('Sent to Peter', 'An Peter gesendet'), t('Only Peter gets it. It does not appear on your own page.', 'Nur Peter bekommt ihn. Er erscheint nicht auf Ihrer eigenen Seite.'),
      [
        step(t('Tap the share button', 'Tippen Sie auf den Teilen-Knopf'), whereShare, [t('Not to be confused with "Repost", which shows it to everyone who follows you.', 'Nicht zu verwechseln mit „Reposten“, das ihn allen zeigt, die Ihnen folgen.')], 'feed', 'share', whereShare),
        step(t('Choose Peter', 'Wählen Sie Peter'), t('Tap "Peter Muster".', 'Tippen Sie auf „Peter Muster“.'), [t('Check the name, so it goes to the right person.', 'Prüfen Sie den Namen, damit es an die richtige Person geht.')], 'share-sheet', 'share-peter', t('Peter is the first line.', 'Peter ist die erste Zeile.')),
        step(t('Send it', 'Senden'), t('Tap the "Send" button.', 'Tippen Sie auf den Knopf „Senden“.'), [t('You could add a few words of your own, but you do not have to.', 'Sie könnten ein paar eigene Worte dazuschreiben, müssen aber nicht.')], 'share-picked', 'send', t('"Send" is the coloured button.', '„Senden“ ist der farbige Knopf.')),
      ]),
    lesson('follow', service.id === 'reddit' ? t('Join a Community', 'Einer Community beitreten') : service.id === 'youtube' ? t('Subscribe to a Channel', 'Einen Kanal abonnieren') : service.id === 'facebook' ? t('Add a Friend', 'Eine Freundin hinzufügen') : service.id === 'linkedin' ? t('Connect with Someone', 'Sich mit jemandem vernetzen') : t('Follow Someone', 'Jemandem folgen'),
      t(`See more from people and topics you like on ${name}.`, `Sehen Sie auf ${name} mehr von Menschen und Themen, die Sie mögen.`),
      t('You will do this in 2 steps.', 'Das machen Sie in 2 Schritten.'),
      t('Well done!', 'Gut gemacht!'),
      t('You can undo this at any time with the same button. This was only practice.', 'Sie können das jederzeit mit demselben Knopf rückgängig machen. Das war nur eine Übung.'),
      extra.followingWord, t('New posts now appear in your feed.', 'Neue Beiträge erscheinen jetzt in Ihrem Feed.'),
      [
        openProfile,
        step(t(`Tap "${follow}"`, `Tippen Sie auf „${follow}“`), t('The button is under the name.', 'Der Knopf ist unter dem Namen.'), [t('Check that it is the real account. Criminals copy names and photos.', 'Prüfen Sie, ob es das echte Konto ist. Kriminelle kopieren Namen und Fotos.')], 'profile', 'follow', t(`"${follow}" is the coloured button under the name.`, `„${follow}“ ist der farbige Knopf unter dem Namen.`)),
      ]),
    lesson('block', service.id === 'reddit' ? t('Mute a Community', 'Eine Community stummschalten') : t('Block Someone Who Bothers You', 'Jemanden blockieren, der Sie stört'),
      t('You do not have to put up with unpleasant messages. Stop them in a few taps.', 'Unangenehme Nachrichten müssen Sie nicht hinnehmen. Stoppen Sie sie mit wenigen Tippern.'),
      t('You will do this in 4 steps.', 'Das machen Sie in 4 Schritten.'),
      t('Well done! You protected yourself.', 'Gut gemacht! Sie haben sich geschützt.'),
      t('If someone threatens you or tries to cheat you, also use "Report". This was only practice.', 'Wenn jemand Sie bedroht oder betrügen will, nutzen Sie auch „Melden“. Das war nur eine Übung.'),
      service.id === 'reddit' ? t('Community muted', 'Community stummgeschaltet') : t('Blocked', 'Blockiert'), t('You will no longer see anything from them.', 'Sie sehen nichts mehr von dort.'),
      [
        openProfile,
        step(t('Open the options', 'Optionen öffnen'), t('Tap the three dots at the top right.', 'Tippen Sie oben rechts auf die drei Punkte.'), [t('Three dots almost always mean "more options".', 'Drei Punkte bedeuten fast immer „weitere Optionen“.')], 'profile', 'profile-more', t('The three dots are at the top right.', 'Die drei Punkte sind oben rechts.')),
        step(t(`Tap "${block}"`, `Tippen Sie auf „${block}“`), t('It is in the list.', 'Das steht in der Liste.'), [t('"Report" tells the platform about a problem. Blocking only stops contact with you.', '„Melden“ teilt der Plattform ein Problem mit. Blockieren beendet nur den Kontakt zu Ihnen.')], 'profile-menu', 'block-user', t(`"${block}" is the first line.`, `„${block}“ ist die erste Zeile.`)),
        step(t('Confirm', 'Bestätigen'), t('Tap the coloured button.', 'Tippen Sie auf den farbigen Knopf.'), [t('The other person is not told.', 'Die andere Person erfährt davon nichts.')], 'block-confirm', 'block-yes', t('The coloured button confirms it.', 'Der farbige Knopf bestätigt es.')),
      ]),
  ];
  return list;
}

/** Text lessons that apply to every platform. */
export function moreGeneralSocialLessons(lang: Language, base: Tutorial): Tutorial[] {
  const isEn = lang === 'en';
  const t = (en: string, de: string) => (isEn ? en : de);
  const shared = { categoryId: base.categoryId, categoryTitle: base.categoryTitle, difficulty: base.difficulty, image: base.image };
  return [
    {
      ...shared,
      id: 'social-before-posting',
      title: t('Before You Post: Four Quick Questions', 'Vor dem Posten: Vier kurze Fragen'),
      description: t('A short check, so that you do not regret a post later.', 'Eine kurze Prüfung, damit Sie einen Beitrag später nicht bereuen.'),
      durationMinutes: 3,
      tags: [t('Social media', 'Soziale Medien'), t('Privacy', 'Privatsphäre')],
      steps: [
        { stepNumber: 1, title: t('Who can see this?', 'Wer kann das sehen?'), lead: t('Check the audience before you post.', 'Prüfen Sie vor dem Posten, wer es sieht.'), paragraphs: [t('Many apps show "Public" or "Friends" above the text. Public means anyone, even people you do not know.', 'Viele Apps zeigen über dem Text „Öffentlich“ oder „Freunde“. Öffentlich heißt: alle, auch Fremde.')] },
        { stepNumber: 2, title: t('Does it reveal too much?', 'Verrät es zu viel?'), lead: t('Leave out address, phone number and holiday dates.', 'Lassen Sie Adresse, Telefonnummer und Urlaubsdaten weg.'), paragraphs: [t('Photos can also show house numbers, car plates or documents in the background.', 'Fotos können auch Hausnummern, Autokennzeichen oder Dokumente im Hintergrund zeigen.')] },
        { stepNumber: 3, title: t('Are others in the picture?', 'Sind andere auf dem Bild?'), lead: t('Ask first.', 'Fragen Sie zuerst.'), paragraphs: [t('Ask before you post photos of grandchildren or friends. Children cannot decide this for themselves.', 'Fragen Sie, bevor Sie Fotos von Enkeln oder Freunden posten. Kinder können das nicht selbst entscheiden.')] },
        { stepNumber: 4, title: t('Would you say it out loud?', 'Würden Sie es laut sagen?'), lead: t('If not, do not post it.', 'Wenn nicht, posten Sie es nicht.'), paragraphs: [t('What you post can be copied. Deleting it later does not always remove it everywhere.', 'Was Sie posten, kann kopiert werden. Späteres Löschen entfernt es nicht immer überall.')] },
      ],
    },
    {
      ...shared,
      id: 'social-strangers',
      title: t('Messages from Strangers', 'Nachrichten von Fremden'),
      description: t('Friendly messages can be the start of a scam. Learn the warning signs.', 'Freundliche Nachrichten können der Beginn eines Betrugs sein. Lernen Sie die Warnzeichen.'),
      durationMinutes: 4,
      tags: [t('Social media', 'Soziale Medien'), t('Safety', 'Sicherheit')],
      steps: [
        { stepNumber: 1, title: t('Too nice, too fast', 'Zu nett, zu schnell'), lead: t('Be careful if a stranger quickly becomes very affectionate.', 'Vorsicht, wenn Fremde schnell sehr vertraut werden.'), paragraphs: [t('Love scams often begin this way. The photos are stolen, and the stories are invented.', 'Liebesbetrug beginnt oft so. Die Fotos sind gestohlen, die Geschichten erfunden.')] },
        { stepNumber: 2, title: t('Then comes the money', 'Dann kommt das Geld'), lead: t('Sooner or later there is an emergency.', 'Früher oder später gibt es einen Notfall.'), paragraphs: [t('A hospital bill, a blocked account, a great investment. However real it sounds, do not send money or gift card codes.', 'Eine Krankenhausrechnung, ein gesperrtes Konto, eine tolle Geldanlage. Wie echt es auch klingt: Senden Sie weder Geld noch Gutschein-Codes.')], warning: t('Never send money to someone you have only met online.', 'Senden Sie nie Geld an jemanden, den Sie nur online kennen.') },
        { stepNumber: 3, title: t('What you can do', 'Was Sie tun können'), lead: t('Talk to someone you trust, then block and report.', 'Sprechen Sie mit einer Vertrauensperson, dann blockieren und melden.'), paragraphs: [t('Anyone can fall for this, and there is no need to feel ashamed. If money has gone, go to the police.', 'Das kann allen passieren, Sie müssen sich nicht schämen. Ist Geld weg, gehen Sie zur Polizei.')] },
      ],
    },
  ];
}

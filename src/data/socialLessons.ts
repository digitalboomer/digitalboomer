/** Social media lessons, in English and German: practice per service, and two general lessons. */
import { IMAGES } from '../assets/images';
import { Language, Tutorial, TutorialStep } from '../types';
import type { Service } from './services';
import { socialExtraLabels } from './socialTasks';

const LIKE_WORD: Record<string, { en: string; de: string }> = {
  pinterest: { en: 'Save', de: 'Merken' },
  youtube: { en: 'Like', de: 'Mag ich' },
  reddit: { en: 'Upvote', de: 'Hochwählen' },
};

export function socialLessons(lang: Language, service: Service): Tutorial[] {
  const isEn = lang === 'en';
  const t = (en: string, de: string) => (isEn ? en : de);
  const name = service.name;
  const like = LIKE_WORD[service.id]?.[lang] ?? t('Like', 'Gefällt mir');

  const labels: Record<string, string> = {
    tapHere: t('Tap here', 'Hier tippen'),
    phoneLabel: t('Simulated phone screen', 'Simulierter Handy-Bildschirm'),
    phoneBadge: t('Practice, not real', 'Übung, nicht echt'),
    appTitle: name,
    search: t('Search', 'Suchen'),
    searchField: t('Search', 'Suchen'),
    newPost: t('New post', 'Neuer Beitrag'),
    back: t('Back', 'Zurück'),
    anna: 'Anna Beispiel',
    you: t('You', 'Sie'),
    postAge: t('2 hours ago', 'vor 2 Stunden'),
    postText: t('The flowers in my garden are blooming!', 'Die Blumen in meinem Garten blühen!'),
    like,
    comment: t('Comment', 'Kommentar'),
    commentField: t('Write a comment', 'Kommentar schreiben'),
    send: t('Send', 'Senden'),
    defaultComment: t('How lovely!', 'Wie schön!'),
    defaultSearch: t('Garden', 'Garten'),
    resultOne: t('Garden tips for beginners', 'Gartentipps für Anfänger'),
    resultTwo: t('Flowers in spring', 'Blumen im Frühling'),
    resultThree: t('Garden club', 'Gartenverein'),
    noRealPost: t('Practice only: nothing was searched on the internet.', 'Nur Übung: Es wurde nichts im Internet gesucht.'),
    suggestC1: t('How lovely!', 'Wie schön!'),
    suggestC2: t('Beautiful', 'Wunderschön'),
    suggestC3: t('Thank you', 'Danke'),
    suggestS1: t('Garden', 'Garten'),
    suggestS2: t('Recipes', 'Rezepte'),
    suggestS3: t('Travel', 'Reisen'),
    space: t('space', 'Leerzeichen'),
    deleteKey: t('Delete letter', 'Buchstabe löschen'),
    shift: t('Capital letter', 'Großbuchstabe'),
    whatsNew: t("What's new?", 'Was gibt es Neues?'), shareWord: t('Share', 'Teilen'), repostWord: t('Repost', 'Teilen'), downWord: t('Downvote', 'Runterwählen'),
    following: t('Following', 'Folge ich'), forYou: t('For you', 'Für dich'), chipsYt: t('All|Gardens|Music|News', 'Alle|Gärten|Musik|Nachrichten'), chipGarden: t('Garden', 'Garten'),
    originalSound: t('Original sound', 'Originalton'), jobTitle: t('Retired teacher', 'Lehrerin im Ruhestand'),
    ...socialExtraLabels(lang, service),
  };

  const hints = (where: string): Record<string, string> => ({
    search: t(`That was the search. ${where}`, `Das war die Suche. ${where}`),
    'new-post': t(`That would start your own post. ${where}`, `Damit beginnen Sie einen eigenen Beitrag. ${where}`),
    like: t(`That was the "${like}" button. ${where}`, `Das war der Knopf „${like}“. ${where}`),
    comment: t(`That opens the comments. ${where}`, `Damit öffnen Sie die Kommentare. ${where}`),
    back: t(`That would go back. ${where}`, `Damit gehen Sie zurück. ${where}`),
    share: t(`That would send the post to someone. ${where}`, `Damit senden Sie den Beitrag an jemanden. ${where}`),
    repost: t(`That would show the post to your followers. ${where}`, `Das würde den Beitrag Ihren Abonnenten zeigen. ${where}`),
    inbox: t(`That opens your messages. ${where}`, `Damit öffnen Sie Ihre Nachrichten. ${where}`),
    profile: t(`That opens the page of the person. ${where}`, `Damit öffnen Sie die Seite der Person. ${where}`),
    downvote: t(`That shows you dislike the post. ${where}`, `Damit zeigen Sie, dass Ihnen der Beitrag nicht gefällt. ${where}`),
    'result-other-1': t(`That is a different result. ${where}`, `Das ist ein anderes Ergebnis. ${where}`),
    'result-other-2': t(`That is a different result. ${where}`, `Das ist ein anderes Ergebnis. ${where}`),
  });
  const step = (n: number, title: string, lead: string, paragraphs: string[], screen: string, targetId: string, where: string, successText: string, requiresText = false): TutorialStep => ({
    stepNumber: n, title, lead, paragraphs,
    practice: { requiresText, screen, targetId, successText, hints: hints(where), fallbackHint: where, showMeText: t(`The frame shows where to tap. ${where}`, `Der Rahmen zeigt, wohin Sie tippen. ${where}`) },
  });
  const base = (kind: string, title: string, description: string, nextTutorialId: string, successTitle: string, successText: string, introText: string, steps: TutorialStep[]): Tutorial => ({
    id: `${service.id}-${kind}`,
    title,
    categoryId: 'social-media',
    categoryTitle: t('Social Media', 'Soziale Medien'),
    description,
    durationMinutes: 4,
    difficulty: t('Easy', 'Einfach') as Tutorial['difficulty'],
    image: IMAGES.topicSocialMedia,
    tags: [name, t('Social media', 'Soziale Medien'), t('Practice', 'Übung')],
    practice: {
      screenId: 'social',
      appId: service.id,
      kind,
      notice: t('Practice mode: the posts are made up, and nothing is really published.', 'Übungsmodus: Die Beiträge sind erfunden, und nichts wird wirklich veröffentlicht.'),
      introTitle: t('What you will practise', 'Das üben Sie hier'),
      introText,
      successTitle,
      successText,
      nextTutorialId,
      labels,
    },
    steps,
  });

  const WHERE: Record<string, { like: [string, string]; comment: [string, string] }> = {
    facebook: { like: [`"${like}" is under the photo, on the left.`, `„${like}“ steht unter dem Foto, links.`], comment: ['"Comment" is under the photo, in the middle.', '„Kommentar“ steht unter dem Foto, in der Mitte.'] },
    instagram: { like: ['The heart is under the photo, on the left.', 'Das Herz ist unter dem Foto, links.'], comment: ['The speech bubble is next to the heart.', 'Die Sprechblase ist neben dem Herz.'] },
    youtube: { like: [`"${like}" is under the video title.`, `„${like}“ steht unter dem Videotitel.`], comment: ['"Comment" is next to it.', '„Kommentar“ steht daneben.'] },
    tiktok: { like: ['The heart is on the right side of the video.', 'Das Herz ist rechts neben dem Video.'], comment: ['The speech bubble is under the heart.', 'Die Sprechblase ist unter dem Herz.'] },
    x: { like: ['The heart is under the post, on the right.', 'Das Herz ist unter dem Beitrag, rechts.'], comment: ['The speech bubble is under the post, on the left.', 'Die Sprechblase ist unter dem Beitrag, links.'] },
    linkedin: { like: [`"${like}" is under the post, on the left.`, `„${like}“ steht unter dem Beitrag, links.`], comment: ['"Comment" is in the middle.', '„Kommentar“ steht in der Mitte.'] },
    pinterest: { like: [`The red "${like}" button is on the picture.`, `Der rote Knopf „${like}“ ist auf dem Bild.`], comment: ['The speech bubble is under the picture.', 'Die Sprechblase ist unter dem Bild.'] },
    threads: { like: ['The heart is under the post.', 'Das Herz ist unter dem Beitrag.'], comment: ['The speech bubble is next to the heart.', 'Die Sprechblase ist neben dem Herz.'] },
    reddit: { like: ['The arrow pointing up is under the post, on the left.', 'Der Pfeil nach oben ist unter dem Beitrag, links.'], comment: ['"Comment" is next to the arrows.', '„Kommentar“ steht neben den Pfeilen.'] },
  };
  const place = WHERE[service.id] ?? WHERE.facebook;
  const whereLike = t(place.like[0], place.like[1]);
  const whereComment = t(place.comment[0], place.comment[1]);
  const whereSearch = t('The magnifying glass is the search.', 'Die Lupe ist die Suche.');

  return [
    base('like', t(`${name}: Like and Comment`, `${name}: Liken und kommentieren`),
      t(`Practise reacting to a post by a friend in ${name}. Nothing is really published.`, `Üben Sie in ${name}, auf den Beitrag einer Freundin zu reagieren. Nichts wird wirklich veröffentlicht.`),
      `${service.id}-search`,
      t('Well done! You reacted to a post.', 'Gut gemacht! Sie haben auf einen Beitrag reagiert.'),
      t('In real life, other people can see your comment. Only write what you would also say out loud. This was only practice.', 'Im echten Leben können andere Ihren Kommentar sehen. Schreiben Sie nur, was Sie auch laut sagen würden. Das war nur eine Übung.'),
      t('You will react to a post in 3 steps. You cannot break anything, and there is no time limit.', 'Sie reagieren in 3 Schritten auf einen Beitrag. Sie können nichts kaputt machen, und es gibt kein Zeitlimit.'),
      [
        step(1, t(`Tap "${like}"`, `Tippen Sie auf „${like}“`), whereLike, [t('This shows Anna that you like her post. You can tap it again to take it back.', 'Damit zeigen Sie Anna, dass Ihnen ihr Beitrag gefällt. Mit einem weiteren Tippen nehmen Sie es zurück.')], 'feed', 'like', whereLike, t('That was right. The symbol is now filled in.', 'Das war richtig. Das Symbol ist jetzt ausgefüllt.')),
        step(2, t('Open the comments', 'Kommentare öffnen'), whereComment, [t('With a comment you can write a few words under the post.', 'Mit einem Kommentar schreiben Sie ein paar Worte unter den Beitrag.')], 'liked', 'comment', whereComment, t('That was right. Now you can write.', 'Das war richtig. Jetzt können Sie schreiben.')),
        step(3, t('Write and send', 'Schreiben und senden'), t('Tap letters or a word above the letters. Then tap send.', 'Tippen Sie Buchstaben oder ein Wort über den Buchstaben. Dann tippen Sie auf Senden.'), [t('The send button appears as soon as you have written something.', 'Der Senden-Knopf erscheint, sobald Sie etwas geschrieben haben.')], 'comment', 'send', t('First write something on the keyboard. Then the send button appears.', 'Schreiben Sie zuerst etwas auf der Tastatur. Dann erscheint der Senden-Knopf.'), t('That was right.', 'Das war richtig.'), true),
      ]),
    base('search', t(`${name}: Search for a Topic`, `${name}: Nach einem Thema suchen`),
      t(`Practise finding things that interest you in ${name}.`, `Üben Sie, in ${name} zu finden, was Sie interessiert.`),
      'social-privacy',
      t('Well done! You found what you were looking for.', 'Gut gemacht! Sie haben gefunden, was Sie gesucht haben.'),
      t('Search works the same way for people, groups and topics. This was only practice.', 'Die Suche funktioniert genauso für Personen, Gruppen und Themen. Das war nur eine Übung.'),
      t('You will search for a topic in 3 steps. You cannot break anything, and there is no time limit.', 'Sie suchen in 3 Schritten nach einem Thema. Sie können nichts kaputt machen, und es gibt kein Zeitlimit.'),
      [
        step(1, t('Tap the magnifying glass', 'Tippen Sie auf die Lupe'), whereSearch, [t('The magnifying glass means "search" in almost every app.', 'Die Lupe bedeutet in fast jeder App „Suchen“.')], 'feed', 'search', whereSearch, t('That was right. Now write what you are looking for.', 'Das war richtig. Jetzt schreiben Sie, was Sie suchen.')),
        step(2, t('Write and search', 'Schreiben und suchen'), t('Tap a word above the letters, or type your own. Then tap the magnifying glass next to the text.', 'Tippen Sie ein Wort über den Buchstaben, oder schreiben Sie selbst. Dann tippen Sie auf die Lupe neben dem Text.'), [t('One or two words are enough.', 'Ein oder zwei Wörter genügen.')], 'search', 'send', t('First write something. Then the magnifying glass appears next to the text.', 'Schreiben Sie zuerst etwas. Dann erscheint die Lupe neben dem Text.'), t('That was right. Here are the results.', 'Das war richtig. Hier sind die Ergebnisse.'), true),
        step(3, t('Open a result', 'Ein Ergebnis öffnen'), t('Tap the first result.', 'Tippen Sie auf das erste Ergebnis.'), [t('You can always go back and open another one.', 'Sie können jederzeit zurückgehen und ein anderes öffnen.')], 'results', 'result-one', t('The first result is at the top.', 'Das erste Ergebnis steht ganz oben.'), t('That was right.', 'Das war richtig.')),
      ]),
  ];
}

/** Two text lessons that apply to every social media service. */
export function generalSocialLessons(lang: Language): Tutorial[] {
  const isEn = lang === 'en';
  const t = (en: string, de: string) => (isEn ? en : de);
  const shared = {
    categoryId: 'social-media',
    categoryTitle: t('Social Media', 'Soziale Medien'),
    difficulty: t('Easy', 'Einfach') as Tutorial['difficulty'],
    image: IMAGES.topicSocialMedia,
  };
  return [
    {
      ...shared,
      id: 'social-privacy',
      title: t('Protect Your Privacy on Social Media', 'Ihre Privatsphäre in sozialen Medien schützen'),
      description: t('Decide who can see what you share. Three settings make a big difference.', 'Entscheiden Sie, wer sieht, was Sie teilen. Drei Einstellungen machen einen großen Unterschied.'),
      durationMinutes: 5,
      tags: [t('Privacy', 'Privatsphäre'), t('Social media', 'Soziale Medien'), t('Safety', 'Sicherheit')],
      steps: [
        { stepNumber: 1, title: t('Who can see your posts?', 'Wer sieht Ihre Beiträge?'), lead: t('Make your account private, or share with friends only.', 'Stellen Sie Ihr Konto auf privat, oder teilen Sie nur mit Freunden.'), paragraphs: [t('You find this in the settings, under "Privacy". The words differ a little from service to service.', 'Das finden Sie in den Einstellungen unter „Privatsphäre“ oder „Datenschutz“. Die Wörter unterscheiden sich je nach Dienst etwas.'), t('Then only people you have accepted can see what you post.', 'Dann sehen nur Personen, die Sie angenommen haben, was Sie posten.')] },
        { stepNumber: 2, title: t('Accept only people you know', 'Nehmen Sie nur Menschen an, die Sie kennen'), lead: t('You can simply ignore requests from strangers.', 'Anfragen von Fremden können Sie einfach ignorieren.'), paragraphs: [t('Criminals sometimes copy the name and photo of someone you know. If in doubt, phone that person and ask.', 'Kriminelle kopieren manchmal Namen und Foto einer Person, die Sie kennen. Rufen Sie im Zweifel diese Person an und fragen Sie nach.')], tip: t('Nobody is offended if you do not accept a request.', 'Niemand ist beleidigt, wenn Sie eine Anfrage nicht annehmen.') },
        { stepNumber: 3, title: t('What you should not share', 'Was Sie nicht teilen sollten'), lead: t('Your address, phone number, bank details and holiday plans stay private.', 'Adresse, Telefonnummer, Bankdaten und Urlaubspläne bleiben privat.'), paragraphs: [t('A post saying "We are away for two weeks" also tells burglars that your home is empty. Share holiday photos after you are back.', 'Ein Beitrag wie „Wir sind zwei Wochen weg“ verrät auch Einbrechern, dass Ihr Zuhause leer ist. Teilen Sie Urlaubsfotos erst nach der Rückkehr.')], warning: t('Nobody from a service will ever ask for your password in a message.', 'Niemand von einem Dienst fragt in einer Nachricht nach Ihrem Passwort.') },
      ],
    },
    {
      ...shared,
      id: 'social-fake-news',
      title: t('Spot False Reports and Scams', 'Falschmeldungen und Betrug erkennen'),
      description: t('Not everything on social media is true. Three quick checks help you decide.', 'Nicht alles in sozialen Medien stimmt. Drei schnelle Prüfungen helfen Ihnen.'),
      durationMinutes: 5,
      tags: [t('Fake news', 'Falschmeldungen'), t('Social media', 'Soziale Medien'), t('Safety', 'Sicherheit')],
      steps: [
        { stepNumber: 1, title: t('Who wrote this?', 'Wer hat das geschrieben?'), lead: t('Check whether you know the source.', 'Prüfen Sie, ob Sie die Quelle kennen.'), paragraphs: [t('A well-known newspaper or broadcaster can be checked. An unknown account with few followers deserves more care.', 'Eine bekannte Zeitung oder ein Sender lässt sich prüfen. Ein unbekanntes Konto mit wenigen Abonnenten verdient mehr Vorsicht.')] },
        { stepNumber: 2, title: t('Does it make you very angry or afraid?', 'Macht es Sie sehr wütend oder ängstlich?'), lead: t('Strong feelings are often the goal.', 'Starke Gefühle sind oft das Ziel.'), paragraphs: [t('Take a breath before you share something. Look for the same news on a website you trust.', 'Atmen Sie durch, bevor Sie etwas teilen. Suchen Sie dieselbe Nachricht auf einer Website, der Sie vertrauen.')], tip: t('If you are unsure, simply do not share it.', 'Wenn Sie unsicher sind, teilen Sie es einfach nicht.') },
        { stepNumber: 3, title: t('Too good to be true?', 'Zu schön, um wahr zu sein?'), lead: t('Famous people do not give away money on social media.', 'Prominente verschenken in sozialen Medien kein Geld.'), paragraphs: [t('Adverts with celebrities, quick profits or prizes are often scams. Pictures and voices can also be faked with AI today.', 'Werbung mit Prominenten, schnellen Gewinnen oder Preisen ist oft Betrug. Bilder und Stimmen lassen sich heute auch mit KI fälschen.')], warning: t('Never pay or enter your bank details because of a post or advert.', 'Zahlen Sie nie und geben Sie keine Bankdaten ein, nur wegen eines Beitrags oder einer Werbung.') },
      ],
    },
  ];
}

/**
 * More banking lessons per bank, in English and German. All data is fictional and
 * the screen stays a neutral "Practice bank": a real bank's look on a practice
 * site would look like phishing. Facts checked: the recipient name check is
 * mandatory for euro transfers in the EEA since October 2025.
 */
import { Language, Tutorial, TutorialStep } from '../types';
import type { Service } from './services';

const APPROVAL_APP: Record<string, string> = {
  sparkasse: 'S-pushTAN',
  volksbank: 'VR SecureGo plus',
  deutschebank: 'photoTAN',
  commerzbank: 'photoTAN',
  ing: 'Banking to go',
  dkb: 'TAN2go',
  postbank: 'BestSign',
  n26: 'N26',
};

/** One sentence about how this bank's customers usually approve payments. */
export function approvalNote(lang: Language, bank?: Service): string {
  const isEn = lang === 'en';
  if (!bank) return isEn ? 'In real life this often happens in a separate approval app.' : 'Im echten Leben geschieht das oft in einer eigenen Freigabe-App.';
  if (bank.id === 'n26') return isEn ? 'At N26 you usually approve in the app on your paired phone.' : 'Bei N26 geben Sie meist in der App auf Ihrem gekoppelten Handy frei.';
  const app = APPROVAL_APP[bank.id];
  return isEn ? `${bank.name} customers often approve with ${app}. Ask your bank which method you have.` : `Bei ${bank.name} geben viele Kunden mit ${app} frei. Fragen Sie Ihre Bank, welches Verfahren Sie haben.`;
}

/**
 * Where things are in each bank's practice layout: the menu with more services, the
 * transfer button and the current account. The lesson texts use these, so they always
 * match the screen (src/components/practice/BankingScreen.tsx).
 */
export function bankWhere(lang: Language, layout: string) {
  const t = (en: string, de: string) => (lang === 'en' ? en : de);
  const W: Record<string, { moreLabel: string; more: string; transfer: string; account: string }> = {
    action: { moreLabel: t('Services', 'Services'), more: t('"Services" is in the bar at the bottom, the third button.', '„Services“ ist in der Leiste unten, der dritte Knopf.'), transfer: t('"Send money" is the first round button under "Quick access".', '„Geld senden“ ist der erste runde Knopf unter „Schnellzugriffe“.'), account: t('Your current account is under "Accounts and cards".', 'Ihr Girokonto steht unter „Konten und Karten“.') },
    vr: { moreLabel: t('Menu', 'Menü'), more: t('"Menu" is at the bottom right.', '„Menü“ ist unten rechts.'), transfer: t('"Transfer" is the button under your accounts.', '„Überweisung“ ist der Knopf unter Ihren Konten.'), account: t('Your current account is the first line under "Accounts".', 'Ihr Girokonto ist die erste Zeile unter „Konten“.') },
    db: { moreLabel: t('More', 'Mehr'), more: t('"More" is at the bottom right.', '„Mehr“ ist unten rechts.'), transfer: t('"Transfer" is the first round button under your account.', '„Überweisung“ ist der erste runde Knopf unter Ihrem Konto.'), account: t('Your current account is in the white box under the total.', 'Ihr Girokonto ist im weißen Feld unter der Gesamtsumme.') },
    cb: { moreLabel: t('Banking', 'Banking'), more: t('"Banking" is in the bar at the bottom, the second button.', '„Banking“ ist in der Leiste unten, der zweite Knopf.'), transfer: t('"Transfer" is the first button under your account.', '„Überweisung“ ist der erste Knopf unter Ihrem Konto.'), account: t('Your current account is the box with the balance.', 'Ihr Girokonto ist das Feld mit dem Kontostand.') },
    pb: { moreLabel: t('More', 'Mehr'), more: t('"More" is at the bottom right.', '„Mehr“ ist unten rechts.'), transfer: t('"Transfer" is in the bar at the bottom, the second button.', '„Überweisung“ ist in der Leiste unten, der zweite Knopf.'), account: t('Your current account is the first line of your financial status.', 'Ihr Girokonto ist die erste Zeile im Finanzstatus.') },
    ing: { moreLabel: t('Orders', 'Aufträge'), more: t('"Orders" is in the bar at the bottom, the second button.', '„Aufträge“ ist in der Leiste unten, der zweite Knopf.'), transfer: t('"Transfer" is the button inside your account card.', '„Überweisung“ ist der Knopf in Ihrer Kontokarte.'), account: t('Your current account is the first card.', 'Ihr Girokonto ist die erste Karte.') },
    dkb: { moreLabel: t('Orders', 'Aufträge'), more: t('"Orders" is in the bar at the bottom, the second button.', '„Aufträge“ ist in der Leiste unten, der zweite Knopf.'), transfer: t('"Transfer" is the first button under your financial overview.', '„Überweisung“ ist der erste Knopf unter Ihrer Finanzübersicht.'), account: t('Your current account is the first line under "Accounts".', 'Ihr Girokonto ist die erste Zeile unter „Konten“.') },
    neo: { moreLabel: t('More', 'Mehr'), more: t('"More" is at the bottom right.', '„Mehr“ ist unten rechts.'), transfer: t('The button is under your balance, on the left.', 'Der Knopf ist unter Ihrem Kontostand, links.'), account: t('Your balance is the big number at the top.', 'Ihr Kontostand ist die große Zahl oben.') },
    classic: { moreLabel: t('More', 'Mehr'), more: t('"More" is at the bottom right.', '„Mehr“ ist unten rechts.'), transfer: t('It is the left tile under your account.', 'Das ist die linke Kachel unter Ihrem Konto.'), account: t('Your account is the white card with the balance.', 'Ihr Konto ist die weiße Karte mit dem Kontostand.') },
  };
  return W[layout] ?? W.classic;
}

export function bankingTasks(lang: Language, bank: Service, base: Tutorial, layout: string): Tutorial[] {
  const isEn = lang === 'en';
  const t = (en: string, de: string) => (isEn ? en : de);
  const baseLabels = base.practice!.labels;

  const common: Record<string, string> = {
    moreTitle: bankWhere(lang, layout).moreLabel,
    menuAbroad: t('Transfer abroad', 'Auslandsüberweisung'),
    menuStanding: t('Standing orders', 'Daueraufträge'),
    menuScheduled: t('Transfer for later', 'Terminüberweisung'),
    menuOwn: t('Between my accounts', 'Zwischen meinen Konten'),
    menuDocuments: t('Statements', 'Kontoauszüge'),
    menuCard: t('My card', 'Meine Karte'),
    nameCheck: t('Name check', 'Namensprüfung'),
    nameOk: t('Name matches', 'Name stimmt überein'),
    approveText: approvalNote(lang, bank),
    whereTo: t('Which country?', 'In welches Land?'),
    italy: t('Italy', 'Italien'), france: t('France', 'Frankreich'), usa: t('USA', 'USA'),
    howOften: t('How often?', 'Wie oft?'),
    weekly: t('Every week', 'Jede Woche'), monthly: t('Every month', 'Jeden Monat'), yearly: t('Every year', 'Jedes Jahr'),
    whenStart: t('When should it be paid?', 'Wann soll gezahlt werden?'),
    dateFirst: t('1 December', '1. Dezember'), dateFifteen: t('15 December', '15. Dezember'), dateOther: t('Choose another date', 'Anderes Datum wählen'),
    orderRent: t('Rent', 'Miete'), orderClub: t('Bowling club', 'Kegelclub'), orderNew: t('New standing order', 'Neuer Dauerauftrag'),
    orderDelete: t('Delete standing order', 'Dauerauftrag löschen'),
    orderSure: t('Delete this standing order? Payments stop after that.', 'Diesen Dauerauftrag löschen? Danach werden keine Zahlungen mehr ausgeführt.'),
    orderYes: t('Yes, delete', 'Ja, löschen'), noKeep: t('No, keep it', 'Nein, behalten'),
    newName: t('Name', 'Name'), newContinue: t('Continue', 'Weiter'),
    savings: t('Savings account', 'Sparkonto'), otherAccount: t('Second current account', 'Zweites Girokonto'), toWhichAccount: t('To which account?', 'Auf welches Konto?'),
    pushTitle: t('Approval request', 'Freigabe-Anfrage'), pushText: t('A payment is waiting for your approval.', 'Eine Zahlung wartet auf Ihre Freigabe.'), pushTime: t('now', 'jetzt'),
    rejectButton: t('Reject', 'Ablehnen'),
    cardName: t('Debit card', 'Girokarte'), cardBlock: t('Block card', 'Karte sperren'), reasonTitle: t('Why do you want to block it?', 'Warum möchten Sie sie sperren?'),
    reasonLost: t('Lost', 'Verloren'), reasonStolen: t('Stolen', 'Gestohlen'), reasonDamaged: t('Damaged', 'Beschädigt'),
    cardSure: t('Block this card? It can no longer be used.', 'Diese Karte sperren? Sie kann dann nicht mehr benutzt werden.'), cardYes: t('Yes, block', 'Ja, sperren'),
    docOctober: t('Statement October', 'Kontoauszug Oktober'), docSeptember: t('Statement September', 'Kontoauszug September'), docAugust: t('Statement August', 'Kontoauszug August'),
    hideTransferRows: '',
    doneText: '',
  };

  const hints = (where: string): Record<string, string> => ({
    more: t(`That opens the menu with more services. ${where}`, `Damit öffnen Sie das Menü mit weiteren Diensten. ${where}`),
    transfer: t(`That starts a normal transfer. ${where}`, `Damit beginnen Sie eine normale Überweisung. ${where}`),
    account: t(`That opens your account. ${where}`, `Damit öffnen Sie Ihr Konto. ${where}`),
    statements: t(`That shows your payments. ${where}`, `Das zeigt Ihre Zahlungen. ${where}`),
    'send-money': t(`That is for sending money. ${where}`, `Damit senden Sie Geld. ${where}`),
    back: t(`That goes back. ${where}`, `Damit gehen Sie zurück. ${where}`),
    cancel: t(`That would stop this. ${where}`, `Damit würden Sie abbrechen. ${where}`),
    'country-fr': t(`That is France. ${where}`, `Das ist Frankreich. ${where}`),
    'country-us': t(`That is the USA. Outside the euro area, fees and exchange rates apply. ${where}`, `Das sind die USA. Außerhalb des Euro-Raums fallen Gebühren und Wechselkurse an. ${where}`),
    'person-peter': t(`That is Peter. ${where}`, `Das ist Peter. ${where}`),
    'person-new': t(`There you enter someone new. ${where}`, `Dort geben Sie jemand Neues ein. ${where}`),
    'person-anna': t(`That person is already saved. ${where}`, `Diese Person ist schon gespeichert. ${where}`),
    'amount-0': t(`That is a different amount. ${where}`, `Das ist ein anderer Betrag. ${where}`),
    'amount-2': t(`That is a different amount. ${where}`, `Das ist ein anderer Betrag. ${where}`),
    'amount-3': t(`That is a different amount. ${where}`, `Das ist ein anderer Betrag. ${where}`),
    'freq-weekly': t(`That would pay every week. ${where}`, `Das würde jede Woche zahlen. ${where}`),
    'freq-yearly': t(`That would pay only once a year. ${where}`, `Das würde nur einmal im Jahr zahlen. ${where}`),
    'date-15': t(`That is a different date. ${where}`, `Das ist ein anderes Datum. ${where}`),
    'date-other': t(`There you could pick any date. ${where}`, `Dort könnten Sie ein beliebiges Datum wählen. ${where}`),
    'order-rent': t(`That is your rent. Please leave it. ${where}`, `Das ist Ihre Miete. Lassen Sie sie bitte. ${where}`),
    'approve-ok': t(`Stop: never approve a payment you did not start. ${where}`, `Halt: Geben Sie nie eine Zahlung frei, die Sie nicht selbst begonnen haben. ${where}`),
    confirm: t(`Better not: the name does not match, so your money could go to the wrong person. ${where}`, `Besser nicht: Der Name stimmt nicht überein, Ihr Geld könnte an die falsche Person gehen. ${where}`),
    'reason-stolen': t(`Also a good reason, but this practice is about a lost card. ${where}`, `Auch ein guter Grund, aber in dieser Übung ist die Karte verloren. ${where}`),
    'reason-damaged': t(`A damaged card can be replaced. Here the card is lost. ${where}`, `Eine beschädigte Karte lässt sich ersetzen. Hier ist die Karte verloren. ${where}`),
    'doc-september': t(`That is September. ${where}`, `Das ist September. ${where}`),
    'doc-august': t(`That is August. ${where}`, `Das ist August. ${where}`),
    'own-other': t(`That is your other current account. ${where}`, `Das ist Ihr anderes Girokonto. ${where}`),
  });

  const lesson = (
    kind: string, title: string, description: string, minutes: number, intro: string,
    successTitle: string, successText: string, labels: Record<string, string>, steps: Omit<TutorialStep, 'stepNumber'>[],
  ): Tutorial => ({
    ...base,
    id: `${bank.id}-${kind}`,
    title: `${bank.name}: ${title}`,
    description,
    durationMinutes: minutes,
    tags: [t('Banking', 'Banking'), t('Practice', 'Übung'), bank.name, title],
    quiz: undefined,
    practice: {
      ...base.practice!,
      kind,
      introText: `${intro} ${t('There is no time limit.', 'Es gibt kein Zeitlimit.')}`,
      successTitle,
      successText,
      labels: { ...baseLabels, ...common, ...labels },
    },
    steps: steps.map((step, i) => ({ ...step, stepNumber: i + 1 })),
  });

  const step = (title: string, lead: string, paragraphs: string[], screen: string, targetId: string, where: string, successText = t('That was right.', 'Das war richtig.')): Omit<TutorialStep, 'stepNumber'> => ({
    title, lead, paragraphs,
    practice: { screen, targetId, successText, hints: hints(where), fallbackHint: where, showMeText: t(`The frame shows where to tap. ${where}`, `Der Rahmen zeigt, wohin Sie tippen. ${where}`) },
  });

  const whereUnlock = t('"Unlock" is the big button at the bottom.', '„Entsperren“ ist der große Knopf unten.');
  const unlock = step(t('Open and unlock the app', 'App öffnen und entsperren'), t('Tap "Unlock".', 'Tippen Sie auf „Entsperren“.'), [t('In a real app you enter your password or use your fingerprint. Here you enter nothing.', 'In einer echten App geben Sie Ihr Passwort ein oder nutzen den Fingerabdruck. Hier geben Sie nichts ein.')], 'unlock', 'unlock', whereUnlock);
  const where = bankWhere(lang, layout);
  const whereMore = where.more;
  const more = step(t(`Open "${where.moreLabel}"`, `„${where.moreLabel}“ öffnen`), whereMore, [t('Banking apps keep less common services in a menu. In your app it may be called "Services" or "Banking".', 'Banking-Apps legen seltenere Dienste in ein Menü. In Ihrer App heißt es vielleicht „Services“ oder „Banking“.')], 'overview', 'more', whereMore);
  const menu = (title: string, id: string, label: string) => {
    const where = t(`"${label}" is in the list.`, `„${label}“ steht in der Liste.`);
    return step(title, where, [t('Take your time to read the list.', 'Nehmen Sie sich Zeit, die Liste zu lesen.')], 'more', id, where);
  };
  const person = step(t('Choose the person', 'Person wählen'), t('Tap "Anna Beispiel".', 'Tippen Sie auf „Anna Beispiel“.'), [t('People you have paid before are saved here.', 'Personen, denen Sie schon Geld geschickt haben, sind hier gespeichert.')], 'recipient', 'person-anna', t('Anna is the first line.', 'Anna ist die erste Zeile.'));
  const amount = (value: string) => step(t('Choose the amount', 'Betrag wählen'), t(`Tap "${value}".`, `Tippen Sie auf „${value}“.`), [t('In a real app you type the amount yourself.', 'In einer echten App tippen Sie den Betrag selbst ein.')], 'amount', 'amount-right', t(`${value} is the button at the top right.`, `${value} ist der Knopf oben rechts.`));
  const check = (paragraph: string) => step(t('Check and confirm', 'Prüfen und bestätigen'), t('Read everything. Then tap the coloured button.', 'Lesen Sie alles. Dann tippen Sie auf den farbigen Knopf.'), [paragraph], 'check', 'confirm', t('The confirm button is the coloured one.', 'Der Bestätigen-Knopf ist der farbige.'));
  const approve = step(t('Approve', 'Freigeben'), t('Check once more, then tap "Approve".', 'Prüfen Sie noch einmal, dann tippen Sie auf „Freigeben“.'), [approvalNote(lang, bank), t('Only approve what you started yourself.', 'Geben Sie nur frei, was Sie selbst begonnen haben.')], 'approve', 'approve-ok', t('"Approve" is the coloured button.', '„Freigeben“ ist der farbige Knopf.'));
  const startTransfer = layout === 'action'
    ? [
        step(t('Tap "Send money"', 'Tippen Sie auf „Geld senden“'), t('It is the first round button under "Quick access".', 'Das ist der erste runde Knopf unter „Schnellzugriffe“.'), [t('Actions you often need are under "Quick access".', 'Häufige Aktionen finden Sie unter „Schnellzugriffe“.')], 'overview', 'send-money', t('"Send money" is the first round button under "Quick access".', '„Geld senden“ ist der erste runde Knopf unter „Schnellzugriffe“.')),
        step(t('Choose "Transfer"', 'Wählen Sie „Überweisung“'), t('It is the first line.', 'Das ist die erste Zeile.'), [t('Now you can choose who gets the money.', 'Jetzt können Sie wählen, wer das Geld bekommt.')], 'sendmenu', 'transfer', t('"Transfer" is the first line.', '„Überweisung“ ist die erste Zeile.')),
      ]
    : [step(t('Find the transfer', 'Überweisung finden'), t('Tap "Transfer".', 'Tippen Sie auf „Überweisung“.'), [t('It is on the start page.', 'Sie finden sie auf der Startseite.')], 'overview', 'transfer', where.transfer)];
  const noReal = t('This was only practice. No real money moved.', 'Das war nur eine Übung. Es ist kein echtes Geld geflossen.');

  return [
    lesson('international', t('Send Money Abroad', 'Geld ins Ausland überweisen'),
      t('Send euros to someone in Italy. Learn what is different from a normal transfer.', 'Überweisen Sie Euro nach Italien. Lernen Sie, was anders ist als bei einer normalen Überweisung.'), 6,
      t('You will send 75 euros to Maria in Italy.', 'Sie überweisen Maria in Italien 75 Euro.'),
      t('Well done! You sent money abroad.', 'Gut gemacht! Sie haben Geld ins Ausland überwiesen.'),
      t(`Within the euro payment area (SEPA) this usually costs no more than a normal transfer. To countries like the USA, fees and exchange rates apply, and it can take days. ${noReal}`, `Innerhalb des Euro-Zahlungsraums (SEPA) kostet das meist nicht mehr als eine normale Überweisung. In Länder wie die USA fallen Gebühren und Wechselkurse an, und es kann Tage dauern. ${noReal}`),
      { recipient: 'Maria Rossi', peterFull: 'Luca Bianchi', amount: '75,00 €', balanceAfter: '1.175,00 €', ibanValue: 'IT00 X000 0000 0000 0000 0000 000', purposeText: t('Holiday flat', 'Ferienwohnung'), extraOneLabel: t('Country', 'Land'), extraOneValue: t('Italy', 'Italien'), extraTwoLabel: t('Fee', 'Gebühr'), extraTwoValue: '0,00 €', doneTitle: t('Transfer abroad completed', 'Auslandsüberweisung ausgeführt') },
      [
        unlock, more, menu(t('Choose "Transfer abroad"', 'Wählen Sie „Auslandsüberweisung“'), 'abroad', common.menuAbroad),
        step(t('Choose the country', 'Land wählen'), t('Tap "Italy".', 'Tippen Sie auf „Italien“.'), [t('Italy uses the euro and is part of SEPA, so an IBAN is enough. For countries outside SEPA, the bank often also asks for a BIC or SWIFT code and the currency.', 'Italien nutzt den Euro und gehört zu SEPA, daher genügt eine IBAN. Für Länder außerhalb von SEPA fragt die Bank oft auch nach BIC oder SWIFT-Code und Währung.')], 'intl-country', 'country-it', t('Italy is the first line.', 'Italien ist die erste Zeile.')),
        step(t('Choose the person', 'Person wählen'), t('Tap "Maria Rossi".', 'Tippen Sie auf „Maria Rossi“.'), [t('A foreign IBAN starts with the letters of the country, for example IT for Italy.', 'Eine ausländische IBAN beginnt mit den Buchstaben des Landes, zum Beispiel IT für Italien.')], 'recipient', 'person-anna', t('Maria is the first line.', 'Maria ist die erste Zeile.')),
        amount('75,00 €'),
        check(t('Look for the fee. Here it is 0 euros. Outside SEPA it can be much higher, so always check before you confirm.', 'Achten Sie auf die Gebühr. Hier sind es 0 Euro. Außerhalb von SEPA kann sie viel höher sein, prüfen Sie sie daher immer vor dem Bestätigen.')),
        approve,
      ]),
    lesson('standing', t('Set Up a Repeated Transfer', 'Einen Dauerauftrag einrichten'),
      t('A standing order pays the same amount regularly, by itself. Set one up for your club fee.', 'Ein Dauerauftrag zahlt regelmäßig denselben Betrag, von selbst. Richten Sie einen für Ihren Vereinsbeitrag ein.'), 7,
      t('You will set up a payment of 30 euros every month.', 'Sie richten eine Zahlung von 30 Euro pro Monat ein.'),
      t('Well done! You set up a standing order.', 'Gut gemacht! Sie haben einen Dauerauftrag eingerichtet.'),
      t(`From now on it would pay by itself until you stop it. Make sure there is enough money in the account. ${noReal}`, `Ab jetzt würde er von selbst zahlen, bis Sie ihn beenden. Achten Sie darauf, dass genug Geld auf dem Konto ist. ${noReal}`),
      { amount: '30,00 €', balanceAfter: '', purposeText: t('Club fee', 'Vereinsbeitrag'), extraOneLabel: t('Repeats', 'Wiederholung'), extraOneValue: common.monthly, extraTwoLabel: t('First payment', 'Erste Zahlung'), extraTwoValue: common.dateFirst, confirm: t('Confirm standing order', 'Dauerauftrag bestätigen'), doneTitle: t('Standing order set up', 'Dauerauftrag eingerichtet') },
      [
        unlock, more, menu(t('Choose "Standing orders"', 'Wählen Sie „Daueraufträge“'), 'standing-orders', common.menuStanding),
        step(t('Start a new one', 'Neuen anlegen'), t('Tap "New standing order".', 'Tippen Sie auf „Neuer Dauerauftrag“.'), [t('Here you also see the standing orders you already have. It is worth checking this list once a year.', 'Hier sehen Sie auch Ihre bestehenden Daueraufträge. Es lohnt sich, diese Liste einmal im Jahr zu prüfen.')], 'standing-list', 'standing-new', t('The button is under the list.', 'Der Knopf ist unter der Liste.')),
        person, amount('30,00 €'),
        step(t('Choose how often', 'Wählen Sie, wie oft'), t('Tap "Every month".', 'Tippen Sie auf „Jeden Monat“.'), [t('Rent and club fees are usually monthly.', 'Miete und Vereinsbeiträge sind meist monatlich.')], 'frequency', 'freq-monthly', t('"Every month" is the second line.', '„Jeden Monat“ ist die zweite Zeile.')),
        step(t('Choose the first payment', 'Erste Zahlung wählen'), t('Tap "1 December".', 'Tippen Sie auf „1. Dezember“.'), [t('The money leaves on this day every month.', 'Das Geld geht jeden Monat an diesem Tag ab.')], 'start-date', 'date-first', t('The date is the first line.', 'Das Datum ist die erste Zeile.')),
        check(t('Your bank also checks the recipient name, even for a standing order.', 'Ihre Bank prüft auch beim Dauerauftrag den Empfängernamen.')),
        approve,
      ]),
    lesson('stop-standing', t('Stop a Repeated Transfer', 'Einen Dauerauftrag beenden'),
      t('You left the club? Stop the standing order so that no more money goes out.', 'Sie sind aus dem Verein ausgetreten? Beenden Sie den Dauerauftrag, damit kein Geld mehr abgeht.'), 4,
      t('You will delete the standing order for the bowling club.', 'Sie löschen den Dauerauftrag für den Kegelclub.'),
      t('Well done! You stopped a standing order.', 'Gut gemacht! Sie haben einen Dauerauftrag beendet.'),
      t(`A standing order does not end when a membership ends. You have to stop it yourself. ${noReal}`, `Ein Dauerauftrag endet nicht mit der Mitgliedschaft. Sie müssen ihn selbst beenden. ${noReal}`),
      { recipient: common.orderClub, amount: '12,00 €', hideTransferRows: '1', doneTitle: t('Standing order deleted', 'Dauerauftrag gelöscht'), doneText: t('No more payments will be made.', 'Es werden keine Zahlungen mehr ausgeführt.'), balanceAfter: '' },
      [
        unlock, more, menu(t('Choose "Standing orders"', 'Wählen Sie „Daueraufträge“'), 'standing-orders', common.menuStanding),
        step(t('Open the right one', 'Den richtigen öffnen'), t('Tap "Bowling club".', 'Tippen Sie auf „Kegelclub“.'), [t('Look carefully: the rent must keep being paid.', 'Schauen Sie genau hin: Die Miete muss weiter bezahlt werden.')], 'standing-list', 'order-club', t('The bowling club is the second line.', 'Der Kegelclub ist die zweite Zeile.')),
        step(t('Tap "Delete"', 'Tippen Sie auf „Löschen“'), t('Tap "Delete standing order".', 'Tippen Sie auf „Dauerauftrag löschen“.'), [t('You can always set up a new one later.', 'Sie können später jederzeit einen neuen einrichten.')], 'order-detail', 'order-delete', t('The button is at the bottom.', 'Der Knopf ist unten.')),
        step(t('Confirm', 'Bestätigen'), t('Tap "Yes, delete".', 'Tippen Sie auf „Ja, löschen“.'), [t('Apps ask again so that nothing is deleted by accident.', 'Apps fragen noch einmal, damit nichts aus Versehen gelöscht wird.')], 'order-confirm', 'order-yes', t('"Yes, delete" is the coloured button.', '„Ja, löschen“ ist der farbige Knopf.')),
      ]),
    lesson('scheduled', t('Schedule a Transfer for Later', 'Eine Überweisung für später planen'),
      t('Pay a bill on a date you choose, for example on the day your pension arrives.', 'Bezahlen Sie eine Rechnung an einem Tag Ihrer Wahl, zum Beispiel wenn die Rente kommt.'), 6,
      t('You will plan a payment of 40 euros for 15 December.', 'Sie planen eine Zahlung von 40 Euro für den 15. Dezember.'),
      t('Well done! You scheduled a transfer.', 'Gut gemacht! Sie haben eine Überweisung geplant.'),
      t(`Until that day you can usually still change or delete it. ${noReal}`, `Bis zu diesem Tag können Sie sie meist noch ändern oder löschen. ${noReal}`),
      { amount: '40,00 €', balanceAfter: '', purposeText: t('Invoice 2041', 'Rechnung 2041'), extraOneLabel: t('Date', 'Datum'), extraOneValue: common.dateFifteen, doneTitle: t('Transfer scheduled', 'Überweisung geplant') },
      [
        unlock, more, menu(t('Choose "Transfer for later"', 'Wählen Sie „Terminüberweisung“'), 'scheduled', common.menuScheduled),
        person, amount('40,00 €'),
        step(t('Choose the date', 'Datum wählen'), t('Tap "15 December".', 'Tippen Sie auf „15. Dezember“.'), [t('Make sure there is enough money in the account on that day.', 'Achten Sie darauf, dass an diesem Tag genug Geld auf dem Konto ist.')], 'start-date', 'date-15', t('15 December is the second line.', 'Der 15. Dezember ist die zweite Zeile.')),
        check(t('Is the date right? It is easy to overlook.', 'Stimmt das Datum? Das übersieht man leicht.')),
        approve,
      ]),
    lesson('own', t('Move Money to Savings', 'Geld aufs Sparkonto überweisen'),
      t('Move money between your own accounts.', 'Bewegen Sie Geld zwischen Ihren eigenen Konten.'), 4,
      t('You will move 200 euros to your savings account.', 'Sie überweisen 200 Euro auf Ihr Sparkonto.'),
      t('Well done! You moved money between your accounts.', 'Gut gemacht! Sie haben Geld zwischen Ihren Konten bewegt.'),
      t(`The money stays yours. It is only in a different account. ${noReal}`, `Das Geld bleibt Ihres. Es liegt nur auf einem anderen Konto. ${noReal}`),
      { recipient: common.savings, amount: '200,00 €', balanceAfter: '1.050,00 €', purposeText: t('Saving', 'Sparen'), ibanValue: 'DE00 3333 3333 3333 3333 33', doneTitle: t('Money moved', 'Geld überwiesen') },
      [
        unlock, more, menu(t('Choose "Between my accounts"', 'Wählen Sie „Zwischen meinen Konten“'), 'own-transfer', common.menuOwn),
        step(t('Choose the account', 'Konto wählen'), t('Tap "Savings account".', 'Tippen Sie auf „Sparkonto“.'), [t('All your accounts at this bank are listed here.', 'Hier stehen alle Ihre Konten bei dieser Bank.')], 'own-account', 'own-savings', t('The savings account is the first line.', 'Das Sparkonto ist die erste Zeile.')),
        amount('200,00 €'),
        check(t('Between your own accounts, many banks do not ask for a second approval.', 'Zwischen eigenen Konten verlangen viele Banken keine zweite Freigabe.')),
      ]),
    lesson('namecheck', t('When the Name Does Not Match', 'Wenn der Name nicht übereinstimmt'),
      t('Since October 2025 banks compare the name with the IBAN. Learn what to do when they warn you.', 'Seit Oktober 2025 vergleichen Banken den Namen mit der IBAN. Lernen Sie, was Sie bei einer Warnung tun.'), 5,
      t('You will pay a painter, get a warning, and stop in time.', 'Sie bezahlen einen Maler, bekommen eine Warnung und stoppen rechtzeitig.'),
      t('Well done! You stopped in time.', 'Gut gemacht! Sie haben rechtzeitig gestoppt.'),
      t(`Call the person or company on a number you know, and check the details. Do not use a number from the invoice if it seems strange. ${noReal}`, `Rufen Sie die Person oder Firma unter einer Nummer an, die Sie kennen, und prüfen Sie die Angaben. Nutzen Sie keine Nummer von der Rechnung, wenn sie Ihnen seltsam vorkommt. ${noReal}`),
      { checkName: t('Painter Klein', 'Maler Klein'), amount: '120,00 €', ibanValue: 'DE00 4444 4444 4444 4444 44', purposeText: t('Invoice 77', 'Rechnung 77'), nameBad: t('Name does not match. This account belongs to someone else.', 'Name stimmt nicht überein. Dieses Konto gehört jemand anderem.'), confirm: t('Send anyway', 'Trotzdem senden'), cancel: t('Stop the transfer', 'Überweisung abbrechen'), hideTransferRows: '1', doneTitle: t('Transfer stopped', 'Überweisung abgebrochen'), doneText: t('No money was sent.', 'Es wurde kein Geld gesendet.'), balanceAfter: '' },
      [
        unlock, ...startTransfer,
        step(t('Enter someone new', 'Jemand Neues eingeben'), t('Tap "Someone new".', 'Tippen Sie auf „Jemand Neues“.'), [t('The painter is not saved yet.', 'Der Maler ist noch nicht gespeichert.')], 'recipient', 'person-new', t('"Someone new" is the last line.', '„Jemand Neues“ ist die letzte Zeile.')),
        step(t('Check the details', 'Angaben prüfen'), t('The details from the invoice are filled in. Tap "Continue".', 'Die Angaben von der Rechnung sind eingetragen. Tippen Sie auf „Weiter“.'), [t('Here you would type the name and IBAN from the invoice.', 'Hier würden Sie Name und IBAN von der Rechnung eintippen.')], 'new-details', 'new-continue', t('"Continue" is the coloured button.', '„Weiter“ ist der farbige Knopf.')),
        amount('120,00 €'),
        step(t('Read the warning and stop', 'Warnung lesen und stoppen'), t('The bank says the name does not match. Tap "Stop the transfer".', 'Die Bank meldet, dass der Name nicht übereinstimmt. Tippen Sie auf „Überweisung abbrechen“.'), [t('Sometimes it is only a spelling mistake. But criminals also fake invoices with their own IBAN. If you send anyway, you may not get the money back.', 'Manchmal ist es nur ein Tippfehler. Aber Kriminelle fälschen auch Rechnungen mit ihrer eigenen IBAN. Wenn Sie trotzdem senden, bekommen Sie das Geld womöglich nicht zurück.')], 'check', 'cancel', t('"Stop the transfer" is the lower button.', '„Überweisung abbrechen“ ist der untere Knopf.')),
      ]),
    lesson('reject', t('Reject a Payment You Did Not Start', 'Eine fremde Zahlung ablehnen'),
      t('A request appears, but you did not start a payment. This is what to do.', 'Eine Anfrage erscheint, aber Sie haben keine Zahlung begonnen. Das tun Sie jetzt.'), 3,
      t('You will get a request you did not expect, and reject it.', 'Sie bekommen eine unerwartete Anfrage und lehnen sie ab.'),
      t('Well done! You rejected the payment.', 'Gut gemacht! Sie haben die Zahlung abgelehnt.'),
      t(`Now call your bank on the number on your bank card. In Germany you can also call the blocking hotline 116 116. Someone may have your login details. ${noReal}`, `Rufen Sie jetzt Ihre Bank unter der Nummer auf Ihrer Bankkarte an. In Deutschland erreichen Sie auch den Sperr-Notruf 116 116. Jemand könnte Ihre Zugangsdaten haben. ${noReal}`),
      { recipient: t('Unknown Ltd', 'Unbekannt GmbH'), amount: '1.950,00 €', rejectable: '1', approveTitle: t('Approve this payment?', 'Diese Zahlung freigeben?'), approveText: t('You did not start this payment.', 'Diese Zahlung haben Sie nicht begonnen.'), hideTransferRows: '1', doneTitle: t('Payment rejected', 'Zahlung abgelehnt'), doneText: t('No money was sent.', 'Es wurde kein Geld gesendet.'), balanceAfter: '' },
      [
        step(t('Open the request', 'Anfrage öffnen'), t('Tap the message on your screen.', 'Tippen Sie auf die Meldung auf Ihrem Bildschirm.'), [t('Such a message alone is harmless. Nothing happens until you approve.', 'So eine Meldung allein ist harmlos. Es passiert nichts, solange Sie nicht freigeben.')], 'push-notice', 'open-request', t('The message is in the middle of the screen.', 'Die Meldung ist in der Mitte des Bildschirms.')),
        step(t('Read and reject', 'Lesen und ablehnen'), t('You did not start this. Tap "Reject".', 'Das haben Sie nicht begonnen. Tippen Sie auf „Ablehnen“.'), [t('Criminals may call and claim to be from your bank, asking you to approve "for safety". Your bank never asks for this.', 'Kriminelle rufen manchmal an, geben sich als Ihre Bank aus und bitten Sie, „zur Sicherheit“ freizugeben. Ihre Bank verlangt das nie.')], 'approve', 'approve-no', t('"Reject" is the lower button.', '„Ablehnen“ ist der untere Knopf.')),
      ]),
    lesson('block-card', t('Block a Lost Card', 'Eine verlorene Karte sperren'),
      t('Your card is gone? Block it quickly in the app.', 'Ihre Karte ist weg? Sperren Sie sie schnell in der App.'), 4,
      t('You will block your card in the app.', 'Sie sperren Ihre Karte in der App.'),
      t('Well done! You blocked the card.', 'Gut gemacht! Sie haben die Karte gesperrt.'),
      t(`Without the app, call the blocking hotline 116 116 from Germany. Write the number down now. ${noReal}`, `Ohne App rufen Sie in Deutschland den Sperr-Notruf 116 116 an. Notieren Sie sich die Nummer am besten jetzt. ${noReal}`),
      { hideTransferRows: '1', doneTitle: t('Card blocked', 'Karte gesperrt'), doneText: t('Nobody can pay with it any more.', 'Niemand kann mehr damit bezahlen.'), balanceAfter: '' },
      [
        unlock, more, menu(t('Choose "My card"', 'Wählen Sie „Meine Karte“'), 'card', common.menuCard),
        step(t('Tap "Block card"', 'Tippen Sie auf „Karte sperren“'), t('It is under your card.', 'Das steht unter Ihrer Karte.'), [t('A blocked card usually cannot be unblocked, and you get a new one.', 'Eine gesperrte Karte lässt sich meist nicht entsperren, und Sie bekommen eine neue.')], 'card-screen', 'card-block', t('"Block card" is the button under the card.', '„Karte sperren“ ist der Knopf unter der Karte.')),
        step(t('Choose the reason', 'Grund wählen'), t('Tap "Lost".', 'Tippen Sie auf „Verloren“.'), [t('If it was stolen, also report it to the police.', 'Wurde sie gestohlen, melden Sie das auch der Polizei.')], 'card-reason', 'reason-lost', t('"Lost" is the first line.', '„Verloren“ ist die erste Zeile.')),
        step(t('Confirm', 'Bestätigen'), t('Tap "Yes, block".', 'Tippen Sie auf „Ja, sperren“.'), [t('Better to block once too often than too late.', 'Lieber einmal zu viel sperren als zu spät.')], 'card-confirm', 'card-yes', t('"Yes, block" is the coloured button.', '„Ja, sperren“ ist der farbige Knopf.')),
      ]),
    lesson('statement', t('Find a Bank Statement', 'Einen Kontoauszug finden'),
      t('Find your statement for October, for example for your tax return.', 'Finden Sie Ihren Kontoauszug für Oktober, zum Beispiel für die Steuererklärung.'), 3,
      t('You will open your statement for October.', 'Sie öffnen Ihren Kontoauszug für Oktober.'),
      t('Well done! You found your statement.', 'Gut gemacht! Sie haben Ihren Kontoauszug gefunden.'),
      t(`In the real app you can save or print it. Save important statements, because banks keep them online only for a limited time. ${noReal}`, `In der echten App können Sie ihn speichern oder drucken. Speichern Sie wichtige Auszüge, denn Banken bewahren sie online nur begrenzt auf. ${noReal}`),
      { hideTransferRows: '1', doneTitle: common.docOctober, doneText: t('Your statement would open here as a document.', 'Ihr Auszug würde sich hier als Dokument öffnen.'), balanceAfter: '' },
      [
        unlock, more, menu(t('Choose "Statements"', 'Wählen Sie „Kontoauszüge“'), 'documents', common.menuDocuments),
        step(t('Open October', 'Oktober öffnen'), t('Tap "Statement October".', 'Tippen Sie auf „Kontoauszug Oktober“.'), [t('The newest statement is at the top. Many banks call this area the "Postbox".', 'Der neueste Auszug steht oben. Viele Banken nennen diesen Bereich „Postfach“.')], 'documents-list', 'doc-october', t('October is the first line.', 'Oktober ist die erste Zeile.')),
      ]),
  ];
}

/** Text lessons that apply to every bank. */
export function generalBankingLessons(lang: Language, base: Tutorial): Tutorial[] {
  const isEn = lang === 'en';
  const t = (en: string, de: string) => (isEn ? en : de);
  const shared = { categoryId: base.categoryId, categoryTitle: base.categoryTitle, difficulty: base.difficulty, image: base.image };
  return [
    {
      ...shared,
      id: 'banking-abroad-guide',
      title: t('Paying Abroad: What You Should Know', 'Zahlen im Ausland: Was Sie wissen sollten'),
      description: t('IBAN, BIC, fees and exchange rates, explained in plain words.', 'IBAN, BIC, Gebühren und Wechselkurse, einfach erklärt.'),
      durationMinutes: 5,
      tags: [t('Banking', 'Banking'), t('Abroad', 'Ausland')],
      steps: [
        { stepNumber: 1, title: t('Inside the SEPA area', 'Innerhalb des SEPA-Raums'), lead: t('Euro transfers in Europe work almost like at home.', 'Euro-Überweisungen in Europa funktionieren fast wie im Inland.'), paragraphs: [t('SEPA covers the EU and some other European countries. You need the name and the IBAN. It usually costs no more than a normal transfer.', 'SEPA umfasst die EU und einige weitere europäische Länder. Sie brauchen den Namen und die IBAN. Es kostet meist nicht mehr als eine normale Überweisung.')] },
        { stepNumber: 2, title: t('Outside the SEPA area', 'Außerhalb des SEPA-Raums'), lead: t('Expect fees, exchange rates and waiting.', 'Rechnen Sie mit Gebühren, Wechselkursen und Wartezeit.'), paragraphs: [t('Banks often also ask for a BIC or SWIFT code and the currency. It can take several days, and other banks along the way may charge fees.', 'Banken fragen oft auch nach BIC oder SWIFT-Code und Währung. Es kann mehrere Tage dauern, und andere Banken auf dem Weg können Gebühren verlangen.')], tip: t('Ask your bank what it will cost before you send a large amount.', 'Fragen Sie Ihre Bank vor größeren Beträgen, was es kostet.') },
        { stepNumber: 3, title: t('Be careful with strangers', 'Vorsicht bei Fremden'), lead: t('Money sent abroad is hard to get back.', 'Ins Ausland gesendetes Geld bekommt man schwer zurück.'), paragraphs: [t('Be suspicious if someone you only know online asks you to send money abroad, however good the story sounds.', 'Seien Sie misstrauisch, wenn jemand, den Sie nur online kennen, um Geld im Ausland bittet, egal wie gut die Geschichte klingt.')], warning: t('Never transfer money for a stranger, or to "unlock" a prize or an inheritance.', 'Überweisen Sie nie Geld für Fremde, oder um einen Gewinn oder eine Erbschaft „freizuschalten“.') },
      ],
    },
    {
      ...shared,
      id: 'banking-direct-debit',
      title: t('Direct Debits: Check Them and Send Them Back', 'Lastschriften: prüfen und zurückgeben'),
      description: t('Companies can collect money from your account. Here is how to stay in control.', 'Firmen können Geld von Ihrem Konto einziehen. So behalten Sie den Überblick.'),
      durationMinutes: 4,
      tags: [t('Banking', 'Banking'), t('Direct debit', 'Lastschrift')],
      steps: [
        { stepNumber: 1, title: t('What a direct debit is', 'Was eine Lastschrift ist'), lead: t('You allow a company to collect money.', 'Sie erlauben einer Firma, Geld einzuziehen.'), paragraphs: [t('It is practical for electricity or insurance. Unlike a standing order, the company decides when and how much, within what you agreed.', 'Das ist praktisch für Strom oder Versicherungen. Anders als beim Dauerauftrag bestimmt die Firma, wann und wie viel, im Rahmen des Vereinbarten.')] },
        { stepNumber: 2, title: t('Check your payments', 'Prüfen Sie Ihre Zahlungen'), lead: t('Look through your account regularly.', 'Schauen Sie Ihr Konto regelmäßig durch.'), paragraphs: [t('Do you recognise every payment? Criminals sometimes collect small amounts in the hope that nobody notices.', 'Kennen Sie jede Zahlung? Kriminelle ziehen manchmal kleine Beträge ein, in der Hoffnung, dass es niemand merkt.')] },
        { stepNumber: 3, title: t('Sending it back', 'Zurückgeben'), lead: t('You usually have eight weeks.', 'Sie haben meist acht Wochen Zeit.'), paragraphs: [t('Within eight weeks you can have a SEPA direct debit returned, without giving a reason. Many apps offer this directly on the payment, or your bank can help.', 'Innerhalb von acht Wochen können Sie eine SEPA-Lastschrift zurückgeben lassen, ohne Angabe von Gründen. Viele Apps bieten das direkt an der Zahlung an, oder Ihre Bank hilft.')], tip: t('If you really owe the money, you will still have to pay it.', 'Wenn Sie das Geld wirklich schulden, müssen Sie es trotzdem bezahlen.') },
      ],
    },
    {
      ...shared,
      id: 'banking-scam-calls',
      title: t('Scam Calls from the "Bank"', 'Betrugsanrufe von der „Bank“'),
      description: t('Someone calls and says your account is in danger. How to react.', 'Jemand ruft an und sagt, Ihr Konto sei in Gefahr. So reagieren Sie.'),
      durationMinutes: 4,
      tags: [t('Banking', 'Banking'), t('Safety', 'Sicherheit')],
      steps: [
        { stepNumber: 1, title: t('How it starts', 'Wie es beginnt'), lead: t('A friendly caller creates panic.', 'Ein freundlicher Anrufer erzeugt Panik.'), paragraphs: [t('They know your name, and the display may even show your bank\'s number. They say your money is at risk and you must act now.', 'Die Person kennt Ihren Namen, und das Display zeigt vielleicht sogar die Nummer Ihrer Bank. Sie sagt, Ihr Geld sei in Gefahr und Sie müssten sofort handeln.')] },
        { stepNumber: 2, title: t('What they want', 'Was sie wollen'), lead: t('Your approval, code or password.', 'Ihre Freigabe, Ihren Code oder Ihr Passwort.'), paragraphs: [t('Your bank never asks you to approve a payment "for safety", to read out a code, or to move money to a "safe account".', 'Ihre Bank bittet Sie nie, eine Zahlung „zur Sicherheit“ freizugeben, einen Code vorzulesen oder Geld auf ein „sicheres Konto“ zu überweisen.')], warning: t('Never give your codes or password to anyone on the phone.', 'Geben Sie Codes oder Passwort niemals am Telefon weiter.') },
        { stepNumber: 3, title: t('What you do', 'Was Sie tun'), lead: t('Hang up, and call back yourself.', 'Legen Sie auf, und rufen Sie selbst zurück.'), paragraphs: [t('Use the number on your bank card. Real bank staff will not be offended. If you already gave something away, call your bank or the blocking hotline 116 116 immediately.', 'Nutzen Sie die Nummer auf Ihrer Bankkarte. Echte Bankangestellte sind nicht beleidigt. Haben Sie schon etwas verraten, rufen Sie sofort Ihre Bank oder den Sperr-Notruf 116 116 an.')] },
      ],
    },
  ];
}

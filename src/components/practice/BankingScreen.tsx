import React from 'react';
import { ArrowLeft, ArrowRightLeft, Bell, CalendarClock, CheckCircle2, ChevronRight, CreditCard, FileText, Globe, House, Landmark, List, Lock, MoreHorizontal, PiggyBank, Repeat, Send, Smartphone, TriangleAlert, User } from 'lucide-react';
import { PracticeTap } from './PracticeTap';
import { StatusBar, BackGlyph } from './PhoneParts';
import type { PracticeScreenProps } from './practiceScreens';

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between gap-3 py-2 border-b text-[1rem]" style={{ borderColor: '#E5E9ED' }}>
    <span style={{ color: '#54656F' }}>{label}</span>
    <span className="font-bold text-right" style={{ color: '#111B21' }}>{value}</span>
  </div>
);

/**
 * A neutral practice bank with fictional data. Layouts differ like real banking
 * apps do, but no real bank's logo, name or design appears on these screens:
 * a fake screen with a real bank's identity would look like phishing.
 */
export const BankingScreen: React.FC<PracticeScreenProps> = ({ screen, isDone, kind, labels }) => {
  const brand = labels.brandColor ?? '#14457A';
  const onBrand = labels.brandText ?? '#FFFFFF';
  const ink = onBrand === '#FFFFFF' ? brand : '#14457A';
  const layout = labels.layout ?? 'classic';

  const header = (title: string, back: boolean) => (
    <div className="flex items-center gap-1 px-1 py-1 shrink-0" style={{ background: brand, color: onBrand }}>
      {back ? (
        <PracticeTap id="back" label={labels.back} className="flex items-center justify-center rounded-full"><BackGlyph size={24} /></PracticeTap>
      ) : (
        <span className="w-11 h-11 flex items-center justify-center"><Landmark size={24} aria-hidden="true" /></span>
      )}
      <h3 className="flex-1 text-[1.1rem] font-bold truncate">{title}</h3>
      <span className="flex items-center gap-1 pr-2 text-[0.8rem] shrink-0"><Lock size={14} aria-hidden="true" />{labels.fictional}</span>
    </div>
  );

  const nav = (items: [string, React.ElementType][]) => (
    <div className="flex shrink-0 pt-1 pb-0.5 border-t" style={{ background: '#FFFFFF', borderColor: '#E5E9ED', color: '#54656F' }}>
      {items.map(([name, Glyph], i) => name === labels.navMore ? (
        <PracticeTap key={name} id="more" label={name} pointer="above-right" className="flex-1 min-w-0 flex flex-col items-center justify-center text-[0.68rem] rounded-lg"><Glyph size={20} aria-hidden="true" />{name}</PracticeTap>
      ) : (
        <span key={name} aria-hidden="true" className="flex-1 min-w-0 flex flex-col items-center text-[0.68rem] truncate" style={i === 0 ? { color: ink, fontWeight: 700 } : undefined}><Glyph size={20} />{name}</span>
      ))}
    </div>
  );

  const account = (
    <PracticeTap id="account" label={labels.account} className="w-full p-3 rounded-2xl text-left flex items-center gap-3" style={{ background: '#FFFFFF', color: '#111B21', border: '1px solid #DCE2E8' }}>
      <span className="flex-1 min-w-0">
        <span className="block text-[0.9rem]" style={{ color: '#54656F' }}>{labels.account}</span>
        <span className="block text-[0.78rem]" style={{ color: '#54656F' }}>DE00 0000 0000 0000 0000 00</span>
        <span className="block text-[1.5rem] font-bold">{labels.balance}</span>
      </span>
      <ChevronRight size={22} aria-hidden="true" />
    </PracticeTap>
  );
  const transferBtn = (filled: boolean) => (
    <PracticeTap id="transfer" label={labels.transfer} className="p-3 rounded-2xl flex flex-col items-center gap-1 text-[0.98rem] font-bold" style={filled ? { background: brand, color: onBrand } : { background: '#FFFFFF', color: ink, border: '1px solid #DCE2E8' }}>
      <ArrowRightLeft size={24} aria-hidden="true" />{labels.transfer}
    </PracticeTap>
  );
  const statementsBtn = (
    <PracticeTap id="statements" label={labels.statements} className="p-3 rounded-2xl flex flex-col items-center gap-1 text-[0.98rem] font-bold" style={{ background: '#FFFFFF', color: ink, border: '1px solid #DCE2E8' }}>
      <List size={24} aria-hidden="true" />{labels.statements}
    </PracticeTap>
  );

  const menuRow = (id: string, label: string, Glyph?: React.ElementType, note?: string) => (
    <PracticeTap key={id} id={id} label={note ? `${label}, ${note}` : label} className="flex items-center gap-3 p-2 rounded-xl text-left text-[1.03rem] font-bold w-full" style={{ border: '1px solid #C8D0D8' }}>
      {Glyph && <Glyph size={22} aria-hidden="true" />}
      <span className="flex-1 min-w-0">{label}{note && <span className="block text-[0.85rem] font-normal">{note}</span>}</span>
      <ChevronRight size={20} aria-hidden="true" />
    </PracticeTap>
  );
  const listScreen = (title: string, question: string | undefined, rows: React.ReactNode) => (
    <>
      {header(title, true)}
      <div className="flex-1 p-3 flex flex-col gap-2 sim-fade" style={{ background: '#FFFFFF', color: '#111B21' }}>
        {question && <p className="font-bold text-[1rem]">{question}</p>}
        {rows}
      </div>
    </>
  );
  const confirmScreen = (text: string, yesId: string, yesLabel: string) => (
    <>
      {header(labels.checkTitle, true)}
      <div className="flex-1 p-4 flex flex-col gap-3 sim-fade" style={{ background: '#FFFFFF', color: '#111B21' }}>
        <p className="flex items-start gap-2 text-[1.05rem]"><TriangleAlert size={22} className="shrink-0" style={{ color: '#B3261E' }} aria-hidden="true" />{text}</p>
        <div className="mt-auto flex flex-col gap-2">
          <PracticeTap id={yesId} label={yesLabel} pointer="above-right" className="rounded-xl font-bold text-[1.05rem] p-3" style={{ background: brand, color: onBrand }}>{yesLabel}</PracticeTap>
          <PracticeTap id="back" label={labels.noKeep} className="rounded-xl font-bold text-[1.05rem] p-2" style={{ border: `2px solid ${ink}`, color: ink }}>{labels.noKeep}</PracticeTap>
        </div>
      </div>
    </>
  );
  const checkName = labels.checkName ?? labels.recipient;

  let body: React.ReactNode;
  if (isDone) {
    body = kind === 'balance' ? (
      <>
        {header(labels.statements, false)}
        <div className="flex-1 p-4 sim-fade" style={{ background: '#FFFFFF', color: '#111B21' }}>
          <h3 className="text-[1.2rem] font-bold mb-2">{labels.bookingOne}</h3>
          <Row label={labels.amountLabel} value="-48,20 €" />
          <Row label={labels.dateLabel} value={labels.dateValue} />
          <Row label={labels.purpose} value={labels.bookingPurpose} />
          <p className="mt-3 text-[0.9rem]">{labels.noRealMoney}</p>
        </div>
      </>
    ) : (
      <>
        {header(labels.bankName, false)}
        <div className="flex-1 p-4 flex flex-col items-center text-center gap-2 sim-fade" style={{ color: '#111B21', background: '#FFFFFF' }}>
          <CheckCircle2 size={64} style={{ color: '#176B68' }} aria-hidden="true" />
          <h3 className="text-[1.3rem] font-bold">{labels.doneTitle}</h3>
          <div className="w-full text-left">
            {!labels.hideTransferRows && (
              <>
                <Row label={labels.to} value={checkName} />
                <Row label={labels.amountLabel} value={labels.amount} />
                {labels.extraOneLabel && <Row label={labels.extraOneLabel} value={labels.extraOneValue} />}
                {labels.extraTwoLabel && <Row label={labels.extraTwoLabel} value={labels.extraTwoValue} />}
                {labels.balanceAfter && <Row label={labels.newBalance} value={labels.balanceAfter} />}
              </>
            )}
            {labels.doneText && <p className="text-[1.05rem] text-center">{labels.doneText}</p>}
          </div>
          <p className="text-[0.9rem]">{labels.noRealMoney}</p>
        </div>
      </>
    );
  } else if (screen === 'unlock') {
    body = (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-5 text-center sim-fade" style={{ background: brand, color: onBrand }}>
        <Landmark size={56} aria-hidden="true" />
        <h3 className="text-[1.4rem] font-bold">{labels.bankName}</h3>
        <p className="text-[0.95rem]">{labels.unlockNote}</p>
        <PracticeTap id="unlock" label={labels.unlock} pointer="below" className="px-8 rounded-xl font-bold text-[1.05rem]" style={{ background: '#FFFFFF', color: ink }}>{labels.unlock}</PracticeTap>
      </div>
    );
  } else if (screen === 'overview') {
    if (layout === 'action') {
      // Home screen with a row of quick actions at the top, and a menu bar at the bottom.
      body = (
        <>
          {header(labels.bankName, false)}
          <div className="flex-1 min-h-0 p-3 flex flex-col gap-3" style={{ background: '#F2F2F2', color: '#111B21' }}>
            <PracticeTap id="send-money" label={labels.sendMoney} className="rounded-xl flex items-center justify-center gap-2 font-bold text-[1.05rem]" style={{ background: brand, color: onBrand }}><Send size={21} aria-hidden="true" />{labels.sendMoney}</PracticeTap>
            {account}
            <div className="p-3 rounded-2xl text-[0.95rem]" style={{ background: '#FFFFFF' }}>
              <Row label={labels.bookingOne} value="-48,20 €" />
              <Row label={labels.bookingTwo} value="-12,99 €" />
            </div>
          </div>
          {nav([[labels.navHome, House], [labels.navMoney, CreditCard], [labels.navOffers, PiggyBank], [labels.navMore, MoreHorizontal]])}
        </>
      );
    } else if (layout === 'neo') {
      // One big balance, two big buttons.
      body = (
        <>
          <div className="px-4 pt-3 pb-5 shrink-0" style={{ background: '#FFFFFF', color: '#111B21' }}>
            <p className="flex items-center justify-between text-[0.9rem]" style={{ color: '#54656F' }}><span className="flex items-center gap-1"><User size={17} aria-hidden="true" />{labels.fictional}</span><Bell size={18} aria-hidden="true" /></p>
            <p className="mt-4 text-[0.9rem]">{labels.account}</p>
            <PracticeTap id="account" label={labels.account} className="text-left text-[2.2rem] font-bold leading-tight rounded-lg">{labels.balance}</PracticeTap>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <PracticeTap id="transfer" label={labels.transfer} className="rounded-full flex items-center justify-center gap-2 font-bold" style={{ background: brand, color: onBrand }}><Send size={19} aria-hidden="true" />{labels.transfer}</PracticeTap>
              <PracticeTap id="statements" label={labels.statements} className="rounded-full font-bold" style={{ background: '#EEF1F3', color: '#111B21' }}>{labels.statements}</PracticeTap>
            </div>
          </div>
          <div className="flex-1 min-h-0 px-4 py-2" style={{ background: '#F7F8F8', color: '#111B21' }}>
            <Row label={labels.bookingOne} value="-48,20 €" />
            <Row label={labels.bookingTwo} value="-12,99 €" />
          </div>
          {nav([[labels.navHome, House], [labels.navMoney, PiggyBank], [labels.navCard, CreditCard], [labels.navMore, MoreHorizontal]])}
        </>
      );
    } else if (layout === 'direct') {
      // Account card in the brand colour, actions in a list below.
      body = (
        <>
          {header(labels.bankName, false)}
          <div className="flex-1 min-h-0 flex flex-col" style={{ background: '#FFFFFF', color: '#111B21' }}>
            <div className="m-3">{account}</div>
            <div className="flex flex-col px-3 gap-1">
              <PracticeTap id="transfer" label={labels.transfer} className="flex items-center gap-3 px-2 rounded-xl text-left text-[1.03rem] font-bold" style={{ color: ink, borderBottom: '1px solid #E5E9ED' }}><ArrowRightLeft size={22} aria-hidden="true" /><span className="flex-1">{labels.transfer}</span><ChevronRight size={20} aria-hidden="true" /></PracticeTap>
              <PracticeTap id="statements" label={labels.statements} className="flex items-center gap-3 px-2 rounded-xl text-left text-[1.03rem] font-bold" style={{ color: ink, borderBottom: '1px solid #E5E9ED' }}><List size={22} aria-hidden="true" /><span className="flex-1">{labels.statements}</span><ChevronRight size={20} aria-hidden="true" /></PracticeTap>
            </div>
          </div>
          {nav([[labels.navHome, House], [labels.navOffers, PiggyBank], [labels.navMore, MoreHorizontal]])}
        </>
      );
    } else {
      // Classic: account on top, a grid of tiles below.
      body = (
        <>
          {header(labels.bankName, false)}
          <div className="flex-1 min-h-0 p-3 flex flex-col gap-3" style={{ background: '#F2F5F8', color: '#111B21' }}>
            {account}
            <div className="grid grid-cols-2 gap-2">
              {transferBtn(false)}
              {statementsBtn}
            </div>
            <p className="text-[0.9rem]" style={{ color: '#54656F' }}>{labels.latest}</p>
            <div className="px-3 rounded-2xl" style={{ background: '#FFFFFF' }}><Row label={labels.bookingOne} value="-48,20 €" /></div>
          </div>
          {nav([[labels.navHome, House], [labels.navMoney, CreditCard], [labels.navMore, MoreHorizontal]])}
        </>
      );
    }
  } else if (screen === 'more') {
    body = listScreen(labels.moreTitle, undefined, [
      menuRow('abroad', labels.menuAbroad, Globe), menuRow('standing-orders', labels.menuStanding, Repeat), menuRow('scheduled', labels.menuScheduled, CalendarClock),
      menuRow('own-transfer', labels.menuOwn, PiggyBank), menuRow('documents', labels.menuDocuments, FileText), menuRow('card', labels.menuCard, CreditCard),
    ]);
  } else if (screen === 'intl-country') {
    body = listScreen(labels.menuAbroad, labels.whereTo, [menuRow('country-it', labels.italy, Globe), menuRow('country-fr', labels.france, Globe), menuRow('country-us', labels.usa, Globe)]);
  } else if (screen === 'standing-list') {
    body = listScreen(labels.menuStanding, undefined, (
      <>
        {menuRow('order-rent', labels.orderRent, Repeat, '650,00 €')}
        {menuRow('order-club', labels.orderClub, Repeat, '12,00 €')}
        <PracticeTap id="standing-new" label={labels.orderNew} className="mt-2 rounded-xl font-bold text-[1.05rem] p-3" style={{ background: brand, color: onBrand }}>{labels.orderNew}</PracticeTap>
      </>
    ));
  } else if (screen === 'order-detail') {
    body = listScreen(labels.orderClub, undefined, (
      <>
        <Row label={labels.amountLabel} value="12,00 €" />
        <Row label={labels.howOften} value={labels.monthly} />
        <PracticeTap id="order-delete" label={labels.orderDelete} pointer="above-right" className="mt-auto rounded-xl font-bold text-[1.05rem] p-3" style={{ border: '2px solid #B3261E', color: '#B3261E' }}>{labels.orderDelete}</PracticeTap>
      </>
    ));
  } else if (screen === 'order-confirm') {
    body = confirmScreen(labels.orderSure, 'order-yes', labels.orderYes);
  } else if (screen === 'frequency') {
    body = listScreen(labels.menuStanding, labels.howOften, [menuRow('freq-weekly', labels.weekly), menuRow('freq-monthly', labels.monthly), menuRow('freq-yearly', labels.yearly)]);
  } else if (screen === 'start-date') {
    body = listScreen(labels.transfer, labels.whenStart, [menuRow('date-first', labels.dateFirst, CalendarClock), menuRow('date-15', labels.dateFifteen, CalendarClock), menuRow('date-other', labels.dateOther, CalendarClock)]);
  } else if (screen === 'new-details') {
    body = listScreen(labels.newRecipient, undefined, (
      <>
        <Row label={labels.newName} value={checkName} />
        <Row label="IBAN" value={labels.ibanValue} />
        <PracticeTap id="new-continue" label={labels.newContinue} pointer="above-right" className="mt-auto rounded-xl font-bold text-[1.05rem] p-3" style={{ background: brand, color: onBrand }}>{labels.newContinue}</PracticeTap>
      </>
    ));
  } else if (screen === 'own-account') {
    body = listScreen(labels.menuOwn, labels.toWhichAccount, [menuRow('own-savings', labels.savings, PiggyBank, '3.400,00 €'), menuRow('own-other', labels.otherAccount, Landmark, '210,00 €')]);
  } else if (screen === 'push-notice') {
    body = (
      <div className="flex-1 flex flex-col justify-center p-4 sim-fade" style={{ background: '#1F2933' }}>
        <PracticeTap id="open-request" label={`${labels.pushTitle}. ${labels.pushText}`} className="w-full p-3 rounded-2xl text-left flex items-start gap-3" style={{ background: '#FFFFFF', color: '#111B21' }}>
          <Bell size={24} className="shrink-0" style={{ color: ink }} aria-hidden="true" />
          <span className="min-w-0 flex-1"><span className="flex justify-between gap-2 font-bold text-[1rem]">{labels.pushTitle}<span className="font-normal text-[0.8rem]">{labels.pushTime}</span></span><span className="block text-[0.95rem]">{labels.pushText}</span></span>
        </PracticeTap>
      </div>
    );
  } else if (screen === 'card-screen') {
    body = listScreen(labels.menuCard, undefined, (
      <>
        <div className="rounded-2xl p-4 h-36 flex flex-col justify-between" style={{ background: brand, color: onBrand }} aria-hidden="true">
          <CreditCard size={28} /><span className="text-[1.05rem] font-bold">{labels.cardName}<span className="block font-normal text-[0.9rem]">•••• 0000</span></span>
        </div>
        <PracticeTap id="card-block" label={labels.cardBlock} className="rounded-xl font-bold text-[1.05rem] p-3" style={{ border: '2px solid #B3261E', color: '#B3261E' }}>{labels.cardBlock}</PracticeTap>
      </>
    ));
  } else if (screen === 'card-reason') {
    body = listScreen(labels.cardBlock, labels.reasonTitle, [menuRow('reason-lost', labels.reasonLost), menuRow('reason-stolen', labels.reasonStolen), menuRow('reason-damaged', labels.reasonDamaged)]);
  } else if (screen === 'card-confirm') {
    body = confirmScreen(labels.cardSure, 'card-yes', labels.cardYes);
  } else if (screen === 'documents-list') {
    body = listScreen(labels.menuDocuments, undefined, [menuRow('doc-october', labels.docOctober, FileText), menuRow('doc-september', labels.docSeptember, FileText), menuRow('doc-august', labels.docAugust, FileText)]);
  } else if (screen === 'sendmenu') {
    body = (
      <>
        {header(labels.sendMoney, true)}
        <div className="flex-1 p-3 flex flex-col gap-2 sim-fade" style={{ background: '#FFFFFF', color: '#111B21' }}>
          <PracticeTap id="transfer" label={labels.transfer} className="flex items-center gap-3 p-2 rounded-xl text-left text-[1.03rem] font-bold" style={{ border: '1px solid #C8D0D8' }}><ArrowRightLeft size={22} aria-hidden="true" />{labels.transfer}</PracticeTap>
          <PracticeTap id="standing" label={labels.standing} className="flex items-center gap-3 p-2 rounded-xl text-left text-[1.03rem]" style={{ border: '1px solid #C8D0D8' }}><List size={22} aria-hidden="true" />{labels.standing}</PracticeTap>
          <PracticeTap id="own-transfer" label={labels.ownTransfer} className="flex items-center gap-3 p-2 rounded-xl text-left text-[1.03rem]" style={{ border: '1px solid #C8D0D8' }}><PiggyBank size={22} aria-hidden="true" />{labels.ownTransfer}</PracticeTap>
        </div>
      </>
    );
  } else if (screen === 'payments') {
    body = (
      <>
        {header(labels.statements, true)}
        <div className="flex-1 p-3 flex flex-col gap-1 sim-fade" style={{ background: '#FFFFFF', color: '#111B21' }}>
          <p className="text-[0.9rem]">{labels.account}: <strong>{labels.balance}</strong></p>
          {[
            { id: 'payment-one', name: labels.bookingOne, value: '-48,20 €' },
            { id: 'payment-two', name: labels.bookingTwo, value: '-12,99 €' },
            { id: 'payment-three', name: labels.bookingThree, value: '+1.450,00 €' },
          ].map((p) => (
            <PracticeTap key={p.id} id={p.id} label={`${p.name}, ${p.value}`} className="flex justify-between gap-2 px-2 rounded-xl items-center text-[1rem] text-left border-b" style={{ borderColor: '#E5E9ED' }}>
              <span>{p.name}</span><strong>{p.value}</strong>
            </PracticeTap>
          ))}
        </div>
      </>
    );
  } else if (screen === 'recipient') {
    body = (
      <>
        {header(labels.transfer, true)}
        <div className="flex-1 p-3 flex flex-col gap-2 sim-fade" style={{ background: '#FFFFFF', color: '#111B21' }}>
          <p className="font-bold text-[1rem]">{labels.whoGets}</p>
          {[
            { id: 'person-anna', name: labels.recipient, iban: 'DE00 1111 1111 1111 1111 11' },
            { id: 'person-peter', name: labels.peterFull, iban: 'DE00 2222 2222 2222 2222 22' },
            { id: 'person-new', name: labels.newRecipient, iban: '' },
          ].map((p) => (
            <PracticeTap key={p.id} id={p.id} label={p.name} className="flex items-center gap-3 p-2 rounded-xl text-left text-[1rem]" style={{ border: '1px solid #C8D0D8' }}>
              <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: '#E5EDF5', color: ink }}><User size={20} aria-hidden="true" /></span>
              <span className="min-w-0"><span className="block font-bold">{p.name}</span>{p.iban && <span className="block text-[0.8rem]">{p.iban}</span>}</span>
            </PracticeTap>
          ))}
        </div>
      </>
    );
  } else if (screen === 'amount') {
    body = (
      <>
        {header(labels.transfer, true)}
        <div className="flex-1 p-3 flex flex-col gap-2 sim-fade" style={{ background: '#FFFFFF', color: '#111B21' }}>
          <Row label={labels.to} value={checkName} />
          <p className="font-bold text-[1rem] mt-2">{labels.howMuch}</p>
          <div className="grid grid-cols-2 gap-2">
            {['10,00 €', labels.amount, '60,00 €', '100,00 €'].map((value, i) => (
              <PracticeTap key={value} id={i === 1 ? 'amount-right' : `amount-${i}`} label={value} className="p-3 rounded-xl text-[1.1rem] font-bold" style={{ border: '1px solid #C8D0D8', color: ink }}>{value}</PracticeTap>
            ))}
          </div>
          <p className="text-[0.9rem]" style={{ color: '#54656F' }}>{labels.purposeHint}</p>
        </div>
      </>
    );
  } else if (screen === 'approve') {
    body = (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-5 text-center sim-fade" style={{ background: '#FFFFFF', color: '#111B21' }}>
        <Smartphone size={56} style={{ color: ink }} aria-hidden="true" />
        <h3 className="text-[1.25rem] font-bold">{labels.approveTitle}</h3>
        <p className="text-[0.95rem]">{labels.approveText}</p>
        <Row label={labels.to} value={labels.recipient} />
        <Row label={labels.amountLabel} value={labels.amount} />
        <PracticeTap id="approve-ok" label={labels.approveButton} className="w-full rounded-xl font-bold text-[1.05rem]" style={{ background: brand, color: onBrand }}>{labels.approveButton}</PracticeTap>
        {labels.rejectable && <PracticeTap id="approve-no" label={labels.rejectButton} pointer="above-right" className="w-full rounded-xl font-bold text-[1.05rem]" style={{ border: `2px solid ${ink}`, color: ink }}>{labels.rejectButton}</PracticeTap>}
      </div>
    );
  } else {
    body = (
      <>
        {header(labels.checkTitle, true)}
        <div className="flex-1 p-3 flex flex-col gap-1 sim-fade" style={{ background: '#FFFFFF', color: '#111B21' }}>
          <Row label={labels.to} value={checkName} />
          <Row label="IBAN" value={labels.ibanValue ?? 'DE00 1111 1111 1111 1111 11'} />
          {labels.nameBad ? (
            <p className="flex items-start gap-2 p-2 my-1 rounded-xl text-[0.98rem] font-bold" style={{ background: '#FDECEA', color: '#B3261E' }}><TriangleAlert size={22} className="shrink-0" aria-hidden="true" />{labels.nameBad}</p>
          ) : labels.nameCheck ? (
            <p className="flex items-center gap-2 py-1 text-[0.95rem]" style={{ color: '#176B68' }}><CheckCircle2 size={20} aria-hidden="true" /><strong>{labels.nameCheck}:</strong> {labels.nameOk}</p>
          ) : null}
          <Row label={labels.amountLabel} value={labels.amount} />
          {labels.extraOneLabel && <Row label={labels.extraOneLabel} value={labels.extraOneValue} />}
          {labels.extraTwoLabel && <Row label={labels.extraTwoLabel} value={labels.extraTwoValue} />}
          <Row label={labels.purpose} value={labels.purposeText} />
          <div className="mt-auto flex flex-col gap-2 pt-3">
            <PracticeTap id="confirm" label={labels.confirm} pointer="above-right" className="rounded-xl font-bold text-[1.05rem] p-3" style={{ background: brand, color: onBrand }}>{labels.confirm}</PracticeTap>
            <PracticeTap id="cancel" label={labels.cancel} className="rounded-xl font-bold text-[1.05rem] p-2" style={{ border: `2px solid ${ink}`, color: ink }}>{labels.cancel}</PracticeTap>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <StatusBar background={layout === 'neo' && screen === 'overview' && !isDone ? '#FFFFFF' : brand} color={layout === 'neo' && screen === 'overview' && !isDone ? '#111B21' : onBrand} />
      {body}
    </div>
  );
};

/**
 * Our own check for empty or wrong form fields, instead of the browser's bubble (which is in the
 * browser's language, looks different everywhere and disappears again). Use with <form noValidate>.
 * Returns a message that says what to do, and puts the cursor in the field; '' when all is fine.
 */
export function formProblem(form: HTMLFormElement, isEn: boolean): string {
  const fields = Array.from(form.elements) as HTMLInputElement[];
  const bad = fields.find((field) => field.willValidate && !field.checkValidity());
  if (!bad) return '';
  bad.focus();
  const label = (bad.labels?.[0]?.textContent ?? '').replace(/\(.*?\)/g, '').replace(/[:*]/g, '').trim();
  if (bad.validity.valueMissing) {
    return isEn ? `Please fill in "${label}".` : `Bitte füllen Sie „${label}“ aus.`;
  }
  if (bad.type === 'email') {
    return isEn
      ? 'Please enter a complete email address, for example name@example.com.'
      : 'Bitte geben Sie eine vollständige E-Mail-Adresse ein, zum Beispiel name@beispiel.de.';
  }
  return isEn ? `Please check "${label}".` : `Bitte prüfen Sie „${label}“.`;
}

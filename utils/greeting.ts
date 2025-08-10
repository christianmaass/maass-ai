export type GreetingKind = 'morning' | 'day' | 'evening' | 'night';

export function getTimeOfDayGreeting(d: Date): GreetingKind {
  const h = d.getHours();
  if (h >= 6 && h < 11) return 'morning';
  if (h >= 11 && h < 17) return 'day';
  if (h >= 17 && h < 22) return 'evening';
  return 'night';
}

export function formatGreeting(kind: GreetingKind, firstName?: string): string {
  const name = firstName ? `, ${firstName}` : '';
  switch (kind) {
    case 'morning':
      return `Guten Morgen${name}`;
    case 'day':
      return `Guten Tag${name}`;
    case 'evening':
      return `Guten Abend${name}`;
    case 'night':
      return `Produktive Nacht${name}`;
    default:
      return `Willkommen zurück${name}`;
  }
}

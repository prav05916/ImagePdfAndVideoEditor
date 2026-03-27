import en from '@/messages/en.json';
import hi from '@/messages/hi.json';

export type Locale = 'en' | 'hi';

const messages: Record<Locale, typeof en> = { en, hi };

export function getMessages(locale: Locale) {
  return messages[locale];
}

type NestedKeyOf<T> = T extends object
  ? { [K in keyof T & string]: T[K] extends object ? `${K}.${NestedKeyOf<T[K]>}` : K }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<typeof en>;

export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = messages[locale];
  for (const k of keys) {
    result = result?.[k];
  }
  return (result as string) || key;
}

import { Locale } from '@definitions/localeTypes';
import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'generic';
    resources: Locale;
  }
}
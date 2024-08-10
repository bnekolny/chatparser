import {Locale} from '../types';

// NOTE: fallback to Spanish if language code is not supported, although that
// should not happen so long as i18n.ts and types.ts (Locale) are in sync
export const shortLanguageCode = (i18nextLanguageCode: string): Locale => {
	const iso6391Code = i18nextLanguageCode.slice(0, 2).toLowerCase(); // trim to first 2 characters
	if (Object.values(Locale).map(String).includes(iso6391Code)) {
		return iso6391Code as Locale;
	} else {
		return Locale.es;
	}
};
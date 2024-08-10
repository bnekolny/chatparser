export interface MessageApiResult {
	data: string;
}

export enum Mode {
	Verify = 'verify',
	Improve = 'improve',
	Dictionary = 'dictionary',
}

export enum Locale {
	en = "en",
	es = "es",
	fr = "fr",
}
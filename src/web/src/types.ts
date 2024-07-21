export interface MessageApiResult {
	data: string;
}

export enum Mode {
	Verify = 'verify',
	Improve = 'improve',
}

export interface Section {
	title: string;
	content: string;
}

export interface Feedback {
	title: string;
	sections: Section[];
}

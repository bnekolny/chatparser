export interface MessageApiResult {
	result: string;
	revisedMessage: string;
	isLoading: boolean;
}

export enum Mode {
	Verify = 'verify',
	Improve = 'improve',
}

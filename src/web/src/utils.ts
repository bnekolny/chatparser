import {ERROR_CAPITALIZE, ERROR_INVALID_INPUT} from './constants';
import {Feedback, Section} from './types';

// TODO: write unit tests for this function
export const capitalizeFirstLetter = (str: string): string => {
	try {
		if (typeof str !== 'string' || str.length === 0) {
			throw new Error(ERROR_INVALID_INPUT);
		}
		return str.charAt(0).toUpperCase() + str.slice(1);
	} catch (error: any) {
		// TODO: type error
		console.error(`${ERROR_CAPITALIZE} ${error.message}`);
		return str;
	}
};

// TODO: write unit tests for this function
// const sampleMD = `
// ## Feedback on your message:

// **Appropriateness:** The message is grammatically incorrect but conveys the intended meaning.

// **Translation:** I want an ice cream.

// **Critical Feedback:** The word order is incorrect. In Spanish, the adjective typically comes after the noun.

// **Suggestion:** It is important to correct the word order.

// **Revised Message:** Yo quiero un helado.
// `;

export const parseMarkdown = (markdown: string): Feedback => {
	const lines = markdown.split('\n');
	const feedback: Feedback = {
		title: '',
		sections: [],
	};

	let currentSection: Section | null = null;

	lines.forEach(line => {
		if (line.startsWith('## ')) {
			feedback.title = line.slice(3).trim();
		} else if (line.startsWith('**') && line.includes(':**')) {
			const sectionParts = line.split(':** ');
			const sectionTitle = sectionParts[0].slice(2).trim();
			const sectionContent = sectionParts[1].trim();

			if (currentSection) {
				feedback.sections.push(currentSection);
			}

			currentSection = {
				title: sectionTitle,
				content: sectionContent,
			};
		} else if (currentSection && line.trim()) {
			currentSection.content += ` ${line.trim()}`;
		}
	});

	if (currentSection) {
		feedback.sections.push(currentSection);
	}

	return feedback;
};

// const feedbackObject = parseMarkdown(sampleMD.trim());
// console.log(feedbackObject);

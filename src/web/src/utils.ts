import {ERROR_CAPITALIZE, ERROR_INVALID_INPUT} from './constants';

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

const sampleMDVerify = `
## Feedback on your message:

**Appropriateness:** The message is grammatically incorrect but conveys the intended meaning.

**Translation:** I want an ice cream.

**Critical Feedback:** The word order is incorrect. In Spanish, the adjective typically comes after the noun.

**Suggestion:** It is important to correct the word order.

**Revised Message:** Yo quiero un helado.
`;

const sampleMDImprove = `
Okay, let's break down your Spanish phrase:

**1. Grammatical Analysis:**

* **The most advanced grammatical construct is the use of the indefinite article "uno" before "helado".**

    * **Appropriate Use:** You are using it correctly! The indefinite article "uno" is used when referring to a singular, unspecified noun.
    * **Grammatical Rules:** In Spanish, indefinite articles (un/una/unos/unas) agree in gender and number with the noun they modify. "Helado" is masculine, so we use "uno."
    * **Changes:** No changes are needed!

**2. Translation:**

"I want an ice cream."

**3. Additional Feedback:**

* **Simplicity:** Your phrase is very straightforward and grammatically correct.
* **Naturalness:** While grammatically sound, it might sound a bit stilted in a casual conversation. To make it more natural, you could use the more colloquial "quiero un helado" (I want an ice cream).

**Overall:** You are on the right track! You understand the use of the indefinite article, which is an important aspect of Spanish grammar. Keep practicing and experimenting with different ways to express yourself in Spanish. Don't be afraid to make mistakes – they are a part of learning!
`;

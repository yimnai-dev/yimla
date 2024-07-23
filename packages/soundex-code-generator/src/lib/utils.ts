const SOUNDEX_CODES = [
	{
		code: 1,
		letters: ['B', 'F', 'P', 'V']
	},
	{
		code: 2,
		letters: ['C', 'G', 'J', 'K', 'Q', 'S', 'X', 'Z']
	},
	{
		code: 3,
		letters: ['D', 'T']
	},
	{
		code: 4,
		letters: ['L']
	},
	{
		code: 5,
		letters: ['M', 'N']
	},
	{
		code: 6,
		letters: ['R']
	}
];

const WHY = ['W', 'H', 'Y'];
const VOWELS = ['A', 'E', 'I', 'O', 'U'];

const removeAdjacentDuplicates = (text: string) => {
	let result = '';
	let idx = 1;
	for (let i = 0; i < text.length - 1; i += idx) {
		if (i === 0) {
			idx = 1;
			result += text.charAt(i);
		} else if (text.charAt(i) === text.charAt(i + 1)) {
			idx = 2;
			result += text.charAt(i);
		} else if (text.charAt(i) === text.charAt(i + 2) && WHY.includes(text.charAt(i + 1))) {
			idx = 3;
			result += text.charAt(i);
		} else {
			result += text.charAt(i);
			idx = 1;
		}
	}
	return result;
};

export const soundexCodeGenerator = (text: string) => {
	const uppercase = text.toUpperCase().replace(' ', '');
	const coded = uppercase
		.slice(1)
		.split('')
		.map((char) => {
			const soundexCode = SOUNDEX_CODES.find((code) =>
				code.letters.includes(char)
			)?.code?.toString();
			return soundexCode ?? char;
		});
	const codesWithoutAdjacentDuplicates = removeAdjacentDuplicates(coded.join(''));
	return (
		uppercase.charAt(0) +
		codesWithoutAdjacentDuplicates
			.split('')
			.filter((c) => !VOWELS.includes(c))
			.join('')
			.padEnd(3, '0')
			.substring(0, 3)
	);
};

const getCodeAndReason = (
	char: string,
	index: number,
	input: string
): { code: string; reason: string } => {
	if (index === 0) {
		return { code: char, reason: 'First letter of the input is retained' };
	}

	if (VOWELS.includes(char) || WHY.includes(char)) {
		return { code: 'N/A', reason: `${char} is not coded` };
	}

	const soundexEntry = SOUNDEX_CODES.find((entry) => entry.letters.includes(char));
	if (soundexEntry) {
		if (index > 0 && input.charAt(index - 1) === char) {
			return { code: 'N/A', reason: 'Duplicate adjacent consonants are removed' };
		}

		if (index > 1 && WHY.includes(input.charAt(index - 1)) && input.charAt(index - 2) === char) {
			return {
				code: 'N/A',
				reason: `Consonant separated by ${input.charAt(index - 1)} from the same consonant is removed`
			};
		}

		return { code: soundexEntry.code.toString(), reason: `Mapped to code ${soundexEntry.code}` };
	}

	return { code: 'N/A', reason: 'Character does not have a Soundex code' };
};

export const generateCodeDefinition = (text: string) => {
	const uppercase = text.toUpperCase().replace(/\s+/g, '');
	const result = [];
	for (let i = 0; i < uppercase.length; i++) {
		const char = uppercase.charAt(i);
		const { code, reason } = getCodeAndReason(char, i, uppercase);
		result.push({ char, code, reason });
	}
	return result;
};

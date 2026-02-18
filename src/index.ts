// Text normalization
export const whitespace = /\s/gu;
export const spacesAndNewlines = /(\s|\n)/gu;
export const whitespaceAndNbsp = /(?:\s|&nbsp;)+/gu;
export const tabNewlineCarriageReturn = /[\t\n\r]/gu;
export const invisibleControlChars = /[\u0002\u0003\u200B\u202A\u202B]/gu;

// Digit / phone patterns
export const digits = /\d/gu;
export const nonDigit = /\D/gu;
export const nonPlusNonDigit = /[^\d+]/gu;
export const russianPhone = /^(\+?7|8)(\d{10})$/u;

// Character class validation
export const latinOnly = /^[A-Za-z]*$/u;
export const latinCyrillicNumbersHyphen = /^[\dA-Za-zЁА-яё-]*$/u;
export const cyrillicDashQuotation = /^['`ЁА-яё-]*$/u;
export const latinDashQuotation = /^['A-Z`a-z-]*$/u;
export const uppercaseLatinLetters = /[A-Z]/gu;
export const latinNumbersDotUnderscoreHyphenPlus = /^[\w+.-]*$/u;

// Boundary / edge patterns
export const leadingOrTrailingDotHyphenPlus = /^[+.-]|[+.-]$/u;
export const leadingOrTrailingDash = /^-|-$/u;
export const leadingQuote = /^"/gu;
export const trailingQuote = /"$/gu;

// File extensions
export const gzExtension = /\.gz$/gu;
export const encExtension = /\.enc$/gu;
export const gzEncExtension = /\.gz\.enc$/gu;

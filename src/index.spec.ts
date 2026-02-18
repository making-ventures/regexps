import { describe, expect, it } from "vitest";
import {
  cyrillicDashQuotation,
  digits,
  encExtension,
  gzEncExtension,
  gzExtension,
  invisibleControlChars,
  latinCyrillicNumbersHyphen,
  latinDashQuotation,
  latinNumbersDotUnderscoreHyphenPlus,
  latinOnly,
  leadingOrTrailingDash,
  leadingOrTrailingDotHyphenPlus,
  leadingQuote,
  nonDigit,
  nonPlusNonDigit,
  russianPhone,
  whitespace,
  spacesAndNewlines,
  tabNewlineCarriageReturn,
  trailingQuote,
  uppercaseLatinLetters,
  whitespaceAndNbsp,
} from "./index";

describe("text normalization", () => {
  it("whitespace matches any whitespace character", () => {
    expect("hello world".replaceAll(whitespace, "_")).toBe("hello_world");
    expect("a\tb".replaceAll(whitespace, "_")).toBe("a_b");
    expect("a\u00A0b".replaceAll(whitespace, "_")).toBe("a_b");
    expect("a\vb".replaceAll(whitespace, "_")).toBe("a_b");
  });

  it("spacesAndNewlines matches whitespace and newlines", () => {
    expect("a \n b".replaceAll(spacesAndNewlines, "")).toBe("ab");
    expect("a\nb".replaceAll(spacesAndNewlines, "")).toBe("ab");
    expect("a\r\nb".replaceAll(spacesAndNewlines, "")).toBe("ab");
  });

  it("whitespaceAndNbsp matches whitespace and &nbsp;", () => {
    expect("a  &nbsp;  b".replaceAll(whitespaceAndNbsp, " ")).toBe("a b");
    expect("a\u00A0b".replaceAll(whitespaceAndNbsp, " ")).toBe("a b");
    expect("a&nbsp;&nbsp;b".replaceAll(whitespaceAndNbsp, " ")).toBe("a b");
    expect("a &nbsp; &nbsp; b".replaceAll(whitespaceAndNbsp, " ")).toBe("a b");
  });

  it("tabNewlineCarriageReturn matches tabs, newlines, carriage returns", () => {
    expect("a\tb\nc\rd".replaceAll(tabNewlineCarriageReturn, " ")).toBe(
      "a b c d",
    );
    expect("a b".replaceAll(tabNewlineCarriageReturn, "X")).toBe("a b");
    expect("a\r\nb".replaceAll(tabNewlineCarriageReturn, "")).toBe("ab");
  });

  it("invisibleControlChars strips control characters", () => {
    expect("a\u0002b\u200Bc".replaceAll(invisibleControlChars, "")).toBe("abc");
    expect("a\u202Ab\u202Bc".replaceAll(invisibleControlChars, "")).toBe("abc");
    expect("a\u0003b".replaceAll(invisibleControlChars, "")).toBe("ab");
    expect("a\u0001b".replaceAll(invisibleControlChars, "")).toBe("a\u0001b");
  });
});

describe("digit / phone patterns", () => {
  it("digits matches digits", () => {
    expect("abc123def".replaceAll(digits, "")).toBe("abcdef");
    expect("abcdef".replaceAll(digits, "")).toBe("abcdef");
    expect("12345".replaceAll(digits, "")).toBe("");
  });

  it("nonDigit matches non-digits", () => {
    expect("abc123def".replaceAll(nonDigit, "")).toBe("123");
  });

  it("nonPlusNonDigit keeps digits and plus", () => {
    expect("+7(999)123-45-67".replaceAll(nonPlusNonDigit, "")).toBe(
      "+79991234567",
    );
    expect("a+b".replaceAll(nonPlusNonDigit, "")).toBe("+");
  });

  it("russianPhone captures Russian phone parts", () => {
    const plusSeven = "+79991234567".match(russianPhone);
    expect(plusSeven?.[1]).toBe("+7");
    expect(plusSeven?.[2]).toBe("9991234567");

    const eight = "89991234567".match(russianPhone);
    expect(eight?.[1]).toBe("8");
    expect(eight?.[2]).toBe("9991234567");

    const bareSeven = "79991234567".match(russianPhone);
    expect(bareSeven?.[1]).toBe("7");
    expect(bareSeven?.[2]).toBe("9991234567");

    expect("+89991234567".match(russianPhone)).toBeNull();
    expect("7999123456".match(russianPhone)).toBeNull();
    expect("+7999123456789".match(russianPhone)).toBeNull();
    expect("12345".match(russianPhone)).toBeNull();
  });
});

describe("character class validation", () => {
  it("latinOnly matches only latin letters", () => {
    expect(latinOnly.test("Hello")).toBe(true);
    expect(latinOnly.test("")).toBe(true);
    expect(latinOnly.test("Hello1")).toBe(false);
    expect(latinOnly.test("Привет")).toBe(false);
    expect(latinOnly.test("a[b")).toBe(false);
  });

  it("latinCyrillicNumbersHyphen allows mixed scripts with digits and hyphen", () => {
    expect(latinCyrillicNumbersHyphen.test("Иванов-Петров")).toBe(true);
    expect(latinCyrillicNumbersHyphen.test("Smith123")).toBe(true);
    expect(latinCyrillicNumbersHyphen.test("")).toBe(true);
    expect(latinCyrillicNumbersHyphen.test("Ёж")).toBe(true);
    expect(latinCyrillicNumbersHyphen.test("ёлка")).toBe(true);
    expect(latinCyrillicNumbersHyphen.test("-")).toBe(true);
    expect(latinCyrillicNumbersHyphen.test("test@email")).toBe(false);
    expect(latinCyrillicNumbersHyphen.test("hello world")).toBe(false);
  });

  it("cyrillicDashQuotation allows cyrillic, dash, quotes", () => {
    expect(cyrillicDashQuotation.test("Иванов-Петров")).toBe(true);
    expect(cyrillicDashQuotation.test("О'Коннор")).toBe(true);
    expect(cyrillicDashQuotation.test("Жу`лик")).toBe(true);
    expect(cyrillicDashQuotation.test("Ёж")).toBe(true);
    expect(cyrillicDashQuotation.test("")).toBe(true);
    expect(cyrillicDashQuotation.test("Smith")).toBe(false);
    expect(cyrillicDashQuotation.test("123")).toBe(false);
  });

  it("latinDashQuotation allows latin, dash, quotes", () => {
    expect(latinDashQuotation.test("O'Connor")).toBe(true);
    expect(latinDashQuotation.test("Smith-Jones")).toBe(true);
    expect(latinDashQuotation.test("O`Brien")).toBe(true);
    expect(latinDashQuotation.test("")).toBe(true);
    expect(latinDashQuotation.test("Иванов")).toBe(false);
    expect(latinDashQuotation.test("abc123")).toBe(false);
  });

  it("uppercaseLatinLetters matches uppercase letters", () => {
    expect("helloWorld".replaceAll(uppercaseLatinLetters, "_$&")).toBe(
      "hello_World",
    );
    expect("hello".replaceAll(uppercaseLatinLetters, "")).toBe("hello");
    expect("ABC".replaceAll(uppercaseLatinLetters, "")).toBe("");
    expect("Привет".replaceAll(uppercaseLatinLetters, "")).toBe("Привет");
  });

  it("latinNumbersDotUnderscoreHyphenPlus validates email local parts", () => {
    expect(latinNumbersDotUnderscoreHyphenPlus.test("user.name+tag")).toBe(
      true,
    );
    expect(latinNumbersDotUnderscoreHyphenPlus.test("user_name")).toBe(true);
    expect(latinNumbersDotUnderscoreHyphenPlus.test("user-name")).toBe(true);
    expect(latinNumbersDotUnderscoreHyphenPlus.test("")).toBe(true);
    expect(latinNumbersDotUnderscoreHyphenPlus.test("user@name")).toBe(false);
    expect(latinNumbersDotUnderscoreHyphenPlus.test("has space")).toBe(false);
  });
});

describe("boundary / edge patterns", () => {
  it("leadingOrTrailingDotHyphenPlus detects edge dots/hyphens/plus", () => {
    expect(leadingOrTrailingDotHyphenPlus.test(".name")).toBe(true);
    expect(leadingOrTrailingDotHyphenPlus.test("name-")).toBe(true);
    expect(leadingOrTrailingDotHyphenPlus.test("+name")).toBe(true);
    expect(leadingOrTrailingDotHyphenPlus.test("name+")).toBe(true);
    expect(leadingOrTrailingDotHyphenPlus.test(".")).toBe(true);
    expect(leadingOrTrailingDotHyphenPlus.test("name")).toBe(false);
    expect(leadingOrTrailingDotHyphenPlus.test("")).toBe(false);
  });

  it("leadingOrTrailingDash detects edge dashes", () => {
    expect(leadingOrTrailingDash.test("-name")).toBe(true);
    expect(leadingOrTrailingDash.test("name-")).toBe(true);
    expect(leadingOrTrailingDash.test("-")).toBe(true);
    expect(leadingOrTrailingDash.test("na-me")).toBe(false);
    expect(leadingOrTrailingDash.test("")).toBe(false);
  });

  it("leadingQuote removes leading double quote", () => {
    expect('"hello"'.replaceAll(leadingQuote, "")).toBe('hello"');
    expect('"'.replaceAll(leadingQuote, "")).toBe("");
    expect("hello".replaceAll(leadingQuote, "")).toBe("hello");
  });

  it("trailingQuote removes trailing double quote", () => {
    expect('"hello"'.replaceAll(trailingQuote, "")).toBe('"hello');
    expect('"'.replaceAll(trailingQuote, "")).toBe("");
    expect("hello".replaceAll(trailingQuote, "")).toBe("hello");
  });
});

describe("file extensions", () => {
  it("gzExtension matches .gz", () => {
    expect("file.csv.gz".replaceAll(gzExtension, "")).toBe("file.csv");
    expect("file.csv".replaceAll(gzExtension, "")).toBe("file.csv");
    expect("file.gzip".replaceAll(gzExtension, "")).toBe("file.gzip");
    expect("file.GZ".replaceAll(gzExtension, "")).toBe("file.GZ");
  });

  it("encExtension matches .enc", () => {
    expect("file.csv.enc".replaceAll(encExtension, "")).toBe("file.csv");
    expect("file.csv".replaceAll(encExtension, "")).toBe("file.csv");
    expect("file.ENC".replaceAll(encExtension, "")).toBe("file.ENC");
  });

  it("gzEncExtension matches .gz.enc", () => {
    expect("file.csv.gz.enc".replaceAll(gzEncExtension, "")).toBe("file.csv");
    expect("file.enc.gz".replaceAll(gzEncExtension, "")).toBe("file.enc.gz");
    expect("file.gz".replaceAll(gzEncExtension, "")).toBe("file.gz");
  });
});

describe("g-flag lastIndex statefulness", () => {
  it("consecutive .test() calls on g-flagged regex are stateful", () => {
    expect(uppercaseLatinLetters.test("A")).toBe(true);
    expect(uppercaseLatinLetters.test("A")).toBe(false);
    uppercaseLatinLetters.lastIndex = 0;
    expect(uppercaseLatinLetters.test("A")).toBe(true);
    uppercaseLatinLetters.lastIndex = 0;
  });

  it(".replaceAll() is safe — always processes the full string", () => {
    expect("AB".replaceAll(uppercaseLatinLetters, "")).toBe("");
    expect("AB".replaceAll(uppercaseLatinLetters, "")).toBe("");
  });
});

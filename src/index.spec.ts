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
  phoneNormalization,
  space,
  spacesAndNewlines,
  tabNewlineCarriageReturn,
  trailingQuote,
  uppercaseLatinLetters,
  whitespaceAndNbsp,
} from "./index";

describe("text normalization", () => {
  it("space matches whitespace", () => {
    expect("hello world".replaceAll(space, "_")).toBe("hello_world");
    expect("a\tb".replaceAll(space, "_")).toBe("a_b");
  });

  it("spacesAndNewlines matches whitespace and newlines", () => {
    expect("a \n b".replaceAll(spacesAndNewlines, "")).toBe("ab");
  });

  it("whitespaceAndNbsp matches whitespace and &nbsp;", () => {
    expect("a  &nbsp;  b".replaceAll(whitespaceAndNbsp, " ")).toBe("a b");
  });

  it("tabNewlineCarriageReturn matches tabs, newlines, carriage returns", () => {
    expect("a\tb\nc\rd".replaceAll(tabNewlineCarriageReturn, " ")).toBe(
      "a b c d",
    );
  });

  it("invisibleControlChars strips control characters", () => {
    expect("a\u0002b\u200Bc".replaceAll(invisibleControlChars, "")).toBe("abc");
    expect("a\u202Ab\u202Bc".replaceAll(invisibleControlChars, "")).toBe("abc");
    expect("a\u0003b".replaceAll(invisibleControlChars, "")).toBe("ab");
  });
});

describe("digit / phone patterns", () => {
  it("digits matches digits", () => {
    expect("abc123def".replaceAll(digits, "")).toBe("abcdef");
  });

  it("nonDigit matches non-digits", () => {
    expect("abc123def".replaceAll(nonDigit, "")).toBe("123");
  });

  it("nonPlusNonDigit keeps digits and plus", () => {
    expect("+7(999)123-45-67".replaceAll(nonPlusNonDigit, "")).toBe(
      "+79991234567",
    );
  });

  it("phoneNormalization captures Russian phone parts", () => {
    const match = "+79991234567".match(phoneNormalization);
    expect(match).not.toBeNull();
    expect(match?.[1]).toBe("+7");
    expect(match?.[2]).toBe("9991234567");

    expect("89991234567".match(phoneNormalization)).not.toBeNull();
    expect("12345".match(phoneNormalization)).toBeNull();
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
    expect(latinCyrillicNumbersHyphen.test("test@email")).toBe(false);
  });

  it("cyrillicDashQuotation allows cyrillic, dash, quotes", () => {
    expect(cyrillicDashQuotation.test("Иванов-Петров")).toBe(true);
    expect(cyrillicDashQuotation.test("О'Коннор")).toBe(true);
    expect(cyrillicDashQuotation.test("Smith")).toBe(false);
    expect(cyrillicDashQuotation.test("abc123")).toBe(false);
  });

  it("latinDashQuotation allows latin, dash, quotes", () => {
    expect(latinDashQuotation.test("O'Connor")).toBe(true);
    expect(latinDashQuotation.test("Smith-Jones")).toBe(true);
    expect(latinDashQuotation.test("Иванов")).toBe(false);
  });

  it("uppercaseLatinLetters matches uppercase letters", () => {
    expect("helloWorld".replaceAll(uppercaseLatinLetters, "_$&")).toBe(
      "hello_World",
    );
  });

  it("latinNumbersDotUnderscoreHyphenPlus validates email local parts", () => {
    expect(latinNumbersDotUnderscoreHyphenPlus.test("user.name+tag")).toBe(
      true,
    );
    expect(latinNumbersDotUnderscoreHyphenPlus.test("user@name")).toBe(false);
  });
});

describe("boundary / edge patterns", () => {
  it("leadingOrTrailingDotHyphenPlus detects edge dots/hyphens/plus", () => {
    expect(leadingOrTrailingDotHyphenPlus.test(".name")).toBe(true);
    expect(leadingOrTrailingDotHyphenPlus.test("name-")).toBe(true);
    expect(leadingOrTrailingDotHyphenPlus.test("name")).toBe(false);
  });

  it("leadingOrTrailingDash detects edge dashes", () => {
    expect(leadingOrTrailingDash.test("-name")).toBe(true);
    expect(leadingOrTrailingDash.test("name-")).toBe(true);
    expect(leadingOrTrailingDash.test("na-me")).toBe(false);
  });

  it("leadingQuote removes leading double quote", () => {
    expect('"hello"'.replaceAll(leadingQuote, "")).toBe('hello"');
  });

  it("trailingQuote removes trailing double quote", () => {
    expect('"hello"'.replaceAll(trailingQuote, "")).toBe('"hello');
  });
});

describe("file extensions", () => {
  it("gzExtension matches .gz", () => {
    expect("file.csv.gz".replaceAll(gzExtension, "")).toBe("file.csv");
    expect("file.csv".replaceAll(gzExtension, "")).toBe("file.csv");
  });

  it("encExtension matches .enc", () => {
    expect("file.csv.enc".replaceAll(encExtension, "")).toBe("file.csv");
  });

  it("gzEncExtension matches .gz.enc", () => {
    expect("file.csv.gz.enc".replaceAll(gzEncExtension, "")).toBe("file.csv");
  });
});

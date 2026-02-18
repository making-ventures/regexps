# @mkven/regexp-utils

Shared regular expression constants for text normalization and validation.

## Install

```sh
pnpm add @mkven/regexp-utils
```

## Usage

```ts
import { space, nonDigit, leadingQuote, trailingQuote } from "@mkven/regexp-utils";

"hello world".replaceAll(space, "_"); // "hello_world"
"abc123".replaceAll(nonDigit, ""); // "123"
```

## Constants

### Text normalization

| Constant | Pattern | Flags | Description |
|---|---|---|---|
| `space` | `\s` | `gu` | Any whitespace character |
| `spacesAndNewlines` | `(\s\|\n)` | `gu` | Whitespace or newline |
| `whitespaceAndNbsp` | `(?:\s\|&nbsp;)+` | `gu` | Whitespace or HTML nbsp entity |
| `tabNewlineCarriageReturn` | `[\t\n\r]` | `gu` | Tab, newline, carriage return |
| `invisibleControlChars` | `[\u0002\u0003\u200B\u202A\u202B]` | `gu` | STX, ETX, zero-width space, BiDi markers |

### Digit / phone patterns

| Constant | Pattern | Flags | Description |
|---|---|---|---|
| `digits` | `\d` | `gu` | Any digit |
| `nonDigit` | `\D` | `gu` | Any non-digit |
| `nonPlusNonDigit` | `[^\d+]` | `gu` | Any character except digit or plus |
| `phoneNormalization` | `^(\+?7\|8)(\d{10})$` | `u` | Russian phone number capture |

### Character class validation

| Constant | Pattern | Flags | Description |
|---|---|---|---|
| `latinOnly` | `^[A-Za-z]*$` | `u` | Only Latin letters |
| `latinCyrillicNumbersHyphen` | `^[\dA-Za-zЁА-яё-]*$` | `u` | Latin, Cyrillic, digits, hyphen |
| `cyrillicDashQuotation` | `^['\`ЁА-яё-]*$` | `u` | Cyrillic, dash, quotes |
| `latinDashQuotation` | `^['A-Z\`a-z-]*$` | `u` | Latin, dash, quotes |
| `uppercaseLatinLetters` | `[A-Z]` | `gu` | Uppercase Latin letters |
| `latinNumbersDotUnderscoreHyphenPlus` | `^[\w+.-]*$` | `u` | Latin, digits, dot, underscore, hyphen, plus |

### Boundary / edge patterns

| Constant | Pattern | Flags | Description |
|---|---|---|---|
| `leadingOrTrailingDotHyphenPlus` | `^[+.-]\|[+.-]$` | `u` | Leading or trailing dot/hyphen/plus |
| `leadingOrTrailingDash` | `^-\|-$` | `u` | Leading or trailing dash |
| `leadingQuote` | `^"` | `gu` | Leading double quote |
| `trailingQuote` | `"$` | `gu` | Trailing double quote |

### File extensions

| Constant | Pattern | Flags | Description |
|---|---|---|---|
| `gzExtension` | `\.gz$` | `gu` | .gz file extension |
| `encExtension` | `\.enc$` | `gu` | .enc file extension |
| `gzEncExtension` | `\.gz\.enc$` | `gu` | .gz.enc file extension |

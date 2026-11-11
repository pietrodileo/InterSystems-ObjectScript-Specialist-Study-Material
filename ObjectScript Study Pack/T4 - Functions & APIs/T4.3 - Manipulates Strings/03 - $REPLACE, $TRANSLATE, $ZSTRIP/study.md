[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T4.3: Manipulates Strings

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T4.3.html). Reference links require internet access.

## 3. $REPLACE, $TRANSLATE, $ZSTRIP

![T4.3 visual summary of sections 1–4: 1. $PIECE for delimited strings; 2. $EXTRACT for substrings; 3. $REPLACE, $TRANSLATE, $ZSTRIP; 4. String concatenation](../visual-guide-01-v2.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **$REPLACE**: Replaces all occurrences of a substring: $REPLACE(string, old, new)
- **$TRANSLATE($TR)**: Character-by-character replacement: $TR(string, fromChars, toChars)
- **$TRANSLATE deletion**: If toChars is shorter, unmatched fromChars are deleted
- **$ZSTRIP**: Removes characters by category/mask: $ZSTRIP(string, mask, removeChars, keepChars)
- **$ZSTRIP masks**: "&lt;" strip leading, "&gt;" strip trailing, "\*" strip all, "&lt;&gt;" strip both ends

### Detailed Notes

#### Overview

These three functions handle different string transformation needs: $REPLACE for substring replacement, $TRANSLATE for character-level mapping, and $ZSTRIP for removing categories of characters.

#### $REPLACE: Substring Replacement

```objectscript
 SET str = "Hello World, Hello IRIS"

 // Replace all occurrences
 WRITE $REPLACE(str, "Hello", "Hi"), !
 // Output: Hi World, Hi IRIS

 // Case-sensitive
 WRITE $REPLACE(str, "hello", "hi"), !
 // Output: Hello World, Hello IRIS (no change -- case mismatch)

 // Remove by replacing with empty string
 WRITE $REPLACE(str, " Hello", ""), !
 // Output: Hello World, IRIS

 // Replace multi-character sequences
 SET path = "C:\Users\Admin\Documents"
 WRITE $REPLACE(path, "\", "/"), !
 // Output: C:/Users/Admin/Documents
```

#### $TRANSLATE: Character-by-Character Mapping

```objectscript
 // Map characters one-to-one
 SET str = "Hello World"
 WRITE $TRANSLATE(str, "lo", "LO"), !
 // Output: HeLLO WOrLd

 // $TR shorthand
 WRITE $TR(str, "HW", "hw"), !
 // Output: hello world

 // Delete characters (toChars shorter than fromChars)
 SET phone = "(555) 123-4567"
 WRITE $TR(phone, "()- ", ""), !
 // Output: 5551234567

 // ROT13 encoding
 SET msg = "Hello"
 SET from = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
 SET to   = "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm"
 WRITE $TR(msg, from, to), !
 // Output: Uryyb

 // Convert to uppercase (simple ASCII)
 SET lower = "hello world"
 WRITE $TR(lower, "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"), !
 // Output: HELLO WORLD
 // Better: use $ZCONVERT(lower, "U") -- see item 6
```

#### $ZSTRIP: Category-Based Removal

```objectscript
 SET str = "  Hello 123 World!  "

 // Strip leading and trailing whitespace
 WRITE $ZSTRIP(str, "<>W"), !
 // Output: Hello 123 World!

 // Strip all whitespace
 WRITE $ZSTRIP(str, "*W"), !
 // Output: Hello123World!

 // Strip leading whitespace only
 WRITE $ZSTRIP(str, "<W"), !
 // Output: Hello 123 World!  (trailing space preserved)

 // Strip all non-numeric characters
 SET mixed = "abc123def456"
 WRITE $ZSTRIP(mixed, "*A"), !
 // Output: 123456 (strips all alpha, leaving digits)

 // Strip specific characters
 SET data = "###Hello###"
 WRITE $ZSTRIP(data, "<>", "#"), !
 // Output: Hello (strips # from both ends)

 // Common masks:
 // "W" = whitespace, "A" = alphabetic, "N" = numeric
 // "P" = punctuation, "C" = control characters
 // "L" = lowercase, "U" = uppercase, "E" = everything

 // Strip all punctuation
 SET text = "Hello, World! How are you?"
 WRITE $ZSTRIP(text, "*P"), !
 // Output: Hello World How are you
```

### Documentation References

- [$REPLACE Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_freplace)
- [$TRANSLATE Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_ftranslate)
- [$ZSTRIP Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fzstrip)

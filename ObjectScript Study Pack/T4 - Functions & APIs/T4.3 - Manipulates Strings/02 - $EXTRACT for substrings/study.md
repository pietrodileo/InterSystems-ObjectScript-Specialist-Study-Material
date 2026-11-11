[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T4.3: Manipulates Strings

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T4.3.html). Reference links require internet access.

## 2. $EXTRACT for substrings

![T4.3 visual summary of sections 1–4: 1. $PIECE for delimited strings; 2. $EXTRACT for substrings; 3. $REPLACE, $TRANSLATE, $ZSTRIP; 4. String concatenation](../visual-guide-01-v2.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **$EXTRACT($E)**: Extracts characters by position: $E(string, from, to)
- **Single character**: $E(string, n) extracts the nth character (1-based)
- **Range**: $E(string, from, to) extracts a substring
- **SET $EXTRACT**: Replaces characters in-place: SET $E(var, from, to) = replacement
- **From end**: $E(string, \*) gets last character; $E(string, \*-n) counts from end
- **$LENGTH**: Returns the number of characters in a string

### Detailed Notes

#### Overview

$EXTRACT works at the character level, extracting or replacing individual characters or substrings by position. Unlike $PIECE which works with delimiters, $EXTRACT uses numeric positions within the string.

#### Basic Character Extraction

```objectscript
 SET name = "ObjectScript"

 // Single character (1-based)
 WRITE $EXTRACT(name, 1), !        // O
 WRITE $EXTRACT(name, 7), !        // S

 // $E shorthand
 WRITE $E(name, 1), !              // O

 // Character range
 WRITE $E(name, 1, 6), !           // Object
 WRITE $E(name, 7, 12), !          // Script

 // From end
 WRITE $E(name, *), !              // t (last char)
 WRITE $E(name, *-5, *), !         // Script (last 6 chars)
```

#### Modifying with SET $EXTRACT

```objectscript
 SET word = "Hello"

 // Replace single character
 SET $E(word, 1) = "J"
 WRITE word, !                     // Jello

 // Replace range (different length OK)
 SET $E(word, 1, 3) = "Mars"
 WRITE word, !                     // Marslo

 // Replace with shorter string
 SET word = "Hello World"
 SET $E(word, 6, 6) = "-"
 WRITE word, !                     // Hello-World
```

#### Using $LENGTH for String Length

```objectscript
 SET str = "ObjectScript"
 WRITE $LENGTH(str), !             // 12

 // Get last N characters
 SET n = 6
 WRITE $E(str, $L(str) - n + 1, $L(str)), !   // Script

 // Or more concisely
 WRITE $E(str, *-5, *), !                       // Script
```

#### Practical Patterns

```objectscript
 // Check if string starts with a prefix
 SET filename = "report_2025.pdf"
 IF $E(filename, 1, 7) = "report_" {
     WRITE "It's a report file", !
 }

 // Check file extension
 SET ext = $E(filename, *-2, *)
 WRITE "Extension: ", ext, !       // pdf

 // Pad a string to fixed width
 SET num = "42"
 SET padded = $E("00000" _ num, *-4, *)
 WRITE padded, !                   // 00042

 // Truncate a string
 SET longStr = "This is a very long string"
 SET truncated = $E(longStr, 1, 10) _ "..."
 WRITE truncated, !                // This is a ...
```

### Documentation References

- [$EXTRACT Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fextract)
- [$LENGTH Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_flength)

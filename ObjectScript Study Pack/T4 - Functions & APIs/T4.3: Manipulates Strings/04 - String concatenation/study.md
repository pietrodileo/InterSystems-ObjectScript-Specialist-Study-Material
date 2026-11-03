[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T4.3: Manipulates Strings

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T4.3.html). Reference links require internet access.

## 4. String concatenation

![T4.3 visual summary of sections 1–4: 1. $PIECE for delimited strings; 2. $EXTRACT for substrings; 3. $REPLACE, $TRANSLATE, $ZSTRIP; 4. String concatenation](../visual-guide-01-v2.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **Concatenation operator (_)**: The underscore joins strings: "Hello" _ " " _ "World"
- **No template literals**: ObjectScript does not support string interpolation or template strings
- **Type coercion**: Non-string values are automatically converted when concatenated
- **Building strings in loops**: Common pattern to build output incrementally
- **$CHAR for special characters**: Use $CHAR(n) to concatenate non-printable characters

### Detailed Notes

#### Overview

ObjectScript uses the underscore character (_) as its string concatenation operator. There is no string interpolation or template literal syntax -- all string building uses explicit concatenation.

#### Basic Concatenation

```objectscript
 SET first = "John"
 SET last = "Smith"

 // Simple concatenation
 SET fullName = first _ " " _ last
 WRITE fullName, !                  // John Smith

 // Multiple concatenations
 SET greeting = "Hello, " _ first _ " " _ last _ "!"
 WRITE greeting, !                  // Hello, John Smith!

 // Numeric coercion
 SET age = 42
 SET msg = first _ " is " _ age _ " years old"
 WRITE msg, !                       // John is 42 years old
```

#### Special Characters with $CHAR

```objectscript
 // Newline character
 SET crlf = $CHAR(13, 10)
 SET multiLine = "Line 1" _ crlf _ "Line 2"

 // Tab character
 SET tab = $CHAR(9)
 SET tsv = "Col1" _ tab _ "Col2" _ tab _ "Col3"

 // Double quote within a string
 SET quoted = "He said " _ $CHAR(34) _ "hello" _ $CHAR(34)
 WRITE quoted, !                    // He said "hello"
```

#### Building Strings in Loops

```objectscript
 // Build a comma-separated list
 SET result = ""
 SET sep = ""
 FOR i = 1:1:5 {
     SET result = result _ sep _ i
     SET sep = ","
 }
 WRITE result, !                    // 1,2,3,4,5

 // Alternative: build then strip trailing separator
 SET result = ""
 FOR i = 1:1:5 {
     SET result = result _ i _ ","
 }
 SET result = $E(result, 1, *-1)    // Remove trailing comma
 WRITE result, !                    // 1,2,3,4,5
```

#### Concatenation vs WRITE

```objectscript
 // WRITE outputs directly (more efficient for display)
 WRITE "Name: ", first, " ", last, !

 // Concatenation builds a string value (for storage/return)
 SET output = "Name: " _ first _ " " _ last
 RETURN output
```

### Documentation References

- [Concatenation Operator](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_string)
- [$CHAR Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fchar)

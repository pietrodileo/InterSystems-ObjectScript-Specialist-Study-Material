[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T4.3: Manipulates Strings — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
You are parsing an HL7 PID segment. Consider:

set pid = "PID|1||12345^^^MRN||Smith^John^A||19800515|M"
write $PIECE(pid, "|", 6)

What is the output?
```

**A.** 12345^^^MRN

**B.** Smith^John^A

**C.** 19800515

**D.** 1

### Answer and explanation

**Correct answer: B.** Smith^John^A

$PIECE extracts a delimited piece from a string. Counting pipe-delimited pieces: 1\="PID", 2\="1", 3\="", 4\="12345^^^MRN", 5\="", 6\="Smith^John^A". The sixth pipe-delimited piece is the patient name field. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fpiece))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

```text
A data correction routine needs to update the city field in a delimited record. Consider:

set rec = "Smith^John^New York^NY"
set $PIECE(rec, "^", 3) = "Boston"
write rec

What is the output?
```

**A.** Smith^John^Boston^NY

**B.** Smith^John^New York^Boston

**C.** Boston^John^New York^NY

**D.** A \<SYNTAX\> error

### Answer and explanation

**Correct answer: A.** Smith^John^Boston^NY

SET $PIECE can modify a string by replacing a specific delimited piece. Setting $PIECE(rec, "^", 3\) \= "Boston" replaces the third ^-delimited piece ("New York") with "Boston", resulting in "Smith^John^Boston^NY". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fpiece))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
You need to extract a range of pieces from a delimited string. Consider:

set data = "A-B-C-D-E"
write $PIECE(data, "-", 2, 4)

What is the output?
```

**A.** B

**B.** B-C-D

**C.** BCD

**D.** B-C

### Answer and explanation

**Correct answer: B.** B-C-D

$PIECE with four arguments extracts pieces from position 2 to position 4 inclusive, returning them with their delimiters intact. So $PIECE("A-B-C-D-E", "-", 2, 4\) returns "B-C-D". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fpiece))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
You are extracting a substring from a fixed-width record. Consider:

set record = "SMITH   JOHN    20260305"
set result = $EXTRACT(record, 9, 16)
write "[", result, "]"
write " Length: ", $LENGTH(result)

What is the output?
```

**A.** \[JOHN \] Length: 8 — JOHN followed by 4 trailing spaces

**B.** \[SMITH \] Length: 8 — SMITH followed by 3 trailing spaces

**C.** \[JOHN\] Length: 4 — trailing spaces are automatically trimmed

**D.** \[20260305\] Length: 8

### Answer and explanation

**Correct answer: A.** \[JOHN \] Length: 8 — JOHN followed by 4 trailing spaces

$EXTRACT extracts characters by position (1-based, inclusive). Characters 9-16 of "SMITH JOHN 20260305" are "JOHN " (JOHN followed by 4 spaces), which is 8 characters. $EXTRACT preserves all characters including trailing spaces — it does not trim. Use $ZSTRIP to remove whitespace if needed. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fextract))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
You need to replace characters in a fixed-width string. Consider:

set code = "ABCDEF"
set $EXTRACT(code, 3, 4) = "XY"
write code

What is the output?
```

**A.** ABXYEF

**B.** ABCXYDEF

**C.** ABXYDEF

**D.** AXYCDEF

### Answer and explanation

**Correct answer: A.** ABXYEF

SET $EXTRACT(str, from, to) \= value replaces characters at positions from through to with value. Positions 3-4 ("CD") are replaced by "XY", giving "ABXYEF". The replacement length matches the range. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fextract))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
A template engine needs to replace placeholders. Consider:

set template = "Hello {{name}}, welcome to {{city}}!"
set result = $REPLACE(template, "{{name}}", "Alice")
set result = $REPLACE(result, "{{city}}", "Paris")
write result

What is the output?
```

**A.** Hello Alice, welcome to Paris!

**B.** Hello {{name}}, welcome to {{city}}!

**C.** Hello Alice, welcome to {{city}}!

**D.** A \<SYNTAX\> error

### Answer and explanation

**Correct answer: A.** Hello Alice, welcome to Paris!

$REPLACE replaces all occurrences of a substring with a replacement. The first call replaces {{name}} with Alice, the second replaces {{city}} with Paris. Each call returns a new string; the original is not modified in place (the result is reassigned). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_freplace))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

```text
You are sanitizing a phone number by removing all non-digit characters. Consider:

set phone = "(555) 123-4567"
set clean = $TRANSLATE(phone, "()- ", "")
write clean

What is the output?
```

**A.** 5551234567

**B.** (555) 123-4567

**C.** 555 1234567

**D.** A \<FUNCTION\> error

### Answer and explanation

**Correct answer: A.** 5551234567

$TRANSLATE performs character-by-character replacement. When the third argument is shorter than the second, unmatched characters are removed. Here "(", ")", "-", and " " all have no corresponding replacement character, so they are deleted, leaving "5551234567". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_ftranslate))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

```text
You need to obfuscate vowels in a string. Consider:

set name = "Hello"
write $TRANSLATE(name, "aeiou", "*")

What is the output?
```

**A.** H\*ll\*

**B.** H\*llo

**C.** H\*ll

**D.** Hll

### Answer and explanation

**Correct answer: D.** Hll

$TRANSLATE performs character-by-character mapping. 'a' at position 1 maps to '\*' at position 1\. But 'e' (position 2), 'i' (position 3), 'o' (position 4), 'u' (position 5\) have no corresponding character in the replacement string "\*" (only 1 character). Characters without a mapping are deleted. In "Hello": H stays (not in from-string), 'e' is deleted, 'l' stays, 'l' stays, 'o' is deleted. Result: "Hll". Note: $TRANSLATE is case-sensitive, so uppercase 'H' is not affected by lowercase 'h' in the from-string. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_ftranslate))

## Question 9 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

```text
You are cleaning user input by stripping leading and trailing whitespace. Consider:

set input = "  Hello World  "
set result = $ZSTRIP(input, "<>W")
write "[", result, "] Length: ", $LENGTH(result)

What is the output?
```

**A.** \[Hello World\] Length: 11 — leading and trailing spaces removed, interior space kept

**B.** \[HelloWorld\] Length: 10 — all spaces removed

**C.** \[ Hello World \] Length: 15 — unchanged, no spaces removed

**D.** \[Hello World \] Length: 14 — only leading spaces removed

### Answer and explanation

**Correct answer: A.** \[Hello World\] Length: 11 — leading and trailing spaces removed, interior space kept

$ZSTRIP removes characters matching a mask. '\<' strips from the left, '\>' strips from the right, 'W' targets whitespace characters. So "\<\>W" strips leading and trailing whitespace, producing "Hello World" (11 chars) with the interior space preserved. Use "\*W" to also remove embedded spaces. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fzstrip))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
A data cleansing routine needs to remove ALL whitespace from a string, including embedded spaces. Consider:

set messy = " A B  C "
set result = $ZSTRIP(messy, "*W")
write "[", result, "] Length: ", $LENGTH(result)

What is the output?
```

**A.** \[A B C\] Length: 6 — only leading/trailing spaces removed

**B.** \[ABC\] Length: 3 — all spaces removed including embedded

**C.** \[ A B C \] Length: 8 — unchanged, no spaces removed

**D.** \[A B C\] Length: 5 — extra embedded spaces collapsed to single spaces

### Answer and explanation

**Correct answer: B.** \[ABC\] Length: 3 — all spaces removed including embedded

The '\*' mask in $ZSTRIP means strip from everywhere — leading, trailing, AND embedded. Combined with 'W' for whitespace, "\*W" removes all whitespace characters from the string, including interior spaces, producing "ABC" (3 chars). Compare with "\<\>W" which only strips leading and trailing whitespace. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fzstrip))

## Question 11 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

```text
You are normalizing user input for case-insensitive comparison. Consider:

set input = "Hello World"
write $ZCONVERT(input, "U")

What is the output?
```

**A.** hello world

**B.** HELLO WORLD

**C.** Hello world

**D.** Hello World

### Answer and explanation

**Correct answer: B.** HELLO WORLD

$ZCONVERT with "U" converts a string to uppercase. Other options: "L" for lowercase, "W" for title case (capitalize first letter of each word). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fzconvert))

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

```text
A developer needs to embed a quote character inside a string for a SQL query. Which line correctly produces the string:

He said "hello"

?
```

**A.** set msg \= "He said \\"hello\\""

**B.** set msg \= "He said ""hello"""

**C.** set msg \= "He said 'hello'"

**D.** set msg \= 'He said "hello"'

### Answer and explanation

**Correct answer: B.** set msg \= "He said ""hello"""

In ObjectScript, you embed a literal double-quote character by doubling it: "" inside a string represents a single ". So "He said ""hello""" produces the string: He said "hello". ObjectScript does not use backslash escaping. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_string))

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

```text
You encounter a puzzling expression in legacy code. Consider:

set x = "3cats"
set y = "5dogs"
write x + y

What is the output?
```

**A.** "3cats5dogs"

**B.** 8

**C.** 0

**D.** An \<ILLEGAL VALUE\> error

### Answer and explanation

**Correct answer: B.** 8

The \+ operator performs numeric addition in ObjectScript. Strings are coerced to numbers by extracting the leading numeric portion: "3cats" becomes 3, "5dogs" becomes 5\. So 3 \+ 5 \= 8\. String concatenation uses the \_ operator: "3cats" \_ "5dogs" \= "3cats5dogs". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_numeric))

## Question 14 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

```text
You are building a validation routine using regular expressions. Consider:

set email = "user@example.com"
write $MATCH(email, "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")

What is the output?
```

**A.** 1

**B.** 0

**C.** "user@example.com"

**D.** A \<SYNTAX\> error

### Answer and explanation

**Correct answer: A.** 1

$MATCH tests whether a string matches a regular expression pattern and returns 1 (match) or 0 (no match). The email pattern matches "user@example.com", so $MATCH returns 1\. $MATCH always returns a Boolean, not the matched string. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fmatch))

## Question 15 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

```text
You are counting delimited fields in a data record. Consider:

write $LENGTH("A^B^C^D", "^")

What is the output?
```

**A.** 3

**B.** 4

**C.** 7

**D.** 8

### Answer and explanation

**Correct answer: B.** 4

The two-argument form of $LENGTH counts the number of delimited pieces (not characters). "A^B^C^D" has 4 ^-delimited pieces: A, B, C, D. The one-argument form $LENGTH("A^B^C^D") would return 7 (the character count). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_flength))

## Question 16 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q16.md>)

```text
A web application needs to encode user input for safe HTML output. Consider:

set input = "<script>alert('XSS')</script>"
set safe = $ZCONVERT(input, "O", "HTML")

Which statement best describes what 'safe' contains?
```

**A.** The original string unchanged

**B.** An HTML-encoded string where \< becomes \&lt; and \> becomes \&gt;

**C.** A Base64-encoded version of the string

**D.** The string with all HTML tags removed

### Answer and explanation

**Correct answer: B.** An HTML-encoded string where \< becomes \&lt; and \> becomes \&gt;

$ZCONVERT with "O" (output) and "HTML" encoding converts special HTML characters to their entity equivalents: \< to \&lt;, \> to \&gt;, \& to \&amp;, and quotes to their entities. This prevents XSS attacks by ensuring the browser displays the text rather than executing it. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fzconvert))

## Question 17 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q17.md>)

```text
You are parsing a CSV record that has an empty field. Consider:

set row = "Smith,,42,Male"
write $PIECE(row, ",", 2)

What is the output?
```

**A.** 42

**B.** Male

**C.** "" (empty string)

**D.** An \<UNDEFINED\> error

### Answer and explanation

**Correct answer: C.** "" (empty string)

The string has two consecutive commas between "Smith" and "42". $PIECE(row, ",", 2\) returns the second comma-delimited piece, which is an empty string (the gap between the two commas). $PIECE never throws an error for empty pieces. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fpiece))

## Question 18 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q18.md>)

```text
You need to understand the difference between $REPLACE and $TRANSLATE. Consider:

set str = "banana"
set r1 = $REPLACE(str, "an", "X")
set r2 = $TRANSLATE(str, "an", "XY")
write r1, " / ", r2

What is the output?
```

**A.** bXXa / bXYXYX

**B.** bXXa / bXyXyX

**C.** bXana / bXYXYX

**D.** bXXa / bXYXYx

### Answer and explanation

**Correct answer: A.** bXXa / bXYXYX

$REPLACE works on substrings: it finds "an" in "banana" and replaces each occurrence. "b-an-an-a" has two occurrences of "an", giving "bXXa". $TRANSLATE works character-by-character: 'a' maps to 'X' (pos 1-\>pos 1\) and 'n' maps to 'Y' (pos 2-\>pos 2). So in "banana": b stays, a-\>X, n-\>Y, a-\>X, n-\>Y, a-\>X \= "bXYXYX". This illustrates the fundamental difference: $REPLACE matches substrings, $TRANSLATE maps individual characters. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_freplace))

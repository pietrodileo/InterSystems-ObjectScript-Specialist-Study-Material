# T4.3 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Fields, character maps and escaping

![T4.3 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Field versus character range

**Example or flow:** $PIECE selects delimiter-separated fields; $EXTRACT selects inclusive character positions

**Reasoning:** Empty fields still occupy positions. Fixed-width extraction retains padding spaces; it does not trim automatically.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q15](<Domanda per domanda/Q15.md>), [Q17](<Domanda per domanda/Q17.md>).

### Panel 2 — 2. Same input, different operation

**Example or flow:** banana → REPLACE substring an with X → bXXa; independently banana → TRANSLATE a→X,n→Y → bXYXYX

**Reasoning:** REPLACE matches multi-character units; TRANSLATE maps individual characters. Draw two independent branches from the original input.

Related question analyses: [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q07](<Domanda per domanda/Q07.md>), [Q08](<Domanda per domanda/Q08.md>), [Q18](<Domanda per domanda/Q18.md>).

### Panel 3 — 3. Preserve meaning during cleanup

**Example or flow:** Edge trim keeps the middle space; removing all whitespace loses it; HTML text escaping preserves literal markup display

**Reasoning:** Normalization can lose information. Match output encoding to the actual HTML, script, URL or other destination context.

Related question analyses: [Q09](<Domanda per domanda/Q09.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>), [Q12](<Domanda per domanda/Q12.md>), [Q13](<Domanda per domanda/Q13.md>), [Q14](<Domanda per domanda/Q14.md>), [Q16](<Domanda per domanda/Q16.md>).

## Further insights: String operations and information loss

![T4.3 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Pieces versus protocol fields

**Example or flow:** Split the sample segment `PID||12345` on pipes. Piece 1 is PID, piece 2 is empty, and piece 3 is 12345. In a PID segment, the segment name precedes numbered fields, so the third raw piece represents field 2.

**Reasoning:** Map the protocol's numbering to raw string positions before extracting a value. Keep empty pieces in the count so later fields stay aligned.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q15](<Domanda per domanda/Q15.md>), [Q17](<Domanda per domanda/Q17.md>).

### Panel 2 — Character map with missing targets

**Example or flow:** In $TRANSLATE("Hello","aeiou","*"), the first source character a maps to the first target character *. The other source vowels have no corresponding target, so the e and o in Hello are removed and the output is Hll.

**Reasoning:** Line up source and target characters by position. To replace every listed vowel with a star, supply a star for each one.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>), [Q08](<Domanda per domanda/Q08.md>), [Q18](<Domanda per domanda/Q18.md>).

### Panel 3 — Trim versus erase whitespace

**Example or flow:** Start with Hello World surrounded by two spaces at each end. Trimming the ends gives Hello World with its word separator intact. Removing all spaces gives HelloWorld.

**Reasoning:** Choose a cleanup rule based on which spaces carry meaning. Removing internal spaces can make values that were distinct become identical.

Related question analyses: [Q09](<Domanda per domanda/Q09.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>), [Q13](<Domanda per domanda/Q13.md>).

### Panel 4 — Encoding depends on output context

**Example or flow:** A comment contains the literal text <b>hello</b>. In an HTML text node, escaping the angle brackets makes the browser display the tags as text. Putting that value in a script or URL means a different parser will read it.

**Reasoning:** Identify where the string goes before choosing how to encode it. HTML text escaping solves the HTML text case. Use the appropriate API or binding for other contexts.

Related question analyses: [Q06](<Domanda per domanda/Q06.md>), [Q12](<Domanda per domanda/Q12.md>), [Q14](<Domanda per domanda/Q14.md>), [Q16](<Domanda per domanda/Q16.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

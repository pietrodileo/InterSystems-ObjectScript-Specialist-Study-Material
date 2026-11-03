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

**Example or flow:** PID segment name is piece 1 in the raw string

**Reasoning:** Protocol field numbering and raw $PIECE positions can differ. Count empty pieces instead of dropping them.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q15](<Domanda per domanda/Q15.md>), [Q17](<Domanda per domanda/Q17.md>).

### Panel 2 — Character map with missing targets

**Example or flow:** $TRANSLATE("Hello","aeiou","*") → Hll

**Reasoning:** Only a maps to the one target character. Other listed vowels have no counterpart and are deleted, not replaced by stars.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>), [Q08](<Domanda per domanda/Q08.md>), [Q18](<Domanda per domanda/Q18.md>).

### Panel 3 — Trim versus erase whitespace

**Example or flow:** "  Hello World  " → edge trim: "Hello World"; remove all whitespace: "HelloWorld"

**Reasoning:** Internal whitespace may carry meaning. A stronger cleanup can merge values that used to be distinct.

Related question analyses: [Q09](<Domanda per domanda/Q09.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>), [Q13](<Domanda per domanda/Q13.md>).

### Panel 4 — Encoding depends on output context

**Example or flow:** HTML text escaping → displays markup as text in the intended context

**Reasoning:** HTML encoding is not universal protection for JavaScript, URLs, CSS or SQL. Choose the encoding for the actual destination.

Related question analyses: [Q06](<Domanda per domanda/Q06.md>), [Q12](<Domanda per domanda/Q12.md>), [Q14](<Domanda per domanda/Q14.md>), [Q16](<Domanda per domanda/Q16.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

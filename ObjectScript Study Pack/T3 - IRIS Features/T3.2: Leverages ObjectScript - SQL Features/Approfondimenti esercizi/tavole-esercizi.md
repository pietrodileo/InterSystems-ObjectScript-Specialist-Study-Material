# T3.2 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Coercion, macros and cursor flow

![T3.2 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Arithmetic versus concatenation

**Example or flow:** x="5 apples", y="3 oranges"; x+y → 8; x_y → "5 apples3 oranges"

**Reasoning:** Arithmetic reads numeric prefixes. Concatenation preserves text and inserts no separator automatically.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q04](<Domanda per domanda/Q04.md>), [Q11](<Domanda per domanda/Q11.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 2 — 2. Compile-time substitution

**Example or flow:** Macro TaxRate=0.07 → compiled expression amount*0.07 → GetTax(100)=7

**Reasoning:** A macro expands before execution. Updating an include requires considering dependent recompilation.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q06](<Domanda per domanda/Q06.md>), [Q12](<Domanda per domanda/Q12.md>).

### Panel 3 — 3. Fetch before processing

**Example or flow:** FETCH → SQLCODE 0: process row; 100: finish; negative: handle error; then close cursor

**Reasoning:** The final no-data fetch is not another row. Avoid reusing stale host variables after it.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>), [Q10](<Domanda per domanda/Q10.md>), [Q14](<Domanda per domanda/Q14.md>), [Q16](<Domanda per domanda/Q16.md>).

## Further insights: Conversions, SQL outcomes and compilation

![T3.2 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Coercion is not validation

**Example or flow:** 10abc20 + 5 → 10 + 5 → 15

**Reasoning:** Arithmetic uses the numeric prefix rather than searching all digits. A plausible answer does not prove valid numeric input.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q04](<Domanda per domanda/Q04.md>), [Q11](<Domanda per domanda/Q11.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 2 — Three SQL outcomes

**Example or flow:** SQLCODE 0: successful operation; 100: no row; negative: error

**Reasoning:** After SELECT finds no row, do not present an old host-variable value as a fresh result.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>), [Q10](<Domanda per domanda/Q10.md>), [Q14](<Domanda per domanda/Q14.md>), [Q16](<Domanda per domanda/Q16.md>).

### Panel 3 — Values versus identifiers

**Example or flow:** Status=? → bound value; variable table name → allowlisted identifier

**Reasoning:** A parameter protects a value. It does not validate other SQL text constructed from untrusted input.

Related question analyses: [Q13](<Domanda per domanda/Q13.md>), [Q17](<Domanda per domanda/Q17.md>).

### Panel 4 — Macro dependencies

**Example or flow:** Include definitions → expansion → compilation → execution

**Reasoning:** Changing an include file does not automatically replace values already compiled into dependent code.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q06](<Domanda per domanda/Q06.md>), [Q12](<Domanda per domanda/Q12.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

# T4.5 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Conditions, exit scopes and defaults

![T4.5 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Numeric truth conversion

**Example or flow:** "abc" → 0 → false; "1abc" → 1 → true; nonempty test → explicit comparison with empty string

**Reasoning:** A Boolean test does not validate a numeric input and does not mean text is nonempty.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q07](<Domanda per domanda/Q07.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 2 — 2. Exit the intended scope

**Example or flow:** CONTINUE → next iteration; plain QUIT in FOR → after loop; RETURN value → caller

**Reasoning:** QUIT behavior depends on context. Do not use QUIT with a value inside the shown FOR as a method return.

Related question analyses: [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 3 — 3. Cover the boundary

**Example or flow:** x>5: big; x<5: small; x=5: explicit equal/default case; SELECT: first true branch wins

**Reasoning:** A skipped assignment can leave an old or undefined result. A final true SELECT branch provides a fallback when that is the desired contract.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q12](<Domanda per domanda/Q12.md>), [Q13](<Domanda per domanda/Q13.md>).

## Further insights: Control flow and boundary cases

![T4.5 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Uncovered boundary

**Example or flow:** x>5 → big; x<5 → small; x=5 → no assignment

**Reasoning:** Two conditions do not automatically cover every input. Initialize the result or define the missing branch.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q04](<Domanda per domanda/Q04.md>), [Q07](<Domanda per domanda/Q07.md>).

### Panel 2 — Three exit scopes

**Example or flow:** CONTINUE → next iteration; plain QUIT in this FOR → after loop; RETURN → caller

**Reasoning:** Choose the exit according to the scope you want to leave. QUIT with an argument inside the shown FOR is not a method return.

Related question analyses: [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q11](<Domanda per domanda/Q11.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 3 — First true SELECT branch

**Example or flow:** cat→Meow; final 1:Unknown covers other values

**Reasoning:** The first true condition wins. Without any true branch SELECT raises an error; decide whether a default is semantically correct.

Related question analyses: [Q12](<Domanda per domanda/Q12.md>), [Q13](<Domanda per domanda/Q13.md>).

### Panel 4 — Truthy is not nonempty

**Example or flow:** "abc" → numeric 0 → false; "1abc" → 1 → true

**Reasoning:** For nonempty text, compare explicitly with the empty string. For positive quantity, use an explicit >0 test.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q10](<Domanda per domanda/Q10.md>), [Q14](<Domanda per domanda/Q14.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

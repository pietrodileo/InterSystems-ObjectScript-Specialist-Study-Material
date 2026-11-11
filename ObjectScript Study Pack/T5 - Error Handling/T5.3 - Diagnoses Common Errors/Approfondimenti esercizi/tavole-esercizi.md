# T5.3 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Missing values, termination and data policy

![T5.3 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Identify the actual missing thing

**Example or flow:** City and city differ; traversal end sentinel → stop before read; empty oref → handle before property access

**Reasoning:** UNDEFINED, SUBSCRIPT and INVALID OREF point to different failures. Do not solve a typo by inserting an unrelated default.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q08](<Domanda per domanda/Q08.md>), [Q13](<Domanda per domanda/Q13.md>), [Q14](<Domanda per domanda/Q14.md>), [Q18](<Domanda per domanda/Q18.md>).

### Panel 2 — 2. Make termination explicit

**Example or flow:** Recursive factorial: valid input and base case; graph loop: visited nodes; average: n=0 guard

**Reasoning:** A numeric limit, growing key and call depth are different constraints. Fix the termination rule before increasing limits.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q16](<Domanda per domanda/Q16.md>), [Q17](<Domanda per domanda/Q17.md>).

### Panel 3 — 3. Missing-data policy changes the answer

**Example or flow:** Scores total=70; three present → 70/3≈23.33; treating a fourth missing score as zero → 70/4=17.50

**Reasoning:** Reject, ignore or replace with zero are different domain decisions. Choose before calculating rather than silencing every missing-value error.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q07](<Domanda per domanda/Q07.md>), [Q09](<Domanda per domanda/Q09.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>), [Q12](<Domanda per domanda/Q12.md>), [Q15](<Domanda per domanda/Q15.md>).

## Further insights: Diagnose causes rather than hide symptoms

![T5.3 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Initialization is separate from scope

**Example or flow:** NEW total creates a new scope for the local variable without giving it a value. If the next line tries to add one to total, it can raise UNDEFINED. SET total=0 before the loop creates the initial accumulator.

**Reasoning:** Check scope and initialization separately. If you expected a value already, trace the assignments and look for a misspelled name before masking the error with a default.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q05](<Domanda per domanda/Q05.md>), [Q08](<Domanda per domanda/Q08.md>), [Q13](<Domanda per domanda/Q13.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 2 — PROTECT has distinct causes

**Example or flow:** A write fails with PROTECT. It could be targeting a database that is mounted read-only, or the current process could lack permission for the resource that protects the target database.

**Reasoning:** Find the database used by the current namespace mapping, then check mount mode and effective access. Adding a role can address a missing grant only when the database permits writes.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q07](<Domanda per domanda/Q07.md>), [Q12](<Domanda per domanda/Q12.md>).

### Panel 3 — Recursion and graph cycles differ

**Example or flow:** Three records point to each other: 1 to 2, 2 to 3, and 3 back to 1. A recursive walk can keep creating stack frames. A WHILE loop can repeat the same three nodes indefinitely without increasing stack depth.

**Reasoning:** Track visited record IDs. When the next ID was seen earlier, you have detected the cycle and can stop before processing that record again.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>), [Q15](<Domanda per domanda/Q15.md>), [Q16](<Domanda per domanda/Q16.md>), [Q17](<Domanda per domanda/Q17.md>).

### Panel 4 — Recheck at use time

**Example or flow:** A job stores a customer ID for later. By the time the job calls %OpenId(), the record may have been deleted. Check the returned reference and status before trying to read Email.

**Reasoning:** Validate the result where you need it. An ID that was valid when queued is historical information. The open call tells you whether the record can be used now.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q06](<Domanda per domanda/Q06.md>), [Q09](<Domanda per domanda/Q09.md>), [Q18](<Domanda per domanda/Q18.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

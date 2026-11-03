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

**Example or flow:** NEW total → scope change; SET total=0 → value exists

**Reasoning:** An accumulator needs an explicit initial value. A default that merely masks a typo is not a root-cause fix.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q05](<Domanda per domanda/Q05.md>), [Q08](<Domanda per domanda/Q08.md>), [Q13](<Domanda per domanda/Q13.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 2 — PROTECT has distinct causes

**Example or flow:** Missing resource privilege OR attempted write to read-only database

**Reasoning:** Check the database and access context. Granting a role does not itself change a read-only mount.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q07](<Domanda per domanda/Q07.md>), [Q12](<Domanda per domanda/Q12.md>).

### Panel 3 — Recursion and graph cycles differ

**Example or flow:** Recursive calls → growing stack; WHILE following 1→2→3→1 → repeated nodes

**Reasoning:** A visited-node set detects a cycle. A loop can be infinite without creating deeper stack frames.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>), [Q15](<Domanda per domanda/Q15.md>), [Q16](<Domanda per domanda/Q16.md>), [Q17](<Domanda per domanda/Q17.md>).

### Panel 4 — Recheck at use time

**Example or flow:** Stored customer ID → %OpenId → empty result? handle it before .Email

**Reasoning:** An old reference does not guarantee the record still exists. Validity at creation time is not validity at today's use.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q06](<Domanda per domanda/Q06.md>), [Q09](<Domanda per domanda/Q09.md>), [Q18](<Domanda per domanda/Q18.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

# T4.4 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Evaluation order, division and clocks

![T4.4 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Arithmetic trace

**Example or flow:** 10-2*3+1 → 8 → 24 → 25; 10-(2*3)+1 → 5

**Reasoning:** Parentheses define the intended grouping. The same symbols with a different grouping express a different formula.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q11](<Domanda per domanda/Q11.md>), [Q13](<Domanda per domanda/Q13.md>).

### Panel 2 — 2. Complete groups and remainder

**Example or flow:** 47 = 5×8 + 7; integer quotient 5; modulo remainder 7; 48 = 6×8 + 0

**Reasoning:** Quotient counts full groups; remainder gives what is left. Use symbolic groups rather than an inaccurate number of decorative boxes.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>).

### Panel 3 — 3. Three time roles

**Example or flow:** $HOROLOG: local day,seconds; $ZTIMESTAMP: UTC date/time with fractions; $ZHOROLOG: elapsed seconds since startup

**Reasoning:** Use a duration timer for code intervals. Midnight rollover makes naive second-of-day subtraction incorrect without the day.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>), [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q10](<Domanda per domanda/Q10.md>), [Q12](<Domanda per domanda/Q12.md>), [Q14](<Domanda per domanda/Q14.md>), [Q15](<Domanda per domanda/Q15.md>).

## Further insights: Arithmetic, buckets and time representations

![T4.4 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Parentheses express intent

**Example or flow:** 2+3*4 → 5*4 → 20; 2+(3*4) → 14

**Reasoning:** Trace the written arithmetic expression left to right outside parentheses. Do not import another language's precedence.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q11](<Domanda per domanda/Q11.md>), [Q13](<Domanda per domanda/Q13.md>).

### Panel 2 — Quotient versus remainder

**Example or flow:** 47 divided by 10: four full groups, remainder seven; offset 47 → page 5 for 1-based pages of 10

**Reasoning:** Clarify offset base and page base. Integer quotient and human page number are different values.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>).

### Panel 3 — Date is not full timestamp

**Example or flow:** $HOROLOG: day,seconds; extracting day+7 → a day number only

**Reasoning:** The numeric prefix trick does not preserve time of day. Make the conversion explicit.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>), [Q09](<Domanda per domanda/Q09.md>), [Q10](<Domanda per domanda/Q10.md>), [Q12](<Domanda per domanda/Q12.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 4 — Midnight is valid zero

**Example or flow:** 0 seconds since midnight → 00:00:00

**Reasoning:** A numerically false time value can be perfectly valid. A truth test does not establish whether the field was provided.

Related question analyses: [Q08](<Domanda per domanda/Q08.md>), [Q15](<Domanda per domanda/Q15.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

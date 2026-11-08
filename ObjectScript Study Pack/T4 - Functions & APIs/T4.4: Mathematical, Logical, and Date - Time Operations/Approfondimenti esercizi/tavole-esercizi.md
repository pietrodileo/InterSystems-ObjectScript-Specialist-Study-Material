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

**Example or flow:** Trace 2+3*4 in ObjectScript: add 2 and 3, then multiply by 4 to get 20. In 2+(3*4), the parentheses group the multiplication first, giving 14.

**Reasoning:** Work from left to right within each group. When the formula depends on a particular order, use parentheses to write that intent explicitly.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q11](<Domanda per domanda/Q11.md>), [Q13](<Domanda per domanda/Q13.md>).

### Panel 2 — Quotient versus remainder

**Example or flow:** With ten rows per page and a zero-based offset of 47, there are four full groups of ten before the row and seven more rows into its group. That places offset 47 on page 5 if page numbers start at 1.

**Reasoning:** Use the integer quotient for the number of full groups and the remainder for the position within a group. Check both numbering conventions before converting an offset into a page number.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>).

### Panel 3 — Date is not full timestamp

**Example or flow:** Suppose $HOROLOG contains 67000,45000. The first part is the day count and the second is the time of day in seconds. Adding seven to the extracted day gives 67007. It does not carry the 45000 seconds along.

**Reasoning:** Decide whether the result is a date or a full timestamp. If the time matters, keep it separately and reconstruct or format the result with both components.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>), [Q09](<Domanda per domanda/Q09.md>), [Q10](<Domanda per domanda/Q10.md>), [Q12](<Domanda per domanda/Q12.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 4 — Midnight is valid zero

**Example or flow:** One record specifies midnight and another leaves the time missing. Midnight is represented as zero seconds since the start of the day. A numeric truth test would skip that valid value.

**Reasoning:** Test presence using the field's actual missing-value rule, then format the time. Treat zero as a legitimate time when the field is present.

Related question analyses: [Q08](<Domanda per domanda/Q08.md>), [Q15](<Domanda per domanda/Q15.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

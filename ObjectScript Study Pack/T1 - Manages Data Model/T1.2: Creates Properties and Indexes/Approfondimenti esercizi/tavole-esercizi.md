# T1.2 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Constraints, index sets and large values

![T1.2 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Validate each constraint

**Example or flow:** Missing Name + Category=Toys → two violations; valid Price does not cancel them

**Reasoning:** Required, VALUELIST and numeric bounds are independent. Check %Status; do not rely on silent truncation.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q03](<Domanda per domanda/Q03.md>), [Q13](<Domanda per domanda/Q13.md>), [Q16](<Domanda per domanda/Q16.md>), [Q17](<Domanda per domanda/Q17.md>), [Q18](<Domanda per domanda/Q18.md>).

### Panel 2 — 2. Intersect candidate sets

**Example or flow:** Shipped IDs {1,3,5}; North IDs {3,4,5}; AND → {3,5}

**Reasoning:** Both predicates must hold for the same row. A COUNT-only plan may count the bitmap; fetching other columns can require record reads.

Related question analyses: [Q06](<Domanda per domanda/Q06.md>), [Q07](<Domanda per domanda/Q07.md>), [Q08](<Domanda per domanda/Q08.md>), [Q11](<Domanda per domanda/Q11.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 3 — 3. Choose the representation

**Example or flow:** Small bounded text → string; large text → Character stream; raw bytes → Binary stream

**Reasoning:** For derived values define read-time or maintained calculation. Trap: selecting a stream does not guarantee every compression setting.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q12](<Domanda per domanda/Q12.md>), [Q14](<Domanda per domanda/Q14.md>).

## Further insights: Constraints, defaults and derived values

![T1.2 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Independent constraints

**Example or flow:** Missing Name + Category=Toys → Required and VALUELIST violations

**Reasoning:** A valid Price does not compensate for two invalid properties. Check the save status rather than assuming assignments were accepted.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q03](<Domanda per domanda/Q03.md>), [Q16](<Domanda per domanda/Q16.md>).

### Panel 2 — Defaults are initial values

**Example or flow:** %New → Role=Viewer, LoginCount=0, CreatedAt=current time

**Reasoning:** Two objects created close together can share the same timestamp. Trap: creation time is not a uniqueness guarantee.

Related question analyses: [Q10](<Domanda per domanda/Q10.md>), [Q13](<Domanda per domanda/Q13.md>), [Q17](<Domanda per domanda/Q17.md>), [Q18](<Domanda per domanda/Q18.md>).

### Panel 3 — Virtual versus maintained

**Example or flow:** FullName: calculate on read; TotalAmount: maintain stored calculation

**Reasoning:** The formula is not the whole contract. Define when the value is recomputed and whether it is stored.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q12](<Domanda per domanda/Q12.md>).

### Panel 4 — Relationships and composite keys

**Example or flow:** Employee.DeptCode → Department; index (SensorId,ReadingTime)

**Reasoning:** A foreign key needs an existing parent. The composite index first narrows the sensor, then the time range.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>), [Q09](<Domanda per domanda/Q09.md>), [Q11](<Domanda per domanda/Q11.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

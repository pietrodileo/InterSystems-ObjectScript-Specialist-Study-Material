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

**Example or flow:** Suppose Name is required and Category accepts only Books or Tools. An item with no name, Category set to Toys, and Price set to 15 still has two invalid fields. Try correcting only the category and predict what validation will report next.

**Reasoning:** Check each constraint against its own property. Assigning values in memory does not prove the object can be saved. The validation or save status is where the caller checks the outcome.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q03](<Domanda per domanda/Q03.md>), [Q16](<Domanda per domanda/Q16.md>).

### Panel 2 — Defaults are initial values

**Example or flow:** Create two accounts without supplying a role or login count. Both start as Viewer with a count of zero. If CreatedAt is initialized from a clock, the two objects can also receive the same timestamp.

**Reasoning:** A default answers what value an object starts with. If an attribute must uniquely identify a row, enforce that requirement separately with an ID or a unique key.

Related question analyses: [Q10](<Domanda per domanda/Q10.md>), [Q13](<Domanda per domanda/Q13.md>), [Q17](<Domanda per domanda/Q17.md>), [Q18](<Domanda per domanda/Q18.md>).

### Panel 3 — Virtual versus maintained

**Example or flow:** Consider FullName, built from FirstName and LastName whenever you read it. Compare it with a stored TotalAmount calculated from quantity and unit price. Change quantity and ask when each reader, including SQL, will see the new total.

**Reasoning:** Two definitions can use the same formula and behave differently. For a stored result, inspect the events and fields that trigger recomputation. For a calculated value, check when the getter runs.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q12](<Domanda per domanda/Q12.md>).

### Panel 4 — Relationships and composite keys

**Example or flow:** An employee with DeptCode set to ENG needs a department that satisfies the foreign key. A separate query that filters one SensorId and reads a range of ReadingTime values can benefit from an index ordered by sensor and then time.

**Reasoning:** A foreign key checks the relationship between rows. A composite index arranges keys for lookup. Read its leading column first to see which part of the query can narrow the search.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>), [Q09](<Domanda per domanda/Q09.md>), [Q11](<Domanda per domanda/Q11.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

# T1.4 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: JSON types, aliases and stream cursors

![T1.4 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Parse context determines meaning

**Example or flow:** Ordinary ObjectScript: undefined variable true → error; JSON literal {"active":true} → boolean

**Reasoning:** JSON keywords belong to the JSON literal parser. A missing property is different from explicit null.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q03](<Domanda per domanda/Q03.md>), [Q07](<Domanda per domanda/Q07.md>).

### Panel 2 — 2. Shared zero-based array

**Example or flow:** obj.values and arr → SAME array [10,20,30]; arr.%Set(1,99) → [10,99,30]

**Reasoning:** Index 1 is the second element. Assigning an oref does not clone the array.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q12](<Domanda per domanda/Q12.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 3 — 3. Read position is separate from size

**Example or flow:** ABCDEF → Rewind → Read(3)=ABC → Read(3)=DEF; Size stays 6

**Reasoning:** Reads advance the cursor, not the total content size. Make Rewind explicit before a repeatable demonstration.

Related question analyses: [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>), [Q13](<Domanda per domanda/Q13.md>), [Q15](<Domanda per domanda/Q15.md>).

## Further insights: JSON and streams beyond the answer

![T1.4 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Iterator is a separate object

**Example or flow:** DynamicObject → %GetIterator() → iterator.%GetNext(.key,.value)

**Reasoning:** Call %GetNext on the iterator, not on the container. The cursor owns traversal state.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>).

### Panel 2 — Missing, null and empty

**Example or flow:** {} versus {"field":null} versus {"field":""}

**Reasoning:** Removing a property differs from setting it to null. The API contract decides whether a missing field means no change.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q03](<Domanda per domanda/Q03.md>), [Q07](<Domanda per domanda/Q07.md>), [Q12](<Domanda per domanda/Q12.md>).

### Panel 3 — Copy versus alias

**Example or flow:** File contents → CopyFrom → independent GlobalBinary; arr and obj.values → same array

**Reasoning:** Copying content separates lifetimes. Assigning an object reference preserves shared mutations.

Related question analyses: [Q06](<Domanda per domanda/Q06.md>), [Q09](<Domanda per domanda/Q09.md>), [Q13](<Domanda per domanda/Q13.md>).

### Panel 4 — Average needs a precondition

**Example or flow:** 85+92+78=255; count=3; average=85

**Reasoning:** For count=0, do not divide. Choose an explicit missing-data result or error instead of inventing an average.

Related question analyses: [Q11](<Domanda per domanda/Q11.md>), [Q14](<Domanda per domanda/Q14.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

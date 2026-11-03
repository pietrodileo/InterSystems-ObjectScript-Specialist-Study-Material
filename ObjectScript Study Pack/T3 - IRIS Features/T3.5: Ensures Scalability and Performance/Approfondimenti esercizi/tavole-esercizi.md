# T3.5 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Selectivity, benchmarks and evidence

![T3.5 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Candidate rows versus row reads

**Example or flow:** Selective index → candidate IDs → optional master-map reads for requested columns

**Reasoning:** Index filtering does not always cover the whole query. A common value matching 80% can favor a different plan from a rare value.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q09](<Domanda per domanda/Q09.md>), [Q11](<Domanda per domanda/Q11.md>), [Q14](<Domanda per domanda/Q14.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 2 — 2. Measure the whole result

**Example or flow:** A: execute 10 ms + fetch 90 ms =100 ms; B: execute 30 ms + fetch 20 ms =50 ms

**Reasoning:** Timing only execute would rank these backwards. Compare equivalent rows, transformations and cache conditions.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q06](<Domanda per domanda/Q06.md>), [Q10](<Domanda per domanda/Q10.md>).

### Panel 3 — 3. One hypothesis at a time

**Example or flow:** Observe → form hypothesis → change one relevant factor → measure result and cost

**Reasoning:** Keep warm/cold cache conditions separate. An added index also affects storage, build time and writes.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q07](<Domanda per domanda/Q07.md>), [Q08](<Domanda per domanda/Q08.md>), [Q12](<Domanda per domanda/Q12.md>), [Q13](<Domanda per domanda/Q13.md>).

## Further insights: Performance evidence and complete benchmarks

![T3.5 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — P99 is a clue

**Example or flow:** Slow tail → correlate compilation, locks, disk I/O and workload

**Reasoning:** A cache purge is one possible cause. A percentile alone does not establish the diagnosis.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>).

### Panel 2 — Measure through consumption

**Example or flow:** Prepare → execute → fetch → transform → user result

**Reasoning:** Timing only execute can omit work for a SELECT. Consume equivalent results in both benchmark variants.

Related question analyses: [Q06](<Domanda per domanda/Q06.md>), [Q10](<Domanda per domanda/Q10.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 3 — Skew changes useful plans

**Example or flow:** Average Status selectivity ≈33%; Active matches 80%

**Reasoning:** A frequent parameter can need a different access path from a rare value. Test representative distributions.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q11](<Domanda per domanda/Q11.md>).

### Panel 4 — Filter plus ordering

**Example or flow:** WHERE Status and ORDER BY Name → candidate index (Status,Name)

**Reasoning:** A composite index may serve both needs in a suitable query. Verify the plan and account for extra write cost.

Related question analyses: [Q05](<Domanda per domanda/Q05.md>), [Q07](<Domanda per domanda/Q07.md>), [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q12](<Domanda per domanda/Q12.md>), [Q13](<Domanda per domanda/Q13.md>), [Q14](<Domanda per domanda/Q14.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

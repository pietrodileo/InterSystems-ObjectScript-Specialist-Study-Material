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

**Example or flow:** A report usually returns in 50 ms, but its 99th percentile jumps after deployment. That number describes the slow tail. Check whether slow calls occurred alongside query compilation, lock waits, disk reads, or a change in workload.

**Reasoning:** Look for evidence from the slow calls themselves. If only the first execution after a cache purge is slow and it coincides with compilation, that supports a different diagnosis from repeated lock waits.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>).

### Panel 2 — Measure through consumption

**Example or flow:** Benchmark two SELECT statements that return the same data. If you stop the timer after execution starts, a statement can look fast even if it spends most of its time producing rows during fetch.

**Reasoning:** Time the work the caller waits for, including fetching and transforming the rows if those are part of the task. Confirm that both runs consume equivalent results before comparing them.

Related question analyses: [Q06](<Domanda per domanda/Q06.md>), [Q10](<Domanda per domanda/Q10.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 3 — Skew changes useful plans

**Example or flow:** Three statuses might suggest that each matches about a third of the table. In a real dataset, Active could match 80 percent while Failed matches 2 percent. A lookup for Failed can rule out far more rows.

**Reasoning:** Test common and rare inputs using representative data. The usefulness of an index depends on how many rows the filter eliminates and the cost of fetching the matches.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q11](<Domanda per domanda/Q11.md>).

### Panel 4 — Filter plus ordering

**Example or flow:** A query selects one Status and orders the matches by Name. An index on (Status, Name) groups rows first by status and then by name, so it may let the optimizer find that group and read it in the requested order.

**Reasoning:** Use Show Plan to see whether the query actually uses that access path or still sorts. Weigh the read benefit against the extra index maintenance on writes.

Related question analyses: [Q05](<Domanda per domanda/Q05.md>), [Q07](<Domanda per domanda/Q07.md>), [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q12](<Domanda per domanda/Q12.md>), [Q13](<Domanda per domanda/Q13.md>), [Q14](<Domanda per domanda/Q14.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

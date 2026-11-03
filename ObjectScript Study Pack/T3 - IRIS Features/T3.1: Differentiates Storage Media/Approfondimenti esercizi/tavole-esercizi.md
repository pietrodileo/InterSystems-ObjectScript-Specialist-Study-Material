# T3.1 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Visibility, lifetime and atomic operations

![T3.1 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Storage choices

**Example or flow:** PPG: private process workspace; shared temporary global: shared until temporary storage resets; durable global: persistent database

**Reasoning:** Visibility and lifetime are separate axes. Mapping determines the physical database; names alone are not guarantees.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q08](<Domanda per domanda/Q08.md>), [Q13](<Domanda per domanda/Q13.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 2 — 2. Process versus session

**Example or flow:** One browser session → request A/process 1 and request B/process 2 → different PPGs

**Reasoning:** A process-private workspace is not cross-request session storage. Same process can also outlive one request.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q10](<Domanda per domanda/Q10.md>), [Q12](<Domanda per domanda/Q12.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 3 — 3. Counter versus operation

**Example or flow:** Atomic $INCREMENT allocates a number → separate payload write

**Reasoning:** A unique allocated key does not make the entire operation atomic. Gaps are possible if the producer stops before writing data.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>), [Q09](<Domanda per domanda/Q09.md>), [Q11](<Domanda per domanda/Q11.md>).

## Further insights: Storage lifetime and counter races

![T3.1 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Four decisions

**Example or flow:** Who can see it? How long does it last? How is it recovered? Where is it mapped?

**Reasoning:** Names alone do not establish durability or journaling. Inspect the container and database mapping.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q11](<Domanda per domanda/Q11.md>), [Q13](<Domanda per domanda/Q13.md>), [Q14](<Domanda per domanda/Q14.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 2 — Process is not web session

**Example or flow:** Request A → process 1; request B → process 2; their PPGs are separate

**Reasoning:** A PPG follows its process, not the browser session. Reusing a session ID does not overcome process isolation.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q12](<Domanda per domanda/Q12.md>).

### Panel 3 — Allocation versus queue entry

**Example or flow:** Atomic $INCREMENT → allocate key → write payload

**Reasoning:** A crash between allocation and payload can leave a gap. Allocation alone does not implement reliable queue consumption.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>).

### Panel 4 — Avoid writing a stale counter back

**Example or flow:** A obtains 1; B obtains 2; A later writes 1 back → counter regresses

**Reasoning:** Keep the increment result in a local variable. A separate later write to the shared counter can overwrite a newer value.

Related question analyses: [Q10](<Domanda per domanda/Q10.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

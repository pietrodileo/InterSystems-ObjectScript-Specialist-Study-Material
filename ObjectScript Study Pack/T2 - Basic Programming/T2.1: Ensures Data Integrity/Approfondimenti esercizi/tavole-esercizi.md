# T2.1 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Transaction levels and cooperative locks

![T2.1 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Track transaction levels

**Example or flow:** Outer TSTART: status; inner TSTART: total and items; TROLLBACK 1 removes inner changes; notes then outer commit

**Reasoning:** Only status and notes remain in this example. Inner commit is not an independent transaction.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q14](<Domanda per domanda/Q14.md>), [Q15](<Domanda per domanda/Q15.md>), [Q18](<Domanda per domanda/Q18.md>).

### Panel 2 — 2. Locks and atomicity are different

**Example or flow:** A holds a lock; B requests the conflicting lock → waits; alternative B bypasses LOCK → direct write can proceed

**Reasoning:** Locks are cooperative. Transactions group changes; neither mechanism replaces the other. Draw these as alternative paths, not one sequence.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q07](<Domanda per domanda/Q07.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>), [Q16](<Domanda per domanda/Q16.md>).

### Panel 3 — 3. Simple LOCK replaces the set

**Example or flow:** LOCK +Order(1) → {1}; +Order(2) → {1,2}; simple LOCK Order(3) → {3}

**Reasoning:** Incremental locks add to the current set. A simple LOCK releases previous locks and acquires the requested set.

Related question analyses: [Q12](<Domanda per domanda/Q12.md>), [Q13](<Domanda per domanda/Q13.md>).

## Further insights: Transactions and incomplete error handling

![T2.1 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Version check race

**Example or flow:** A and B both read v=7 before either writes; both pass separate checks

**Reasoning:** A check followed by a separate write is not atomic. Use a suitable atomic conditional update or a coherent protected section.

Related question analyses: [Q10](<Domanda per domanda/Q10.md>).

### Panel 2 — Rollback is not success

**Example or flow:** Error → rollback changes → report failure

**Reasoning:** Restoring data does not complete the requested operation. Trap: returning OK after the catch hides the failure.

Related question analyses: [Q11](<Domanda per domanda/Q11.md>), [Q18](<Domanda per domanda/Q18.md>).

### Panel 3 — Nested levels

**Example or flow:** 0 → TSTART → 1 → TSTART → 2 → TCOMMIT → 1 → TCOMMIT → 0

**Reasoning:** The inner commit is not an independent durable commit. Full rollback may also undo the caller's transaction.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q14](<Domanda per domanda/Q14.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 4 — No-wait lock attempt

**Example or flow:** Timeout 0 → $TEST=1 acquired; $TEST=0 unavailable

**Reasoning:** Do not write on the failure branch. Retry through another acquisition attempt or report busy.

Related question analyses: [Q06](<Domanda per domanda/Q06.md>), [Q07](<Domanda per domanda/Q07.md>), [Q16](<Domanda per domanda/Q16.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

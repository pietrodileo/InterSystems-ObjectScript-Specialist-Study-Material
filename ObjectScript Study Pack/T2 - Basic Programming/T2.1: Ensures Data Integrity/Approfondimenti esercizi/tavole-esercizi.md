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

**Example or flow:** Two workers read version 7 of the same order. Both compare it with their expected version of 7 and pass. If each then writes separately, the second can overwrite the first even though both checked the version.

**Reasoning:** Make the comparison and the write one operation. For example, update the row only where its version is still 7, bump the version in that update, and check whether a row was affected.

Related question analyses: [Q10](<Domanda per domanda/Q10.md>).

### Panel 2 — Rollback is not success

**Example or flow:** A checkout writes an order and then fails to write its receipt. The error path rolls back the order. If it reports success afterward, the caller can show a confirmation for a checkout that never completed.

**Reasoning:** Track the state of the data and the outcome reported to the caller separately. After rollback, return the error status or propagate the exception according to the method's contract.

Related question analyses: [Q11](<Domanda per domanda/Q11.md>), [Q18](<Domanda per domanda/Q18.md>).

### Panel 3 — Nested levels

**Example or flow:** Start at $TLEVEL 0 and issue TSTART twice. The level is now 2. One TCOMMIT takes it back to 1, and another takes it to 0. A rollback before the outer commit can still undo work from the inner block.

**Reasoning:** Record the level on entry before opening a transaction inside a helper. A full rollback may undo the caller's work as well. Decide which level your method owns.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q14](<Domanda per domanda/Q14.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 4 — No-wait lock attempt

**Example or flow:** One worker holds the lock for order 42. Another issues LOCK +^TutorOrder(42):0 and checks $TEST immediately. In this simple conflict it gets 0. If the lock is available it gets 1 and can enter the protected section.

**Reasoning:** Branch on $TEST before touching the protected data. When the acquisition fails, report that the order is busy or retry the lock. Release a successful acquisition when the protected work ends.

Related question analyses: [Q06](<Domanda per domanda/Q06.md>), [Q07](<Domanda per domanda/Q07.md>), [Q16](<Domanda per domanda/Q16.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

# T5.2 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Statuses, exceptions and propagation

![T5.2 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Two failure channels

**Example or flow:** Method returns error %Status → caller tests it; method throws exception → CATCH runs

**Reasoning:** Returning an error is not throwing it. ThrowOnError explicitly bridges an error status to a StatusException.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q04](<Domanda per domanda/Q04.md>), [Q06](<Domanda per domanda/Q06.md>), [Q07](<Domanda per domanda/Q07.md>), [Q09](<Domanda per domanda/Q09.md>), [Q11](<Domanda per domanda/Q11.md>), [Q16](<Domanda per domanda/Q16.md>).

### Panel 2 — 2. Logging is not recovery

**Example or flow:** Caught known recoverable case → handle it; otherwise log useful context → propagate failure

**Reasoning:** Do not return OK merely because an exception was recorded. Exception details and available stack context describe different aspects of the failure.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q05](<Domanda per domanda/Q05.md>), [Q08](<Domanda per domanda/Q08.md>), [Q10](<Domanda per domanda/Q10.md>), [Q12](<Domanda per domanda/Q12.md>), [Q13](<Domanda per domanda/Q13.md>), [Q17](<Domanda per domanda/Q17.md>), [Q18](<Domanda per domanda/Q18.md>).

### Panel 3 — 3. Structured errors and presentation

**Example or flow:** Multiple statuses → ADDSC compound status → DecomposeStatus individual messages → GetErrorText readable text

**Reasoning:** Keep the structured status for propagation. Human-readable text is for reporting, not a replacement for the error contract.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q14](<Domanda per domanda/Q14.md>), [Q15](<Domanda per domanda/Q15.md>).

## Further insights: Error contracts and diagnostic context

![T5.2 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — A returned status is not a thrown exception

**Example or flow:** Returned error %Status → explicit test; thrown exception → CATCH

**Reasoning:** TRY does not convert a returned status into a thrown exception. Use the documented bridge when the contract requires it.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q04](<Domanda per domanda/Q04.md>), [Q06](<Domanda per domanda/Q06.md>), [Q07](<Domanda per domanda/Q07.md>), [Q09](<Domanda per domanda/Q09.md>), [Q11](<Domanda per domanda/Q11.md>), [Q16](<Domanda per domanda/Q16.md>).

### Panel 2 — Aggregate only independent failures

**Example or flow:** Customers failed → can Orders still run safely?

**Reasoning:** ADDSC collects errors, but it does not satisfy failed prerequisites. Define whether later steps can proceed.

Related question analyses: [Q10](<Domanda per domanda/Q10.md>), [Q14](<Domanda per domanda/Q14.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 3 — Compiled location is not source line number

**Example or flow:** Location: label+offset^routine → map to the correct compiled version

**Reasoning:** The offset is not automatically a line in today's edited source file. Preserve the relevant version context.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q12](<Domanda per domanda/Q12.md>).

### Panel 4 — Timestamp belongs to logging context

**Example or flow:** Exception Name,Code,Data,Location + explicit log time and correlation

**Reasoning:** Do not invent Timestamp or Severity properties on the base exception. Interpret the stack in its actual error-handling context.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q05](<Domanda per domanda/Q05.md>), [Q08](<Domanda per domanda/Q08.md>), [Q13](<Domanda per domanda/Q13.md>), [Q17](<Domanda per domanda/Q17.md>), [Q18](<Domanda per domanda/Q18.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

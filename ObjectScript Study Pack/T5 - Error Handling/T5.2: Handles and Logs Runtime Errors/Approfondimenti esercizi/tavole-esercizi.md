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

**Example or flow:** A method inside TRY returns an error %Status. Control continues to the next statement unless your code checks the status or explicitly turns it into an exception. A thrown exception transfers control to CATCH.

**Reasoning:** Find out how the called API reports failure before writing the handler. Check a returned status directly or use the documented conversion if the caller handles exceptions.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q04](<Domanda per domanda/Q04.md>), [Q06](<Domanda per domanda/Q06.md>), [Q07](<Domanda per domanda/Q07.md>), [Q09](<Domanda per domanda/Q09.md>), [Q11](<Domanda per domanda/Q11.md>), [Q16](<Domanda per domanda/Q16.md>).

### Panel 2 — Aggregate only independent failures

**Example or flow:** An import can validate independent rows and combine their error statuses with $$$ADDSC. If the customer import failed and the order import needs the new customer IDs, running the dependent step can produce misleading follow-up errors.

**Reasoning:** Check prerequisites before continuing. Combine errors from steps that can run independently, and stop or skip the steps whose inputs were never produced.

Related question analyses: [Q10](<Domanda per domanda/Q10.md>), [Q14](<Domanda per domanda/Q14.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 3 — Compiled location is not source line number

**Example or flow:** An exception points to a label plus an offset in a compiled routine. The source was edited after the failing version was built, so the same number in today's file can point to unrelated code.

**Reasoning:** Match the routine and offset to the deployed build first. Keep build information alongside the error so you can map it back to the right source version.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q12](<Domanda per domanda/Q12.md>).

### Panel 4 — Timestamp belongs to logging context

**Example or flow:** An exception describes the failure and its location. When logging it, the application adds the time and a request ID so another developer can find the failure among events from concurrent requests.

**Reasoning:** Read exception details from the exception API. Supply contextual fields such as time, request ID, or severity through your logging code, and use the recorded context when interpreting the stack.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q05](<Domanda per domanda/Q05.md>), [Q08](<Domanda per domanda/Q08.md>), [Q13](<Domanda per domanda/Q13.md>), [Q17](<Domanda per domanda/Q17.md>), [Q18](<Domanda per domanda/Q18.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

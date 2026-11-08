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

### Panel 1 — Choosing where to store a value

**Example or flow:** Imagine storing a request counter, a scratch result shared by workers, and an audit record. Ask who needs to read each value, how long it must last, what should happen after a restart, and which database actually stores it.

**Reasoning:** A process-private global can hold a counter for one process. A temporary global mapped to IRISTEMP can let several processes share scratch data. For an audit record, verify that the mapping and journaling settings meet the recovery requirement.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q11](<Domanda per domanda/Q11.md>), [Q13](<Domanda per domanda/Q13.md>), [Q14](<Domanda per domanda/Q14.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 2 — A browser session can span multiple IRIS processes

**Example or flow:** A shopper adds an item in one request, handled by IRIS process 1. The code writes it to `^||TutorCart` using the browser's session ID as a subscript. The next request carries the same session ID but lands on process 2. That process looks in its own `^||TutorCart` and sees no item.

**Reasoning:** A process-private global (PPG) belongs to the IRIS process running the code. The session ID only chooses a node inside that process's copy. For a cart that must follow the shopper across requests, use the web framework's session store or another store that both processes can access.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q12](<Domanda per domanda/Q12.md>).

### Panel 3 — A reserved queue ID can have no message

**Example or flow:** A producer calls `$INCREMENT` on a shared counter and gets 42. It stops before writing the message at key 42. The next producer gets 43 and writes its message. A consumer can now see entry 43 with no entry 42.

**Reasoning:** The increment makes number allocation atomic. Writing the payload is a separate operation. A queue consumer must look for actual entries and follow the queue's claim and retry rules instead of assuming every reserved key contains a message.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>).

### Panel 4 — Avoid writing a stale counter back

**Example or flow:** Worker A increments the shared counter and saves 1 in a local variable. Worker B increments it and gets 2. If A later copies its local 1 back to the counter, the next increment can return 2 again.

**Reasoning:** `$INCREMENT` already writes the new value to the counter. Keep the returned value as the ID for A's own payload. Writing it back separately discards B's update.

Related question analyses: [Q10](<Domanda per domanda/Q10.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

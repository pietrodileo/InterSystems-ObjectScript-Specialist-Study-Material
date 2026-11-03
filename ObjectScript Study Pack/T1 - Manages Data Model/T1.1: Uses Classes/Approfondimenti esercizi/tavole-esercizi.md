# T1.1 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Storage, identity and save results

![T1.1 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Follow the storage map

**Example or flow:** BME → explicit Location ^EW3K.DuIo.3 → namespace mapping → database destination

**Reasoning:** The index name finds its explicit location. The global name does not identify the database without resolving mappings. Trap: do not guess a global suffix.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>), [Q16](<Domanda per domanda/Q16.md>).

### Panel 2 — 2. Business key, ID and count

**Example or flow:** MessageId=JTE810 → unique MIIdx lookup → illustrative internal ID=42 → record; IDs {1,2,8}: count=3, maximum=8

**Reasoning:** The API must receive the kind of identity it expects. Missing IDs do not prove deletion, and the ID counter is not COUNT(*).

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q05](<Domanda per domanda/Q05.md>), [Q18](<Domanda per domanda/Q18.md>).

### Panel 3 — 3. Different return contracts

**Example or flow:** %New → in-memory oref; %Save → %Status → check success/error

**Reasoning:** Creating an object is separate from saving it. A successful save inside an outer transaction is not that transaction's final commit.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q06](<Domanda per domanda/Q06.md>), [Q09](<Domanda per domanda/Q09.md>), [Q12](<Domanda per domanda/Q12.md>), [Q14](<Domanda per domanda/Q14.md>).

## Further insights: Inheritance, construction and contracts

![T1.1 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Inherited behavior

**Example or flow:** Truck + Vehicle → PickupTruck

**Reasoning:** The subclass inherits properties and behavior. A local override supplies the chosen implementation. Trap: inherited state is not limited to locally declared properties.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 2 — Creation and persistence

**Example or flow:** %New → %OnNew → in-memory oref; successful %Save → %Status

**Reasoning:** Construction initializes the object. It does not alone create a saved row. An outer transaction still needs its own commit.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q06](<Domanda per domanda/Q06.md>), [Q09](<Domanda per domanda/Q09.md>), [Q12](<Domanda per domanda/Q12.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 3 — Deletion semantics

**Example or flow:** %DeleteExtent: deletes instances with the callbacks defined by its contract

**Reasoning:** Choose according to required application effects. Trap: deleting rows is different from dropping the table definition. Do not invent callback ordering.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>).

### Panel 4 — Utilities and documentation

**Example or flow:** ClassMethod: no implicit instance; ///: member description

**Reasoning:** A stateless helper needs no persistence. Documentation belongs with the declaration and explains inputs, outputs and constraints.

Related question analyses: [Q08](<Domanda per domanda/Q08.md>), [Q17](<Domanda per domanda/Q17.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

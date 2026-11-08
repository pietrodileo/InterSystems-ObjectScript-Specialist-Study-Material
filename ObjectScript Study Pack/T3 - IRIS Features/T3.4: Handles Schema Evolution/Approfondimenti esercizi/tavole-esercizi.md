# T3.4 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Schema, derived data and plans

![T3.4 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Rename is not migration

**Example or flow:** Existing Name data in slot 2; new FullName mapped to slot 4 → appears empty

**Reasoning:** Read the actual storage map. Reuse a compatible mapping or migrate data deliberately; compilation alone does not move old values.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q10](<Domanda per domanda/Q10.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 2 — 2. Index lifecycle

**Example or flow:** Define → compile → populate existing data → verify coherent/selectable index

**Reasoning:** New type or collation needs matching index data. A definition is not evidence of a successful build.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q07](<Domanda per domanda/Q07.md>), [Q08](<Domanda per domanda/Q08.md>), [Q11](<Domanda per domanda/Q11.md>), [Q12](<Domanda per domanda/Q12.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 3 — 3. Plan lifecycle

**Example or flow:** New statistics or index → possible new optimization; frozen plan → retained choice

**Reasoning:** Cache invalidation and freezing are distinct. TUNE TABLE may recompile dependent queries when statistics change; do not purge by ritual.

Related question analyses: [Q09](<Domanda per domanda/Q09.md>), [Q13](<Domanda per domanda/Q13.md>), [Q16](<Domanda per domanda/Q16.md>), [Q17](<Domanda per domanda/Q17.md>).

## Further insights: Schema changes and existing data

![T3.4 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — New defaults versus old rows

**Example or flow:** Add Status with an InitialExpression of Draft to a class that already has stored invoices. A new object starts as Draft. An invoice created before the change has no stored value in the new slot unless the migration supplies one.

**Reasoning:** Treat a creation default and a data backfill as separate decisions. If old invoices should be classified as Draft, plan how to populate them and check the result on a sample of old rows.

Related question analyses: [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q10](<Domanda per domanda/Q10.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 2 — Rename and storage slot

**Example or flow:** Suppose old values for Name live in storage slot 2. After renaming the property to FullName, inspect the compiled storage definition. If FullName reads a different slot, the existing value in slot 2 may no longer appear through that property.

**Reasoning:** Follow the property to its storage slot before and after the change. A successful compile checks the new definition. Verifying a known old record tells you whether it still reads the intended data.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 3 — Index representation matters

**Example or flow:** An index on Name currently stores keys using one collation. A change to the collation can make the generated keys differ even when the index still has the same name. Rows written before and after the change must be represented consistently.

**Reasoning:** Check what the index rebuild needs and when the application can use the rebuilt index. Confirm that lookups find records written before the change as well as new records.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q07](<Domanda per domanda/Q07.md>), [Q08](<Domanda per domanda/Q08.md>), [Q11](<Domanda per domanda/Q11.md>), [Q12](<Domanda per domanda/Q12.md>).

### Panel 4 — Statistics, cache and frozen plans

**Example or flow:** Collect updated statistics after loading a representative batch. A query that depends on the table may be recompiled, while a frozen plan needs to be considered separately. Inspect the plan the query actually uses after the change.

**Reasoning:** Verify which queries were invalidated and whether the access path changed before purging cached plans. The effect depends on the change and the plan's configuration.

Related question analyses: [Q09](<Domanda per domanda/Q09.md>), [Q13](<Domanda per domanda/Q13.md>), [Q16](<Domanda per domanda/Q16.md>), [Q17](<Domanda per domanda/Q17.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

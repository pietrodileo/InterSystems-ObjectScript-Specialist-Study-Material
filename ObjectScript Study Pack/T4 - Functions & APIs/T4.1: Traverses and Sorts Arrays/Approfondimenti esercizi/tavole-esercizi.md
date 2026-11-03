# T4.1 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Array order, node state and traversal

![T4.1 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Keys choose the order

**Example or flow:** arr(1)=A, arr(2)=D, arr(3)=B, arr(10)=C → keys 1,2,3,10 → output ADBC

**Reasoning:** $ORDER traverses subscripts, not values or insertion order. Do not alphabetize the letters to solve the loop.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q03](<Domanda per domanda/Q03.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q08](<Domanda per domanda/Q08.md>), [Q10](<Domanda per domanda/Q10.md>), [Q13](<Domanda per domanda/Q13.md>), [Q18](<Domanda per domanda/Q18.md>).

### Panel 2 — 2. Parent state and safe defaults

**Example or flow:** warehouse has value Main and children aisle1,aisle2 → $DATA(parent)=11; each leaf with a value → 1

**Reasoning:** Children alone would give parent state 10. $GET(timeout,30) returns a default without writing it to the node.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q09](<Domanda per domanda/Q09.md>), [Q12](<Domanda per domanda/Q12.md>), [Q14](<Domanda per domanda/Q14.md>), [Q17](<Domanda per domanda/Q17.md>).

### Panel 3 — 3. Guard the sentinel

**Example or flow:** Advance → test empty-string end marker → only then read; reset inner cursor for each outer branch

**Reasoning:** Zero can be a valid key. The end test must happen before dereferencing the result of traversal.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q07](<Domanda per domanda/Q07.md>), [Q11](<Domanda per domanda/Q11.md>), [Q15](<Domanda per domanda/Q15.md>), [Q16](<Domanda per domanda/Q16.md>).

## Further insights: Keys, branches and safe traversal

![T4.1 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Zero is a valid key

**Example or flow:** Numeric keys -3,-1,0,2 are visited in that order

**Reasoning:** Do not terminate a loop with a generic numeric false test on the key. Compare against the documented empty-string sentinel.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q03](<Domanda per domanda/Q03.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q08](<Domanda per domanda/Q08.md>), [Q10](<Domanda per domanda/Q10.md>), [Q13](<Domanda per domanda/Q13.md>), [Q18](<Domanda per domanda/Q18.md>).

### Panel 2 — Two levels need two cursors

**Example or flow:** Outer key selects branch → reset inner cursor → visit that branch's children

**Reasoning:** Leaving the inner cursor at its old position can skip children in the next branch.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q16](<Domanda per domanda/Q16.md>).

### Panel 3 — Default is not a write

**Example or flow:** $GET(node,30) → value 30 when node has no value

**Reasoning:** The returned default does not create the node. $DATA(node)#2 tests value presence; # is modulo.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q09](<Domanda per domanda/Q09.md>), [Q12](<Domanda per domanda/Q12.md>), [Q14](<Domanda per domanda/Q14.md>), [Q17](<Domanda per domanda/Q17.md>).

### Panel 4 — Read only after the end test

**Example or flow:** Advance key → key empty? stop : read value

**Reasoning:** Using the end sentinel as a data key is a control-flow mistake, even if a configuration permits null subscripts.

Related question analyses: [Q11](<Domanda per domanda/Q11.md>), [Q15](<Domanda per domanda/Q15.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

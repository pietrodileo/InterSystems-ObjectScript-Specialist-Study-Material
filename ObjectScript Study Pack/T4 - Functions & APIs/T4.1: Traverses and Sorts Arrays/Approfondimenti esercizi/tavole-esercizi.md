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

**Example or flow:** An array has numeric keys -3, -1, 0, and 2. A forward $ORDER walk visits 0 after -1. If the loop quits whenever the key evaluates to false, it stops there and misses both 0 and 2.

**Reasoning:** Compare the returned key with the empty-string end marker. A numeric zero is a valid subscript and must survive that test.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q03](<Domanda per domanda/Q03.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q08](<Domanda per domanda/Q08.md>), [Q10](<Domanda per domanda/Q10.md>), [Q13](<Domanda per domanda/Q13.md>), [Q18](<Domanda per domanda/Q18.md>).

### Panel 2 — Two levels need two cursors

**Example or flow:** Walk stock(region,item) for two regions. For north, the inner loop visits that region's items. When the outer cursor moves to south, initialize the item cursor before taking its first step.

**Reasoning:** Each $ORDER call advances one subscript level. Reset the inner cursor for every branch so that it starts from the beginning regardless of where the previous branch ended.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q16](<Domanda per domanda/Q16.md>).

### Panel 3 — Default is not a write

**Example or flow:** If limit("daily") has no value, $GET(limit("daily"),30) returns 30. Now check $DATA(limit("daily")) again. A completely absent node is still absent, and a node with only children still has no value.

**Reasoning:** Use $GET to supply a read-time default. If you need the value stored, assign it explicitly. To check whether a value is present, $DATA(node)#2 isolates the value flag.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q09](<Domanda per domanda/Q09.md>), [Q12](<Domanda per domanda/Q12.md>), [Q14](<Domanda per domanda/Q14.md>), [Q17](<Domanda per domanda/Q17.md>).

### Panel 4 — Read only after the end test

**Example or flow:** An empty array returns the empty string on the first $ORDER call. A nonempty array returns it after the last key. If you read array(key) first, the code attempts to use that marker as a subscript.

**Reasoning:** Use the same order on every pass: advance, check the marker, then read. An array that permits an empty subscript still needs a traversal that treats the documented return value correctly.

Related question analyses: [Q11](<Domanda per domanda/Q11.md>), [Q15](<Domanda per domanda/Q15.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

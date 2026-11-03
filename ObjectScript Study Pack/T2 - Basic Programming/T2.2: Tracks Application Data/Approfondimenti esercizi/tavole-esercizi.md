# T2.2 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Node values, log lifetime and timing

![T2.2 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Two independent node properties

**Example or flow:** No value/no children:0; value only:1; children only:10; value and children:11

**Reasoning:** A parent with only children is not directly readable as a value. Use $DATA(node)#2 to test value presence; # is modulo.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q11](<Domanda per domanda/Q11.md>).

### Panel 2 — 2. Match logging lifetime

**Example or flow:** Counter → entry identity; timestamp → time; PPG → process lifetime; durable audit → durable storage

**Reasoning:** An ID is not a timestamp. A process-private log disappears when the process ends.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q07](<Domanda per domanda/Q07.md>), [Q12](<Domanda per domanda/Q12.md>).

### Panel 3 — 3. Measure the right quantity

**Example or flow:** Elapsed=2.5 seconds across 100 operations → 0.025 seconds=25 ms average

**Reasoning:** Use $ZHOROLOG differences for elapsed timing. Logical references, disk I/O and duration describe different quantities.

Related question analyses: [Q10](<Domanda per domanda/Q10.md>), [Q13](<Domanda per domanda/Q13.md>), [Q14](<Domanda per domanda/Q14.md>), [Q15](<Domanda per domanda/Q15.md>).

## Further insights: From observations to a diagnosis

![T2.2 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — A branch is not a value

**Example or flow:** Phone has children but no value → $DATA=10; add a value → 11

**Reasoning:** Descendants alone do not make the parent readable as a value. Trap: nonzero $DATA does not always mean a value exists.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q11](<Domanda per domanda/Q11.md>).

### Panel 2 — Three log concepts

**Example or flow:** Counter → key; timestamp → time; payload → message

**Reasoning:** Allocating a key does not write the entry. An interruption before the payload can leave a gap.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q07](<Domanda per domanda/Q07.md>), [Q12](<Domanda per domanda/Q12.md>).

### Panel 3 — Measure the interval

**Example or flow:** References before=1000; after=1300; difference=300

**Reasoning:** A cumulative counter does not describe the last operation by itself. Logical references and disk reads are different metrics.

Related question analyses: [Q10](<Domanda per domanda/Q10.md>), [Q13](<Domanda per domanda/Q13.md>).

### Panel 4 — Choose the lens

**Example or flow:** Timer: elapsed duration; line monitor: hot code; SQL tools: query work

**Reasoning:** An event log does not replace performance measurements. Select the tool according to the question.

Related question analyses: [Q14](<Domanda per domanda/Q14.md>), [Q15](<Domanda per domanda/Q15.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

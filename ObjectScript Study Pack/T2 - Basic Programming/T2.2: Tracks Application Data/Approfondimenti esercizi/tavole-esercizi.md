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

**Example or flow:** Store an extension under contact("phone","ext") without setting contact("phone"). The parent now has children and $DATA returns 10. Assign a main number to contact("phone") and $DATA returns 11.

**Reasoning:** If you need to read the parent value, check $DATA(node)#2. Taking the remainder after division by two isolates the value flag. Both 1 and 11 pass that test.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q11](<Domanda per domanda/Q11.md>).

### Panel 2 — Three log concepts

**Example or flow:** A worker reserves key 42, reads the clock, and intends to store a record saying Job accepted. If it stops after reserving the key, the next entry can have key 43 while entry 42 is absent.

**Reasoning:** The key identifies an entry, the timestamp places it in time, and the payload describes the event. Read the entry itself to check whether the record was written.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q07](<Domanda per domanda/Q07.md>), [Q12](<Domanda per domanda/Q12.md>).

### Panel 3 — Measure the interval

**Example or flow:** A process has made 1,000 logical references before a lookup and 1,300 afterward. The lookup interval accounts for 300 references, assuming no unrelated work ran in that interval.

**Reasoning:** Take both readings around the same piece of work. Logical references count accesses at a different layer from physical reads. A cache hit can satisfy a reference without a disk read.

Related question analyses: [Q10](<Domanda per domanda/Q10.md>), [Q13](<Domanda per domanda/Q13.md>).

### Panel 4 — Choose the lens

**Example or flow:** Users say that opening a report feels slow. A timer tells you whether the report took 100 ms or 5 seconds. Line monitoring points to the busy code, and a SQL plan or runtime measurement can show how the query finds rows.

**Reasoning:** Start with the question you need answered. A log can tell you when the report ran and whether it failed. Use timing and profiling to find where it spent time.

Related question analyses: [Q14](<Domanda per domanda/Q14.md>), [Q15](<Domanda per domanda/Q15.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

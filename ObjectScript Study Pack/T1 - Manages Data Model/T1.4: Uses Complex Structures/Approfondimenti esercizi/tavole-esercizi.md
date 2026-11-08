# T1.4 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: JSON types, aliases and stream cursors

![T1.4 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Parse context determines meaning

**Example or flow:** Ordinary ObjectScript: undefined variable true → error; JSON literal {"active":true} → boolean

**Reasoning:** JSON keywords belong to the JSON literal parser. A missing property is different from explicit null.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q03](<Domanda per domanda/Q03.md>), [Q07](<Domanda per domanda/Q07.md>).

### Panel 2 — 2. Shared zero-based array

**Example or flow:** obj.values and arr → SAME array [10,20,30]; arr.%Set(1,99) → [10,99,30]

**Reasoning:** Index 1 is the second element. Assigning an oref does not clone the array.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q12](<Domanda per domanda/Q12.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 3 — 3. Read position is separate from size

**Example or flow:** ABCDEF → Rewind → Read(3)=ABC → Read(3)=DEF; Size stays 6

**Reasoning:** Reads advance the cursor, not the total content size. Make Rewind explicit before a repeatable demonstration.

Related question analyses: [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>), [Q13](<Domanda per domanda/Q13.md>), [Q15](<Domanda per domanda/Q15.md>).

## Further insights: JSON and streams beyond the answer

![T1.4 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Iterator is a separate object

**Example or flow:** Take a dynamic object with a name and a city. Call %GetIterator() once, then use %GetNext(.key,.value) on the returned iterator to visit both entries. The iterator advances with each call.

**Reasoning:** Keep the reference to the iterator for the duration of the loop. Creating a new iterator on each pass restarts the traversal instead of continuing it.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>).

### Panel 2 — Missing, null and empty

**Example or flow:** Consider three JSON update requests: {}, {"field":null}, and {"field":""}. Under a patch contract the first can mean leave the field alone, the second can mean clear it, and the third can mean store a zero-length string.

**Reasoning:** Check whether the key exists before interpreting its value. The three representations are distinct in JSON, but the update rules belong to the application contract.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q03](<Domanda per domanda/Q03.md>), [Q07](<Domanda per domanda/Q07.md>), [Q12](<Domanda per domanda/Q12.md>).

### Panel 3 — Copy versus alias

**Example or flow:** Copy the contents of a file stream into a separate global binary stream. The destination has its own copy of the bytes. Now assign an array reference to another variable and change an element through the new variable. The original reference sees the change.

**Reasoning:** Ask whether the operation copied data or copied a reference. That tells you whether a later mutation is shared and whether the data can outlive the original source.

Related question analyses: [Q06](<Domanda per domanda/Q06.md>), [Q09](<Domanda per domanda/Q09.md>), [Q13](<Domanda per domanda/Q13.md>).

### Panel 4 — Average needs a precondition

**Example or flow:** With scores 85, 92, and 78, the sum is 255 and the count is three. The average is 85. Now run the same logic on an empty input: the sum and count are both zero, so there is no quotient to report.

**Reasoning:** Check the count before dividing. Returning zero would describe an actual measured average. Use a missing result or an error if that is how the caller handles an empty input.

Related question analyses: [Q11](<Domanda per domanda/Q11.md>), [Q14](<Domanda per domanda/Q14.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

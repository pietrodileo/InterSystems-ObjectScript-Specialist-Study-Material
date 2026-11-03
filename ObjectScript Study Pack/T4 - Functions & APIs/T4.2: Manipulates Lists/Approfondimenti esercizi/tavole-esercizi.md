# T4.2 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Missing elements, cursors and delimiters

![T4.2 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Three different cases

**Example or flow:** $LB("A",,"C"): omitted position 2 → LISTGET default; $LB("A","","C"): explicit empty → empty; beyond list → default

**Reasoning:** An omitted element differs from a present empty string. Strict $LIST access to an omitted element can raise NULL VALUE.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q03](<Domanda per domanda/Q03.md>), [Q11](<Domanda per domanda/Q11.md>), [Q12](<Domanda per domanda/Q12.md>).

### Panel 2 — 2. LISTNEXT pointer

**Example or flow:** Initialize ptr=0 → $LISTNEXT updates pointer and value → stop when function returns 0

**Reasoning:** The pointer is opaque, not the element number. An omitted element can leave the value undefined; use a separate counter and a safe value check.

Related question analyses: [Q06](<Domanda per domanda/Q06.md>), [Q08](<Domanda per domanda/Q08.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 3 — 3. Delimiter conversion can lose structure

**Example or flow:** Two elements ["A|B","C"] → delimited text A|B|C → ambiguous split

**Reasoning:** Binary lists preserve element boundaries. A simple delimiter conversion needs an escaping contract if values contain the delimiter.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q07](<Domanda per domanda/Q07.md>), [Q09](<Domanda per domanda/Q09.md>), [Q10](<Domanda per domanda/Q10.md>), [Q13](<Domanda per domanda/Q13.md>), [Q14](<Domanda per domanda/Q14.md>).

## Further insights: List structure and iteration contracts

![T4.2 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Structural validity first

**Example or flow:** $LISTVALID(input) → valid encoding? → then validate record fields

**Reasoning:** A valid list can still contain the wrong number of elements or invalid domain values.

Related question analyses: [Q12](<Domanda per domanda/Q12.md>), [Q13](<Domanda per domanda/Q13.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 2 — Opaque cursor versus position

**Example or flow:** $LISTGET: 1-based position; $LISTNEXT: pointer starts at 0 and is updated internally

**Reasoning:** Do not increment the opaque pointer as if it were an element index. Keep a separate counter if needed.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q06](<Domanda per domanda/Q06.md>), [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q11](<Domanda per domanda/Q11.md>).

### Panel 3 — List versus delimited text

**Example or flow:** Elements "A|B" and "C" → text "A|B|C" loses original boundaries

**Reasoning:** A delimiter conversion is not always reversible. CSV quoting and escaping require an appropriate parser.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q07](<Domanda per domanda/Q07.md>).

### Panel 4 — Exact membership

**Example or flow:** Roles [Admin,Editor,Viewer] → $LISTFIND(Viewer)=3; absent→0

**Reasoning:** A full element match differs from substring contains. SuperViewer is not the element Viewer.

Related question analyses: [Q10](<Domanda per domanda/Q10.md>), [Q15](<Domanda per domanda/Q15.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

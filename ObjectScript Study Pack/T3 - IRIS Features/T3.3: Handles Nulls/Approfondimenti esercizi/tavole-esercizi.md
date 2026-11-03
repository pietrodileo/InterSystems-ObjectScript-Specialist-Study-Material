# T3.3 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Three layers of absence

![T3.3 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Undefined, empty and NUL

**Example or flow:** Undefined variable: no value; ObjectScript "": length 0; $CHAR(0): length 1

**Reasoning:** In the shown SQL mapping, ObjectScript empty string represents SQL NULL, while $CHAR(0) represents SQL ''. Keep JSON null separate.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q06](<Domanda per domanda/Q06.md>), [Q09](<Domanda per domanda/Q09.md>), [Q10](<Domanda per domanda/Q10.md>), [Q12](<Domanda per domanda/Q12.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 2 — 2. Aggregates ignore SQL NULL

**Example or flow:** Scores 10,20,30,NULL,NULL → SUM=60, COUNT(Score)=3, AVG=20, COUNT(*)=5

**Reasoning:** Replacing missing scores with zero changes the population and yields AVG=12 instead of 20.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q07](<Domanda per domanda/Q07.md>).

### Panel 3 — 3. WHERE keeps TRUE only

**Example or flow:** 100 rows: Boston 30, other cities 50, NULL 20; City<>Boston → 50; add OR City IS NULL → 70

**Reasoning:** The comparison with NULL is UNKNOWN, not TRUE. Negating a comparison does not automatically include missing values.

Related question analyses: [Q05](<Domanda per domanda/Q05.md>), [Q08](<Domanda per domanda/Q08.md>), [Q11](<Domanda per domanda/Q11.md>), [Q13](<Domanda per domanda/Q13.md>), [Q15](<Domanda per domanda/Q15.md>).

## Further insights: Empty values and report semantics

![T3.3 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Keep the representation layer explicit

**Example or flow:** ObjectScript empty string → SQL NULL; ObjectScript $CHAR(0) → SQL empty string ''

**Reasoning:** NUL is one character; an ObjectScript empty string has length zero. Invisible does not mean absent.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q10](<Domanda per domanda/Q10.md>), [Q12](<Domanda per domanda/Q12.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 2 — Average over which population?

**Example or flow:** 10,20,30,NULL,NULL → SUM=60; COUNT(Score)=3; AVG=20; COUNT(*)=5

**Reasoning:** Replacing NULLs with zeros changes the average to 60/5=12. This changes the meaning, not just the display.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>).

### Panel 3 — COALESCE keeps SQL empty strings

**Example or flow:** Phone='' is not NULL → selected before Email

**Reasoning:** If the domain treats blank or whitespace as absent, normalize explicitly before choosing a fallback.

Related question analyses: [Q06](<Domanda per domanda/Q06.md>), [Q09](<Domanda per domanda/Q09.md>), [Q11](<Domanda per domanda/Q11.md>).

### Panel 4 — Fallback text can be real data

**Example or flow:** A='none', B=NULL → COALESCE(A,B,'none')='none'

**Reasoning:** Matching the fallback text does not prove both inputs were NULL. Test A IS NULL AND B IS NULL when that is the question.

Related question analyses: [Q15](<Domanda per domanda/Q15.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

# T3.2 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Coercion, macros and cursor flow

![T3.2 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Arithmetic versus concatenation

**Example or flow:** x="5 apples", y="3 oranges"; x+y → 8; x_y → "5 apples3 oranges"

**Reasoning:** Arithmetic reads numeric prefixes. Concatenation preserves text and inserts no separator automatically.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q04](<Domanda per domanda/Q04.md>), [Q11](<Domanda per domanda/Q11.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 2 — 2. Compile-time substitution

**Example or flow:** Macro TaxRate=0.07 → compiled expression amount*0.07 → GetTax(100)=7

**Reasoning:** A macro expands before execution. Updating an include requires considering dependent recompilation.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q06](<Domanda per domanda/Q06.md>), [Q12](<Domanda per domanda/Q12.md>).

### Panel 3 — 3. Fetch before processing

**Example or flow:** FETCH → SQLCODE 0: process row; 100: finish; negative: handle error; then close cursor

**Reasoning:** The final no-data fetch is not another row. Avoid reusing stale host variables after it.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>), [Q10](<Domanda per domanda/Q10.md>), [Q14](<Domanda per domanda/Q14.md>), [Q16](<Domanda per domanda/Q16.md>).

## Further insights: Conversions, SQL outcomes and compilation

![T3.2 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Coercion is not validation

**Example or flow:** Evaluate "10abc20" + 5. ObjectScript interprets the leading numeric part as 10 and the result is 15. If the value comes from a quantity field, that result can look reasonable even though the input contains letters.

**Reasoning:** Check the entire input against the format your application accepts before doing arithmetic. A result from implicit conversion only tells you how ObjectScript interpreted the value.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q04](<Domanda per domanda/Q04.md>), [Q11](<Domanda per domanda/Q11.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 2 — Three SQL outcomes

**Example or flow:** A SELECT INTO fetches a customer's name into a local variable. For an existing customer, SQLCODE is 0 and the result is available. For a missing customer it is 100. A negative value indicates an error such as an invalid table reference.

**Reasoning:** Branch on SQLCODE before reading the output variable. On the no-row path, any value left over from a previous fetch would belong to that earlier query.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>), [Q10](<Domanda per domanda/Q10.md>), [Q14](<Domanda per domanda/Q14.md>), [Q16](<Domanda per domanda/Q16.md>).

### Panel 3 — Values versus identifiers

**Example or flow:** A status supplied by a form goes in a parameter for WHERE Status = ?. A report selector that chooses an SQL table is different: the table name has to be part of the statement before the query can run.

**Reasoning:** Bind data values and map report choices to a fixed set of known table names. The parameter handles only its own value and does not make other assembled parts of the SQL safe.

Related question analyses: [Q13](<Domanda per domanda/Q13.md>), [Q17](<Domanda per domanda/Q17.md>).

### Panel 4 — Macro dependencies

**Example or flow:** A routine uses a macro named MaxRetries whose include file defines it as 3. Change the definition to 5 and run the routine that was compiled earlier. It can still use 3 because the old expansion is in the compiled code.

**Reasoning:** Trace the dependency through compilation. Recompile the dependent routine or class to put the new expansion into its executable code, then check the result.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q06](<Domanda per domanda/Q06.md>), [Q12](<Domanda per domanda/Q12.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

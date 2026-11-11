# T5.1 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Compilation stages and performance tools

![T5.1 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Classify the failing stage

**Example or flow:** Preprocessor: macro/include; compiler: syntax/type/dependency; runtime: values and operations

**Reasoning:** A missing macro is not fixed by changing database privileges. Confirm the actual dependency rather than inventing compiler flags.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q06](<Domanda per domanda/Q06.md>), [Q07](<Domanda per domanda/Q07.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>), [Q12](<Domanda per domanda/Q12.md>), [Q13](<Domanda per domanda/Q13.md>).

### Panel 2 — 2. Duration timer

**Example or flow:** $ZH is a valid abbreviation for $ZHOROLOG; end-start=0.625 seconds=625 ms

**Reasoning:** $HOROLOG is a local day,seconds pair, not a numeric elapsed timer. More printed decimals do not alone make a benchmark representative.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>).

### Panel 3 — 3. Choose the right lens

**Example or flow:** System monitor → workload and I/O; SQL tools → plans and query work; MONLBL → line hits and time

**Reasoning:** Use cumulative counters as differences over a defined interval. An event log is not a substitute for a performance profile.

Related question analyses: [Q05](<Domanda per domanda/Q05.md>), [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q14](<Domanda per domanda/Q14.md>), [Q15](<Domanda per domanda/Q15.md>).

## Further insights: Diagnose the stage before changing code

![T5.1 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Dependency versus symbol

**Example or flow:** A routine includes a file that defines LogInfo but calls LogError. The compiler can find the file and still report an unresolved macro because the requested definition is absent.

**Reasoning:** Check the exact macro name and which include makes it available. Fix the compile-time dependency before investigating the runtime path.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q06](<Domanda per domanda/Q06.md>), [Q07](<Domanda per domanda/Q07.md>), [Q11](<Domanda per domanda/Q11.md>), [Q12](<Domanda per domanda/Q12.md>), [Q13](<Domanda per domanda/Q13.md>).

### Panel 2 — Keywords versus variable names

**Example or flow:** Set city to Paris and then read City. With no assignment to City, the read can raise UNDEFINED. Changing the case of the WRITE command does not change that result.

**Reasoning:** When a variable is undefined, trace the exact identifier from assignment to use. Command keywords can be written in different cases, but those two variable names are distinct.

Related question analyses: [Q10](<Domanda per domanda/Q10.md>).

### Panel 3 — Performance metrics need context

**Example or flow:** Line A runs a million times and spends 0.2 seconds in total. Line B runs once and spends two seconds. A ranking by hit count puts A first, while a ranking by elapsed time puts B first.

**Reasoning:** Choose the measure that matches the question. Compare time, frequency, and I/O separately, and check how the tool defines a ratio before reading it as a percentage.

Related question analyses: [Q05](<Domanda per domanda/Q05.md>), [Q08](<Domanda per domanda/Q08.md>), [Q14](<Domanda per domanda/Q14.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 4 — P99 needs corroboration

**Example or flow:** After a maintenance window, almost all calls remain fast but some become slower. A cache purge could make early calls recompile. Lock waits or storage delays during that same window could also explain the tail.

**Reasoning:** Match timestamps for slow calls with compilation events, waits, and I/O measurements. A percentile locates the slowdown in the distribution. It does not identify the cause.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q09](<Domanda per domanda/Q09.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

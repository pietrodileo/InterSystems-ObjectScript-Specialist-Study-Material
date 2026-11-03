# T4.6 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Object validity, dynamic calls and metadata

![T4.6 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Validity before type

**Example or flow:** $ISOBJECT(obj) → valid oref → then class/inheritance check

**Reasoning:** %IsA concerns the primary chain; %Extends includes secondary superclasses. A declared parameter type is not a reason to dereference an invalid value.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>).

### Panel 2 — 2. Dynamic access

**Example or flow:** Allowed method Add → $METHOD(obj,"Add",10,20) → 30; allowed property Timeout → set value 30

**Reasoning:** Dynamic names still need allowed targets and compatible contracts. Runtime selection does not authorize arbitrary members.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q07](<Domanda per domanda/Q07.md>), [Q12](<Domanda per domanda/Q12.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 3 — 3. Source versus compiled metadata

**Example or flow:** MethodDefinition: source declaration; CompiledMethod: compiled methods including inherited behavior; PropertyDefinition: property schema

**Reasoning:** Method metadata does not contain property values. Use the instance for data and the appropriate dictionary for structure.

Related question analyses: [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q13](<Domanda per domanda/Q13.md>), [Q14](<Domanda per domanda/Q14.md>).

## Further insights: Objects, metadata and dynamic access

![T4.6 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Validity before identity

**Example or flow:** $ISOBJECT → valid oref? → then class name or inheritance test

**Reasoning:** Text that looks like a printed reference is not an object. $CLASSNAME is a real function; short names can collide.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>).

### Panel 2 — Inheritance contract

**Example or flow:** %IsA: primary-superclass chain; %Extends: includes secondary superclasses

**Reasoning:** Do not use exact concrete class-name equality when subclasses should be accepted. Check the intended inheritance relation.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>).

### Panel 3 — Metadata versus instance data

**Example or flow:** PropertyDefinition → name,type,Required,SQL name; object instance → current value

**Reasoning:** The schema does not contain a particular patient's field value. Source definitions and compiled inherited members also serve different questions.

Related question analyses: [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q13](<Domanda per domanda/Q13.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 4 — Dynamic dispatch needs boundaries

**Example or flow:** Configured handler name → allowed class/method → compatible call

**Reasoning:** The ability to call a runtime string is not permission to call every member. Validate targets, arguments and error contracts.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q07](<Domanda per domanda/Q07.md>), [Q12](<Domanda per domanda/Q12.md>), [Q15](<Domanda per domanda/Q15.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

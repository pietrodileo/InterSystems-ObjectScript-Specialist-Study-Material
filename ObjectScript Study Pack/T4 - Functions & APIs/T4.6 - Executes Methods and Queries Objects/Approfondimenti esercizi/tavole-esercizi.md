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

**Example or flow:** A variable contains a string that looks like an object reference printed in a log. Before calling a method, use $ISOBJECT to check for a usable object reference. Then inspect its class name or test inheritance as needed.

**Reasoning:** Reference validity and object type are separate checks. When identifying an exact class, use its qualified name so that two classes from different packages with the same short name stay distinct.

Related question analyses: [Q02](<Domanda per domanda/Q02.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>).

### Panel 2 — Inheritance contract

**Example or flow:** A specialized invoice extends the invoice class as its primary superclass and adds an export adapter as a secondary superclass. An exact class-name comparison identifies the specialized class. %IsA() checks the primary chain, while %Extends() can check a secondary superclass.

**Reasoning:** Choose the check according to the contract. Code that accepts any invoice should use a suitable inheritance check. Code that needs the adapter must check for that secondary superclass too.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>).

### Panel 3 — Metadata versus instance data

**Example or flow:** A class dictionary can tell you that a patient's Email property is required, what type it uses, and how it is projected to SQL. To read the address of patient 42, open that patient record and read its value.

**Reasoning:** Use dictionary metadata for questions about definitions. When inheritance matters, check whether the dictionary view describes source declarations or includes compiled inherited members.

Related question analyses: [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q13](<Domanda per domanda/Q13.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 4 — Dynamic dispatch needs boundaries

**Example or flow:** A setting chooses a handler named preview or export. Map those options to allowed methods and check what arguments each accepts. If the setting names an unrecognized handler, reject it before attempting the call.

**Reasoning:** Dynamic dispatch chooses what runs at runtime. An allowlist limits that choice to intended operations, and the caller still needs to handle the chosen method's status or exception contract.

Related question analyses: [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q07](<Domanda per domanda/Q07.md>), [Q12](<Domanda per domanda/Q12.md>), [Q15](<Domanda per domanda/Q15.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

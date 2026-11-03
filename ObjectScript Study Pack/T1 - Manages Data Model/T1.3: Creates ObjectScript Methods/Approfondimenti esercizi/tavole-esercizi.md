# T1.3 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: References, state and parent contracts

![T1.3 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. By-reference variable versus shared object

**Example or flow:** Call with .array → caller's tree; pass oref by value → same object; reassign local oref → caller unchanged

**Reasoning:** Mutating a shared object differs from replacing the caller's variable. Output does not automatically clear a variable.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q06](<Domanda per domanda/Q06.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 2 — 2. Instance state accumulates

**Example or flow:** Counter starts 0 → Increment()=1 → Increment(5)=6 → Increment()=7; separate instance starts 0

**Reasoning:** The default argument applies when omitted. It does not reset the object's property at each call.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q10](<Domanda per domanda/Q10.md>), [Q14](<Domanda per domanda/Q14.md>), [Q17](<Domanda per domanda/Q17.md>).

### Panel 3 — 3. Extend the parent contract

**Example or flow:** ##super() error → return error; OK → child validation; Final → no later override

**Reasoning:** The child adds checks without erasing the parent's failure. Final is enforced at compilation.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>), [Q09](<Domanda per domanda/Q09.md>), [Q12](<Domanda per domanda/Q12.md>), [Q18](<Domanda per domanda/Q18.md>).

## Further insights: Method contracts and inheritance

![T1.3 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Execution context

**Example or flow:** Instance Method → current object; ClassMethod → no implicit instance

**Reasoning:** Class methods can call other class methods and read class parameters. They do not implicitly own instance property state.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>).

### Panel 2 — Output does not clear

**Example or flow:** Before: result=old; call with .result; no assignment → result remains old

**Reasoning:** The dot passes the caller variable by reference. Output documents intent; the method must explicitly initialize or assign its promised result.

Related question analyses: [Q04](<Domanda per domanda/Q04.md>), [Q08](<Domanda per domanda/Q08.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 3 — Inherited algorithm

**Example or flow:** Base.Process → Child.FetchData returns raw text → Base.Process uppercases it

**Reasoning:** The base defines the sequence while the child supplies a step. Trap: the uppercase conversion belongs to Process in this example.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>), [Q13](<Domanda per domanda/Q13.md>), [Q16](<Domanda per domanda/Q16.md>).

### Panel 4 — Parent validation and Final

**Example or flow:** Parent error → return it; parent OK → child checks

**Reasoning:** Use ##super() to extend the parent method. Final prevents further overrides at compile time; calling ##super() does not bypass Final.

Related question analyses: [Q09](<Domanda per domanda/Q09.md>), [Q12](<Domanda per domanda/Q12.md>), [Q18](<Domanda per domanda/Q18.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

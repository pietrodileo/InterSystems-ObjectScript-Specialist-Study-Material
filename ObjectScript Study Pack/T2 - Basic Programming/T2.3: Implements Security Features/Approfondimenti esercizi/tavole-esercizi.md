# T2.3 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Authorization and SQL boundaries

![T2.3 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Exact role and resource checks

**Example or flow:** SuperAppAdmin contains AppAdmin as text but is not the same role

**Reasoning:** Substring tests can falsely authorize. Check exact membership or the effective resource permission appropriate to the operation.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>).

### Panel 2 — 2. Prepare structure, bind values

**Example or flow:** Fixed template with ? → %Prepare; separate user value → %Execute(value)

**Reasoning:** Parameters stay data rather than SQL structure. Table and column identifiers require a controlled choice, not a value placeholder.

Related question analyses: [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q14](<Domanda per domanda/Q14.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 3 — 3. Authorization is a separate concern

**Example or flow:** Embedded SQL: application checks SQL authorization; ordinary Dynamic SQL: SQL privilege checks apply

**Reasoning:** Host-variable binding addresses injection. Private visibility and process-private temporary data do not replace authorization.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>), [Q12](<Domanda per domanda/Q12.md>), [Q13](<Domanda per domanda/Q13.md>).

## Further insights: Security boundaries explained

![T2.3 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Keep values separate

**Example or flow:** Prepare a query with WHERE Name = ? and pass O'Brien to %Execute() as the argument. The apostrophe stays in the value being compared. If you concatenate it into the SQL before preparing, the parser sees it as part of the statement.

**Reasoning:** Find the point where input enters the SQL. Binding is effective when the value remains separate from the SQL text. Preparing a string after concatenation still parses that string as SQL.

Related question analyses: [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 2 — Three distinct checks

**Example or flow:** A user has the role ReportViewer, and a helper method is declared Private. Neither fact alone tells you whether the user can write to the reports database. Check effective permission on the resource that protects that operation.

**Reasoning:** Exact role membership, resource access, and member visibility answer different questions. Searching role text for Viewer can also match ReportViewer, so check complete role names when membership matters.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>).

### Panel 3 — Partial revocation

**Example or flow:** Suppose you remove INSERT, UPDATE, and DELETE from a role that originally had ALL PRIVILEGES. Inspect the privileges still granted on the object and then check the user's other roles for additional grants.

**Reasoning:** To verify read-only access, evaluate effective permissions. Removing three grants from one role tells you what changed there. It does not establish the user's final privilege set.

Related question analyses: [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>), [Q13](<Domanda per domanda/Q13.md>).

### Panel 4 — Embedded SQL responsibility

**Example or flow:** An embedded query receives a customer ID through a host variable. That keeps the ID separate from the SQL text. Before running the query, the application still needs to verify that the requester is allowed to view that customer.

**Reasoning:** Check injection protection and authorization independently. Embedded SQL follows its own privilege rules, so use the application's security checks and verify the configured execution context.

Related question analyses: [Q07](<Domanda per domanda/Q07.md>), [Q12](<Domanda per domanda/Q12.md>), [Q15](<Domanda per domanda/Q15.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

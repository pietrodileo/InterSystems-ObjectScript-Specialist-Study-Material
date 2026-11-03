# T4.7 — Exercise diagrams explained

[All question analyses](<Domanda per domanda/README.md>) · [Chapter focus](README.md)

Two English visual pages group the chapter’s mechanisms and additional insights. Each includes causal steps, explanations and common traps. The links below connect panels to written question analyses; the pictures are conceptual summaries, not an individual picture for every question. Exact code and qualifications remain in the Markdown.

## Core mechanisms: Streams, HTTP and mail outcomes

![T4.7 — Core mechanisms](<schema-esercizi.png>)

### Panel 1 — 1. Two independent stream choices

**Example or flow:** File versus Global: destination; Character versus Binary: data treatment; cursor: position within content

**Reasoning:** Choose representation by meaning and destination. Rewind changes position, not contents; Read may return a chunk.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q07](<Domanda per domanda/Q07.md>).

### Panel 2 — 2. HTTP result layers

**Example or flow:** Get/Post returns %Status → inspect HttpResponse.StatusCode → consume HttpResponse.Data stream → parse expected format

**Reasoning:** A successful transport status does not guarantee a successful HTTP application response. TLS needs suitable client configuration.

Related question analyses: [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>), [Q15](<Domanda per domanda/Q15.md>).

### Panel 3 — 3. Message versus delivery

**Example or flow:** MailMessage: recipients, subject, body → SMTP.Send: transport submission → later delivery → possible reading

**Reasoning:** Acceptance by the SMTP server does not prove delivery or reading. Check and propagate the send result.

Related question analyses: [Q12](<Domanda per domanda/Q12.md>), [Q13](<Domanda per domanda/Q13.md>), [Q14](<Domanda per domanda/Q14.md>).

## Further insights: Streams and external service outcomes

![T4.7 — Further insights](<schema-esercizi-extra.png>)

### Panel 1 — Read is a chunk contract

**Example or flow:** Rewind → read while not AtEnd → consume blocks

**Reasoning:** A tiny Hello World example may fit one Read. Do not assume one Read returns a whole large document.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q07](<Domanda per domanda/Q07.md>).

### Panel 2 — HTTP has multiple outcomes

**Example or flow:** Request %Status → response HTTP StatusCode → parse body stream

**Reasoning:** Transport success does not make 404 a successful user lookup. Content-Type does not repair malformed JSON.

Related question analyses: [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>).

### Panel 3 — Email has multiple stages

**Example or flow:** MailMessage content → SMTP.Send acceptance → later delivery → reading

**Reasoning:** A send result does not prove final delivery or that a person read the message. These are separate events.

Related question analyses: [Q12](<Domanda per domanda/Q12.md>), [Q13](<Domanda per domanda/Q13.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 4 — TLS is configuration

**Example or flow:** Https selects TLS; SSLConfiguration supplies the client configuration

**Reasoning:** Hostname and an HTTPS flag do not replace certificate trust, protocol settings and the required client configuration.

Related question analyses: [Q15](<Domanda per domanda/Q15.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

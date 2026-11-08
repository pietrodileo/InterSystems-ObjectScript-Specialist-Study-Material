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

**Example or flow:** Write ABCDEF into a temporary character stream and rewind it. With a read size of two, successive reads return AB, CD, and EF. The position advances after each read.

**Reasoning:** Start at the position you intend to read from, process each block, and check the read status and end of stream. A single read only requests a block of the given size.

Related question analyses: [Q01](<Domanda per domanda/Q01.md>), [Q02](<Domanda per domanda/Q02.md>), [Q03](<Domanda per domanda/Q03.md>), [Q04](<Domanda per domanda/Q04.md>), [Q05](<Domanda per domanda/Q05.md>), [Q06](<Domanda per domanda/Q06.md>), [Q07](<Domanda per domanda/Q07.md>).

### Panel 2 — HTTP has multiple outcomes

**Example or flow:** A request to /users/42 returns a successful transport status and an HTTP 404. IRIS received a response, but the server reports that the user was not found. Even a 200 response can carry malformed JSON.

**Reasoning:** Check the request status before using the response, then branch on the HTTP status. If the application expects JSON on the success path, parse and validate the response body separately.

Related question analyses: [Q08](<Domanda per domanda/Q08.md>), [Q09](<Domanda per domanda/Q09.md>), [Q10](<Domanda per domanda/Q10.md>), [Q11](<Domanda per domanda/Q11.md>).

### Panel 3 — Email has multiple stages

**Example or flow:** Build a message and submit it to an SMTP relay. The relay can accept the submission and later fail to deliver it to the recipient's server. A successful delivery also gives you no evidence that a person read it.

**Reasoning:** Report what the application actually observed. Use the SMTP result for submission and separate evidence, such as a delivery or bounce event, for later outcomes.

Related question analyses: [Q12](<Domanda per domanda/Q12.md>), [Q13](<Domanda per domanda/Q13.md>), [Q14](<Domanda per domanda/Q14.md>).

### Panel 4 — TLS is configuration

**Example or flow:** An HTTPS request points to a test host and enables TLS. The named SSLConfiguration supplies client settings such as trust for the certificates presented by the server. An untrusted certificate can stop the request before any HTTP response arrives.

**Reasoning:** Check the client configuration and trust settings when diagnosing a handshake failure. HTTP response handling begins only after the connection is established and a response is available.

Related question analyses: [Q15](<Domanda per domanda/Q15.md>).

## How to study with the diagrams

Read the example, cover its answer, predict the next state, and explain why the tempting alternative fails. Then follow a question link and try its variation before opening the solution.

# Technical notes for the illustrated guides

[Visual index](visual-index.md) · [All topics](index.md)

The 31 chapter overviews summarize all 93 numbered sections across the 22 chapters. Two worked diagrams illustrate object callbacks and concurrent account updates. Their diagrams are conceptual learning aids; exact declarations, complete implementations, and detailed explanations belong in the chapter notes. Images are stored beside their chapter Markdown and work offline.

The downloaded notes are a third-party source, and review found several statements that needed qualification. The diagrams use the following distinctions; the original downloaded text and quizzes have not been comprehensively corrected.

| Area | Distinction used in the diagrams | Reference |
| --- | --- | --- |
| Inheritance | Default superclass precedence is left to right; `Inheritance = right` changes it. A class's own override takes priority. | [Inheritance class keyword](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_class_inheritance) |
| NULLs | An undefined variable is separate from a defined empty string. In SQL/ObjectScript value mapping, ObjectScript `""` represents SQL NULL; `$CHAR(0)` represents SQL's zero-length string. | [SQL language elements](https://irisdocs.intersystems.com/irisforhealthlatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_langelements) |
| SQL authorization | Embedded SQL does not automatically enforce SQL privileges; application code must check them. Ordinary Dynamic SQL enforces them. Binding values prevents their interpretation as SQL syntax; dynamic identifiers need an allowlist. | [SQL users, roles, and privileges](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_privileges), [%CHECKPRIV](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_checkpriv) |
| Transactions and locks | Transactions group database updates. They do not make local variables or ordinary lock operations transactional. `$INCREMENT` and `$SEQUENCE` allocation effects are not rolled back. Cooperating ObjectScript processes must use the same locking protocol. | [Transaction processing](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GAPPS_tp) |
| Error diagnosis | Reading an unset array node raises `<UNDEFINED>`; `<SUBSCRIPT>` concerns an invalid subscript, including a disallowed null subscript or excessive length. Null-subscript behavior depends on configuration. | [$ZERROR examples](https://docs.intersystems.com/supplychain20261/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_vzerror) |
| Status versus object | `%Save()` returns `%Status`; `%New()` returns an object reference, rather than a status. | [Working with %Status values](https://docs.intersystems.com/healthconnectlatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_status) |
| Stack inspection | `$STACK` reports current depth; `$STACK(-1)` identifies the highest context with information and can include the saved error stack during handling. | [$STACK function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fstack) |
| Pattern matching | Native `?` patterns and ICU regular expressions are separate syntaxes. `$MATCH` tests the full string; `$LOCATE` searches within it. | [Regular expressions](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_regex) |
| List iteration | `$LISTNEXT` uses an opaque pointer initialized to zero; it is not an element counter. | [$LISTNEXT](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_flistnext) |

Other editorial choices: computed-property storage depends on its keywords; stream selection is shown by text/binary and global/file storage rather than universal compression claims; lock escalation is shown without a fixed threshold or a promise that every access is blocked. Exact storage layouts, permissions, and query plans depend on the class and configuration.

The images were visually reviewed and revised for observed mistakes. Coverage, PNG integrity, and local Markdown links were checked. No IRIS instance was available for running the examples, and this was not a complete technical audit of the source material. Use the linked official documentation for version-specific behavior.

## Image provenance

The original 31 overviews were generated with ImageGen. The worked diagrams for T1.1 and T2.1 were drawn from the examples in the notes. [Final prompts and asset metadata](image-generation-prompts.json) record chapter coverage, final file paths, dimensions, hashes, generation prompts, and any final edit prompts. Images contain concise labels rather than every paragraph of the source notes.

[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.2: Creates Properties and Indexes

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.2.html). Reference links require internet access.

## 1. Sets max length for string properties (MAXLEN parameter, TRUNCATE)

![T1.2 visual summary of sections 1–4: 1. Sets max length for string properties (MAXLEN parameter, TRUNCATE); 2. Uses stream properties for large data sets (%Stream.GlobalCharacter, %Stream.FileBinary); 3. Creates properties that calculate values dynamically or are auto-updated (Calculated, SqlComputed, SqlComputeOnChange); 4. Creates and validates class member parameters and attributes (Required, InitialExpression, parameter keywords)](../visual-guide-01-v2.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **MAXLEN** parameter controls the maximum length of a %String property (default is 50 characters)
- Setting `MAXLEN = ""` sets the limit to the maximum IRIS string length (~3.6 million characters)
- **TRUNCATE** parameter determines whether values exceeding MAXLEN are silently truncated or rejected
- MAXLEN affects SQL column definitions (VARCHAR size)
- Always set MAXLEN explicitly when the default of 50 is insufficient

### Detailed Notes

#### Overview

String properties in InterSystems IRIS have a default maximum length of 50 characters, which is often insufficient for real-world data. The `MAXLEN` parameter controls this limit and directly affects both object validation and the SQL column definition.

#### Setting MAXLEN

```objectscript
Class Sample.Patient Extends %Persistent
{
    /// Name with explicit max length
    Property Name As %String(MAXLEN = 200);

    /// Description with maximum IRIS string length (~3.6 MB)
    Property Notes As %String(MAXLEN = "");

    /// Uses the default MAXLEN of 50
    Property Code As %String;
}
```

In SQL, `MAXLEN` maps to the `VARCHAR` size:

- `Property Name As %String(MAXLEN = 200)` becomes `VARCHAR(200)`
- `Property Notes As %String(MAXLEN = "")` becomes `VARCHAR(MAXVAL)` (maximum IRIS string length, ~3.6 million characters)

#### The TRUNCATE Parameter

The `TRUNCATE` parameter controls what happens when a value exceeds MAXLEN:

- **TRUNCATE = 0** (default): The value is rejected, and `%Save()` returns an error status
- **TRUNCATE = 1**: The value is silently truncated to MAXLEN characters

```objectscript
Property ShortCode As %String(MAXLEN = 5, TRUNCATE = 1);
```

With TRUNCATE = 1, setting `ShortCode` to `"ABCDEFGH"` would silently store `"ABCDE"`.

#### Practical Considerations

- Always verify MAXLEN is sufficient for production data; the default of 50 is a common source of data truncation bugs
- For properties that store variable-length text (descriptions, notes, addresses), consider using `MAXLEN = ""`
- When data may exceed the maximum IRIS string length (~3.6 million characters / ~3.6 MB) — such as large PDFs, images, or documents — use a stream property instead
- Changing MAXLEN on an existing property may require rebuilding indices that include that property

### Documentation References

- [String Data Type](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_datatypes)
- [Property Parameters](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_property)

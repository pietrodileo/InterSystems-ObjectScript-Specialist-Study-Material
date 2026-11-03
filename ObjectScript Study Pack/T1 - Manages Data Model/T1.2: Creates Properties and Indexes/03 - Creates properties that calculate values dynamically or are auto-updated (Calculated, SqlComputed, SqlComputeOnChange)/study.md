[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.2: Creates Properties and Indexes

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.2.html). Reference links require internet access.

## 3. Creates properties that calculate values dynamically or are auto-updated (Calculated, SqlComputed, SqlComputeOnChange)

![T1.2 visual summary of sections 1–4: 1. Sets max length for string properties (MAXLEN parameter, TRUNCATE); 2. Uses stream properties for large data sets (%Stream.GlobalCharacter, %Stream.FileBinary); 3. Creates properties that calculate values dynamically or are auto-updated (Calculated, SqlComputed, SqlComputeOnChange); 4. Creates and validates class member parameters and attributes (Required, InitialExpression, parameter keywords)](../visual-guide-01-v2.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **Calculated** properties have no storage; their value is computed each time via a custom Get method
- **SqlComputed** properties have a SQL compute code expression that provides the value in SQL context
- **SqlComputeOnChange** specifies which properties trigger recalculation on INSERT or UPDATE
- Calculated properties without SqlComputed will appear as NULL in SQL queries
- **Transient** properties exist in memory only (not stored) but differ from Calculated in that they can be set

### Detailed Notes

#### Overview

InterSystems IRIS provides several mechanisms for properties whose values are derived from other data rather than stored independently. Choosing the right mechanism depends on whether the value needs to be available in SQL, whether it should be stored for indexing, and when it should be recalculated.

#### Calculated Properties

A Calculated property has no storage. Each time the property is accessed, the system calls the property's Get method to compute the value.

```objectscript
Class Sample.Person Extends %Persistent
{
    Property FirstName As %String;
    Property LastName As %String;

    /// Full name computed on access
    Property FullName As %String [ Calculated, SqlComputeCode = {
        Set {*} = {FirstName} _ " " _ {LastName}
    }, SqlComputed ];

    Method FullNameGet() As %String
    {
        Return ..FirstName _ " " _ ..LastName
    }
}
```

Key characteristics:

- No storage allocated for the property
- `Get` method is called every time the property is accessed in ObjectScript
- Cannot be SET directly (no `Set` method)
- Must also specify `SqlComputed` and `SqlComputeCode` if the value should be visible in SQL

#### SqlComputed Properties

`SqlComputed` provides a value in the SQL context. Combined with storage, the value can be indexed.

```objectscript
Property AgeGroup As %String [ SqlComputeCode = {
    Set {*} = $Select({Age}<18:"Minor", {Age}<65:"Adult", 1:"Senior")
}, SqlComputed, SqlComputeOnChange = Age ];
```

In the `SqlComputeCode`:

- `{*}` refers to the property being computed
- `{PropertyName}` refers to other properties in the same class
- `{%%INSERT}` is true during INSERT operations
- `{%%UPDATE}` is true during UPDATE operations

#### SqlComputeOnChange

This keyword specifies which property changes should trigger recalculation:

```objectscript
Property TotalPrice As %Numeric [ SqlComputeCode = {
    Set {*} = {Quantity} * {UnitPrice}
}, SqlComputed, SqlComputeOnChange = (Quantity, UnitPrice) ];
```

- When `Quantity` or `UnitPrice` changes (via INSERT or UPDATE), `TotalPrice` is automatically recomputed
- Specify `%%INSERT` to only compute on new records
- Specify multiple trigger properties in parentheses
- Without `SqlComputeOnChange`, the value is computed on every INSERT and UPDATE

#### Stored Computed vs Calculated

| Feature | Calculated + SqlComputed | SqlComputed (not Calculated) |
| --- | --- | --- |
| Value stored on disk | No | Yes |
| Can be indexed | No | Yes |
| SQL visibility | Computed on each query | Stored, fast retrieval |
| Object access | Via Get method | Direct from storage |

#### Transient Properties

Transient properties are in-memory only (not stored) but unlike Calculated properties, they can be set:

```objectscript
Property TempResult As %String [ Transient ];
```

### Documentation References

- [Calculated Properties](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_datatypes)
- [SqlComputed Properties](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_tables)

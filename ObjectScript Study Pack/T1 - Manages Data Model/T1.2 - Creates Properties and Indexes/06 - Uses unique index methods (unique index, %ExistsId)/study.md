[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.2: Creates Properties and Indexes

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.2.html). Reference links require internet access.

## 6. Uses unique index methods (unique index, %ExistsId)

![T1.2 visual summary of sections 5–7: 5. Selects appropriate index type based on data distribution (standard, bitmap, bitslice); 6. Uses unique index methods (unique index, %ExistsId); 7. Recalls how foreign keys enforce referential integrity (ForeignKey, OnDelete, NoAction, Cascade)](../visual-guide-02.png)

*This diagram covers sections 5–7; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- A **unique index** enforces that no two objects can have the same value for the indexed property
- Unique indexes automatically generate `Exists` methods for checking existence
- **%ExistsId(id)** checks if an object with a given ID exists without opening it
- Unique indexes project as SQL UNIQUE constraints
- The **IdKey** index type makes the indexed properties the object ID

### Detailed Notes

#### Overview

Unique indexes enforce data integrity by preventing duplicate values. They also provide efficient existence-checking methods. Understanding unique indexes is important for both data modeling and performance optimization.

#### Defining a Unique Index

```objectscript
Class Sample.Employee Extends %Persistent
{
    Property EmployeeID As %String [ Required ];
    Property SSN As %String [ Required ];
    Property Email As %String;

    /// Ensure no duplicate EmployeeIDs
    Index EmployeeIDIdx On EmployeeID [ Unique ];

    /// Ensure no duplicate SSNs
    Index SSNIdx On SSN [ Unique ];

    /// Compound unique index
    Index NameDOBIdx On (LastName, FirstName, DOB) [ Unique ];
}
```

If you attempt to save an object with a duplicate value in a unique-indexed property, `%Save()` returns an error.

#### Generated Existence Methods

For each unique index, the class compiler generates an `Exists` method:

```objectscript
// Check if an employee with EmployeeID "E12345" exists
If ##class(Sample.Employee).EmployeeIDIdxExists("E12345", .id) {
    Write "Employee exists with ID: ", id, !
}
```

The `Exists` method:

- Takes the indexed property value(s) as input
- Returns a boolean (1 = exists, 0 = does not exist)
- Optionally returns the object ID via an output parameter

#### %ExistsId() for ID-Based Checks

The `%ExistsId()` class method checks if an object with a specific ID exists without opening it:

```objectscript
If ##class(Sample.Employee).%ExistsId(42) {
    Write "Object 42 exists", !
} Else {
    Write "Object 42 does not exist", !
}
```

This is much more efficient than opening the object to check existence, as it only checks the global node without loading data into memory.

#### IdKey Indexes

An `IdKey` index makes the indexed properties the actual object identifier instead of the system-assigned integer:

```objectscript
Class Sample.Country Extends %Persistent
{
    Property Code As %String(MAXLEN = 3);
    Property Name As %String(MAXLEN = 100);

    Index CodeIdx On Code [ IdKey ];
}
```

With an IdKey index:

- `Code` becomes the object ID: `Set country = ##class(Sample.Country).%OpenId("USA")`
- No system-assigned integer ID
- Bitmap indexes cannot be used (IDs are not positive integers)
- The IdKey property cannot be modified after saving

#### Unique Index vs Primary Key in SQL

A unique index projects as a SQL UNIQUE constraint. An `IdKey` index projects as the PRIMARY KEY. A class can have multiple unique indexes but only one IdKey.

### Documentation References

- [Unique Indexes](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSOD_indexes)
- [%ExistsId](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_storage)

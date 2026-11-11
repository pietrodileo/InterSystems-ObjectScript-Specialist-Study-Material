[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.1: Uses Classes

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.1.html). Reference links require internet access.

## 4. Interprets storage definitions (DataLocation, IdLocation, IndexLocation, USEEXTENTSET)

![T1.1 visual summary of sections 4–6: 4. Interprets storage definitions (DataLocation, IdLocation, IndexLocation, USEEXTENTSET); 5. Implements multiple inheritance (order matters, method resolution); 6. Documents classes (Description keyword, /// comments)](../visual-guide-02-v2.png)

*This diagram covers sections 4–6; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **Storage definition** maps class properties to underlying global structures
- **DataLocation** specifies the global where object data is stored (default: `^Package.ClassD`)
- **IdLocation** specifies the global holding the ID counter (default: `^Package.ClassD`)
- **IndexLocation** specifies the global for index data (default: `^Package.ClassI`)
- **USEEXTENTSET** parameter changes storage to use short hashed global names instead of class-name-based globals
- Storage definitions are auto-generated but can be customized for special requirements

### Detailed Notes

#### Overview

Every persistent class has a storage definition that tells the system how to map object properties to globals. Understanding storage definitions is essential for troubleshooting, performance tuning, and interpreting existing code.

#### Default Storage Layout

By default, InterSystems IRIS uses `%Storage.Persistent` and creates globals named after the class:

```text
Class Sample.Person Extends %Persistent
{
    Property Name As %String;
    Property Age As %Integer;
}
```

Default storage globals:

- **Data**: `^Sample.PersonD` - stores object data
- **Index**: `^Sample.PersonI` - stores index entries
- **ID Counter**: `^Sample.PersonD(0)` or a separate counter node - tracks the next available ID

The data global structure typically looks like:

```text
^Sample.PersonD = <next ID counter>
^Sample.PersonD(1) = $LB("", "John Smith", 35)
^Sample.PersonD(2) = $LB("", "Jane Doe", 28)
```

Each node stores a `$LISTBUILD` structure where property values are stored in a defined order.

#### Storage Definition in Class Code

The storage definition appears at the end of the class and is managed by the compiler:

```text
Storage Default
{
<Data name="PersonDefaultData">
  <Value name="1"><Value>%%CLASSNAME</Value></Value>
  <Value name="2"><Value>Name</Value></Value>
  <Value name="3"><Value>Age</Value></Value>
</Data>
<DataLocation>^Sample.PersonD</DataLocation>
<DefaultData>PersonDefaultData</DefaultData>
<IdLocation>^Sample.PersonD</IdLocation>
<IndexLocation>^Sample.PersonI</IndexLocation>
<StreamLocation>^Sample.PersonS</StreamLocation>
<Type>%Storage.Persistent</Type>
}
```

#### Default and Per-Index Locations

Suppose `Tutor.Invoice` defines `CityIdx` on `City` and `DateIdx` on `InvoiceDate`. Declare the indexes in the class body:

```objectscript
Index CityIdx On City;
Index DateIdx On InvoiceDate;
```

To assign one index a separate global, place `<Location>` inside that index's `<Index>` entry in the class's `Storage Default` definition. For example:

```objectscript
Storage Default
{
    ...
    <DataLocation>^Tutor.InvoiceD</DataLocation>
    <IndexLocation>^Tutor.InvoiceI</IndexLocation>
    <Index name="CityIdx">
        <Location>^Tutor.InvoiceCity</Location>
    </Index>
    ...
}
```

`IndexLocation` is the default for indexes without their own `Location`. Since only `CityIdx` has a per-index entry here, its entries are stored under `^Tutor.InvoiceCity`; `DateIdx` uses the default and is stored under `^Tutor.InvoiceI("DateIdx",...)`. The `<Index name="CityIdx">` must match the index declaration in the class. Both globals contain index data; the invoice record itself is stored at the `DataLocation`.

#### USEEXTENTSET Parameter

When `USEEXTENTSET = 1`, the system generates short hashed global names instead of using the class name:

```objectscript
Class Sample.Person Extends %Persistent [ SqlTableName = Person ]
{
    Parameter USEEXTENTSET = 1;
}
```

With USEEXTENTSET enabled:

- Globals get names like `^Eprogramming.Hjkl.1` (short hashed names)
- Each property group and index gets its own global
- Avoids the 31-character global name limit for deeply nested packages
- Recommended for new development, especially with long package names

#### Why Storage Definitions Matter

- **Troubleshooting**: Direct global inspection to verify data integrity
- **Migration**: Understanding storage is critical when moving data between systems
- **Performance**: Custom storage layouts can optimize access patterns
- **Inheritance**: Subclasses may share or extend the parent storage definition

#### Examining Storage at Runtime

You can programmatically inspect storage definitions using the `%Dictionary` package:

```objectscript
// Open the storage definition for a class
Set storDef = ##class(%Dictionary.StorageDefinition).%OpenId("Sample.Person||Default")
If storDef '= "" {
    Write "DataLocation: ", storDef.DataLocation, !
    Write "IndexLocation: ", storDef.IndexLocation, !
    Write "IdLocation: ", storDef.IdLocation, !
}

// Directly inspect the global
ZWrite ^Sample.PersonD
```

### Documentation References

- [Storage Definitions](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_storage)
- [USEEXTENTSET Parameter](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_storageglobals)

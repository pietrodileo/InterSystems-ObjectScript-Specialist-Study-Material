[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.1: Uses Classes

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.1.html). Reference links require internet access.

## 1. Identifies use cases for persistent and registered object classes

![T1.1 visual summary of sections 1–3: 1. Identifies use cases for persistent and registered object classes; 2. Creates and saves a persistent object (%New(), %Save(), %Id()); 3. Deletes objects (%DeleteId(), %DeleteExtent())](../visual-guide-01.png)

*This diagram covers sections 1–3; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **%Persistent**: Objects that are stored permanently in the database with automatic SQL table projection
- **%RegisteredObject**: Transient objects that exist only in memory during process lifetime
- **%SerialObject**: Embeddable objects stored inline within a persistent object (no independent identity)
- **Use persistent classes** when data must survive process termination and be queryable via SQL
- **Use registered classes** for utility objects, business logic containers, and temporary data structures

### Detailed Notes

#### Overview

InterSystems IRIS provides three fundamental object types through system classes. Choosing the correct superclass determines how object instances are stored and managed. This decision has direct implications for SQL projection, memory usage, and data persistence.

#### Persistent Classes (%Persistent)

Persistent classes store their data in globals on disk. Each persistent class automatically projects as a SQL table, and each saved object instance becomes a row. Persistent objects have a unique object ID assigned upon saving.

```objectscript
Class Sample.Person Extends %Persistent
{
    Property Name As %String;
    Property DOB As %Date;
}
```

Use cases for persistent classes:

- Application data that must be stored long-term (patients, orders, transactions)
- Data that needs to be queried via SQL
- Objects that participate in relationships with other persistent objects
- Data shared across multiple processes

#### Registered Object Classes (%RegisteredObject)

Registered objects live only in memory for the duration of the process. They support the full object model (properties, methods, inheritance) but have no automatic storage mechanism.

```objectscript
Class Sample.Calculator Extends %RegisteredObject
{
    Property LastResult As %Numeric;

    Method Add(a As %Numeric, b As %Numeric) As %Numeric
    {
        Set ..LastResult = a + b
        Return ..LastResult
    }
}
```

Use cases for registered classes:

- Utility and helper classes that perform computations
- Temporary data holders during a request lifecycle
- Abstract base classes that define interfaces
- Service classes and adapters

#### Serial Object Classes (%SerialObject)

Serial objects are embedded within a persistent object. They do not have their own storage or ID; instead, their data is serialized into the parent object's storage. In SQL, serial properties project as multiple columns with a naming convention (e.g., `HomeAddress_City`, `HomeAddress_State`).

```objectscript
Class Sample.Address Extends %SerialObject
{
    Property City As %String;
    Property State As %String;
    Property Zip As %String;
}

Class Sample.Person Extends %Persistent
{
    Property Name As %String;
    Property HomeAddress As Sample.Address;
}
```

#### Utility Classes (No Superclass)

A class defined without any `Extends` clause is a **utility class**. Since it does not inherit from `%RegisteredObject`, it cannot be instantiated with `%New()`. It can only contain **ClassMethods** and **Parameters** (no instance methods or properties).

```objectscript
Class Sample.MathUtils
{
    Parameter PI = 3.14159265;

    ClassMethod Square(x As %Numeric) As %Numeric
    {
        Return x * x
    }
}
```

Common use case: grouping related class methods (utility functions, constants) without needing object instantiation.

#### Decision Criteria

| Criteria | %Persistent | %RegisteredObject | %SerialObject | No superclass |
| --- | --- | --- | --- | --- |
| Stored on disk | Yes | No | Embedded in parent | No |
| Has unique ID | Yes | No | No | No |
| SQL projection | Table | None | Columns in parent table | None |
| Independent existence | Yes | In-memory only | Only within parent | N/A |
| Instantiable (%New) | Yes | Yes | Yes | No |

### Documentation References

- [Object Classes](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes)
- [Persistent Objects](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_persobj)

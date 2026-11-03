[All topics](../../index.md) · [Practice quiz](quiz.md)

# T1.1: Uses Classes

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.1.html). Reference links require internet access.

### Contents

1. [Identifies use cases for persistent and registered object classes](#1-identifies-use-cases-for-persistent-and-registered-object-classes)
2. [Creates and saves a persistent object (%New(), %Save(), %Id())](#2-creates-and-saves-a-persistent-object-new-save-id)
3. [Deletes objects (%DeleteId(), %DeleteExtent())](#3-deletes-objects-deleteid-deleteextent)
4. [Interprets storage definitions (DataLocation, IdLocation, IndexLocation, USEEXTENTSET)](#4-interprets-storage-definitions-datalocation-idlocation-indexlocation-useextentset)
5. [Implements multiple inheritance (order matters, method resolution)](#5-implements-multiple-inheritance-order-matters-method-resolution)
6. [Documents classes (Description keyword, /// comments)](#6-documents-classes-description-keyword--comments)

### Visual study guide — sections 1–3

![T1.1 visual summary of sections 1–3: 1. Identifies use cases for persistent and registered object classes; 2. Creates and saves a persistent object (%New(), %Save(), %Id()); 3. Deletes objects (%DeleteId(), %DeleteExtent())](visual-guide-01.png)

[View all chapter diagrams](visuals.md) · [Technical review notes](../../visual-technical-notes.md)

## 1. Identifies use cases for persistent and registered object classes

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

## 2. Creates and saves a persistent object (%New(), %Save(), %Id())

### Key Points

- **%New()** creates a new in-memory instance of a class and returns an object reference (oref)
- **%Save()** persists the object to disk and returns a %Status value that must be checked
- **%Id()** returns the unique persistent ID assigned to the object after saving
- Always check the return status of %Save() for error handling
- **%OpenId(id)** retrieves a previously saved object from disk by its ID

### Detailed Notes

#### Overview

The lifecycle of a persistent object involves creation in memory, saving to disk, and later retrieval. Understanding this lifecycle and the methods involved is fundamental to working with InterSystems IRIS.

#### Creating an Object with %New()

The `%New()` method is inherited from `%RegisteredObject` and allocates memory for a new object instance. It returns an object reference (oref).

```objectscript
Set person = ##class(Sample.Person).%New()
Set person.Name = "John Smith"
Set person.DOB = $HOROLOG
```

Before `%Save()` is called, the object exists only in memory. If the variable goes out of scope without saving, the object is lost.

#### Saving with %Save()

The `%Save()` method serializes the object to the database globals. It returns a `%Status` value indicating success or failure.

```objectscript
Set sc = person.%Save()
If $$$ISERR(sc) {
    // Handle error
    Do $System.Status.DisplayError(sc)
}
```

Key behaviors of `%Save()`:

- First save assigns a new ID to the object
- Subsequent saves on the same oref update the existing record
- Validates required properties before saving
- Fires any triggers defined on the SQL table
- Cascades saves to embedded serial objects

#### Retrieving the ID with %Id()

After a successful save, `%Id()` returns the assigned unique identifier.

```objectscript
Set person = ##class(Sample.Person).%New()
Set person.Name = "Jane Doe"
Set sc = person.%Save()
If $$$ISOK(sc) {
    Write "Saved with ID: ", person.%Id(), !
}
```

#### Opening an Existing Object with %OpenId()

To retrieve a saved object by its ID:

```objectscript
Set person = ##class(Sample.Person).%OpenId(42)
If person '= "" {
    Write person.Name, !
}
```

The concurrency parameter controls locking behavior: 0 (no lock), 1 (atomic read, default), 2 (shared lock), 3 (shared/retained lock), 4 (exclusive lock).

#### Complete Lifecycle Example

```objectscript
// Create
Set person = ##class(Sample.Person).%New()
Set person.Name = "Alice Johnson"

// Save
Set sc = person.%Save()
If $$$ISERR(sc) { Do $System.Status.DisplayError(sc) Quit }

// Capture ID
Set id = person.%Id()
Write "Created person with ID: ", id, !

// Later: open and modify
Set person2 = ##class(Sample.Person).%OpenId(id)
Set person2.Name = "Alice Smith"
Set sc = person2.%Save()
```

### Documentation References

- [Saving Objects](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_persobj_saving)
- [Opening Objects](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_persobj_opening)

## 3. Deletes objects (%DeleteId(), %DeleteExtent())

### Key Points

- **%DeleteId(id)** deletes a single object by its ID and returns a %Status
- **%DeleteExtent()** deletes all instances of a class (all rows in the SQL table)
- **%KillExtent()** is a faster but less safe alternative that directly kills the storage globals
- Deletion respects referential integrity constraints (foreign keys)
- Always check the return status for errors (e.g., object not found, referential integrity violation)

### Detailed Notes

#### Overview

InterSystems IRIS provides multiple approaches for deleting persistent objects. The choice depends on whether you need to delete a single instance, a filtered set, or the entire extent (all instances) of a class.

#### Deleting a Single Object with %DeleteId()

The `%DeleteId()` class method deletes one object by its ID. It returns a `%Status` value.

```objectscript
Set sc = ##class(Sample.Person).%DeleteId(42)
If $$$ISERR(sc) {
    Do $System.Status.DisplayError(sc)
}
```

Key behaviors:

- Removes the object data from globals
- Removes associated index entries
- Fires `%OnDelete()` callback if defined in the class
- Respects foreign key constraints (deletion may fail if referenced by other objects)
- Fires SQL DELETE triggers if defined

#### Deleting All Objects with %DeleteExtent()

The `%DeleteExtent()` class method removes all instances of a class.

```objectscript
Set sc = ##class(Sample.Person).%DeleteExtent()
```

This method iterates through all objects and deletes them one at a time, which means:

- Each deletion fires triggers and callbacks
- Foreign key constraints are checked for each object
- It can be slow for large tables
- It returns the count of deleted objects via output parameters

```objectscript
Set sc = ##class(Sample.Person).%DeleteExtent(.deletecount, .instancecount)
Write "Deleted: ", deletecount, " of ", instancecount, !
```

#### Using %KillExtent() for Fast Deletion

For situations where triggers, callbacks, and referential integrity checks are not needed, `%KillExtent()` directly kills the underlying globals.

```objectscript
Do ##class(Sample.Person).%KillExtent()
```

Caution: `%KillExtent()` bypasses all object-level logic. Use it only when you are certain no side effects are needed, typically during development or data reset operations.

#### Handling Referential Integrity on Delete

If a class has foreign key references from other classes, deletion behavior depends on the `OnDelete` action defined on the foreign key:

- **NoAction** (default): Deletion fails if referenced objects exist
- **Cascade**: Referenced objects are also deleted
- **SetNull**: Foreign key fields in referencing objects are set to null
- **SetDefault**: Foreign key fields in referencing objects are set to their default value

#### The %OnDelete() Callback

Classes can implement the `%OnDelete()` callback method to perform custom logic before deletion:

```objectscript
ClassMethod %OnDelete(oid As %ObjectIdentity) As %Status
{
    // Custom cleanup logic
    Write "Deleting object: ", oid, !
    Return $$$OK
}
```

### Documentation References

- [Deleting Objects](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_persobj_deleting)
- [Foreign Keys](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_foreignkey)

### Visual study guide — sections 4–6

![T1.1 visual summary of sections 4–6: 4. Interprets storage definitions (DataLocation, IdLocation, IndexLocation, USEEXTENTSET); 5. Implements multiple inheritance (order matters, method resolution); 6. Documents classes (Description keyword, /// comments)](visual-guide-02-v2.png)

[View all chapter diagrams](visuals.md) · [Technical review notes](../../visual-technical-notes.md)

## 4. Interprets storage definitions (DataLocation, IdLocation, IndexLocation, USEEXTENTSET)

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

## 5. Implements multiple inheritance (order matters, method resolution)

### Key Points

- InterSystems IRIS supports **multiple inheritance** (a class can extend multiple superclasses)
- **Left-to-right order** determines priority when superclasses define the same member
- The **leftmost superclass** in the Extends list has the highest priority
- Storage inheritance comes from the **primary (first) persistent superclass**
- Use multiple inheritance carefully to avoid ambiguity and complexity

### Detailed Notes

#### Overview

Multiple inheritance allows a class to combine behaviors from several parent classes. In InterSystems IRIS, a class can extend multiple superclasses separated by commas. The order in which superclasses are listed is significant because it determines which version of a member is inherited when conflicts occur.

#### Syntax

```objectscript
Class MyApp.Manager Extends (Sample.Person, Sample.Employee, %Populate)
{
    // Inherits from all three classes
    // Sample.Person has highest priority for conflicts
}
```

#### Method Resolution Order (MRO)

When two or more superclasses define a method or property with the same name, the class compiler resolves the conflict using **left-to-right priority**:

1. The class's own members have the highest priority 2. Then the first (leftmost) superclass 3. Then the second superclass 4. And so on

Example:

```objectscript
Class Base.A Extends %RegisteredObject
{
    Method Greet() { Write "Hello from A", ! }
}

Class Base.B Extends %RegisteredObject
{
    Method Greet() { Write "Hello from B", ! }
}

Class MyApp.Combined Extends (Base.A, Base.B)
{
    // Greet() is inherited from Base.A (leftmost)
}
```

Calling `Greet()` on a `MyApp.Combined` instance executes `Base.A`'s implementation.

#### Storage and Primary Superclass

For persistent classes, the **primary superclass** (the first persistent class in the Extends list) determines the storage strategy. All other persistent superclasses contribute their properties but do not contribute an independent storage definition.

```objectscript
Class MyApp.ExtendedPerson Extends (Sample.Person, Sample.Auditable)
{
    // Storage comes from Sample.Person (primary)
    // Properties from Sample.Auditable are added to Sample.Person's storage
}
```

#### Common Patterns for Multiple Inheritance

- **Mixin pattern**: Combine a primary persistent class with utility registered classes that add behavior (logging, auditing, validation)
- **%Populate mixin**: Add `%Populate` to enable test data generation
- **Adapter pattern**: Combine persistent storage with interface adapters

#### Pitfalls to Avoid

- Changing the order of superclasses can change which methods are inherited
- Adding a new superclass in the middle of the list may break existing behavior
- Diamond inheritance (where two superclasses share a common ancestor) is handled automatically but can create subtle issues
- Property name collisions between superclasses cause compiler errors if types differ

### Documentation References

- [Class Inheritance](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes_inheritance)
- [Multiple Inheritance](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes_inheritance#GOBJ_classes_multiple)

## 6. Documents classes (Description keyword, /// comments)

### Key Points

- **/// comments** placed before a class, property, or method become the Description in the class reference
- The **Description keyword** can also be used in class/member definitions
- Documentation is accessible via the Class Reference in the Management Portal and Studio
- Supports **HTML formatting** within descriptions
- Good documentation is essential for maintainability and team collaboration

### Detailed Notes

#### Overview

InterSystems IRIS provides a built-in documentation system that extracts specially formatted comments from class source code and presents them in the Class Reference documentation browser. Proper documentation helps other developers understand your code and is a professional best practice.

#### Using /// Comments

Lines beginning with `///` immediately before a class, property, method, or other class member are treated as the member's description. These comments support HTML markup.

```objectscript
/// This class represents a patient in the healthcare system.
/// <p>It stores demographic information and provides methods
/// for managing patient records.</p>
Class Sample.Patient Extends %Persistent
{
    /// The patient's full legal name as it appears on their ID.
    Property Name As %String(MAXLEN = 200);

    /// The patient's date of birth in $HOROLOG format.
    Property DOB As %Date;

    /// Calculate the patient's age based on their date of birth.
    /// <p>Returns the age in whole years.</p>
    /// <example>
    /// Set age = patient.GetAge()
    /// Write "Patient is ", age, " years old"
    /// </example>
    Method GetAge() As %Integer
    {
        // Method implementation
        Return $HOROLOG - ..DOB \ 365.25
    }
}
```

#### Using the Description Keyword

Alternatively, the `Description` keyword can be used within member definitions:

```objectscript
Property Name As %String [ Description = "The patient's full legal name" ];
```

However, `///` comments are generally preferred because they are easier to read and maintain in the source code.

#### HTML Tags Supported in Documentation

- `<p>` - Paragraphs
- `<b>`, `<i>` - Bold and italic
- `<ul>`, `<ol>`, `<li>` - Lists
- `<table>`, `<tr>`, `<td>` - Tables
- `<code>` - Inline code
- `<example>` - Code example blocks (InterSystems-specific tag)
- `<class>ClassName</class>` - Links to other class documentation
- `<method>MethodName</method>` - Links to methods
- `<property>PropertyName</property>` - Links to properties

#### Viewing Documentation

Class documentation can be viewed through:

- **Management Portal**: System Explorer &gt; Classes &gt; select class &gt; Documentation tab
- **VS Code Extension**: Hover over class/member names to see descriptions
- **Class Reference**: Generated HTML documentation browsable by package

#### Best Practices

- Document every public class and method with `///` comments
- Include parameter descriptions and return value explanations for methods
- Use `<example>` tags to show usage patterns
- Document non-obvious behavior, edge cases, and assumptions
- Keep descriptions concise but informative

### Documentation References

- [Documenting Classes](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes_documenting)
- [Class Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_class_desc)

## Exam Preparation Summary

### Critical Concepts to Master:

1. When to use %Persistent vs %RegisteredObject vs %SerialObject vs utility classes (no superclass)
2. The complete object lifecycle: %New() -&gt; property setting -&gt; %Save() -&gt; %Id()
3. Always checking %Status return values from %Save() and %DeleteId()
4. Difference between %DeleteExtent() (safe, triggers callbacks) and %KillExtent() (fast, no callbacks)
5. How storage definitions map properties to globals (DataLocation, IdLocation, IndexLocation)
6. USEEXTENTSET parameter and when to use it
7. Left-to-right priority in multiple inheritance
8. How /// comments generate class reference documentation

### Common Exam Scenarios:

- Given a requirement, selecting the correct object class type (persistent, registered, serial)
- Identifying the correct sequence to create and save an object
- Interpreting a storage definition to determine which global stores the data
- Predicting which method is inherited when multiple superclasses define the same method
- Determining what happens when %DeleteId() is called on an object with foreign key references

### Hands-On Practice Recommendations:

- Create persistent and serial classes, save objects, and inspect the underlying globals with ZWrite
- Experiment with %DeleteId() and %DeleteExtent() and observe the global changes
- Build a multiple inheritance scenario and verify which method wins
- Add /// documentation to a class and view it in the Class Reference
- Examine storage definitions of existing system classes to understand the structure

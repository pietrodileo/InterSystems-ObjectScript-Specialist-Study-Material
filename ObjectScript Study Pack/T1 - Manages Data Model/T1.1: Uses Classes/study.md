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

- **%Persistent**: Choose this when an object needs its own database identity and must remain available after the process ends. For example, a patient or invoice can be saved as a row and reopened by its object ID.
- **%RegisteredObject**: Choose this for an object that is useful while code is running but does not need automatic database storage. A request context or a calculation object is a typical example.
- **%SerialObject**: Choose this for a structured value that belongs to another object, such as an address inside a patient record. The parent stores it; the address has no separate persistent ID.
- **A class without a superclass**: Use a class method for stateless operations, such as a shared number-formatting function. The class has no object instances to create with %New().
- Choose the class from the data's lifecycle and ownership: save independent business records, keep temporary state in memory, and embed details that have no independent identity.

### Detailed Notes

#### Start with the object's lifecycle

An object class defines the properties and methods available to its instances. The superclass in the `Extends` clause determines the object behavior the class inherits. In IRIS, `%Persistent` and `%SerialObject` build on the object API provided by `%RegisteredObject`, then add different storage behavior. For example, a patient is an independent record, an address can be part of that patient, and a request context may only be needed while a request is processed.

The word *object* can refer either to a class instance in memory or, more specifically, to a stored persistent record. These are not the same thing: calling `%New()` creates an in-memory instance, while only a successful `%Save()` on a persistent object writes its record to the database. The examples below show what that means for each class kind.

#### Persistent classes: records with their own identity

A class that extends `%Persistent` represents objects IRIS can save, reopen, and delete. A persistent class is also projected as an SQL table, and each saved object is a row with an object ID. Use it when the entity must be managed independently—for example, when an invoice needs its own ID, must be found by SQL, or must remain available to another process after the current request ends.

```objectscript
Class Tutor.Patient Extends %Persistent
{
    Property MedicalRecordNumber As %String;
    Property Name As %String;
}
```

Creating a patient with `%New()` does not save it yet. Set its properties, call `%Save()`, check the returned status, and then read `%Id()`. The ID identifies the saved object; it is not a row count, and an assigned ID alone does not prove that an enclosing transaction has committed.

```objectscript
set patient = ##class(Tutor.Patient).%New()
set patient.Name = "Ada Lovelace"
set patient.MedicalRecordNumber = "MRN-1042"
set sc = patient.%Save()
if $SYSTEM.Status.IsError(sc) {
    write $SYSTEM.Status.GetErrorText(sc), !
    quit
}
write "Saved patient ID: ", patient.%Id(), !
```

After saving, another part of the application can reopen the record by ID, and SQL can query the class as a table. For example, `%OpenId(id)` reopens the patient, while `SELECT Name FROM Tutor.Patient WHERE ID = ?` queries the projected table.

#### Registered objects: useful state held in memory

A class that extends `%RegisteredObject` supports object properties, instance methods, and inheritance, but it does not provide automatic database persistence. Use it for state that belongs to an active operation—for example, a request context carrying a correlation ID or a helper that gathers intermediate results. Its values are available to code holding the object reference in the current process; they are not saved as a database row and are not shared automatically with another process.

```objectscript
Class Tutor.RequestContext Extends %RegisteredObject
{
    Property CorrelationId As %String;
    Property UserName As %String;
}
```

Create and use a registered object with `%New()`, just like an in-memory object, but do not call `%Save()` on it. If the correlation ID must be available after the request or process ends, copy it into a persistent record or another explicitly shared store.

```objectscript
set context = ##class(Tutor.RequestContext).%New()
set context.CorrelationId = "req-42"
set context.UserName = "Ada"
write context.CorrelationId, " for ", context.UserName, !
```

#### Serial objects: structured values embedded in a parent

A class that extends `%SerialObject` describes an embedded value, sometimes called an embeddable object. It is useful when a group of fields belongs to a parent and has no independent identity—for example, a patient's home address. A serial object can be created and used in memory, but it cannot be saved, opened, or identified independently as a persistent record. When the parent is persistent, save the parent to store the serial object's values with it.

```objectscript
Class Tutor.Address Extends %SerialObject
{
    Property Street As %String;
    Property City As %String;
    Property PostalCode As %String;
}
```

Add the serial object as a property of the persistent class. IRIS does not require a separate `%New()` call for the serial property before assigning its fields; saving the patient saves the address as part of that patient.

```objectscript
// Add this property inside Tutor.Patient:
Property HomeAddress As Tutor.Address;

// In a method, after compiling Tutor.Address and Tutor.Patient:
set patient = ##class(Tutor.Patient).%New()
set patient.Name = "Ada Lovelace"
set patient.HomeAddress.Street = "12 Example Street"
set patient.HomeAddress.City = "London"
set sc = patient.%Save()
```

With the default SQL projection, the embedded fields can be queried through columns based on both property names. For example, `HomeAddress.City` is commonly exposed as `HomeAddress_City`:

```sql
SELECT Name, HomeAddress_City, HomeAddress_PostalCode
FROM Tutor.Patient;
```

This keeps the class model readable without hiding the fields from SQL. If a class customizes its SQL projection or storage, inspect that class's generated SQL definition for the exact column names.

#### Classes without a superclass: class-level helpers

A class without an `Extends` clause is not an object class, so you do not create instances from it with `%New()`. It can still group class-level behavior, such as a calculation used throughout an application. Use this form when the operation has no per-instance state; use `%RegisteredObject` instead when each helper instance needs its own properties.

```objectscript
Class Tutor.NumberTools
{
    ClassMethod Double(value As %Integer) As %Integer
    {
        return value * 2
    }
}
```

Call the class method directly, without creating an object. For example, `##class(Tutor.NumberTools).Double(21)` returns `42`.

#### Compare the choices

| Question | %Persistent | %RegisteredObject | %SerialObject | No superclass |
| --- | --- | --- | --- | --- |
| Does it have its own database record? | Yes, after a successful save | No automatic record | No; stored through its parent | No |
| Does it have an independent object ID? | Yes | No persistent ID | No | No object instance |
| Typical use | Patient, order, invoice | Request context, temporary helper | Address or other value inside a record | Stateless class method |
| How is it accessed? | Create, save, reopen by ID | Create and use in memory | Set through the parent property | Call a class method |

A useful design check is to ask what should happen to the data after the current operation. If it must be found tomorrow by ID or queried as a record, make it persistent. If it is only working state, make it registered. If it is meaningful only as part of a parent, make it serial. If there is no instance state at all, a class method on a class without a superclass may be enough.

### Documentation References

- [Object Classes](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes)
- [Persistent Objects](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_persobj)
- [Working with Registered Objects](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_objapi)
- [Object-Valued Properties and Serial Objects](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propobj)
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

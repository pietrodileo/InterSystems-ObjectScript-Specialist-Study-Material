[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.1: Uses Classes

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.1.html). Reference links require internet access.

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

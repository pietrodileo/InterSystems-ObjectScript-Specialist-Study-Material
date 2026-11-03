[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.1: Uses Classes

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.1.html). Reference links require internet access.

## 2. Creates and saves a persistent object (%New(), %Save(), %Id())

![T1.1 visual summary of sections 1–3: 1. Identifies use cases for persistent and registered object classes; 2. Creates and saves a persistent object (%New(), %Save(), %Id()); 3. Deletes objects (%DeleteId(), %DeleteExtent())](../visual-guide-01.png)

*This diagram covers sections 1–3; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

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

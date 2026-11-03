[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.2: Creates Properties and Indexes

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.2.html). Reference links require internet access.

## 7. Recalls how foreign keys enforce referential integrity (ForeignKey, OnDelete, NoAction, Cascade)

![T1.2 visual summary of sections 5–7: 5. Selects appropriate index type based on data distribution (standard, bitmap, bitslice); 6. Uses unique index methods (unique index, %ExistsId); 7. Recalls how foreign keys enforce referential integrity (ForeignKey, OnDelete, NoAction, Cascade)](../visual-guide-02.png)

*This diagram covers sections 5–7; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **ForeignKey** defines a relationship between two persistent classes, enforcing that references are valid
- **OnDelete** controls behavior when the referenced object is deleted: NoAction, Cascade, SetNull
- **OnUpdate** controls behavior when the referenced key changes (rarely used since IDs are immutable)
- Foreign keys are validated during %Save() and enforced in SQL operations
- Foreign keys reference a **unique index or IdKey** in the target class

### Detailed Notes

#### Overview

Foreign keys enforce referential integrity by ensuring that relationships between objects remain valid. When a class declares a foreign key, it guarantees that the referenced object exists in the target class before the referencing object can be saved.

#### Defining Foreign Keys

```objectscript
Class Sample.Order Extends %Persistent
{
    Property OrderDate As %Date;
    Property CustomerID As %Integer;

    /// Foreign key referencing the Customer class
    ForeignKey CustomerFK(CustomerID)
        References Sample.Customer(CustomerIDIdx);
}

Class Sample.Customer Extends %Persistent
{
    Property CustomerID As %Integer;
    Property Name As %String;

    Index CustomerIDIdx On CustomerID [ Unique ];
}
```

The foreign key declaration specifies: 1. A name for the constraint (`CustomerFK`) 2. The local property(ies) (`CustomerID`) 3. The referenced class and unique index (`Sample.Customer(CustomerIDIdx)`)

#### OnDelete Actions

The `OnDelete` keyword controls what happens when a referenced (parent) object is deleted:

```objectscript
ForeignKey CustomerFK(CustomerID)
    References Sample.Customer(CustomerIDIdx)
    [ OnDelete = cascade ];
```

| OnDelete Value | Behavior |
| --- | --- |
| **noaction** (default) | Deletion fails if referencing objects exist |
| **cascade** | Referencing objects are automatically deleted |
| **setnull** | Foreign key property in referencing objects is set to NULL |
| **setdefault** | Foreign key property is set to its default value |

#### NoAction Example

```objectscript
// With NoAction (default), this fails if orders reference the customer
Set sc = ##class(Sample.Customer).%DeleteId(1)
// Returns error: "Foreign key constraint violation"
```

#### Cascade Example

```objectscript
// With Cascade, deleting a customer also deletes all their orders
ForeignKey CustomerFK(CustomerID)
    References Sample.Customer(CustomerIDIdx)
    [ OnDelete = cascade ];

// Deleting customer 1 also deletes all orders where CustomerID = 1
Set sc = ##class(Sample.Customer).%DeleteId(1)
```

#### Insert Validation

Foreign keys are checked on INSERT/SAVE. Attempting to save an order with a CustomerID that doesn't exist in the Customer table returns an error:

```objectscript
Set order = ##class(Sample.Order).%New()
Set order.CustomerID = 9999  // No such customer
Set sc = order.%Save()
// Error: foreign key constraint violation
```

#### Compound Foreign Keys

Foreign keys can reference compound (multi-property) unique indexes:

```objectscript
ForeignKey LocationFK(Country, City)
    References Sample.Location(CountryCityIdx);
```

#### Important Considerations

- Foreign keys add overhead to INSERT, UPDATE, and DELETE operations
- They are enforced at both the object level (%Save) and SQL level
- The referenced index must be a unique index or IdKey
- Foreign keys project as SQL FOREIGN KEY constraints
- Use them judiciously: they improve data integrity but impact write performance

### Documentation References

- [Foreign Keys](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_foreignkey)
- [Referential Integrity](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_foreignkeys)

[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.3: Creates ObjectScript Methods

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.3.html). Reference links require internet access.

## 8. Determines when to use ##super for calling superclass methods

![T1.3 visual summary of sections 5–8: 5. Passes variables by reference (ByRef, .variable syntax at call site); 6. Passes multidimensional variables by reference (passing arrays); 7. Uses and overrides inherited methods (overriding, calling parent); 8. Determines when to use ##super for calling superclass methods](../visual-guide-02.png)

*This diagram covers sections 5–8; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **##super()** calls the superclass implementation of the current method
- Use ##super when you want to **extend** parent behavior, not replace it entirely
- Common pattern: call ##super first for initialization, then add custom logic
- ##super follows the **inheritance chain** (calls the next class in MRO)
- Critical in %OnNew(), %OnOpen(), %OnValidateObject(), and other callback methods

### Detailed Notes

#### Overview

When overriding a method, you often want to keep the parent's behavior and add to it rather than completely replacing it. The `##super()` macro calls the parent class's version of the method. This is especially important in callback methods where the parent class performs essential setup.

#### Basic ##super Usage

```objectscript
Class Sample.Employee Extends Sample.Person
{
    Property Department As %String;

    Method Describe() As %String
    {
        // Get the parent description first
        Set desc = ##super()
        // Extend it with employee-specific info
        Return desc _ " (Dept: " _ ..Department _ ")"
    }
}
```

#### ##super in Callback Methods

Callback methods like `%OnNew()`, `%OnValidateObject()`, and `%OnAfterSave()` are defined in system classes. When you override them, you should typically call `##super()` to ensure the system's behavior is preserved:

```objectscript
Class Sample.AuditedRecord Extends %Persistent
{
    Property CreatedBy As %String;
    Property CreatedDate As %Date;
    Property ModifiedDate As %Date;

    Method %OnNew(initvalue As %String) As %Status
    {
        // Call parent's %OnNew first
        Set sc = ##super(initvalue)
        If $$$ISERR(sc) Return sc

        // Add custom initialization
        Set ..CreatedBy = $USERNAME
        Set ..CreatedDate = +$HOROLOG
        Set ..ModifiedDate = +$HOROLOG
        Return $$$OK
    }

    Method %OnBeforeSave(insert As %Boolean) As %Status
    {
        Set sc = ##super(insert)
        If $$$ISERR(sc) Return sc

        // Update modified date on every save
        Set ..ModifiedDate = +$HOROLOG
        Return $$$OK
    }
}
```

#### When to Use ##super

| Scenario | Use ##super? | Reason |
| --- | --- | --- |
| Extending parent behavior | Yes | Preserve parent logic, add your own |
| Completely replacing behavior | No | Parent logic not needed |
| Callback methods (%OnNew, etc.) | Usually yes | Parent may perform essential setup |
| Abstract method override | No | Parent has no implementation |
| Multiple inheritance | Yes (carefully) | ##super follows the MRO chain |

#### ##super with Arguments

Pass the same arguments through to the parent:

```objectscript
Method Process(data As %String, options As %String = "") As %Status
{
    // Pre-processing
    Set data = $ZSTRIP(data, "<>W")

    // Call parent with the modified data
    Set sc = ##super(data, options)
    If $$$ISERR(sc) Return sc

    // Post-processing
    Do ..LogActivity("Processed: " _ data)
    Return $$$OK
}
```

#### ##super in Multiple Inheritance

With multiple inheritance, `##super()` calls the next class in the method resolution order, not necessarily the "parent" in a single-inheritance sense:

```objectscript
Class MyApp.C Extends (MyApp.A, MyApp.B)
{
    Method Init() As %Status
    {
        // Calls MyApp.A's Init (leftmost superclass)
        Return ##super()
    }
}
```

#### Common Pitfall: Forgetting ##super

Forgetting to call `##super()` in `%OnNew()` or `%OnValidateObject()` can break parent class initialization or validation. Always consider whether the parent has logic you need to preserve.

### Documentation References

- [##super](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes_inheritance)
- [Overriding Methods](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes_inheritance)

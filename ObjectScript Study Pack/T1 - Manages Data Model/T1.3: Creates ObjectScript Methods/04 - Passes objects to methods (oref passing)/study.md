[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.3: Creates ObjectScript Methods

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.3.html). Reference links require internet access.

## 4. Passes objects to methods (oref passing)

![T1.3 visual summary of sections 1–4: 1. Differentiates between instance and class methods (Method vs ClassMethod, ..property syntax); 2. Uses class parameters inside methods (..#ParameterName); 3. Specifies method arguments and return type (As clause, Output, ByRef); 4. Passes objects to methods (oref passing)](../visual-guide-01.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- Object references (orefs) are passed **by value** by default, but the oref is a pointer to the object
- Modifying properties of a passed object affects the original object (shared reference)
- Assigning a new object to the parameter variable does NOT affect the caller's variable
- Type checking is performed at compile time when argument types are specified
- Objects are reference-counted; they persist as long as at least one variable references them

### Detailed Notes

#### Overview

When you pass an object to a method, you are passing the object reference (oref), which is essentially a pointer to the in-memory object. Understanding this is critical for avoiding bugs related to unintended modifications or lost references.

#### Passing Objects

```objectscript
Class Sample.OrderProcessor Extends %RegisteredObject
{
    ClassMethod ApplyDiscount(order As Sample.Order, pct As %Numeric)
    {
        // This modifies the ORIGINAL order object
        Set order.Total = order.Total * (1 - (pct / 100))
    }

    ClassMethod ProcessOrder(order As Sample.Order) As %Status
    {
        // Validate the order
        If order.Total <= 0 {
            Return $$$ERROR($$$GeneralError, "Invalid total")
        }
        // Modify the order's status
        Set order.Status = "Processed"
        Return order.%Save()
    }
}
```

Usage:

```objectscript
Set order = ##class(Sample.Order).%OpenId(1)
Write "Before: ", order.Total, !         // e.g., 100
Do ##class(Sample.OrderProcessor).ApplyDiscount(order, 10)
Write "After: ", order.Total, !          // 90 (original object modified)
```

#### Value Semantics of the Reference

The oref itself is passed by value. Reassigning the parameter variable inside the method does not change the caller's variable:

```objectscript
ClassMethod ResetOrder(order As Sample.Order)
{
    // This does NOT affect the caller's variable
    Set order = ##class(Sample.Order).%New()
    Set order.Total = 0
}
```

```objectscript
Set myOrder = ##class(Sample.Order).%OpenId(1)
Do ##class(Sample.OrderProcessor).ResetOrder(myOrder)
// myOrder still points to the original object (ID 1), unchanged
```

To actually modify the caller's variable, use `ByRef` or `Output`:

```objectscript
ClassMethod ResetOrder(ByRef order As Sample.Order)
{
    Set order = ##class(Sample.Order).%New()
    Set order.Total = 0
}
// Now calling with: Do ##class(...).ResetOrder(.myOrder) changes myOrder
```

#### Passing Objects in Collections

```objectscript
ClassMethod ProcessAll(orders As %ListOfObjects) As %Status
{
    For i = 1:1:orders.Count() {
        Set order = orders.GetAt(i)
        Set order.Status = "Processed"
    }
    Return $$$OK
}
```

#### Checking Object Type at Runtime

```objectscript
ClassMethod HandleItem(item As %RegisteredObject)
{
    If item.%IsA("Sample.Order") {
        // Order-specific logic
    } ElseIf item.%IsA("Sample.Invoice") {
        // Invoice-specific logic
    }
}
```

### Documentation References

- [Object References](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods)
- [Passing Arguments](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods_arguments)

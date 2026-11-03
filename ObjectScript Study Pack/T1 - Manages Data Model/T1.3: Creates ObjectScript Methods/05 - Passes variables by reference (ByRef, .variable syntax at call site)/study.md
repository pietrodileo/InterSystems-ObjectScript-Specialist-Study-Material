[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.3: Creates ObjectScript Methods

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.3.html). Reference links require internet access.

## 5. Passes variables by reference (ByRef, .variable syntax at call site)

![T1.3 visual summary of sections 5–8: 5. Passes variables by reference (ByRef, .variable syntax at call site); 6. Passes multidimensional variables by reference (passing arrays); 7. Uses and overrides inherited methods (overriding, calling parent); 8. Determines when to use ##super for calling superclass methods](../visual-guide-02.png)

*This diagram covers sections 5–8; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- The **dot (.)** prefix at the call site is the **only** mechanism that controls pass-by-reference — it is the caller's decision
- `ByRef` in the method signature is purely indicative (documentation) — it has no runtime effect
- Without the dot, the value is **always** passed by value, regardless of `ByRef` in the signature
- With the dot, the value is **always** passed by reference, even if the signature has no `ByRef`
- ByRef passes the existing value IN and allows a new value OUT

### Detailed Notes

#### Overview

By default, ObjectScript passes arguments by value. When a method needs to modify a variable in the caller's scope, the **caller** must pass by reference using the dot (`.`) prefix. The `ByRef` keyword in the signature is best practice for documentation but has no enforcement effect — it is purely the caller's responsibility to use the dot.

#### Basic ByRef Pattern

```objectscript
ClassMethod Swap(ByRef a As %String, ByRef b As %String)
{
    Set temp = a
    Set a = b
    Set b = temp
}
```

Calling:

```objectscript
Set x = "Hello"
Set y = "World"
Do ##class(Sample.Util).Swap(.x, .y)
Write x  // "World"
Write y  // "Hello"
```

#### Forgetting the Dot

A common mistake is forgetting the dot at the call site:

```objectscript
Set x = "Hello"
Set y = "World"
Do ##class(Sample.Util).Swap(x, y)  // NO dots - passed by value!
Write x  // Still "Hello" - unchanged
Write y  // Still "World" - unchanged
```

The method executes without error, but the caller's variables are not modified because copies were passed.

#### Output vs ByRef Revisited

With `Output`, the variable's initial value is not passed into the method:

```objectscript
ClassMethod GetInfo(Output name As %String, Output count As %Integer)
{
    Set name = "Test"
    Set count = 42
}

// Calling:
Do ##class(Sample.Util).GetInfo(.n, .c)
Write n   // "Test"
Write c   // 42
```

With `ByRef`, the existing value IS available inside the method:

```objectscript
ClassMethod AppendSuffix(ByRef text As %String, suffix As %String)
{
    Set text = text _ suffix
}

Set myText = "Hello"
Do ##class(Sample.Util).AppendSuffix(.myText, " World")
Write myText  // "Hello World"
```

#### Practical Example: Error Collection

```objectscript
ClassMethod ValidateRecord(record As Sample.Record, ByRef errors As %List) As %Boolean
{
    // errors may already contain items from prior validation
    If record.Name = "" {
        Set errors = errors _ $LB("Name is required")
    }
    If record.Age < 0 {
        Set errors = errors _ $LB("Age must be positive")
    }
    Return ($LISTLENGTH(errors) = 0)
}
```

### Documentation References

- [Passing by Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods_arguments)
- [Method Arguments](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods_arguments)

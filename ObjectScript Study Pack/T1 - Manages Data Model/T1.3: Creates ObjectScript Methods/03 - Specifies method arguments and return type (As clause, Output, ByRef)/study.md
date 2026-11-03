[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.3: Creates ObjectScript Methods

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.3.html). Reference links require internet access.

## 3. Specifies method arguments and return type (As clause, Output, ByRef)

![T1.3 visual summary of sections 1–4: 1. Differentiates between instance and class methods (Method vs ClassMethod, ..property syntax); 2. Uses class parameters inside methods (..#ParameterName); 3. Specifies method arguments and return type (As clause, Output, ByRef); 4. Passes objects to methods (oref passing)](../visual-guide-01.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **As ClassName** specifies the return type of a method
- Method arguments are declared with name, optional type, and optional default value
- **Output** keyword indicates the argument is output-only (not passed in)
- **ByRef** keyword indicates the argument is passed by reference (both in and out)
- **Important:** `ByRef` and `Output` in the formal parameter list are purely **indicative** — they have no intrinsic effect on how the argument is passed. It is the **caller** who decides by using the dot (`.`) prefix. The method would work the same even without `ByRef`/`Output` in the signature.
- Default values are specified with `= value` in the argument list

### Detailed Notes

#### Overview

Well-defined method signatures improve code clarity, enable better compile-time checking, and generate accurate documentation. InterSystems IRIS supports typed arguments, return types, default values, and reference parameters.

#### Basic Method Signature

```objectscript
Method Calculate(x As %Numeric, y As %Numeric) As %Numeric
{
    Return x + y
}
```

The `As %Numeric` after the closing parenthesis specifies the return type. Argument types follow each argument name.

#### Default Values

```objectscript
Method FormatDate(date As %Date, format As %String = "YYYY-MM-DD") As %String
{
    // format defaults to "YYYY-MM-DD" if not provided
    Return $ZDate(date, 3)
}
```

Calling with or without the optional parameter:

```objectscript
Set result = obj.FormatDate($HOROLOG)          // uses default format
Set result = obj.FormatDate($HOROLOG, "MM/DD") // overrides default
```

#### Output Parameters

The `Output` keyword marks an argument as output-only. The caller should not pass a value in; the method will set it:

```objectscript
ClassMethod Divide(a As %Numeric, b As %Numeric, Output result As %Numeric) As %Status
{
    If b = 0 Return $$$ERROR($$$GeneralError, "Division by zero")
    Set result = a / b
    Return $$$OK
}
```

Calling with an output parameter (use the dot prefix):

```objectscript
Set sc = ##class(Sample.Math).Divide(10, 3, .answer)
If $$$ISOK(sc) Write "Result: ", answer, !
```

#### ByRef Parameters

The `ByRef` keyword marks an argument as pass-by-reference. The caller's variable is both read and modified:

```objectscript
ClassMethod Increment(ByRef counter As %Integer, amount As %Integer = 1)
{
    Set counter = counter + amount
}
```

Calling:

```objectscript
Set myCount = 5
Do ##class(Sample.Util).Increment(.myCount, 3)
Write myCount  // Outputs: 8
```

#### Key Distinction: Output vs ByRef

| Aspect | Output | ByRef |
| --- | --- | --- |
| Initial value passed in | No (undefined inside method) | Yes (caller's value available) |
| Value returned to caller | Yes | Yes |
| Caller syntax | `.variable` | `.variable` |
| Semantic meaning | Method produces a value | Method reads and modifies a value |

#### Critical: ByRef and Output Are Purely Indicative

In ObjectScript, `ByRef` and `Output` in the formal parameter list are **documentation hints only** — they have no enforcement or runtime effect. The passing mechanism is controlled **entirely by the caller** using the dot (`.`) prefix.

This means:

- A caller can use `.variable` even if the parameter is **not** declared `ByRef` or `Output` — and it works
- A caller can omit the dot even if the parameter **is** declared `ByRef` — and it simply passes by value
- You could remove `ByRef`/`Output` from every method signature and everything would still function identically

```objectscript
/// No ByRef or Output keyword — but pass-by-reference still works!
ClassMethod AddSuffix(text As %String, suffix As %String)
{
    Set text = text _ suffix
}
```

```objectscript
Set myText = "Hello"
Do ##class(Sample.Util).AddSuffix(.myText, " World")
Write myText  // "Hello World" — modified despite no ByRef in signature!
```

**Best practice:** Always declare `ByRef` or `Output` in the signature as documentation for the caller, even though the keywords themselves have no effect. They signal the intended contract of the method.

#### Methods Returning %Status

A common pattern is to return `%Status` and use Output parameters for actual results:

```objectscript
ClassMethod ProcessData(input As %String, Output result As %String, Output errorMsg As %String) As %Status
{
    If input = "" {
        Set errorMsg = "Input cannot be empty"
        Return $$$ERROR($$$GeneralError, errorMsg)
    }
    Set result = $ZCONVERT(input, "U")
    Return $$$OK
}
```

### Documentation References

- [Method Arguments](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods_arguments)
- [Method Keywords](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_method)

[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.3: Creates ObjectScript Methods

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.3.html). Reference links require internet access.

## 6. Passes multidimensional variables by reference (passing arrays)

![T1.3 visual summary of sections 5–8: 5. Passes variables by reference (ByRef, .variable syntax at call site); 6. Passes multidimensional variables by reference (passing arrays); 7. Uses and overrides inherited methods (overriding, calling parent); 8. Determines when to use ##super for calling superclass methods](../visual-guide-02.png)

*This diagram covers sections 5–8; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- ObjectScript supports **multidimensional variables** (arrays with subscripts)
- Pass arrays by reference using the **dot (.)** prefix to share the entire tree of subscripts
- The method receives the array with all its subscripts intact
- Use **$ORDER** to iterate over subscripts
- Arrays cannot be passed by value (only the top node would be copied without subscripts)

### Detailed Notes

#### Overview

Multidimensional variables (arrays) are a fundamental data structure in ObjectScript. They store data at multiple subscript levels within a single variable name. Passing arrays to methods requires by-reference passing to include all subscript levels.

#### Multidimensional Variable Basics

```objectscript
Set colors("red") = "#FF0000"
Set colors("green") = "#00FF00"
Set colors("blue") = "#0000FF"
Set colors("blue", "light") = "#ADD8E6"
Set colors("blue", "dark") = "#00008B"
```

#### Passing Arrays to Methods

```objectscript
ClassMethod DisplayColors(ByRef colors)
{
    Set key = ""
    For {
        Set key = $ORDER(colors(key))
        Quit:key=""
        Write key, ": ", colors(key), !
    }
}
```

Calling:

```objectscript
Set colors("red") = "#FF0000"
Set colors("green") = "#00FF00"
Set colors("blue") = "#0000FF"
Do ##class(Sample.Util).DisplayColors(.colors)
```

Output:

```text
blue: #0000FF
green: #00FF00
red: #FF0000
```

#### Building Arrays Inside Methods

```objectscript
ClassMethod GetStateCounts(Output states)
{
    &sql(DECLARE C1 CURSOR FOR
         SELECT State, COUNT(*) FROM Sample.Person GROUP BY State)
    &sql(OPEN C1)
    For {
        &sql(FETCH C1 INTO :state, :cnt)
        Quit:SQLCODE'=0
        Set states(state) = cnt
    }
    &sql(CLOSE C1)
}
```

Calling:

```objectscript
Do ##class(Sample.Util).GetStateCounts(.states)
Set st = "" For {
    Set st = $ORDER(states(st)) Quit:st=""
    Write st, ": ", states(st), !
}
```

#### Multi-Level Array Passing

```objectscript
ClassMethod ProcessTree(ByRef tree, level As %Integer = 0)
{
    Set key = ""
    For {
        Set key = $ORDER(tree(key))
        Quit:key=""
        Write ?level*4, key, ": ", $GET(tree(key)), !
        // Recursively process sub-nodes
        // Note: must merge to a temp variable for recursive call
        Merge sub = tree(key)
        If $DATA(sub) > 1 {
            Do ..ProcessTree(.sub, level + 1)
        }
        Kill sub
    }
}
```

#### Using $DATA to Check Array Nodes

```objectscript
// $DATA returns:
// 0 - node doesn't exist
// 1 - node has data, no children
// 10 - node has children but no data
// 11 - node has both data and children

If $DATA(arr("key")) > 9 {
    Write "Has child subscripts", !
}
```

#### MERGE Command for Array Operations

```objectscript
// Copy an entire array
Merge targetArr = sourceArr

// Copy a subtree
Merge targetArr = sourceArr("subtree")
```

### Documentation References

- [Multidimensional Arrays](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables)
- [Passing Variables by Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods_arguments)

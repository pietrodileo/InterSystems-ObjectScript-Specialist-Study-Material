[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T4.1: Traverses and Sorts Arrays

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T4.1.html). Reference links require internet access.

## 1. Subscript sorting (canonical numeric order)

![T4.1 visual summary of sections 1–4: 1. Subscript sorting (canonical numeric order); 2. Traversing subscript subset with $ORDER; 3. Multi-level traversal with $ORDER; 4. $DATA to check node existence](../visual-guide-01.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **Canonical numeric order**: Numeric subscripts sort by numeric value: -2, 0, 1, 10
- **String order**: Non-numeric subscripts sort in ASCII collation order after all numerics
- **Mixed subscripts**: Numerics come first, then strings: -2, 0, 1, 10, "A", "B", "a"
- **Canonical form**: A number is canonical if it equals its own numeric interpretation (no leading zeros, no trailing zeros after decimal)
- **Empty string**: The empty string "" sorts before all other subscripts
- **Case sensitivity**: Uppercase letters sort before lowercase ("A" &lt; "B" &lt; "a" &lt; "b")

### Detailed Notes

#### Overview

InterSystems IRIS stores global and local array subscripts in a well-defined collation order. Understanding this order is essential for traversing arrays predictably. The default collation places canonical numeric values first (sorted by numeric value), followed by non-numeric string values (sorted by ASCII/Unicode byte order).

#### Canonical Numeric Order

A subscript is treated as numeric if it is in **canonical form** -- meaning it equals the result of adding zero to it. For example, `1`, `-2`, `3.14`, and `0` are canonical, while `"01"`, `"3.0"`, and `"+5"` are not (those are treated as strings). Canonical numerics sort by their numeric value, so the order is: -2, -1, 0, 0.5, 1, 2, 10, 100.

```objectscript
 // Demonstrate subscript ordering
 SET data(-2) = "neg two"
 SET data(0) = "zero"
 SET data(1) = "one"
 SET data(10) = "ten"
 SET data("A") = "letter A"
 SET data("B") = "letter B"
 SET data("a") = "letter a"

 // Traversing will yield: -2, 0, 1, 10, "A", "B", "a"
 SET key = ""
 FOR {
     SET key = $ORDER(data(key))
     QUIT:key=""
     WRITE key, " = ", data(key), !
 }
```

#### String Collation

Non-canonical subscripts are stored as strings and sort by their byte values. This means uppercase ASCII letters (A-Z, codes 65-90) sort before lowercase letters (a-z, codes 97-122). Strings that look like numbers but are not canonical ("01", "3.0", "+5") sort as strings, not numbers.

```objectscript
 // "01" is NOT canonical numeric -- it sorts as a string
 SET arr(1) = "canonical one"
 SET arr("01") = "string zero-one"

 // Both nodes exist separately!
 // $ORDER yields: 1, then "01"
 SET key = ""
 FOR {
     SET key = $ORDER(arr(key))
     QUIT:key=""
     WRITE key, " -> ", arr(key), !
 }
 // Output: 1 -> canonical one
 //         01 -> string zero-one
```

#### Practical Implications

When designing globals, choose subscripts carefully. If you need predictable numeric sort, ensure values are canonical. If you mix types, be aware that `-3`, `0`, `5` sort first, then `"Apple"`, `"Banana"`, `"apple"` follow. This ordering is consistent across local arrays, process-private globals, and persistent globals.

### Documentation References

- [Subscript Sorting](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables)
- [Canonical Form](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables)
- [Collation and Subscript-Level Mapping](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GGBL_structure)

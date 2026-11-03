[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T4.4: Mathematical, Logical, and Date/Time Operations

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T4.4.html). Reference links require internet access.

## 2. Logical operators

![T4.4 visual summary of sections 1–4: 1. Mathematical operators; 2. Logical operators; 3. $ZDATE, $ZTIME, $HOROLOG; 4. Date arithmetic](../visual-guide-01-v2.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **AND**: && or & -- both operands must be true
- **OR**: || or ! (legacy) -- at least one operand must be true
- **NOT**: ' (apostrophe) -- negation: 'condition
- **Also left-to-right**: Logical operators follow the same left-to-right rule
- **Short-circuit with &&/||**: Double-character forms short-circuit; single-character forms do not
- **Comparison operators**: = (equal), '= (not equal), &lt; (less), &gt; (greater), &lt;= (not greater), &gt;= (not less)
- **String comparison**: Uses default collation; numeric strings compared numerically

### Detailed Notes

#### Overview

ObjectScript logical operators also follow strict left-to-right evaluation. The language provides both short-circuit (&&, ||) and non-short-circuit (&, !) logical operators. The NOT operator is the apostrophe character ('), which can also prefix comparison operators.

#### Logical Operators

```objectscript
 SET x = 5, y = 10

 // AND: && (short-circuit) or & (evaluates both)
 IF (x > 0) && (y > 0) WRITE "Both positive", !
 IF (x > 0) & (y > 0) WRITE "Both positive", !

 // OR: || (short-circuit) or ! (legacy, evaluates both)
 IF (x > 100) || (y > 5) WRITE "At least one true", !

 // NOT: ' (apostrophe)
 IF 'x WRITE "x is false/zero", !         // doesn't print (x=5, truthy)
 IF '0 WRITE "0 is falsy", !              // prints

 // Short-circuit demonstration
 // With &&, second operand not evaluated if first is false
 SET obj = ""
 IF (obj '= "") && (obj.Name = "test") {
     // Safe: second part not evaluated when obj=""
 }
```

#### Comparison Operators

```objectscript
 SET a = 5, b = 10

 WRITE a = b, !            // 0 (false)
 WRITE a '= b, !           // 1 (true, not equal)
 WRITE a < b, !            // 1 (true)
 WRITE a > b, !            // 0 (false)
 WRITE a <= b, !           // 1 (true, less or equal)
 WRITE a >= b, !           // 0 (false, greater or equal)

 // Note: <= means "not greater than" ('>) and >= means "not less than" ('<)
 // These are actually: '> and '<
 WRITE a '> b, !           // 1 (same as <=)
 WRITE a '< b, !           // 0 (same as >=)
```

#### Contains Operator ([)

```objectscript
 SET str = "Hello World"

 // [ tests if left operand contains right operand
 IF str [ "World" WRITE "Contains 'World'", !        // prints
 IF str [ "xyz" WRITE "Contains 'xyz'", !            // does not print

 // Case-sensitive
 IF str [ "hello" WRITE "Found", !                   // does not print
```

#### Follows Operator (])

```objectscript
 // ] tests if left operand follows right operand in collation
 WRITE "B" ] "A", !           // 1 (B follows A)
 WRITE "A" ] "B", !           // 0
 WRITE "abc" ] "abb", !       // 1

 // ]] sorts after (string sort, strictly)
 WRITE "10" ]] "9", !         // 0 ("10" sorts before "9" as strings)
```

#### Left-to-Right with Logical Operators

```objectscript
 // Logical operators are also left-to-right!
 SET a = 1, b = 0, c = 1

 // This evaluates as: ((a || b) && c)
 WRITE a || b && c, !         // 1

 // NOT as: (a || (b && c))
 // Use parentheses to get intended behavior
 WRITE a || (b && c), !       // 1
 WRITE (a || b) && c, !       // 1
```

### Documentation References

- [Logical Operators](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_logical)
- [Relational Operators](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_rel)
- [String Relational Operators](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_string_rel)

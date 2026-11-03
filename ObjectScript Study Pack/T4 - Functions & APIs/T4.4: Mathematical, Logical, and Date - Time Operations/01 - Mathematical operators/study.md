[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T4.4: Mathematical, Logical, and Date/Time Operations

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T4.4.html). Reference links require internet access.

## 1. Mathematical operators

![T4.4 visual summary of sections 1–4: 1. Mathematical operators; 2. Logical operators; 3. $ZDATE, $ZTIME, $HOROLOG; 4. Date arithmetic](../visual-guide-01-v2.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **Basic operators**: + (add), - (subtract), \* (multiply), / (divide)
- **Integer division (\)**: Truncates to integer: 7 \ 2 = 3
- **Modulo (#)**: Remainder: 7 # 3 = 1
- **Exponentiation (\*\*)**: Power: 2 \*\* 3 = 8
- **STRICT LEFT-TO-RIGHT**: No operator precedence! 2 + 3 \* 4 = 20, NOT 14
- **Parentheses required**: Use parentheses to enforce intended order: 2 + (3 \* 4) = 14
- **Unary minus**: Prefix minus for negation: SET x = -5

### Detailed Notes

#### Overview

ObjectScript evaluates mathematical expressions strictly from left to right with NO operator precedence. This is one of the most important differences from other languages and a frequent source of bugs for developers coming from C, Java, or Python. The only way to change evaluation order is with parentheses.

#### Left-to-Right Evaluation (CRITICAL!)

```objectscript
 // In most languages: 2 + 3 * 4 = 14 (multiplication first)
 // In ObjectScript:   2 + 3 * 4 = 20 (left to right!)

 WRITE 2 + 3 * 4, !           // 20  (5 * 4, NOT 2 + 12)
 WRITE 2 + (3 * 4), !         // 14  (parentheses force multiplication first)

 WRITE 10 - 2 * 3, !          // 24  ((10-2) * 3)
 WRITE 10 - (2 * 3), !        // 4   (10 - 6)

 WRITE 12 / 3 + 1, !          // 5   ((12/3) + 1)
 WRITE 12 / (3 + 1), !        // 3   (12 / 4)

 // Complex example
 WRITE 2 + 3 * 4 - 1, !       // 19  (((2+3)*4)-1)
 WRITE 2 + (3 * (4 - 1)), !   // 11  (2 + 9)
```

#### Basic Arithmetic

```objectscript
 SET a = 10, b = 3

 WRITE a + b, !                // 13
 WRITE a - b, !                // 7
 WRITE a * b, !                // 30
 WRITE a / b, !                // 3.333333333333333333

 // Integer division (truncates toward zero)
 WRITE 7 \ 2, !                // 3
 WRITE -7 \ 2, !               // -3
 WRITE 10 \ 3, !               // 3

 // Modulo (remainder)
 WRITE 7 # 3, !                // 1
 WRITE 10 # 4, !               // 2
 WRITE 15 # 5, !               // 0

 // Exponentiation
 WRITE 2 ** 3, !               // 8
 WRITE 3 ** 2, !               // 9
 WRITE 10 ** 0, !              // 1
 WRITE 4 ** 0.5, !             // 2 (square root)
```

#### Practical Patterns

```objectscript
 // Check if number is even
 SET n = 42
 IF n # 2 = 0 WRITE n, " is even", !

 // Round to 2 decimal places
 SET price = 19.99 * 1.0825     // tax calculation
 SET rounded = $JUSTIFY(price, 0, 2)
 WRITE rounded, !               // 21.64

 // Always use parentheses for clarity!
 SET total = (quantity * price) + (quantity * price * taxRate)
 SET average = sum / count
 SET circumference = 2 * (3.14159 * radius)
```

#### String-to-Number Coercion

```objectscript
 // ObjectScript coerces strings to numbers for arithmetic
 WRITE "5" + 3, !              // 8
 WRITE "abc" + 3, !            // 3  ("abc" = 0 numerically)
 WRITE "10xyz" + 5, !          // 15 (leading "10" is numeric)
 WRITE "" + 5, !               // 5  ("" = 0)
```

### Documentation References

- [Arithmetic Operators](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_arith)
- [Operator Precedence](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_precedence)

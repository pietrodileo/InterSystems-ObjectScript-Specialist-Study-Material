[All topics](../../index.md) · [Practice quiz](quiz.md)

# T4.4: Mathematical, Logical, and Date/Time Operations

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T4.4.html). Reference links require internet access.

### Contents

1. [Mathematical operators](#1-mathematical-operators)
2. [Logical operators](#2-logical-operators)
3. [$ZDATE, $ZTIME, $HOROLOG](#3-zdate-ztime-horolog)
4. [Date arithmetic](#4-date-arithmetic)

### Visual study guide — sections 1–4

![T4.4 visual summary of sections 1–4: 1. Mathematical operators; 2. Logical operators; 3. $ZDATE, $ZTIME, $HOROLOG; 4. Date arithmetic](visual-guide-01-v2.png)

[View all chapter diagrams](visuals.md) · [Technical review notes](../../visual-technical-notes.md)

## 1. Mathematical operators

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

## 2. Logical operators

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

Short-circuit operators matter when evaluating the second expression could fail or waste work. For example, `(count > 0) && (total/count > 5)` checks the divisor before dividing; with the non-short-circuit `&`, both expressions are evaluated. The apostrophe (`'`) is ObjectScript's NOT operator, while `!` is OR—symbols that are easy to confuse with other languages.

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

## 3. $ZDATE, $ZTIME, $HOROLOG

### Key Points

- **$HOROLOG ($H)**: System date/time as "days,seconds" -- days since Dec 31, 1840; seconds since midnight
- **$ZDATE($ZD)**: Converts $H date to formatted string: $ZD($H, format)
- **$ZDATEH($ZDH)**: Converts formatted string back to $H internal date
- **$ZTIME($ZT)**: Converts $H seconds to formatted time string
- **$ZTIMEH($ZTH)**: Converts formatted time string back to $H seconds
- **$NOW()**: Returns UTC timestamp with fractional seconds
- **$ZTIMESTAMP ($ZTS)**: UTC timestamp in $HOROLOG format with fractional seconds

### Detailed Notes

#### Overview

InterSystems IRIS stores dates and times internally using $HOROLOG format: a two-piece comma-separated value where the first piece is the number of days since December 31, 1840, and the second piece is the number of seconds since midnight. All date/time formatting functions convert to and from this internal format.

#### $HOROLOG Basics

```objectscript
 // Current date and time
 WRITE $HOROLOG, !
 // Example output: 67551,45123
 // 67551 = days since 12/31/1840
 // 45123 = seconds since midnight

 // Extract date and time parts
 SET datepart = $PIECE($H, ",", 1)
 SET timepart = $PIECE($H, ",", 2)
 WRITE "Days: ", datepart, !
 WRITE "Seconds: ", timepart, !

 // $H is the shorthand for $HOROLOG
 WRITE $H, !
```

#### $ZDATE: Formatting Dates

```objectscript
 // Format codes:
 // 1 = MM/DD/YYYY (US format)
 // 2 = DD Mmm YYYY (e.g., 15 Jan 2025)
 // 3 = YYYY-MM-DD (ISO format)
 // 4 = DD/MM/YYYY (European format)
 // 5 = Mmm DD, YYYY (e.g., Jan 15, 2025)
 // 8 = YYYYMMDD (compact)

 SET today = $PIECE($H, ",", 1)

 WRITE $ZDATE(today, 1), !         // 01/15/2025
 WRITE $ZDATE(today, 2), !         // 15 Jan 2025
 WRITE $ZDATE(today, 3), !         // 2025-01-15
 WRITE $ZDATE(today, 4), !         // 15/01/2025
 WRITE $ZDATE(today, 5), !         // Jan 15, 2025
 WRITE $ZDATE(today, 8), !         // 20250115

 // Full $H value (includes time display with some formats)
 WRITE $ZDATE($H, 3), !            // 2025-01-15

 // With separator and year digits
 WRITE $ZDATE(today, 1, "-"), !    // 01-15-2025
```

#### $ZDATEH: Parsing Date Strings

```objectscript
 // Convert formatted date string back to $H date integer
 SET intDate = $ZDATEH("01/15/2025", 1)
 WRITE intDate, !                   // 67196 (days since 12/31/1840)

 SET intDate = $ZDATEH("2025-01-15", 3)
 WRITE intDate, !                   // 67196

 SET intDate = $ZDATEH("20250115", 8)
 WRITE intDate, !                   // 67196
```

#### $ZTIME: Formatting Times

```objectscript
 SET seconds = $PIECE($H, ",", 2)

 // Format 1: HH:MM:SS (24-hour)
 WRITE $ZTIME(seconds, 1), !       // 12:32:03

 // Format 2: HH:MM:SS AM/PM
 WRITE $ZTIME(seconds, 2), !       // 12:32:03 PM

 // Format 3: HH:MM:SS (same as 1)
 WRITE $ZTIME(seconds, 3), !       // 12:32:03

 // Just hours and minutes
 WRITE $ZTIME(seconds, 1, 2), !    // 12:32 (precision=2)
```

#### $ZTIMEH: Parsing Time Strings

```objectscript
 // Convert time string to seconds since midnight
 SET secs = $ZTIMEH("14:30:00")
 WRITE secs, !                      // 52200

 SET secs = $ZTIMEH("2:30 PM", 2)
 WRITE secs, !                      // 52200
```

#### $NOW() and $ZTIMESTAMP

```objectscript
 // $NOW() returns local timestamp with fractional seconds
 WRITE $NOW(), !
 // Example: 67551,45123.456789

 // $ZTIMESTAMP returns UTC with fractional seconds
 WRITE $ZTIMESTAMP, !
 // Example: 67551,63123.456789 (UTC, may differ from local)
 // $ZTS is the shorthand
 WRITE $ZTS, !
```

### Documentation References

- [$HOROLOG Special Variable](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_vhorolog)
- [$ZDATE Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fzdate)
- [$ZDATEH Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fzdateh)
- [$ZTIME Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fztime)
- [$ZTIMESTAMP Special Variable](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_vztimestamp)
- [$NOW Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fnow)

## 4. Date arithmetic

### Key Points

- **Adding days**: Simply add an integer to the $H date value
- **Date differences**: Subtract two $H date values to get days between them
- **Time arithmetic**: Add/subtract seconds from the $H time value (handle day overflow)
- **$SYSTEM.SQL.DATEDIFF()**: Calculate differences in various units (day, month, year, hour, etc.)
- **$SYSTEM.SQL.DATEADD()**: Add intervals to dates
- **Combining date and time**: Remember $H is two pieces -- modify each independently

### Detailed Notes

#### Overview

Because $HOROLOG represents dates as integer day counts and times as integer seconds, date arithmetic is straightforward: add or subtract integers. For more complex calculations (months, years), use the $SYSTEM.SQL date functions.

`$HOROLOG` stores a day number and seconds since midnight, so adding 1 to its date component moves forward one day and works across month and year boundaries. For example, one day after 29 February 2024 is 1 March 2024. Adding 30 days is not the same as adding one calendar month; use date-aware functions when the requirement is defined in months or years.

#### Simple Date Arithmetic

```objectscript
 SET today = +$H    // + extracts just the date part (first piece)

 // Tomorrow
 SET tomorrow = today + 1
 WRITE "Tomorrow: ", $ZDATE(tomorrow, 3), !

 // 30 days from now
 SET future = today + 30
 WRITE "30 days later: ", $ZDATE(future, 3), !

 // 7 days ago
 SET lastWeek = today - 7
 WRITE "Last week: ", $ZDATE(lastWeek, 3), !
```

#### Date Differences

```objectscript
 // Days between two dates
 SET date1 = $ZDATEH("2025-01-01", 3)
 SET date2 = $ZDATEH("2025-03-15", 3)
 SET diff = date2 - date1
 WRITE "Days between: ", diff, !    // 73

 // Days until a future event
 SET eventDate = $ZDATEH("2025-12-25", 3)
 SET today = +$H
 SET daysUntil = eventDate - today
 WRITE "Days until Christmas: ", daysUntil, !
```

#### Time Arithmetic

```objectscript
 SET now = $PIECE($H, ",", 2)

 // 2 hours from now
 SET later = now + (2 * 3600)
 // Handle overflow past midnight (86400 seconds per day)
 IF later >= 86400 {
     SET later = later - 86400
     // Also increment the date
 }
 WRITE "2 hours later: ", $ZTIME(later, 1), !

 // Minutes between two times
 SET time1 = $ZTIMEH("09:00:00")
 SET time2 = $ZTIMEH("17:30:00")
 SET minutes = (time2 - time1) \ 60
 WRITE "Minutes worked: ", minutes, !    // 510
 WRITE "Hours worked: ", minutes / 60, ! // 8.5
```

#### $SYSTEM.SQL.DATEDIFF and $SYSTEM.SQL.DATEADD

```objectscript
 // DATEDIFF: calculate difference in various units
 SET date1 = "2025-01-01"
 SET date2 = "2025-06-15"

 // Difference in days
 SET days = $SYSTEM.SQL.DATEDIFF("dd", date1, date2)
 WRITE "Days: ", days, !

 // Difference in months
 SET months = $SYSTEM.SQL.DATEDIFF("mm", date1, date2)
 WRITE "Months: ", months, !

 // Difference in years
 SET years = $SYSTEM.SQL.DATEDIFF("yy", "2000-01-01", "2025-06-15")
 WRITE "Years: ", years, !

 // DATEADD: add intervals to a date
 // Add 3 months to a date
 SET newDate = $SYSTEM.SQL.DATEADD("mm", 3, "2025-01-15")
 WRITE "3 months later: ", newDate, !    // 2025-04-15

 // Add 1 year
 SET nextYear = $SYSTEM.SQL.DATEADD("yy", 1, "2025-03-01")
 WRITE "Next year: ", nextYear, !        // 2026-03-01

 // Subtract 90 days
 SET past = $SYSTEM.SQL.DATEADD("dd", -90, "2025-06-15")
 WRITE "90 days ago: ", past, !
```

#### Combining Date and Time

```objectscript
 // Build a full $H value from date and time
 SET dateH = $ZDATEH("2025-06-15", 3)
 SET timeH = $ZTIMEH("14:30:00")
 SET fullH = dateH _ "," _ timeH
 WRITE "Full $H: ", fullH, !

 // Calculate elapsed time between two $H timestamps
 SET start = "67196,32400"   // some date, 09:00:00
 SET end = "67197,7200"      // next day, 02:00:00

 SET startSec = ($P(start, ",", 1) * 86400) + $P(start, ",", 2)
 SET endSec = ($P(end, ",", 1) * 86400) + $P(end, ",", 2)
 SET elapsed = endSec - startSec
 WRITE "Elapsed seconds: ", elapsed, !
 WRITE "Elapsed hours: ", elapsed / 3600, !
```

### Documentation References

- [$HOROLOG Special Variable](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_vhorolog)
- [DATEDIFF SQL Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_datediff)
- [DATEADD SQL Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_dateadd)
- [$SYSTEM.SQL Class](https://docs.intersystems.com/irislatest/csp/documatic/%25CSP.Documatic.cls?LIBRARY=%25SYS&CLASSNAME=%25SYSTEM.SQL)

## Exam Preparation Summary

### Critical Concepts to Master:

1. **LEFT-TO-RIGHT evaluation**: No operator precedence -- 2 + 3 \* 4 = 20, not 14! Always use parentheses
2. **Integer division (\)**: Truncates toward zero, different from modulo (#)
3. **$HOROLOG format**: days,seconds -- days since 12/31/1840, seconds since midnight
4. **$ZDATE format codes**: Know at least formats 1 (US), 3 (ISO), and 8 (compact)
5. **$ZDATEH**: Reverse of $ZDATE -- converts formatted string back to internal date
6. **Date arithmetic**: Add/subtract integers for day calculations
7. **Time arithmetic**: Work in seconds, handle 86400-second day boundary
8. **$SYSTEM.SQL.DATEDIFF/DATEADD**: For month/year calculations that simple arithmetic cannot handle
9. **NOT operator**: Apostrophe (') not exclamation mark
10. **Short-circuit**: && and || short-circuit; & and single operators do not

### Common Exam Scenarios:

- Evaluating arithmetic expressions with left-to-right rules (trick questions!)
- Converting between $HOROLOG and formatted date strings
- Calculating the number of days between two dates
- Formatting dates in different regional formats using $ZDATE
- Determining the output of expressions without parentheses
- Using $SYSTEM.SQL.DATEDIFF for month/year differences
- Working with $ZTIMESTAMP for UTC timestamps

### Hands-On Practice Recommendations:

- Write arithmetic expressions and predict results with left-to-right evaluation
- Add parentheses to expressions and verify changed behavior
- Convert dates between $HOROLOG and various formatted strings
- Calculate date differences and future/past dates
- Use $SYSTEM.SQL.DATEDIFF and $SYSTEM.SQL.DATEADD with different units
- Experiment with $NOW() and $ZTIMESTAMP for precision timing
- Practice with the NOT operator (') and negated comparisons ('=, '&lt;, '&gt;)

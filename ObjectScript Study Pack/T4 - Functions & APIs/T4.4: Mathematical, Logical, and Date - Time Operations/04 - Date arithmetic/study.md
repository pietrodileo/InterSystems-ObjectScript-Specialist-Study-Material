[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T4.4: Mathematical, Logical, and Date/Time Operations

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T4.4.html). Reference links require internet access.

## 4. Date arithmetic

![T4.4 visual summary of sections 1–4: 1. Mathematical operators; 2. Logical operators; 3. $ZDATE, $ZTIME, $HOROLOG; 4. Date arithmetic](../visual-guide-01-v2.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

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

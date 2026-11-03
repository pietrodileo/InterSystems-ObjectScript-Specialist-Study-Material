[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T4.1: Traverses and Sorts Arrays

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T4.1.html). Reference links require internet access.

## 3. Multi-level traversal with $ORDER

![T4.1 visual summary of sections 1–4: 1. Subscript sorting (canonical numeric order); 2. Traversing subscript subset with $ORDER; 3. Multi-level traversal with $ORDER; 4. $DATA to check node existence](../visual-guide-01.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **Multi-level arrays**: Globals often have multiple subscript levels: ^data(level1, level2, level3)
- **Nested loops**: Use one $ORDER loop per subscript level
- **$ORDER at each level**: Each inner loop starts with "" and traverses all subscripts at that level
- **Reverse traversal**: Use direction -1 at any level for reverse order
- **$QUERY alternative**: Traverses all nodes at all levels in a single call (returns full subscript reference)

### Detailed Notes

#### Overview

Real-world globals typically have multiple subscript levels. To traverse all data, you nest $ORDER loops, one for each level. Each loop independently iterates its subscript level within the context set by the outer loops.

#### Two-Level Traversal

```objectscript
 // Build a two-level structure
 SET ^students("Math", "Alice") = 95
 SET ^students("Math", "Bob") = 87
 SET ^students("Science", "Alice") = 92
 SET ^students("Science", "Charlie") = 88

 // Nested traversal
 SET subject = ""
 FOR {
     SET subject = $ORDER(^students(subject))
     QUIT:subject=""
     WRITE "Subject: ", subject, !
     SET student = ""
     FOR {
         SET student = $ORDER(^students(subject, student), 1, grade)
         QUIT:student=""
         WRITE "  ", student, " = ", grade, !
     }
 }
 // Output:
 //   Subject: Math
 //     Alice = 95
 //     Bob = 87
 //   Subject: Science
 //     Alice = 92
 //     Charlie = 88
```

#### Three-Level Traversal

```objectscript
 // Three-level structure: ^data(year, month, day) = info
 SET ^data(2025, 1, 15) = "Event A"
 SET ^data(2025, 3, 1) = "Event B"
 SET ^data(2025, 3, 20) = "Event C"
 SET ^data(2026, 1, 5) = "Event D"

 SET year = ""
 FOR {
     SET year = $ORDER(^data(year))
     QUIT:year=""
     SET month = ""
     FOR {
         SET month = $ORDER(^data(year, month))
         QUIT:month=""
         SET day = ""
         FOR {
             SET day = $ORDER(^data(year, month, day), 1, info)
             QUIT:day=""
             WRITE year, "-", month, "-", day, ": ", info, !
         }
     }
 }
```

#### Reverse Traversal at Any Level

```objectscript
 // Reverse outer level, forward inner level
 SET subject = ""
 FOR {
     SET subject = $ORDER(^students(subject), -1)
     QUIT:subject=""
     WRITE "Subject: ", subject, !
     SET student = ""
     FOR {
         SET student = $ORDER(^students(subject, student), 1, grade)
         QUIT:student=""
         WRITE "  ", student, " = ", grade, !
     }
 }
 // Output: Science first, then Math (reverse alphabetical)
```

#### Using $QUERY for Flat Traversal

$QUERY traverses all nodes at all levels in a single loop, returning the full reference as a string:

```objectscript
 SET ref = "^students"
 FOR {
     SET ref = $QUERY(@ref)
     QUIT:ref=""
     WRITE ref, " = ", @ref, !
 }
 // Output:
 //   ^students("Math","Alice") = 95
 //   ^students("Math","Bob") = 87
 //   ^students("Science","Alice") = 92
 //   ^students("Science","Charlie") = 88
```

### Documentation References

- [$ORDER Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_forder)
- [$QUERY Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fquery)
- [Traversing Globals](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GGBL_using#GGBL_using_traversing)

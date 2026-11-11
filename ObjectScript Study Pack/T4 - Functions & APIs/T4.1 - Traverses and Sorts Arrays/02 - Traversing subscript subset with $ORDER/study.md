[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T4.1: Traverses and Sorts Arrays

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T4.1.html). Reference links require internet access.

## 2. Traversing subscript subset with $ORDER

![T4.1 visual summary of sections 1–4: 1. Subscript sorting (canonical numeric order); 2. Traversing subscript subset with $ORDER; 3. Multi-level traversal with $ORDER; 4. $DATA to check node existence](../visual-guide-01.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **$ORDER(array(subscript))**: Returns the next subscript at the same level after the given subscript
- **Empty string start**: Use `""` as starting subscript to get the first subscript
- **Loop termination**: $ORDER returns `""` when no more subscripts exist
- **Direction parameter**: $ORDER(array(subscript), direction) where 1=forward (default), -1=reverse
- **Value by reference**: $ORDER(array(subscript), direction, .datavalue) retrieves data in one call
- **Subscript subset**: Combine $ORDER with a starting point to traverse a portion of an array

### Detailed Notes

#### Overview

$ORDER is the fundamental function for traversing arrays in ObjectScript. It returns the next subscript at the same level, enabling iteration through all nodes of a global or local array. The function is efficient because it follows the internal B-tree structure directly.

#### Basic $ORDER Loop

The standard pattern starts with an empty string and loops until $ORDER returns an empty string:

```objectscript
 // Basic forward traversal
 SET ^colors(1) = "Red"
 SET ^colors(2) = "Green"
 SET ^colors(5) = "Blue"
 SET ^colors(10) = "Yellow"

 SET key = ""
 FOR {
     SET key = $ORDER(^colors(key))
     QUIT:key=""
     WRITE "Key: ", key, " Value: ", ^colors(key), !
 }
 // Output: Key: 1 Value: Red
 //         Key: 2 Value: Green
 //         Key: 5 Value: Blue
 //         Key: 10 Value: Yellow
```

#### Starting from a Specific Point

You can start traversal from any subscript -- $ORDER returns the NEXT subscript after the one you provide:

```objectscript
 // Start traversing from subscript 3 (gets next one: 5)
 SET key = 3
 FOR {
     SET key = $ORDER(^colors(key))
     QUIT:key=""
     WRITE key, " = ", ^colors(key), !
 }
 // Output: 5 = Blue
 //         10 = Yellow
```

#### Reverse Traversal with Direction -1

Pass -1 as the second argument to traverse in reverse order:

```objectscript
 // Reverse traversal
 SET key = ""
 FOR {
     SET key = $ORDER(^colors(key), -1)
     QUIT:key=""
     WRITE key, " = ", ^colors(key), !
 }
 // Output: 10 = Yellow
 //         5 = Blue
 //         2 = Green
 //         1 = Red
```

#### Retrieving Data with the Third Argument

The third argument (passed by reference) retrieves the node's data value in the same call, avoiding a separate global reference:

```objectscript
 // Efficient: get key AND value in one operation
 SET key = ""
 FOR {
     SET key = $ORDER(^colors(key), 1, value)
     QUIT:key=""
     WRITE key, " = ", value, !
 }
```

This is more efficient for globals because it avoids a second disk/cache lookup per iteration.

### Documentation References

- [$ORDER Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_forder)
- [Traversing Globals](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GGBL_using#GGBL_using_traversing)

[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T4.1: Traverses and Sorts Arrays

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T4.1.html). Reference links require internet access.

## 4. $DATA to check node existence

![T4.1 visual summary of sections 1–4: 1. Subscript sorting (canonical numeric order); 2. Traversing subscript subset with $ORDER; 3. Multi-level traversal with $ORDER; 4. $DATA to check node existence](../visual-guide-01.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **$DATA returns 0**: Node does not exist
- **$DATA returns 1**: Node exists and has data, but no descendants
- **$DATA returns 10**: Node has descendants but no data at this level
- **$DATA returns 11**: Node has both data and descendants
- **$D shorthand**: $D is a valid abbreviation for $DATA
- **Two-argument form**: $DATA(var, target) stores the node's value in target if it exists

### Detailed Notes

#### Overview

$DATA (abbreviated $D) is the standard way to check whether a variable or global node exists before accessing it. It returns an integer that indicates both whether data exists at that node and whether descendant nodes exist below it.

#### Return Values Explained

```objectscript
 KILL myarray
 SET myarray(1) = "data"
 SET myarray(2, "child") = "nested"
 SET myarray(3) = "parent"
 SET myarray(3, "child") = "nested"

 WRITE $DATA(myarray(0)), !     // 0  - does not exist
 WRITE $DATA(myarray(1)), !     // 1  - has data, no children
 WRITE $DATA(myarray(2)), !     // 10 - no data, has children
 WRITE $DATA(myarray(3)), !     // 11 - has data AND children
```

#### Using $DATA in Conditional Logic

```objectscript
 // Check if a node exists before reading
 IF $DATA(^config("timeout")) {
     SET timeout = ^config("timeout")
 } ELSE {
     SET timeout = 30  // default
 }

 // More concise: check for data presence (1 or 11)
 // Use modular arithmetic: $DATA returns 1 or 11 when data exists
 IF $DATA(^config("timeout")) # 2 {
     // Node has data (return value is 1 or 11)
     SET timeout = ^config("timeout")
 }

 // Check for descendants (10 or 11)
 IF $DATA(^config("timeout")) \ 10 {
     // Node has descendant subscripts
     WRITE "Has child nodes", !
 }
```

#### Two-Argument Form

The second argument receives the node's value (if data exists), avoiding a separate read:

```objectscript
 IF $DATA(^config("timeout"), value) # 2 {
     WRITE "Timeout is: ", value, !
 } ELSE {
     WRITE "No timeout configured", !
 }
```

#### Common Pattern: Checking Variable Existence

```objectscript
 // Check if a local variable is defined
 IF '$DATA(myVar) {
     SET myVar = "default"
 }

 // Shorthand $D
 IF $D(^globalNode) WRITE "Exists", !

 // $DATA on undefined variables returns 0
 KILL x
 WRITE $D(x), !    // 0
 SET x = 5
 WRITE $D(x), !    // 1
 SET x(1) = 10
 WRITE $D(x), !    // 11
```

#### $DATA vs $GET

$DATA tells you IF something exists; $GET retrieves the value with a default. They serve different purposes:

```objectscript
 // $GET returns the value or a default
 SET timeout = $GET(^config("timeout"), 30)

 // $DATA tells you about existence and structure
 SET status = $DATA(^config("timeout"))
```

### Documentation References

- [$DATA Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fdata)
- [Multidimensional Arrays](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables)

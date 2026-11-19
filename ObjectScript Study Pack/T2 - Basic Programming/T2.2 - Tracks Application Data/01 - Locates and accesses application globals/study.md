[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T2.2: Tracks Application Data

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T2.2.html). Reference links require internet access.

## 1. Locates and accesses application globals

![T2.2 visual summary of sections 1–3: 1. Locates and accesses application globals; 2. Uses logging to track application data; 3. Adds and tracks metrics for performance monitoring](../visual-guide-01-v3.png)

*This diagram covers sections 1–3; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

![Detailed guide to global navigation, $DATA values, and class data mapping](../visual-guide-02.png)

### Key Points

- **Globals (^name)**: Persistent multidimensional arrays stored in databases; the fundamental storage mechanism in InterSystems IRIS
- **ZWRITE**: Displays the contents of a global or subtree in a readable format
- **$DATA**: Tests whether a global node exists and whether it has descendants
- **$ORDER**: Iterates through global subscripts at a given level
- **$QUERY**: Traverses nodes across levels and returns each full node reference
- **$GET**: Safely retrieves a global node value, returning a default if the node does not exist
- **%Library.Global**: Provides `Find` and `Get` class queries for searching or reading globals without a persistent class definition
- **Management Portal**: System Explorer &gt; Globals provides a visual global viewer and editor

### Detailed Notes

#### Understanding Global Structure

Globals are sparse, hierarchical, multidimensional arrays stored on disk. They persist across process boundaries and system restarts. Every persistent class stores its data in globals -- understanding the underlying global structure is essential for debugging and performance analysis.

```objectscript
 // Setting global nodes
 SET ^Customer(1, "Name") = "John Smith"
 SET ^Customer(1, "Email") = "john@example.com"
 SET ^Customer(2, "Name") = "Jane Doe"
 SET ^Customer(2, "Email") = "jane@example.com"

 // Display entire global tree
 ZWRITE ^Customer
 // Output:
 // ^Customer(1,"Email")="john@example.com"
 // ^Customer(1,"Name")="John Smith"
 // ^Customer(2,"Email")="jane@example.com"
 // ^Customer(2,"Name")="Jane Doe"
```

#### Navigating Globals with $ORDER

$ORDER returns the next subscript at a given level, enabling traversal of global nodes:

```objectscript
 // Iterate through all customer IDs
 SET id = ""
 FOR {
     SET id = $ORDER(^Customer(id))
     QUIT:id=""
     WRITE "Customer ", id, ": ", ^Customer(id, "Name"), !
 }
```

#### Searching globals with `%Library.Global`

An IRIS global does not need a persistent class definition to be searched through the `%Library.Global` class queries. `Find` and `Get` can be invoked directly with SQL `CALL` syntax. These `CALL` statements belong in an SQL context; from the ObjectScript prompt in IRIS Terminal, prepare the class query with `%PrepareClassQuery`. For example, search under `^Persons` for the `Email` subscript, or request the value at a reference containing that subscript:

```sql
CALL %Library.Global_Find('USER', '^Persons', 'Email')
CALL %Library.Global_Get('USER', '^Persons(,"Email"', '')
```

The same class queries can be prepared and executed from ObjectScript with `%SQL.Statement`:

```objectscript
 SET statement = ##class(%SQL.Statement).%New()
 SET status = statement.%PrepareClassQuery("%Library.Global", "Find")
 SET resultset = statement.%Execute("USER", "^Persons", "Email")
```

To invoke `Get`, prepare the `Get` query and pass its global reference as a string. In an ObjectScript string, double the quotes that are part of the global reference:

```objectscript
 SET statement = ##class(%SQL.Statement).%New()
 SET status = statement.%PrepareClassQuery("%Library.Global", "Get")
 SET resultset = statement.%Execute("USER", "^Persons(,""Email""")
```

These are dedicated class queries for accessing global data. They do not make an arbitrary global a table that can be queried with syntax such as `SELECT * FROM %Global.MyGlobal`.

#### Choosing a traversal strategy

Use `ZWRITE` for a readable snapshot of a global or a selected subtree. Use `$ORDER` when you need to control the keys you visit, apply a condition, or stop early. `$ORDER` returns siblings at the level named in the reference; it does not descend into every child automatically. To walk selected levels with `$ORDER`, nest one loop per level.

When the structure is nested and you want to visit nodes at all levels in one loop, `$QUERY` returns each full node reference. Indirection (`@ref`) then reads the value at that reference:

```objectscript
 SET ref = "^Customer"
 FOR {
     SET ref = $QUERY(@ref)
     QUIT:ref=""
     WRITE ref, " = ", @ref, !
 }
```

The starting reference is a position in the traversal; if the global root itself has a value, inspect it separately. For a quick inspection in the Terminal, `ZWRITE ^Customer` is often the simplest choice. For a filtered or partial scan, use `$ORDER`; for a traversal across nested levels, use nested `$ORDER` loops or `$QUERY`.

#### Using $DATA to Check Node Existence

$DATA returns a value indicating whether a node exists and/or has children:

- 0 = node does not exist and has no descendants
- 1 = node exists but has no descendants
- 10 = node does not exist but has descendants
- 11 = node exists AND has descendants

```objectscript
 IF $DATA(^Customer(1)) {
     WRITE "Customer 1 exists", !
 }
 // Use $DATA to check before accessing
 IF $DATA(^Config("settings", "timeout"))#2 {
     SET timeout = ^Config("settings", "timeout")
 }
```

#### Management Portal Global Viewer

Navigate to System Explorer &gt; Globals to browse, search, and edit globals. You can:

- View globals across all namespaces
- Filter by global name prefix
- Drill into subscript levels
- Export and import global data
- Delete globals or individual nodes

#### Locating Class Data Globals

Persistent classes store data in globals named after the class. Use the storage definition in Studio/VS Code to find the exact global name:

```objectscript
 // For class MyApp.Customer, data is typically in:
 // ^MyApp.CustomerD (data global)
 // ^MyApp.CustomerI (index global)
 // ^MyApp.CustomerS (sequence counter)
 ZWRITE ^MyApp.CustomerD
```

### Documentation References

- [Introduction to Globals](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GGBL_intro)
- [Global Structure](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GGBL_structure)
- [$ORDER Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_forder)
- [$QUERY Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fquery)
- [Search within globals without class definitions](https://community.intersystems.com/post/search-within-globals-without-class-definitions)
- [$DATA Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fdata)

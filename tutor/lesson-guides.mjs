// Each introduction connects the chapter's concepts through a single exam scenario.
export const guides = {
  'T1.1': [
    "A class can model a record that IRIS saves with its own ID, a serial value stored as part of a parent, or a registered object used only in memory. A class without an object superclass can group stateless class methods. This chapter compares those choices and follows persistent objects through creation, saving, opening, and deletion. It also explains where data and indexes are stored, how inherited methods are selected, and how `///` comments and `Description` document a class.\n\nSuppose a `Person` has a `HomeAddress`. If the address has no independent identity, define it as a serial object and store it with the person. Saving the person gives the person an ID, not the address. A registered request context can be created without creating a database row, while a stateless calculator can be called directly on its class. The examples compare these choices in code.",
    'An ID counter records allocations. It can have gaps even if nobody deleted a row. You also need to check the outer transaction before you can say that an assigned ID belongs to a committed row.',
  ],
  'T1.2': [
    "A property declaration controls more than a field name. Length and validation settings affect which values an object accepts; streams hold large text or binary values; computed properties determine when a value is produced. Indexes affect lookups, while unique indexes and foreign keys help protect data rules. This chapter explains those choices, including `MAXLEN`, `TRUNCATE`, `Required`, `InitialExpression`, and `OnDelete`.\n\nFor a contact table, an email property might need a unique index so the application can find one contact and reject duplicates. If a related record is deleted, a foreign key can block the deletion or cascade it, depending on its definition. The examples show where each rule belongs and what it changes.",
    'Read the validation result and the save status to see how an invalid value was handled. For a derived property, check what SQL returns and what you get from ObjectScript.',
  ],
  'T1.3': [
    "An instance method runs on an object and can read or change that object's properties. A class method runs on the class and does not have an implicit object. This chapter compares the two, then looks at method parameters, return types, class parameters, `Output`, and `ByRef`. It also explains how object references behave when passed to a method, how a caller's variables or arrays can be changed by reference, and how subclasses override inherited methods.\n\nFor example, `person.UpdateName(\"Ada\")` changes the same object the caller holds. A `ByRef` parameter works differently: the caller passes `.name`, allowing the method to change the caller's variable. The inheritance examples trace which method runs and when `##super` calls the parent implementation.",
    '`ByRef` and `Output` declare how the parameter is meant to work. At the ObjectScript call site, look for a dot before the argument. A `ClassMethod` has no implicit instance, so it can\'t access an instance property that way.',
  ],
  'T1.4': [
    "`%DynamicObject` and `%DynamicArray` let ObjectScript work with JSON whose structure is not fixed by a persistent class. This chapter shows how to create and inspect objects and arrays, distinguish a missing property from `null`, iterate through values, and convert between JSON text and dynamic objects. It also introduces character and binary streams for larger content, where `Read()`, `Write()`, `Rewind()`, and the current stream position affect what happens next.\n\nImagine an API response with a patient, a list of results, and a PDF attachment. The dynamic object and array hold the structured fields; a binary stream keeps the PDF bytes intact. The examples follow both the JSON values and the stream position.",
    'In JSON, `true` and `null` are literal tokens. In ObjectScript, they aren\'t predefined variables. If you\'re testing read position, call `Rewind()` explicitly so you know where the next read starts.',
  ],
  'T2.1': [
    "Transactions group database changes so they can commit or roll back together. In ObjectScript, each `TSTART` changes `$TLEVEL`; an inner `TCOMMIT` does not commit the data until the outermost transaction ends. Locks coordinate processes only when they protect the same resource. This chapter explains nested transactions and rollbacks, lock duration and escalation, and the difference between pessimistic and optimistic concurrency checks. It also applies those ideas to SQL scripts.\n\nConsider a transfer between two accounts. The debit and credit must succeed as one unit, and concurrent transfers must not overwrite each other's updates. The examples trace `$TLEVEL`, show what a rollback removes, and identify the lock each process needs to acquire.",
    'A rollback leaves local variables and ordinary application locks alone. Check the lock escalation settings and the rules for `$INCREMENT` and `$SEQUENCE` separately.',
  ],
  'T2.2': [
    "Globals hold hierarchical application data in IRIS databases. This chapter shows how to find the global used by an application, traverse its subscripts with `$ORDER`, and use `$DATA` to distinguish a node's value from its descendants. It then looks at logging and performance metrics: logs record what happened, while metrics help quantify how much work an operation performed and how long it took.\n\nIf an overnight batch slows down, a useful log can identify the operation that failed. Timing and work-count metrics can then help distinguish a slower iteration from a larger batch. The examples show how to record and inspect this information.",
    'Read how the component uses `^%ISCLOG` before interpreting its levels. `$ZHOROLOG` reports seconds since system startup, including fractions of a second.',
  ],
  'T2.3': [
    "Application security involves separate checks: where temporary values live, who may call a method, which roles can access a resource, and how SQL handles user input. This chapter covers process-private globals, role and permission checks, embedded SQL permissions, and safe query construction. It explains why a similar-looking role name is not enough to prove access and why SQL values should be bound as parameters.\n\nFor example, a search endpoint should bind a patient's name instead of inserting it directly into the SQL text. Before returning protected data, check the specific role or resource the operation requires. The examples show these checks in code.",
    'Making a method private limits who can call it directly. Check resource permissions separately. Bind SQL values and choose identifiers and sort directions from an explicit allowlist.',
  ],
  'T3.1': [
    "ObjectScript offers several places to keep data, and each has a different scope and lifetime. This chapter compares local variables, process-private globals, temporary globals, and ordinary persistent globals. It explains which processes can see each value, whether the value survives a process or system restart, and what journaling or database mapping means for the data.\n\nA loop counter belongs in a local variable. A large temporary structure used by one process may fit a process-private global. If multiple processes need shared temporary data, use a temporary global configured for that purpose. Data that must survive restarts belongs in a persistent global. The examples trace the same kind of value through these choices.",
    'A process can have a different lifetime from a web session. Read the namespace mappings to find the physical database behind a temporary global.',
  ],
  'T3.2': [
    "ObjectScript and SQL use some of the same data but have different rules for values and query execution. This chapter covers ObjectScript's dynamic typing, macros and include files, projection of object properties into SQL, and the choice between embedded and dynamic SQL. It also explains logical, ODBC, and display modes, along with `SQLCODE`, `%ROWCOUNT`, and `%ROWID` so you can interpret query results correctly.\n\nWhen a date or number comes back from SQL, first check which select mode the interface uses. In an embedded SQL loop, check `SQLCODE` after each fetch before reading the host variables. The examples follow values from ObjectScript into SQL and back.",
    'The SQL interface and select mode determine whether to expect logical, ODBC, or display values. Check the field names and SQL projection too, since both can be customized.',
  ],
  'T3.3': [
    "An undefined ObjectScript variable, a defined variable containing an empty string, the NUL character from `$CHAR(0)`, and SQL `NULL` are different values. This chapter compares how they behave in ObjectScript expressions and SQL queries. It also shows why checks such as `$DATA`, `IS NULL`, and string operations answer different questions.\n\nSuppose a report contains scores that may be missing, blank, or include a NUL character. The examples show which rows match each filter and why an empty string does not satisfy `IS NULL`.",
    'SQL NULL, JSON null, and an undefined ObjectScript variable are separate states. Check how the interface you\'re using converts between them.',
  ],
  'T3.4': [
    "Changing a persistent class can affect more than its definition. This chapter covers adding an index, renaming a property, changing its type, and dealing with cached queries after a schema change. It follows the effects on stored values, index entries, and query plans, so you can decide what needs to be checked after the class is recompiled.\n\nFor example, adding an index to a table already in use may require existing data and cached query plans to be considered. A successful class compile alone does not show that every old row or query is ready. The examples walk through the checks to make during a schema change.",
    'Defining an index, populating it, and collecting statistics are separate steps. Check for a frozen plan and see how your IRIS version handles a change in statistics.',
  ],
  'T3.5': [
    "An index does not guarantee a query will be fast. This chapter explains how `TUNE TABLE` gathers statistics, how to read a basic query plan, and how to test both correctness and performance. It looks at selectivity, index coverage, and the cost of reading rows after an index finds matching keys.\n\nA status value that matches two rows may produce a different plan from a value that matches most of a table. Compare representative queries under the same conditions, then inspect the plan and measurements to see what the database actually did.",
    'Use the actual plan and measurements from a representative workload to decide whether to retune statistics. The optimizer has several plans to choose from, so a single threshold won\'t tell you whether a change helps.',
  ],
  'T4.1': [
    "ObjectScript arrays and globals are traversed by subscript order. This chapter explains canonical numeric ordering, `$ORDER` at one or several levels, and `$DATA` for nodes that may contain a value, descendants, or both.\n\nImagine a sparse order array with a value at subscript 2 and children beneath subscript 5. Trace the value returned by `$ORDER` before reading each node, and use `$DATA` to see whether the node itself has a value. The examples also show what happens when a traversal reaches its end.",
    'The examples use the collation specified in each scenario. Keep track of the subscript and the value stored at that subscript separately.',
  ],
  'T4.2': [
    "ObjectScript lists store ordered values in a compact representation. This chapter shows how to build, retrieve, insert, update, and remove list elements with `$LISTBUILD`, `$LIST`, `$LISTGET`, and `$LISTNEXT`. It also covers conversion between lists and strings, including cases where a delimiter can make the original boundaries unclear.\n\nCompare a list with an omitted position to one containing an empty string. Both may look blank when printed, but retrieval and iteration can distinguish them. The examples trace the position and returned value for each operation.",
    '`$LISTNEXT` uses an opaque cursor. It can visit an omitted element and leave the output variable undefined, so check before reading it.',
  ],
  'T4.3': [
    "Different string operations solve different problems. `$PIECE` selects fields separated by a delimiter, while `$EXTRACT` selects character positions. `$REPLACE`, `$TRANSLATE`, and `$ZSTRIP` change text; concatenation joins values; regular expressions check patterns; and `$ZCONVERT` handles character encodings. The chapter also explains why output needs the escaping appropriate to its destination.\n\nFor the value `A-12-Rome`, `$PIECE(value,\"-\",3)` returns `Rome`, while `$EXTRACT(value,3,4)` returns `12`. The examples compare these operations and show how to avoid treating a delimited field as a character range.",
    'Use HTML encoding when the result goes into HTML. If you need a number, validate the input separately from converting it.',
  ],
  'T4.4': [
    "ObjectScript arithmetic and logical operators need to be read according to ObjectScript rules. Mathematical expressions run from left to right unless parentheses change the grouping, and logical operators work on ObjectScript truth values. This chapter also covers `$HOROLOG`, `$ZDATE`, and `$ZTIME`, including formatting and arithmetic with dates and times.\n\nFor example, `2+3*4` evaluates to 20, while `2+(3*4)` evaluates to 14. Time calculations need the same care: `$HOROLOG` contains a day count and seconds since midnight, so a calculation that crosses midnight must account for both parts.",
    'ObjectScript evaluates arithmetic left to right unless you group it. Using only the numeric prefix of `$HOROLOG` drops the time of day.',
  ],
  'T4.5': [
    "A post-conditional attaches a condition to a single command, as in `WRITE:count>0`. This chapter explains that syntax, how ObjectScript evaluates conditions, and when to use `QUIT` or `RETURN`. `QUIT` can leave a loop or end a routine or method; `RETURN` supplies a value from a function or method.\n\nA nonempty string such as `\"abc\"` may not behave like a Boolean value in another language. If the requirement is to reject only blank input, test explicitly that the value is defined and differs from the empty string. The examples compare that check with a post-conditional.",
    '`$SELECT` needs a true condition to return a value. If you need to leave the method from inside a `FOR` loop, follow the method\'s return contract.',
  ],
  'T4.6': [
    "`$METHOD` and `$CLASSMETHOD` let code choose a method at runtime from a name. `%ClassName()` and `%IsA()` help identify an object's class and inheritance, while `%Dictionary` exposes class and member metadata. This chapter compares dynamic dispatch with a direct method call and shows how to inspect the class information the application needs.\n\nA message processor might select a handler from configuration. Check the class and method against an allowed set before calling them, then handle a missing class or method. The examples also distinguish members declared on a class from inherited members.",
    'Check that the reference is a valid object before calling `%IsA`. Restrict dynamically chosen method names to operations the caller is allowed to use.',
  ],
  'T4.7': [
    "IRIS stream classes read and write files without requiring the whole file to fit in one local variable. Character streams handle text; binary streams preserve bytes such as those in a PDF or image. The `%Net` APIs add communication with HTTP, FTP, and email services. This chapter covers the stream operations and response checks that matter for these tasks.\n\nWhen copying a PDF, read and write it as binary data. When calling an HTTP service, check both the transport result and the HTTP status code: a connection can succeed even when the server rejects the request.",
    'HTTPS needs the appropriate TLS configuration. The snippets show the order of operations. You\'ll need the deployment settings for your environment to run them there.',
  ],
  'T5.1': [
    "The right troubleshooting tool depends on the failure. A slow method calls for timing or profiling; a slow SQL query calls for statistics and a query plan; a class that will not compile calls for compiler diagnostics. This chapter introduces `$ZH`, `^PERFMON`, SQL performance tools, line-level monitoring, and the tools for reading compilation errors and generated code.\n\nIf a method is slow, measure it under comparable conditions and use a profiler to find where the time goes. If compilation fails on a macro, check the include and the expanded code. The examples show which evidence each tool provides.",
    'Subtracting two `$HOROLOG` strings doesn\'t generally give elapsed seconds. `$ZH` is short for `$ZHOROLOG`.',
  ],
  'T5.2': [
    "ObjectScript reports errors as either returned `%Status` values or thrown exceptions. A `TRY`/`CATCH` block handles exceptions; it does not automatically detect an error status returned by a method. This chapter shows how to raise and catch exceptions, inspect `$STACK`, write useful information to the application error log, and convert between status values and exceptions.\n\nIf a method returns an error status, its caller must inspect it or convert it according to the method's contract. If the method throws, control moves to `CATCH`. The examples follow both paths and show what information to keep when logging a failure.",
    '`$STACK` gives the current depth. `$STACK(-1)` gives the highest level with available information, which can include error information. By the time a `CATCH` runs, some unwound frames may already be unavailable.',
  ],
  'T5.3': [
    "Common ObjectScript errors point to different causes. `<SUBSCRIPT>` and `<UNDEFINED>` often mean code tried to read a missing value; `<PROTECT>` means an operation was blocked by access rules. `<INVALID OREF>` and missing class, method, or property errors point to object or member lookups. `<SYNTAX>` means the code could not be parsed, while `<FRAMESTACK>` can point to excessive or unbounded calls. This chapter explains each message and shows how to trace it to the failing expression.\n\nIf a `$ORDER` loop reaches its end, the next subscript can be empty. Reading a variable that was never set or calling a method on an empty object reference needs a different fix. The examples trace each failure before adding a guard or default.",
    'For `PROTECT`, check privileges and database write access. If a subscript is involved, check whether the node has no value or the process disallows the subscript. Check for empty input before dividing.',
  ],
};

// Follow-up questions mirror the three worked cases in each chapter, in pack order.
export const variations = {
  'T1.1': [
    ["Two namespaces expose `^Sales.OrderD`. How can you tell whether ID `42` points to the same data in both?","Resolve `GetGlobalDest(namespace, \"Sales.OrderD\", 42)` for each namespace. Compare both the system and directory. The same global name and ID can resolve to different databases."],
    ['The table has IDs 1, 2, and 8. How many rows are there? Can you assume ID 3 exists?', 'There are three rows. IDs can have gaps.'],
    ['You create an object with `%New`. When does it get a persistent row?', 'Creating an instance puts it in memory. A successful save writes the row.'],
  ],
  'T1.2': [
    ["You fix the missing name. Will saving the product now succeed with `Category = \"Toys\"`?","The name constraint is satisfied, but `Toys` still violates `VALUELIST`. Choose an allowed category and check the new `%Save()` status."],
    ['The shipped orders have IDs 2, 4, and 6. The orders for the North region have IDs 1, 4, and 6. Which orders match both filters?', 'IDs 4 and 6. You may still need to read the rows to fetch properties outside the index.'],
    ['You add a derived field to an existing table. How can you tell whether old rows already have its value?', 'Read the property keywords and check when the value is calculated. The formula alone can\'t tell you whether existing rows need an update.'],
  ],
  'T1.3': [
    ["What changes if a method passed an OREF by value first assigns `obj.Status = \"Active\"` and then sets `obj = \"\"`?","The status change reaches the shared object. Clearing the local variable drops the method's copy of the reference. The caller can still read the object and its new status."],
    ['You increment counter `c` three times. A separate counter `d` starts at zero. What does its first increment return?', 'It returns 1. Each instance keeps its own count.'],
    ['The parent validation fails and the subclass email check passes. What should the method do with the parent failure?', 'Handle the parent failure or pass it back to the caller before returning success.'],
  ],
  'T1.4': [
    ["How can you set `active` from an ObjectScript variable while keeping it a JSON Boolean?","Use `Do patient.%Set(\"active\", enabled, \"boolean\")`. With `enabled = 1`, `%ToJSON()` emits `true` for that member."],
    ['What does `%Set(0,7)` do to `[10,20,30]`?', 'It replaces the first element. The result is `[7,20,30]`.'],
    ['You read `ABC` from a stream, rewind it, then call `Read(2)`. What comes back?', '`AB`. Rewinding takes you back to the first character.'],
  ],
  'T2.1': [
    ["Replace `TROLLBACK 1` with `TROLLBACK`. Which earlier writes can the later `TCOMMIT` preserve?","The argumentless rollback undoes both levels and sets `$TLEVEL` to 0. The earlier writes are already rolled back. A later write runs outside those levels unless the code starts a new transaction."],
    ['Two workers lock different resources before updating the same row. Can both reach the update at the same time?', 'Yes. To serialize their updates, they need to lock the same resource under a shared protocol.'],
    ['You hold `^Order(1)` and `^Order(2)`. Which locks do you hold after `LOCK +^Order(3)` succeeds?', 'All three. The incremental lock adds `^Order(3)` while preserving the other two.'],
  ],
  'T2.2': [
    ["`$DATA(node)` returns 10. What happens if you try `WRITE node`?","The node has children and no scalar value. Reading it directly raises `<UNDEFINED>`. Read a child or use `$GET(node, fallback)` for the exact node."],
    ['You need to investigate a batch tomorrow, after its process exits. Where should you keep the events in `^||queryLog`?', 'Write or export the events you need to storage that outlives the process.'],
    ['A hundred operations take 2.5 seconds. What is the average time per operation?', '25 ms. That average tells you little about how long the slowest operations took.'],
  ],
  'T2.3': [
    ["A user belongs to two roles. One role gives read access and the other gives write access. How can the method check the required permission?","Check the permission on the resource, for example with `$SYSTEM.Security.Check`, using the process's effective security context. Matching a substring of a role name cannot establish that permission."],
    ['You bind the name in `WHERE Name=?` and concatenate a user-supplied `ORDER BY` expression. How do you make the sort safe?', 'Choose the identifier and sort direction from an allowlist. Binding the name only protects that value.'],
    ['Does binding `:status` in embedded SQL establish that the caller may run the `UPDATE`?', 'Check authorization separately. Binding controls how SQL receives the value.'],
  ],
  'T3.1': [
    ["A worker writes its status to a PPG. A polling endpoint runs in another process. Where should the status move if it may disappear on restart?","Use a shared temporary global and key the data by job ID. Both processes need to resolve that global to the same temporary database."],
    ['Worker A increments `^||counter` to 10. What does worker B see if it has never set that node?', 'The node is undefined in B\'s process. Each process has a separate global.'],
    ['A worker gets ID 8 and exits before writing the record. What can the next worker assume about the next ID?', 'It might get a different ID. Allocations can leave gaps, so the highest ID doesn\'t tell you how many records were written.'],
  ],
  'T3.2': [
    ["What do `\"5 apples\" + \"oranges\"` and `\"5 apples\" _ \"oranges\"` produce?","The plus expression uses numeric prefixes and returns `5`. Underscore joins the original strings and returns `5 applesoranges`."],
    ['You change a tax macro from 0.07 to 0.08. What happens if you run the calling class without recompiling it?', 'The compiled code still uses 0.07, the value from the previous macro expansion.'],
    ['The first `FETCH` returns `SQLCODE` 100. How many rows should you process?', 'Zero. That fetch returned no row, so leave the host variables alone.'],
  ],
  'T3.3': [
    ["`$GET(x)` and `$CHAR(0)` can both look blank when written. How do you check which value you have?","Use `$DATA(x)` to check whether the variable has a value. Then use `$LENGTH(x)` to distinguish a zero-length string from a one-character NUL."],
    ['Five rows have scores 10, 20, 30, NULL, and NULL. You add a sixth row with score 0. What do `COUNT(Score)`, `COUNT(*)`, and `AVG(Score)` return?', '4, 6, and 15, respectively. Zero contributes to the average and counts as a score.'],
    ['There are 30 Boston rows, 20 with NULL for the city, and 50 for other cities. How many match `City<>\'Boston\' OR City IS NULL`?', '70. The first condition matches the 50 other cities, and the second adds the 20 NULLs.'],
  ],
  'T3.4': [
    ["The old value is still in slot 2, but `FullName` reads empty. What would you inspect first?","Inspect the active storage mapping and compare it with the old definition. If `FullName` maps to slot 4, it is reading a different position. Preserve or migrate slot 2 intentionally."],
    ['You change collation while leaving the stored values alone. Why should the migration plan include the index?', 'The comparison rule affects the index keys. Check the index and rebuild it if needed.'],
    ['A new plan uses an index but reads more blocks than the old plan. How would you decide which to use?', 'Measure both plans on a representative workload and compare the results with your performance goals.'],
  ],
  'T3.5': [
    ["A plan finds 30 matching IDs in an index. Why might it still read 30 rows from the data global?","The query may project columns that the index does not contain. The index finds candidates, and the plan reads each matching row to retrieve the additional fields."],
    ['Query A takes 10 ms to execute and 90 ms to fetch its rows. Query B takes 30 ms to execute and 20 ms to fetch. Which delivers all its rows first?', 'B finishes in 50 ms. A takes 100 ms in total.'],
    ['A new index slows writes and leaves query latency unchanged. What should you weigh before keeping it?', 'Compare any benefit the index provides with what it costs to maintain. Appearing in the plan alone doesn\'t justify keeping it.'],
  ],
  'T4.1': [
    ["What changes if you start at the empty sentinel with `$ORDER(arr(key),-1)` in the example?","The keys appear as `10, 3, 2, 1`, so the values print as `CBDA`. The sentinel starts reverse traversal at the largest key."],
    ['The timeout node is absent. What does `$GET(node,30)` do?', 'It returns 30 and leaves the node as it was.'],
    ['The first `$ORDER` call returns `""`. How many elements should the traversal read?', 'Zero. Check for the end marker before using the subscript to read a value.'],
  ],
  'T4.2': [
    ["What does `$LISTGET(data,2,\"missing\")` return for an omitted element and for a defined empty string?","It returns `missing` for the omitted element and the empty string for the defined element. The fallback tests whether an element is defined."],
    ['You want to number the elements that `$LISTNEXT` visits. Where should that number come from?', 'Keep a separate counter. The iterator uses an opaque cursor to track its own position.'],
    ['You join the values `A|B` and `C` to make `A|B|C`. How many fields will you get if you split at every pipe?', 'Three. Splitting that way can\'t recover the original two fields.'],
  ],
  'T4.3': [
    ["Which operation would you use for the second field of `A^BC^D`, and which for characters 3 and 4?","Use `$PIECE(text,\"^\",2)` to select a field and `$EXTRACT(text,3,4)` to select by character position. Both return `BC` on this input, but they use different boundaries."],
    ['What does `$TRANSLATE("banana","an","")` return?', '`b`. The call removes every `a` and `n`.'],
    ['What should remain after you trim the outer spaces from a value containing `Ada Lovelace`?', '`Ada Lovelace`, with the space between the names intact.'],
  ],
  'T4.4': [
    ["How can the same operands yield 25 or 5 in the subtraction example?","`10-2*3+1` proceeds left to right. In `10-(2*3)+1`, the parentheses make multiplication happen first, so the result is 5."],
    ['You have 48 items and each group holds 8. How many groups can you fill, and what\'s left?', 'Six full groups, with nothing left over.'],
    ['You add 20 seconds to 23:59:50 and get 00:00:10. What happens to the date?', 'It advances by one day.'],
  ],
  'T4.5': [
    ["How can `\"abc\"` fail an `IF` test while still containing text?","`IF value` tests numeric truth, and `abc` converts to zero. `IF value'=\"\"` tests for the presence of characters and succeeds for this value."],
    ['A method finds a match at index 2 inside a loop. How does it return that index immediately?', 'Use `RETURN 2` to leave the method with the index.'],
    ['The code has branches for values below, equal to, and above 5. Where does `x=5` belong?', 'Handle it in the equality branch and make sure that branch produces a defined result.'],
  ],
  'T4.6': [
    ["The object is a `Sample.Patient` derived from `Sample.Person`. Which test accepts it as a person?","`obj.%IsA(\"Sample.Person\")` accepts the subclass. `$CLASSNAME(obj) = \"Sample.Person\"` checks the concrete class name and rejects it."],
    ['A user supplies the name of an administrative method. What must you check before calling it?', 'Make sure the requested operation is authorized. A method can exist without being available to that caller.'],
    ['A method doesn\'t appear in the local class declaration. Where else should you look to see whether an instance can call it?', 'Check the compiled class and its hierarchy. The instance may have inherited the method.'],
  ],
  'T4.7': [
    ["Which stream would you use to preserve PDF bytes in a database, and how would you read it again from the start?","Use `%Stream.GlobalBinary` for database-backed binary data. Call `Rewind()` before a second pass and read in bounded chunks."],
    ['The connection works and the server returns HTTP 500. What does that tell you about the request?', 'The transport worked. The server reported an application error.'],
    ['You build a `MailMessage` with a recipient, subject, and body. What\'s left to do?', 'Send it through the configured SMTP channel and check the result.'],
  ],
  'T5.1': [
    ["The compiler reports an undefined macro and a later method fails to compile. Which diagnostic should you address first?","Start with the first preprocessor diagnostic. Check the macro spelling and include visibility, then recompile. The later error may be a consequence of missing generated code."],
    ['An elapsed-time clock reads 100.250 seconds before a block runs and 100.875 afterward. How long did the block take?', '0.625 seconds. Subtract the two decimal elapsed-time readings.'],
    ['The process is slow, but the query itself is quick. What would you measure next?', 'Measure the code around the query and look for other waits in the process.'],
  ],
  'T5.2': [
    ["A method inside `TRY` returns an error `%Status`. How can the caller deliberately route it to `CATCH`?","Check the status and throw a status exception, for example with `$$$ThrowOnError(sc)`. A returned error by itself does not enter `CATCH`."],
    ['The method logs a failure and returns OK. What does the caller see?', 'The status tells the caller the operation succeeded. Report the failure through the return contract or another explicit channel.'],
    ['Two constraints fail, and the caller expects every validation error. What should you return?', 'Keep both failures in a structured result so the caller can see each one.'],
  ],
  'T5.3': [
    ["After correcting `City` to `city`, the code still fails at the end of `$ORDER` traversal. What should you check next?","Verify that the loop exits when `$ORDER` returns the empty sentinel, before the code tries to read the corresponding node."],
    ['A linked structure goes 1 to 2 to 3 and back to 1. How can you stop the traversal?', 'Track the nodes you\'ve already visited and handle the cycle when you encounter one again. This chain won\'t reach an empty next node on its own.'],
    ['The scores are 10, 20, missing, and 40. How does the average change if you count the missing score as zero?', 'Ignoring it gives 70/3. Counting it as zero gives 70/4. Choose which rule the report should use.'],
  ],
};

// One study objective for each worked case, in chapter order.
export const caseFocus = {
  'T1.1': [
    "Start with `BME` in the class declaration. Find its entry in the storage definition, then resolve that global through the namespace mapping.",
    'A lookup starts with a message ID from the application. Follow it to the stored record, then decide what the internal IDs can tell you about how many records exist.',
    'Follow the object from construction to persistence. At each call, identify what comes back and what evidence you have that the row was saved.',
  ],
  'T1.2': [
    "Try saving a product with no `Name`, a category outside `VALUELIST` and a valid price. Identify each failed constraint and read the save status.",
    'The report needs orders that satisfy two filters at once. Compare the candidate IDs for each filter, then ask whether the index covers all the fields the report needs.',
    'Choose a property type for each kind of content. Consider both the size of the value and whether the application must preserve text or raw bytes.',
  ],
  'T1.3': [
    "Pass a local array with a dot and an object reference without one. Trace which writes change the caller's variable and which change the shared object.",
    'Follow the counter through several calls. Record the value held by each instance after every call, including the call that omits its argument.',
    'Trace a validation call into the parent class and back. Decide when the subclass should proceed with its own check and what it should return if the parent fails.',
  ],
  'T1.4': [
    "Compare `true` inside a JSON literal with `true` in a standalone ObjectScript assignment. The parser determines whether it is a Boolean or a variable name.",
    'Two variables refer to the same dynamic array. Predict which element changes and what each variable sees after the update.',
    'Track two facts after each read: the cursor position and the total size. Then predict what a rewind changes.',
  ],
  'T2.1': [
    "Put the status update in the outer transaction and the item updates in the inner one. Follow what remains after `TROLLBACK 1` and the outer commit.",
    'Follow both workers as they approach the same resource. Compare a worker that requests the lock with one that writes without participating in the locking protocol.',
    'Keep a running list of the locks the process holds. Compare the effect of an incremental acquisition with that of a simple LOCK.',
  ],
  'T2.2': [
    "Use `$DATA` to check separately for a value on the exact node and for descendants before attempting a direct read.",
    'Imagine investigating the batch after its process has exited. Work out which fields identify an event and where to keep the record so it is still available.',
    'You have elapsed time and an operation count. Calculate the average, then ask what that number can tell you about a slow individual operation.',
  ],
  'T2.3': [
    "The role list contains `SuperAppAdmin`. Compare a substring test for `AppAdmin` with checking the resource permission for the actual operation.",
    'Follow user input from the request to SQL. Identify which parts belong in the prepared statement and which values should be passed when it executes.',
    'The code already handles SQL values safely. Examine the separate question of whose permissions determine whether the statement may run.',
  ],
  'T3.1': [
    "Choose storage for state owned by one worker, state shared until restart and state that needs to survive restart.",
    'Follow two requests from the same browser through different IRIS processes. Decide which values the second request can see from the first.',
    'Trace the allocation of an ID and the later write of its payload. Ask what another process can infer from the counter if the writer exits between those steps.',
  ],
  'T3.2': [
    "Apply `+` and `_` to the same two mixed strings. Follow numeric conversion for arithmetic and the original characters for concatenation.",
    'Follow the tax rate from the macro definition into compiled code. Decide which step must happen again after the macro changes.',
    'Trace a cursor over a normal row, the end of results, and an error. At each step, decide whether the application should read the host variables or stop.',
  ],
  'T3.3': [
    "Compare an undefined variable, an empty string and a string containing NUL. Check what `$DATA`, `$GET` and `$LENGTH` tell you about each.",
    'Start with a set of scores that includes NULL. Work out which rows each aggregate considers before calculating the result.',
    'Predict how a WHERE clause treats records with unknown cities. Then decide how to express that those records should be included.',
  ],
  'T3.4': [
    "A row stores a name in slot 2. Compare the old and new storage maps to see why a property that points at slot 4 reads empty.",
    'Follow a new index from its declaration to a query against existing rows. Identify what to verify before assuming the index is ready.',
    'An index or the statistics change while the application is already using a query. Decide what to inspect to learn whether the query is still using the same plan.',
  ],
  'T3.5': [
    "Follow the query from the index to candidate IDs. Check whether its projected columns can come from the index or require a data global read.",
    'Compare two queries from the caller’s perspective. Count the time to execute the query and the time to fetch its results.',
    'Turn a slow-query observation into one measurable change. Decide what to keep constant so the next measurement can tell you whether that change helped.',
  ],
  'T4.1': [
    "Assign values under keys in a mixed order. Walk the array with `$ORDER` and compare the traversal with the order of the assignments.",
    'Inspect a node that has both its own value and children. Decide when a direct read is safe and when the application should use a default.',
    'Walk a sparse array until the traversal signals that it is done. Decide where the end test belongs and when to reset a cursor for a nested loop.',
  ],
  'T4.2': [
    "Use the same `$LISTGET` default on an omitted element, a defined empty element and a position past the end.",
    'Follow the iterator from its initial pointer through the last element. Check what tells you an element was visited and what signals the end.',
    'Join two values with a delimiter that already occurs in one of them. Ask whether the resulting text gives the reader enough information to recover the original list.',
  ],
  'T4.3': [
    "Read one record as delimited fields and as fixed-width characters. Match the field number to `$PIECE` and the character offsets to `$EXTRACT`.",
    'Apply each transformation to the same input. Track whether it searches for a substring or maps individual characters.',
    'Decide what the output must preserve before changing the text. Spaces inside a name and markup displayed as text have different rules from disposable padding.',
  ],
  'T4.4': [
    "Trace `10-2*3+1` in order. Add parentheses around the multiplication and recompute the result.",
    'Split an item count into complete groups and leftovers. Test both a count with a remainder and one that divides exactly.',
    'Decide whether you need a local calendar time, a UTC timestamp, or a duration. Choose the clock that answers that question before doing arithmetic.',
  ],
  'T4.5': [
    "Compare a numeric Boolean test and an explicit empty-string comparison. Try both with `abc` and `1abc`.",
    'Trace the loop after each control command. Identify whether execution moves to the next iteration, leaves the loop, or returns to the caller.',
    'Test the boundary value before trusting the branches on either side. Decide what the expression or routine should return when the value is exactly on the boundary.',
  ],
  'T4.6': [
    "Check whether the value is an object, then test whether its class belongs to the hierarchy your method accepts.",
    'The method or property name arrives at runtime. Trace how the code chooses an allowed member and what happens after it invokes or updates it.',
    'Choose where to look for a member that may be inherited. Compare the class source with the metadata available after compilation.',
  ],
  'T4.7': [
    "Pick a stream by where the data lives and how it should be read. Check the read cursor before reading the content again.",
    'Follow one request through the returned status, the HTTP response, and the body. Decide which checks must pass before the application can use the body.',
    'Follow a message from composition through SMTP submission. Identify what the send result tells the application and what it cannot say about delivery.',
  ],
  'T5.1': [
    "Identify which phase produced the first error. For a missing macro, check preprocessing before investigating the generated routine.",
    'Pick a timer for the duration of a block. Keep track of the unit so you can explain the result in both seconds and milliseconds.',
    'Decide which part of the workload is slow enough to investigate. Match the tool to the evidence you need about the system, a query, or a line of code.',
  ],
  'T5.2': [
    "Compare a method that returns an error status with one that throws. Trace which branch executes next in a caller with `TRY` and `CATCH`.",
    'Decide what the caller should see after you catch and log a failure. Work out whether the operation can recover or whether the failure needs to continue outward.',
    'Several independent checks can fail in one operation. Decide how to keep their structured status values and when to turn them into readable messages.',
  ],
  'T5.3': [
    "Start at the failing expression. Check variable spelling, whether traversal has ended and whether a lookup returned an object before reading a property.",
    'Trace each operation until you find the condition that should stop it. Test what happens at the recursive base case, in a cycle, or when there are no scores to average.',
    'Calculate the average under two policies for missing scores. Explain which values contribute to the total and which records contribute to the denominator.',
  ],
};


// Plain-language overviews for the five exam areas shown on the study plan.
export const examAreaDescriptions = {
  T1: "Learn how IRIS classes represent application data. Compare persistent objects, which IRIS stores with their own IDs, with serial objects stored inside another object. Then work with properties, indexes, methods, inheritance, JSON, and streams.",
  T2: "See how to keep application data consistent and protected. Transactions and locks coordinate updates. Logging and metrics help you understand what an application is doing, while access controls and safe SQL protect data.",
  T3: "Understand how ObjectScript data and SQL tables fit together in IRIS. Compare variable and global lifetimes, see how ObjectScript values differ from SQL NULL, and follow schema changes and query plans to understand performance.",
  T4: "Build fluency with everyday ObjectScript operations. Traverse arrays and globals, handle lists, strings, numbers, and dates, write conditions and loops, inspect classes at runtime, and use file, HTTP, FTP, and email APIs.",
  T5: "Find and handle errors from compilation through runtime. Use compiler diagnostics and performance tools, work with exceptions and status codes, and trace common error messages to the code or data behind them."
};

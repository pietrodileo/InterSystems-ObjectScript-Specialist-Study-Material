// Each introduction connects the chapter's concepts through a single exam scenario.
export const guides = {
  'T1.1': [
    'Take a patient record and its address. Which needs an ID of its own, which can live inside the patient, and which object only needs to exist while the code runs? Once you\'ve made those choices, trace what happens when you save: start with the object in memory, find its assigned ID, and read the storage definition. If the question gives you a custom map, use the locations in it.',
    'An ID counter records allocations. It can have gaps even if nobody deleted a row. You also need to check the outer transaction before you can say that an assigned ID belongs to a committed row.',
  ],
  'T1.2': [
    'For a shipment table, a required field or a numeric range tells you what you can save. An index helps you find what you saved. A stream is about handling a large value. A derived property raises a timing question: when does IRIS calculate the value, and does it store the result? In an exam question, match the choice to the requirement it addresses.',
    'Read the validation result and the save status to see how an invalid value was handled. For a derived property, check what SQL returns and what you get from ObjectScript.',
  ],
  'T1.3': [
    'To trace a method call, start with the object and the arguments. Even a reference passed by value can still point to the same object as a variable in the caller. After you work out what state the method can see, find the implementation that runs. It might come from a parent class. Then follow its result back to the caller.',
    '`ByRef` and `Output` declare how the parameter is meant to work. At the ObjectScript call site, look for a dot before the argument. A `ClassMethod` has no implicit instance, so it can\'t access an instance property that way.',
  ],
  'T1.4': [
    'Start with a JSON object you\'ve just parsed. Does the key exist, what does it hold, and who else can see the change if you update it? Then follow the payload into a stream. Its position changes as you read, so use the diagrams to predict what a second read returns and what changes after a rewind.',
    'In JSON, `true` and `null` are literal tokens. In ObjectScript, they aren\'t predefined variables. If you\'re testing read position, call `Rewind()` explicitly so you know where the next read starts.',
  ],
  'T2.1': [
    'Two workers are updating the same order. The transaction groups the changes that commit together. The lock coordinates the workers, provided they both lock the same resource. After each command, write down the transaction level and the locks still held. That will tell you what a nested rollback undoes and what you still have to clean up.',
    'A rollback leaves local variables and ordinary application locks alone. Check the lock escalation settings and the rules for `$INCREMENT` and `$SEQUENCE` separately.',
  ],
  'T2.2': [
    'If a batch ran slowly overnight, what would you need to find out tomorrow? Record which operation ran and decide whether the log needs to outlive the process. Record both the elapsed time and the amount of work. A batch can take longer because each iteration costs more or simply because there were more iterations.',
    'Read how the component uses `^%ISCLOG` before interpreting its levels. `$ZHOROLOG` reports seconds since system startup, including fractions of a second.',
  ],
  'T2.3': [
    'When a request fails, check what the caller is allowed to do, which names the code can access, and how the SQL statement gets its values. Permissions, scope, and parameter binding address different problems. Once you know which check failed, you can choose the right fix.',
    'Making a method private limits who can call it directly. Check resource permissions separately. Bind SQL values and choose identifiers and sort directions from an explicit allowlist.',
  ],
  'T3.1': [
    'Who needs to see the counter, and how long should it last? A local variable follows scope rules, a process-private global belongs to one process, and other processes can reach a shared global. For a shared counter, reason about a single increment and then about the rest of the update.',
    'A process can have a different lifetime from a web session. Read the namespace mappings to find the physical database behind a temporary global.',
  ],
  'T3.2': [
    'Follow a value from ObjectScript into SQL and back. Check how the operator interprets the input and which representation the SQL interface returns. When you fetch from a cursor, read the status before using the host variables. If there\'s a macro in the code, remember that its expansion happened at compile time.',
    'The SQL interface and select mode determine whether to expect logical, ODBC, or display values. Check the field names and SQL projection too, since both can be customized.',
  ],
  'T3.3': [
    'A report has some missing scores. Before you write its filter, distinguish an undefined local, an empty string, a NUL character, and SQL NULL. Follow each value through the filter to see which rows survive. Then check which of those values the aggregate counts.',
    'SQL NULL, JSON null, and an undefined ObjectScript variable are separate states. Check how the interface you\'re using converts between them.',
  ],
  'T3.4': [
    'Suppose you add an index and rename a field in a table that\'s already in use. Keep a list of what changes at each step: the definition, the stored rows, the index entries, and the query plan. Seeing a new definition tells you little about whether the other three are ready. Use the migration cases to decide what to verify before moving on.',
    'Defining an index, populating it, and collecting statistics are separate steps. Check for a frozen plan and see how your IRIS version handles a change in statistics.',
  ],
  'T3.5': [
    'For a slow query, first pin down what the user is waiting for. Inspect the plan and measure the relevant work under comparable conditions. An index can narrow the search and still leave rows to fetch. Time those fetches too if the user is waiting for all the results.',
    'Use the actual plan and measurements from a representative workload to decide whether to retune statistics. The optimizer has several plans to choose from, so a single threshold won\'t tell you whether a change helps.',
  ],
  'T4.1': [
    'Sketch a sparse array and trace one pass. `$ORDER` gives you the next subscript, and `$DATA` tells you whether the node has a value, descendants, or both. Check for the end marker before reading the node. Then run the same trace on an empty array and on a branch that has descendants without a value of its own.',
    'The examples use the collation specified in each scenario. Keep track of the subscript and the value stored at that subscript separately.',
  ],
  'T4.2': [
    'Take a three-position list with an omitted element in the middle. Walk it with the iterator, then try the same thing with an empty string in that position. The encoded list preserves that structure. Joining values with a delimiter can lose the boundaries when the delimiter also appears in the data.',
    '`$LISTNEXT` uses an opaque cursor. It can visit an omitted element and leave the output variable undefined, so check before reading it.',
  ],
  'T4.3': [
    'For a line of imported text, decide what you need back. Use a delimiter to identify fields or character positions to select a range. If you\'re transforming the value, check what must survive the change and where the result will be used.',
    'Use HTML encoding when the result goes into HTML. If you need a number, validate the input separately from converting it.',
  ],
  'T4.4': [
    'Work through an expression in ObjectScript\'s evaluation order, then use parentheses to express the grouping you meant. For time calculations, write down the units before doing the arithmetic. Days, seconds since midnight, and elapsed seconds answer different questions. Try a case that crosses midnight to see whether you also need to update the date.',
    'ObjectScript evaluates arithmetic left to right unless you group it. Using only the numeric prefix of `$HOROLOG` drops the time of day.',
  ],
  'T4.5': [
    'Trace a routine that tests a condition and can exit early from a loop. Check how the condition interprets the input, then see whether each exit leaves the loop or the method. Try an equal value and an empty input to see if every branch has a defined result.',
    '`$SELECT` needs a true condition to return a value. If you need to leave the method from inside a `FOR` loop, follow the method\'s return contract.',
  ],
  'T4.6': [
    'When you get an object reference and an operation name at runtime, verify the reference and check its type. Then work out whether the call needs an instance. To find a member, look at the local declaration if you want what the class defines itself, or the compiled view if you also need inherited members.',
    'Check that the reference is a valid object before calling `%IsA`. Restrict dynamically chosen method names to operations the caller is allowed to use.',
  ],
  'T4.7': [
    'Follow a document as your code reads it and sends it to an external service. The stream type affects how the data is handled. The stream position determines where the next read starts. Once you send an HTTP request, check both whether the transport worked and what status the server returned.',
    'HTTPS needs the appropriate TLS configuration. The snippets show the order of operations. You\'ll need the deployment settings for your environment to run them there.',
  ],
  'T5.1': [
    'Start with the failure you can observe. For a compiler diagnostic, inspect the definitions, preprocessing, or generated code. For slow execution, decide whether you need a measurement for a block of code, a query plan, or the whole process. Pick the tool once you know which evidence would narrow it down.',
    'Subtracting two `$HOROLOG` strings doesn\'t generally give elapsed seconds. `$ZH` is short for `$ZHOROLOG`.',
  ],
  'T5.2': [
    'Trace a failure back to the caller. A returned status gives the caller something to inspect. A thrown exception changes where execution continues. Decide where to convert between the two and what to log. Then check what the caller receives after you log the error.',
    '`$STACK` gives the current depth. `$STACK(-1)` gives the highest level with available information, which can include error information. By the time a `CATCH` runs, some unwound frames may already be unavailable.',
  ],
  'T5.3': [
    'Read the error and find the expression that triggered it. Check whether its names are defined, whether its subscripts and references are valid, and whether the operation is allowed. If a loop or recursive call never finishes, trace a small example. When data is missing, find out why before deciding whether a default belongs there.',
    'For `PROTECT`, check privileges and database write access. If a subscript is involved, check whether the node has no value or the process disallows the subscript. Check for empty input before dividing.',
  ],
};

// Follow-up questions mirror the three worked cases in each chapter, in pack order.
export const variations = {
  'T1.1': [
    ['`SKUIdx` declares `Location` as `^A1B2.C3D4.3`, and the general `IndexLocation` ends in `.I`. Where do you look for this index?', 'Look in `^A1B2.C3D4.3`, the location declared on `SKUIdx`.'],
    ['The table has IDs 1, 2, and 8. How many rows are there? Can you assume ID 3 exists?', 'There are three rows. IDs can have gaps.'],
    ['You create an object with `%New`. When does it get a persistent row?', 'Creating an instance puts it in memory. A successful save writes the row.'],
  ],
  'T1.2': [
    ['`Name` and `Category` are valid. `Salary` is 29999, and the minimum is 30000. Is it enough that the salary is a number?', 'The value needs to satisfy the numeric type and the minimum. Here it falls below the minimum.'],
    ['The shipped orders have IDs 2, 4, and 6. The orders for the North region have IDs 1, 4, and 6. Which orders match both filters?', 'IDs 4 and 6. You may still need to read the rows to fetch properties outside the index.'],
    ['You add a derived field to an existing table. How can you tell whether old rows already have its value?', 'Read the property keywords and check when the value is calculated. The formula alone can\'t tell you whether existing rows need an update.'],
  ],
  'T1.3': [
    ['`a` and `b` point to the same object. After `b.Status="Active"`, what does `a.Status` return? What if you then assign a different object to `b`?', '`a.Status` returns `"Active"`. Assigning a different object to `b` changes only that reference. `a` still points to the original object.'],
    ['You increment counter `c` three times. A separate counter `d` starts at zero. What does its first increment return?', 'It returns 1. Each instance keeps its own count.'],
    ['The parent validation fails and the subclass email check passes. What should the method do with the parent failure?', 'Handle the parent failure or pass it back to the caller before returning success.'],
  ],
  'T1.4': [
    ['A JSON object contains `address: null` and omits `phone`. Does `%IsDefined` treat those keys the same way?', '`address` is defined and holds null. `phone` is absent.'],
    ['What does `%Set(0,7)` do to `[10,20,30]`?', 'It replaces the first element. The result is `[7,20,30]`.'],
    ['You read `ABC` from a stream, rewind it, then call `Read(2)`. What comes back?', '`AB`. Rewinding takes you back to the first character.'],
  ],
  'T2.1': [
    ['You\'re at transaction level 2. What level remains if you replace `TROLLBACK 1` with `TROLLBACK` without an argument?', 'Level 0. The form without an argument rolls back the open transaction.'],
    ['Two workers lock different resources before updating the same row. Can both reach the update at the same time?', 'Yes. To serialize their updates, they need to lock the same resource under a shared protocol.'],
    ['You hold `^Order(1)` and `^Order(2)`. Which locks do you hold after `LOCK +^Order(3)` succeeds?', 'All three. The incremental lock adds `^Order(3)` while preserving the other two.'],
  ],
  'T2.2': [
    ['A node has a value and no children. What does `$DATA` return before and after you add a child?', 'It returns 1 before you add the child and 11 afterward.'],
    ['You need to investigate a batch tomorrow, after its process exits. Where should you keep the events in `^||queryLog`?', 'Write or export the events you need to storage that outlives the process.'],
    ['A hundred operations take 2.5 seconds. What is the average time per operation?', '25 ms. That average tells you little about how long the slowest operations took.'],
  ],
  'T2.3': [
    ['You find `AppAdmin` inside the text `SuperAppAdmin`. What should you check to confirm access?', 'Check exact role membership or the required resource permission. A substring match doesn\'t establish either.'],
    ['You bind the name in `WHERE Name=?` and concatenate a user-supplied `ORDER BY` expression. How do you make the sort safe?', 'Choose the identifier and sort direction from an allowlist. Binding the name only protects that value.'],
    ['Does binding `:status` in embedded SQL establish that the caller may run the `UPDATE`?', 'Check authorization separately. Binding controls how SQL receives the value.'],
  ],
  'T3.1': [
    ['Two processes need to share a cache they can rebuild. What should you check before choosing a process-private global?', 'Both processes need to see the cache. Choose shared storage that lasts as long as the cache needs to.'],
    ['Worker A increments `^||counter` to 10. What does worker B see if it has never set that node?', 'The node is undefined in B\'s process. Each process has a separate global.'],
    ['A worker gets ID 8 and exits before writing the record. What can the next worker assume about the next ID?', 'It might get a different ID. Allocations can leave gaps, so the highest ID doesn\'t tell you how many records were written.'],
  ],
  'T3.2': [
    ['What do `"10abc20"+5` and `"abc20"+5` evaluate to?', '15 and 5. ObjectScript reads the leading numeric prefix during conversion.'],
    ['You change a tax macro from 0.07 to 0.08. What happens if you run the calling class without recompiling it?', 'The compiled code still uses 0.07, the value from the previous macro expansion.'],
    ['The first `FETCH` returns `SQLCODE` 100. How many rows should you process?', 'Zero. That fetch returned no row, so leave the host variables alone.'],
  ],
  'T3.3': [
    ['You insert two empty strings and one SQL NULL. How many rows match `IS NULL`?', 'One. The empty strings count as values.'],
    ['Five rows have scores 10, 20, 30, NULL, and NULL. You add a sixth row with score 0. What do `COUNT(Score)`, `COUNT(*)`, and `AVG(Score)` return?', '4, 6, and 15, respectively. Zero contributes to the average and counts as a score.'],
    ['There are 30 Boston rows, 20 with NULL for the city, and 50 for other cities. How many match `City<>\'Boston\' OR City IS NULL`?', '70. The first condition matches the 50 other cities, and the second adds the 20 NULLs.'],
  ],
  'T3.4': [
    ['You add `Phone` with `InitialExpression="N/A"`. What do you need to consider for existing rows?', 'The initial expression sets a value for new objects. Plan a backfill separately if existing rows need the value.'],
    ['You change collation while leaving the stored values alone. Why should the migration plan include the index?', 'The comparison rule affects the index keys. Check the index and rebuild it if needed.'],
    ['A new plan uses an index but reads more blocks than the old plan. How would you decide which to use?', 'Measure both plans on a representative workload and compare the results with your performance goals.'],
  ],
  'T3.5': [
    ['One status matches 2 rows and `Active` matches 80. Can the same index have a different cost for the two queries?', 'Yes. Selectivity, index coverage, and the number of row reads affect the cost.'],
    ['Query A takes 10 ms to execute and 90 ms to fetch its rows. Query B takes 30 ms to execute and 20 ms to fetch. Which delivers all its rows first?', 'B finishes in 50 ms. A takes 100 ms in total.'],
    ['A new index slows writes and leaves query latency unchanged. What should you weigh before keeping it?', 'Compare any benefit the index provides with what it costs to maintain. Appearing in the plan alone doesn\'t justify keeping it.'],
  ],
  'T4.1': [
    ['With standard numeric subscript ordering, which of 1, 2, and 3 come before 10?', 'All three. The order is 1, 2, 3, 10.'],
    ['The timeout node is absent. What does `$GET(node,30)` do?', 'It returns 30 and leaves the node as it was.'],
    ['The first `$ORDER` call returns `""`. How many elements should the traversal read?', 'Zero. Check for the end marker before using the subscript to read a value.'],
  ],
  'T4.2': [
    ['For `x=$LB("A","","C")`, what does `$LISTGET(x,2,"N/A")` return?', 'An empty string. The second element exists, so the fallback doesn\'t apply.'],
    ['You want to number the elements that `$LISTNEXT` visits. Where should that number come from?', 'Keep a separate counter. The iterator uses an opaque cursor to track its own position.'],
    ['You join the values `A|B` and `C` to make `A|B|C`. How many fields will you get if you split at every pipe?', 'Three. Splitting that way can\'t recover the original two fields.'],
  ],
  'T4.3': [
    ['How many characters do you take if you read positions 9 through 16, including both ends?', 'Eight. Position 16 counts along with position 9.'],
    ['What does `$TRANSLATE("banana","an","")` return?', '`b`. The call removes every `a` and `n`.'],
    ['What should remain after you trim the outer spaces from a value containing `Ada Lovelace`?', '`Ada Lovelace`, with the space between the names intact.'],
  ],
  'T4.4': [
    ['What are the results of `2+3*4` and `2+(3*4)` in ObjectScript?', '20 and 14, respectively. ObjectScript evaluates the first expression left to right. The parentheses change that order in the second one.'],
    ['You have 48 items and each group holds 8. How many groups can you fill, and what\'s left?', 'Six full groups, with nothing left over.'],
    ['You add 20 seconds to 23:59:50 and get 00:00:10. What happens to the date?', 'It advances by one day.'],
  ],
  'T4.5': [
    ['The input `"abc"` should pass because it\'s a nonempty description. What should you test in place of `IF value`?', 'Check that the value is defined and differs from the empty string.'],
    ['A method finds a match at index 2 inside a loop. How does it return that index immediately?', 'Use `RETURN 2` to leave the method with the index.'],
    ['The code has branches for values below, equal to, and above 5. Where does `x=5` belong?', 'Handle it in the equality branch and make sure that branch produces a defined result.'],
  ],
  'T4.6': [
    ['`Employee` extends `App.Person`. Can an `Employee` instance return 1 from `%IsA("App.Person")`?', 'Yes. The type check follows inheritance.'],
    ['A user supplies the name of an administrative method. What must you check before calling it?', 'Make sure the requested operation is authorized. A method can exist without being available to that caller.'],
    ['A method doesn\'t appear in the local class declaration. Where else should you look to see whether an instance can call it?', 'Check the compiled class and its hierarchy. The instance may have inherited the method.'],
  ],
  'T4.7': [
    ['Which stream type would you use to keep a PDF\'s contents intact?', 'Use a binary stream to preserve the bytes.'],
    ['The connection works and the server returns HTTP 500. What does that tell you about the request?', 'The transport worked. The server reported an application error.'],
    ['You build a `MailMessage` with a recipient, subject, and body. What\'s left to do?', 'Send it through the configured SMTP channel and check the result.'],
  ],
  'T5.1': [
    ['The compiler reports an undefined `DbName` macro. Where do you start?', 'Check the include and the macro definition, then see what happens during preprocessing.'],
    ['An elapsed-time clock reads 100.250 seconds before a block runs and 100.875 afterward. How long did the block take?', '0.625 seconds. Subtract the two decimal elapsed-time readings.'],
    ['The process is slow, but the query itself is quick. What would you measure next?', 'Measure the code around the query and look for other waits in the process.'],
  ],
  'T5.2': [
    ['A method returns an error `%Status` inside `TRY` without throwing an exception. What must happen for the caller to notice the error?', 'The caller has to inspect the status or convert it to an exception as the method\'s contract requires. `CATCH` doesn\'t run automatically.'],
    ['The method logs a failure and returns OK. What does the caller see?', 'The status tells the caller the operation succeeded. Report the failure through the return contract or another explicit channel.'],
    ['Two constraints fail, and the caller expects every validation error. What should you return?', 'Keep both failures in a structured result so the caller can see each one.'],
  ],
  'T5.3': [
    ['You set `city="Rome"` and later read `City`. Which value are you reading?', '`City` is a separate local variable. ObjectScript variable names are case-sensitive.'],
    ['A linked structure goes 1 to 2 to 3 and back to 1. How can you stop the traversal?', 'Track the nodes you\'ve already visited and handle the cycle when you encounter one again. This chain won\'t reach an empty next node on its own.'],
    ['The scores are 10, 20, missing, and 40. How does the average change if you count the missing score as zero?', 'Ignoring it gives 70/3. Counting it as zero gives 70/4. Choose which rule the report should use.'],
  ],
};

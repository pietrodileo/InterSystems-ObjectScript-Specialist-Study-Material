// Each introduction connects the chapter's concepts through a single exam scenario.
export const guides = {
  'T1.1': [
    'Start with a patient record and an address. Decide which object needs its own identity, which can live inside its parent, and which exists only while your code runs. Then trace a save from the in-memory reference to the assigned ID and the storage definition. When a question shows a custom storage map, follow its locations instead of guessing from a global suffix.',
    'In the quiz storage example, an ID counter describes allocations, not the row count. Gaps alone cannot establish that records were deleted. An assigned ID also does not tell you whether an outer transaction has committed.',
  ],
  'T1.2': [
    'Imagine designing a shipment table. A required field and a numeric range govern what can be saved, while an index governs how you find rows. A stream changes how you handle a large value, and a derived property adds a separate question about when its value is calculated or stored. When a prompt mixes these choices, identify which requirement each one solves.',
    'Check validation and save status instead of relying on truncation. Check both the SQL projection and the ObjectScript accessor when working with derived properties.',
  ],
  'T1.3': [
    'When you read a method call, follow the receiver and arguments before following the body. Two variables may refer to the same instance even when the caller passed an argument by value. Once you know what state the method can see, check whether the implementation comes from the class itself or a parent and how its result reaches the caller.',
    'ByRef and Output express the parameter contract. In ObjectScript call syntax, look for the leading dot on the caller’s argument. A ClassMethod has no implicit instance for instance property access.',
  ],
  'T1.4': [
    'Follow a JSON payload from parsing through an update and then into a stream. Ask whether a key exists, what value it holds, and whether another variable points to the same object. Once the payload is a stream, the current read position becomes part of its state. Use the diagrams to trace a second read and a read after rewinding.',
    'JSON tokens such as true and null are not predefined ObjectScript variables. Use an explicit rewind in experiments that are meant to isolate stream positioning.',
  ],
  'T2.1': [
    'Picture two workers updating the same order. A transaction defines which updates commit together, while a lock coordinates workers that agree to use the same resource. Trace the transaction level and the held locks separately after each command. That makes it easier to see what a nested rollback undoes and what still needs explicit cleanup.',
    'Rollback does not automatically restore local variables or release ordinary application locks. Lock escalation settings and the rules for $INCREMENT and $SEQUENCE deserve a separate check.',
  ],
  'T2.2': [
    'Suppose a batch slows down overnight. Before adding a log entry, decide which operation you need to identify, whether its evidence must survive the process, and which quantity you want to compare. Recording both elapsed time and work done lets you tell an expensive iteration from a larger batch.',
    'Check how the component uses ^%ISCLOG instead of assuming a universal set of levels. $ZHOROLOG measures elapsed seconds since system startup and includes fractions.',
  ],
  'T2.3': [
    'Follow a request from the caller to the database. The caller’s permissions determine whether it can act on a resource. Scope and visibility determine what code can access directly. SQL parameter binding addresses a third problem by separating data values from the statement. Work out which boundary has failed before choosing a fix.',
    'A private method is not a resource authorization check. Bound parameters protect values. Choose SQL identifiers and sort directions from an explicit set of allowed choices.',
  ],
  'T3.1': [
    'Pick a place to store a temporary counter by asking who needs to see it and how long it should live. A local variable follows scope rules, a process-private global follows its process, and a shared global can be reached by other processes. When multiple workers share a counter, separate a single increment from the rest of the update.',
    'A process is not necessarily a logical web session. Check namespace mappings before drawing conclusions about the physical database behind a temporary global.',
  ],
  'T3.2': [
    'Trace one value through ObjectScript, SQL, and back again. The operator controls how ObjectScript interprets input, while SQL interfaces can expose different representations. For a cursor, keep the returned status separate from the data and check it before using the host variables. Macros add a different boundary because they expand at compile time.',
    'Check the SQL interface and select mode before assuming a value’s logical, ODBC, or display format. Field names and SQL projection can be customized.',
  ],
  'T3.3': [
    'A report with missing scores forces you to define what “missing” means. An undefined local, an empty string, a NUL character, and SQL NULL have different behavior. Follow the value through a predicate and then an aggregate. The predicate controls which rows survive, and the aggregate controls which surviving values count.',
    'Treat SQL NULL, JSON null, and an undefined ObjectScript variable as separate states. Check how the boundary you are crossing maps them.',
  ],
  'T3.4': [
    'Imagine adding an index and renaming a field in a table already in use. Track the new definition, the stored rows, the derived index entries, and the query plan separately. A change can be visible in one of those places before it is reflected in the others. Use the migration cases to work out what you would verify after each step.',
    'An index definition, index population, and statistics are separate. Check whether a plan is frozen and what the deployed IRIS version does when statistics change.',
  ],
  'T3.5': [
    'Start with a query whose users report as slow. Write down what they actually wait for, inspect the plan, then measure the relevant work under comparable conditions. An index may narrow the candidate set while still requiring row reads. A fast execute call can also hide work that happens while fetching results.',
    'Avoid a universal threshold for retuning statistics. The optimizer can choose among several plans, so use the observed plan and representative measurements to evaluate a change.',
  ],
  'T4.1': [
    'Draw a small sparse array and walk it by hand. The key returned by $ORDER tells you where to go next. $DATA tells you whether that node contains a value, descendants, or both. Handle the end marker before reading the node, then test the same walk on an empty array and on a branch without a value.',
    'The ordering examples assume the collation used in the scenario. Keep subscripts separate from the values stored under them.',
  ],
  'T4.2': [
    'Follow a list containing three positions with something missing in the middle. Compare an omitted element with an explicitly empty string, then walk the list using the iteration API. The encoded list carries structure that would otherwise be lost if you joined its values with a delimiter that can also occur in the data.',
    '$LISTNEXT uses an opaque cursor. An omitted element can be visited even though the output value is undefined, so handle that case explicitly.',
  ],
  'T4.3': [
    'Take a line of imported text and decide whether you need a field, a range of characters, or a transformation. A delimiter gives you field boundaries. Character positions give you a different set of boundaries. Before changing text, ask which distinctions the result must preserve and which context will consume it.',
    'HTML encoding is specific to HTML output. Treat numeric conversion and input validation as separate steps.',
  ],
  'T4.4': [
    'Evaluate the arithmetic as ObjectScript reads it, then add parentheses to make the intended grouping explicit. For time problems, label each number with its unit. A calendar day, seconds since midnight, and elapsed seconds answer different questions. Use a midnight boundary to check whether the calculation preserves the date.',
    'ObjectScript arithmetic evaluates left to right unless grouped. Arithmetic on the numeric prefix of $HOROLOG alone loses the time-of-day part.',
  ],
  'T4.5': [
    'Trace a routine with a condition, a loop, and an early exit. First decide how the condition treats the input. Then mark what each exit actually leaves, whether that is the current loop or the enclosing method. Use equality and an empty input to test whether every branch has a defined result.',
    '$SELECT needs a true condition to produce a value. Inside a FOR loop, use the method’s return contract when you intend to return from the method.',
  ],
  'T4.6': [
    'Suppose you receive a reference and the name of an operation at runtime. Verify that the reference is an object, check the type you need, and decide whether the call needs an instance. When looking up a member, consider whether you need its local declaration or the compiled view that includes inheritance.',
    'Check object validity before calling %IsA. If the method name is selected dynamically, restrict it to authorized operations.',
  ],
  'T4.7': [
    'Trace a document from storage to an external service. A character or binary stream controls how the bytes are handled, and its position controls what is read next. The network operation then has its own result. For HTTP, examine both the transport outcome and the response status before calling the request successful.',
    'HTTPS requires appropriate TLS configuration. The network snippets illustrate control flow and do not contain a complete deployment configuration.',
  ],
  'T5.1': [
    'Start by locating the stage that failed. A compiler diagnostic points toward definitions, preprocessing, or generated code. A performance complaint needs a measurement that matches the suspected work, from one block of code to a query plan or a process. Choose a tool after you can state what evidence you want from it.',
    'Subtracting two $HOROLOG strings does not generally produce elapsed seconds. $ZH is an abbreviation for $ZHOROLOG.',
  ],
  'T5.2': [
    'Follow an error back to the caller. A method can return a status for the caller to inspect or throw an exception that changes control flow. Decide where to convert one to the other, what evidence to log, and how to preserve failure for the next layer. The cases show why logging alone cannot fulfill the return contract.',
    '$STACK reports the current stack depth. $STACK(-1) refers to the highest level with information, including error information. Logging in a CATCH cannot guarantee recovery of every frame already unwound.',
  ],
  'T5.3': [
    'Read the exact error and locate the failing expression. Check which names are defined, whether a subscript or object reference is valid, and whether the operation is allowed. When the symptom involves a loop or recursive call, trace termination with a small example. Choose how to handle genuinely optional data only after identifying why it is absent.',
    'For PROTECT, check privileges and database write access. For a missing subscript, distinguish a node with no value from a subscript the process disallows. Guard empty input before division.',
  ],
};

// Follow-up questions mirror the three worked cases in each chapter, in pack order.
export const variations = {
  'T1.1': [
    ['SKUIdx has its own Location, ^A1B2.C3D4.3. The generic IndexLocation ends in .I. Where do you look for SKUIdx?', 'Follow the explicit location ^A1B2.C3D4.3.'],
    ['The existing IDs are 1, 2, and 8. How many rows are there? Can you assume ID 3 exists?', 'There are three rows. Allocated IDs need not form a contiguous range.'],
    ['You created an object with %New and have not saved it. Does it already have a persistent row?', 'No. Constructing the instance and writing the row are separate operations.'],
  ],
  'T1.2': [
    ['Name and Category are valid. Salary is 29999 and the minimum is 30000. Is the numeric type enough?', 'No. Type and the minimum-value constraint must both pass.'],
    ['Shipped contains IDs 2, 4, 6. North contains IDs 1, 4, 6. Which IDs satisfy both filters?', '4 and 6. Fetching properties outside the index can still require row reads.'],
    ['You add a derived field to an existing table. Does the formula prove the old rows already contain its value?', 'No. Check the property keywords, when it is evaluated, and whether existing data needs updating.'],
  ],
  'T1.3': [
    ['a and b point to the same object. What does a.Status read after b.Status="Active"? What happens to a if b is reassigned?', 'a sees Active. Reassigning b alone leaves a pointing at the original object.'],
    ['After incrementing counter c three times, what does the first increment of a separate counter d starting at zero return?', '1. Each instance has its own state.'],
    ['The parent validation fails, but the subclass email check passes. Should the method return success?', 'Handle or propagate the parent failure before declaring success.'],
  ],
  'T1.4': [
    ['A JSON object has address:null and no phone field. Does %IsDefined return the same result for both?', 'No. address is defined with a null value, while phone is absent.'],
    ['Apply %Set(0,7) to [10,20,30]. What changes?', 'The first element changes, giving [7,20,30].'],
    ['You read ABC, rewind, then call Read(2). What do you get?', 'AB. Rewind moves the read position to the start.'],
  ],
  'T2.1': [
    ['At transaction level 2, replace TROLLBACK 1 with an argumentless TROLLBACK. What level remains?', '0. The argumentless form rolls back the open transaction.'],
    ['Two workers lock different resources before modifying the same row. Does that serialize their updates?', 'No. The workers need a common resource and a shared locking protocol.'],
    ['You hold ^Order(1) and ^Order(2). Which locks remain after a successful LOCK +^Order(3)?', 'All three. An incremental acquisition preserves the locks already held.'],
  ],
  'T2.2': [
    ['A node has a value and no children. What is its $DATA value before and after adding a child?', '1 before and 11 after.'],
    ['You need to analyze a batch tomorrow after its process exits. Is ^||queryLog enough?', 'No. Write or export the needed events to storage that survives the process.'],
    ['One hundred operations take 2.5 seconds. What is the mean per operation?', '25 ms. The mean alone does not describe tail latency.'],
  ],
  'T2.3': [
    ['Does finding AppAdmin inside the text SuperAppAdmin prove the caller has the AppAdmin role?', 'No. Check exact role membership or the required resource permission.'],
    ['You bind Name in WHERE Name=? but concatenate a free-form ORDER BY expression. Is the sort protected?', 'No. Restrict the identifier and direction to allowed choices.'],
    ['Does using :status in embedded SQL settle whether a caller may perform the UPDATE?', 'No. Binding a value and authorizing an operation are separate checks.'],
  ],
  'T3.1': [
    ['Two processes need to share a rebuildable cache. Is a process-private global suitable?', 'No. Use storage visible to both processes with the lifetime the cache needs.'],
    ['Worker A increments ^||counter to 10. Does worker B see 10 in its own uninitialized ^||counter?', 'No. The node is undefined in B’s process.'],
    ['A worker allocates ID 8 and exits before writing the record. Must the next worker get 8?', 'No. Allocation can leave a gap, so the highest ID is not a count of completed writes.'],
  ],
  'T3.2': [
    ['Evaluate "10abc20"+5 and "abc20"+5.', '15 and 5. Numeric coercion uses the leading numeric prefix.'],
    ['You change a tax macro from 0.07 to 0.08 without recompiling the calling class. Can you expect the new value?', 'No. The running code was built using the previous macro expansion.'],
    ['The first FETCH returns SQLCODE 100. How many rows should you process?', 'Zero. Do not process the host variables as if FETCH had returned a row.'],
  ],
  'T3.3': [
    ['You insert two empty SQL strings and one SQL NULL. How many rows satisfy IS NULL?', 'One. An empty SQL string is a non-NULL value.'],
    ['Five rows have scores 10, 20, 30, NULL, and NULL. Add a sixth row with score 0. What are COUNT(Score), COUNT(*), and AVG(Score)?', '4, 6, and 15. Zero participates in the aggregate.'],
    ['There are 30 Boston rows, 20 NULL cities, and 50 other cities. How many match City<>\'Boston\' OR City IS NULL?', '70. The explicit NULL condition includes the 20 missing cities.'],
  ],
  'T3.4': [
    ['You add Phone with InitialExpression="N/A". Does this automatically populate old rows?', 'No. An initial expression for new objects is separate from a data backfill.'],
    ['You change collation without changing row values. Can the index be left out of the migration plan?', 'No. The indexed keys depend on the comparison rule. Check and rebuild the index as needed.'],
    ['A new plan uses an index but reads more blocks than the old one. How do you choose?', 'Measure both on a representative workload against the performance goals.'],
  ],
  'T3.5': [
    ['A rare status finds 2 rows and Active finds 80. Do both cost the same with the same index?', 'They can differ. Selectivity, index coverage, and row reads all affect the cost.'],
    ['A takes 10 ms to execute and 90 ms to fetch. B takes 30 ms to execute and 20 ms to fetch. Which delivers all rows first?', 'B at 50 ms, versus 100 ms for A.'],
    ['A new index slows writes and leaves query latency unchanged. Is its presence in the plan enough reason to keep it?', 'Judge the overall benefit against the index’s maintenance cost.'],
  ],
  'T4.1': [
    ['With standard numeric subscript ordering, which of 1, 2, and 3 precede 10?', 'All three. The numeric order is 1, 2, 3, 10.'],
    ['A timeout node is absent. Does reading it with $GET(node,30) store 30?', 'No. $GET returns the default without writing the node.'],
    ['The first $ORDER call returns "". How many array elements should the traversal read?', 'Zero. Handle the end marker before dereferencing the subscript.'],
  ],
  'T4.2': [
    ['For x=$LB("A","","C"), what does $LISTGET(x,2,"N/A") return?', 'An empty string. The second element is present, so the fallback is not used.'],
    ['You want to number each element visited by $LISTNEXT. Can you print its cursor as the element number?', 'Keep a separate counter. The cursor is an opaque position used by the iterator.'],
    ['The values A|B and C are joined as A|B|C. How many fields does a naive pipe splitter produce?', 'Three. The original two-field structure was lost.'],
  ],
  'T4.3': [
    ['How many character positions are in the inclusive range 9 through 16?', 'Eight. Both endpoints are included.'],
    ['What does $TRANSLATE("banana","an","") return?', 'b. Every a and n is removed.'],
    ['To trim outer spaces in "Ada Lovelace", should the result be "AdaLovelace"?', 'No. Preserve the internal space when removing outer whitespace.'],
  ],
  'T4.4': [
    ['Evaluate 2+3*4 and 2+(3*4) in ObjectScript.', '20 and 14. The parentheses change the default left-to-right evaluation.'],
    ['There are 48 items and groups of size 8. How many full groups and leftovers?', 'Six full groups and zero leftovers.'],
    ['Add 20 seconds to 23:59:50. Can you keep the original date with time 00:00:10?', 'No. Advance the date by one day as well.'],
  ],
  'T4.5': [
    ['The input "abc" should pass because it is a nonempty description. Is IF value the right test?', 'Test that the value is defined and different from the empty string.'],
    ['A method finds a match at index 2 inside a loop and should return that index immediately. What command expresses this?', 'Use RETURN 2 to return from the method.'],
    ['You branch on less than, equal to, and greater than 5. Which branch must handle x=5?', 'The equality branch. Cover that case explicitly so it produces a defined result.'],
  ],
  'T4.6': [
    ['Employee extends App.Person. Can an Employee instance return 1 from %IsA("App.Person")?', 'Yes. The type test follows inheritance.'],
    ['A user supplies an administrative method name. Is checking whether it exists enough?', 'No. Limit dynamic dispatch to authorized operations.'],
    ['A method is absent from the local class declaration. Can the compiled instance still call it?', 'Yes. Look for inherited members in the compiled view and class hierarchy.'],
  ],
  'T4.7': [
    ['Which stream type preserves an arbitrary PDF?', 'Use a binary stream to preserve its bytes.'],
    ['The connection succeeds and the response is HTTP 500. Did the application request succeed?', 'No. Transport succeeded, but the server reported an error.'],
    ['You built a MailMessage with a recipient, subject, and body. Has it been sent?', 'No. Send it through the configured SMTP channel and check the result.'],
  ],
  'T5.1': [
    ['The compiler reports an undefined DbName macro. What do you inspect first?', 'Check the include, macro definition, and preprocessing stage.'],
    ['An elapsed-time clock reads 100.250 seconds before a block and 100.875 after. What is the interval?', '0.625 seconds. These are decimal elapsed readings.'],
    ['The process is slow even though the query is brief. Where do you look next?', 'Measure the surrounding code and other waits in the process.'],
  ],
  'T5.2': [
    ['A method returns an error %Status inside TRY and does not THROW. Does CATCH run automatically?', 'No. Check or convert the status explicitly according to the method contract.'],
    ['You log a failure and return OK. What will the caller infer from the status?', 'It will infer success. Preserve failure in the return contract or another explicit channel.'],
    ['Two constraints fail. The caller expects all validation errors. Should you keep only the final message?', 'Keep both failures in a structured representation and present them to the caller.'],
  ],
  'T5.3': [
    ['You set city="Rome" and later read City. Are they the same local variable?', 'No. ObjectScript variable names are case-sensitive.'],
    ['A linked structure goes 1 → 2 → 3 → 1. Will a traversal reach an empty next node by itself?', 'No. Detect previously visited nodes and handle the cycle.'],
    ['For 10, 20, missing, and 40, does ignoring the missing score give the same average as replacing it with zero?', 'No. Ignoring it gives 70/3, while treating it as zero gives 70/4. Choose the policy explicitly.'],
  ],
};

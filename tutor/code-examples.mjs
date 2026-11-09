// Examples are keyed by chapter and concept number, or by chapter and diagram title.
export const studyExamples = {
  'T1.1/1': [
    ["Compare persistent, serial, registered, and utility classes","Class Tutor.Address Extends %SerialObject\n{\n    Property City As %String;\n    Property PostalCode As %String(MAXLEN = 10);\n}\n\nClass Tutor.Person Extends %Persistent\n{\n    Property Name As %String;\n    Property HomeAddress As Tutor.Address;\n}\n\nClass Tutor.Calculator Extends %RegisteredObject\n{\n    Method Total(amount As %Numeric, tax As %Numeric) As %Numeric\n    {\n        return amount * (1 + tax)\n    }\n}\n\nClass Tutor.MathUtils\n{\n    ClassMethod Square(value As %Numeric) As %Numeric\n    {\n        return value * value\n    }\n}\n\n// In a compiled application method:\nset person = ##class(Tutor.Person).%New()\nset person.Name = \"Ada\"\nset person.HomeAddress.City = \"Rome\"\nset sc = person.%Save()\nif $SYSTEM.Status.IsError(sc) {\n    write $SYSTEM.Status.GetErrorText(sc), !\n    quit\n}\nwrite \"Person ID: \", person.%Id(), !\n\nset calculator = ##class(Tutor.Calculator).%New()\nwrite calculator.Total(100, .22), !\nwrite ##class(Tutor.MathUtils).Square(3), !","Compile the class definitions in separate class files. Saving Person creates the persistent record and gives Person an ID. HomeAddress is a %SerialObject embedded in that record, so it has no independent ID. Assigning City and PostalCode through HomeAddress creates the embedded value; you do not need to call %New() for it. Calculator can be instantiated and used in memory but does not create a database row. MathUtils groups class methods and has no object superclass, so call Square() on the class instead of creating it with %New(). The example prints the person ID, 122, and 9."],
  ],
  'T1.1/2': [
    ['Save an object and read its ID', `set person = ##class(Sample.Person).%New()
set person.Name = "Ada"
set sc = person.%Save()
if $SYSTEM.Status.IsError(sc) {
    write $SYSTEM.Status.GetErrorText(sc), !
    quit
}
write person.%Id(), !`, 'Use a scratch namespace with a compiled Sample.Person class. Read %Id() after checking %Save(). If an outer transaction is open, an assigned ID does not prove it has committed.'],
    ['Check for a message and open it by its unique key', `Set found = ##class(Tutor.IndexedMessage).MIIdxExists("JTE810", .id)
If 'found {
    Write "Message not found", !
    Quit
}
Write "Object ID: ", id, !

Set message = ##class(Tutor.IndexedMessage).MIIdxOpen("JTE810", , .sc)
If $SYSTEM.Status.IsError(sc) {
    Do $SYSTEM.Status.DisplayError(sc)
    Quit
}
Write "MessageId: ", message.MessageId, !
Set message = ""`, 'Compile Tutor.IndexedMessage and save the sample row from the full explanation. MIIdxExists returns a Boolean and can also give you the object ID. MIIdxOpen returns an object reference and can report errors through the status argument.'],
  ],
  'T1.1/3': [
    ['Delete a message by its unique key', `Set sc = ##class(Tutor.IndexedMessage).MIIdxDelete("JTE810")
If $SYSTEM.Status.IsError(sc) {
    Do $SYSTEM.Status.DisplayError(sc)
    Quit
}
Write ##class(Tutor.IndexedMessage).MIIdxExists("JTE810"), !
// 0`, 'Continue with the sample row from section 2. MIIdx is the index name and JTE810 is a MessageId value. MIIdxDelete uses that key to delete the object. Check the returned status before testing whether the key is still present.'],
  ],
  'T1.1/4': [
    ['Find the location for one named index', `<Storage name="Default">
    <DataLocation>^Tutor.InvoiceD</DataLocation>
    <IdLocation>^Tutor.InvoiceD</IdLocation>
    <IndexLocation>^Tutor.InvoiceI</IndexLocation>
    <Index name="CityIdx">
        <Location>^Tutor.InvoiceCity</Location>
    </Index>
    <Type>%Storage.Persistent</Type>
</Storage>`, 'IndexLocation is the default for the class. If DateIdx has no explicit Location in this layout, its entries are under ^Tutor.InvoiceI("DateIdx",...). CityIdx has its own Location, so its entries are under ^Tutor.InvoiceCity. The invoice records live under DataLocation.'],
    ['Compare standard and hashed storage globals', `// Declare inside GlobalsTest.President before IRIS generates storage
Parameter USEEXTENTSET = 1;

// USEEXTENTSET = 0
Records:   ^GlobalsTest.PresidentD
DOBIndex:  ^GlobalsTest.PresidentI("DOBIndex",...)
NameIndex: ^GlobalsTest.PresidentI("NameIndex",...)

// USEEXTENTSET = 1
Records:   ^Ebnm.EKUy.1
DOBIndex:  ^Ebnm.EKUy.2
NameIndex: ^Ebnm.EKUy.3`, 'In this InterSystems example, ^Ebnm.EKUy is the generated ExtentLocation. The two indexes go from sharing one global to using separate globals. Changing the parameter on an existing class does not move its data.'],
  ],
  'T1.1/5': [
    [
      "Resolve a property and a method",
      "Set report = ##class(Tutor.ReportView).%New()\nWrite report.Channel, \" | \", report.Describe(), \" | \", report.FileName, !\n// screen | Screen output | report.txt\n\nSet report = ##class(Tutor.FileReportView).%New()\nWrite report.Channel, \" | \", report.Describe(), \" | \", report.FileName, !\n// file | File output | report.txt",
      "Compile the registered classes in the full explanation. The inheritance direction selects the definition of Channel and Describe(). FileName comes from Tutor.FileDefaults in both cases."
    ],
    [
      "Save a property inherited from a mixin",
      "Set employee = ##class(Tutor.MIEmployee).%New()\nSet employee.FullName = \"Ada Rossi\"\nSet employee.BadgeCode = \"B-42\"\nSet employee.Department = \"Lab\"\n\nSet sc = employee.%Save()\nIf $SYSTEM.Status.IsError(sc) {\n    Do $SYSTEM.Status.DisplayError(sc)\n    Quit\n}\nSet id = employee.%Id()\nSet employee = ##class(Tutor.MIEmployee).%OpenId(id,,.sc)\nIf $SYSTEM.Status.IsError(sc) {\n    Do $SYSTEM.Status.DisplayError(sc)\n    Quit\n}\nWrite employee.Describe(), \" | \", employee.BadgeLabel(), !\n// Ada Rossi / Lab | Badge B-42\nZWrite ^Tutor.MIPersonD(id)",
      "Compile the persistent example in the full explanation. FullName comes from the primary persistent superclass, BadgeCode from the registered mixin, and Department from the employee class. After reopening, the method output shows all three saved values. The employee uses the ^Tutor.MIPersonD data global in this layout."
    ]
  ],
  'T1.2/1': [
    ['Read the length constraint in a property declaration', `Property Code As %String(MAXLEN = 5);`, 'This property declaration belongs inside a class. When the object is validated, "ABCDE" is within the length limit and "ABCDEF" exceeds it. Check the validation or save status.'],
  ],
  'T1.2/4': [
    ['Give new objects a default and require a value', `Property Status As %String [ InitialExpression = "Draft", Required ];

// From a compiled method, after adding the property to Tutor.Invoice:
set invoice = ##class(Tutor.Invoice).%New()
write invoice.Status, !
set invoice.Status = ""
set sc = invoice.%ValidateObject()
write $SYSTEM.Status.IsError(sc), !`, 'A new invoice starts at Draft. Clearing Status before validation prints 1 on the second line because the value is required. The initial expression supplies the starting value only.'],
  ],
  'T1.2/5': [
    ['Index a field used for exact lookups', `Index EmailIdx On Email;`, 'Put this declaration in a persistent class with an Email property. For a lookup such as WHERE Email = ?, inspect the query plan to see whether IRIS chooses the index.'],
  ],
  'T1.2/6': [
    ['Look up a record by email and by object ID', `// Class member in Tutor.Contact:
Index EmailIdx On Email [ Unique ];

// In a compiled method after adding and building that index:
if ##class(Tutor.Contact).EmailIdxExists("ada@example.test", .id) {
    write "ID: ", id, !
    write ##class(Tutor.Contact).%ExistsId(id), !
}`, 'Seed the test class with a matching contact. EmailIdxExists() searches using the indexed business value and returns the object ID in id. %ExistsId() takes that ID and prints 1 for an existing record.'],
  ],
  'T1.3/1': [
    ['Compare a call on an object with a call on its class', `Class Sample.Counter Extends %RegisteredObject
{
    Property Count As %Integer [ InitialExpression = 0 ];

    Method AddOne() As %Integer
    {
        set ..Count = ..Count + 1
        return ..Count
    }

    ClassMethod InitialCount() As %Integer
    {
        return 0
    }
}`, 'After compiling the class, call AddOne() twice on the same new instance to get 1 and 2. Call ##class(Sample.Counter).InitialCount() directly to get 0 without creating an instance.'],
  ],
  'T1.3/2': [
    ['Read a class parameter inside a class method', `Parameter TaxRate = 0.05;

ClassMethod Total(amount As %Numeric) As %Numeric
{
    return amount * (1 + ..#TaxRate)
}`, 'Add these members to a class and call Total(100). It returns 105. The # in ..#TaxRate names a class parameter, which the class method can read without an instance.'],
  ],
  'T1.3/5': [
    ['Swap the caller’s variables with ByRef', `ClassMethod Swap(ByRef a As %String, ByRef b As %String)
{
    set temp = a
    set a = b
    set b = temp
}

// From the caller, after compiling Swap in Sample.Utils:
set x = "left", y = "right"
do ##class(Sample.Utils).Swap(.x, .y)
write x, " / ", y, !`, 'The dots before x and y give Swap access to the caller’s variables. The caller prints right / left.'],
  ],
  'T1.3/6': [
    ['Update one node in the caller’s array', `ClassMethod AddResult(ByRef results)
{
    set results("passed") = $get(results("passed")) + 1
}

// In a caller after compiling AddResult in Tutor.Counter:
set counts("passed") = 2, counts("failed") = 1
do ##class(Tutor.Counter).AddResult(.counts)
write counts("passed"), "/", counts("failed"), !`, 'Passing .counts gives the method access to the caller’s local array. It updates just the passed node, so the caller prints 3/1.'],
  ],
  'T1.4/1': [
    ['Change one field in a JSON object', `set person = ##class(%DynamicObject).%FromJSON("{""name"":""Ada""}")
do person.%Set("active", 1, "number")
write person.name, !
write person.%ToJSON(), !`, 'The first WRITE prints Ada. In the serialized object, active is the number 1.'],
  ],
  'T1.4/2': [
    ['Write, rewind, and read from a character stream', `set stream = ##class(%Stream.TmpCharacter).%New()
set sc = stream.Write("ABCDEF")
if $SYSTEM.Status.IsError(sc) { quit }
set sc = stream.Rewind()
if $SYSTEM.Status.IsError(sc) { quit }
set text = stream.Read(3,.sc)
if '$SYSTEM.Status.IsError(sc) { write text, ! }`, 'The output is ABC. Rewind() positions the reader at the start. Read(3) requests three characters, so it leaves DEF for the next read.'],
  ],
  'T2.1/1': [
    ['Commit two writes in the same transaction', `// Use a scratch namespace with no transaction already open.
tstart
set ^TutorScratch("order",1) = "paid"
set ^TutorScratch("receipt",1) = "issued"
tcommit
write $TLEVEL, !`, 'Both changes are committed together. $TLEVEL prints 0 because the outermost transaction has ended. Run the rollback example next to compare what happens when work is abandoned.'],
  ],
  'T2.1/2': [
    ['Compare a local variable with a rolled-back global', `// In a scratch namespace, with no transaction already open:
set localValue = "before"
tstart
set ^TutorScratch("rollback") = "inside"
set localValue = "inside"
trollback
write localValue, !`, 'The local variable still prints inside. The global node returns to its state before TSTART.'],
  ],
  'T2.1/3': [
    ['Try to acquire a lock with a timeout', `lock +^TutorScratch("counter"):2
if '$TEST {
    write "Counter is busy", !
    quit
}
set count = $INCREMENT(^TutorScratch("counter"))
lock -^TutorScratch("counter")
write count, !`, 'In a scratch namespace, hold the same lock in a second session to trigger the timeout. The lock coordinates callers that use the same lock name. Release the test lock from the session that acquired it.'],
  ],
  'T2.2/1': [
    ['Check for a value before reading a global node', `// In a scratch namespace:
set ^TutorScratch("jobs",42,"status") = "queued"
write $DATA(^TutorScratch("jobs",42)), !
write $GET(^TutorScratch("jobs",42,"status"),"missing"), !`, 'The first line prints 10 because job 42 has descendants and no value of its own. The second line reads the status node and prints queued.'],
  ],
  'T2.2/2': [
    ['Keep a process-local log without storing request contents', `set sequence = $INCREMENT(^||TutorRequestLog)
set ^||TutorRequestLog(sequence) = $ZTIMESTAMP _ " Request accepted"
write ^||TutorRequestLog(sequence), !`, 'This log pairs a sequence number with a timestamp and a short event label. Look for the entry in the same process. Use persistent application logging when another process needs to read the entry later.'],
  ],
  'T2.2/3': [
    ['Measure elapsed time per iteration', `set started = $ZHOROLOG
for i = 1:1:1000 {
    set value = i * i
}
set elapsed = $ZHOROLOG - started
write elapsed / 1000, " seconds per iteration", !`, 'The result includes loop overhead. Keep the iteration count and workload comparable when comparing measurements.'],
  ],
  'T2.3/1': [
    ['Limit temporary values to one invocation', `ClassMethod RequestLabel(requestId As %String) As %String
{
    set label = "request " _ requestId
    return label
}`, 'Call RequestLabel("42") to get request 42. The method keeps label in a local variable. There is no shared global for another process to read.'],
  ],
  'T2.3/3': [
    ['Bind a value containing an apostrophe', `set stmt = ##class(%SQL.Statement).%New()
set sc = stmt.%Prepare("SELECT Name FROM Sample.Person WHERE Name = ?")
if $SYSTEM.Status.IsError(sc) {
    write $SYSTEM.Status.GetErrorText(sc), !
    quit
}
set rows = stmt.%Execute("O'Brien")
if rows.%SQLCODE < 0 { write rows.%Message, ! }`, 'With read access to Sample.Person, %Execute() passes O’Brien as data. The apostrophe never becomes part of the SQL statement.'],
  ],
  'T3.1/1': [
    ['Count events inside the current process', `set ^||TutorCounter = 0
set count = $INCREMENT(^||TutorCounter)
write count, !`, 'This process prints 1. A second process has a separate process-private global and does not see this increment.'],
    ['Compare a local, a process-private global, and a shared global', `// Session A, in a scratch namespace:
set tutorValue = "local", ^||TutorValue = "private", ^TutorScratch("value") = "shared"

// Session B, in the same namespace and with read access:
write $DATA(tutorValue), " ", $DATA(^||TutorValue), !
write $GET(^TutorScratch("value")), !`, 'With fresh variables in session B, the first line prints 0 0. The second prints shared. That final lookup uses the namespace’s mapping for ^TutorScratch.'],
  ],
  'T3.2/1': [
    ['Add values and join them as text', `write ("3" + 2), !
write ("3" _ 2), !`, 'Addition prints 5. The underscore joins the same operands and prints 32.'],
  ],
  'T3.2/3': [
    ['Read an object property through its SQL projection', `Class Tutor.Product Extends %Persistent
{
    Property Name As %String;
}

-- SQL after compiling the class and saving an object:
SELECT ID, Name FROM Tutor.Product;`, 'Compile the class definition separately from the SQL. Save a product using %New() and %Save(), then find its Name and ID in the SQL result. Both interfaces read the same persistent record.'],
  ],
  'T3.2/6': [
    ['Check SQLCODE before using the row count', `// Run inside a compiled method in a scratch namespace.
&sql(UPDATE Tutor.Product SET Name = 'New name' WHERE ID = 9999)
if SQLCODE < 0 {
    write "SQL error ", SQLCODE, !
} else {
    write "Rows updated: ", %ROWCOUNT, !
}`, 'With update access and no product at ID 9999, the row count is 0. A negative SQLCODE takes the error branch. A successful statement can affect zero rows.'],
  ],
  'T3.3/1': [
    ['Count rows and count known values', `SELECT COUNT(*) AS TotalRows, COUNT(Score) AS KnownScores
FROM Sample.Results;`, 'For three rows with scores 10, NULL, and 0, TotalRows is 3 and KnownScores is 2. Zero counts as a value.'],
    ['Read SQL NULL and an empty SQL string into ObjectScript', `// Run inside a compiled method.
&sql(SELECT NULL, '' INTO :missing, :emptyText)
if SQLCODE < 0 { write SQLCODE, !  quit }
write $LENGTH(missing), " ", $LENGTH(emptyText), !
write (emptyText = $CHAR(0)), !`, 'The lengths are 0 and 1. The comparison prints 1 because embedded SQL returns the empty SQL string as $CHAR(0), while SQL NULL arrives as an ObjectScript empty string.'],
  ],
  'T3.4/1': [
    ['Declare a new index on an existing property', `Index CityIdx On City;`, 'This declaration tells IRIS which keys the index should contain. For an existing extent, verify index population as a separate migration step.'],
  ],
  'T3.4/2': [
    ['Check whether existing data fits a shorter property', `SELECT ID, Name
FROM Tutor.Product
WHERE CHAR_LENGTH(Name) > 20;

-- Proposed class member, after reviewing those rows:
-- Property Name As %String(MAXLEN = 20);`, 'Run the query before changing the class. Every row it returns has a name longer than the proposed limit. Decide how to handle those values before compiling the change.'],
  ],
  'T3.5/1': [
    ['Gather statistics and look at the plan again', `-- Run on a populated scratch table with the required privileges.
TUNE TABLE Tutor.Product;

-- Select this statement in the SQL Portal and choose Show Plan.
SELECT Name FROM Tutor.Product WHERE Name = 'Pencil';`, 'Capture the plan before and after tuning a table with representative data. Compare the estimated cost and access path. The chosen plan may stay the same.'],
  ],
  'T3.5/2': [
    ['Compare an exact lookup with a function on the indexed column', `-- Use Show Plan for each statement on a table with an index on Name.
SELECT ID FROM Tutor.Product WHERE Name = 'Pencil';
SELECT ID FROM Tutor.Product WHERE CHAR_LENGTH(Name) = 6;`, 'These queries answer different questions. Compare whether the plan can seek directly to a key, scan index entries, or read table rows. The length filter does not give the optimizer a specific Name key to seek.'],
  ],
  'T3.5/3': [
    ['Check the result before timing the code', `set fields = "Ada^Lovelace^London"
set city = $PIECE(fields, "^", 3)
if city '= "London" {
    write "Unexpected result: ", city, !
    quit
}
write "Result verified", !`, 'The check fails if you select the wrong piece. Use the same inputs and verify equivalent results before comparing the speed of two implementations.'],
  ],
  'T4.1/2': [
    ['Walk a sparse array without assuming consecutive keys', `kill stock
set stock(2) = "pens", stock(10) = "paper"
set key = ""
for {
    set key = $ORDER(stock(key))
    quit:key = ""
    write key, ": ", stock(key), !
}`, 'The loop prints keys 2 and 10. Stop at the empty-string sentinel before attempting to read stock(key).'],
  ],
  'T4.1/3': [
    ['Walk the second level of an array', `kill stock
set stock("north","pen") = 3, stock("north","pad") = 1
set stock("south","pen") = 2
set region = ""
for {
    set region = $ORDER(stock(region))
    quit:region = ""
    set item = ""
    for {
        set item = $ORDER(stock(region,item))
        quit:item = ""
        write region, "/", item, ": ", stock(region,item), !
    }
}`, 'The outer loop finds north and south. The inner loop starts again at the empty-string sentinel for each region, so it visits both items in north and the pen in south.'],
  ],
  'T4.1/4': [
    ['Tell an absent node from a branch with children', `kill node
write $DATA(node("a")), !
set node("a",1) = "child"
write $DATA(node("a")), !
set node("a") = "parent"
write $DATA(node("a")), !`, 'The results are 0, 10, and 11. The ones digit marks a value at the node. The tens digit marks descendants.'],
  ],
  'T4.2/1': [
    ['Replace one element and append another', `set fields = $LISTBUILD("Ada", "London")
set $LIST(fields, 2) = "Oxford"
set fields = fields _ $LISTBUILD("UK")
write $LISTTOSTRING(fields, " / "), !`, 'The output is Ada / Oxford / UK. SET $LIST replaces the second element. Appending another encoded list adds an element without changing the existing ones.'],
  ],
  'T4.2/2': [
    ['Supply a default for an omitted list element', `set fields = $LISTBUILD("Ada", , "London")
write $LISTGET(fields, 2, "unknown"), !
write $LISTGET(fields, 3, "unknown"), !`, 'The omitted second element prints unknown. The third element exists and prints London.'],
    ['Iterate through a list without counting indexes', `set fields = $LISTBUILD("Ada", "London", "UK")
set pointer = 0
while $LISTNEXT(fields, pointer, value) {
    write value, !
}`, 'The loop prints Ada, London, and UK. Start pointer at 0 and let $LISTNEXT update it. Its value tracks a position in the encoded list.'],
  ],
  'T4.2/3': [
    ['Turn delimited text into a list and back', `set fields = $LISTFROMSTRING("Ada^London^UK", "^")
write $LISTGET(fields, 2), !
write $LISTTOSTRING(fields, ", "), !`, 'The first line prints London. The second prints Ada, London, UK. Choose a delimiter that cannot appear in the fields when using this pattern to exchange data.'],
  ],
  'T4.3/1': [
    ['Read and replace one field in a record', `set record = "Ada^Lovelace^London"
write $PIECE(record, "^", 3), !
set $PIECE(record, "^", 3) = "Oxford"
write record, !`, 'The first line prints London. The second prints Ada^Lovelace^Oxford. The delimiter and the first two fields stay in place.'],
  ],
  'T4.3/2': [
    ['Replace a fixed-width field in place', `set record = "ORD00042USD"
write $EXTRACT(record,4,8), !
set $EXTRACT(record,9,11) = "EUR"
write record, !`, 'The first line prints 00042 because both bounds are inclusive. The second prints ORD00042EUR. Use character positions for fixed-width records and $PIECE for delimited records.'],
  ],
  'T4.3/3': [
    ['Replace a whole separator or remove individual characters', `set code = "AB::12-34"
write $REPLACE(code,"::","/"), !
write $TRANSLATE(code,":-",""), !`, 'The first line prints AB/12-34 by matching the two-character substring. The second prints AB1234 by removing each colon and hyphen independently.'],
  ],
  'T4.3/6': [
    ['Encode text before writing UTF-8 bytes', `set text = "caf" _ $CHAR(233)
set bytes = $ZCONVERT(text,"O","UTF8")
set decoded = $ZCONVERT(bytes,"I","UTF8")
write $LENGTH(text), " ", $LENGTH(bytes), !
write (decoded = text), !`, 'The source contains four characters. The UTF-8 result contains five bytes because é uses two. Decoding the bytes restores the original text and prints 1.'],
  ],
  'T4.4/1': [
    ['Compare default evaluation with parentheses', `write (2 + 3 * 4), !
write (2 + (3 * 4)), !`, 'The first expression prints 20 because ObjectScript evaluates it left to right. Grouping the multiplication makes the second print 14.'],
  ],
  'T4.4/3': [
    ['Format both parts of the local clock', `set now = $HOROLOG
set days = $PIECE(now,",",1), seconds = $PIECE(now,",",2)
write $ZDATE(days,3), " ", $ZTIME(seconds,1), !`, 'The first part of $HOROLOG is a day count. The second is seconds since local midnight. Formatting both from the same snapshot keeps the date and time consistent if the clock crosses midnight.'],
  ],
  'T4.4/4': [
    ['Add a day across a month boundary', `set day = $ZDATEH("2024-02-29",3)
write $ZDATE(day+1,3), !`, 'This prints 2024-03-01. Convert to a day count for the arithmetic, then format the result for display.'],
  ],
  'T4.5/1': [
    ['Run a command only when its condition holds', `set count = 0
write:count=0 "Nothing to process", !
set count = 2
write:count=0 "Nothing to process", !`, 'The condition belongs to WRITE. Only the first WRITE executes.'],
  ],
  'T4.5/2': [
    ['Exit a loop, then return a value from the method', `ClassMethod FindFirstZero() As %Integer
{
    set values = $LISTBUILD(8,0,5)
    set found = 0
    for i = 1:1:$LISTLENGTH(values) {
        if $LIST(values,i) = 0 {
            set found = i
            quit
        }
    }
    return found
}`, 'The QUIT stops the FOR loop at position 2. Execution then reaches RETURN, which sends 2 to the caller.'],
  ],
  'T4.6/1': [
    ['Choose an instance method at runtime', `set items = ##class(%ListOfDataTypes).%New()
do items.Insert("Ada")
set method = "Count"
write $METHOD(items,method), !`, 'This prints 1. The first argument is an object reference, and method supplies the name at runtime. Use $CLASSMETHOD with a class name when the target is a class method.'],
  ],
  'T4.6/2': [
    ['Check the reference before checking its type', `set value = ##class(%DynamicObject).%New()
if $ISOBJECT(value) {
    write value.%IsA("%Library.DynamicObject"), !
}`, 'The outer check establishes that value is an object. The type check then prints 1 for this instance.'],
  ],
  'T4.7/1': [
    ['Read the first line again after Rewind()', `set stream = ##class(%Stream.FileCharacter).%New()
set sc = stream.LinkToFile("/tmp/notes.txt")
if $SYSTEM.Status.IsError(sc) {
    write $SYSTEM.Status.GetErrorText(sc), !
    quit
}
set first = stream.ReadLine(,.sc)
if $SYSTEM.Status.IsError(sc) { quit }
set sc = stream.Rewind()
if $SYSTEM.Status.IsError(sc) { quit }
set again = stream.ReadLine(,.sc)
if '$SYSTEM.Status.IsError(sc) { write (first = again), ! }`, 'Create /tmp/notes.txt with at least one short line on the IRIS host, or use an existing test file. Rewind() moves the cursor to the start, so reading the same line twice prints 1.'],
    ['Read a file signature without decoding text', `set stream = ##class(%Stream.FileBinary).%New()
set sc = stream.LinkToFile("/tmp/sample.pdf")
if $SYSTEM.Status.IsError(sc) { quit }
set signature = stream.Read(5,.sc)
if '$SYSTEM.Status.IsError(sc) { write signature, ! }`, 'Point to a test PDF on the IRIS host. A PDF that starts with its usual signature prints %PDF-. FileBinary preserves the bytes as stored. This checks the prefix only.'],
  ],
  'T4.7/2': [
    ['Inspect an HTTP response after Get()', `set request = ##class(%Net.HttpRequest).%New()
set request.Server = "example.test"
set request.Timeout = 5
set sc = request.Get("/health")
if $SYSTEM.Status.IsError(sc) {
    write $SYSTEM.Status.GetErrorText(sc), !
    quit
}
write request.HttpResponse.StatusCode, !`, 'Replace the host and path with a test endpoint. Get() returns a %Status. The HTTP status comes from HttpResponse.StatusCode, where a response can still report 404 or 500.'],
    ['Send JSON in a POST request', `set request = ##class(%Net.HttpRequest).%New()
set request.Server = "example.test"
set request.Timeout = 5
set request.ContentType = "application/json"
set sc = request.EntityBody.Write("{""name"":""Ada""}")
if $SYSTEM.Status.IsError(sc) { quit }
set sc = request.Post("/echo")
if $SYSTEM.Status.IsError(sc) {
    write $SYSTEM.Status.GetErrorText(sc), !
    quit
}
write request.HttpResponse.StatusCode, !`, 'Use a test echo endpoint on a host you control. ContentType describes the payload. EntityBody carries the actual JSON, and the response status tells you how the server handled it.'],
  ],
  'T5.1/1': [
    ['Time a block with the elapsed-time clock', `set started = $ZHOROLOG
set total = 0
for i = 1:1:1000 {
    set total = total + i
}
write ($ZHOROLOG - started), " seconds", !`, 'The difference measures the elapsed time for the block. $ZHOROLOG reports seconds and fractions since IRIS started.'],
  ],
  'T5.1/2': [
    ['Print the compiler’s error details', `set sc = $SYSTEM.OBJ.Compile("Tutor.Exercise")
if $SYSTEM.Status.IsError(sc) {
    write $SYSTEM.Status.GetErrorText(sc), !
}`, 'Try this with a disposable class containing a misspelled command. Start with the first reported source error and fix it before chasing later messages. Compile again to see which errors remain.'],
  ],
  'T5.2/1': [
    ['Read the exception name in CATCH', `try {
    set divisor = 0
    write (12 / divisor), !
} catch ex {
    write ex.Name, " at ", ex.Location, !
}`, 'Dividing by zero transfers control to CATCH. The handler prints the error name and location instead of a quotient.'],
  ],
  'T5.2/4': [
    ['Read the entry point for the current stack frame', `// Run inside a compiled method or routine.
set level = $STACK
write "Depth: ", level, !
write "Location: ", $STACK(level,"PLACE"), !`, 'Call the same code from a second method and compare the depth. The $STACK variable gives the depth, and $STACK(level,"PLACE") reports the position for the frame you ask about.'],
  ],
  'T5.2/6': [
    ['Turn a returned error into an exception explicitly', `// Compile inside a class method.
try {
    set sc = $SYSTEM.Status.Error(5001,"Exercise failed")
    $$$ThrowOnError(sc)
} catch ex {
    write $SYSTEM.Status.GetErrorText(ex.AsStatus()), !
}`, 'The status value carries an error, and the macro throws it. CATCH converts the exception back to a status for display. Try the same block with sc set to 1 to see the success path.'],
  ],
  'T5.3/1': [
    ['Validate an identifier before using it as a subscript', `set orderId = ""
if orderId = "" {
    write "Missing order ID", !
    quit
}
write $GET(^TutorScratch("orders",orderId),"unknown"), !`, 'The guard prints Missing order ID before attempting a global read. This also avoids a null global subscript when null subscripts are disabled. An absent record with a valid ID takes the $GET default.'],
  ],
  'T5.3/4': [
    ['Supply a default when an optional variable is undefined', `kill nickname
write $GET(nickname, "guest"), !
write $DATA(nickname), !`, 'The first line prints guest. The second prints 0 because $GET returns the default without defining nickname.'],
  ],
  'T5.3/5': [
    ['Check that a value is an object before calling a method', `set payload = ""
if '$ISOBJECT(payload) {
    write "Expected an object", !
    quit
}
write payload.%ClassName(), !`, 'The first run prints Expected an object. Replace the empty string with a newly created %DynamicObject to reach the method call with a valid object reference.'],
  ],
};

export const diagramExamples = {
  'T3.1/A browser session can span multiple IRIS processes': [
    ['Try the same key from two IRIS processes', `// Terminal A:
set ^||TutorCart("session42") = "book"
write $JOB, " ", $get(^||TutorCart("session42"), "missing"), !

// Terminal B, a separate IRIS process in the same namespace:
write $JOB, " ", $get(^||TutorCart("session42"), "missing"), !

// Terminal A, after the check:
kill ^||TutorCart("session42")`, 'Use two fresh Terminal sessions in a scratch namespace. The process IDs printed by $JOB differ. A prints book and B prints missing, even though both use session42.'],
  ],
  'T3.1/A reserved queue ID can have no message': [
    ['Reserve a key without writing a message', `// Use a disposable local array to model a producer stopping early.
kill queueDemo
set reserved = $increment(queueDemo("last"))
set stored = $increment(queueDemo("last"))
set queueDemo("entry",stored) = "ready"
write reserved, " ", $data(queueDemo("entry",reserved)), !
write stored, " ", $get(queueDemo("entry",stored)), !`, 'The first line prints 1 0 because the first reservation has no payload. The second prints 2 ready. The local array makes the two steps visible without changing a shared queue.'],
  ],
  'T4.1/Zero is a valid key': [
    ['Walk an array whose first key is zero', `kill item
set item(0) = "start", item(4) = "finish"
set key = ""
for {
    set key = $ORDER(item(key))
    quit:key = ""
    write key, ": ", item(key), !
}`, 'Both 0 and 4 appear in the output. A numeric truth test would stop at key 0. Compare explicitly with the empty string.'],
  ],
  'T4.7/Read is a chunk contract': [
    ['Read a character stream in blocks', `set stream = ##class(%Stream.TmpCharacter).%New()
set sc = stream.Write("ABCDEF")
if $SYSTEM.Status.IsError(sc) { quit }
set sc = stream.Rewind()
if $SYSTEM.Status.IsError(sc) { quit }
while 'stream.AtEnd {
    set chunk = stream.Read(2,.sc)
    if $SYSTEM.Status.IsError(sc) { quit }
    if chunk '= "" { write chunk, ! }
}`, 'Expect AB, CD, and EF on separate lines. The same loop can process a larger stream without building one string from the full contents.'],
  ],
  'T4.7/HTTP has multiple outcomes': [
    ['Handle 404 before reading the body', `// The Get() or Post() call has already returned a successful %Status.
set response = request.HttpResponse
set status = response.StatusCode
if status = 404 { write "Record not found", !  quit }
if status '= 200 { write "Unexpected HTTP status: ", status, !  quit }
while 'response.Data.AtEnd {
    set chunk = response.Data.Read(4096,.sc)
    if $SYSTEM.Status.IsError(sc) { quit }
    write chunk
}`, 'This endpoint expects 200. With 404, the code prints Record not found and skips the body loop. With 200, the loop displays the body in chunks. A JSON client would still need to parse and validate the body.'],
  ],
  'T4.7/Email has multiple stages': [
    ['Submit a message to a test SMTP server', `set msg = ##class(%Net.MailMessage).%New()
set msg.From = "tutor@example.test"
do msg.To.Insert("student@example.test")
set msg.Subject = "SMTP exercise"
set sc = msg.TextData.Write("A test message")
if $SYSTEM.Status.IsError(sc) { quit }
set smtp = ##class(%Net.SMTP).%New()
set smtp.smtpserver = "localhost"
set smtp.port = 1025
set sc = smtp.Send(msg)
if $SYSTEM.Status.IsError(sc) {
    write $SYSTEM.Status.GetErrorText(sc), !
} else {
    write "SMTP submission succeeded", !
}`, 'This example expects a local SMTP test sink on the IRIS host. A successful Send() is evidence of submission to the server. Final delivery and reading happen later.'],
  ],
  'T4.7/TLS is configuration': [
    ['Use an existing TLS client configuration', `set request = ##class(%Net.HttpRequest).%New()
set request.Server = "example.test"
set request.Https = 1
set request.Port = 443
set request.SSLConfiguration = "TutorClientTLS"
set sc = request.Get("/health")
if $SYSTEM.Status.IsError(sc) {
    write $SYSTEM.Status.GetErrorText(sc), !
    quit
}
write request.HttpResponse.StatusCode, !`, 'Use a test HTTPS endpoint and a named client configuration that already exists in IRIS. The configuration supplies the trust settings used during the TLS handshake.'],
  ],
  'T5.2/A returned status is not a thrown exception': [
    ['Check a returned error status inside TRY', `try {
    set sc = $SYSTEM.Status.Error(5001, "Example failure")
    if $SYSTEM.Status.IsError(sc) {
        write "Handle the returned status", !
    }
} catch ex {
    write "Caught an exception", !
}`, 'The example prints Handle the returned status. Creating an error %Status alone does not enter CATCH.'],
  ],
};

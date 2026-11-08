// Examples are keyed by chapter and concept number, or by chapter and diagram title.
export const studyExamples = {
  'T1.1/2': [
    ['Save an object and read its ID', `set person = ##class(Sample.Person).%New()
set person.Name = "Ada"
set sc = person.%Save()
if $SYSTEM.Status.IsError(sc) {
    write $SYSTEM.Status.GetErrorText(sc), !
    quit
}
write person.%Id(), !`, 'Use a scratch namespace with a compiled Sample.Person class. Read %Id() after checking %Save(). If an outer transaction is open, an assigned ID does not prove it has committed.'],
  ],
  'T1.2/1': [
    ['Read the length constraint in a property declaration', `Property Code As %String(MAXLEN = 5);`, 'This property declaration belongs inside a class. When the object is validated, "ABCDE" is within the length limit and "ABCDEF" exceeds it. Check the validation or save status.'],
  ],
  'T1.2/5': [
    ['Index a field used for exact lookups', `Index EmailIdx On Email;`, 'Put this declaration in a persistent class with an Email property. For a lookup such as WHERE Email = ?, inspect the query plan to see whether IRIS chooses the index.'],
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
  'T1.4/1': [
    ['Change one field in a JSON object', `set person = ##class(%DynamicObject).%FromJSON("{""name"":""Ada""}")
do person.%Set("active", 1, "number")
write person.name, !
write person.%ToJSON(), !`, 'The first WRITE prints Ada. In the serialized object, active is the number 1.'],
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
  'T2.2/3': [
    ['Measure elapsed time per iteration', `set started = $ZHOROLOG
for i = 1:1:1000 {
    set value = i * i
}
set elapsed = $ZHOROLOG - started
write elapsed / 1000, " seconds per iteration", !`, 'The result includes loop overhead. Keep the iteration count and workload comparable when comparing measurements.'],
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
  ],
  'T3.2/1': [
    ['Add values and join them as text', `write ("3" + 2), !
write ("3" _ 2), !`, 'Addition prints 5. The underscore joins the same operands and prints 32.'],
  ],
  'T3.3/1': [
    ['Count rows and count known values', `SELECT COUNT(*) AS TotalRows, COUNT(Score) AS KnownScores
FROM Sample.Results;`, 'For three rows with scores 10, NULL, and 0, TotalRows is 3 and KnownScores is 2. Zero counts as a value.'],
  ],
  'T3.4/1': [
    ['Declare a new index on an existing property', `Index CityIdx On City;`, 'This declaration tells IRIS which keys the index should contain. For an existing extent, verify index population as a separate migration step.'],
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
  'T4.2/2': [
    ['Supply a default for an omitted list element', `set fields = $LISTBUILD("Ada", , "London")
write $LISTGET(fields, 2, "unknown"), !
write $LISTGET(fields, 3, "unknown"), !`, 'The omitted second element prints unknown. The third element exists and prints London.'],
  ],
  'T4.3/1': [
    ['Read and replace one field in a record', `set record = "Ada^Lovelace^London"
write $PIECE(record, "^", 3), !
set $PIECE(record, "^", 3) = "Oxford"
write record, !`, 'The first line prints London. The second prints Ada^Lovelace^Oxford. The delimiter and the first two fields stay in place.'],
  ],
  'T4.4/1': [
    ['Compare default evaluation with parentheses', `write (2 + 3 * 4), !
write (2 + (3 * 4)), !`, 'The first expression prints 20 because ObjectScript evaluates it left to right. Grouping the multiplication makes the second print 14.'],
  ],
  'T4.5/1': [
    ['Run a command only when its condition holds', `set count = 0
write:count=0 "Nothing to process", !
set count = 2
write:count=0 "Nothing to process", !`, 'The condition belongs to WRITE. Only the first WRITE executes.'],
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
  ],
  'T5.1/1': [
    ['Time a block with the elapsed-time clock', `set started = $ZHOROLOG
set total = 0
for i = 1:1:1000 {
    set total = total + i
}
write ($ZHOROLOG - started), " seconds", !`, 'The difference measures the elapsed time for the block. $ZHOROLOG reports seconds and fractions since IRIS started.'],
  ],
  'T5.2/1': [
    ['Read the exception name in CATCH', `try {
    set divisor = 0
    write (12 / divisor), !
} catch ex {
    write ex.Name, " at ", ex.Location, !
}`, 'Dividing by zero transfers control to CATCH. The handler prints the error name and location instead of a quotient.'],
  ],
  'T5.3/4': [
    ['Supply a default when an optional variable is undefined', `kill nickname
write $GET(nickname, "guest"), !
write $DATA(nickname), !`, 'The first line prints guest. The second prints 0 because $GET returns the default without defining nickname.'],
  ],
};

export const diagramExamples = {
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

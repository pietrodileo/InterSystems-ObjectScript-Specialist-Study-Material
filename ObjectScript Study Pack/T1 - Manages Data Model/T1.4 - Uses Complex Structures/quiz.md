[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T1.4: Complex Structures — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
Consider the following code.

set patient = {}
set patient.name = "Alice Smith"
set patient.age = 34
set patient.active = true
write patient.%ToJSON()

What is the output?
```

**A.** {"name":"Alice Smith","age":34,"active":true}

**B.** {"name":"Alice Smith","age":"34","active":"true"}

**C.** An \<UNDEFINED\> error on the line set patient.active \= true

**D.** {"name":"Alice Smith","age":34,"active":1}

### Answer and explanation

**Correct answer: C.** An \<UNDEFINED\> error on the line set patient.active \= true

In ObjectScript, 'true' is not a keyword or literal \-- it is interpreted as a variable name. Since no variable named 'true' has been defined, the SET command raises an \<UNDEFINED\> \*true error. To set a JSON boolean, you must either use the %Set method with a type parameter: do patient.%Set("active", 1, "boolean"), or use the JSON literal syntax: set patient \= {"active": true}. The JSON literal parser recognizes true/false/null, but the ObjectScript language itself does not. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GJSON_create))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

```text
Consider the following code that processes a JSON API response.

set jsonStr = "{""patients"":[{""name"":""Alice"",""age"":30},{""name"":""Bob"",""age"":45}]}"
set response = ##class(%DynamicObject).%FromJSON(jsonStr)
set patients = response.patients
write patients.%Get(1).name

What is the output?
```

**A.** Alice

**B.** Bob

**C.** An error because %Get() does not support chained property access

**D.** An error because %FromJSON cannot parse nested structures

### Answer and explanation

**Correct answer: B.** Bob

%DynamicArray is zero-indexed. %Get(0) returns the first element (Alice's object) and %Get(1) returns the second element (Bob's object). Then .name accesses the "name" property of that object, returning "Bob". The %FromJSON method correctly parses nested JSON structures into nested %DynamicObject and %DynamicArray instances. Property access can be chained on the returned objects. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GJSON_create))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
A developer needs to build a JSON response with explicit null and boolean values.

set resp = {}
do resp.%Set("status", "success")
do resp.%Set("count", 42)
do resp.%Set("error", "", "null")
do resp.%Set("verified", 1, "boolean")
write resp.%ToJSON()

What is the output?
```

**A.** {"status":"success","count":42,"error":"","verified":1}

**B.** {"status":"success","count":42,"error":null,"verified":true}

**C.** {"status":"success","count":"42","error":null,"verified":"true"}

**D.** An error because %Set does not accept a third argument

### Answer and explanation

**Correct answer: B.** {"status":"success","count":42,"error":null,"verified":true}

The three-argument form of %Set(key, value, type) controls how values are serialized to JSON. With type "null", the value is output as the JSON keyword null regardless of the actual value passed. With type "boolean", a truthy ObjectScript value (1) becomes JSON true and a falsy value (0) becomes JSON false. Without the type argument, numbers stay as JSON numbers and strings stay as JSON strings. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GJSON_create))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
Consider the following code that iterates over a %DynamicObject.

set config = {"host": "localhost", "port": 8080, "debug": true}
set key = ""
set result = ""
for {
  set key = config.%GetNext(.key)
  quit:key=""
  set result = result _ key _ "=" _ config.%Get(key) _ ";"
}
write result

Which of the following best describes the output?
```

**A.** A \<METHOD DOES NOT EXIST\> error because %GetNext is not a method of %DynamicObject

**B.** host\=localhost;port\=8080;debug\=1; \-- each property key and value are enumerated

**C.** An error because the for loop has no bounds

**D.** host;port;debug; \-- %GetNext only returns keys, not values

### Answer and explanation

**Correct answer: A.** A \<METHOD DOES NOT EXIST\> error because %GetNext is not a method of %DynamicObject

%GetNext() is NOT a method of %DynamicObject. Calling config.%GetNext(.key) raises a \<METHOD DOES NOT EXIST\> error. To iterate over the properties of a %DynamicObject, you must first call %GetIterator() to obtain a %Iterator.Object, then use the iterator's %GetNext(.key, .value) method in a loop. For example: set iter \= config.%GetIterator() while iter.%GetNext(.key, .value) { ... }. This is a common mistake \-- %GetNext exists on %ResultSet and other classes, but not on %DynamicObject. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GJSON_create))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
A developer writes the following code to build a %DynamicArray.

set colors = []
do colors.%Push("red")
do colors.%Push("green")
do colors.%Push("blue")
set removed = colors.%Pop()
do colors.%Push("yellow")
write colors.%Size(), ": "
write colors.%ToJSON()

What is the output?
```

**A.** 4: \["red","green","blue","yellow"\]

**B.** 3: \["red","green","yellow"\]

**C.** 3: \["red","green","blue"\]

**D.** 4: \["red","green","yellow","blue"\]

### Answer and explanation

**Correct answer: B.** 3: \["red","green","yellow"\]

Starting with an empty array, %Push adds "red" (index 0), "green" (index 1), "blue" (index 2). Then %Pop() removes and returns the last element ("blue"), leaving \["red", "green"\]. Then %Push("yellow") adds "yellow" at the end, resulting in \["red", "green", "yellow"\]. %Size() returns 3 because there are 3 elements. The output is 3: \["red","green","yellow"\]. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GJSON_create))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
Consider the following code.

set obj = {"name": "Test", "values": [10, 20, 30]}
set arr = obj.values
do arr.%Set(1, 99)
write obj.%ToJSON()

What is the output?
```

**A.** {"name":"Test","values":\[10,20,30\]} \-- arr is a copy, not a reference

**B.** {"name":"Test","values":\[10,99,30\]} \-- arr references the same array object

**C.** {"name":"Test","values":\[99,20,30\]} \-- %Set(1, 99\) replaces the first element

**D.** An error because you cannot modify a nested array through a separate variable

### Answer and explanation

**Correct answer: B.** {"name":"Test","values":\[10,99,30\]} \-- arr references the same array object

When you access obj.values, you receive a reference to the same %DynamicArray object \-- not a copy. Modifying it through the arr variable (setting index 1 to 99\) directly modifies the array inside obj. %DynamicArray is zero-indexed, so %Set(1, 99\) replaces the element at index 1 (which was 20\) with 99\. The result is \[10, 99, 30\]. This is consistent with how object references work in ObjectScript. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GJSON_create))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

```text
A developer needs to check whether a JSON property exists and determine its type.

set data = {"name": "Alice", "score": 95, "address": null}
write data.%IsDefined("name"), " "
write data.%IsDefined("phone"), " "
write data.%GetTypeOf("address")

What is the output?
```

**A.** 1 0 null

**B.** 1 0 string

**C.** 1 1 null

**D.** 1 0 unassigned

### Answer and explanation

**Correct answer: A.** 1 0 null

%IsDefined() returns 1 if the property exists in the object and 0 if it does not. "name" exists (returns 1), "phone" does not exist (returns 0). %GetTypeOf() returns a string describing the JSON type of the value: "null" for JSON null, "string" for strings, "number" for numbers, "boolean" for booleans, "object" for nested objects, "array" for arrays, and "unassigned" for properties that do not exist. Since "address" is explicitly set to null, its type is "null". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GJSON_create))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

```text
Consider the following code that writes JSON to a stream.

set report = {"title": "Monthly Report", "items": [1, 2, 3]}
set stream = ##class(%Stream.GlobalCharacter).%New()
do report.%ToJSON(stream)
do stream.Rewind()
set json = ""
while 'stream.AtEnd {
  set json = json _ stream.Read()
}
write json

What is the output?
```

**A.** An error because %ToJSON() does not accept a stream argument

**B.** {"title":"Monthly Report","items":\[1,2,3\]}

**C.** An empty string because the stream was not saved

**D.** An error because %Stream.GlobalCharacter requires a persistent parent object

### Answer and explanation

**Correct answer: B.** {"title":"Monthly Report","items":\[1,2,3\]}

%ToJSON() can accept an optional stream argument. When a stream is passed, the JSON output is written directly to the stream instead of being returned as a string. This is more memory-efficient for large objects. After writing, Rewind() resets the read position to the beginning, and the while loop reads all the data. The stream does not need to be saved to a persistent object to be used in memory. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GJSON_create))

## Question 9 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

```text
A developer needs to store large medical images in the database. Consider the following class.

Class Medical.Scan Extends %Persistent
{
Property PatientId As %String;
Property ScanDate As %Date;
Property Image As %Stream.GlobalBinary;
}

The developer writes code to store an image.

set scan = ##class(Medical.Scan).%New()
set scan.PatientId = "P001"
set scan.ScanDate = +$H
set file = ##class(%Stream.FileBinary).%New()
set file.Filename = "/data/images/scan001.dcm"
set sc = scan.Image.CopyFromAndSave(file)
set sc = scan.%Save()

Which of the following is true about where the image data is stored?
```

**A.** In the DataLocation global alongside the PatientId and ScanDate values

**B.** In the StreamLocation global defined in the storage definition, separate from the main data global

**C.** In the file /data/images/scan001.dcm \-- the database stores only a file path reference

**D.** In a temporary global that is cleaned up when the process ends

### Answer and explanation

**Correct answer: B.** In the StreamLocation global defined in the storage definition, separate from the main data global

%Stream.GlobalBinary properties store their data in the global specified by the \<StreamLocation\> element in the storage definition (e.g., ^Medical.ScanS). The stream data is stored separately from the main data global to avoid bloating the data nodes with large binary content. The CopyFromAndSave method copies data from the source file stream into the global-based stream. The original file on disk is read but the data is stored in the database. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propstream))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
Consider the following code.

set stream = ##class(%Stream.GlobalCharacter).%New()
do stream.Write("Line 1 of the report. ")
do stream.Write("Line 2 of the report. ")
do stream.Write("Line 3 of the report.")
write stream.Size, !
write stream.Read(9)

What is the output?
```

**A.** ```text
65
Line 1 of
```

**B.** ```text
3
Line 1 of the report. Line 2 of the report. Line 3 of the report.
```

**C.** ```text
65
Line 1 of the report. Line 2 of the report. Line 3 of the report.
```

**D.** An error because Rewind() must be called before Read()

### Answer and explanation

**Correct answer: A.** ```text
65
Line 1 of
```

The stream's Size property returns the total number of characters in the stream. Three writes produce: "Line 1 of the report. " (22 chars) \+ "Line 2 of the report. " (22 chars) \+ "Line 3 of the report." (21 chars) \= 65 characters. For newly created streams (not yet saved and reopened), the read position is at the beginning, so Read(9) returns the first 9 characters: "Line 1 of". The argument to Read() specifies the maximum number of characters to return. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propstream))

## Question 11 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

```text
Consider the following code that processes a JSON array.

set data = [{"name": "Alice", "score": 85}, {"name": "Bob", "score": 92}, {"name": "Carol", "score": 78}]
set total = 0
set count = data.%Size()
for i = 0:1:count-1 {
  set total = total + data.%Get(i).score
}
write "Average: ", total / count

What is the output?
```

**A.** Average: 85

**B.** Average: 85 \-- integer division

**C.** Average: 85.000000000000000

**D.** An error because you cannot access .score on the result of %Get()

### Answer and explanation

**Correct answer: A.** Average: 85

The code iterates through the %DynamicArray using zero-based indexing (0 to count-1 where count\=3). For each element, it accesses the nested object's score property via chained access: data.%Get(i).score, which is valid because %Get returns the %DynamicObject. Total becomes 85 \+ 92 \+ 78 \= 255\. Then 255 / 3 \= 85 exactly. ObjectScript displays exact integer results without trailing decimals, so the output is "Average: 85". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GJSON_create))

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

```text
A developer needs to remove a property from a %DynamicObject before sending it as a JSON response.

set user = {"id": 1, "name": "Alice", "password": "secret123", "role": "admin"}
do user.%Remove("password")
write user.%ToJSON()

What is the output?
```

**A.** {"id":1,"name":"Alice","password":null,"role":"admin"}

**B.** {"id":1,"name":"Alice","role":"admin"}

**C.** An error because %Remove is not a valid method on %DynamicObject

**D.** {"id":1,"name":"Alice","password":"","role":"admin"}

### Answer and explanation

**Correct answer: B.** {"id":1,"name":"Alice","role":"admin"}

%Remove() completely removes the specified property from the %DynamicObject. After removal, the property no longer exists in the object \-- it is not set to null or empty string, it is entirely gone. The %ToJSON() output excludes the removed property, producing a clean JSON object with only the remaining properties. This is useful for sanitizing data before sending API responses. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GJSON_create))

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

```text
Consider the following code that copies a file into a database-stored stream.

Class Doc.Attachment Extends %Persistent
{
Property FileName As %String(MAXLEN = 200);
Property Content As %Stream.GlobalBinary;
}

// Code:
set att = ##class(Doc.Attachment).%New()
set att.FileName = "report.pdf"
set fileStream = ##class(%Stream.FileBinary).%New()
set fileStream.Filename = "/tmp/report.pdf"
set sc = att.Content.CopyFrom(fileStream)
set sc = att.%Save()

After this code runs successfully, where is the PDF content stored?
```

**A.** On the filesystem at /tmp/report.pdf only

**B.** In the database global specified by the StreamLocation in the storage definition

**C.** In a temporary global that is discarded when the process ends

**D.** In the DataLocation global alongside FileName

### Answer and explanation

**Correct answer: B.** In the database global specified by the StreamLocation in the storage definition

CopyFrom() reads data from the source stream (the %Stream.FileBinary pointing to /tmp/report.pdf) and writes it into the target stream (att.Content, which is a %Stream.GlobalBinary). When %Save() is called, the data is persisted to the database in the StreamLocation global. The original file on disk is unaffected but the database now has its own copy. Stream data is always stored separately from the main data global. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propstream))

## Question 14 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

```text
A developer creates a nested JSON structure.

set order = {}
set order.orderId = "ORD-001"
set order.items = []
set item1 = {"sku": "A100", "qty": 2, "price": 29.99}
set item2 = {"sku": "B200", "qty": 1, "price": 49.99}
do order.items.%Push(item1)
do order.items.%Push(item2)
set order.total = 109.97
write order.%ToJSON()

Which of the following represents the output?
```

**A.** {"orderId":"ORD-001","items":\[{"sku":"A100","qty":2,"price":29.99},{"sku":"B200","qty":1,"price":49.99}\],"total":109.97}

**B.** {"orderId":"ORD-001","items":\[\],"total":109.97} \-- %Push does not work on arrays accessed via dot syntax

**C.** An error because you cannot %Push a %DynamicObject into a %DynamicArray

**D.** {"orderId":"ORD-001","items":\["\[object\]","\[object\]"\],"total":109.97}

### Answer and explanation

**Correct answer: A.** {"orderId":"ORD-001","items":\[{"sku":"A100","qty":2,"price":29.99},{"sku":"B200","qty":1,"price":49.99}\],"total":109.97}

%DynamicArrays can hold any type of value including nested %DynamicObjects. When item1 and item2 are pushed into the items array, they maintain their full structure. %ToJSON() recursively serializes the entire object graph, producing the complete nested JSON. The dot syntax (order.items) returns a reference to the same array object, so %Push operations on it affect the array inside the order object. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GJSON_create))

## Question 15 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

```text
Consider the following code that uses %Stream.FileCharacter.

set stream = ##class(%Stream.FileCharacter).%New()
set stream.Filename = "/tmp/output.txt"
do stream.Write("Hello, World!")
do stream.WriteLine("")
do stream.Write("Second line.")
set sc = stream.%Save()

After this code runs, what does the file /tmp/output.txt contain?
```

**A.** Hello, World! followed by a newline, then Second line.

**B.** Only "Second line." because each Write overwrites the file

**C.** An error because %Stream.FileCharacter cannot be saved without a persistent parent object

**D.** The file is empty because Write only buffers data until the stream object is destroyed

### Answer and explanation

**Correct answer: A.** Hello, World! followed by a newline, then Second line.

%Stream.FileCharacter writes data to a file on the filesystem. Write() appends text and WriteLine() appends text plus a platform-appropriate line terminator. The content accumulates: "Hello, World!" \+ newline (from WriteLine) \+ "Second line.". When %Save() is called, the buffered data is flushed to the file. Unlike %Stream.GlobalCharacter, file-based streams can be saved independently without requiring a persistent parent object. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propstream))

[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T1.2: Properties, Indexes, and Class Members — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
A developer defines the following class.

Class App.Contact Extends %Persistent
{
Property FirstName As %String;
Property LastName As %String;
Property Bio As %String;
}

After deploying, users report that bios longer than 50 characters are being silently truncated. Which of the following explains the issue and provides the correct fix?
```

**A.** The %String type has no length limit; the issue is in the application code

**B.** The default MAXLEN for %String is 50\. The fix is: Property Bio As %String(MAXLEN \= 2000);

**C.** The default MAXLEN for %String is 128\. The fix is to use %LongString instead

**D.** Truncation only occurs in SQL, not when setting properties via ObjectScript

### Answer and explanation

**Correct answer: B.** The default MAXLEN for %String is 50\. The fix is: Property Bio As %String(MAXLEN \= 2000);

The default MAXLEN for %String properties in InterSystems IRIS is 50 characters. When data exceeds MAXLEN, it may be truncated during validation or storage. The fix is to explicitly set MAXLEN to a value that accommodates the expected data size. For very large text (megabytes), a stream type should be used instead. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_datatypes))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

```text
You are working on an application that needs to store text-based reports. Each report can take up to 5 megabytes of storage, and should be automatically compressed by IRIS if possible.

Which of the following property definitions is most appropriate?
```

**A.** Property Reports As %String;

**B.** Property Reports As %RawString;

**C.** Property Reports As %Stream.FileCharacter;

**D.** Property Reports As %Stream.FileBinary;

**E.** Property Reports As %Stream.GlobalCharacter;

### Answer and explanation

**Correct answer: E.** Property Reports As %Stream.GlobalCharacter;

%Stream.GlobalCharacter is the correct choice for large text data that should be stored in the database with automatic compression. It stores character data in globals, supports automatic compression, and handles multi-megabyte content. %Stream.FileCharacter stores data on the filesystem rather than in the database. %Stream.FileBinary is for binary files on the filesystem. %String and %RawString cannot handle 5 MB of data efficiently. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propstream))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
Consider the following class definition.

Class Store.Product Extends %Persistent
{
Property Name As %String(MAXLEN = 200) [ Required ];
Property Category As %String(VALUELIST = ",Electronics,Books,Clothing,Food");
Property Price As %Numeric(MINVAL = 0, MAXVAL = 99999.99);
Property Weight As %Numeric(SCALE = 2);
}

A developer runs:

set prod = ##class(Store.Product).%New()
set prod.Category = "Toys"
set prod.Price = 29.99
set sc = prod.%Save()

How many validation errors will %Save() encounter?
```

**A.** One error: Name is Required but was not set

**B.** Two errors: Name is Required, and Category "Toys" is not in the VALUELIST

**C.** Three errors: Name is Required, Category invalid, and Weight was not set

**D.** No errors: validation only runs if explicitly called

### Answer and explanation

**Correct answer: B.** Two errors: Name is Required, and Category "Toys" is not in the VALUELIST

%Save() triggers property validation. Name is marked Required but was not set, which is one error. Category is set to "Toys" which is not in the VALUELIST (",Electronics,Books,Clothing,Food"), which is a second error. Price \= 29.99 satisfies MINVAL \= 0 and MAXVAL \= 99999.99. Weight is not Required, so leaving it unset is valid. The validation returns a %Status containing both errors. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_datatypes))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
Consider the following class with a computed property.

Class App.Invoice Extends %Persistent
{
Property Subtotal As %Numeric;
Property TaxRate As %Numeric [ InitialExpression = 0.08 ];
Property TotalAmount As %Numeric [ SqlComputeCode = {Set {*} = {Subtotal} * (1 + {TaxRate})}, SqlComputed, SqlComputeOnChange = (Subtotal, TaxRate) ];
}

A developer runs:

set inv = ##class(App.Invoice).%New()
set inv.Subtotal = 100.00
set sc = inv.%Save()
write inv.TotalAmount

What value is written?
```

**A.** An empty string because TotalAmount is computed only in SQL queries

**B.** 108 because TotalAmount is computed when Subtotal or TaxRate changes and the object is saved

**C.** 100 because TaxRate is not explicitly set

**D.** An error because computed properties cannot be read via ObjectScript

### Answer and explanation

**Correct answer: B.** 108 because TotalAmount is computed when Subtotal or TaxRate changes and the object is saved

SqlComputeOnChange \= (Subtotal, TaxRate) means TotalAmount is recomputed and stored whenever Subtotal or TaxRate changes during %Save(). TaxRate has InitialExpression \= 0.08, so it defaults to 0.08. The computation is: 100.00 \* (1 \+ 0.08) \= 108\. The computed value is persisted to disk, making it accessible in both SQL and ObjectScript after save. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propmethods))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
Consider the following class.

Class App.Person Extends %Persistent
{
Property FirstName As %String(MAXLEN = 100);
Property LastName As %String(MAXLEN = 100);
Property FullName As %String [ Calculated ];
}

A developer writes:

set p = ##class(App.Person).%OpenId(1)
write p.FullName

The output is empty. What is the most likely reason?
```

**A.** The class is missing an Include directive

**B.** The Calculated keyword means the value is never stored; a custom Get accessor method (FullNameGet) must be defined for ObjectScript access

**C.** FullName needs to be included in the storage definition manually

**D.** %OpenId does not load computed properties

### Answer and explanation

**Correct answer: B.** The Calculated keyword means the value is never stored; a custom Get accessor method (FullNameGet) must be defined for ObjectScript access

The Calculated keyword means the property value is never stored on disk. When reading a Calculated property in ObjectScript, it invokes the Get accessor method (FullNameGet). If no FullNameGet() method is defined, the property returns empty string. The fix is to add: Method FullNameGet() As %String { return ..FirstName \_ " " \_ ..LastName }. Note: if SqlComputeCode is also defined alongside Calculated, IRIS auto-generates a Get method from it — but without SqlComputeCode, you must provide your own. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propmethods))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
Consider the following class with various index types.

Class Hospital.Patient Extends %Persistent
{
Property MRN As %String;
Property Name As %String;
Property Gender As %String;
Property Age As %Integer;
Property TotalCharges As %Numeric;

Index MRNIdx On MRN [ Unique ];
Index GenderIdx On Gender [ Type = bitmap ];
Index ChargesIdx On TotalCharges [ Type = bitslice ];
Index NameIdx On Name;
}

Which index would the SQL optimizer use to efficiently calculate SELECT SUM(TotalCharges) FROM Hospital.Patient?
```

**A.** MRNIdx \- because it is the unique index

**B.** GenderIdx \- because bitmap indexes are fastest for aggregation

**C.** ChargesIdx \- because bitslice indexes are specifically designed for SUM, COUNT, and AVG operations on numeric data

**D.** NameIdx \- because it is a standard index that can scan all rows

### Answer and explanation

**Correct answer: C.** ChargesIdx \- because bitslice indexes are specifically designed for SUM, COUNT, and AVG operations on numeric data

A bitslice index decomposes numeric values into their binary representation across bit slices. This allows the SQL optimizer to compute SUM directly from the index using bitwise operations, without scanning the data global at all. Bitslice indexes are specifically designed for aggregate calculations (SUM, COUNT, AVG) on numeric properties and are far more efficient than any other index type for these operations. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_tables))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

```text
Consider the following class.

Class App.Account Extends %Persistent
{
Property Email As %String(MAXLEN = 250);
Index EmailIdx On Email [ Unique ];
}

The following records exist:
  ID 1: Email = "alice@example.com"
  ID 2: Email = "bob@example.com"

A developer runs:

set sc = ##class(App.Account).EmailIdxOpen("alice@example.com", , .sc2)

What does EmailIdxOpen() return?
```

**A.** The integer ID value 1

**B.** An oref pointing to the App.Account object with Email \= "alice@example.com"

**C.** The string "alice@example.com"

**D.** A %Status value indicating whether the email exists

### Answer and explanation

**Correct answer: B.** An oref pointing to the App.Account object with Email \= "alice@example.com"

When a unique index is defined, the system generates helper methods including \<IndexName\>Open() which opens the object by the unique index value instead of the ID. EmailIdxOpen("alice@example.com") looks up the unique index, finds the corresponding ID (1), and returns the fully loaded oref. Other generated methods include EmailIdxExists() to check existence and EmailIdxDelete() to delete by the indexed value. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_defpersobj))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

```text
Consider the following class.

Class App.Order Extends %Persistent
{
Property OrderNumber As %String;
Property Status As %String(VALUELIST = ",Pending,Shipped,Delivered,Cancelled");
Property Region As %String(VALUELIST = ",North,South,East,West");

Index StatusIdx On Status [ Type = bitmap ];
Index RegionIdx On Region [ Type = bitmap ];
}

A query runs:

SELECT COUNT(*) FROM App."Order" WHERE Status = 'Shipped' AND Region = 'North'

How do bitmap indexes help with this query?
```

**A.** Each bitmap index is scanned independently and results are merged in memory

**B.** The SQL engine performs a bitwise AND on the bitmap for Status\='Shipped' and the bitmap for Region\='North', directly producing the matching row set without touching the data global

**C.** Bitmap indexes are converted to standard indexes at runtime for AND operations

**D.** Bitmap indexes do not help with AND conditions; only OR conditions benefit

### Answer and explanation

**Correct answer: B.** The SQL engine performs a bitwise AND on the bitmap for Status\='Shipped' and the bitmap for Region\='North', directly producing the matching row set without touching the data global

Bitmap indexes excel at combining multiple conditions using bitwise operations. Each distinct value in a bitmap index has a bit string where each bit represents a row ID. For Status\='Shipped', there is one bit string; for Region\='North', another. The SQL engine performs a bitwise AND operation on these two bit strings, and the resulting bits indicate exactly which rows match both conditions \-- all without reading the data global. This is extremely fast for low-cardinality columns. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_tables))

## Question 9 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

```text
Consider the following class definitions.

Class App.Department Extends %Persistent
{
Property Name As %String;
Property Code As %String;
Index CodeIdx On Code [ Unique ];
}

Class App.Employee Extends %Persistent
{
Property Name As %String;
Property DeptCode As %String;
ForeignKey DeptFK(DeptCode) References App.Department(CodeIdx);
}

What happens if a developer tries to save an Employee with DeptCode = "HR" but no Department exists with Code = "HR"?
```

**A.** The save succeeds because foreign keys are only enforced in SQL, not ObjectScript

**B.** The save fails with a foreign key violation error returned in the %Status

**C.** The save succeeds but a warning is logged to the audit log

**D.** A new Department record with Code \= "HR" is automatically created

### Answer and explanation

**Correct answer: B.** The save fails with a foreign key violation error returned in the %Status

Foreign key constraints in InterSystems IRIS are enforced during %Save() regardless of whether the save is triggered via ObjectScript or SQL. If the referenced record does not exist, the foreign key check fails and %Save() returns an error %Status with a foreign key violation message. No automatic record creation occurs. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_relationships))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
Consider the following class.

Class App.Config Extends %Persistent
{
Parameter DEFAULTMAXLEN = 200;
Parameter APPVERSION = "3.2.1";

Property Setting As %String;
Property Value As %String;
}

A developer writes:

write ##class(App.Config).#APPVERSION

What is the output?
```

**A.** An error because parameters cannot be accessed outside the class

**B.** 3.2.1

**C.** "3.2.1" (including the quotes)

**D.** An error because class parameters can only be accessed with ..#ParamName syntax

### Answer and explanation

**Correct answer: B.** 3.2.1

Class parameters can be accessed from outside the class using the ##class(ClassName).#ParameterName syntax. From inside the class, both ..#ParameterName and ##class(ClassName).#ParameterName work. Parameters are compile-time constants that are accessible from both instance methods and class methods. The output is the string 3.2.1 without quotes. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_parameters))

## Question 11 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

```text
Consider the following class.

Class App.Sensor Extends %Persistent
{
Property SensorId As %String;
Property Temperature As %Numeric;
Property Humidity As %Numeric;
Property ReadingTime As %TimeStamp;

Index SensorTimeIdx On (SensorId, ReadingTime);
}

Which of the following queries would best benefit from the compound index SensorTimeIdx?
```

**A.** SELECT \* FROM App.Sensor WHERE Temperature \> 30

**B.** SELECT \* FROM App.Sensor WHERE ReadingTime \> '2026-01-01'

**C.** SELECT \* FROM App.Sensor WHERE SensorId \= 'S100' AND ReadingTime \> '2026-01-01'

**D.** SELECT \* FROM App.Sensor WHERE Humidity \< 50

### Answer and explanation

**Correct answer: C.** SELECT \* FROM App.Sensor WHERE SensorId \= 'S100' AND ReadingTime \> '2026-01-01'

A compound index on (SensorId, ReadingTime) is organized first by SensorId, then by ReadingTime within each SensorId. This makes it optimal for queries that filter on SensorId (the leading key) and then range-scan on ReadingTime. The query in option C filters on both fields in the correct order. A query on only ReadingTime (option B) cannot efficiently use this index because ReadingTime is not the leading key. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_tables))

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

```text
A developer defines the following property with a triggered computed value.

Class App.AuditRecord Extends %Persistent
{
Property Data As %String(MAXLEN = 1000);
Property DataLength As %Integer [ SqlComputeCode = {Set {*} = $Length({Data})}, SqlComputed, SqlComputeOnChange = Data ];
}

The developer saves a record:

set rec = ##class(App.AuditRecord).%New()
set rec.Data = "Hello World"
set sc = rec.%Save()

Then later, another process runs:

&sql(UPDATE App.AuditRecord SET Data = 'Updated content' WHERE ID = 1)

After the SQL UPDATE, what is the value of DataLength for this record?
```

**A.** 11 (the length of "Hello World", unchanged)

**B.** 15 (the length of "Updated content", recomputed by the trigger)

**C.** 0 because SQL updates do not trigger SqlComputeOnChange

**D.** NULL because the UPDATE did not explicitly set DataLength

### Answer and explanation

**Correct answer: B.** 15 (the length of "Updated content", recomputed by the trigger)

SqlComputeOnChange \= Data means the DataLength value is automatically recomputed whenever the Data property changes, whether the change occurs via ObjectScript %Save() or SQL UPDATE. When the SQL UPDATE sets Data to 'Updated content' (15 characters), the compute code runs and sets DataLength to $Length("Updated content") \= 15\. This is the "triggered" behavior of SqlComputeOnChange. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propmethods))

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

```text
Consider the following class.

Class App.User Extends %Persistent
{
Property Username As %String(MAXLEN = 50) [ Required ];
Property Email As %String(MAXLEN = 250) [ Required ];
Property Role As %String(VALUELIST = ",Admin,Editor,Viewer") [ InitialExpression = "Viewer" ];
Property LoginCount As %Integer [ InitialExpression = 0 ];
}

A developer creates a new user:

set user = ##class(App.User).%New()
set user.Username = "jdoe"
set user.Email = "jdoe@example.com"
set sc = user.%Save()

After saving, what are the values of Role and LoginCount?
```

**A.** Role \= "" and LoginCount \= "" because they were not explicitly set

**B.** Role \= "Viewer" and LoginCount \= 0 because InitialExpression provides defaults at %New() time

**C.** Role \= "Viewer" and LoginCount \= "" because InitialExpression only works for strings

**D.** A validation error occurs because Role and LoginCount are not explicitly set

### Answer and explanation

**Correct answer: B.** Role \= "Viewer" and LoginCount \= 0 because InitialExpression provides defaults at %New() time

InitialExpression defines default values that are assigned to properties when %New() creates the object instance. Role defaults to "Viewer" and LoginCount defaults to 0\. These values are set automatically during object creation and are saved along with the explicitly set properties. Since the properties are not marked Required (only Username and Email are), not setting them explicitly is fine. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_datatypes))

## Question 14 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

```text
Consider the following class with a stream property.

Class Doc.Report Extends %Persistent
{
Property Title As %String(MAXLEN = 200);
Property Content As %Stream.GlobalCharacter;
}

A developer writes the following code to store a report.

set rpt = ##class(Doc.Report).%New()
set rpt.Title = "Annual Review"
do rpt.Content.Write("Section 1: Introduction")
do rpt.Content.WriteLine("")
do rpt.Content.Write("Section 2: Results")
set sc = rpt.%Save()

// Later, reading it back:
set rpt2 = ##class(Doc.Report).%OpenId(rpt.%Id())
set text = ""
while 'rpt2.Content.AtEnd {
  set text = text _ rpt2.Content.Read()
}
write text

What does the Write command output?
```

**A.** Only "Section 2: Results" because each Write overwrites the previous content

**B.** "Section 1: Introduction" followed by a newline, then "Section 2: Results" \-- all content is concatenated in the stream

**C.** An empty string because Rewind() was not called before reading

**D.** An error because you cannot use Read() and Write() on the same stream

### Answer and explanation

**Correct answer: B.** "Section 1: Introduction" followed by a newline, then "Section 2: Results" \-- all content is concatenated in the stream

Stream Write() appends data to the stream \-- it does not overwrite. WriteLine() appends data plus a line terminator. When the object is saved and later reopened with %OpenId(), the stream's read position is at the beginning (Rewind is not needed after opening). The Read() method reads chunks of data in a loop until AtEnd is true. The result is all three writes concatenated. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propstream))

## Question 15 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

```text
Consider the following class.

Class App.Article Extends %Persistent
{
Property Title As %String(MAXLEN = 300);
Property Author As %String(MAXLEN = 100);
Property Status As %String(VALUELIST = ",Draft,Published,Archived");
Property ViewCount As %Integer;

Index TitleIdx On Title [ Unique ];
Index StatusIdx On Status [ Type = bitmap ];
Index ViewIdx On ViewCount [ Type = bitslice ];
}

Which of the following statements are true about the indexes defined in this class? (Select all that apply)
```

**A.** TitleIdx generates helper methods TitleIdxOpen(), TitleIdxExists(), and TitleIdxDelete()

**B.** StatusIdx is appropriate because Status has low cardinality (only 3 possible values)

**C.** ViewIdx allows the SQL optimizer to compute SUM(ViewCount) directly from the index without scanning data

**D.** StatusIdx and ViewIdx can be combined with bitwise AND operations in a single query

**E.** TitleIdx is a bitmap index because it has the Unique keyword

### Answer and explanation

**Correct answer: A.** TitleIdx generates helper methods TitleIdxOpen(), TitleIdxExists(), and TitleIdxDelete()

**Correct answer: B.** StatusIdx is appropriate because Status has low cardinality (only 3 possible values)

**Correct answer: C.** ViewIdx allows the SQL optimizer to compute SUM(ViewCount) directly from the index without scanning data

**Correct answer: D.** StatusIdx and ViewIdx can be combined with bitwise AND operations in a single query

TitleIdx as a unique index generates Open/Exists/Delete helper methods. StatusIdx is bitmap which is ideal for low-cardinality fields like Status. ViewIdx as bitslice enables efficient aggregate computation of SUM/COUNT/AVG. Bitmap and bitslice indexes can be combined with bitwise operations. TitleIdx is a standard unique index, not a bitmap \-- the Unique keyword does not make it bitmap. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_tables))

## Question 16 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q16.md>)

```text
Consider the following class that uses a property parameter constraint.

Class App.Employee Extends %Persistent
{
Property Name As %String(MAXLEN = 100);
Property Salary As %Numeric(MINVAL = 30000, MAXVAL = 500000, SCALE = 2);
Property Department As %String(MAXLEN = 50);
}

A developer runs:

set emp = ##class(App.Employee).%New()
set emp.Name = "Jane Doe"
set emp.Salary = 25000
set emp.Department = "Engineering"
set sc = emp.%Save()
write $$$ISOK(sc)

What is the output?
```

**A.** 1 \-- the save succeeds because MINVAL is only a hint to the SQL optimizer

**B.** 0 \-- the save fails because Salary \= 25000 violates the MINVAL \= 30000 constraint

**C.** 1 \-- the save succeeds because MINVAL is only enforced in SQL INSERT statements

**D.** An exception is thrown rather than returning a %Status error

### Answer and explanation

**Correct answer: B.** 0 \-- the save fails because Salary \= 25000 violates the MINVAL \= 30000 constraint

MINVAL and MAXVAL are validation constraints that are enforced during %Save(). When Salary is set to 25000, which is below the MINVAL of 30000, the validation check fails and %Save() returns an error %Status. $$$ISOK(sc) returns 0 (false) because the status indicates failure. These constraints are enforced in both ObjectScript and SQL contexts. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_datatypes))

## Question 17 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q17.md>)

```text
Consider the following class.

Class App.Task Extends %Persistent
{
Property Title As %String(MAXLEN = 200);
Property AssignedTo As %String(MAXLEN = 100);
Property Priority As %Integer;
Property CreatedAt As %TimeStamp [ InitialExpression = {$ZDT($H, 3)} ];
}

What is special about the InitialExpression for CreatedAt?
```

**A.** It is invalid syntax because InitialExpression cannot contain function calls

**B.** The curly braces indicate the expression is evaluated at compile time, so all objects will have the same timestamp

**C.** The curly braces indicate the expression is evaluated at runtime when %New() is called, so each new object gets the current timestamp

**D.** The expression is evaluated once when the class is loaded into memory

### Answer and explanation

**Correct answer: C.** The curly braces indicate the expression is evaluated at runtime when %New() is called, so each new object gets the current timestamp

When an InitialExpression is enclosed in curly braces { }, it is treated as an ObjectScript expression that is evaluated at runtime each time %New() is called. Without curly braces, the value would be a static literal. So {$ZDT($H, 3)} evaluates $ZDT($H, 3\) at object creation time, giving each new Task its own unique timestamp reflecting when it was created. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_datatypes))

## Question 18 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q18.md>)

```text
Consider the following class.

Class App.Metric Extends %Persistent
{
Property Name As %String(MAXLEN = "");
Property Value As %Numeric;
}

What does MAXLEN = "" mean for the Name property?
```

**A.** It sets MAXLEN to zero, meaning the property cannot hold any data

**B.** It removes the length limit entirely, allowing the property to hold a string of any length up to the maximum string size

**C.** It is invalid syntax and causes a compile error

**D.** It sets MAXLEN to the default value of 50

### Answer and explanation

**Correct answer: B.** It removes the length limit entirely, allowing the property to hold a string of any length up to the maximum string size

Setting MAXLEN to an empty string (MAXLEN \= "") removes the length validation constraint entirely, allowing the property to hold any string up to the maximum string size supported by the system (approximately 3.6 million characters). This is useful when you need strings larger than the default 50 characters but do not want to pick an arbitrary limit. However, for very large text content, streams are still recommended. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_datatypes))

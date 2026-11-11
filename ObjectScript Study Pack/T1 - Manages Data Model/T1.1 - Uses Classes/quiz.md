[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T1.1: Uses Classes — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
Consider the following class and storage definitions.

Class Sample.Patient Extends %Persistent
{
Parameter USEEXTENTSET = 1;
Property Name As %String;
Property AgeGroup As %String;
Index NameIdx On Name [ Unique ];
Index AgeGroupIdx On AgeGroup [ Type = bitmap ];
Index BME [ Extent, Type = bitmap ];
Storage Default
{
<Data name="PatientDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>Name</Value>
</Value>
<Value name="3">
<Value>AgeGroup</Value>
</Value>
</Data>
<DataLocation>^EW3K.DuIo.1</DataLocation>
<DefaultData>PatientDefaultData</DefaultData>
<ExtentLocation>^EW3K.DuIo</ExtentLocation>
<IdLocation>^EW3K.DuIo.1</IdLocation>
<Index name="AgeGroupIdx">
<Location>^EW3K.DuIo.2</Location>
</Index>
<Index name="BME">
<Location>^EW3K.DuIo.3</Location>
</Index>
<Index name="IDKEY">
<Location>^EW3K.DuIo.1</Location>
</Index>
<Index name="NameIdx">
<Location>^EW3K.DuIo.4</Location>
</Index>
<IndexLocation>^EW3K.DuIo.I</IndexLocation>
<StreamLocation>^EW3K.DuIo.S</StreamLocation>
<Type>%Storage.Persistent</Type>
}
}

Which of the following globals stores data for the bitmap extent index?
```

**A.** ^Sample.PatientI

**B.** ^Sample.PatientD

**C.** ^EW3K.DuIo.1

**D.** ^EW3K.DuIo.2

**E.** ^EW3K.DuIo.3

**F.** ^EW3K.DuIo.4

### Answer and explanation

**Correct answer: E.** ^EW3K.DuIo.3

The bitmap extent index is named BME in the class definition. Looking at the storage definition, the Index named "BME" has its \<Location\> set to ^EW3K.DuIo.3. Because USEEXTENTSET \= 1, each index gets its own hashed global rather than sharing the generic ^IndexLocation global. The bitmap extent index tracks which IDs exist and is used to optimize COUNT(\*) and bitmap index operations. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_tables))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

```text
Consider the following class definition.

Class Sample.EmailMessage Extends %Persistent
{
Property MessageId As %String;
Property MessageDate As %Date;
Property Sender As %String;
Property EmailType As %String;
Index MIIdx On MessageId [ Unique ];
Index ETIdx On EmailType [ Type = bitmap ];
}

One of the stored MessageId values is "JTE810".

Which of the following code deletes the record associated with "JTE810"?
```

**A.** set sc \= ##class(Sample.EmailMessage).%DeleteId("JTE810")

**B.** do ##class(Sample.EmailMessage).%Delete("JTE810")

**C.** do ##class(Sample.EmailMessage).DeleteData("JTE810")

**D.** set sc \= ##class(Sample.EmailMessage).MIIdxDelete("JTE810")

### Answer and explanation

**Correct answer: D.** set sc \= ##class(Sample.EmailMessage).MIIdxDelete("JTE810")

Since "JTE810" is a value of the MessageId property (not the object ID), you cannot use %DeleteId() or %Delete() which expect the object's internal row ID. The unique index MIIdx on MessageId generates a class method named MIIdxDelete() that deletes the record by looking up the unique index value and then deleting the corresponding object. This is a key feature of unique indexes in InterSystems IRIS. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_persobj))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
A developer writes the following code to create and save a new patient record.

set patient = ##class(Clinic.Patient).%New()
set patient.Name = "Sarah Connor"
set patient.DOB = $ZDATEH("1965-02-28", 3)
set sc = patient.%Save()
if $$$ISERR(sc) {
  do $SYSTEM.Status.DisplayError(sc)
  quit
}
write "Saved with ID: ", patient.%Id()

Which of the following best describes what happens when %Save() succeeds?
```

**A.** The object data is written to a temporary in-memory cache and flushed to disk on process exit

**B.** The object properties are serialized into the data global, an ID is assigned if new, indexes are updated, and %Save() returns $$$OK

**C.** The object is converted to JSON and stored in a stream global

**D.** The object is saved but the ID is not assigned until the transaction commits

### Answer and explanation

**Correct answer: B.** The object properties are serialized into the data global, an ID is assigned if new, indexes are updated, and %Save() returns $$$OK

When %Save() succeeds on a new persistent object, the system serializes the property values into the data global (e.g., ^Clinic.PatientD), assigns a new integer ID using $Increment on the IdLocation global, updates all defined indexes, and returns $$$OK. The ID is immediately available via %Id() after the save. Data goes directly to the database global, not a temporary cache. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_persobj))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
Consider the following two class definitions.

Class App.Vehicle Extends %RegisteredObject
{
Property Make As %String;
Property Model As %String;
Method Describe() As %String
{
  return ..Make _ " " _ ..Model
}
}

Class App.Truck Extends %Persistent
{
Property TowCapacity As %Integer;
}

A developer creates a new class:

Class App.PickupTruck Extends (App.Truck, App.Vehicle)
{
}

Which of the following is true about App.PickupTruck?
```

**A.** The class will not compile because you cannot combine %Persistent and %RegisteredObject superclasses

**B.** The class inherits persistence from App.Truck (leftmost), so instances can be saved to disk, and it also inherits the Make, Model properties and Describe() method from App.Vehicle

**C.** The class will compile but %Save() will only persist the TowCapacity property, ignoring inherited %RegisteredObject properties

**D.** The class inherits from App.Vehicle first because it is alphabetically first

### Answer and explanation

**Correct answer: B.** The class inherits persistence from App.Truck (leftmost), so instances can be saved to disk, and it also inherits the Make, Model properties and Describe() method from App.Vehicle

InterSystems IRIS supports multiple inheritance. The order in the Extends clause matters: App.Truck is leftmost so its %Persistent behavior takes precedence. Since %Persistent already extends %RegisteredObject, there is no conflict. App.PickupTruck inherits all properties (TowCapacity from Truck, Make and Model from Vehicle) and the Describe() method, and all properties are persisted to disk when %Save() is called. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes_inheritance))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
Consider the following storage definition for a class that does NOT use USEEXTENTSET.

Class HR.Employee Extends %Persistent
{
Property Name As %String;
Property Department As %String;
Index DeptIdx On Department [ Type = bitmap ];

Storage Default
{
<DataLocation>^HR.EmployeeD</DataLocation>
<IdLocation>^HR.EmployeeD</IdLocation>
<IndexLocation>^HR.EmployeeI</IndexLocation>
<StreamLocation>^HR.EmployeeS</StreamLocation>
}
}

The developer runs the following command:

zwrite ^HR.EmployeeD

The output shows:

^HR.EmployeeD=5
^HR.EmployeeD(1)=$lb("","Alice","Sales")
^HR.EmployeeD(2)=$lb("","Bob","Engineering")

What does the value 5 at the top node ^HR.EmployeeD represent?
```

**A.** The total count of records currently in the table

**B.** The next available ID counter (the next new record will get ID 6\)

**C.** The number of properties defined in the class

**D.** The maximum number of records the global can hold

### Answer and explanation

**Correct answer: B.** The next available ID counter (the next new record will get ID 6\)

In standard persistent storage, the top node of the DataLocation global (which is also the IdLocation) stores the ID counter. The value 5 means the last assigned ID was 5, and the next $Increment will return 6\. Note that the counter value may be higher than the actual number of records if some records were deleted \-- here only IDs 1 and 2 exist but the counter is 5, indicating IDs 3, 4, and 5 were previously assigned and then deleted. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_storage))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
A developer writes the following code:

set emp = ##class(HR.Employee).%OpenId(42)
if emp = "" {
  write "Employee not found",!
  quit
}
set emp.Salary = 75000
set sc = emp.%Save()

Which of the following is true about %OpenId()?
```

**A.** %OpenId() returns a %Status value indicating success or failure

**B.** %OpenId() returns an object reference (oref) on success, or an empty string if the ID does not exist

**C.** %OpenId() throws a \<THROW\> exception if the ID does not exist

**D.** %OpenId() always returns an oref, even for non-existent IDs, with properties set to empty strings

### Answer and explanation

**Correct answer: B.** %OpenId() returns an object reference (oref) on success, or an empty string if the ID does not exist

%OpenId() is a class method that loads a persistent object from disk by its integer ID. It returns an oref (object reference) if the ID exists, or an empty string ("") if not found. It does not throw exceptions or return %Status by default. The developer must check for an empty return before accessing properties to avoid \<INVALID OREF\> errors. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_persobj))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

```text
Consider the following class.

Class Lab.Experiment Extends %Persistent
{
Property Title As %String;
Property Researcher As %String;
}

A developer wants to delete all experiment records. Which of the following approaches deletes all records AND properly fires any %OnDelete callbacks?
```

**A.** do ##class(Lab.Experiment).%KillExtent()

**B.** set sc \= ##class(Lab.Experiment).%DeleteExtent()

**C.** do $SYSTEM.OBJ.DeleteExtent("Lab.Experiment")

**D.** \&sql(DROP TABLE Lab.Experiment)

### Answer and explanation

**Correct answer: B.** set sc \= ##class(Lab.Experiment).%DeleteExtent()

%DeleteExtent() iterates through all instances and deletes each one individually, which ensures that %OnDelete callbacks are fired for every record. %KillExtent() is faster but simply kills the globals directly without firing callbacks. DROP TABLE removes the table definition entirely, not just the data. %DeleteExtent() returns a %Status value indicating overall success or failure. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_persobj))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

```text
Consider the following class definitions.

/// Base class for all identifiable entities
Class Core.Identifiable Extends %RegisteredObject
{
/// The unique external identifier
Property ExternalId As %String;
}

/// Represents an auditable record with timestamps
Class Core.Auditable Extends %RegisteredObject
{
Property CreatedDate As %TimeStamp;
Property ModifiedDate As %TimeStamp;
}

/// Customer record combining persistence, identity, and audit
Class App.Customer Extends (%Persistent, Core.Identifiable, Core.Auditable)
{
Property Name As %String;
}

Which of the following statements about the /// comments is accurate?
```

**A.** The /// comments are regular comments that are ignored by the compiler

**B.** The /// comments become class and property documentation that is stored in the class dictionary and visible in the Class Reference

**C.** The /// comments are only visible in the IDE and not stored anywhere

**D.** The /// comments generate XML documentation files on disk

### Answer and explanation

**Correct answer: B.** The /// comments become class and property documentation that is stored in the class dictionary and visible in the Class Reference

Triple-slash (///) comments placed immediately before a class keyword, property, method, or other class member become that member's description. This documentation is stored in the class definition in the %Dictionary package and is accessible via the Class Reference in the Management Portal, Studio, or VS Code. It serves the same purpose as Javadoc or docstrings in other languages. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classdoc))

## Question 9 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

```text
A developer writes the following code to create a Patient object.

Class Clinic.Patient Extends %Persistent
{
Property Name As %String [ Required ];
Property MRN As %String;

Method %OnNew(name As %String) As %Status
{
  set ..Name = name
  set ..MRN = "MRN-" _ $Increment(^Clinic.MRNCounter)
  return $$$OK
}
}

// Caller code:
set pt = ##class(Clinic.Patient).%New("John Smith")
write pt.Name, " - ", pt.MRN

What happens when %New("John Smith") is called?
```

**A.** A compile error occurs because %OnNew cannot accept arguments

**B.** %New() creates the object, then calls %OnNew("John Smith") which sets Name to "John Smith" and generates a unique MRN. The oref is returned to the caller.

**C.** %New() ignores the argument because %Persistent objects do not support constructor arguments

**D.** %OnNew() is called before %New(), so the object does not exist yet and setting ..Name causes an error

### Answer and explanation

**Correct answer: B.** %New() creates the object, then calls %OnNew("John Smith") which sets Name to "John Smith" and generates a unique MRN. The oref is returned to the caller.

%OnNew() is a callback method automatically invoked by %New(). Arguments passed to %New() are forwarded to %OnNew(). The system first creates the object in memory, then calls %OnNew() where the developer can set initial property values. If %OnNew() returns an error status, %New() returns empty string. The Name and MRN properties are set during construction. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_objapi))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
Consider the following storage definition with USEEXTENTSET enabled.

Class Inventory.Product Extends %Persistent
{
Parameter USEEXTENTSET = 1;
Property SKU As %String;
Property Description As %String;
Property Price As %Numeric;
Index SKUIdx On SKU [ Unique ];
Index PriceIdx On Price [ Type = bitmap ];

Storage Default
{
<DataLocation>^A1B2.C3D4.1</DataLocation>
<IdLocation>^A1B2.C3D4.1</IdLocation>
<Index name="PriceIdx">
<Location>^A1B2.C3D4.2</Location>
</Index>
<Index name="SKUIdx">
<Location>^A1B2.C3D4.3</Location>
</Index>
<IndexLocation>^A1B2.C3D4.I</IndexLocation>
<StreamLocation>^A1B2.C3D4.S</StreamLocation>
}
}

Which global contains the unique index on SKU?
```

**A.** ^A1B2.C3D4.1

**B.** ^A1B2.C3D4.2

**C.** ^A1B2.C3D4.3

**D.** ^A1B2.C3D4.I

**E.** ^Inventory.ProductI

### Answer and explanation

**Correct answer: C.** ^A1B2.C3D4.3

With USEEXTENTSET \= 1, each index is assigned its own hashed global name. The storage definition explicitly maps the SKUIdx index to ^A1B2.C3D4.3. The \<IndexLocation\> global (^A1B2.C3D4.I) is the fallback location for indexes that do not have explicit \<Location\> entries, but since SKUIdx has its own mapping, ^A1B2.C3D4.3 is the correct answer. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_storage))

## Question 11 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

```text
A developer is troubleshooting a data issue and wants to find the physical database where the data for class Sales.Order is stored. The storage definition shows:

<DataLocation>^Sales.OrderD</DataLocation>

Which of the following is true about determining the physical location?
```

**A.** The data is always in the namespace's default global database, which is the same as the database's physical file location

**B.** The data global needs to be identified from the storage definition and its identity used in a call to ##class(%SYS.Namespace).GetGlobalDest() to find the target database

**C.** Querying the Description column in INFORMATION\_SCHEMA.TABLES with the class name returns the physical file path

**D.** The physical location is always the same as the IRIS installation directory plus the namespace name

### Answer and explanation

**Correct answer: B.** The data global needs to be identified from the storage definition and its identity used in a call to ##class(%SYS.Namespace).GetGlobalDest() to find the target database

To determine the physical storage location, first identify the data global from the class storage definition (^Sales.OrderD), then use ##class(%SYS.Namespace).GetGlobalDest() to resolve which database that global is mapped to. Global mappings can redirect globals to different databases or even remote systems, so you cannot assume the default database. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_csysnamespace))

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

```text
Consider the following class.

Class App.Counter Extends %RegisteredObject
{
Property Count As %Integer [ InitialExpression = 0 ];

Method Increment() As %Integer
{
  set ..Count = ..Count + 1
  return ..Count
}
}

A developer runs:

set c = ##class(App.Counter).%New()
write c.Increment(), " "
write c.Increment(), " "
set sc = c.%Save()

What happens when c.%Save() is called?
```

**A.** The counter value of 2 is saved to the database

**B.** A runtime error occurs because %RegisteredObject does not have a %Save() method

**C.** The save succeeds but stores nothing because %RegisteredObject data is transient

**D.** A compile error prevents the class from compiling

### Answer and explanation

**Correct answer: B.** A runtime error occurs because %RegisteredObject does not have a %Save() method

%RegisteredObject does not define a %Save() method. Only %Persistent classes (and %SerialObject for embedded serialization) provide %Save(). Attempting to call %Save() on a %RegisteredObject instance results in a \<METHOD DOES NOT EXIST\> error at runtime. The object exists only in process memory and cannot be persisted. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_objapi))

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

```text
Consider the following class hierarchy.

Class App.Shape Extends %Persistent
{
Property Color As %String;
}

Class App.Rectangle Extends App.Shape
{
Property Width As %Numeric;
Property Height As %Numeric;
}

With default storage (no USEEXTENTSET), where are the Width and Height properties stored for an App.Rectangle instance?
```

**A.** All in ^App.ShapeD, with Color in the main node and Width/Height in a "Rectangle" subnode

**B.** Width and Height in ^App.RectangleD, while Color is in ^App.ShapeD

**C.** All properties in ^App.RectangleD only

**D.** All properties in a combined global ^App.Shape.RectangleD

### Answer and explanation

**Correct answer: A.** All in ^App.ShapeD, with Color in the main node and Width/Height in a "Rectangle" subnode

With default storage (no USEEXTENTSET), a subclass does NOT get its own separate data global. Instead, all data is stored within the parent's data global (^App.ShapeD). The parent's properties (%%CLASSNAME and Color) go in the main node: ^App.ShapeD(1)\=$lb("\~App.Rectangle\~","blue"). The subclass's own properties (Width, Height) go in a subscript subnode named after the subclass: ^App.ShapeD(1,"Rectangle")\=$lb(10,5). There is no ^App.RectangleD global at all. The subclass storage definition uses a \<Subscript\> element to define this subnode structure. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_storage))

## Question 14 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

```text
A developer examines the following code that another team member wrote.

set order = ##class(Store.Order).%OpenId(100, , .sc)
if $$$ISERR(sc) {
  write "Error opening order: "
  do $SYSTEM.Status.DisplayError(sc)
  quit
}
if order = "" {
  write "Order 100 not found"
  quit
}

What is the purpose of the third argument (.sc) passed to %OpenId()?
```

**A.** It passes a %Status variable by reference that receives detailed error information if the open fails for reasons other than "not found"

**B.** It provides a default value to return if the object is not found

**C.** It specifies the concurrency lock level for the opened object

**D.** It is the timeout in seconds for the open operation

### Answer and explanation

**Correct answer: A.** It passes a %Status variable by reference that receives detailed error information if the open fails for reasons other than "not found"

The third argument to %OpenId() is an Output parameter that receives a %Status value. When %OpenId() returns "" (empty string), it could be because the ID simply does not exist (sc \= $$$OK) or because an error occurred during loading (sc \= error status). By checking sc, the developer can distinguish between "not found" and actual errors. The second argument (skipped with an extra comma) is the concurrency level. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_persobj))

## Question 15 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

```text
Consider the following two classes.

Class App.Logger Extends %RegisteredObject
{
Method Log(msg As %String)
{
  write $ZDT($H, 3), ": ", msg, !
}
}

Class App.AuditLogger Extends (%Persistent, App.Logger)
{
Property LogEntry As %String(MAXLEN = 500);

Method Log(msg As %String)
{
  set ..LogEntry = $ZDT($H, 3) _ ": " _ msg
  do ..%Save()
}
}

A developer writes:

set logger = ##class(App.AuditLogger).%New()
do logger.Log("System started")

What happens when Log() is called?
```

**A.** The Log() method from App.Logger executes, writing to the current device

**B.** The Log() method from App.AuditLogger executes, saving the message to the database

**C.** Both Log() methods execute in sequence

**D.** A runtime error occurs because of conflicting method definitions

### Answer and explanation

**Correct answer: B.** The Log() method from App.AuditLogger executes, saving the message to the database

When a subclass defines a method with the same name as a parent class method, the subclass method overrides the parent. Since the object is an instance of App.AuditLogger, its own Log() method is called, which sets the LogEntry property and saves the object to the database. If the developer wanted to also call the parent's Log(), they would use ##super(msg) inside the overriding method. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods_override))

## Question 16 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q16.md>)

```text
Consider the following storage definition.

Storage Default
{
<DataLocation>^App.CustomerD</DataLocation>
<DefaultData>CustomerDefaultData</DefaultData>
<IdLocation>^App.CustomerD</IdLocation>
<IndexLocation>^App.CustomerI</IndexLocation>
<StreamLocation>^App.CustomerS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

Which of the following are correctly described elements of this storage definition? (Select all that apply)
```

**A.** \<DataLocation\> specifies the global where object property values are stored

**B.** \<IndexLocation\> specifies the global where all index data is stored by default

**C.** \<StreamLocation\> specifies where stream property data is stored

**D.** \<IdLocation\> specifies the global node used for the ID counter ($Increment)

**E.** \<DefaultData\> specifies the default database for data storage

### Answer and explanation

**Correct answer: A.** \<DataLocation\> specifies the global where object property values are stored

**Correct answer: B.** \<IndexLocation\> specifies the global where all index data is stored by default

**Correct answer: C.** \<StreamLocation\> specifies where stream property data is stored

**Correct answer: D.** \<IdLocation\> specifies the global node used for the ID counter ($Increment)

\<DataLocation\> is where serialized property data lives. \<IndexLocation\> is the default global for all indexes. \<StreamLocation\> is for stream data. \<IdLocation\> is the global whose top node holds the ID counter used by $Increment. \<DefaultData\> does NOT refer to a database \-- it is the name of the \<Data\> definition that maps property positions, in this case "CustomerDefaultData". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_storage))

## Question 17 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q17.md>)

```text
A developer needs to implement a utility class that provides shared helper methods for date formatting. No state needs to be maintained between calls.

Which of the following class definitions is the most appropriate approach?
```

**A.** ```text
Class Utils.DateHelper Extends %Persistent
{
ClassMethod FormatDate(d As %Date) As %String
{
  return $ZDate(d, 3)
}
}
```

**B.** ```text
Class Utils.DateHelper Extends %RegisteredObject
{
ClassMethod FormatDate(d As %Date) As %String
{
  return $ZDate(d, 3)
}
}
```

**C.** ```text
Class Utils.DateHelper [ Abstract ]
{
ClassMethod FormatDate(d As %Date) As %String
{
  return $ZDate(d, 3)
}
}
```

**D.** ```text
Class Utils.DateHelper Extends %SerialObject
{
ClassMethod FormatDate(d As %Date) As %String
{
  return $ZDate(d, 3)
}
}
```

### Answer and explanation

**Correct answer: C.** ```text
Class Utils.DateHelper [ Abstract ]
{
ClassMethod FormatDate(d As %Date) As %String
{
  return $ZDate(d, 3)
}
}
```

For a stateless utility class that only contains ClassMethods and no properties that need persistence, the most appropriate approach is an Abstract class that does not extend any superclass. Abstract utility classes cannot be instantiated (which is correct since no state is needed) and avoid the overhead of %RegisteredObject or %Persistent. Extending %Persistent would create unnecessary storage definitions and globals. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes))

## Question 18 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q18.md>)

```text
Consider the following code that a developer uses to manage a batch process.

set sc = $$$OK
for id = 1:1:1000 {
  set obj = ##class(Batch.Record).%OpenId(id)
  if obj '= "" {
    set obj.Processed = 1
    set sc = obj.%Save()
    if $$$ISERR(sc) quit
  }
}
if $$$ISERR(sc) {
  do $SYSTEM.Status.DisplayError(sc)
}

The developer notices that only 500 records have Processed = 1, despite the loop iterating over IDs 1 through 1000. There was no error displayed.

Which of the following best explains this behavior?
```

**A.** The %OpenId() call returns empty string for IDs above 500, and the if obj '\= "" check skips them silently

**B.** %Save() has a maximum of 500 saves per process

**C.** The for loop syntax 1:1:1000 only iterates up to 500

**D.** Object references from earlier iterations are blocking the save of later objects

### Answer and explanation

**Correct answer: A.** The %OpenId() call returns empty string for IDs above 500, and the if obj '\= "" check skips them silently

If %OpenId() returns empty string for IDs 501-1000, the if obj '\= "" check causes those iterations to be silently skipped with no error. This could happen if IDs 501-1000 were deleted previously (remember, the ID counter can go higher than existing records). The developer should add logging for the case when obj is empty to detect missing records. There is no limit on the number of %Save() calls per process. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_persobj))

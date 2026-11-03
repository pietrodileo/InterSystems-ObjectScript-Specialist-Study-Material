[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T1.3: Methods — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
Consider the following class definition.

Class Sample.Circle Extends %RegisteredObject
{
Parameter PI = 3.14159;
Property Radius As %Integer;
ClassMethod FromDiameter(diameter As %Integer) As %Integer
{ /*Omitted*/ }
Method Area() As %Integer
{ /*Omitted*/ }
}

Which of the following is accurate about the difference between the Area and FromDiameter methods?
```

**A.** Only the Area instance method can access the PI class parameter using ..#PI; this syntax does not work in the FromDiameter class method.

**B.** The code body of Area can reference the Radius property using relative dot syntax, while this is not possible in the FromDiameter class method.

**C.** You need to create an instance of Sample.Circle to use the FromDiameter method but this is not necessary when calling the Area class method.

**D.** The FromDiameter class method can call the Area class method but Area can not call FromDiameter.

### Answer and explanation

**Correct answer: B.** The code body of Area can reference the Radius property using relative dot syntax, while this is not possible in the FromDiameter class method.

Instance methods like Area() have access to the current object context and can reference properties using the .. (double-dot) syntax (e.g., ..Radius). Class methods like FromDiameter() have no object context and therefore cannot use .. to access instance properties. However, both instance and class methods CAN access class parameters using ..#ParamName (option A is incorrect). Class methods do not require an instance to call (option C is reversed). Instance methods can call class methods (option D is incorrect). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

```text
An application provides utility methods that return tax information for a city. The tax rate may change occasionally.

Which of the following code blocks shows how this class can be implemented most efficiently?
```

**A.** ```text
Class Sample.Utils
{
Parameter TaxRate = 0.05;
ClassMethod Tax(amt As %Numeric) As %Numeric
{ return amt * ..#TaxRate }
ClassMethod Total(amt As %Numeric) As %Numeric
{ return amt + ..Tax(amt) }
ClassMethod Description() As %String
{ return "The tax rate is " _ ..#TaxRate }
}
```

**B.** ```text
Class Sample.Utils
{
Property TaxRate As %Numeric = 0.05;
ClassMethod Tax(amt As %Numeric) As %Numeric
{ return amt * ..TaxRate }
ClassMethod Total(amt As %Numeric) As %Numeric
{ return amt + ..Tax(amt) }
ClassMethod Description() As %String
{ return "The tax rate is " _ ..TaxRate }
}
```

**C.** ```text
Class Sample.Utils
{
ClassMethod Tax(amt As %Numeric) As %Numeric
{ return amt * 0.05 }
ClassMethod Total(amt As %Numeric) As %Numeric
{ return amt + ..Tax(amt) }
ClassMethod Description() As %String
{ return "The tax rate is 0.05" }
}
```

**D.** ```text
Class Sample.Utils
{
Method CurrentTaxRate()
{ return 0.05 }
ClassMethod Tax(amt As %Numeric) As %Numeric
{ return amt * ..CurrentTaxRate() }
ClassMethod Total(amt As %Numeric) As %Numeric
{ return amt + ..Tax(amt) }
ClassMethod Description() As %String
{ return "The tax rate is " _ ..CurrentTaxRate() }
}
```

### Answer and explanation

**Correct answer: A.** ```text
Class Sample.Utils
{
Parameter TaxRate = 0.05;
ClassMethod Tax(amt As %Numeric) As %Numeric
{ return amt * ..#TaxRate }
ClassMethod Total(amt As %Numeric) As %Numeric
{ return amt + ..Tax(amt) }
ClassMethod Description() As %String
{ return "The tax rate is " _ ..#TaxRate }
}
```

Option A is correct. Using a Parameter for the tax rate is the most efficient approach: parameters are class-level constants accessible via ..#TaxRate in both class and instance methods. Option B fails because ClassMethods cannot use .. to access properties (properties require an instance). Option C hardcodes the value in multiple places, making maintenance error-prone. Option D fails because ClassMethods cannot call instance methods via .. syntax (CurrentTaxRate is an instance method). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_parameters))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
Consider the following class.

Class App.Calculator Extends %RegisteredObject
{
Parameter PRECISION = 4;

ClassMethod Round(value As %Numeric) As %Numeric
{
  return $FN(value, "", ..#PRECISION)
}

ClassMethod Add(a As %Numeric, b As %Numeric) As %Numeric
{
  return ..Round(a + b)
}
}

A developer runs:

write ##class(App.Calculator).Add(1.123456, 2.654321)

What is the output?
```

**A.** 3.777777

**B.** 3.7778

**C.** 3.78

**D.** An error because class methods cannot call other class methods using .. syntax

### Answer and explanation

**Correct answer: B.** 3.7778

Class methods CAN call other class methods in the same class using the .. syntax. The Add() method calls ..Round(3.777777), and Round() uses $FN with the PRECISION parameter value of 4 to format the number to 4 decimal places, resulting in 3.7778. The ..# syntax accesses the parameter, and the .. syntax calls the class method \-- both work from within a class method. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
Consider the following method signature.

ClassMethod ProcessData(ByRef data As %String, Output result As %String) As %Status

A developer calls it like this:

set myData = "input-value"
set myResult = "old-result"
set sc = ##class(App.Processor).ProcessData(.myData, .myResult)

Which of the following is true about myData and myResult when ProcessData begins executing?
```

**A.** Both myData and myResult retain their original values ("input-value" and "old-result")

**B.** myData retains "input-value" because it is ByRef; myResult is killed (undefined) because it is Output

**C.** Both are killed (undefined) because they are both passed by reference

**D.** myData is killed and myResult retains "old-result" because Output preserves existing values

### Answer and explanation

**Correct answer: A.** Both myData and myResult retain their original values ("input-value" and "old-result")

Both ByRef and Output are passed by reference, and neither keyword affects runtime behavior. The InterSystems documentation states: 'The ByRef and Output keywords provide information for the benefit of anyone using the InterSystems Class Reference. They do not affect the behavior of the code.' Both myData and myResult retain their original values when ProcessData begins executing. The Output keyword is a semantic hint indicating the parameter is intended to return a value, but it does NOT kill or clear the variable. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
Consider the following code.

Class App.Formatter Extends %RegisteredObject
{
ClassMethod BuildReport(ByRef lines As %String) As %String
{
  set result = ""
  set key = ""
  for {
    set key = $Order(lines(key))
    quit:key=""
    set result = result _ lines(key) _ $Char(10)
  }
  return result
}
}

// Caller:
set lines(1) = "Header"
set lines(2) = "Body"
set lines(3) = "Footer"
set report = ##class(App.Formatter).BuildReport(.lines)
write report

What does this code output?
```

**A.** An error because arrays cannot be passed to methods

**B.** Header followed by Body followed by Footer, each on a new line

**C.** Only "Header" because without ByRef only the first subscript is passed

**D.** An empty string because the lines variable has no top-level value

### Answer and explanation

**Correct answer: B.** Header followed by Body followed by Footer, each on a new line

Passing an array by reference (with the dot prefix .lines) sends the entire subscripted structure to the method. Inside BuildReport, the lines parameter has subscripts lines(1), lines(2), and lines(3) accessible. The $Order loop iterates through the subscripts in order, building a string with each line separated by $Char(10) (line feed). This is the standard pattern for passing multidimensional arrays to methods in ObjectScript. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
Consider the following code.

Class App.Service Extends %RegisteredObject
{
ClassMethod UpdateRecord(patient As App.Patient)
{
  set patient.Status = "Active"
}
}

// Caller:
set pt = ##class(App.Patient).%OpenId(1)
write pt.Status    // outputs: "Pending"
do ##class(App.Service).UpdateRecord(pt)
write pt.Status

What is the second write output?
```

**A.** "Pending" because objects are passed by value (a copy is made)

**B.** "Active" because object references point to the same object in memory \-- modifying properties through one reference is visible through all references

**C.** An error because objects must be passed with ByRef to allow modification

**D.** "Active" but only because the ByRef keyword is implied for objects

### Answer and explanation

**Correct answer: B.** "Active" because object references point to the same object in memory \-- modifying properties through one reference is visible through all references

In ObjectScript, when you pass an object to a method (even without ByRef), the object reference (oref) is passed by value. However, both the caller's variable and the method's parameter point to the same object in memory. Modifying the object's properties through either reference affects the same underlying object. ByRef would only be needed if the method wanted to reassign the caller's variable to a different object entirely. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

```text
Consider the following class hierarchy.

Class App.Shape Extends %RegisteredObject
{
Method Draw() As %String
{
  return "Drawing generic shape"
}
}

Class App.Circle Extends App.Shape
{
Property Radius As %Numeric;

Method Draw() As %String
{
  set base = ##super()
  return base _ " -> Circle with radius " _ ..Radius
}
}

A developer runs:

set c = ##class(App.Circle).%New()
set c.Radius = 5
write c.Draw()

What is the output?
```

**A.** "Drawing generic shape"

**B.** "Circle with radius 5"

**C.** "Drawing generic shape -\> Circle with radius 5"

**D.** An error because ##super() cannot be used in a method that returns a value

### Answer and explanation

**Correct answer: C.** "Drawing generic shape -\> Circle with radius 5"

##super() calls the parent class's implementation of the same method. In App.Circle's Draw(), ##super() calls App.Shape's Draw() which returns "Drawing generic shape". That return value is stored in base, then concatenated with the circle-specific text. ##super() works with return values and can pass arguments just like any other method call. This is the standard pattern for extending parent behavior while adding subclass-specific logic. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods_override))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

```text
Consider the following code.

Class App.Math Extends %RegisteredObject
{
ClassMethod Divide(a As %Numeric, b As %Numeric, Output result As %Numeric) As %Status
{
  if b = 0 return $$$ERROR($$$GeneralError, "Division by zero")
  set result = a / b
  return $$$OK
}
}

// Caller:
set sc = ##class(App.Math).Divide(10, 3, .answer)
if $$$ISOK(sc) {
  write "Result: ", answer
} else {
  do $SYSTEM.Status.DisplayError(sc)
}

What is the output?
```

**A.** Result: 3.333333333333333333

**B.** Result: 3

**C.** An error because Output parameters cannot be used with class methods

**D.** An empty string because .answer was not initialized before the call

### Answer and explanation

**Correct answer: A.** Result: 3.333333333333333333

The Divide method receives a\=10, b\=3. Since b is not 0, it sets result (which is the caller's answer variable via Output) to 10/3 \= 3.333333333333333333 and returns $$$OK. The caller checks $$$ISOK(sc) which is true, then writes the answer. Output parameters work with both class methods and instance methods. Note: the Output keyword is a semantic hint indicating the parameter returns a value; it does not affect runtime behavior (both ByRef and Output pass by reference identically). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods))

## Question 9 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

```text
Consider the following class.

Class App.Validator Extends %RegisteredObject
{
ClassMethod ValidateAge(age As %Integer) As %Status
{
  if age < 0 return $$$ERROR($$$GeneralError, "Age cannot be negative")
  if age > 150 return $$$ERROR($$$GeneralError, "Age exceeds maximum")
  return $$$OK
}

ClassMethod ValidatePerson(name As %String, age As %Integer) As %Status
{
  if name = "" return $$$ERROR($$$GeneralError, "Name is required")
  set sc = ..ValidateAge(age)
  if $$$ISERR(sc) return sc
  return $$$OK
}
}

A developer calls:

set sc = ##class(App.Validator).ValidatePerson("John", -5)
write $SYSTEM.Status.GetErrorText(sc)

What is the output?
```

**A.** "Name is required"

**B.** "Age cannot be negative"

**C.** "Age exceeds maximum"

**D.** An error because ..ValidateAge() cannot be called from a ClassMethod

### Answer and explanation

**Correct answer: B.** "Age cannot be negative"

ValidatePerson is called with name \= "John" (not empty, passes first check) and age \= -5. It then calls ..ValidateAge(-5). ClassMethods CAN call other ClassMethods using the .. syntax. ValidateAge checks -5 \< 0 which is true, and returns an error status with "Age cannot be negative". This error is returned back through ValidatePerson, and GetErrorText displays the message. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_status))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
Consider the following code.

Class App.Counter Extends %RegisteredObject
{
Property Value As %Integer [ InitialExpression = 0 ];

Method Increment(amount As %Integer = 1) As %Integer
{
  set ..Value = ..Value + amount
  return ..Value
}
}

// Caller:
set c = ##class(App.Counter).%New()
write c.Increment(), " "
write c.Increment(5), " "
write c.Increment()

What is the output?
```

**A.** 1 5 1

**B.** 1 6 7

**C.** 0 5 6

**D.** An error because you cannot call Increment() without an argument

### Answer and explanation

**Correct answer: B.** 1 6 7

The method signature includes a default value: amount As %Integer \= 1\. When called without arguments, amount defaults to 1\. First call: 0\+1\=1, returns 1\. Second call: 1\+5\=6, returns 6\. Third call: 6\+1\=7, returns 7\. The Value property persists across calls because the method modifies the instance state via ..Value. Default argument values allow flexible method signatures. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods))

## Question 11 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

```text
Consider the following class.

Class App.Processor Extends %RegisteredObject
{
ClassMethod Transform(ByRef data As %String)
{
  set key = ""
  for {
    set key = $Order(data(key))
    quit:key=""
    set data(key) = $ZCONVERT(data(key), "U")
  }
}
}

// Caller:
set items("a") = "hello"
set items("b") = "world"
do ##class(App.Processor).Transform(.items)
write items("a"), " ", items("b")

What is the output?
```

**A.** hello world

**B.** HELLO WORLD

**C.** An error because class methods cannot modify ByRef arrays

**D.** An empty string because the array is killed by the ByRef keyword

### Answer and explanation

**Correct answer: B.** HELLO WORLD

The array is passed by reference using the dot prefix (.items), which gives the Transform method access to all subscripts. The method iterates through each subscript using $Order and converts the values to uppercase using $ZCONVERT with the "U" flag. Since the array is passed by reference, the modifications to data(key) directly affect the caller's items array. The output is "HELLO WORLD". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods))

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

```text
Consider the following class hierarchy.

Class App.Base Extends %Persistent
{
Method Validate() As %Status
{
  // Base validation logic
  return $$$OK
}
}

Class App.Extended Extends App.Base
{
Property Email As %String;

Method Validate() As %Status
{
  set sc = ##super()
  if $$$ISERR(sc) return sc
  if ..Email = "" return $$$ERROR($$$GeneralError, "Email required")
  if ..Email '[ "@" return $$$ERROR($$$GeneralError, "Invalid email")
  return $$$OK
}
}

A developer calls:

set obj = ##class(App.Extended).%New()
set obj.Email = "invalid-email"
set sc = obj.Validate()

What is the result?
```

**A.** $$$OK because the base Validate() returns OK and the method stops there

**B.** An error status with "Email required"

**C.** An error status with "Invalid email" because ##super() returned OK, Email is not empty, but Email does not contain "@"

**D.** An error because ##super() cannot return a %Status value

### Answer and explanation

**Correct answer: C.** An error status with "Invalid email" because ##super() returned OK, Email is not empty, but Email does not contain "@"

The execution flow is: App.Extended.Validate() calls ##super() which runs App.Base.Validate() returning $$$OK. Since sc is OK, execution continues. Email is "invalid-email" (not empty), so the first Email check passes. But "invalid-email" does not contain "@" (the \[ operator checks for substring containment), so the method returns the "Invalid email" error. This demonstrates how ##super() enables layered validation. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods_override))

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

```text
Consider the following class.

Class App.Logger Extends %RegisteredObject
{
Parameter LOGPREFIX = "APP";

ClassMethod Log(message As %String)
{
  write "[" _ ..#LOGPREFIX _ "] " _ message, !
}
}

Class App.AuditLogger Extends App.Logger
{
Parameter LOGPREFIX = "AUDIT";
}

A developer runs:

do ##class(App.AuditLogger).Log("User logged in")

What is the output?
```

**A.** \[APP\] User logged in

**B.** \[AUDIT\] User logged in

**C.** An error because AuditLogger does not define its own Log() method

**D.** \[APP\]\[AUDIT\] User logged in

### Answer and explanation

**Correct answer: B.** \[AUDIT\] User logged in

App.AuditLogger inherits the Log() method from App.Logger. When Log() is called on App.AuditLogger, the ..#LOGPREFIX reference resolves to the parameter value defined in App.AuditLogger, which is "AUDIT". Parameters can be overridden in subclasses, and ..# always resolves to the value in the class the method is being called on, not the class where the method was originally defined. This is a form of parametric polymorphism. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_parameters))

## Question 14 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

```text
Consider the following classes.

Class Sample.Person Extends %Persistent
{
// Omitted
}

Class Sample.Patient Extends Sample.Person
{
// Omitted
}

You are writing code that accepts an object reference and need to verify the caller passed an instance of Sample.Person or a subclass.

Which of the following code blocks correctly accomplishes that?
```

**A.** ```text
ClassMethod ProcessPatient(oref As Sample.Person)
{
  if oref.%ClassName() '= "Sample.Person" return "Wrong Class"
}
```

**B.** ```text
ClassMethod ProcessPatient(oref As Sample.Person)
{
  if 'oref.%IsA("Sample.Person") return "Wrong Class"
}
```

**C.** ```text
ClassMethod ProcessPatient(oref As Sample.Person)
{
  if $CLASSNAME(oref) '= "Sample.Person" return "Wrong Class"
}
```

**D.** ```text
ClassMethod ProcessPatient(oref As Sample.Patient)
{
  if oref.%TypeOf() '= "Sample.Person" return "Wrong Class"
}
```

### Answer and explanation

**Correct answer: B.** ```text
ClassMethod ProcessPatient(oref As Sample.Person)
{
  if 'oref.%IsA("Sample.Person") return "Wrong Class"
}
```

The %IsA() method checks whether an object is an instance of a specified class OR any of its subclasses. Passing a Sample.Patient instance would return true for %IsA("Sample.Person") because Patient extends Person. Option A fails because %ClassName() returns only the short class name ("Person") without the package, and it would reject valid subclass instances. Option C uses $CLASSNAME which is not a standard ObjectScript function. Option D uses %TypeOf() which does not exist. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_model_inheritance_extents))

## Question 15 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

```text
Consider the following method.

ClassMethod GetStats(ByRef counts As %Integer) As %Status
{
  set counts("total") = 100
  set counts("active") = 75
  set counts("inactive") = 25
  return $$$OK
}

A developer calls:

set myCount = 0
set myCount("extra") = 999
set sc = ##class(App.Reports).GetStats(.myCount)
write myCount, !
write myCount("total"), !
write myCount("extra")

What is the output?
```

**A.** ```text
0
100
999
```

**B.** ```text
100
100
999
```

**C.** An error because ByRef kills the variable before the method starts

**D.** ```text
0
100
An <UNDEFINED> error because the method replaced the array
```

### Answer and explanation

**Correct answer: A.** ```text
0
100
999
```

With ByRef, the caller's variable (including all subscripts) is passed to the method intact. The method adds subscripts "total", "active", and "inactive" to the counts array but does not modify the top-level value or the existing "extra" subscript. After the call, myCount retains its top-level value of 0, myCount("total") is 100 (set by the method), and myCount("extra") is 999 (untouched by the method). Neither ByRef nor Output kills the variable \-- both keywords are semantic hints that do not affect runtime behavior. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods))

## Question 16 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q16.md>)

```text
Consider the following class with an abstract method.

Class App.DataSource Extends %RegisteredObject [ Abstract ]
{
Method FetchData() As %String [ Abstract ]
{
}

Method Process() As %String
{
  set raw = ..FetchData()
  return $ZCONVERT(raw, "U")
}
}

Class App.FileSource Extends App.DataSource
{
Method FetchData() As %String
{
  return "data from file"
}
}

A developer runs:

set src = ##class(App.FileSource).%New()
write src.Process()

What is the output?
```

**A.** An error because abstract methods cannot be called

**B.** "data from file"

**C.** "DATA FROM FILE"

**D.** An error because App.DataSource cannot be compiled with an abstract method

### Answer and explanation

**Correct answer: C.** "DATA FROM FILE"

The Process() method calls ..FetchData(). Since the actual object is an App.FileSource instance, its FetchData() implementation runs, returning "data from file". Process() then passes this through $ZCONVERT with "U" to convert to uppercase, resulting in "DATA FROM FILE". This demonstrates the Template Method design pattern: the base class defines the algorithm (Process) while subclasses provide specific implementations (FetchData). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods))

## Question 17 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q17.md>)

```text
Consider the following code.

Class App.Converter Extends %RegisteredObject
{
ClassMethod ToList(ByRef arr As %String, Output list As %List) As %Status
{
  set list = ""
  set key = ""
  for {
    set key = $Order(arr(key))
    quit:key=""
    set list = list _ $ListBuild(arr(key))
  }
  return $$$OK
}
}

// Caller:
set data(1) = "Red"
set data(2) = "Green"
set data(3) = "Blue"
set sc = ##class(App.Converter).ToList(.data, .result)
write $ListLength(result)

What is the output?
```

**A.** 0

**B.** 3

**C.** An error because you cannot concatenate $List values with \_

**D.** 1

### Answer and explanation

**Correct answer: B.** 3

The method iterates through the arr subscripts (1, 2, 3\) using $Order and builds a $List by concatenating $ListBuild values. $List concatenation with \_ is valid and produces a longer $List. After processing all three elements, list contains $LB("Red", "Green", "Blue"), and $ListLength returns 3\. The data array is passed ByRef and result is passed as Output; both keywords pass by reference and neither affects runtime behavior (they are semantic hints for documentation). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_flistbuild))

## Question 18 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q18.md>)

```text
Consider the following class.

Class App.EventHandler Extends %RegisteredObject
{
Method OnEvent(eventName As %String) As %String
{
  return "Base handler: " _ eventName
}
}

Class App.CustomHandler Extends App.EventHandler
{
Method OnEvent(eventName As %String) As %String [ Final ]
{
  return "Custom: " _ ##super(eventName)
}
}

Class App.SpecialHandler Extends App.CustomHandler
{
Method OnEvent(eventName As %String) As %String
{
  return "Special: " _ ##super(eventName)
}
}

What happens when the developer tries to compile App.SpecialHandler?
```

**A.** Compilation succeeds and App.SpecialHandler.OnEvent returns "Special: Custom: Base handler: \<event\>"

**B.** A compile error occurs because App.CustomHandler.OnEvent is marked Final and cannot be overridden

**C.** Compilation succeeds but the Final keyword is ignored in subclasses

**D.** A runtime error occurs when OnEvent is called

### Answer and explanation

**Correct answer: B.** A compile error occurs because App.CustomHandler.OnEvent is marked Final and cannot be overridden

The \[ Final \] keyword on App.CustomHandler.OnEvent() prevents any subclass from overriding that method. When App.SpecialHandler attempts to define its own OnEvent(), the compiler detects the violation and raises a compile-time error. Final methods are used to lock down critical behavior and prevent subclasses from changing it. This is enforced at compile time, not runtime. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods_override))

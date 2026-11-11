[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T4.6: Uses Object and Class APIs — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
Consider the following class definitions:

Class Sample.Person Extends %Persistent
{
  //Omitted
}

Class Sample.Patient Extends Sample.Person
{
  //Omitted
}

You are writing code that accepts an object reference, and would like to check whether the caller correctly passed an instance of Sample.Person or a subclass.

Which of the following code blocks accomplishes that?
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

Option (b) uses %IsA, which returns 1 if the object is an instance of the specified class OR any subclass. Since Sample.Patient extends Sample.Person, a Patient object passes the %IsA("Sample.Person") check. Option (a) fails because %ClassName() without argument 1 returns only the short name, and it would reject Patient objects. Option (c) uses $CLASSNAME which does not exist. Option (d) uses %TypeOf which does not exist. (Reference: InterSystems Practice Q19; [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_misa))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

```text
You need to inspect the class of an object at runtime. Consider:

set obj = ##class(MyApp.Invoice).%New()
write obj.%ClassName(0), " / ", obj.%ClassName(1)

What is the output?
```

**A.** MyApp.Invoice / Invoice

**B.** Invoice / MyApp.Invoice

**C.** MyApp / Invoice

**D.** Invoice / MyApp

### Answer and explanation

**Correct answer: B.** Invoice / MyApp.Invoice

%ClassName(0) returns the short (unqualified) class name: "Invoice". %ClassName(1) returns the full package-qualified class name: "MyApp.Invoice". The argument controls whether the package prefix is included. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_mclassname))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
A plugin system needs to call class methods dynamically based on configuration. Consider:

set className = "App.Plugins.EmailNotifier"
set methodName = "Send"
set sc = $CLASSMETHOD(className, methodName, "Hello", "user@test.com")

Which statement best describes this code?
```

**A.** It calls the instance method Send on a new object of App.Plugins.EmailNotifier

**B.** It calls the class method Send on App.Plugins.EmailNotifier with two arguments

**C.** It creates an instance of App.Plugins.EmailNotifier and stores it in sc

**D.** It throws an error because $CLASSMETHOD requires an object reference

### Answer and explanation

**Correct answer: B.** It calls the class method Send on App.Plugins.EmailNotifier with two arguments

$CLASSMETHOD dynamically invokes a class method. First argument is the class name, second is the method name, followed by any arguments. This is equivalent to ##class(App.Plugins.EmailNotifier).Send("Hello", "user@test.com") but allows the class and method names to be variables. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fclassmethod))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
You need to dynamically invoke an instance method. Consider:

set obj = ##class(App.Calculator).%New()
set methodName = "Add"
set result = $METHOD(obj, methodName, 10, 20)
write result

Assuming Add returns the sum of its arguments, what is the output?
```

**A.** 30

**B.** "Add"

**C.** An \<UNDEFINED\> error

**D.** A \<METHOD DOES NOT EXIST\> error

### Answer and explanation

**Correct answer: A.** 30

$METHOD dynamically invokes an instance method by name. $METHOD(obj, "Add", 10, 20\) is equivalent to obj.Add(10, 20). Since Add returns the sum, the result is 30\. This is useful when the method name is determined at runtime (e.g., from configuration). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fmethod))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
You are writing a factory method that creates objects dynamically. Consider:

set className = "User.Person"
set obj = $CLASSMETHOD(className, "%New")
write obj.%ClassName(1)

What is the output?
```

**A.** User.Person

**B.** Person

**C.** %New

**D.** An \<UNDEFINED\> error

### Answer and explanation

**Correct answer: A.** User.Person

$CLASSMETHOD(className, "%New") dynamically calls %New on the User.Person class, creating a new instance. obj.%ClassName(1) then returns the full package-qualified class name "User.Person". This pattern is essential for factory methods and plugin architectures. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fclassmethod))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
You are validating input and need to check if a variable holds an object reference. Consider:

set x = "Hello"
set y = ##class(%ArrayOfDataTypes).%New()
write $ISOBJECT(x), " ", $ISOBJECT(y)

What is the output?
```

**A.** 1 1

**B.** 0 1

**C.** 1 0

**D.** 0 0

### Answer and explanation

**Correct answer: B.** 0 1

$ISOBJECT returns 1 if the variable contains a valid object reference (OREF) and 0 otherwise. "Hello" is a string, not an OREF, so $ISOBJECT returns 0\. The %ArrayOfDataTypes instance is a valid OREF, so $ISOBJECT returns 1\. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fisobject))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

```text
You are building a generic data exporter that reads property values dynamically. Consider:

set obj = ##class(User.Person).%New()
set obj.Name = "Alice"
set propName = "Name"
write $PROPERTY(obj, propName)

What is the output?
```

**A.** Alice

**B.** Name

**C.** "Name"

**D.** A \<PROPERTY DOES NOT EXIST\> error

### Answer and explanation

**Correct answer: A.** Alice

$PROPERTY(obj, propName) dynamically accesses a property by name. Since propName\="Name", this is equivalent to obj.Name, which returns "Alice". This is useful for generic code that processes different classes with different property names. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fproperty))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

You need to introspect a class definition at runtime. Which code correctly opens the class definition for User.Person?

**A.** set def \= ##class(%Dictionary.ClassDefinition).%New("User.Person")

**B.** set def \= ##class(%Dictionary.ClassDefinition).%OpenId("User.Person")

**C.** set def \= $SYSTEM.OBJ.GetClassDef("User.Person")

**D.** set def \= ##class(%Dictionary.ClassDefinition).%Get("User.Person")

### Answer and explanation

**Correct answer: B.** set def \= ##class(%Dictionary.ClassDefinition).%OpenId("User.Person")

%Dictionary.ClassDefinition is a persistent class where the ID is the class name. Use %OpenId("User.Person") to open the existing definition. %New would create a new, empty definition rather than opening the existing one. There is no %Get or $SYSTEM.OBJ.GetClassDef method. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_classdef))

## Question 9 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

```text
You are building a documentation generator that lists all properties of a class. Consider:

set def = ##class(%Dictionary.ClassDefinition).%OpenId("User.Person")
set count = def.Properties.Count()
for i = 1:1:count {
  set prop = def.Properties.GetAt(i)
  write prop.Name, !
}

What does this code do?
```

**A.** Lists all methods of the User.Person class

**B.** Lists all properties defined in the User.Person class

**C.** Lists all indexes of the User.Person class

**D.** Lists all parameters of the User.Person class

### Answer and explanation

**Correct answer: B.** Lists all properties defined in the User.Person class

The code opens the class definition, accesses the Properties collection, and iterates through each %Dictionary.PropertyDefinition object, printing its Name. This is a standard introspection pattern. Similarly, def.Methods would iterate method definitions. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_classdef))

## Question 10 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

Which of the following are valid ways to check the type or class of an object in ObjectScript? (Select all that apply)

**A.** obj.%ClassName(1) to get the full class name

**B.** obj.%IsA("ClassName") to test inheritance

**C.** $CLASSNAME(obj) to get the class name

**D.** $ISOBJECT(obj) to verify it is an object reference

**E.** obj.%Extends("ClassName") to test inheritance

**F.** obj.%IsClass("ClassName") to test class membership

### Answer and explanation

**Correct answer: A.** obj.%ClassName(1) to get the full class name

**Correct answer: B.** obj.%IsA("ClassName") to test inheritance

**Correct answer: C.** $CLASSNAME(obj) to get the class name

**Correct answer: D.** $ISOBJECT(obj) to verify it is an object reference

**Correct answer: E.** obj.%Extends("ClassName") to test inheritance

%ClassName(1) returns the fully qualified class name, %IsA() tests the primary inheritance chain, $CLASSNAME() returns the class of an instance, $ISOBJECT() confirms a value is an object reference, and %Extends() tests inheritance including secondary superclasses. There is no %IsClass() method \-- calling it raises \<METHOD DOES NOT EXIST\>. The two real inheritance tests are %IsA() and %Extends(), and the difference between them is which superclasses they follow. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ))

## Question 11 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

```text
A class hierarchy has three levels. Consider:

Class Base.Entity Extends %Persistent { }
Class App.Person Extends Base.Entity { }
Class App.Employee Extends App.Person { }

set emp = ##class(App.Employee).%New()
write emp.%IsA("Base.Entity"), " "
write emp.%IsA("App.Person"), " "
write emp.%IsA("%Library.Persistent")

What is the output?
```

**A.** 1 1 1

**B.** 1 1 0

**C.** 0 1 0

**D.** 0 0 1

### Answer and explanation

**Correct answer: A.** 1 1 1

%IsA checks the entire inheritance chain. App.Employee extends App.Person, which extends Base.Entity, which extends %Persistent (which is %Library.Persistent). So the Employee object %IsA all of these classes, returning 1 for each check. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_misa))

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

```text
You need to dynamically set a property on an object. Consider:

set obj = ##class(App.Config).%New()
set propName = "Timeout"
set $PROPERTY(obj, propName) = 30
write obj.Timeout

What is the output?
```

**A.** 30

**B.** Timeout

**C.** An \<UNDEFINED\> error

**D.** A \<SYNTAX\> error

### Answer and explanation

**Correct answer: A.** 30

SET $PROPERTY(obj, propName) \= value dynamically sets a property by name, similar to how SET $PIECE modifies a string. Since propName\="Timeout", this is equivalent to SET obj.Timeout \= 30\. Reading obj.Timeout then returns 30\. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fproperty))

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

Which %Dictionary class would you use to inspect the compiled methods of a class, including inherited methods?

**A.** %Dictionary.ClassDefinition

**B.** %Dictionary.MethodDefinition

**C.** %Dictionary.PropertyDefinition

**D.** %Dictionary.CompiledMethod

### Answer and explanation

**Correct answer: D.** %Dictionary.CompiledMethod

%Dictionary.CompiledMethod contains information about compiled methods, including both directly defined and inherited methods. %Dictionary.MethodDefinition contains only the source definitions (not inherited). For inspecting the full set of available methods at runtime, %Dictionary.CompiledMethod is the correct choice. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_classdef))

## Question 14 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

Which properties are available on a %Dictionary.PropertyDefinition object for introspection? (Select all that apply)

**A.** Name \- the property name

**B.** Type \- the data type of the property

**C.** Required \- whether the property is required

**D.** SqlFieldName \- the SQL column name

**E.** Value \- the current runtime value of the property

### Answer and explanation

**Correct answer: A.** Name \- the property name

**Correct answer: B.** Type \- the data type of the property

**Correct answer: C.** Required \- whether the property is required

**Correct answer: D.** SqlFieldName \- the SQL column name

%Dictionary.PropertyDefinition contains metadata about a property's definition: Name, Type, Required, SqlFieldName, Collection, and many others. It does NOT have a Value property \- it describes the class structure (schema), not instance data. Instance data is accessed through object references. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_properties))

## Question 15 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

```text
A routing engine dispatches requests to handler classes. Consider:

set handlers("email") = "App.EmailHandler"
set handlers("sms") = "App.SmsHandler"

set type = "email"
set className = handlers(type)
set result = $CLASSMETHOD(className, "Process", "Hello World")

Which statement best describes what happens?
```

**A.** It calls ##class(App.EmailHandler).Process("Hello World") dynamically

**B.** It creates a new App.EmailHandler object and calls Process on it

**C.** It throws an error because $CLASSMETHOD cannot use array lookups

**D.** It calls Process on all handler classes in the array

### Answer and explanation

**Correct answer: A.** It calls ##class(App.EmailHandler).Process("Hello World") dynamically

$CLASSMETHOD takes a class name (string) and method name, then invokes the class method. The class name can come from any expression, including an array lookup. className resolves to "App.EmailHandler", so this is equivalent to ##class(App.EmailHandler).Process("Hello World"). This pattern enables flexible plugin/routing architectures. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fclassmethod))

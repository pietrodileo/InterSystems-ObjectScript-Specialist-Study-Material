[All topics](../../index.md) · [Practice quiz](quiz.md)

# T1.3: Creates ObjectScript Methods

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.3.html). Reference links require internet access.

### Contents

1. [Differentiates between instance and class methods (Method vs ClassMethod, ..property syntax)](#1-differentiates-between-instance-and-class-methods-method-vs-classmethod-property-syntax)
2. [Uses class parameters inside methods (..#ParameterName)](#2-uses-class-parameters-inside-methods-parametername)
3. [Specifies method arguments and return type (As clause, Output, ByRef)](#3-specifies-method-arguments-and-return-type-as-clause-output-byref)
4. [Passes objects to methods (oref passing)](#4-passes-objects-to-methods-oref-passing)
5. [Passes variables by reference (ByRef, .variable syntax at call site)](#5-passes-variables-by-reference-byref-variable-syntax-at-call-site)
6. [Passes multidimensional variables by reference (passing arrays)](#6-passes-multidimensional-variables-by-reference-passing-arrays)
7. [Uses and overrides inherited methods (overriding, calling parent)](#7-uses-and-overrides-inherited-methods-overriding-calling-parent)
8. [Determines when to use ##super for calling superclass methods](#8-determines-when-to-use-super-for-calling-superclass-methods)

### Visual study guide — sections 1–4

![T1.3 visual summary of sections 1–4: 1. Differentiates between instance and class methods (Method vs ClassMethod, ..property syntax); 2. Uses class parameters inside methods (..#ParameterName); 3. Specifies method arguments and return type (As clause, Output, ByRef); 4. Passes objects to methods (oref passing)](visual-guide-01.png)

[View all chapter diagrams](visuals.md) · [Technical review notes](../../visual-technical-notes.md)

## 1. Differentiates between instance and class methods (Method vs ClassMethod, ..property syntax)

### Key Points

- **Method**: Instance method that operates on a specific object instance; has access to properties via `..PropertyName`
- **ClassMethod**: Invoked on the class itself without requiring an object instance
- Instance methods receive an implicit `%This` reference to the current object
- **..PropertyName** syntax accesses properties of the current instance (only in instance methods)
- Class methods cannot use `..` syntax because there is no object instance

### Detailed Notes

#### Overview

InterSystems IRIS distinguishes between two fundamental method types. The choice between them determines how the method is invoked and what data it can access. This distinction is critical for proper class design.

#### Instance Methods

```objectscript
Class Sample.Person Extends %Persistent
{
    Property Name As %String;
    Property DOB As %Date;

    /// Instance method - operates on a specific person
    Method GetAge() As %Integer
    {
        Set today = +$HOROLOG
        Set birthDays = ..DOB
        Return (today - birthDays) \ 365.25
    }

    /// Instance method that modifies the object
    Method UpdateName(newName As %String) As %Status
    {
        Set ..Name = newName
        Return ..%Save()
    }
}
```

Calling an instance method requires an object reference:

```objectscript
Set person = ##class(Sample.Person).%OpenId(1)
Set age = person.GetAge()
Write "Age: ", age, !
```

#### Class Methods

```objectscript
Class Sample.Person Extends %Persistent
{
    /// Class method - no object instance needed
    ClassMethod FindByName(name As %String) As Sample.Person
    {
        &sql(SELECT ID INTO :id FROM Sample.Person WHERE Name = :name)
        If SQLCODE = 0 {
            Return ##class(Sample.Person).%OpenId(id)
        }
        Return ""
    }

    /// Class method - utility function
    ClassMethod GetCount() As %Integer
    {
        &sql(SELECT COUNT(*) INTO :count FROM Sample.Person)
        Return count
    }
}
```

Calling a class method uses the class reference syntax:

```objectscript
Set person = ##class(Sample.Person).FindByName("John Smith")
Set total = ##class(Sample.Person).GetCount()
```

#### The `..` Syntax

The double-dot syntax is syntactic sugar available only in instance methods:

- `..PropertyName` accesses a property (equivalent to `$THIS.PropertyName`)
- `..MethodName()` calls another instance method on the same object
- `..#ParameterName` accesses a class parameter (works in both instance and class methods)

```objectscript
Method DisplayInfo()
{
    Write "Name: ", ..Name, !
    Write "Age: ", ..GetAge(), !         // calls instance method
    Write "Type: ", ..#OBJECTTYPE, !     // accesses class parameter
}
```

#### When to Use Each Type

| Use Instance Method When... | Use ClassMethod When... |
| --- | --- |
| Operating on a specific object's data | No specific object is needed |
| Accessing or modifying properties | Performing lookups or searches |
| Computing derived values from properties | Creating factory methods |
| Implementing business logic for one object | Implementing utility functions |

### Documentation References

- [Method Definitions](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods)
- [Instance Methods vs Class Methods](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods_kinds)

## 2. Uses class parameters inside methods (..#ParameterName)

### Key Points

- **..#ParameterName** accesses a class parameter from within any method (instance or class)
- Class parameters act as constants defined at the class level
- Parameters can be overridden in subclasses, enabling polymorphic behavior
- Common system parameters: DEFAULTGLOBAL, USEEXTENTSET, MANAGEDEXTENT
- Use parameters for configuration values that may vary by subclass

### Detailed Notes

#### Overview

Class parameters define constants associated with a class. They provide a way to configure class behavior without hardcoding values in methods. Because parameters can be overridden in subclasses, they enable a powerful pattern where base class methods adapt their behavior based on subclass configuration.

#### Defining and Accessing Parameters

```objectscript
Class Sample.Notification Extends %RegisteredObject
{
    Parameter MAXRETRIES = 3;
    Parameter TIMEOUT = 30;
    Parameter PROVIDER = "Email";

    Method Send(message As %String) As %Status
    {
        For i = 1:1:..#MAXRETRIES {
            // Attempt to send with timeout
            Set sc = ..DoSend(message, ..#TIMEOUT)
            If $$$ISOK(sc) Return sc
        }
        Return $$$ERROR($$$GeneralError, "Failed after " _ ..#MAXRETRIES _ " retries")
    }

    ClassMethod GetProvider() As %String
    {
        Return ..#PROVIDER
    }
}
```

#### Overriding Parameters in Subclasses

```objectscript
Class Sample.SMSNotification Extends Sample.Notification
{
    Parameter MAXRETRIES = 5;
    Parameter TIMEOUT = 10;
    Parameter PROVIDER = "SMS";
}
```

When `SMSNotification.Send()` executes, `..#MAXRETRIES` evaluates to 5 and `..#TIMEOUT` to 10 (the overridden values), even though the method code is defined in the parent class. This is resolved at compile time.

#### Parameter Types

Parameters can optionally have a type constraint:

```objectscript
Parameter BATCHSIZE As %Integer = 100;
Parameter ENABLED As %Boolean = 1;
Parameter PREFIX As %String = "APP";
```

#### Common System Parameters

Several system parameters control class behavior:

| Parameter | Purpose |
| --- | --- |
| USEEXTENTSET | Use hashed global names for storage |
| MANAGEDEXTENT | Allow %ExtentMgr to track the extent |
| DEFAULTGLOBAL | Override default global name for storage |
| READONLY | Prevent modification of objects |
| DSTIME | Enable BI synchronization |

#### Using Parameters for Configurable Behavior

```objectscript
Class Sample.BaseProcessor Extends %RegisteredObject
{
    Parameter LOGPREFIX = "PROC";
    Parameter LOGLEVEL = 2;

    Method Log(message As %String, level As %Integer = 1)
    {
        If level <= ..#LOGLEVEL {
            Write "[", ..#LOGPREFIX, "] ", message, !
        }
    }
}
```

### Documentation References

- [Class Parameters](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes_parameters)
- [Parameter Keywords](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_parameter)

## 3. Specifies method arguments and return type (As clause, Output, ByRef)

### Key Points

- **As ClassName** specifies the return type of a method
- Method arguments are declared with name, optional type, and optional default value
- **Output** keyword indicates the argument is output-only (not passed in)
- **ByRef** keyword indicates the argument is passed by reference (both in and out)
- **Important:** `ByRef` and `Output` in the formal parameter list are purely **indicative** — they have no intrinsic effect on how the argument is passed. It is the **caller** who decides by using the dot (`.`) prefix. The method would work the same even without `ByRef`/`Output` in the signature.
- Default values are specified with `= value` in the argument list

### Detailed Notes

#### Overview

Well-defined method signatures improve code clarity, enable better compile-time checking, and generate accurate documentation. InterSystems IRIS supports typed arguments, return types, default values, and reference parameters.

#### Basic Method Signature

```objectscript
Method Calculate(x As %Numeric, y As %Numeric) As %Numeric
{
    Return x + y
}
```

The `As %Numeric` after the closing parenthesis specifies the return type. Argument types follow each argument name.

#### Default Values

```objectscript
Method FormatDate(date As %Date, format As %String = "YYYY-MM-DD") As %String
{
    // format defaults to "YYYY-MM-DD" if not provided
    Return $ZDate(date, 3)
}
```

Calling with or without the optional parameter:

```objectscript
Set result = obj.FormatDate($HOROLOG)          // uses default format
Set result = obj.FormatDate($HOROLOG, "MM/DD") // overrides default
```

#### Output Parameters

The `Output` keyword marks an argument as output-only. The caller should not pass a value in; the method will set it:

```objectscript
ClassMethod Divide(a As %Numeric, b As %Numeric, Output result As %Numeric) As %Status
{
    If b = 0 Return $$$ERROR($$$GeneralError, "Division by zero")
    Set result = a / b
    Return $$$OK
}
```

Calling with an output parameter (use the dot prefix):

```objectscript
Set sc = ##class(Sample.Math).Divide(10, 3, .answer)
If $$$ISOK(sc) Write "Result: ", answer, !
```

#### ByRef Parameters

The `ByRef` keyword marks an argument as pass-by-reference. The caller's variable is both read and modified:

```objectscript
ClassMethod Increment(ByRef counter As %Integer, amount As %Integer = 1)
{
    Set counter = counter + amount
}
```

Calling:

```objectscript
Set myCount = 5
Do ##class(Sample.Util).Increment(.myCount, 3)
Write myCount  // Outputs: 8
```

#### Key Distinction: Output vs ByRef

| Aspect | Output | ByRef |
| --- | --- | --- |
| Initial value passed in | No (undefined inside method) | Yes (caller's value available) |
| Value returned to caller | Yes | Yes |
| Caller syntax | `.variable` | `.variable` |
| Semantic meaning | Method produces a value | Method reads and modifies a value |

#### Critical: ByRef and Output Are Purely Indicative

In ObjectScript, `ByRef` and `Output` in the formal parameter list are **documentation hints only** — they have no enforcement or runtime effect. The passing mechanism is controlled **entirely by the caller** using the dot (`.`) prefix.

This means:

- A caller can use `.variable` even if the parameter is **not** declared `ByRef` or `Output` — and it works
- A caller can omit the dot even if the parameter **is** declared `ByRef` — and it simply passes by value
- You could remove `ByRef`/`Output` from every method signature and everything would still function identically

```objectscript
/// No ByRef or Output keyword — but pass-by-reference still works!
ClassMethod AddSuffix(text As %String, suffix As %String)
{
    Set text = text _ suffix
}
```

```objectscript
Set myText = "Hello"
Do ##class(Sample.Util).AddSuffix(.myText, " World")
Write myText  // "Hello World" — modified despite no ByRef in signature!
```

**Best practice:** Always declare `ByRef` or `Output` in the signature as documentation for the caller, even though the keywords themselves have no effect. They signal the intended contract of the method.

#### Methods Returning %Status

A common pattern is to return `%Status` and use Output parameters for actual results:

```objectscript
ClassMethod ProcessData(input As %String, Output result As %String, Output errorMsg As %String) As %Status
{
    If input = "" {
        Set errorMsg = "Input cannot be empty"
        Return $$$ERROR($$$GeneralError, errorMsg)
    }
    Set result = $ZCONVERT(input, "U")
    Return $$$OK
}
```

### Documentation References

- [Method Arguments](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods_arguments)
- [Method Keywords](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_method)

## 4. Passes objects to methods (oref passing)

### Key Points

- Object references (orefs) are passed **by value** by default, but the oref is a pointer to the object
- Modifying properties of a passed object affects the original object (shared reference)
- Assigning a new object to the parameter variable does NOT affect the caller's variable
- Type checking is performed at compile time when argument types are specified
- Objects are reference-counted; they persist as long as at least one variable references them

### Detailed Notes

#### Overview

When you pass an object to a method, you are passing the object reference (oref), which is essentially a pointer to the in-memory object. Understanding this is critical for avoiding bugs related to unintended modifications or lost references.

#### Passing Objects

```objectscript
Class Sample.OrderProcessor Extends %RegisteredObject
{
    ClassMethod ApplyDiscount(order As Sample.Order, pct As %Numeric)
    {
        // This modifies the ORIGINAL order object
        Set order.Total = order.Total * (1 - (pct / 100))
    }

    ClassMethod ProcessOrder(order As Sample.Order) As %Status
    {
        // Validate the order
        If order.Total <= 0 {
            Return $$$ERROR($$$GeneralError, "Invalid total")
        }
        // Modify the order's status
        Set order.Status = "Processed"
        Return order.%Save()
    }
}
```

Usage:

```objectscript
Set order = ##class(Sample.Order).%OpenId(1)
Write "Before: ", order.Total, !         // e.g., 100
Do ##class(Sample.OrderProcessor).ApplyDiscount(order, 10)
Write "After: ", order.Total, !          // 90 (original object modified)
```

#### Value Semantics of the Reference

The oref itself is passed by value. Reassigning the parameter variable inside the method does not change the caller's variable:

```objectscript
ClassMethod ResetOrder(order As Sample.Order)
{
    // This does NOT affect the caller's variable
    Set order = ##class(Sample.Order).%New()
    Set order.Total = 0
}
```

```objectscript
Set myOrder = ##class(Sample.Order).%OpenId(1)
Do ##class(Sample.OrderProcessor).ResetOrder(myOrder)
// myOrder still points to the original object (ID 1), unchanged
```

To actually modify the caller's variable, use `ByRef` or `Output`:

```objectscript
ClassMethod ResetOrder(ByRef order As Sample.Order)
{
    Set order = ##class(Sample.Order).%New()
    Set order.Total = 0
}
// Now calling with: Do ##class(...).ResetOrder(.myOrder) changes myOrder
```

#### Passing Objects in Collections

```objectscript
ClassMethod ProcessAll(orders As %ListOfObjects) As %Status
{
    For i = 1:1:orders.Count() {
        Set order = orders.GetAt(i)
        Set order.Status = "Processed"
    }
    Return $$$OK
}
```

#### Checking Object Type at Runtime

```objectscript
ClassMethod HandleItem(item As %RegisteredObject)
{
    If item.%IsA("Sample.Order") {
        // Order-specific logic
    } ElseIf item.%IsA("Sample.Invoice") {
        // Invoice-specific logic
    }
}
```

### Documentation References

- [Object References](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods)
- [Passing Arguments](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods_arguments)

### Visual study guide — sections 5–8

![T1.3 visual summary of sections 5–8: 5. Passes variables by reference (ByRef, .variable syntax at call site); 6. Passes multidimensional variables by reference (passing arrays); 7. Uses and overrides inherited methods (overriding, calling parent); 8. Determines when to use ##super for calling superclass methods](visual-guide-02.png)

[View all chapter diagrams](visuals.md) · [Technical review notes](../../visual-technical-notes.md)

## 5. Passes variables by reference (ByRef, .variable syntax at call site)

### Key Points

- The **dot (.)** prefix at the call site is the **only** mechanism that controls pass-by-reference — it is the caller's decision
- `ByRef` in the method signature is purely indicative (documentation) — it has no runtime effect
- Without the dot, the value is **always** passed by value, regardless of `ByRef` in the signature
- With the dot, the value is **always** passed by reference, even if the signature has no `ByRef`
- ByRef passes the existing value IN and allows a new value OUT

### Detailed Notes

#### Overview

By default, ObjectScript passes arguments by value. When a method needs to modify a variable in the caller's scope, the **caller** must pass by reference using the dot (`.`) prefix. The `ByRef` keyword in the signature is best practice for documentation but has no enforcement effect — it is purely the caller's responsibility to use the dot.

#### Basic ByRef Pattern

```objectscript
ClassMethod Swap(ByRef a As %String, ByRef b As %String)
{
    Set temp = a
    Set a = b
    Set b = temp
}
```

Calling:

```objectscript
Set x = "Hello"
Set y = "World"
Do ##class(Sample.Util).Swap(.x, .y)
Write x  // "World"
Write y  // "Hello"
```

#### Forgetting the Dot

A common mistake is forgetting the dot at the call site:

```objectscript
Set x = "Hello"
Set y = "World"
Do ##class(Sample.Util).Swap(x, y)  // NO dots - passed by value!
Write x  // Still "Hello" - unchanged
Write y  // Still "World" - unchanged
```

The method executes without error, but the caller's variables are not modified because copies were passed.

#### Output vs ByRef Revisited

With `Output`, the variable's initial value is not passed into the method:

```objectscript
ClassMethod GetInfo(Output name As %String, Output count As %Integer)
{
    Set name = "Test"
    Set count = 42
}

// Calling:
Do ##class(Sample.Util).GetInfo(.n, .c)
Write n   // "Test"
Write c   // 42
```

With `ByRef`, the existing value IS available inside the method:

```objectscript
ClassMethod AppendSuffix(ByRef text As %String, suffix As %String)
{
    Set text = text _ suffix
}

Set myText = "Hello"
Do ##class(Sample.Util).AppendSuffix(.myText, " World")
Write myText  // "Hello World"
```

#### Practical Example: Error Collection

```objectscript
ClassMethod ValidateRecord(record As Sample.Record, ByRef errors As %List) As %Boolean
{
    // errors may already contain items from prior validation
    If record.Name = "" {
        Set errors = errors _ $LB("Name is required")
    }
    If record.Age < 0 {
        Set errors = errors _ $LB("Age must be positive")
    }
    Return ($LISTLENGTH(errors) = 0)
}
```

### Documentation References

- [Passing by Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods_arguments)
- [Method Arguments](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods_arguments)

## 6. Passes multidimensional variables by reference (passing arrays)

### Key Points

- ObjectScript supports **multidimensional variables** (arrays with subscripts)
- Pass arrays by reference using the **dot (.)** prefix to share the entire tree of subscripts
- The method receives the array with all its subscripts intact
- Use **$ORDER** to iterate over subscripts
- Arrays cannot be passed by value (only the top node would be copied without subscripts)

### Detailed Notes

#### Overview

Multidimensional variables (arrays) are a fundamental data structure in ObjectScript. They store data at multiple subscript levels within a single variable name. Passing arrays to methods requires by-reference passing to include all subscript levels.

#### Multidimensional Variable Basics

```objectscript
Set colors("red") = "#FF0000"
Set colors("green") = "#00FF00"
Set colors("blue") = "#0000FF"
Set colors("blue", "light") = "#ADD8E6"
Set colors("blue", "dark") = "#00008B"
```

#### Passing Arrays to Methods

```objectscript
ClassMethod DisplayColors(ByRef colors)
{
    Set key = ""
    For {
        Set key = $ORDER(colors(key))
        Quit:key=""
        Write key, ": ", colors(key), !
    }
}
```

Calling:

```objectscript
Set colors("red") = "#FF0000"
Set colors("green") = "#00FF00"
Set colors("blue") = "#0000FF"
Do ##class(Sample.Util).DisplayColors(.colors)
```

Output:

```text
blue: #0000FF
green: #00FF00
red: #FF0000
```

#### Building Arrays Inside Methods

```objectscript
ClassMethod GetStateCounts(Output states)
{
    &sql(DECLARE C1 CURSOR FOR
         SELECT State, COUNT(*) FROM Sample.Person GROUP BY State)
    &sql(OPEN C1)
    For {
        &sql(FETCH C1 INTO :state, :cnt)
        Quit:SQLCODE'=0
        Set states(state) = cnt
    }
    &sql(CLOSE C1)
}
```

Calling:

```objectscript
Do ##class(Sample.Util).GetStateCounts(.states)
Set st = "" For {
    Set st = $ORDER(states(st)) Quit:st=""
    Write st, ": ", states(st), !
}
```

#### Multi-Level Array Passing

```objectscript
ClassMethod ProcessTree(ByRef tree, level As %Integer = 0)
{
    Set key = ""
    For {
        Set key = $ORDER(tree(key))
        Quit:key=""
        Write ?level*4, key, ": ", $GET(tree(key)), !
        // Recursively process sub-nodes
        // Note: must merge to a temp variable for recursive call
        Merge sub = tree(key)
        If $DATA(sub) > 1 {
            Do ..ProcessTree(.sub, level + 1)
        }
        Kill sub
    }
}
```

#### Using $DATA to Check Array Nodes

```objectscript
// $DATA returns:
// 0 - node doesn't exist
// 1 - node has data, no children
// 10 - node has children but no data
// 11 - node has both data and children

If $DATA(arr("key")) > 9 {
    Write "Has child subscripts", !
}
```

#### MERGE Command for Array Operations

```objectscript
// Copy an entire array
Merge targetArr = sourceArr

// Copy a subtree
Merge targetArr = sourceArr("subtree")
```

### Documentation References

- [Multidimensional Arrays](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables)
- [Passing Variables by Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods_arguments)

## 7. Uses and overrides inherited methods (overriding, calling parent)

### Key Points

- Subclasses **inherit** all methods from their superclass(es)
- A subclass can **override** an inherited method by defining a method with the same name
- The overriding method must have a **compatible signature** (same arguments and return type)
- The **Final** keyword prevents a method from being overridden in subclasses
- Overriding is the foundation of **polymorphism** in object-oriented programming

### Detailed Notes

#### Overview

Method inheritance allows subclasses to reuse parent class behavior. When a subclass needs different behavior, it overrides the inherited method with its own implementation. This is a key mechanism of object-oriented programming that enables polymorphism.

#### Basic Inheritance

```objectscript
Class Sample.Shape Extends %RegisteredObject
{
    Property Color As %String;

    Method Describe() As %String
    {
        Return "A shape of color " _ ..Color
    }

    Method Area() As %Numeric
    {
        Return 0
    }
}
```

A subclass inherits all methods automatically:

```objectscript
Class Sample.Circle Extends Sample.Shape
{
    Property Radius As %Numeric;

    /// Override Area to compute circle area
    Method Area() As %Numeric
    {
        Return $ZPI * (..Radius ** 2)
    }

    /// Override Describe
    Method Describe() As %String
    {
        Return "A circle of radius " _ ..Radius _ " and color " _ ..Color
    }
}
```

#### Polymorphic Behavior

```objectscript
ClassMethod PrintShapeInfo(shape As Sample.Shape)
{
    // Calls the appropriate version based on actual object type
    Write shape.Describe(), !
    Write "Area: ", shape.Area(), !
}

// Works with any Shape subclass
Set c = ##class(Sample.Circle).%New()
Set c.Radius = 5
Set c.Color = "Red"
Do ##class(Sample.Util).PrintShapeInfo(c)
// Output: A circle of radius 5 and color Red
// Area: 78.5398...
```

#### The Final Keyword

Marking a method as `Final` prevents subclasses from overriding it:

```objectscript
Class Sample.Base Extends %RegisteredObject
{
    /// This method cannot be overridden
    Method Validate() As %Status [ Final ]
    {
        // Validation logic that must not be changed
        Return $$$OK
    }
}
```

Attempting to override a Final method in a subclass causes a compiler error.

#### Overriding Rules

- The overriding method should have the same argument types and return type
- An instance method can only be overridden by an instance method (same for ClassMethod)
- If the parent method is Final, it cannot be overridden
- The overriding method can call the parent implementation using `##super()`

### Documentation References

- [Inheritance](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes_inheritance)
- [Method Keywords](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_method)

## 8. Determines when to use ##super for calling superclass methods

### Key Points

- **##super()** calls the superclass implementation of the current method
- Use ##super when you want to **extend** parent behavior, not replace it entirely
- Common pattern: call ##super first for initialization, then add custom logic
- ##super follows the **inheritance chain** (calls the next class in MRO)
- Critical in %OnNew(), %OnOpen(), %OnValidateObject(), and other callback methods

### Detailed Notes

#### Overview

When overriding a method, you often want to keep the parent's behavior and add to it rather than completely replacing it. The `##super()` macro calls the parent class's version of the method. This is especially important in callback methods where the parent class performs essential setup.

#### Basic ##super Usage

```objectscript
Class Sample.Employee Extends Sample.Person
{
    Property Department As %String;

    Method Describe() As %String
    {
        // Get the parent description first
        Set desc = ##super()
        // Extend it with employee-specific info
        Return desc _ " (Dept: " _ ..Department _ ")"
    }
}
```

#### ##super in Callback Methods

Callback methods like `%OnNew()`, `%OnValidateObject()`, and `%OnAfterSave()` are defined in system classes. When you override them, you should typically call `##super()` to ensure the system's behavior is preserved:

```objectscript
Class Sample.AuditedRecord Extends %Persistent
{
    Property CreatedBy As %String;
    Property CreatedDate As %Date;
    Property ModifiedDate As %Date;

    Method %OnNew(initvalue As %String) As %Status
    {
        // Call parent's %OnNew first
        Set sc = ##super(initvalue)
        If $$$ISERR(sc) Return sc

        // Add custom initialization
        Set ..CreatedBy = $USERNAME
        Set ..CreatedDate = +$HOROLOG
        Set ..ModifiedDate = +$HOROLOG
        Return $$$OK
    }

    Method %OnBeforeSave(insert As %Boolean) As %Status
    {
        Set sc = ##super(insert)
        If $$$ISERR(sc) Return sc

        // Update modified date on every save
        Set ..ModifiedDate = +$HOROLOG
        Return $$$OK
    }
}
```

#### When to Use ##super

| Scenario | Use ##super? | Reason |
| --- | --- | --- |
| Extending parent behavior | Yes | Preserve parent logic, add your own |
| Completely replacing behavior | No | Parent logic not needed |
| Callback methods (%OnNew, etc.) | Usually yes | Parent may perform essential setup |
| Abstract method override | No | Parent has no implementation |
| Multiple inheritance | Yes (carefully) | ##super follows the MRO chain |

#### ##super with Arguments

Pass the same arguments through to the parent:

```objectscript
Method Process(data As %String, options As %String = "") As %Status
{
    // Pre-processing
    Set data = $ZSTRIP(data, "<>W")

    // Call parent with the modified data
    Set sc = ##super(data, options)
    If $$$ISERR(sc) Return sc

    // Post-processing
    Do ..LogActivity("Processed: " _ data)
    Return $$$OK
}
```

#### ##super in Multiple Inheritance

With multiple inheritance, `##super()` calls the next class in the method resolution order, not necessarily the "parent" in a single-inheritance sense:

```objectscript
Class MyApp.C Extends (MyApp.A, MyApp.B)
{
    Method Init() As %Status
    {
        // Calls MyApp.A's Init (leftmost superclass)
        Return ##super()
    }
}
```

#### Common Pitfall: Forgetting ##super

Forgetting to call `##super()` in `%OnNew()` or `%OnValidateObject()` can break parent class initialization or validation. Always consider whether the parent has logic you need to preserve.

### Documentation References

- [##super](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes_inheritance)
- [Overriding Methods](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes_inheritance)

## Exam Preparation Summary

### Critical Concepts to Master:

1. Instance methods use `..` syntax; class methods cannot access instance properties
2. `..#ParameterName` works in both instance and class methods
3. Parameters are resolved at compile time and can be overridden in subclasses
4. `Output` vs `ByRef`: Output does not pass initial value in; ByRef does
5. `ByRef` and `Output` in signatures are purely indicative — the **caller's dot (.) prefix** is what actually controls pass-by-reference
6. Always use dot (.) prefix at the call site for ByRef and Output parameters
7. Objects passed to methods share the reference; modifying properties affects the original
8. Reassigning the parameter variable does not affect the caller unless ByRef is used
9. Multidimensional arrays must be passed by reference to include subscripts
10. `##super()` calls the parent implementation; essential in callback methods
11. Forgetting `##super()` in %OnNew or %OnValidateObject can break inherited behavior

### Common Exam Scenarios:

- Identifying whether a method should be Method or ClassMethod
- Predicting the output when a variable is passed with or without the dot prefix
- Determining which parameter value is used when subclass overrides a parameter
- Predicting behavior when an object is passed to a method and its properties are modified
- Deciding whether ##super() should be called in a method override

### Hands-On Practice Recommendations:

- Create a class hierarchy with instance and class methods; test `..` syntax
- Write methods with ByRef and Output parameters; test with and without the dot prefix
- Pass objects to methods and verify that property modifications are visible to the caller
- Build and iterate over multidimensional arrays passed by reference
- Override callback methods with and without ##super() and observe the differences

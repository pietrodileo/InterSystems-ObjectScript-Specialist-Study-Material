[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T5.3: Common Runtime Errors — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
A background task running using the BackgroundDev role calls:

zn "STORE-BASE"
set obj = ##class(Sample.Customer).%OpenId(123)
set obj.City = "Ulaanbaatar"
set sc = obj.%Save()

The code terminates with a <PROTECT> error:

ZN "STORE-BASE"
^
 */db/iris/mgr/STOREBASE-DATA/

Which explanation best describes why?
```

**A.** The global backing Sample.Customer resides in a database mounted read-only

**B.** The current user holds no UPDATE privilege on table Sample.Customer via SQL grants

**C.** Another process has a LOCK on the specific row, causing a lock conflict

**D.** The value "Ulaanbaatar" exceeds the defined column length

**E.** BackgroundDev does not have permission to access the database underpinning the STORE-BASE namespace

### Answer and explanation

**Correct answer: E.** BackgroundDev does not have permission to access the database underpinning the STORE-BASE namespace

The \<PROTECT\> error with the database path shown indicates a security protection violation at the database level. The BackgroundDev role lacks the required resource permission (Read/Write) on the STOREBASE-DATA database. SQL UPDATE privileges are separate from database-level resource permissions. Lock conflicts produce \<LOCKTAB\>, not \<PROTECT\>. This matches InterSystems practice question Q23. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_errors))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

```text
A class method copies order data from one global to another:

ClassMethod LoadOrders() As %Status
{
    set key = ""
    for {
        set key = $ORDER(^StgOrder(key))  quit:key=""
        set ^FinalOrder(ordKey, "Total") = ^StgOrder(key, "Total")
    }
    quit $$$OK
}

The method terminates with:
<Undefined> LoadOrders+4^Sample.Q5342.1 *ordKey

Which of the following is true about this error?
```

**A.** Line 4 uses a variable (ordKey) that was never set \-- the developer likely meant to use 'key'

**B.** Line 3 contains invalid syntax for the quit command

**C.** $ORDER sets ordKey to an empty string which cannot be used as a subscript

**D.** Line 3 improperly contains two commands on one line

### Answer and explanation

**Correct answer: A.** Line 4 uses a variable (ordKey) that was never set \-- the developer likely meant to use 'key'

The variable 'ordKey' on line 4 was never assigned a value anywhere in the method. The developer most likely meant to write 'key' (which is set by $ORDER on line 3\) instead of 'ordKey'. The \<UNDEFINED\> error with \*ordKey confirms the exact variable that is undefined. The postconditional quit:key\="" syntax on line 3 is valid ObjectScript. This matches InterSystems practice question Q24. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_errors))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
A developer runs the following code and gets a <SUBSCRIPT> error:

Set data(1) = "Alpha"
Set data(2) = "Beta"
Set data(3) = "Gamma"
Set key = ""
For {
    Set key = $Order(data(key))
    Quit:key=""
    Write data(key), !
}

Another developer modifies it to:

Set key = ""
For {
    Set key = $Order(data(key))
    Write data(key), !
    Quit:key=""
}

The modified version produces a <SUBSCRIPT> error. Why?
```

**A.** $Order does not work with local arrays, only globals

**B.** The Quit:key\="" check moved AFTER Write data(key), so when $Order returns "" at the end, data("") is accessed before the loop exits

**C.** The For loop syntax is invalid without start:step:end

**D.** data(key) requires a numeric subscript, and $Order returns strings

### Answer and explanation

**Correct answer: B.** The Quit:key\="" check moved AFTER Write data(key), so when $Order returns "" at the end, data("") is accessed before the loop exits

In the modified code, when $Order returns "" after the last node, the Write data("") executes BEFORE the Quit:key\="" check. Accessing data("") with an empty string subscript produces a \<SUBSCRIPT\> error. The original code correctly places Quit:key\="" before the Write, so the loop exits before attempting to read data(""). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_errors))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
Consider this recursive method:

ClassMethod Factorial(n As %Integer) As %Integer
{
    return n * ..Factorial(n - 1)
}

Calling ##class(App.Math).Factorial(5) produces a <FRAMESTACK> error. How should it be fixed?
```

**A.** Change 'return' to 'quit'

**B.** Add a base case: If n \<\= 1 { return 1 }

**C.** Use a larger stack size with $SYSTEM.Process.SetStackSize()

**D.** Replace recursion with: set result \= n!

### Answer and explanation

**Correct answer: B.** Add a base case: If n \<\= 1 { return 1 }

The method recurses infinitely because there is no base case to stop the recursion. When n reaches 0, it continues with -1, -2, etc., never stopping. Adding 'If n \<\= 1 { return 1 }' at the beginning provides the stopping condition that prevents infinite recursion and the resulting \<FRAMESTACK\> error. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_errors))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
What error does this code produce?

Set name = "John"
Set age = 30
Write "Name: " _ name _ ", Age: " _ agee
```

**A.** \<SYNTAX\> because of the concatenation operator

**B.** \<UNDEFINED\> \*agee because 'agee' is a typo for 'age'

**C.** \<ILLEGAL VALUE\> because you cannot concatenate strings and numbers

**D.** No error \-- 'agee' evaluates to empty string

### Answer and explanation

**Correct answer: B.** \<UNDEFINED\> \*agee because 'agee' is a typo for 'age'

The variable 'agee' (with double 'e') was never defined. ObjectScript variable names are case-sensitive and must match exactly, so 'agee' is a different variable from 'age'. This is one of the most common causes of \<UNDEFINED\> errors: simple typos in variable names. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_errors))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
A developer sees this error in production:

<UNDEFINED> zProcess+15^App.Engine.1 *config

What does this error message tell us?
```

**A.** The class App.Engine does not exist

**B.** The variable 'config' was not defined at line offset 15 in the zProcess label of App.Engine.1

**C.** The process with PID 15 crashed in App.Engine

**D.** The global ^config is not defined in the current namespace

### Answer and explanation

**Correct answer: B.** The variable 'config' was not defined at line offset 15 in the zProcess label of App.Engine.1

The error format is: \<ErrorType\> label\+offset^routine \*variablename. So \<UNDEFINED\> zProcess\+15^App.Engine.1 \*config means the variable 'config' was undefined at offset 15 from the label zProcess in the compiled routine App.Engine.1. The asterisk (\*) prefix indicates the specific undefined variable. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_errors))

## Question 7 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

Which of the following can cause a \<PROTECT\> error? (Select three)

**A.** Writing to a database that is mounted read-only

**B.** Accessing a namespace without the required role/resource permission

**C.** Trying to modify a global node that another process has locked

**D.** The user's roles lack Write permission on the database resource

**E.** Using SET on a variable that already has a value

### Answer and explanation

**Correct answer: A.** Writing to a database that is mounted read-only

**Correct answer: B.** Accessing a namespace without the required role/resource permission

**Correct answer: D.** The user's roles lack Write permission on the database resource

\<PROTECT\> errors are security-related: (1) writing to a read-only database, (2) accessing a namespace/database without the required security role, (3) the user's roles lacking Write permission on the database resource. Lock conflicts produce \<LOCKTAB\>, not \<PROTECT\>. SET on an existing variable simply overwrites it. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_errors))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

```text
A developer wants to prevent <UNDEFINED> errors when accessing a variable that might not be set. Which approach is correct?

Option A: If $Data(timeout) { Set val = timeout }
Option B: Set val = $Get(timeout, 30)
Option C: Set val = $Find(timeout)
Option D: Set val = $Length(timeout)
```

**A.** Only option A works \-- $Data checks if a variable is defined

**B.** Option B is the most direct approach \-- $Get returns the default value if undefined

**C.** Option C \-- $Find safely returns the variable's value

**D.** Both $Data and $Length work equally well

### Answer and explanation

**Correct answer: B.** Option B is the most direct approach \-- $Get returns the default value if undefined

$Get(variable, default) returns the value of the variable if defined, or the specified default if undefined, all without raising an \<UNDEFINED\> error. In option B, if 'timeout' is not defined, $Get returns 30\. While $Data (option A) also works, it requires an extra If statement. $Find and $Length would themselves cause \<UNDEFINED\> if the variable is not set. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fget))

## Question 9 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

```text
A method processes a list but crashes:

ClassMethod ProcessList(list As %List)
{
    Set total = 0
    For i = 1:1:$ListLength(list) {
        Set item = $List(list, i)
        Set total = total + item
    }
    Write "Total: ", total, !
}

Calling this method with $LB(10, 20, , 40) — note: element 3 is null/missing (double comma), not empty string — produces an error. Which error and on which iteration?
```

**A.** \<UNDEFINED\> on iteration 3 because $List returns undefined for null elements

**B.** No error — null is treated as 0 in arithmetic

**C.** \<NULL VALUE\> on iteration 3 because $List on a null list element raises this error

**D.** \<SUBSCRIPT\> on iteration 3 because the list element is null

### Answer and explanation

**Correct answer: C.** \<NULL VALUE\> on iteration 3 because $List on a null list element raises this error

In $ListBuild, a missing element (double comma: $LB(10,20,,40)) creates a null entry — distinct from an empty string "". Calling $List() on a null element raises a \<NULL VALUE\> error. This is a common trap: $LB(10,20,"",40) with an explicit empty string would NOT error ("" coerces to 0 in arithmetic), but $LB(10,20,,40) with a null element does. Use $ListGet(list, i, default) instead of $List() to safely handle null elements. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_errors))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
Consider this code:

ClassMethod BuildTree(node, depth)
{
    Set ^Tree(node) = depth
    Do ..BuildTree(node _ ".L", depth + 1)
    Do ..BuildTree(node _ ".R", depth + 1)
}

What error will occur first and why?
```

**A.** \<SUBSCRIPT\> because the node subscript eventually exceeds the maximum key length (511 bytes)

**B.** \<FRAMESTACK\> because there is no base case to stop the recursion

**C.** \<MAXSTRING\> because the node string concatenation exceeds the maximum string length

**D.** \<STORE\> because the ^Tree global fills the database

### Answer and explanation

**Correct answer: A.** \<SUBSCRIPT\> because the node subscript eventually exceeds the maximum key length (511 bytes)

Although there is no base case (which would eventually cause \<FRAMESTACK\>), the \<SUBSCRIPT\> error occurs first IN THIS CODE. Each recursive call appends 2 characters (".L" or ".R") to the node string used as a global subscript, and the maximum global reference length is 511 bytes \- reached after roughly 250 levels. The call-stack limit is thousands of frames deep, so it is nowhere near exhausted by then: \<SUBSCRIPT\> occurs after 251 entries with a 501-character key. This ordering is not a general rule about the two errors \- it follows from this code growing the subscript on every call. Unbounded recursion that does NOT build a longer global reference each time (a method that simply calls itself, say) never approaches the subscript limit and does terminate with \<FRAMESTACK\>. Whichever limit the code reaches first is the error you get. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RERR_gen))

## Question 11 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

Which of the following can cause a \<SUBSCRIPT\> error? (Select two)

**A.** Setting a global node with an empty string subscript: Set ^Data("") \= 1

**B.** Using $Order with an empty string starting value: Set key \= $Order(^Data(""))

**C.** Using a subscript that exceeds the maximum key length (511 bytes)

**D.** Using a negative number as a subscript: Set ^Data(-5) \= 1

**E.** Using a subscript longer than 31 characters

### Answer and explanation

**Correct answer: A.** Setting a global node with an empty string subscript: Set ^Data("") \= 1

**Correct answer: C.** Using a subscript that exceeds the maximum key length (511 bytes)

\<SUBSCRIPT\> means the subscript itself was invalid: an empty string subscript in a SET, or a key that pushes past the maximum length. $ORDER(^Data("")) is legal and is in fact the standard way to start an iteration, and negative numbers are perfectly valid subscripts. The 31-character figure is invented \-- the real constraint is the total key length (511 bytes), not a per-subscript character count.

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

```text
A developer tries to write to a global in the IRISSYS database:

Set ^["IRISSYS"]MyGlobal("key") = "value"

This produces a <PROTECT> error. What is the most likely reason?
```

**A.** The extended global reference syntax ^\["namespace"\]global is incorrect

**B.** IRISSYS is a system database and the application user lacks Write permission on it

**C.** Global names stored in IRISSYS must start with %

**D.** The ^\[\] syntax requires three parameters: namespace, directory, and global name

### Answer and explanation

**Correct answer: B.** IRISSYS is a system database and the application user lacks Write permission on it

The IRISSYS database contains system data and is protected. Application users typically do not have Write permission to IRISSYS \-- only users with %All or specific system administration roles can write to it. This is a database-level \<PROTECT\> error. The extended global reference syntax is correct. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_errors))

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

```text
A developer writes:

ClassMethod ProcessFile(filename As %String) As %Status
{
    Set stream = ##class(%Stream.FileCharacter).%New()
    Set sc = stream.LinkToFile(filename)
    While 'stream.AtEnd {
        Set line = stream.ReadLine()
        Set parts = $Length(line, ",")
        Set orderId = $Piece(line, ",", 1)
        Set total = total + $Piece(line, ",", 3)
    }
    Write "Grand total: ", total, !
    Quit $$$OK
}

On the first iteration, the method fails with <UNDEFINED> *total. What is the fix?
```

**A.** Declare total as a parameter: ClassMethod ProcessFile(filename, total \= 0\)

**B.** Add 'Set total \= 0' before the While loop

**C.** Change the \+ operator to \_ (concatenation) which handles undefined variables

**D.** Use 'New total' before the loop to initialize it

### Answer and explanation

**Correct answer: B.** Add 'Set total \= 0' before the While loop

The variable 'total' is used in the expression 'total \+ $Piece(line, ",", 3)' before it has been assigned any value. On the first iteration, 'total' is undefined, causing \<UNDEFINED\>. The fix is to initialize it: 'Set total \= 0' before the While loop. The 'New' command creates a new scope for a variable but does not assign it a value. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_errors))

## Question 14 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

```text
A developer writes code that processes patient records:

ClassMethod UpdatePatients() As %Status
{
    Set key = ""
    For {
        Set key = $Order(^Patient(key))
        Quit:key=""
        Set name = ^Patient(key, "Name")
        Set city = ^Patient(key, "City")
        Set ^Report(name, City) = key
    }
    Quit $$$OK
}

The method produces: <UNDEFINED> *City
Which line has the bug?
```

**A.** The $Order line \-- it should use $Order(^Patient(key), 1, data)

**B.** The 'Set ^Report(name, City)' line \-- 'City' (capital C) is a different variable than 'city' (lowercase c)

**C.** The 'Set city' line \-- ^Patient(key, "City") does not exist for some records

**D.** The For loop is missing start:step:end arguments

### Answer and explanation

**Correct answer: B.** The 'Set ^Report(name, City)' line \-- 'City' (capital C) is a different variable than 'city' (lowercase c)

ObjectScript variables are case-sensitive. The code sets 'city' (lowercase c) but references 'City' (capital C) in the ^Report subscript. These are two different variables, and 'City' was never assigned. The fix is to use consistent casing: Set ^Report(name, city) \= key. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_errors))

## Question 15 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

Which of the following runtime errors are correctly matched with their descriptions? (Select two)

**A.** \<SUBSCRIPT\> \-- an invalid subscript value was used in a global or local array reference

**B.** \<PROTECT\> \-- a memory protection fault occurred in the operating system kernel

**C.** \<FRAMESTACK\> \-- the call stack exceeded its maximum depth, usually from infinite recursion

**D.** \<UNDEFINED\> \-- a class definition could not be found in the database

**E.** \<STORE\> \-- the database ran out of disk space while writing a global

### Answer and explanation

**Correct answer: A.** \<SUBSCRIPT\> \-- an invalid subscript value was used in a global or local array reference

**Correct answer: C.** \<FRAMESTACK\> \-- the call stack exceeded its maximum depth, usually from infinite recursion

\<SUBSCRIPT\> is an invalid subscript in a global or local reference, and \<FRAMESTACK\> is the call stack exceeding its depth, usually through runaway recursion. \<PROTECT\> is a database PROTECTION error \-- access denied to a global or database \-- not an OS kernel fault, and \<UNDEFINED\> is a reference to an unset variable or global node, nothing to do with missing classes (that is \<CLASS DOES NOT EXIST\>). \<STORE\> is likewise about memory, not disk: the process exhausted its partition, which is why it is fixed by raising the process memory limit rather than by freeing disk.

## Question 16 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q16.md>)

```text
A developer debugs this code:

ClassMethod ComputeAverage(scores...) As %Numeric
{
    Set sum = 0
    For i = 1:1:scores {
        Set sum = sum + scores(i)
    }
    return sum / scores
}

Calling ##class(App.Math).ComputeAverage() with no arguments produces an error. Which error and why?
```

**A.** \<DIVIDE\> because scores is 0 (no arguments) and the final line divides by zero

**B.** \<UNDEFINED\> \*scores because the variadic array is not defined with zero arguments

**C.** \<FUNCTION\> because the ... syntax is invalid in ObjectScript

**D.** \<PARAMETER\> because at least one argument is required for variadic methods

### Answer and explanation

**Correct answer: B.** \<UNDEFINED\> \*scores because the variadic array is not defined with zero arguments

When a variadic method (scores...) is called with no arguments, the 'scores' variable is NOT set at all — it is undefined. The very first reference to 'scores' in the For loop (For i \= 1:1:scores) produces an \<UNDEFINED\> \*scores error. The variable is not automatically initialized to 0\. The fix is to check '$GET(scores, 0)' or '$DATA(scores)' before using it. When called with arguments, 'scores' is set to the argument count and scores(1), scores(2), etc. hold the values. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods))

## Question 17 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q17.md>)

```text
A developer writes a method that traverses a linked list stored in globals:

ClassMethod TraverseList(startId As %Integer)
{
    Set current = startId
    While current '= "" {
        Write ^LinkedList(current, "Value"), !
        Set current = ^LinkedList(current, "Next")
    }
}

The data has a circular reference: node 3's "Next" points back to node 1. What error occurs?
```

**A.** \<FRAMESTACK\> because of infinite recursion

**B.** No error terminates the code, but it runs in an infinite loop because the While condition is never false

**C.** \<SUBSCRIPT\> because the subscripts cycle repeatedly

**D.** \<UNDEFINED\> because ^LinkedList eventually references a non-existent node

### Answer and explanation

**Correct answer: B.** No error terminates the code, but it runs in an infinite loop because the While condition is never false

This is not recursive (no method calls itself), so \<FRAMESTACK\> does not apply. The While loop follows the "Next" pointers endlessly since the circular reference means current never becomes "". The code runs in an infinite loop. The fix is to track visited nodes or set a maximum iteration count. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_errors))

## Question 18 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q18.md>)

```text
A method receives an object reference and processes it:

ClassMethod ProcessOrder(order As App.Order) As %Status
{
    Set customerId = order.CustomerId
    Set customer = ##class(App.Customer).%OpenId(customerId)
    Set email = customer.Email
    Do ..SendConfirmation(email, order.OrderNumber)
    Quit $$$OK
}

If customerId is valid but the customer record was deleted between the time the order was created and now, which error occurs on the third line?
```

**A.** \<UNDEFINED\> \*customer because %OpenId returns "" for a deleted record

**B.** \<INVALID OREF\> because customer is "" (not an object) and .Email is called on it

**C.** \<PROTECT\> because the customer record is locked by the deletion process

**D.** \<SUBSCRIPT\> because the customer ID subscript no longer exists in the global

### Answer and explanation

**Correct answer: B.** \<INVALID OREF\> because customer is "" (not an object) and .Email is called on it

When %OpenId cannot find the record (because it was deleted), it returns an empty string "". The next line attempts customer.Email on this empty string, which is not a valid object reference, producing \<INVALID OREF\>. The safe pattern is: Set customer \= ##class(App.Customer).%OpenId(customerId) If customer \= "" { Quit $$$ERROR(...) }. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_errors))

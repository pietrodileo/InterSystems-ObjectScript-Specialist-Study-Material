[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T5.2: Runtime Error Handling — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
Your application logs the following runtime error at random:

HandleOrder+4^Sample.Service.1 *orderId

You suspect that one of several upstream helper methods is passing an empty orderId. You want to modify HandleOrder() so that whenever an error occurs, it prints the full call stack.

Which technique lets you capture and display that call-stack information?
```

**A.** Call %SYS.Trace::StartPID() inside HandleOrder() to begin tracing

**B.** Print the $ZERROR special variable inside a CATCH block

**C.** Use zwrite $METHOD to reveal which method is currently running

**D.** Invoke the $STACK function in a loop to iterate and print upstream methods

### Answer and explanation

**Correct answer: D.** Invoke the $STACK function in a loop to iterate and print upstream methods

$STACK(-1) returns the current call stack depth, and $STACK(level, "PLACE") returns the location at each level. By looping from 0 to $STACK(-1), you can print every method in the call chain that led to the error. $ZERROR only gives the most recent error string, not the full call stack. This matches InterSystems practice question Q22. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fstack))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

```text
A developer writes the following error handler:

ClassMethod ProcessBatch() As %Status
{
  TRY {
    Do ..LoadData()
    Do ..TransformData()
    Do ..SaveResults()
    Return $$$OK
  } CATCH ex {
    Write "Error: ", ex.Name, " at ", ex.Location, !
    Return ex.AsStatus()
  }
}

What does ex.AsStatus() return in the CATCH block?
```

**A.** A human-readable error message string

**B.** A %Status error value representing the caught exception

**C.** The numeric error code from the exception

**D.** A boolean indicating whether the exception was handled

### Answer and explanation

**Correct answer: B.** A %Status error value representing the caught exception

The AsStatus() method of %Exception.AbstractException converts the exception object back into a %Status error value. This allows seamless integration between exception-based error handling (TRY-CATCH) and %Status-based error handling (returning status codes to callers). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_ctrycatch))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
A developer writes:

TRY {
  Set obj = ##class(App.Order).%OpenId(999)
  Do obj.Process()
} CATCH ex {
  Write ex.Name, !
}

If ID 999 does not exist in the database, what error will be caught?
```

**A.** \<NOTFOUND\> because the ID does not exist

**B.** \<UNDEFINED\> because %OpenId returns empty string and obj has no value

**C.** \<INVALID OREF\> because obj is an empty string, not an object reference

**D.** No error \-- %OpenId returns a %Status and execution continues normally

### Answer and explanation

**Correct answer: C.** \<INVALID OREF\> because obj is an empty string, not an object reference

When %OpenId cannot find the requested ID, it returns an empty string (""). The next line attempts to call obj.Process() on an empty string rather than an object reference, producing an \<INVALID OREF\> error. The safe pattern is to check 'If obj \= ""' after %OpenId, or use the %Status output parameter: Set obj \= ##class(App.Order).%OpenId(999, , .sc). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_errors))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
Consider this code that uses $$$ThrowOnError:

ClassMethod ProcessData() As %Status
{
  TRY {
    Set sc = ..ValidateInput()
    $$$ThrowOnError(sc)
    Set sc = ..TransformData()
    $$$ThrowOnError(sc)
    Set sc = ..SaveResults()
    $$$ThrowOnError(sc)
    Return $$$OK
  } CATCH ex {
    Return ex.AsStatus()
  }
}

What does $$$ThrowOnError(sc) do?
```

**A.** Writes the error text to the current device and continues

**B.** Logs the error to ^ERRORS and continues execution

**C.** Throws a %Exception.StatusException if sc is an error status; otherwise continues

**D.** Converts sc to a string and assigns it to $ZERROR

### Answer and explanation

**Correct answer: C.** Throws a %Exception.StatusException if sc is an error status; otherwise continues

$$$ThrowOnError(sc) checks whether sc is an error %Status. If it is, it throws a %Exception.StatusException that will be caught by the surrounding TRY-CATCH block. If sc indicates success ($$$OK), execution continues to the next line. This macro bridges %Status-based and exception-based error handling patterns. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_ctrycatch))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
A method needs to display the full call stack when an error occurs:

CATCH ex {
  Write "Error: ", ex.Name, !
  For level = 0:1:$STACK(-1) {
    Write "  Level ", level, ": ", $STACK(level, "PLACE"), !
  }
}

What does $STACK(-1) return?
```

**A.** The name of the method at the bottom of the stack

**B.** The current depth (number of levels) of the call stack

**C.** The error message from the most recent error

**D.** The process ID of the current process

### Answer and explanation

**Correct answer: B.** The current depth (number of levels) of the call stack

$STACK(-1) returns the current depth of the call stack as an integer. By looping from 0 to $STACK(-1) and calling $STACK(level, "PLACE") for each level, you can print the complete chain of method calls that led to the current execution point. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fstack))

## Question 6 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

Which of the following are valid ways to throw an exception in ObjectScript? (Select two)

**A.** throw ##class(%Exception.General).%New("CustomError", 5001, , "Details")

**B.** raise ##class(%Exception.General).%New("CustomError")

**C.** $$$ThrowStatus($$$ERROR($$$GeneralError, "Something failed"))

**D.** signal "CustomError"

**E.** do $SYSTEM.Error.Throw("CustomError")

### Answer and explanation

**Correct answer: A.** throw ##class(%Exception.General).%New("CustomError", 5001, , "Details")

**Correct answer: C.** $$$ThrowStatus($$$ERROR($$$GeneralError, "Something failed"))

Exceptions are thrown with the throw command and an exception object, or with the $$$ThrowStatus macro, which wraps a %Status in a %Exception.StatusException and throws it. raise and signal are not ObjectScript commands \-- they come from other languages \-- and there is no $SYSTEM.Error.Throw() method: calling it raises \<METHOD DOES NOT EXIST\>.

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

What is the difference between %Exception.StatusException and %Exception.General?

**A.** %Exception.StatusException wraps a %Status value; %Exception.General is for arbitrary named errors

**B.** %Exception.General is the superclass; %Exception.StatusException is deprecated

**C.** %Exception.StatusException is for SQL errors only; %Exception.General is for all others

**D.** There is no difference; they are aliases for the same class

### Answer and explanation

**Correct answer: A.** %Exception.StatusException wraps a %Status value; %Exception.General is for arbitrary named errors

%Exception.StatusException wraps a %Status value, making it useful when converting from %Status-based to exception-based error handling (e.g., via $$$ThrowOnError). %Exception.General is used for creating custom exceptions with a Name, Code, and Data. Both extend %Exception.AbstractException. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_ctrycatch))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

```text
A developer has this code:

Set sc = ##class(App.Patient).%Save()
If $$$ISERR(sc) {
    Write $SYSTEM.Status.GetErrorText(sc), !
}

What does $SYSTEM.Status.GetErrorText(sc) return?
```

**A.** A %Status object with more detail about the error

**B.** A human-readable error message string

**C.** An integer error code

**D.** A %Exception.StatusException object

### Answer and explanation

**Correct answer: B.** A human-readable error message string

$SYSTEM.Status.GetErrorText() converts an encoded %Status value into a human-readable error message string. Since %Status values are internally encoded and not directly readable, this method is essential for logging and displaying error information to users or in log files. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_status))

## Question 9 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

Which of the following macros are used to check whether a %Status value indicates success or failure? (Select two)

**A.** $$$ISOK(sc)

**B.** $$$ISERR(sc)

**C.** $$$ISGOOD(sc)

**D.** $$$STATUS(sc)

**E.** $$$CHECK(sc)

### Answer and explanation

**Correct answer: A.** $$$ISOK(sc)

**Correct answer: B.** $$$ISERR(sc)

$$$ISOK(sc) returns 1 if the status indicates success, and $$$ISERR(sc) returns 1 if the status indicates an error. These are the standard macros from %occStatus.inc for testing %Status values. $$$ISGOOD, $$$STATUS, and $$$CHECK are not valid InterSystems macros. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_status))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
A developer needs to catch only specific errors and re-throw others:

TRY {
    Do ..RiskyOperation()
} CATCH ex {
    If ex.Name = "<STORE>" {
        // handle storage error
        Set sc = ..HandleStorageError(ex)
    } Else {
        // What goes here to re-throw the exception?
    }
}
```

**A.** Quit ex

**B.** throw ex

**C.** raise ex

**D.** return ex

### Answer and explanation

**Correct answer: B.** throw ex

The 'throw' command re-throws an exception object, allowing it to propagate to an outer TRY-CATCH block. This is the standard pattern for selectively catching certain exceptions while letting others propagate up the call stack. 'Quit' would exit the CATCH block, 'return' would return from the method, and 'raise' is not an ObjectScript command. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_cthrow))

## Question 11 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

A developer wants to create and throw a %Status-based exception. Which code is correct? (Select all that apply)

**A.** throw $$$ERROR($$$GeneralError, "Invalid input")

**B.** ```text
Set sc = $$$ERROR($$$GeneralError, "Invalid input")
$$$ThrowStatus(sc)
```

**C.** throw ##class(%Exception.StatusException).CreateFromStatus($$$ERROR($$$GeneralError, "Invalid input"))

**D.** ```text
Set sc = $$$ERROR($$$GeneralError, "Invalid input")
throw sc
```

**E.** do ##class(%Exception.StatusException).ThrowIfError($$$ERROR($$$GeneralError, "Invalid input"))

### Answer and explanation

**Correct answer: B.** ```text
Set sc = $$$ERROR($$$GeneralError, "Invalid input")
$$$ThrowStatus(sc)
```

**Correct answer: C.** throw ##class(%Exception.StatusException).CreateFromStatus($$$ERROR($$$GeneralError, "Invalid input"))

Both working forms go through a %Exception object: $$$ThrowStatus(sc) is the idiomatic macro, and CreateFromStatus() builds the same exception explicitly so it can be thrown. What you cannot do is throw a %Status directly \-- throw requires an object, so both options that pass sc or $$$ERROR(...) straight to throw fail. %Exception.StatusException has no ThrowIfError() method either; the macro $$$ThrowOnError(sc) is the shortcut people are reaching for there.

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

```text
What information does the Location property of a %Exception.AbstractException contain?

For example, if ex.Location returns: "ProcessOrder+7^App.OrderService.1"
```

**A.** The namespace where the error occurred

**B.** The label\+offset^routine reference where the error was thrown

**C.** The server hostname and port number

**D.** The source file path on disk

### Answer and explanation

**Correct answer: B.** The label\+offset^routine reference where the error was thrown

The Location property contains the execution location in the format label\+offset^routine. In this example, 'ProcessOrder\+7^App.OrderService.1' means the error occurred 7 lines into the ProcessOrder label of the compiled routine App.OrderService.1. This helps pinpoint exactly where the error was thrown. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_ctrycatch))

## Question 13 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

Which of the following are properties of a %Exception.AbstractException object? (Select three)

**A.** Name \-- the error name (e.g., "\<UNDEFINED\>")

**B.** Code \-- a numeric error code

**C.** Location \-- where the error occurred (e.g., label\+offset^routine)

**D.** Timestamp \-- when the error occurred

**E.** Severity \-- the error severity level (Warning, Error, Fatal)

### Answer and explanation

**Correct answer: A.** Name \-- the error name (e.g., "\<UNDEFINED\>")

**Correct answer: B.** Code \-- a numeric error code

**Correct answer: C.** Location \-- where the error occurred (e.g., label\+offset^routine)

%Exception.AbstractException provides the properties Name (error name like \<UNDEFINED\>), Code (numeric error code), Data (additional context), and Location (where the error occurred). There is no Timestamp or Severity property on the exception object. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_ctrycatch))

## Question 14 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

```text
A developer writes a method that wraps multiple %Status-returning calls:

ClassMethod ImportAll() As %Status
{
    Set sc = $$$OK
    Set sc = $$$ADDSC(sc, ..ImportCustomers())
    Set sc = $$$ADDSC(sc, ..ImportOrders())
    Set sc = $$$ADDSC(sc, ..ImportProducts())
    Quit sc
}

What does $$$ADDSC do?
```

**A.** Replaces sc with the new status, discarding the previous one

**B.** Appends the new status to sc, combining multiple errors into a single %Status

**C.** Throws an exception if the new status is an error

**D.** Logs the status to ^ERRORS and returns $$$OK

### Answer and explanation

**Correct answer: B.** Appends the new status to sc, combining multiple errors into a single %Status

$$$ADDSC (Add Status Code) appends a new %Status to an existing one, combining multiple errors into a single compound %Status value. This allows the method to attempt all three imports and report all failures together rather than stopping at the first error. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_status))

## Question 15 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

```text
Consider this error-handling pattern:

ClassMethod Save(obj As App.Record) As %Status
{
    Set sc = obj.%Save()
    If $$$ISERR(sc) {
        Do $SYSTEM.Status.DecomposeStatus(sc, .errors)
        For i=1:1:errors {
            Write "Error ", i, ": ", errors(i), !
        }
    }
    Quit sc
}

What does $SYSTEM.Status.DecomposeStatus() do?
```

**A.** Converts a %Status into a single error string

**B.** Breaks a compound %Status into an array of individual error messages

**C.** Throws an exception for each error in the status

**D.** Writes all errors directly to the current output device

### Answer and explanation

**Correct answer: B.** Breaks a compound %Status into an array of individual error messages

$SYSTEM.Status.DecomposeStatus(sc, .errors) breaks a compound %Status (which may contain multiple errors) into an array where errors contains the count and errors(1), errors(2), etc. contain individual error message strings. This is useful for detailed error reporting when multiple validations fail. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_status))

## Question 16 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q16.md>)

```text
A developer writes:

ClassMethod RunJob() As %Status
{
    TRY {
        Set sc = ..Step1()
        If $$$ISERR(sc) Return sc
        Set sc = ..Step2()
        If $$$ISERR(sc) Return sc
        Return $$$OK
    } CATCH ex {
        Return ex.AsStatus()
    }
}

What happens if Step1() returns an error %Status?
```

**A.** The CATCH block catches the error and returns ex.AsStatus()

**B.** The method returns the error %Status from Step1() \-- the CATCH block is not entered

**C.** A \<THROW\> error occurs because the status is not thrown

**D.** The method continues to Step2() because Return inside TRY is ignored

### Answer and explanation

**Correct answer: B.** The method returns the error %Status from Step1() \-- the CATCH block is not entered

The 'If $$$ISERR(sc) Return sc' pattern returns the error status directly from the method via Return. Since no exception is thrown, the CATCH block is never entered. The CATCH block only activates when an actual exception (throw or runtime error) occurs, not when a %Status error is returned via Return. Note: RETURN (not QUIT) must be used inside TRY/CATCH blocks, as QUIT with an argument inside TRY produces compile error #1043. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_ctrycatch))

## Question 17 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q17.md>)

Which of the following statements about $STACK are correct? (Select two)

**A.** $STACK(-1) returns the current call stack depth

**B.** $STACK(level, "MCODE") returns the source code line at that stack level

**C.** $STACK(level, "PLACE") returns the timestamp when that frame was entered

**D.** $STACK always returns 0 inside a CATCH block

**E.** $STACK(level, "CALLER") returns the name of the calling routine

### Answer and explanation

**Correct answer: A.** $STACK(-1) returns the current call stack depth

**Correct answer: B.** $STACK(level, "MCODE") returns the source code line at that stack level

$STACK(-1) returns the current call stack depth, and $STACK(level, "MCODE") returns the source line at that level. "PLACE" returns the LOCATION of the frame (routine and line offset), not a timestamp, and $STACK keeps working normally inside a CATCH block \-- that is precisely where it earns its keep. "CALLER" is not a valid keyword: the three accepted are "PLACE", "MCODE" and "ECODE", and anything else raises \<FUNCTION\>.

## Question 18 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q18.md>)

```text
A developer writes a generic error logger:

ClassMethod LogError(ex As %Exception.AbstractException)
{
    Set entry = $ZDT($H, 3) _ " | "
    Set entry = entry _ ex.Name _ " | "
    Set entry = entry _ ex.Code _ " | "
    Set entry = entry _ ex.Location _ " | "
    Set entry = entry _ ex.Data
    Set ^AppLog($I(^AppLog)) = entry
    // Also log the call stack
    For level = 0:1:$STACK(-1) {
        Set ^AppLog($I(^AppLog)) = "  Stack " _ level _ ": " _ $STACK(level, "PLACE")
    }
}

Which of the following correctly describes what this method stores in ^AppLog?
```

**A.** Only the exception name and location \-- Code and Data are always empty

**B.** A formatted error entry followed by each level of the call stack at the time of logging

**C.** The complete source code of the method that caused the error

**D.** A binary representation of the exception object

### Answer and explanation

**Correct answer: B.** A formatted error entry followed by each level of the call stack at the time of logging

The method first stores a formatted string containing the timestamp, exception Name, Code, Location, and Data. Then it iterates through the call stack using $STACK and stores each level's location. This provides a complete diagnostic record: what went wrong (the exception properties) and how execution arrived there (the call stack). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fstack))

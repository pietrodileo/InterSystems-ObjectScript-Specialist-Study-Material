[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T3.1: Storage Media Types — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
While reviewing an application's code, you come across the following line:

set ^||queryLog = $ZTS _ " Update Successful, Row Count " _ %ROWCOUNT

Which of the following is true about the queryLog variable?
```

**A.** queryLog is a temporary global visible to all processes and cleaned up on system restart

**B.** queryLog is a process-private global visible only to this process and cleaned up on system restart

**C.** queryLog is a temporary global visible only to this process and cleaned up when the process ends

**D.** queryLog is a process-private global visible only to this process and cleaned up when the process ends

### Answer and explanation

**Correct answer: D.** queryLog is a process-private global visible only to this process and cleaned up when the process ends

The ^\|\| prefix denotes a process-private global (PPG). PPGs are visible only to the creating process and are automatically cleaned up when the process terminates (not on system restart). Temporary globals (like ^IRIS.Temp.\*) are visible to all processes and cleaned up on restart. (Reference: InterSystems Practice Question Q9; [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables#GCOS_variables_ppg))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

```text
A batch process needs to accumulate intermediate results across multiple method calls within a single process, then discard them. The data volume is approximately 200MB. Consider the following approaches:

A) set results(key) = value
B) set ^||results(key) = value
C) set ^IRIS.Temp.results(key) = value
D) set ^results(key) = value

Which approach is most appropriate?
```

**A.** A \- local variables are always the best choice for temporary data

**B.** B \- process-private globals handle large volumes and auto-cleanup on process end

**C.** C \- temporary globals provide auto-cleanup on system restart

**D.** D \- persistent globals are the most reliable storage

### Answer and explanation

**Correct answer: B.** B \- process-private globals handle large volumes and auto-cleanup on process end

For 200MB of single-process temporary data, process-private globals (^\|\|) are ideal. Local variables (A) would consume too much process memory for 200MB. ^IRIS.Temp.\* (C) would work but is visible to other processes, creating potential naming conflicts. ^results (D) would persist indefinitely and require manual cleanup. PPGs auto-cleanup when the process ends. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables#GCOS_variables_ppg))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
Process A executes the following code:

set ^||counter = 0
for i = 1:1:1000 {
    set ^||counter = ^||counter + 1
}
write ^||counter

Process B then executes:

write ^||counter

What happens in Process B?
```

**A.** Process B writes 1000

**B.** Process B writes 0

**C.** Process B gets an \<UNDEFINED\> error because ^\|\|counter does not exist in its context

**D.** Process B writes "" (empty string)

### Answer and explanation

**Correct answer: C.** Process B gets an \<UNDEFINED\> error because ^\|\|counter does not exist in its context

Process-private globals are completely isolated per process. Process B has its own ^\|\|counter namespace, which was never set, so referencing it produces an \<UNDEFINED\> error. Even though both processes use the same name ^\|\|counter, these are entirely separate storage areas. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables#GCOS_variables_ppg))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
Consider the following code that runs in a web application where multiple CSP sessions must share progress data:

ClassMethod UpdateProgress(sessionId As %String, pct As %Integer)
{
    set ^||progress(sessionId) = pct
}

ClassMethod GetProgress(sessionId As %String) As %Integer
{
    quit $GET(^||progress(sessionId), 0)
}

A user reports that GetProgress always returns 0 even after UpdateProgress was called. What is the most likely cause?
```

**A.** The $GET default value of 0 is masking the real value

**B.** PPGs are not visible across different processes, and each CSP request may run in a different process

**C.** The sessionId parameter has a type mismatch between the two methods

**D.** PPGs cannot store integer values

### Answer and explanation

**Correct answer: B.** PPGs are not visible across different processes, and each CSP request may run in a different process

In a web application, each HTTP request may be handled by a different process from the CSP server pool. Since process-private globals (^\|\|) are only visible within the creating process, UpdateProgress and GetProgress running in different processes cannot share data via PPGs. A persistent global or temporary global (^IRIS.Temp.\*) should be used for cross-process data sharing. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables#GCOS_variables_ppg))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
A developer writes the following code to cache computed values:

set ^cache("tax", zipCode) = taxRate
set ^cache("ship", zipCode) = shipCost

After a system restart, they notice the cache data is still present. They want the cache to be automatically cleared on restart. Which change would accomplish this?
```

**A.** set ^\|\|cache("tax", zipCode) \= taxRate

**B.** set ^IRIS.Temp.cache("tax", zipCode) \= taxRate

**C.** set cache("tax", zipCode) \= taxRate

**D.** set ^%cache("tax", zipCode) \= taxRate

### Answer and explanation

**Correct answer: B.** set ^IRIS.Temp.cache("tax", zipCode) \= taxRate

Temporary globals like ^IRIS.Temp.\* are mapped to the IRISTEMP database, which is not preserved across system restarts. This is ideal for cache data that should be cleared on restart. PPGs (^\|\|) would also be cleared but are process-private, which would prevent sharing the cache across processes. Local variables (no ^) are only in memory for the current process. ^% globals are persistent system globals. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables#GCOS_variables_tempglobals))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
Consider the following method that processes a large file:

ClassMethod ProcessFile(path As %String) As %Status
{
    set stream = ##class(%Stream.FileCharacter).%New()
    do stream.LinkToFile(path)
    set lineNum = 0
    while 'stream.AtEnd {
        set line = stream.ReadLine()
        set lineNum = lineNum + 1
        set ^||parsed(lineNum) = $PIECE(line, ",", 1, 5)
    }
    // ... further processing of ^||parsed ...
    quit $$$OK
}

Which statements about ^||parsed are correct?
```

**A.** ^\|\|parsed is journaled and will survive a crash during processing

**B.** ^\|\|parsed is stored in IRISTEMP and not journaled, so data is lost on a crash

**C.** ^\|\|parsed is stored only in process memory like a local variable

**D.** ^\|\|parsed is stored in the default database of the current namespace

### Answer and explanation

**Correct answer: B.** ^\|\|parsed is stored in IRISTEMP and not journaled, so data is lost on a crash

Process-private globals are stored in the IRISTEMP database, which is not journaled. If the system crashes during processing, the ^\|\|parsed data is lost. This is acceptable for temporary processing data that can be regenerated. PPGs are not stored in process memory (that is local variables) nor in the default namespace database. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables#GCOS_variables_ppg))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

```text
Two concurrent processes need to build a shared work queue. Process A writes:

set ^IRIS.Temp.WorkQueue($INCREMENT(^IRIS.Temp.WorkQueue)) = taskA

Process B writes:

set ^IRIS.Temp.WorkQueue($INCREMENT(^IRIS.Temp.WorkQueue)) = taskB

Which statement is true about ^IRIS.Temp.WorkQueue?
```

**A.** It will cause collisions because temporary globals do not support $INCREMENT

**B.** Both processes can see and write to it, and $INCREMENT ensures atomic sequence numbers

**C.** Each process has its own copy, so the tasks will not be in the same queue

**D.** It will be journaled and recoverable after a crash

### Answer and explanation

**Correct answer: B.** Both processes can see and write to it, and $INCREMENT ensures atomic sequence numbers

Temporary globals (^IRIS.Temp.\*) are visible to all processes, unlike PPGs. $INCREMENT is atomic and works on any global, including temporary ones, so both processes can safely add to the same queue without collisions. However, temporary globals are stored in IRISTEMP and are not journaled, so the queue is lost on system restart. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables#GCOS_variables_tempglobals))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

```text
A developer examines the following code and needs to identify which variables will survive a system restart:

set localVar = "in memory"
set ^||processData = "process only"
set ^IRIS.Temp.shared = "temp shared"
set ^AppData("key") = "persistent"
set ^CacheTempWork(1) = "legacy temp"

Which variable will still contain data after a system restart?
```

**A.** localVar

**B.** ^\|\|processData

**C.** ^IRIS.Temp.shared

**D.** ^AppData("key")

**E.** ^CacheTempWork(1)

### Answer and explanation

**Correct answer: D.** ^AppData("key")

Only ^AppData("key") survives a restart because it is a persistent global stored in a journaled database. Local variables exist only in process memory. PPGs (^\|\|) are in IRISTEMP. ^IRIS.Temp.\* and ^CacheTemp\* globals are mapped to IRISTEMP. IRISTEMP is rebuilt on every restart, clearing all its contents. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables))

## Question 9 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

```text
Consider the following mirror failover scenario. Before failover, Process X on the primary member executes:

set ^PatientQueue(1) = "John Smith"
set ^||tempCalc = 42
set ^IRIS.Temp.staging(1) = "staged"

After failover to the backup member, which data is available?
```

**A.** All three variables are available on the backup member

**B.** Only ^PatientQueue(1) is available because it was journaled and replicated via mirroring

**C.** ^PatientQueue(1) and ^IRIS.Temp.staging(1) are available

**D.** None of the data is available after failover

### Answer and explanation

**Correct answer: B.** Only ^PatientQueue(1) is available because it was journaled and replicated via mirroring

Mirroring replicates journal data. Only persistent globals in mirrored databases are journaled and replicated. ^PatientQueue(1) is a persistent global that was journaled. ^\|\|tempCalc (PPG) and ^IRIS.Temp.staging (temporary global) are stored in IRISTEMP, which is not journaled and not replicated. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GHA_mirror))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
A developer writes a utility that must track execution counts across all processes in a namespace. They write:

ClassMethod RecordExecution(methodName As %String)
{
    set ^||execCount(methodName) = $GET(^||execCount(methodName), 0) + 1
}

ClassMethod GetTotalExecutions(methodName As %String) As %Integer
{
    quit $GET(^||execCount(methodName), 0)
}

The developer finds that GetTotalExecutions returns inconsistent values. What is wrong?
```

**A.** The $GET function cannot be used with PPGs

**B.** ^\|\|execCount is process-private, so each process has its own counter; a persistent or temporary global should be used instead

**C.** The $INCREMENT function must be used instead of manual addition

**D.** PPGs do not support subscripted nodes

### Answer and explanation

**Correct answer: B.** ^\|\|execCount is process-private, so each process has its own counter; a persistent or temporary global should be used instead

Since ^\|\| is a process-private global, each process maintains its own independent ^\|\|execCount. GetTotalExecutions only sees the count from the current process, not a global total. To track counts across all processes, use a persistent global with $INCREMENT for atomicity: set ^execCount(methodName) \= $INCREMENT(^execCount(methodName)). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables#GCOS_variables_ppg))

## Question 11 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

```text
Consider the following code executed in a Terminal session:

set x = 100
set ^data(1) = "saved"
set ^||temp = "processing"

The developer closes the Terminal (ending the process) and opens a new one. Which command will NOT produce an <UNDEFINED> error?
```

**A.** write x

**B.** write ^\|\|temp

**C.** write ^data(1)

**D.** All three will produce \<UNDEFINED\>

### Answer and explanation

**Correct answer: C.** write ^data(1)

When the Terminal process ends, local variable x and PPG ^\|\|temp are both destroyed. Only ^data(1), a persistent global, survives the process termination. In the new Terminal session, only write ^data(1) will return "saved" without error. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables))

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

A developer needs to store session-specific state for a long-running background job. The data must persist across method calls within the same process but should not be visible to other processes. The total data is approximately 50MB. Which code pattern is most appropriate?

**A.** set sessionState(key) \= value // local variable

**B.** set ^\|\|sessionState(key) \= value // PPG

**C.** set ^IRIS.Temp.session(jobId, key) \= value // temp global with job ID

**D.** set ^sessionState($JOB, key) \= value // persistent global with $JOB subscript

### Answer and explanation

**Correct answer: B.** set ^\|\|sessionState(key) \= value // PPG

A PPG (^\|\|) is the best fit: it is process-private (not visible to others), persists across method calls within the process, handles 50MB well (stored in IRISTEMP on disk), and auto-cleans when the process ends. Local variables might consume too much process memory for 50MB. ^IRIS.Temp.\* would work but is visible to other processes. A persistent global requires manual cleanup. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables#GCOS_variables_ppg))

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

```text
Consider this code that attempts to use a temporary global for inter-process communication:

ClassMethod Producer()
{
    for i = 1:1:100 {
        set ^CacheTempQueue(i) = "item" _ i
    }
    set ^CacheTempQueue("done") = 1
}

ClassMethod Consumer()
{
    for {
        hang 0.1
        quit:$GET(^CacheTempQueue("done"))
    }
    // process items...
}

Which statement about ^CacheTempQueue is correct?
```

**A.** ^CacheTemp\* globals are persistent and will clog up the database if not cleaned up manually

**B.** ^CacheTemp\* globals are mapped to IRISTEMP, visible to all processes, and cleared on restart

**C.** ^CacheTemp\* globals are process-private like ^\|\| globals

**D.** ^CacheTemp\* is not a recognized pattern and will be stored in the default database

### Answer and explanation

**Correct answer: B.** ^CacheTemp\* globals are mapped to IRISTEMP, visible to all processes, and cleared on restart

The ^CacheTemp\* naming pattern is a legacy convention (from Cache) recognized by InterSystems IRIS. These globals are automatically mapped to the IRISTEMP database. They are visible to all processes (making inter-process communication possible), not journaled, and cleared on system restart. The modern equivalent is ^IRIS.Temp.\*. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables#GCOS_variables_tempglobals))

## Question 14 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

```text
A developer debugging a production issue adds the following logging code:

set ^||debugLog($INCREMENT(^||debugLog)) = $ZSTRIP($ZERROR, "<>W")

After the error occurs and the process terminates abnormally, the developer tries to examine the log. What will they find?
```

**A.** The ^\|\|debugLog data is available and contains the error information

**B.** The ^\|\|debugLog data was lost because PPGs are destroyed when the process ends, even abnormally

**C.** The ^\|\|debugLog data is corrupted because the process terminated abnormally

**D.** The ^\|\|debugLog data was written to the journal and can be recovered

### Answer and explanation

**Correct answer: B.** The ^\|\|debugLog data was lost because PPGs are destroyed when the process ends, even abnormally

When a process terminates (normally or abnormally), all its process-private globals are automatically cleaned up. The developer will find no data in ^\|\|debugLog. For persistent debug logging that survives process termination, use a persistent global like ^debugLog($JOB, ...) instead. PPGs are never journaled, so journal recovery is also not an option. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables#GCOS_variables_ppg))

## Question 15 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

```text
Consider the following storage comparison table:

| Feature          | Local Var | PPG (^\|\|) | Temp Global (^IRIS.Temp.*) | Persistent Global |
|------------------|-----------|-----------|----------------------------|-------------------|
| Stored in        | Memory    | IRISTEMP   | IRISTEMP                    | Database          |
| Visible to       | Process   | Process   | All processes              | All processes     |
| Survives restart | No        | No        | No                         | ?                 |
| Journaled        | No        | No        | No                         | ?                 |

Which of the following correctly complete the two missing cells (?) for persistent globals? (Select all that apply)
```

**A.** Persistent globals always survive a restart

**B.** Persistent globals survive a restart if stored in a durable database

**C.** Persistent globals are always journaled

**D.** Persistent globals are journaled if the database has journaling enabled

**E.** Persistent globals are journaled only during transactions

### Answer and explanation

**Correct answer: B.** Persistent globals survive a restart if stored in a durable database

**Correct answer: D.** Persistent globals are journaled if the database has journaling enabled

Persistent globals survive restarts when stored in a durable database (the typical case). They are journaled only if the database they reside in has journaling enabled \- some databases may have journaling disabled for performance reasons. It is not true that they are always journaled (e.g., a non-journaled database) or only journaled during transactions. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCDI_journal))

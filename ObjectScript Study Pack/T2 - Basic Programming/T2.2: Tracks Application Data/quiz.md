[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T2.2: Tracks Application Data — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
While reviewing an application's code, you come across the following line:

set ^||queryLog = $ZTS_" Update Successful, Row Count "_%ROWCOUNT

Which of the following is true about the queryLog variable?
```

**A.** queryLog is a temporary global. It is only visible to the process that instantiates it and it gets cleaned up when the IRIS instance is restarted.

**B.** queryLog is a process private global. It is only visible to the process that instantiates it and it gets cleaned up when the IRIS instance is restarted.

**C.** queryLog is a temporary global. It is only visible to the process that instantiates it and it gets cleaned up when the process ends.

**D.** queryLog is a process private global. It is only visible to the process that instantiates it and it gets cleaned up when the process ends.

### Answer and explanation

**Correct answer: D.** queryLog is a process private global. It is only visible to the process that instantiates it and it gets cleaned up when the process ends.

The ^\|\| prefix designates a process-private global (PPG). ^\|\|queryLog is visible only to the process that created it, cannot be accessed by other processes, and is automatically deleted when the owning process terminates (not when the IRIS instance restarts). PPGs are ideal for temporary working data that should not leak between processes. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_globals#GCOS_globals_ppg))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

```text
A developer needs to determine the physical location of data stored for a %Persistent class. The class uses the following storage definition:

Storage Default
{
<DataLocation>^EW3K.DuIo.1</DataLocation>
<IdLocation>^EW3K.DuIo.1</IdLocation>
<IndexLocation>^EW3K.DuIo.I</IndexLocation>
}

Which of the following is true about determining the physical file location?
```

**A.** The data global needs to be identified from the class storage definitions and its identity used in a call to %SYS.Namespace::GetGlobalDest()

**B.** The data global needs to be identified from the class name and its identity used in a call to %SYS.Namespace::GetNSInfo()

**C.** All data is written to the namespace's default global database and is in the same location as the database's physical file

**D.** Querying the Description column in INFORMATION\_SCHEMA.TABLES using the class name returns the location at the OS level

### Answer and explanation

**Correct answer: A.** The data global needs to be identified from the class storage definitions and its identity used in a call to %SYS.Namespace::GetGlobalDest()

To determine the physical location of persistent class data, you must first identify the data global from the class storage definitions (in this case ^EW3K.DuIo.1), then use %SYS.Namespace::GetGlobalDest() to find which database that global maps to and where it resides physically. The global may be mapped to a different database than the namespace default. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_defpersobj))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
Given the following global structure:

^Patient(1) = "Smith"
^Patient(1,"DOB") = "1990-01-15"
^Patient(1,"Phone",1) = "555-0100"
^Patient(1,"Phone",2) = "555-0200"

What is the result of executing:

WRITE $DATA(^Patient(1,"Phone"))
```

**A.** 0 \- the node does not exist

**B.** 1 \- the node exists and has data

**C.** 10 \- the node has descendants but no data at this level

**D.** 11 \- the node has both data and descendants

### Answer and explanation

**Correct answer: C.** 10 \- the node has descendants but no data at this level

$DATA returns information about whether a node exists, has data, and/or has descendants. A return value of 10 means the node has descendant nodes (subscripts below it) but no value at that exact level. ^Patient(1,"Phone") has no direct value, but it has children at subscripts 1 and 2\. Values: 0\=doesn't exist, 1\=has data only, 10\=has descendants only, 11\=has both. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fdata))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
A developer writes the following code to log debug messages:

SET ^Debug($INCREMENT(^Debug)) = $HOROLOG_" - "_message

Another developer suggests using this approach instead:

SET ^Debug($RANDOM(1000)) = message

What is the key advantage of the $INCREMENT approach?
```

**A.** $INCREMENT is faster than $RANDOM for generating keys

**B.** $INCREMENT generates unique, sequential integer subscripts, preventing overwrites; $RANDOM can produce duplicates that overwrite earlier entries

**C.** $INCREMENT automatically adds timestamps while $RANDOM does not

**D.** $INCREMENT creates a process-private global while $RANDOM creates a regular global

### Answer and explanation

**Correct answer: B.** $INCREMENT generates unique, sequential integer subscripts, preventing overwrites; $RANDOM can produce duplicates that overwrite earlier entries

$INCREMENT(^Debug) atomically increments the top-level value of ^Debug and returns the new value, guaranteeing a unique sequential subscript for each log entry. $RANDOM(1000) generates a random number between 0 and 999, which can produce duplicates that silently overwrite earlier log entries. The timestamp ($HOROLOG) is added explicitly in the value, not by $INCREMENT. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fincrement))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
A production support engineer needs to enable diagnostic logging for troubleshooting a web service integration. They execute:

SET ^%ISCLOG = 3

What effect does this have?
```

**A.** Enables SQL query logging at maximum verbosity

**B.** Enables the built-in diagnostic logging facility at the most verbose level, recording all diagnostic events with timestamps

**C.** Creates a log file at /var/log/iris/isclog.txt with level 3 detail

**D.** Enables user authentication logging for the next 3 hours

### Answer and explanation

**Correct answer: B.** Enables the built-in diagnostic logging facility at the most verbose level, recording all diagnostic events with timestamps

^%ISCLOG is a built-in diagnostic logging global used by InterSystems components (Interoperability productions, web services, etc.). Level 3 is the most verbose: 0\=disabled, 1\=errors only, 2\=warnings and errors, 3\=all messages. Remember to set it back to 0 after troubleshooting, as verbose logging impacts performance and consumes disk space. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCM_perfmon))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
A developer writes a method that stores temporary calculation results:

ClassMethod CalculateReport(patientId As %Integer)
{
  SET ^||calc("sum") = 0
  SET ^||calc("count") = 0
  SET key = ""
  FOR {
    SET key = $ORDER(^Visits(patientId, key), 1, data)
    QUIT:key=""
    SET ^||calc("sum") = ^||calc("sum") + $PIECE(data, "|", 3)
    SET ^||calc("count") = ^||calc("count") + 1
  }
  ; ... use results ...
}

Why does the developer use ^||calc instead of ^calc?
```

**A.** ^\|\|calc is faster because it is stored in memory only, never on disk

**B.** ^\|\|calc is isolated to the current process and automatically cleaned up when the process ends, preventing data collisions with other processes running the same method

**C.** ^\|\|calc allows the data to persist across process restarts for later review

**D.** ^\|\|calc is automatically encrypted, protecting the calculation data

### Answer and explanation

**Correct answer: B.** ^\|\|calc is isolated to the current process and automatically cleaned up when the process ends, preventing data collisions with other processes running the same method

Process-private globals (^\|\|) are visible only to the creating process. If multiple processes run CalculateReport concurrently, each has its own isolated ^\|\|calc. With a regular global ^calc, concurrent processes would overwrite each other's data. PPGs are also automatically cleaned up when the process ends. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_globals#GCOS_globals_ppg))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

```text
A developer wants to iterate through all top-level subscripts of a global and print each value. They write:

SET key = ""
FOR {
  SET key = $ORDER(^Log(key))
  QUIT:key=""
  WRITE key, ": ", ^Log(key), !
}

The global contains:
^Log(1) = "Started"
^Log(2) = "Processing"
^Log(10) = "Complete"

In what order are the entries printed?
```

**A.** 1, 10, 2 (alphabetical order of string keys)

**B.** 1, 2, 10 (numeric/canonical order)

**C.** 10, 2, 1 (reverse order)

**D.** The order is unpredictable and depends on storage layout

### Answer and explanation

**Correct answer: B.** 1, 2, 10 (numeric/canonical order)

$ORDER traverses subscripts in canonical (collation) order. For numeric subscripts, this is numeric order: 1, 2, 10\. Canonical order sorts numbers before strings, and numbers are sorted by numeric value (not lexicographically). This is why 10 comes after 2, not between 1 and 2\. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_forder))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

```text
A developer needs to display the contents of a complex local variable for debugging:

SET data = "test"
SET data("A") = 1
SET data("B",1) = "hello"
SET data("B",2) = "world"

Which command shows ALL values including subscripted nodes?
```

**A.** WRITE data

**B.** ZWRITE data

**C.** DISPLAY data

**D.** WRITE $DATA(data)

### Answer and explanation

**Correct answer: B.** ZWRITE data

ZWRITE displays a variable and all of its subscripts with their values in a structured, human-readable format. WRITE data would only output "test" (the top-level value). ZWRITE shows: data\="test", data("A")\=1, data("B",1)\="hello", data("B",2)\="world". There is no DISPLAY command in ObjectScript. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_czwrite))

## Question 9 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

```text
A developer writes the following code:

SET x = $LISTBUILD("Alpha","Beta","Gamma")
ZWRITE x

What output is displayed?
```

**A.** Alpha Beta Gamma

**B.** x\=$LB("Alpha","Beta","Gamma")

**C.** ("Alpha","Beta","Gamma")

**D.** x\=AlphaBetaGamma

### Answer and explanation

**Correct answer: B.** x\=$LB("Alpha","Beta","Gamma")

ZWRITE displays $LIST values in $LB() notation, showing the internal list representation. This is one of ZWRITE's key debugging benefits: it reveals the actual data type and structure of variables, including $LIST-encoded data that would be unreadable with a simple WRITE command (WRITE would show garbled binary data for $LIST values). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_czwrite))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
A developer wants to measure the execution time of a critical section of code:

SET start = $ZHOROLOG
; ... critical code section ...
SET elapsed = $ZHOROLOG - start
WRITE "Elapsed: ", elapsed, " seconds", !

Why is $ZHOROLOG preferred over $HOROLOG for this purpose?
```

**A.** $ZHOROLOG returns the time in milliseconds while $HOROLOG returns seconds

**B.** $ZHOROLOG provides high-resolution timestamps (including fractional seconds) suitable for precise profiling, while $HOROLOG only has whole-second precision

**C.** $ZHOROLOG is not affected by timezone changes while $HOROLOG is

**D.** $ZHOROLOG automatically logs the measurement to ^PERFMON while $HOROLOG does not

### Answer and explanation

**Correct answer: B.** $ZHOROLOG provides high-resolution timestamps (including fractional seconds) suitable for precise profiling, while $HOROLOG only has whole-second precision

$ZHOROLOG provides a high-resolution timestamp with fractional seconds, making it suitable for measuring elapsed time of code sections that may complete in sub-second intervals. $HOROLOG's second component has only whole-second precision, which is insufficient for profiling fast code. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_vzhorolog))

## Question 11 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

A developer needs to inspect the contents of a global from the IRIS Terminal. Which of the following are valid approaches?

**A.** ZWRITE ^MyGlobal to display the entire global with all subscripts and values

**B.** DO $SYSTEM.OBJ.ShowGlobal("MyGlobal") to display a formatted view

**C.** Using the Globals page in the Management Portal to browse the global visually

**D.** Using $ORDER(^MyGlobal("")) in a loop to iterate through top-level subscripts

**E.** SELECT \* FROM %Global.MyGlobal to query the global via SQL

### Answer and explanation

**Correct answer: A.** ZWRITE ^MyGlobal to display the entire global with all subscripts and values

**Correct answer: D.** Using $ORDER(^MyGlobal("")) in a loop to iterate through top-level subscripts

The question asks specifically about inspecting a global from the IRIS Terminal, so only the Terminal-based approaches count: ZWRITE ^MyGlobal displays the whole global, and $ORDER can walk the subscripts programmatically. The Management Portal's Globals page is a valid way to browse a global, but it is not the Terminal, so it does not answer this question. There is no $SYSTEM.OBJ.ShowGlobal method, and a global is not queryable with SELECT \* FROM %Global.MyGlobal. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_czwrite))

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

```text
A developer creates a custom error logging global:

ClassMethod LogError(method As %String, msg As %String)
{
  SET id = $INCREMENT(^AppErrors)
  SET ^AppErrors(id) = $LISTBUILD($ZDATETIME($HOROLOG,3), method, msg, $USERNAME)
}

Later, they need to find all errors from today. Which approach correctly iterates and filters the log?
```

**A.** ZWRITE ^AppErrors WHERE $LISTGET(^AppErrors,1) \= today

**B.** A $ORDER loop that checks $LISTGET(^AppErrors(key),1) against today's date for each entry

**C.** SELECT \* FROM ^AppErrors WHERE timestamp \= today

**D.** $QUERY(^AppErrors) with a filter callback function

### Answer and explanation

**Correct answer: B.** A $ORDER loop that checks $LISTGET(^AppErrors(key),1) against today's date for each entry

There is no WHERE clause for ZWRITE, no SQL access to globals with that syntax, and no filter callbacks for $QUERY. The correct approach is to iterate through the global using $ORDER, retrieving each node and using $LISTGET to extract the timestamp (position 1\) for comparison against today's date. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_forder))

## Question 13 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

You want to monitor how many global references a specific process is making during a performance investigation. Which of the following are valid approaches?

**A.** Check ^%SYS("GlobalRefs") filtered by the process ID

**B.** Use the Processes page in the Management Portal, which shows global references for each process

**C.** Run SELECT GlobalReferences FROM %SYS.ProcessQuery WHERE PID \= :pid via the SQL Shell or Dynamic SQL

**D.** Global references cannot be monitored at the individual process level

**E.** Call $SYSTEM.Process.GlobalRefs() with the target process ID

### Answer and explanation

**Correct answer: B.** Use the Processes page in the Management Portal, which shows global references for each process

**Correct answer: C.** Run SELECT GlobalReferences FROM %SYS.ProcessQuery WHERE PID \= :pid via the SQL Shell or Dynamic SQL

Two approaches work: System Operation \> Processes in the Management Portal shows global references per process in real time, and %SYS.ProcessQuery exposes the same counter to SQL, so SELECT GlobalReferences FROM %SYS.ProcessQuery WHERE PID \= :pid works from the SQL Shell or Dynamic SQL. ^%SYS("GlobalRefs") is not a real structure, there is no $SYSTEM.Process.GlobalRefs() method (calling it raises \<METHOD DOES NOT EXIST\>), and per-process global references are very much measurable, which rules the last option out.

## Question 14 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

A performance analyst wants to identify where time is being spent in a slow method. Which of the following are valid profiling approaches?

**A.** Use $ZHOROLOG to capture high-resolution timestamps before and after code sections

**B.** Use ^%SYS.MONLBL to enable line-by-line monitoring of routine execution

**C.** Check the ^ERRORS global which automatically tracks execution times for all methods

**D.** Use the Management Portal SQL Performance page if the slow code involves SQL queries

**E.** Run the method with the /PERFORMANCE flag to enable automatic profiling

### Answer and explanation

**Correct answer: A.** Use $ZHOROLOG to capture high-resolution timestamps before and after code sections

**Correct answer: B.** Use ^%SYS.MONLBL to enable line-by-line monitoring of routine execution

**Correct answer: D.** Use the Management Portal SQL Performance page if the slow code involves SQL queries

$ZHOROLOG provides high-resolution timestamps for manual profiling of code sections. ^%SYS.MONLBL (Monitor by Line) provides line-by-line execution metrics for routines. The Management Portal's SQL Performance tools help analyze slow SQL queries. There is no ^ERRORS global for performance data and no /PERFORMANCE flag for methods. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_vzhorolog))

## Question 15 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

A developer needs to collect system-level performance metrics including global references per second and disk read/write rates. Which utility should they use?

**A.** ^%ISCLOG with level 3 for verbose performance data

**B.** ^PERFMON to collect and display system performance counters

**C.** $SYSTEM.Process.GetMetrics() for system-wide statistics

**D.** The ^ERRORS global which records performance baselines

### Answer and explanation

**Correct answer: B.** ^PERFMON to collect and display system performance counters

^PERFMON (Performance Monitor) collects system-level performance counters including global references per second, routine commands per second, disk reads/writes, journal writes, and other metrics. ^%ISCLOG is for diagnostic event logging, not performance metrics. There is no GetMetrics method or ^ERRORS performance global. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCM_perfmon))

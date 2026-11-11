[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T5.1: Troubleshooting Tools — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
Consider the following class:

Class Sample.Person Extends %RegisteredObject
{
ClassMethod ProcessAddress(Address As %String)
{
    #Include Sample.AreaCodes
    set code = $$$FindAreaCode($P(Address, " "))
    set phoneNumber = code _ " " _ $P(Address, " ", 6)
}
}

In the past, the class compiled successfully. However, after a recent edit you receive:

ERROR: Sample.Person.cls
ERROR:  Sample.Person.1(5) : MPP5610 : Referenced macro not defined: 'FindAreaCode'
 TEXT:   set code = $$$FindAreaCode($P(Address, " "))
ERROR: Sample.Person.cls(ProcessAddress+3) #1002: Invalid character in tag

Which of the following is the most likely source of the error?
```

**A.** The new code has a syntax error in the $Piece call

**B.** The FindAreaCode macro was removed by an IRIS system update

**C.** The new code modified the Address string so the macro rejects it

**D.** There is no include file \-- #Include inside a method body is not recognized at class level

### Answer and explanation

**Correct answer: D.** There is no include file \-- #Include inside a method body is not recognized at class level

When #Include is placed inside a method body rather than at the class level (before the Class keyword or at the top of the class block), the preprocessor cannot locate the include file during compilation. The MPP5610 error 'Referenced macro not defined' indicates the preprocessor never loaded the macro definitions. Moving '#Include Sample.AreaCodes' to the class level fixes the issue. This matches InterSystems practice question Q21. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_macros))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

```text
A developer compiles a class and receives the following error:

ERROR #5475: Error compiling class 'App.Processor'
ERROR:  App.Processor.1(8) : MPP5610 : Referenced macro not defined: 'LogError'

The class definition is:

Include AppMacros
Class App.Processor Extends %RegisteredObject
{
ClassMethod Run()
{
    $$$LogError("Starting process")
}
}

The file AppMacros.inc exists and defines $$$LogInfo but NOT $$$LogError. What is the most likely cause?
```

**A.** The Include directive must use parentheses: Include(AppMacros)

**B.** The AppMacros.inc file does not define the LogError macro

**C.** The Include directive must use the #Include preprocessor syntax instead of the class keyword

**D.** The Include must be placed inside the class definition block

### Answer and explanation

**Correct answer: B.** The AppMacros.inc file does not define the LogError macro

The MPP5610 error means the preprocessor found the include file but could not locate the specific macro 'LogError' within it. Since AppMacros.inc defines LogInfo but not LogError, the macro is simply missing from the include file. The developer needs to add a #Define LogError directive to AppMacros.inc. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_macros))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
A developer wants to measure the execution time of a data transformation. They write:

Set start = $ZH
Do ##class(App.Transform).Run(data)
Set elapsed = $ZH - start
Write "Elapsed: ", elapsed, " seconds",!

What will the elapsed variable contain?
```

**A.** An integer number of whole seconds

**B.** A fractional number of seconds with high (sub-second) precision

**C.** A string in the format "HH:MM:SS"

**D.** The value will be negative because $ZH values cannot be subtracted

### Answer and explanation

**Correct answer: B.** A fractional number of seconds with high (sub-second) precision

$ZH ($ZHOROLOG) returns a high-resolution timestamp in seconds with fractional precision (e.g., 1234567.045823). Subtracting two $ZH values yields the elapsed time as a decimal number of seconds, making it ideal for benchmarking code blocks. Unlike $HOROLOG (which uses date,seconds format) or $ZTIMESTAMP (UTC date format), $ZH can be directly subtracted. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_vzhorolog))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
A developer benchmarks two approaches for processing 100,000 records:

Set start = $HOROLOG
For i=1:1:100000 { Do ##class(App.Record).Process(i) }
Set elapsed = $HOROLOG - start
Write "Elapsed: ", elapsed

The output shows: Elapsed: 66818. Why is this value unexpected?
```

**A.** $HOROLOG is in date,seconds format and cannot be subtracted directly to get meaningful elapsed time

**B.** $HOROLOG only measures CPU time, not wall-clock time

**C.** $HOROLOG returns time in milliseconds, so the result needs to be divided by 1000

**D.** $HOROLOG is always 0 inside a loop

### Answer and explanation

**Correct answer: A.** $HOROLOG is in date,seconds format and cannot be subtracted directly to get meaningful elapsed time

$HOROLOG returns a value in the format 'days,seconds' (e.g., '66818,45123'). When ObjectScript subtracts two such values, it treats them as numbers, truncating at the comma. The result is meaningless for timing purposes. The developer should use $ZH instead, which returns a single numeric value in seconds with fractional precision. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_vhorolog))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

Which of the following is a valid way to start the ^PERFMON performance monitoring utility (must be run from the %SYS namespace)?

**A.** Do ^PERFMON from a Terminal session in %SYS

**B.** Navigate to System Operation \> System Dashboard in the Management Portal

**C.** Call $SYSTEM.Performance.Start() from any method

**D.** Run ##class(%SYS.PTools).Start() from a Terminal

### Answer and explanation

**Correct answer: A.** Do ^PERFMON from a Terminal session in %SYS

^PERFMON (no leading %) is a Terminal-based utility that ships with IRIS and lives in the %SYS namespace. It is started by switching to %SYS and typing \`Do ^PERFMON\`. The Management Portal's System Dashboard displays system metrics but is a separate tool — it does not start or interact with ^PERFMON directly. $SYSTEM.Performance.Start() and %SYS.PTools.Start() are not valid entry points. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCM_perfmon))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
A developer compiles a class and receives:

ERROR #5373: Property 'PatientName' in 'App.Record' is not a valid type

The property is defined as:

Property PatientName As %Strig;

What is the problem?
```

**A.** PatientName is a reserved word in ObjectScript

**B.** The data type %Strig is misspelled \-- it should be %String

**C.** Properties cannot reference types from the % package

**D.** The As keyword must be lowercase

### Answer and explanation

**Correct answer: B.** The data type %Strig is misspelled \-- it should be %String

The type name '%Strig' is a typo for '%String'. The compiler reports 'not a valid type' because it cannot find a class named %Strig. This is a common compilation error caused by misspelling data type names in property definitions. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_properties))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

```text
A developer compiles several classes and one fails with:

ERROR #5501: Superclass 'App.Base.Record' does not exist

The App.Base.Record source file is present. What should the developer do?
```

**A.** Delete and recreate the App.Base.Record class from scratch

**B.** Compile App.Base.Record first, then recompile the dependent subclass

**C.** Add the Deployed keyword to App.Base.Record

**D.** Move App.Base.Record into the same package as the subclass

### Answer and explanation

**Correct answer: B.** Compile App.Base.Record first, then recompile the dependent subclass

When a superclass has not yet been compiled, subclasses that depend on it fail with 'does not exist' errors. The solution is to compile in dependency order \-- superclasses first. Using the /orderby\=d qualifier or compiling with the 'dependencies' option automates this. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes_compile))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

What does the %SYS.PTools SQL Performance Tools class help diagnose?

**A.** Network latency between IRIS instances

**B.** SQL query performance including execution plans and runtime statistics

**C.** Memory allocation for ObjectScript routines

**D.** Journal file write throughput

### Answer and explanation

**Correct answer: B.** SQL query performance including execution plans and runtime statistics

%SYS.PTools provides SQL performance analysis, including examining query execution plans, collecting runtime statistics, and identifying slow-running queries. It is specifically designed for SQL performance troubleshooting. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_queries))

## Question 9 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

```text
Consider the following snippet of SQL performance metrics:

Average SQL Execution Time  0.018s
P50 SQL Execution Time      0.014s
P90 SQL Execution Time      0.061s
P99 SQL Execution Time      1.042s

Which of the following best explains why the P99 value is orders of magnitude higher than the rest?
```

**A.** The SQL query gathers table statistics on every execution

**B.** P99 queries use embedded SQL while others use dynamic SQL

**C.** The query cache is occasionally purged, so a small subset of queries run uncached and must be recompiled

**D.** The query optimizer randomly picks different plans 1% of the time

### Answer and explanation

**Correct answer: C.** The query cache is occasionally purged, so a small subset of queries run uncached and must be recompiled

When the query cache is purged, the next execution must recompile the query plan, which takes significantly longer than executing a cached plan. This accounts for the occasional spike at the P99 level while most executions (P50, P90) run quickly from cache. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_queries))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
A developer writes the following class method and compiles it successfully:

ClassMethod Calculate(x As %Integer, y As %Integer) As %Integer
{
  Return x + y
}

Which of the following statements about the Return keyword is TRUE?
```

**A.** Return is case-insensitive in ObjectScript; Return, return, and RETURN all compile and execute identically

**B.** Return only compiles in lowercase; Return and RETURN produce compilation errors

**C.** Return must be replaced with Quit; Return is not a valid ObjectScript keyword

**D.** Return is only valid inside methods of classes that extend %RegisteredObject

### Answer and explanation

**Correct answer: A.** Return is case-insensitive in ObjectScript; Return, return, and RETURN all compile and execute identically

ObjectScript commands are case-insensitive — \`Return\`, \`return\`, and \`RETURN\` all compile and execute identically, as do \`Quit\`/\`quit\`/\`QUIT\`. \`Return expr\` is the modern idiom for returning a value from a method; \`Quit expr\` is the traditional equivalent and remains valid. Neither is restricted to a particular base class. Verified on IRIS 2025.1 (all three case variants loaded and executed as part of the test for this fix). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_creturn))

## Question 11 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

A developer needs to compile a set of interdependent classes where superclasses must compile before subclasses. Which approach ensures classes compile in the correct dependency order?

**A.** Compile classes in alphabetical order using $SYSTEM.OBJ.CompileAll()

**B.** Use the 'r' (recursive) flag, e.g., $SYSTEM.OBJ.CompileList(classList, "ckr"), which compiles all dependency predecessors before the listed classes

**C.** Manually list classes in the correct order and compile them one by one

**D.** Use the /sort\=dependency qualifier to reorder the compile list

### Answer and explanation

**Correct answer: B.** Use the 'r' (recursive) flag, e.g., $SYSTEM.OBJ.CompileList(classList, "ckr"), which compiles all dependency predecessors before the listed classes

The 'r' (Recursive) flag instructs the compiler to compile all classes that are dependency predecessors before compiling the listed classes — ensuring superclasses, include files, and other referenced classes are built first. Verified via \`do ##class(%SYSTEM.OBJ).ShowFlags()\` on IRIS 2025.1: 'r \- Recursive. Compile all the classes that are dependency predecessors.' (Note: 'd' is the Display flag, NOT Dependencies; 'b' includes subclasses; 'y' includes SQL-related classes.) CompileAll() does not guarantee a specific order, manual ordering is error-prone, and /sort\=dependency is not a valid qualifier. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes_compile))

## Question 12 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

A class compilation fails with multiple MPP (Macro Pre-Processor) errors. Which of the following could cause MPP errors? (Select two)

**A.** Referencing an undefined macro with $$$MacroName in the code

**B.** Having too many properties defined in the class

**C.** A syntax error inside an #If preprocessor directive

**D.** Defining a method with more than 10 arguments

**E.** Including an .inc file that exists but defines no macros

### Answer and explanation

**Correct answer: A.** Referencing an undefined macro with $$$MacroName in the code

**Correct answer: C.** A syntax error inside an #If preprocessor directive

MPP errors come from the preprocessing phase, before the compiler proper: referencing a macro that was never defined ($$$MacroName with no #Define, MPP5610), or a syntax error inside a preprocessor directive such as #If. The property count and argument count are compiler-level concerns and neither is an MPP error. Including an .inc file that happens to define no macros is not an error at all \-- an empty include is legal, and it simply contributes nothing.

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

```text
A developer has an include file AppMacros.inc:

#Define LogMsg(%msg) Write "[LOG] " _ %msg, !
#Define AppVersion "2.5"

And a class:

Include AppMacros
Class App.Main Extends %RegisteredObject
{
ClassMethod Run()
{
    $$$LogMsg("Starting version " _ $$$AppVersion)
    // ...
}
}

Compilation succeeds but at runtime the output shows:
[LOG] Starting version 2.5

The developer now adds a new method that uses $$$DbName, but has not defined it in AppMacros.inc:

ClassMethod Info()
{
    Write "Database: ", $$$DbName, !
}

What happens when the class is compiled?
```

**A.** Compilation succeeds; $$$DbName evaluates to empty string at runtime

**B.** Compilation fails with MPP5610: Referenced macro not defined: 'DbName'

**C.** Compilation succeeds but throws \<UNDEFINED\> at runtime

**D.** Compilation fails with ERROR #5501: Superclass does not exist

### Answer and explanation

**Correct answer: B.** Compilation fails with MPP5610: Referenced macro not defined: 'DbName'

Macros are resolved at compile time by the Macro Pre-Processor (MPP). If a macro referenced with $$$ is not defined in any included file, the compiler raises MPP5610. Unlike variables, macros do not silently evaluate to empty \-- they must be explicitly defined. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_macros))

## Question 14 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

```text
A system administrator notices high response times. In the Management Portal under System Operation > System Dashboard, they observe:

Global References/sec: 2,450,000
Routine Commands/sec:    180,000
Cache Efficiency:           150

Which metric most directly suggests the system is experiencing excessive disk I/O?
```

**A.** The high global references/sec value

**B.** The low routine commands/sec value

**C.** The low cache efficiency of 150, indicating many global references require disk reads

**D.** None of these metrics relate to disk I/O

### Answer and explanation

**Correct answer: C.** The low cache efficiency of 150, indicating many global references require disk reads

Cache Efficiency is a ratio (not a percentage) representing how many global references are served from the database cache per physical disk read. The higher the value, the better. Values above 1000 are considered healthy. A value of 150 means on average only 150 global references are served from cache per disk read, which is well below the healthy threshold. With 2.45 million refs/sec, that means roughly 16,300 disk reads/sec \-- a significant I/O load. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCM_dashboard))

## Question 15 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

```text
A developer needs to profile the performance of individual lines in a routine to find bottlenecks. Which tool is most appropriate?

a) ^%PERFMON global monitoring utility
b) $ZH timing around suspect code blocks
c) %SYS.PTools SQL Performance Tools
d) The line-by-line routine profiler ^%SYS.MONLBL
```

**A.** ^%PERFMON \-- provides global-level metrics that can identify slow lines

**B.** $ZH timing \-- measures elapsed time between any two points in code

**C.** %SYS.PTools \-- provides execution plans for any ObjectScript routine

**D.** ^%SYS.MONLBL \-- profiles execution time and hit counts for each line in a routine

### Answer and explanation

**Correct answer: D.** ^%SYS.MONLBL \-- profiles execution time and hit counts for each line in a routine

^%SYS.MONLBL (Monitor by Line) is the line-by-line profiler that tracks how many times each line executes and how long each line takes. This is the most targeted tool for finding bottlenecks within a routine. ^%PERFMON provides system-wide metrics, $ZH is manual and only measures between two chosen points, and %SYS.PTools is for SQL queries only. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCM_monlbl))

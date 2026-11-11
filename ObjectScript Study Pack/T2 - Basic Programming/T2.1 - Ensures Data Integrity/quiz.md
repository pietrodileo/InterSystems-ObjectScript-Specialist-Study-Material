[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T2.1: Ensures Data Integrity — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
A developer writes the following method to transfer funds between accounts:

ClassMethod Transfer(from As %Integer, to As %Integer, amt As %Numeric) As %Status
{
  SET ^Account(from) = ^Account(from) - amt
  SET ^Account(to) = ^Account(to) + amt
  QUIT $$$OK
}

During testing, the IRIS instance crashes after the first SET but before the second. Which of the following correctly fixes the method to ensure both operations succeed or fail together?
```

**A.** Wrap both SET commands with LOCK \+^Account and LOCK -^Account

**B.** Add TSTART before the first SET and TCOMMIT after the second SET

**C.** Use SET $ZTRAP \= "ROLLBACK" before the first SET

**D.** Replace SET with MERGE to make the operation atomic

### Answer and explanation

**Correct answer: B.** Add TSTART before the first SET and TCOMMIT after the second SET

TSTART/TCOMMIT ensures that both global modifications are treated as a single atomic unit. If the process crashes mid-transaction, IRIS automatically rolls back all uncommitted changes. Locks control concurrency but do not provide atomicity. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=TOS_Transaction))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

```text
Consider the following code:

TSTART
SET ^Order(101,"status") = "Processing"
TSTART
SET ^Order(101,"total") = 250.00
SET ^Order(101,"items") = 3
TROLLBACK 1
SET ^Order(101,"notes") = "Reviewed"
TCOMMIT

After execution completes, which globals are committed?
```

**A.** All four SET operations are committed

**B.** Only ^Order(101,"status") and ^Order(101,"notes") are committed

**C.** Only ^Order(101,"status") is committed; everything else is rolled back

**D.** Nothing is committed because TROLLBACK 1 invalidates the entire transaction

### Answer and explanation

**Correct answer: B.** Only ^Order(101,"status") and ^Order(101,"notes") are committed

TROLLBACK 1 rolls back only the innermost transaction level (the second TSTART), undoing the "total" and "items" SETs. $TLEVEL drops from 2 to 1\. The subsequent SET of "notes" occurs at level 1, and TCOMMIT commits everything at level 1: "status" and "notes". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_ctrollback))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
A developer is debugging a method and adds logging:

TSTART
SET ^Inventory(itemId) = newQty
WRITE "$TLEVEL = ", $TLEVEL, !
TSTART
SET ^Inventory(itemId,"lastUpdate") = $HOROLOG
WRITE "$TLEVEL = ", $TLEVEL, !
TCOMMIT
WRITE "$TLEVEL = ", $TLEVEL, !
TCOMMIT
WRITE "$TLEVEL = ", $TLEVEL, !

What sequence of $TLEVEL values is printed?
```

**A.** 1, 2, 2, 1

**B.** 1, 2, 1, 0

**C.** 0, 1, 0, 0

**D.** 1, 1, 0, 0

### Answer and explanation

**Correct answer: B.** 1, 2, 1, 0

After the first TSTART, $TLEVEL \= 1\. After the second TSTART, $TLEVEL \= 2\. The first TCOMMIT decrements it to 1\. The second TCOMMIT decrements it to 0 and actually commits the data. The real commit only occurs when $TLEVEL returns to 0\. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_vtlevel))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
If process A executes this line of code:

LOCK +^x

How does this line impact the ability of other processes to read and manipulate ^x?
```

**A.** Other processes cannot set or read ^x unless process A releases the lock on ^x

**B.** Other processes cannot set or read ^x unless they run LOCK -^x first

**C.** Other processes can read but cannot set ^x

**D.** Other processes can set and read ^x unless they call LOCK ^x first

### Answer and explanation

**Correct answer: D.** Other processes can set and read ^x unless they call LOCK ^x first

Locks in InterSystems IRIS are advisory (cooperative). LOCK \+^x only blocks other processes that also attempt to acquire a LOCK on ^x. Any process can still directly SET or read ^x without calling LOCK first. For locks to be effective, all processes accessing the data must follow the convention of acquiring locks. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_locktable))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
Process A executes:

LOCK +^Patient(42)
SET ^Patient(42,"name") = "Smith"
; ... still working ...

Meanwhile, Process B executes:

SET ^Patient(42,"phone") = "555-0199"

What happens when Process B executes its SET command?
```

**A.** Process B receives a \<LOCKED\> error because Process A holds a lock on ^Patient(42)

**B.** Process B's SET is queued until Process A releases its lock

**C.** Process B successfully sets ^Patient(42,"phone") because it did not attempt to acquire a lock

**D.** Process B can read ^Patient(42) but the SET fails silently

### Answer and explanation

**Correct answer: C.** Process B successfully sets ^Patient(42,"phone") because it did not attempt to acquire a lock

Locks in IRIS are advisory. Process B never attempted to LOCK ^Patient(42), so there is no lock conflict. Process B's SET executes immediately and successfully. Only processes that also call LOCK ^Patient(42) would be blocked. This is why all processes must cooperate by acquiring locks before accessing shared data. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_locktable))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
A method attempts to acquire a lock with a timeout:

LOCK +^Invoice(invId):5
IF '$TEST {
  SET sc = $$$ERROR($$$GeneralError, "Lock timeout on Invoice "_invId)
  QUIT sc
}
SET ^Invoice(invId,"status") = "Processing"

Another process already holds LOCK +^Invoice(invId). What happens when this code runs?
```

**A.** The LOCK command throws a \<TIMEOUT\> error immediately

**B.** The process waits up to 5 seconds; if the lock is not acquired, $TEST is set to 0 and the error status is returned

**C.** The process waits up to 5 seconds; if the lock is not acquired, a \<LOCKED\> error is thrown

**D.** The LOCK command is skipped entirely because the lock is already held by another process

### Answer and explanation

**Correct answer: B.** The process waits up to 5 seconds; if the lock is not acquired, $TEST is set to 0 and the error status is returned

When a LOCK command includes a timeout (the :5 suffix), the process waits up to 5 seconds to acquire the lock. If it cannot, $TEST is set to 0 (failure) and execution continues to the next line. The code then checks '$TEST, finds it true (lock failed), and returns an error status. No exception is thrown. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_clock))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

```text
Consider the following two code blocks:

Block A:
LOCK +^Order(id)#"S"
; read ^Order(id)
LOCK -^Order(id)#"S"

Block B:
LOCK +^Order(id)
; update ^Order(id)
LOCK -^Order(id)

Which statement is correct about concurrent execution?
```

**A.** Block A and Block B can execute simultaneously because they lock different globals

**B.** Two processes running Block A simultaneously will block each other

**C.** A process running Block A will be blocked if another process is running Block B, but multiple processes can run Block A concurrently

**D.** Block A's #"S" flag makes the lock non-blocking, so it never waits

### Answer and explanation

**Correct answer: C.** A process running Block A will be blocked if another process is running Block B, but multiple processes can run Block A concurrently

The #"S" flag acquires a shared lock. Multiple processes can hold shared locks on the same reference simultaneously (for reading). However, a shared lock conflicts with an exclusive lock (Block B uses the default exclusive mode). So Block A will be blocked while Block B holds its exclusive lock. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_clock))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

```text
A developer runs the following SQL update within a transaction:

&sql(START TRANSACTION)
FOR i = 1:1:1500 {
  &sql(UPDATE Patient SET Processed = 1 WHERE PatientId = :i)
}
&sql(COMMIT)

After processing about 1,000 records, other processes that try to access the Patient table start getting blocked. What is the most likely cause?
```

**A.** The lock table has reached its maximum capacity and is throwing \<LOCKTABLEFULL\> errors

**B.** SQL lock escalation has occurred: after 1,000 individual row locks on Patient, IRIS replaced them with a single table-level lock, blocking all other access to the table

**C.** The FOR loop creates a deadlock because it updates rows sequentially

**D.** The \&sql(START TRANSACTION) is holding all locks indefinitely

### Answer and explanation

**Correct answer: B.** SQL lock escalation has occurred: after 1,000 individual row locks on Patient, IRIS replaced them with a single table-level lock, blocking all other access to the table

Lock escalation is a mechanism of the InterSystems SQL engine, not of ObjectScript LOCK commands. When SQL operations (INSERT, UPDATE, DELETE) within a transaction accumulate more than 1,000 row-level locks on a single table (the default threshold), the SQL engine automatically escalates to a table-level lock. This replaces all individual row locks with one lock on the entire table, blocking other processes. The threshold is configurable via $SYSTEM.SQL.Util.SetOption("LockThreshold", value). Note: direct ObjectScript LOCK \+^Global commands do NOT participate in SQL lock escalation. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_options#GSQL_locking_escalation))

## Question 9 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

Which of the following are consequences of SQL lock escalation in InterSystems IRIS?

**A.** Individual row-level locks are replaced by a single table-level lock

**B.** Other processes may be blocked from locking any row in that table

**C.** The escalated lock automatically downgrades when individual row locks are released

**D.** Concurrency can be significantly reduced because the lock covers the entire table

**E.** Lock escalation triggers a \<LOCKTABLEFULL\> error

### Answer and explanation

**Correct answer: A.** Individual row-level locks are replaced by a single table-level lock

**Correct answer: B.** Other processes may be blocked from locking any row in that table

**Correct answer: D.** Concurrency can be significantly reduced because the lock covers the entire table

SQL lock escalation replaces many individual row locks with a single table-level lock. This blocks other processes from acquiring locks on any row in the table and reduces concurrency. Escalated locks do not automatically downgrade, and escalation itself is not the same as a \<LOCKTABLEFULL\> error (that occurs only when the entire lock table runs out of space). Lock escalation is a mechanism of the SQL engine and applies to SQL operations (INSERT, UPDATE, DELETE), not to direct ObjectScript LOCK commands. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_options#GSQL_locking_escalation))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
A web application lets users edit patient records. Two users open the same patient record at the same time. The developer implements the following strategy:

ClassMethod SavePatient(id, data, origVersion) As %Status
{
  IF ^Patient(id,"version") '= origVersion {
    QUIT $$$ERROR($$$GeneralError, "Record modified by another user")
  }
  SET ^Patient(id) = data
  SET ^Patient(id,"version") = origVersion + 1
  QUIT $$$OK
}

Which concurrency strategy does this implement?
```

**A.** Pessimistic concurrency \- locks are held during the entire edit session

**B.** Optimistic concurrency \- the record is read without locks and changes are detected before saving

**C.** Deadlock prevention \- version numbers prevent circular lock dependencies

**D.** Two-phase locking \- locks are acquired in the first phase and released in the second

### Answer and explanation

**Correct answer: B.** Optimistic concurrency \- the record is read without locks and changes are detected before saving

This is optimistic concurrency. The record is read without locks, and before saving, the code checks if the version has changed (indicating another user modified it). If so, the save is rejected. This approach works well when conflicts are rare, providing better throughput than holding locks during potentially long user edit sessions. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_locktable))

## Question 11 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

```text
A developer implements pessimistic concurrency for an order processing system:

ClassMethod ProcessOrder(orderId) As %Status
{
  LOCK +^Order(orderId):10
  IF '$TEST QUIT $$$ERROR($$$GeneralError, "Cannot lock order")
  TSTART
  TRY {
    SET ^Order(orderId,"status") = "Processing"
    ; ... complex business logic ...
    TCOMMIT
  } CATCH ex {
    TROLLBACK
  }
  LOCK -^Order(orderId)
  QUIT $$$OK
}

Which statement best describes this implementation?
```

**A.** The LOCK should be inside the TSTART/TCOMMIT block for the lock to participate in the transaction

**B.** The TROLLBACK in the CATCH should be TROLLBACK 1 to preserve the lock

**C.** This is correct: the lock prevents concurrent access, the transaction ensures atomicity, and the lock is released after the transaction completes

**D.** The LOCK -^Order(orderId) should be before TCOMMIT to release the lock as early as possible

### Answer and explanation

**Correct answer: C.** This is correct: the lock prevents concurrent access, the transaction ensures atomicity, and the lock is released after the transaction completes

This is a well-structured pessimistic concurrency pattern. The lock is acquired first (with a timeout to avoid indefinite waiting), then a transaction wraps the data changes. On error, TROLLBACK rolls back all changes. The lock is released after the transaction finishes (commit or rollback). Releasing the lock before TCOMMIT would allow another process to see uncommitted data. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=TOS_Transaction))

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

```text
Consider the following code:

LOCK ^Patient(42)
SET ^Patient(42,"name") = "Jones"
LOCK +^Appointment(100)
SET ^Appointment(100,"patient") = 42
LOCK -^Appointment(100)

After this code executes, which locks does the process still hold?
```

**A.** Both ^Patient(42) and ^Appointment(100)

**B.** Only ^Patient(42)

**C.** Only ^Appointment(100)

**D.** No locks are held

### Answer and explanation

**Correct answer: B.** Only ^Patient(42)

LOCK ^Patient(42) (without \+) is a simple lock: it releases ALL previously held locks, then acquires ^Patient(42). LOCK \+^Appointment(100) is incremental and adds to existing locks without releasing ^Patient(42). LOCK -^Appointment(100) releases the incremental lock on ^Appointment(100). After execution, only ^Patient(42) is still held. This demonstrates the important difference between simple LOCK (releases all prior locks) and incremental LOCK \+/- (adds/removes individual locks). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_clock))

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

```text
Consider the following code:

LOCK +^Order(1)
LOCK +^Order(2)
LOCK ^Order(3)

After this code executes, which locks does the process hold?
```

**A.** ^Order(1), ^Order(2), and ^Order(3)

**B.** Only ^Order(3)

**C.** ^Order(2) and ^Order(3)

**D.** Only ^Order(1) and ^Order(2)

### Answer and explanation

**Correct answer: B.** Only ^Order(3)

LOCK \+^Order(1) acquires an incremental lock. LOCK \+^Order(2) adds another incremental lock. But LOCK ^Order(3) (without the \+ prefix) is a simple lock: it first releases ALL previously held locks, then acquires only ^Order(3). After execution, only ^Order(3) is held. This is why incremental locks (LOCK \+/-) should be used inside transactions rather than simple LOCK. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_clock))

## Question 14 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

What does TROLLBACK (with no argument) do when $TLEVEL is 3?

**A.** Rolls back only the innermost transaction (level 3\)

**B.** Rolls back all three levels and sets $TLEVEL to 0

**C.** Rolls back two levels, leaving $TLEVEL at 1

**D.** Returns a \<TRANSACTION\> error because TROLLBACK requires an argument when $TLEVEL \> 1

### Answer and explanation

**Correct answer: B.** Rolls back all three levels and sets $TLEVEL to 0

TROLLBACK with no argument performs a full rollback of ALL transaction levels, regardless of the current $TLEVEL. It undoes all changes made since the outermost TSTART and resets $TLEVEL to 0\. To roll back only one level, use TROLLBACK 1\. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_ctrollback))

## Question 15 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

```text
A developer writes the following Embedded SQL code inside a transaction:

TSTART
SET ^Log($I(^Log)) = "Starting batch"
&sql(UPDATE Inventory SET Quantity = Quantity - 1 WHERE ItemId = 'A100')
IF SQLCODE < 0 {
  TROLLBACK
  QUIT $$$ERROR($$$GeneralError, "SQL Error: "_SQLCODE)
}
TCOMMIT

If the UPDATE fails and TROLLBACK executes, which changes are rolled back?
```

**A.** Only the SQL UPDATE is rolled back; the ^Log SET is preserved

**B.** Only the ^Log SET is rolled back; the SQL UPDATE was never committed

**C.** Both the ^Log SET and the SQL UPDATE are rolled back

**D.** Neither is rolled back because Embedded SQL uses a separate transaction context

### Answer and explanation

**Correct answer: C.** Both the ^Log SET and the SQL UPDATE are rolled back

In InterSystems IRIS, Embedded SQL and ObjectScript share the same transaction context. When TROLLBACK executes, ALL global modifications made since TSTART are rolled back, including both the ^Log SET and any changes from the SQL UPDATE. Note: even though the UPDATE failed (negative SQLCODE), it may have made partial changes to globals before failing. TROLLBACK ensures everything is cleanly rolled back to the state before TSTART. There is no separate transaction context for Embedded SQL. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GAPPS_tp))

## Question 16 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q16.md>)

```text
A developer writes the following lock acquisition with a timeout:

LOCK +^Resource(resId):0

Which of the following statements about this command are correct?
```

**A.** The timeout of 0 means the lock attempt returns immediately without waiting

**B.** $TEST is set to 1 if the lock was acquired, 0 if it was not

**C.** A timeout of 0 is equivalent to omitting the timeout entirely

**D.** This is useful for non-blocking lock attempts where the code can take alternative action if the lock is unavailable

**E.** If the lock is not acquired, a \<TIMEOUT\> error is thrown

### Answer and explanation

**Correct answer: A.** The timeout of 0 means the lock attempt returns immediately without waiting

**Correct answer: B.** $TEST is set to 1 if the lock was acquired, 0 if it was not

**Correct answer: D.** This is useful for non-blocking lock attempts where the code can take alternative action if the lock is unavailable

LOCK \+^Resource(resId):0 is a non-blocking lock attempt. It tries to acquire the lock immediately and returns without waiting. $TEST indicates success (1) or failure (0). This differs from omitting the timeout, which waits indefinitely. No error is thrown on failure; the code simply checks $TEST. This pattern is useful for try-or-skip scenarios. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_clock))

## Question 17 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q17.md>)

What happens if a process terminates abnormally (e.g., a JOB crashes) while holding locks and an open transaction at $TLEVEL \= 2?

**A.** The locks are preserved until the system administrator manually removes them via the Management Portal

**B.** The transaction at $TLEVEL 2 is rolled back but $TLEVEL 1 is committed

**C.** The entire transaction is automatically rolled back and all locks held by the process are released

**D.** The locks are released but the partial transaction changes are committed

### Answer and explanation

**Correct answer: C.** The entire transaction is automatically rolled back and all locks held by the process are released

When a process terminates (normally or abnormally), InterSystems IRIS automatically rolls back ALL open transaction levels for that process and releases ALL locks held by that process. This prevents orphaned locks and uncommitted partial changes from affecting the system. There is no partial commit of nested levels. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=TOS_Transaction))

## Question 18 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q18.md>)

```text
Consider the following method that uses Dynamic SQL within a transaction:

ClassMethod BatchUpdate(items As %List) As %Status
{
  SET stmt = ##class(%SQL.Statement).%New()
  SET sc = stmt.%Prepare("UPDATE Inventory SET Status = 'Active' WHERE ItemId = ?")
  TSTART
  SET ptr = 0
  WHILE $LISTNEXT(items, ptr, itemId) {
    SET rs = stmt.%Execute(itemId)
    IF rs.%SQLCODE < 0 {
      TROLLBACK
      QUIT
    }
  }
  TCOMMIT
  QUIT $$$OK
}

Which statement about this code is correct?
```

**A.** Dynamic SQL via %SQL.Statement does not participate in ObjectScript transactions, so TROLLBACK has no effect on the SQL changes

**B.** The %Prepare call should be inside the TSTART block for the SQL to participate in the transaction

**C.** Both Dynamic SQL and Embedded SQL share the same transaction context as ObjectScript, so TROLLBACK correctly undoes all SQL changes

**D.** Each %Execute call creates its own implicit transaction, making the outer TSTART redundant

### Answer and explanation

**Correct answer: C.** Both Dynamic SQL and Embedded SQL share the same transaction context as ObjectScript, so TROLLBACK correctly undoes all SQL changes

In InterSystems IRIS, Dynamic SQL executed via %SQL.Statement participates in the same transaction context as ObjectScript. TSTART/TCOMMIT/TROLLBACK apply to all global modifications, whether made by ObjectScript SET commands, Embedded SQL, or Dynamic SQL. The %Prepare call does not need to be inside the transaction. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=TOS_Transaction))

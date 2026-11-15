[All topics](../../index.md) · [Practice quiz](quiz.md)

# T2.1: Ensures Data Integrity

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T2.1.html). Reference links require internet access.

### Contents

1. [Manages transactions](#1-manages-transactions)
2. [Manages rollbacks](#2-manages-rollbacks)
3. [Describes how LOCKs enforce concurrency](#3-describes-how-locks-enforce-concurrency)
4. [Describes lock escalation threshold and effect on row locks versus table locks](#4-describes-lock-escalation-threshold-and-effect-on-row-locks-versus-table-locks)
5. [Differentiates between pessimistic and optimistic concurrency controls](#5-differentiates-between-pessimistic-and-optimistic-concurrency-controls)
6. [Uses transactions and applies concurrency controls in SQL scripts](#6-uses-transactions-and-applies-concurrency-controls-in-sql-scripts)

### Visual study guide — sections 1–3

![T2.1 visual summary of sections 1–3: 1. Manages transactions; 2. Manages rollbacks; 3. Describes how LOCKs enforce concurrency](visual-guide-01-v2.png)

[View all chapter diagrams](visuals.md) · [Technical review notes](../../visual-technical-notes.md)

## 1. Manages transactions

### Key Points

- **TSTART**: Begins a transaction and increments $TLEVEL by 1
- **TCOMMIT**: Commits the transaction and decrements $TLEVEL by 1; actual commit occurs only when $TLEVEL returns to 0
- **$TLEVEL**: Special variable tracking transaction nesting depth (0 = no active transaction, max 255)
- **Nested transactions**: Each TSTART/TCOMMIT pair creates a nesting level; inner commits are deferred until the outermost TCOMMIT
- **Journaling**: All global changes within a transaction are journaled automatically, regardless of database journal settings

### Detailed Notes

#### Overview

Transactions in ObjectScript guarantee atomicity: either all changes within the transaction are applied, or none are. The TSTART command marks the beginning of a transaction and increments the $TLEVEL special variable. TCOMMIT marks the end of a successful transaction and decrements $TLEVEL. The actual commit to the database only happens when $TLEVEL reaches 0, meaning the outermost transaction has completed.

#### Basic Transaction Pattern

```objectscript
 TSTART
 TRY {
     SET ^Data("account", 1001, "balance") = ^Data("account", 1001, "balance") - 500
     SET ^Data("account", 1002, "balance") = ^Data("account", 1002, "balance") + 500
     TCOMMIT
 }
 CATCH ex {
     TROLLBACK
     WRITE "Error: ", ex.DisplayString(), !
 }
```

#### Nested Transactions

InterSystems IRIS supports nested transactions up to 255 levels. Each TSTART increments $TLEVEL, and each TCOMMIT decrements it. The key concept is that inner TCOMMIT calls do not actually commit data -- commitment is deferred until $TLEVEL reaches 0.

```objectscript
 WRITE "$TLEVEL = ", $TLEVEL, !   // 0
 TSTART
 WRITE "$TLEVEL = ", $TLEVEL, !   // 1
 SET ^Data("outer") = "value1"
 TSTART
 WRITE "$TLEVEL = ", $TLEVEL, !   // 2
 SET ^Data("inner") = "value2"
 TCOMMIT                           // $TLEVEL back to 1 (not yet committed)
 TCOMMIT                           // $TLEVEL back to 0 (all changes committed)
```

This design allows modular code where called methods can issue their own TSTART/TCOMMIT without knowing whether the caller already started a transaction.

### Documentation References

- [Transaction Processing](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GAPPS_tp)
- [TSTART Command](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_ctstart)
- [TCOMMIT Command](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_ctcommit)

## 2. Manages rollbacks

### Key Points

- **TROLLBACK** (no argument): Rolls back ALL transaction levels and resets $TLEVEL to 0
- **TROLLBACK 1**: Rolls back only the current nesting level and decrements $TLEVEL by 1
- **Partial rollback**: TROLLBACK 1 undoes only the changes made at the current $TLEVEL
- **Non-rollbackable operations**: Local variables, $INCREMENT, $SEQUENCE, LOCK operations, and process-private globals are NOT rolled back
- **Error handling**: Always pair TROLLBACK with TRY-CATCH blocks for robust transaction management

### Detailed Notes

#### Full Rollback vs Partial Rollback

TROLLBACK without an argument performs a complete rollback of all transaction levels, resetting $TLEVEL to 0 and undoing all global changes made since the first TSTART. TROLLBACK 1 performs a partial rollback, undoing only the changes made at the current $TLEVEL and decrementing $TLEVEL by 1.

```objectscript
 TSTART
 SET ^Data("A") = 100
 TSTART
 SET ^Data("B") = 200
 TROLLBACK 1                  // Only ^Data("B") = 200 is rolled back; $TLEVEL decremented to 1
 WRITE "$TLEVEL = ", $TLEVEL, !  // 1
 TCOMMIT                      // ^Data("A") = 100 is committed
```

#### Complete Rollback Pattern

```objectscript
 TSTART
 SET ^Data("A") = 100
 TSTART
 SET ^Data("B") = 200
 TROLLBACK                    // ALL changes rolled back; $TLEVEL reset to 0
 WRITE "$TLEVEL = ", $TLEVEL, !  // 0
```

#### Critical: What TROLLBACK Does NOT Undo

Several operations are not affected by TROLLBACK:

- **Local variables**: Changes to local variables persist after rollback
- **$INCREMENT / $SEQUENCE**: These atomic operations are not transactional
- **LOCK operations**: Locks acquired within a transaction are released at the end of the transaction, but TROLLBACK does not "undo" lock operations
- **Process-private globals** (^||PPG): Not journaled, therefore not rolled back

```objectscript
 SET localVar = "before"
 TSTART
 SET localVar = "during"
 SET ^Data("test") = "transactional"
 TROLLBACK
 WRITE localVar, !          // "during" -- local variable NOT rolled back
 WRITE $GET(^Data("test"))  // "" -- global change WAS rolled back
```

### Documentation References

- [TROLLBACK Command](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_ctrollback)
- [Rolling Back Transactions](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GAPPS_tp)

## 3. Describes how LOCKs enforce concurrency

### Key Points

- **Incremental lock**: `LOCK +lockname` acquires a lock without releasing existing locks
- **Incremental unlock**: `LOCK -lockname` releases a specific lock without affecting others
- **Classic LOCK**: `LOCK lockname` releases ALL existing locks and acquires the new one (rarely used)
- **Lock timeout**: `LOCK +lockname:timeout` specifies maximum wait time in seconds; check $TEST for success
- **Exclusive locks**: Any lock without `#"S"` is exclusive (the default); blocks incompatible requests by other processes on that resource
- **Shared locks**: `LOCK +lockname#"S"` allows multiple readers; exclusive locks block other processes
- **Lock type flags**: `#"S"` (shared), `#"E"` (escalating), `#"I"` (immediate unlock), `#"D"` (restore prior unlock state) — combinable (e.g., `#"SI"`)
- **Immediate unlock**: `LOCK -lockname#"I"` releases a lock immediately even within a transaction, when its lock count reaches zero
- **Lock table**: System-wide resource viewable in Management Portal under System Operation &gt; Locks

### Detailed Notes

#### Incremental Lock Pattern

An incremental `LOCK +` acquires a lock without releasing the process's other locks. For a read-modify-write operation, acquire the lock before reading the balance and hold it until the transaction commits or rolls back. The following example assumes there is no outer transaction and that the account already exists.

```objectscript
 // Acquire lock with 5-second timeout
 LOCK +^Data("account", acctId):5
 IF '$TEST {
     WRITE "Could not acquire lock", !
     QUIT
 }
 TRY {
     TSTART
     // Critical section: read-modify-write
     SET balance = ^Data("account", acctId, "balance")
     SET ^Data("account", acctId, "balance") = balance + amount
     TCOMMIT
 }
 CATCH ex {
     TROLLBACK
 }
 LOCK -^Data("account", acctId)     // Always release the lock
```

#### Two processes updating the same account

The account starts at 100. Process A adds 20 and process B subtracts 10. Both request the same exclusive lock. A reads 100 and commits 120, then releases the lock. B can then acquire the lock, read 120, and commit 110. If B's lock attempt times out, `$TEST` is 0 and B skips the update. The transaction groups each write with any other database changes in that unit of work. The lock controls when the other process can start its read-modify-write sequence.

![Two processes request the same account lock. A commits a balance of 120 and releases the lock. B then reads 120 and commits a balance of 110, or skips its update if the lock times out.](visual-guide-account-lock-timeline.png)

#### Shared vs Exclusive Locks

Any lock without the `#"S"` flag is an **exclusive lock** (also called a write lock). There is no explicit "exclusive" flag — the absence of `#"S"` makes a lock exclusive by default. Shared locks allow multiple processes to read concurrently, while exclusive locks provide sole access:

- An existing **shared lock** prevents other processes from acquiring an **exclusive lock** on that resource
- An existing **exclusive lock** prevents other processes from acquiring **any lock** (shared or exclusive) on that resource
- Multiple processes **can** hold shared locks on the same resource simultaneously

```objectscript
 // Shared lock for reading (multiple readers allowed)
 LOCK +^Data("report")#"S":5
 IF $TEST {
     // Read operations
     LOCK -^Data("report")#"S"
 }

 // Exclusive lock for writing (blocks all other locks)
 LOCK +^Data("report"):5
 IF $TEST {
     // Write operations
     LOCK -^Data("report")
 }
```

#### Three independent questions: compatibility, release timing, escalation

![Shared and exclusive compatibility, default versus immediate and history-dependent deferred unlocks, and E-type escalation from child locks to a counted parent lock.](visual-guide-lock-modes-lifetime.png)

| Question | Modifier | Meaning |
| --- | --- | --- |
| Who can hold a compatible lock? | `#"S"` | Shared; omitting S means exclusive. Different processes can share S, but S/exclusive and exclusive/exclusive conflict. |
| When does an unlock take effect? | `#"I"` / `#"D"` | I releases immediately when the count reaches zero; D restores the previous unlock state and depends on lock history. Both apply only to unlocks. |
| Can many sibling locks merge? | `#"E"` | Enables escalation; use E on the matching unlock too. `#"SE"` combines shared and escalating. |

#### Default unlock, immediate unlock, and D are different

For a lock with count 1, an ordinary `LOCK -` inside a transaction normally leaves a pending release (**Delock**) until the transaction ends. `#"I"` makes that release immediate. `#"D"` restores prior unlock behavior: on the first lock/unlock cycle it can release immediately; after a previous ordinary unlock it can restore Delock. It is therefore inaccurate to describe D as simply the default unlock. Decrementing a count greater than 1 leaves the resource locked. Outside a transaction, release is immediate when the count reaches zero.

```objectscript
 // Separate examples, each starting with no existing lock and no outer transaction:
 TSTART
 LOCK +^Demo(1):5
 IF $TEST {
     LOCK -^Demo(1)       // Delock until transaction end
 }
 TCOMMIT

 TSTART
 LOCK +^Demo(1):5
 IF $TEST {
     LOCK -^Demo(1)#"I"  // Immediate release
 }
 TCOMMIT

 TSTART
 LOCK +^Demo(1):5
 IF $TEST {
     LOCK -^Demo(1)#"D"  // First cycle: can release immediately
 }
 TCOMMIT
```

An application lock that remains held still needs its matching unlocks: transaction completion does not replace application lock cleanup. Immediate release is suitable only when another process may safely use the resource before the remaining transaction finishes.

#### E-type escalation: a concrete parent/child example

Suppose process A holds E locks on `^Batch(1,1)` through `^Batch(1,1000)` with the default threshold of 1000. Its next request, `LOCK +^Batch(1,1001)#"E":5`, attempts to lock the parent `^Batch(1)`. If successful, the children merge into one counted parent lock. Process B's incompatible request for `^Batch(1,1500)` now conflicts even though A never explicitly locked that child. If the parent cannot be acquired, escalation does not take place. Check `$TEST` after timed requests.

Balance every successful E acquisition with an E unlock, for example `LOCK -^Batch(1,1001)#"E"`. Once escalated, the parent retains a count rather than individual child identities. Ordinary ObjectScript locks without E do not participate in this escalation. SQL commonly uses E locking for supported storage/IDKey layouts; section 4 explains its table-level effect.

#### Lock table: the registry, not a table-level lock

The **lock table** is IRIS's in-memory registry of resources, owning processes, modes, counts and waiting requests. It records both narrow and broad locks. A **table lock** protects an SQL table; a **row lock** protects a record. They are scopes of protection recorded in the registry, rather than alternatives to using the lock table. View it in Management Portal under **System Operation > Locks**. Exhausting its capacity can cause `<LOCKTABLEFULL>`.

ObjectScript application locks coordinate code that requests compatible names. A direct `SET` or `KILL` does not automatically request the application lock, and an arbitrary lock name need not match the name generated for SQL rows. SQL DML normally acquires its row locks automatically. Use a consistent locking protocol when mixing access paths.

### Documentation References

- [LOCK Command](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_clock)
- [Lock Management](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_concurrency)
- [Database Integrity Tutorial](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=TOS_Integrity)

- [Managing the Lock Table](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_locktable)

### Visual study guide — sections 4–6

![T2.1 visual summary of sections 4–6: 4. Describes lock escalation threshold and effect on row locks versus table locks; 5. Differentiates between pessimistic and optimistic concurrency controls; 6. Uses transactions and applies concurrency controls in SQL scripts](visual-guide-02-v2.png)

[View all chapter diagrams](visuals.md) · [Technical review notes](../../visual-technical-notes.md)

## 4. Describes lock escalation threshold and effect on row locks versus table locks

### Key Points

- **Default threshold**: 1000; requesting the next eligible lock attempts escalation.
- **Trade-off**: Fewer lock-table entries, but a wider conflict scope.
- **Scope**: Locks accumulated by a process for a table; `LockThreshold` is a system-wide configuration value.
- **Access**: Compatibility and isolation determine waiting; a table lock does not block every read.
- **%NOLOCK**: SELECT reads uncommitted data; DML skips automatic row locking. These are different effects.

### Detailed Notes

SQL normally locks rows changed by INSERT, UPDATE and DELETE until the transaction ends. As locks accumulate, IRIS can replace narrow protection with a broader table lock to reduce pressure on the lock registry. The default threshold is 1000: escalation is attempted on request 1001, not merely because 1000 rows exist in the table. SQL supports E-type and traditional escalation strategies depending on storage and IDKey layout; ordinary ObjectScript LOCK without E does not automatically escalate.

#### Registry versus protection scope

![The in-memory lock registry compared with SQL row and table locks; automatic SQL versus explicit ObjectScript locking; request 1001 broadens protection; DML NOLOCK requires another protection strategy.](visual-guide-sql-lock-table.png)

| Concept | What it does | Typical use or trade-off |
| --- | --- | --- |
| Lock table | Records current locks and their owners in memory | Inspect contention and waiting; monitor capacity. |
| Row lock | Protects a particular record | Independent rows can be updated concurrently; many locks consume registry space. |
| Table lock | Protects a whole SQL table in shared or exclusive mode | Deliberate bulk work or escalation; broader conflicts, fewer entries. |

#### Worked example: another row becomes affected

A transaction in process A updates Orders rows 1–1000. An exclusive request by B for another row, 1500, can succeed while A only protects its own rows. A then requests eligible row lock 1001. If escalation succeeds, A now holds broad table protection, and B's new incompatible request for row 1500 waits or times out. If B already holds an incompatible row lock, it can prevent A from obtaining the broader lock; overlapping transactions can deadlock. Do not assume escalation always succeeds immediately.

A broad exclusive lock blocks conflicting locking requests. Reads that do not request conflicting locks can still observe data according to their isolation rules, including uncommitted data at READ UNCOMMITTED. Thus “locks the whole table” does not mean “blocks all access.”

```objectscript
 // Inspect the actual system setting; do not change it just to run an example.
 WRITE $SYSTEM.SQL.Util.GetOption("LockThreshold"), !
```

For explicit table protection, SQL supports `LOCK TABLE Demo.Orders IN EXCLUSIVE MODE` or `IN SHARE MODE`. Row locking is appropriate when transactions work on separate records; a deliberate table lock can suit controlled bulk operations where broad contention is acceptable. Follow the SQL LOCK/UNLOCK transaction-lifetime rules. Keep transactions short and monitor the registry before changing system-wide thresholds.

#### %NOLOCK: query visibility versus write protection

`%NOLOCK` is an IRIS SQL keyword option, placed after the statement verb. It is not the SQL Server-style syntax `FROM Account %NOLOCK`.

```sql
SELECT %NOLOCK ID, Balance FROM Demo.Account WHERE ID = 7;
```

For SELECT, it performs no locking on the query's tables and uses **READ UNCOMMITTED** regardless of the transaction's current isolation mode. For example, A changes Balance from 100 to 120 without committing; B can read 120 using SELECT %NOLOCK; A rolls back, leaving 100. B's observed 120 was a dirty read. This is inappropriate when a decision requires committed data.

```sql
UPDATE %NOLOCK Demo.Account SET Balance = Balance + 10 WHERE ID = 7;
```

For INSERT, UPDATE and DELETE, it suppresses automatic row locking. Reserve this for controlled exclusive access, such as a single-writer load or deliberately held table protection. Without another protection strategy, concurrent writers can race. It requires the corresponding namespace administrative privilege and does not itself disable journaling, transactions or rollback. It is distinct from `%NOJOURN`.

### Documentation References

- [ObjectScript LOCK and E-type escalation](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_clock)
- [SQL UPDATE: transaction locking and %NOLOCK](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_UPDATE)
- [SQL SELECT: %NOLOCK and isolation](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_SELECT)
- [Explicit SQL table locks](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_lock)
- [Managing the Lock Table](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_locktable)

## 5. Differentiates between pessimistic and optimistic concurrency controls

### Key Points

- **Pessimistic concurrency**: Locks resources BEFORE reading; guarantees no conflicts but reduces throughput
- **Optimistic concurrency**: Reads without locking; checks for conflicts at commit time; better throughput for low-contention scenarios
- **Object concurrency**: Default 1 (Atomic read); inspect an object with `%Concurrency`. The method argument, class and process defaults can override the effective mode.
- **Optimistic via %VersionId**: Uses a version counter to detect concurrent modifications
- **SQL ISOLATION LEVEL**: Default READ UNCOMMITTED (`IsolationMode = 0`); separate from object concurrency and its numeric modes

### Detailed Notes

#### Pessimistic Concurrency

In pessimistic concurrency, a process acquires an exclusive lock on a resource before reading or modifying it. This prevents other processes from accessing the resource until the lock is released. It is suitable for high-contention scenarios where conflicts are frequent.

```objectscript
 // Pessimistic approach: lock first, then read and modify
 LOCK +^Data("customer", custId):5
 IF '$TEST {
     WRITE "Resource busy", !
     QUIT
 }
 SET data = ^Data("customer", custId)
 // ... modify data ...
 SET ^Data("customer", custId) = data
 LOCK -^Data("customer", custId)
```

#### Optimistic Concurrency

In optimistic concurrency, a process reads data without acquiring locks. Before committing changes, it verifies that no other process has modified the data in the meantime. If a conflict is detected, the operation is retried or reported as a failure. This works well in low-contention environments.

```objectscript
 // Optimistic approach using %VersionId in persistent classes
 SET obj = ##class(MyApp.Customer).%OpenId(custId)
 // ... modify obj properties ...
 SET sc = obj.%Save()
 IF $$$ISERR(sc) {
     // Check if it's a concurrency conflict
     // %VersionId mismatch means another process modified the object
     WRITE "Concurrency conflict - retry needed", !
 }
```

#### Object concurrency: default 1 (Atomic read)

The usual object concurrency default is **1 (Atomic read)**. An omitted `%OpenId` concurrency argument means `-1`: use the class's `DEFAULTCONCURRENCY`, which normally obtains the process default (initially 1). An explicit method argument or class override can change this. The process default can be changed with `$SYSTEM.OBJ.SetConcurrencyMode()`.

**Naming:** the effective object property is `%Concurrency`, not `%ConcurrencyMode`. Mode 1 provides an atomic read, acquiring a temporary shared lock when needed; it does not retain a lock while you edit the object or automatically detect a stale copy.

InterSystems IRIS persistent objects support several concurrency modes:

- **0 (None)**: No locking; fastest but no protection
- **1 (Atomic read, default)**: Temporary shared lock during open when needed for an atomic read; no retained read lock
- **2 (Shared locks)**: Always takes a shared lock during open, then releases it after the read
- **3 (SharedRetain)**: Shared lock on open retained until close
- **4 (PessimisticRetain)**: Exclusive lock on open retained until close; maximum protection

```objectscript
 // Open with pessimistic locking
 SET obj = ##class(MyApp.Customer).%OpenId(custId, 4, .sc)  // concurrency = 4
```

#### SQL isolation: default READ UNCOMMITTED

The initial SQL isolation setting is **READ UNCOMMITTED (`IsolationMode = 0`)**, not READ COMMITTED. It controls query visibility independently of object concurrency: object mode 1 and SQL isolation mode 1 are different settings. A connection or application can change the process setting; inspect the current value rather than assuming the initial default still applies.

```objectscript
 WRITE $SYSTEM.SQL.Util.GetOption("IsolationMode"), !
 // 0 = READ UNCOMMITTED; 1 = READ COMMITTED; 3 = READ VERIFIED
```

- **READ UNCOMMITTED (default)**: Can see another transaction's uncommitted changes, including values later rolled back.
- **READ COMMITTED**: Normally waits for pending inserts/updates. IRIS has exceptions, including pending deletes, aggregates, DISTINCT, GROUP BY and SELECT %NOLOCK; consult the SQL reference.
- **READ VERIFIED**: Still permits uncommitted data; rechecks relevant query conditions. It does not mean committed-only reads.

For example, if A changes a balance from 100 to 120 and later rolls back, a default SQL read can observe 120. Starting a transaction alone does not guarantee committed-only reads. Set the intended isolation explicitly, for example `SET TRANSACTION ISOLATION LEVEL READ COMMITTED`; the setting persists for the process until changed, including after COMMIT/ROLLBACK.

### Documentation References

- [Concurrency Control](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_concurrency)
- [Object Concurrency](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_concurrency)
- [SQL isolation and its lifetime](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_starttransaction)

## 6. Uses transactions and applies concurrency controls in SQL scripts

### Key Points

- **&sql(START TRANSACTION)**: Begins an SQL transaction (equivalent to TSTART)
- **&sql(COMMIT)**: Commits the SQL transaction
- **&sql(ROLLBACK)**: Rolls back the SQL transaction
- **SQLCODE**: Check after each SQL statement; 0 = success, 100 = no data, negative = error
- **%NOLOCK hint**: For SELECT, forces READ UNCOMMITTED without query locks; for DML, suppresses automatic row locking
- **Parameterized queries**: Use host variables (:variable) in embedded SQL for safe value binding

### Detailed Notes

#### Basic Embedded SQL Transaction Pattern

```objectscript
 &sql(START TRANSACTION)
 &sql(UPDATE Account SET Balance = Balance - :amount WHERE AccountId = :fromAcct)
 IF SQLCODE < 0 {
     &sql(ROLLBACK)
     WRITE "Error on debit: ", %msg, !
     QUIT
 }
 &sql(UPDATE Account SET Balance = Balance + :amount WHERE AccountId = :toAcct)
 IF SQLCODE < 0 {
     &sql(ROLLBACK)
     WRITE "Error on credit: ", %msg, !
     QUIT
 }
 &sql(COMMIT)
```

#### Mixing ObjectScript and SQL Transactions

TSTART and &sql(START TRANSACTION) work with the same underlying transaction mechanism. They share $TLEVEL:

```objectscript
 TSTART
 SET ^AuditLog($INCREMENT(^AuditLog)) = $HOROLOG _ "|Transfer"
 &sql(UPDATE Account SET Balance = Balance - :amount WHERE AccountId = :fromAcct)
 IF SQLCODE < 0 {
     TROLLBACK
     QUIT
 }
 TCOMMIT
```

#### Using %NOLOCK: accept dirty reads explicitly

SELECT %NOLOCK reads in READ UNCOMMITTED mode regardless of the current transaction isolation mode. Place the option after SELECT:

```objectscript
 &sql(SELECT %NOLOCK Name, Balance INTO :name, :bal
      FROM Account
      WHERE AccountId = :acctId)
```

The query can see another transaction's changes that are later rolled back. Section 4 shows a dirty-read example and explains the separate DML meaning of %NOLOCK. It does not remove the need for a safe write-locking strategy.

#### Checking SQL Permissions Within Transactions

SQL operations within transactions respect the same privilege model. Combine transaction management with error handling for privilege failures:

```objectscript
 &sql(START TRANSACTION)
 &sql(INSERT INTO SensitiveData (PatientId, Diagnosis) VALUES (:pid, :diag))
 IF SQLCODE = -99 {
     &sql(ROLLBACK)
     WRITE "Insufficient SQL privileges", !
     QUIT
 }
 &sql(COMMIT)
```

### Documentation References

- [Embedded SQL](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_esql)
- [SQL Transaction Processing](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GAPPS_tp)
- [SELECT %NOLOCK](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_SELECT)

## Exam Preparation Summary

### Critical Concepts to Master:

1. **Transaction lifecycle**: TSTART increments $TLEVEL, TCOMMIT decrements it, actual commit happens only at $TLEVEL = 0
2. **TROLLBACK vs TROLLBACK 1**: Full rollback resets $TLEVEL to 0; partial rollback decrements by 1
3. **Incremental locks**: Always use LOCK +/- pattern; understand shared (#"S") vs exclusive (default) locks; know lock type flags (#"I" immediate, #"D" restore prior unlock state, #"E" escalating)
4. **Lock escalation**: Default 1000: the next eligible lock attempts escalation; configurable via $SYSTEM.SQL.Util.SetOption
5. **Pessimistic vs optimistic**: Pessimistic locks before reading, optimistic checks at commit time; know the object concurrency values (0-4), the default 1, and the separate SQL isolation default READ UNCOMMITTED
6. **SQL transactions**: &sql(START TRANSACTION/COMMIT/ROLLBACK) share $TLEVEL with TSTART/TCOMMIT/TROLLBACK

### Common Exam Scenarios:

- Predicting $TLEVEL values after a sequence of TSTART, TCOMMIT, TROLLBACK, and TROLLBACK 1 commands
- Identifying what is and is NOT rolled back (local variables and $INCREMENT are not rolled back)
- Choosing between pessimistic and optimistic concurrency for given application scenarios
- Recognizing when lock escalation will occur and its impact on concurrent access
- Fixing embedded SQL transaction patterns that lack proper error handling or rollback
- Understanding the effect of %NOLOCK on query behavior

### Hands-On Practice Recommendations:

- Write nested transaction code and verify $TLEVEL at each step using WRITE $TLEVEL
- Experiment with TROLLBACK 1 in nested transactions and observe which changes persist
- Open two terminal sessions and observe LOCK blocking behavior with timeouts
- Use Management Portal (System Operation &gt; Locks) to view the lock table during testing
- Write embedded SQL transactions with intentional errors and verify ROLLBACK behavior
- Test lock escalation by inserting more than 1000 rows in a single transaction and monitoring the lock table

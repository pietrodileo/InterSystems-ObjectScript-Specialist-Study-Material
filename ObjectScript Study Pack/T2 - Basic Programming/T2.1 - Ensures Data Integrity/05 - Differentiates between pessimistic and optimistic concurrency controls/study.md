[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T2.1: Ensures Data Integrity

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T2.1.html). Reference links require internet access.

## 5. Differentiates between pessimistic and optimistic concurrency controls

![T2.1 visual summary of sections 4–6: 4. Describes lock escalation threshold and effect on row locks versus table locks; 5. Differentiates between pessimistic and optimistic concurrency controls; 6. Uses transactions and applies concurrency controls in SQL scripts](../visual-guide-02-v2.png)

*This diagram covers sections 4–6; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

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

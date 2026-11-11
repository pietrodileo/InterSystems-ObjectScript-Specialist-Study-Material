[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T2.1: Ensures Data Integrity

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T2.1.html). Reference links require internet access.

## 4. Describes lock escalation threshold and effect on row locks versus table locks

![T2.1 visual summary of sections 4–6: 4. Describes lock escalation threshold and effect on row locks versus table locks; 5. Differentiates between pessimistic and optimistic concurrency controls; 6. Uses transactions and applies concurrency controls in SQL scripts](../visual-guide-02-v2.png)

*This diagram covers sections 4–6; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **Default threshold**: 1000 row-level locks per table triggers automatic escalation to a table-level lock
- **Escalation behavior**: All individual row locks are replaced by a single table-level lock
- **Performance trade-off**: Table locks reduce lock table overhead but block all concurrent access to the table
- **Configurable threshold**: Adjustable via $SYSTEM.SQL.Util.SetOption("LockThreshold", value) or Management Portal
- **Scope**: Threshold applies per-process, per-table

### Detailed Notes

#### How Lock Escalation Works

When a process acquires row-level locks through SQL operations (INSERT, UPDATE, DELETE), InterSystems IRIS tracks the number of locks per table. Once the number of row locks for a single table exceeds the lock escalation threshold (default 1000), the system automatically escalates to a table-level lock. This replaces all individual row locks with a single lock on the entire table.

```objectscript
 // Check current lock escalation threshold
 WRITE $SYSTEM.SQL.Util.GetOption("LockThreshold"), !   // Default: 1000

 // Change the threshold
 DO $SYSTEM.SQL.Util.SetOption("LockThreshold", 2000)
```

#### Impact on Concurrency

- **Before escalation**: Other processes can access rows that are not individually locked. Fine-grained concurrency is maintained.
- **After escalation**: The entire table is locked. Other processes attempting to lock any row in the same table will block (or fail on timeout). This can cause significant concurrency bottlenecks.

#### When Escalation Occurs

Lock escalation typically happens during:

- Large batch INSERT operations
- Bulk UPDATE affecting many rows
- DELETE operations on large result sets
- Long-running transactions that accumulate row locks

#### Best Practices

- Keep transactions short to minimize the number of accumulated row locks
- For intentional bulk operations, consider explicitly acquiring a table-level lock first (to avoid gradual escalation) and using %NOLOCK on concurrent read queries, or increasing the threshold temporarily
- Monitor the lock table in Management Portal to detect escalation events
- The threshold is a system-wide setting; changing it affects all processes

### Documentation References

- [Lock Escalation Threshold](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_concurrency)
- [SQL Configuration Settings](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_tables)

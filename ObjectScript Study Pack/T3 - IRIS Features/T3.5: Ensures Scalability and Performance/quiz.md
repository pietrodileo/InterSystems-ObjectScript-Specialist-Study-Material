[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T3.5: Scalability and Performance — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
Consider the following snippet of performance metrics for an SQL query:

Average SQL Execution Time: 0.018s
P50 SQL Execution Time:     0.014s
P90 SQL Execution Time:     0.061s
P99 SQL Execution Time:     1.042s

Assuming P50 means the execution time higher than 50% of recorded values, P90 higher than 90%, and P99 higher than 99%.

Which of the following best explains why the P99 time is magnitudes higher than the rest?
```

**A.** The query cache is occasionally purged, meaning a small subset of queries are running uncached

**B.** An outlier value in the WHERE clause parameter causes the optimizer to choose a less efficient plan for that specific value

**C.** P99 queries use Embedded SQL while the others use Dynamic SQL

**D.** The SQL query is gathering table statistics every time it runs

### Answer and explanation

**Correct answer: A.** The query cache is occasionally purged, meaning a small subset of queries are running uncached

When cached query plans are purged (e.g., by schema changes, system maintenance, or memory pressure), the next execution must recompile the query and generate a new plan. This compilation step is orders of magnitude slower than executing a cached plan. Since purges are infrequent, only a small percentage of executions (showing up in P99) are affected. While outlier values can cause the optimizer to choose a different plan, this would typically affect a larger and more consistent percentage of queries (not just P99 spikes), and the difference would be in execution time, not orders of magnitude. TUNE TABLE is not triggered automatically. (Reference: InterSystems Practice Question Q12; [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_queries))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

Which of the following is recommended as the best time to gather (or regather) table statistics for an IRIS SQL table?

**A.** During development, right before deploying to a live system

**B.** Immediately after deploying to a live system

**C.** Every time 20% of the table has changed in a live environment

**D.** Every time 20% of the table has changed in a development environment

### Answer and explanation

**Correct answer: C.** Every time 20% of the table has changed in a live environment

Table statistics should be gathered on the live system when approximately 20% of the data has changed. Development data is not representative of production data distributions. Gathering only at deployment time means statistics become stale as the production data grows and changes. The 20% threshold balances keeping statistics current against the overhead of running TUNE TABLE. (Reference: InterSystems Practice Question Q13; [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_options))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
A developer runs TUNE TABLE on a table with 1 million rows:

TUNE TABLE Sample.Order

Which of the following does TUNE TABLE gather?
```

**A.** Fragmentation levels for indexes, with recommendations for index rebuilds

**B.** Extent size, field selectivity, and block count statistics for the query optimizer

**C.** Query execution times, identifying slow queries

**D.** Contention metrics for locks, with recommendations for concurrency improvements

### Answer and explanation

**Correct answer: B.** Extent size, field selectivity, and block count statistics for the query optimizer

TUNE TABLE gathers statistical metadata about the table: extent size (row count), field selectivity (distribution of unique values per column), and map block counts. The SQL query optimizer uses these statistics to estimate costs and choose efficient query plans. TUNE TABLE does NOT analyze index fragmentation, measure query times, or check lock contention. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_options))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
A developer examines the query plan for this SQL:

SELECT Name, City FROM Sample.Person WHERE City = 'Boston'

The plan shows:

 Read master map Sample.Person.IDKEY, looping on ID.
 For each row: check condition City = 'Boston'.

What does this query plan indicate?
```

**A.** The query efficiently uses an index on City

**B.** The query performs a full table scan, reading every row to check the City condition

**C.** The query uses the IDKEY index to directly look up Boston rows

**D.** The query reads from a cached result set

### Answer and explanation

**Correct answer: B.** The query performs a full table scan, reading every row to check the City condition

'Read master map' means the query reads the main data global (the IDKEY/master map), scanning every row sequentially. For each row, it checks whether City \= 'Boston'. This is a full table scan \- the least efficient approach for selective queries on large tables. Adding an index on City would allow the optimizer to read only matching rows directly. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_queries))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
After adding an index and running %BuildIndices, the developer re-examines the query plan:

Index CityIdx On City;

The plan now shows:

 Read index map Sample.Person.CityIdx, using the given value.
 For each matching row: read master map Sample.Person.IDKEY.

What does this plan indicate?
```

**A.** A full table scan using the CityIdx index

**B.** An index-only query that never reads the data global

**C.** An index lookup to find matching IDs, then a data global read for each match to get the Name column

**D.** A bitmap AND operation combining multiple indexes

### Answer and explanation

**Correct answer: C.** An index lookup to find matching IDs, then a data global read for each match to get the Name column

The plan shows a two-step access: first, the CityIdx index is used to find row IDs matching City \= 'Boston'. Then, for each matching ID, the master map (data global) is read to retrieve the Name column (which is not in the index). This is more efficient than a full table scan but requires the extra master map read because the query needs columns not stored in the index. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_queries))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
A developer wants to time how long a code block takes to execute:

set start = $ZH
for i = 1:1:100000 {
    set x = $PIECE("A,B,C,D,E", ",", 3)
}
set elapsed = $ZH - start
write "Elapsed: ", elapsed, " seconds"

Why is $ZH preferred over $HOROLOG for timing?
```

**A.** $HOROLOG has higher precision than $ZH

**B.** $ZH provides fractional-second precision and simple arithmetic, while $HOROLOG uses comma-separated date,seconds format

**C.** $HOROLOG measures CPU time while $ZH measures wall clock time

**D.** $ZH is more accurate because it uses the system clock directly

### Answer and explanation

**Correct answer: B.** $ZH provides fractional-second precision and simple arithmetic, while $HOROLOG uses comma-separated date,seconds format

$ZH ($ZHOROLOG) returns a high-resolution timestamp as a single number with fractional seconds, making subtraction straightforward. $HOROLOG returns 'days,seconds' format (e.g., '67339,45123') where the comma makes arithmetic complex and it only has whole-second granularity. For code timing, $ZH is the standard choice. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_vzhorolog))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

```text
A developer runs the equivalent of TUNE TABLE from ObjectScript:

set sc = $SYSTEM.SQL.Stats.Table.GatherTableStats("Sample.Person")

After running this, they notice no improvement in query performance. What is the most likely reason?
```

**A.** The method failed silently and statistics were not updated

**B.** Existing cached query plans still use the old statistics; they must be purged

**C.** Statistics only take effect after an IRIS restart

**D.** GatherTableStats only updates the extent size, not field selectivity

### Answer and explanation

**Correct answer: B.** Existing cached query plans still use the old statistics; they must be purged

Gathering new statistics updates the metadata, but existing cached query plans were compiled with the old statistics. These cached plans continue to be used until purged. After gathering statistics, run $SYSTEM.SQL.Purge() to force new plans to be generated using the updated statistics. Statistics take effect immediately for new query compilations, no restart needed. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_options))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

```text
A developer profiles a slow query using %SYS.PTools:

do ##class(%SYS.PTools.SQLQuery).Execute(
    "SELECT o.OrderDate, p.Name FROM Sample.""Order"" o JOIN Sample.Person p ON o.PersonId = p.ID WHERE o.Status = ?",
    ,"Pending")

The output shows:

| Module | Global refs | Lines executed |
|--------|-------------|----------------|
| JOIN step | 250,000 | 500,000 |
| WHERE filter | 250,000 | 250,000 |

What does this suggest?
```

**A.** The query is optimally configured and no improvement is possible

**B.** The JOIN is processed before the WHERE filter, causing unnecessary work; an index on Status could reduce the rows entering the JOIN

**C.** The JOIN needs to be changed from INNER to LEFT

**D.** The global references are too low, indicating the query is reading from cache

### Answer and explanation

**Correct answer: B.** The JOIN is processed before the WHERE filter, causing unnecessary work; an index on Status could reduce the rows entering the JOIN

The high global reference count in the JOIN step (250,000) suggests many rows are being joined before the WHERE filter eliminates non-matching rows. If an index on Status filtered rows before the JOIN, far fewer rows would enter the join step. The optimizer may choose a better plan with an index that reduces the initial result set. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_queries))

## Question 9 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

```text
A query plan shows the following for a query with ORDER BY:

SELECT Name, City FROM Sample.Person
  WHERE Status = 'Active' ORDER BY Name

Plan:
 Read index map StatusIdx, using the given value.
 For each row: read master map for Name, City.
 Generate a temp file, sorting by Name.
 Read the sorted temp file, output rows.

The table has Index NameIdx On Name. Why is the optimizer using a temp file sort?
```

**A.** Temp file sorts are always faster than index-based ordering

**B.** The optimizer chose StatusIdx for the WHERE clause, so it cannot also use NameIdx for ordering

**C.** NameIdx is corrupt and must be rebuilt

**D.** ORDER BY always requires a temp file sort in IRIS

### Answer and explanation

**Correct answer: B.** The optimizer chose StatusIdx for the WHERE clause, so it cannot also use NameIdx for ordering

The optimizer must choose one access path. It selected StatusIdx to efficiently filter Status \= 'Active' rows, but this means rows come out in StatusIdx order, not Name order. A separate temp file sort is needed for ORDER BY Name. If the developer added a composite index on (Status, Name), the optimizer could filter and sort in one pass without a temp file. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_queries))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
A developer writes a performance test using $ZH:

ClassMethod BenchmarkQuery(iterations As %Integer = 1000) As %Numeric
{
    set stmt = ##class(%SQL.Statement).%New()
    set sc = stmt.%Prepare("SELECT Name FROM Sample.Person WHERE City = ?")
    
    set start = $ZH
    for i = 1:1:iterations {
        set rs = stmt.%Execute("Boston")
        while rs.%Next() { /* consume results */ }
    }
    set elapsed = $ZH - start
    write "Total: ", elapsed, "s, Avg: ", elapsed/iterations, "s", !
    quit elapsed/iterations
}
```

**A.** This benchmark is flawed because it reuses the prepared statement

**B.** This benchmark correctly measures average per-query execution time by preparing once and executing many times

**C.** This benchmark is flawed because $ZH cannot measure sub-second intervals

**D.** This benchmark should use $HOROLOG instead of $ZH for higher accuracy

### Answer and explanation

**Correct answer: B.** This benchmark correctly measures average per-query execution time by preparing once and executing many times

This is a well-structured benchmark. Preparing the statement once outside the loop is correct because in production, statements are cached. The loop measures average execution time over many iterations, smoothing out variance. $ZH provides sub-second precision suitable for this measurement. Reusing the prepared statement reflects real-world caching behavior. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_vzhorolog))

## Question 11 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

```text
A developer runs TUNE TABLE and examines the selectivity for a Status column that has 3 distinct values (Active, Pending, Closed) across 1 million rows:

Field: Status
Selectivity: 33.33%
Outlier Selectivity: Active = 80.00%

What do these statistics tell the optimizer?
```

**A.** On average, each Status value matches 33% of rows, but 'Active' specifically matches 80% of rows

**B.** The Status column is 33% full and the Active outlier is 80% null

**C.** 33% of queries use the Status column and 80% of those filter for Active

**D.** The index on Status has 33% fragmentation and 80% of entries are for Active

### Answer and explanation

**Correct answer: A.** On average, each Status value matches 33% of rows, but 'Active' specifically matches 80% of rows

Selectivity indicates what percentage of rows match each distinct value on average (33.33% \= 1/3). Outlier selectivity identifies values with significantly different distribution: 'Active' matches 80% of rows, far above the average. This helps the optimizer decide: for WHERE Status \= 'Active', a table scan may be faster than an index lookup (80% of rows); for WHERE Status \= 'Closed', the index is very selective. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_options))

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

A developer notices that a query performs well in development (1,000 rows) but poorly in production (10 million rows). The query plan in both environments shows the same full table scan. What is the first optimization step?

**A.** Increase the IRIS global buffer size

**B.** Run TUNE TABLE on production, add appropriate indexes, rebuild, and purge cached queries

**C.** Switch from Dynamic SQL to Embedded SQL

**D.** Add a LIMIT clause to the query

### Answer and explanation

**Correct answer: B.** Run TUNE TABLE on production, add appropriate indexes, rebuild, and purge cached queries

The full table scan on 10 million rows is the root cause. The optimization sequence is: (1) Run TUNE TABLE to give the optimizer accurate statistics for the production data volume. (2) Add indexes on the columns used in WHERE, JOIN, and ORDER BY clauses. (3) Build the indexes with %BuildIndices. (4) Purge cached queries to generate new plans. Increasing buffers only helps if the working set fits in memory. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_options))

## Question 13 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

```text
A developer examines the query plan for:

SELECT p.Name, a.City
  FROM Sample.Person p
  JOIN Sample.Address a ON p.AddressId = a.ID
  WHERE a.State = 'MA'

The plan shows:

 Read master map Sample.Address, looping.
 For each Address row: check State = 'MA'.
 For each matching Address: read master map Sample.Person, looping.
 For each Person: check AddressId = Address.ID.

Which of the following are signs of poor optimization in this plan? (Select all that apply)
```

**A.** Full table scan on Sample.Address instead of using an index on State

**B.** Nested loop join reading all Person rows for each matching Address

**C.** The join condition is checked as a filter rather than using an index on AddressId

**D.** The query returns results in an unpredictable order

**E.** The plan uses two separate global reads

### Answer and explanation

**Correct answer: A.** Full table scan on Sample.Address instead of using an index on State

**Correct answer: B.** Nested loop join reading all Person rows for each matching Address

**Correct answer: C.** The join condition is checked as a filter rather than using an index on AddressId

Three issues: (A) No index on Address.State forces a full scan. (B) For each matching Address, a full scan of Person is done (nested loop with no index). (C) The AddressId join condition is checked as a post-read filter instead of using an index. Fixes: add Index StateIdx On State to Address, add Index AddrIdx On AddressId to Person. Two global reads (E) is normal for a join. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_queries))

## Question 14 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

```text
A developer uses bitmap indexes for a reporting query:

Index StatusIdx On Status [Type = bitmap];
Index RegionIdx On Region [Type = bitmap];

SELECT COUNT(*) FROM Sample.Order
  WHERE Status = 'Shipped' AND Region = 'Northeast'

The query plan shows:

 Bitmap AND of StatusIdx and RegionIdx.
 Count rows in the resulting bitmap.

Why is this plan efficient? (Select all that apply)
```

**A.** Bitmap indexes are always faster than standard indexes

**B.** The bitmap AND combines two indexes using bitwise operations without reading the data global

**C.** Bitmap indexes store data compressed, reducing I/O

**D.** The COUNT(\*) forces the optimizer to use bitmap indexes

**E.** The engine expands the result bitmap back into row IDs before counting them

### Answer and explanation

**Correct answer: B.** The bitmap AND combines two indexes using bitwise operations without reading the data global

**Correct answer: C.** Bitmap indexes store data compressed, reducing I/O

Two things make the plan efficient: the bitmap AND combines both indexes with bitwise operations and never touches the data global, and bitmaps are stored compressed so little I/O is needed to read them. Bitmap indexes are not universally faster \-- they suit low-cardinality columns and lose to standard indexes on highly selective ones \-- and COUNT(\*) does not force their use; the optimizer chose them. Expanding to row IDs is exactly what the plan AVOIDS: the count is computed from the bitmap directly, which is the whole point.

## Question 15 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

```text
A developer measures query performance before and after adding an index:

// Before index:
set start = $ZH
for i = 1:1:100 {
    &sql(SELECT Name INTO :n FROM Sample.Person WHERE SSN = :testSSN)
}
set before = ($ZH - start) / 100

// Add unique index on SSN, build, purge queries

// After index:
set start = $ZH
for i = 1:1:100 {
    &sql(SELECT Name INTO :n FROM Sample.Person WHERE SSN = :testSSN)
}
set after = ($ZH - start) / 100

write "Before: ", before, "s  After: ", after, "s"

The results show Before: 0.045s and After: 0.001s. What explains this 45x improvement?
```

**A.** Embedded SQL was recompiled and optimized between the two runs

**B.** The unique index on SSN allows direct lookup by value instead of scanning all rows

**C.** The second run benefits from operating system file caching

**D.** The loop warm-up in the first run caused it to be artificially slow

### Answer and explanation

**Correct answer: B.** The unique index on SSN allows direct lookup by value instead of scanning all rows

Without an index, the query must scan the entire table (full table scan) to find the row with the matching SSN. With a unique index on SSN, the optimizer performs a direct index lookup: SSN value -\> row ID -\> single row read. This changes from O(n) to O(1) access, explaining the dramatic improvement. The Embedded SQL was recompiled (cached query purged), but the improvement comes from the index, not the recompilation itself. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_tables))

[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T3.4: Schema Evolution — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
A developer adds a new index to a class with 500,000 existing rows:

Class Sample.Order Extends %Persistent
{
Property OrderDate As %Date;
Property Status As %String;
Index StatusIdx On Status;  // newly added
}

After compiling the class, they run:

&sql(SELECT * FROM Sample."Order" WHERE Status = 'Active')

The query returns no results, even though there are rows with Status = 'Active'. What is the most likely cause?
```

**A.** The index definition has a syntax error

**B.** The index was compiled but not populated with existing data; %BuildIndices must be run

**C.** Standard indexes cannot be used on %String properties

**D.** The SQL query has incorrect syntax for using the index

### Answer and explanation

**Correct answer: B.** The index was compiled but not populated with existing data; %BuildIndices must be run

Compiling a class with a new index only creates the index definition and generates maintenance code for future inserts/updates. The 500,000 existing rows are NOT automatically indexed. The optimizer selects the new (empty) index, which returns no data — making it appear as if no matching rows exist. Running ##class(Sample.Order).%BuildIndices($LB("StatusIdx")) populates the index with existing data. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_defpersobj#GOBJ_indices_build))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

A developer needs to build only the StatusIdx index on a large table without affecting other indexes. Which code is correct?

**A.** do ##class(Sample.Order).%BuildIndices()

**B.** do ##class(Sample.Order).%BuildIndices($LB("StatusIdx"))

**C.** do $SYSTEM.SQL.BuildIndex("Sample.Order", "StatusIdx")

**D.** do ##class(Sample.Order).%PurgeIndices($LB("StatusIdx"))

### Answer and explanation

**Correct answer: B.** do ##class(Sample.Order).%BuildIndices($LB("StatusIdx"))

%BuildIndices accepts a $ListBuild of specific index names to build. Passing $LB("StatusIdx") builds only that index, leaving other indexes untouched. Option A (no args) rebuilds ALL indexes. Option C is not a valid method. Option D purges rather than builds. Selective building is important for large tables where rebuilding all indexes would be time-consuming. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_defpersobj#GOBJ_indices_build))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
A developer renames a property in a persistent class:

// Before:
Property Name As %String;   // stored in slot 2 of the global

// After:
Property FullName As %String;

The class has 100,000 rows. After compiling, they query:

&sql(SELECT FullName FROM Sample.Person WHERE ID = 1)

What is the result?
```

**A.** The original Name value is returned because the compiler auto-migrates

**B.** An empty string (NULL) because FullName maps to a new empty storage slot

**C.** A compilation error because the property cannot be renamed

**D.** The original Name value is returned because the storage slot number is preserved

### Answer and explanation

**Correct answer: B.** An empty string (NULL) because FullName maps to a new empty storage slot

When a property is renamed, the compiler treats FullName as a new property and assigns it a new slot in the storage definition. The original data remains in the old slot mapped to 'Name'. The result is that FullName appears empty for all existing rows. To fix this, manually edit the storage definition XML to map FullName to the original slot number, or migrate the data. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_storage))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
A developer renamed a property from Name to FullName in a persistent class with 100,000 rows. After compiling, FullName returns empty for all existing rows. The developer examines the storage definition and sees:

<Data name="PersonDefaultData">
  <Value name="1"><Value>%%CLASSNAME</Value></Value>
  <Value name="2"><Value>Name</Value></Value>
  <Value name="3"><Value>DOB</Value></Value>
  <Value name="4"><Value>FullName</Value></Value>
</Data>

What should the developer do to make existing data accessible through the FullName property?
```

**A.** Run %BuildIndices() to rebuild the data

**B.** Change \<Value name\="2"\>\<Value\>Name\</Value\>\</Value\> to \<Value name\="2"\>\<Value\>FullName\</Value\>\</Value\> and remove slot 4

**C.** Delete all data and reimport it

**D.** Run $SYSTEM.SQL.Schema.ImportDDL() to refresh the schema

### Answer and explanation

**Correct answer: B.** Change \<Value name\="2"\>\<Value\>Name\</Value\>\</Value\> to \<Value name\="2"\>\<Value\>FullName\</Value\>\</Value\> and remove slot 4

The fix is to edit the storage definition to map FullName to slot 2 (where the original Name data resides) and remove the unused slot 4\. This tells the runtime to read FullName from the same global position where Name data was stored. After the edit, recompile the class. No data migration is needed because the global data is unchanged. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_storage))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
A developer changes a property's datatype on a table with existing data:

// Before:
Property Score As %String;

// After:
Property Score As %Integer;

The existing data includes values: "85", "92", "N/A", "78", ""

After compiling, what happens to the underlying global data?
```

**A.** The global data is automatically converted to integer format

**B.** The global data is unchanged; the old string values remain as-is in the storage slots

**C.** The non-numeric values are deleted from the global

**D.** The class fails to compile because existing data does not match the new type

### Answer and explanation

**Correct answer: B.** The global data is unchanged; the old string values remain as-is in the storage slots

Changing a property's datatype and recompiling does NOT modify the underlying global data. The string values ("85", "N/A", etc.) remain exactly as stored. This creates a risk: non-numeric values like "N/A" are still in the global but may cause unpredictable behavior when accessed through the %Integer property — the result depends on the access path, validation settings, and IRIS version. This is why datatype narrowing on existing data requires a data migration step. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_storage))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
A developer adds a new property to a class that already has 50,000 rows and compiles:

Class Sample.Person Extends %Persistent
{
Property Name As %String;
Property Email As %String;
Property Phone As %String [ InitialExpression = "000-000-0000" ];
}

The Phone property is newly added. After compiling, what value does Phone contain for existing rows?
```

**A.** "000-000-0000" because the InitialExpression is applied retroactively

**B.** NULL (empty string) because existing global data has no value for the new slot

**C.** An \<UNDEFINED\> error when accessed

**D.** "000-000-0000" because IRIS runs a background migration on compile

### Answer and explanation

**Correct answer: B.** NULL (empty string) because existing global data has no value for the new slot

InitialExpression is only applied when a NEW object is created with %New(). Existing rows in the global have no data in the storage slot for Phone, so it reads as empty string (NULL in SQL). The class compilation does NOT modify existing global data. To set default values for existing rows, run an UPDATE statement or ObjectScript loop. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_storage))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

```text
A developer adds a bitmap index to an existing class, compiles, and builds it:

Index StatusIdx On Status [Type = bitmap];

A query using the bitmap index works correctly:

&sql(SELECT COUNT(*) FROM Sample.Order WHERE Status = 'Pending')

Later, the developer changes the index to a standard index:

Index StatusIdx On Status;

After recompiling (but NOT rebuilding), what happens to queries using StatusIdx?
```

**A.** Queries work correctly because the data format is the same

**B.** Queries may return incorrect results because the bitmap index data format is different from standard index format

**C.** An error occurs because the index type cannot be changed

**D.** The index is automatically rebuilt when the type changes

### Answer and explanation

**Correct answer: B.** Queries may return incorrect results because the bitmap index data format is different from standard index format

Bitmap indexes and standard indexes have fundamentally different data structures in the global. Bitmap indexes store bit-string representations; standard indexes store individual key-value entries. After changing the type without rebuilding, the old bitmap data remains in the global but is interpreted as standard index data, leading to incorrect results. Always run %BuildIndices after changing an index type. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_defpersobj#GOBJ_indices_build))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

```text
A developer uses CREATE INDEX via SQL DDL:

&sql(CREATE INDEX CityIdx ON TABLE Sample.Person (City))
write SQLCODE

How does this differ from adding the index in the class definition?
```

**A.** CREATE INDEX only creates the definition; %BuildIndices must still be called

**B.** CREATE INDEX creates the definition AND automatically builds the index for existing data

**C.** CREATE INDEX is slower because it does not use the class compiler

**D.** CREATE INDEX cannot create bitmap indexes

### Answer and explanation

**Correct answer: B.** CREATE INDEX creates the definition AND automatically builds the index for existing data

The CREATE INDEX DDL statement both creates the index definition in the class and automatically populates it with existing data in one step. This is different from adding an index in the class definition and compiling, where you must separately call %BuildIndices(). CREATE INDEX is convenient for production schema changes because it handles both steps atomically. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_createindex))

## Question 9 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

A developer modifies a persistent class by adding a column and recompiles. They then notice that some dynamic SQL queries return stale results. What should they do?

**A.** Restart the IRIS instance to clear all caches

**B.** Purge cached queries using $SYSTEM.SQL.Purge() or the Management Portal

**C.** Recompile all classes in the namespace

**D.** Delete and recreate the %SQL.Statement objects

### Answer and explanation

**Correct answer: B.** Purge cached queries using $SYSTEM.SQL.Purge() or the Management Portal

When a table structure changes, cached query plans may become stale. While IRIS automatically purges many affected cached queries on schema change, some edge cases (especially with dynamic SQL) may require manual purging. $SYSTEM.SQL.Purge() forces all cached queries in the namespace to be regenerated on next execution. The Management Portal also provides a UI for this. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_queries#GSQL_cachedqueries_purge))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
Consider the following sequence of operations:

// Step 1: Original class with data
Class Sample.Product Extends %Persistent
{
Property Name As %String;
Property Price As %Numeric;
}
// 10,000 rows exist

// Step 2: Developer removes Price and adds Cost
Class Sample.Product Extends %Persistent
{
Property Name As %String;
Property Cost As %Numeric;
}

After compiling step 2, what happens to the storage definition and the old Price data?
```

**A.** The Price data is automatically deleted from the global

**B.** Cost is assigned a new slot; the old Price slot remains in the storage definition mapped to the removed property, and the Price data stays in the global

**C.** An error prevents compilation when a property is removed

**D.** Cost is assigned to the same slot as Price, causing Cost to read old Price values

### Answer and explanation

**Correct answer: B.** Cost is assigned a new slot; the old Price slot remains in the storage definition mapped to the removed property, and the Price data stays in the global

The IRIS compiler preserves existing storage slots by default. When Price is removed and Cost is added, the old Price slot remains occupied in the storage definition (still mapped to 'Price'), and Cost is assigned a new slot. The old Price data stays in the global — it is never deleted by schema changes. Cost reads from its new (empty) slot for existing rows. The orphaned Price data wastes storage space but does not cause data corruption. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_storage))

## Question 11 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

A developer needs to rebuild indexes on a 10-million-row table on a live production system. Which approach does InterSystems recommend?

**A.** do ##class(Sample.BigTable).%BuildIndices()

**B.** BUILD INDEX FOR TABLE Sample.BigTable

**C.** do ##class(Sample.BigTable).%PurgeIndices() followed by %BuildIndices()

**D.** DROP INDEX and CREATE INDEX for each index

### Answer and explanation

**Correct answer: B.** BUILD INDEX FOR TABLE Sample.BigTable

InterSystems recommends using the BUILD INDEX SQL command for live systems. BUILD INDEX acquires an extent lock by default, temporarily marks the index as not selectable (so queries don't use it while it's being built), and any INSERT/UPDATE operations that occur during the build are included in the process. This makes it safe to use on an active system. %BuildIndices() is also available but BUILD INDEX is the preferred approach per the documentation. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_tables#GSQL_indices_building))

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

```text
A developer changes the collation of a property that has an existing index:

// Before:
Property LastName As %String(COLLATION = "EXACT");
Index NameIdx On LastName;

// After:
Property LastName As %String(COLLATION = "SQLUPPER");
Index NameIdx On LastName;

After compiling but NOT rebuilding the index, what happens when a query uses NameIdx?
```

**A.** Queries work correctly because collation only affects display

**B.** Queries may return incorrect or incomplete results because the index entries use the old collation

**C.** The compilation fails because collation changes require dropping the index first

**D.** IRIS automatically rebuilds the index when collation changes

### Answer and explanation

**Correct answer: B.** Queries may return incorrect or incomplete results because the index entries use the old collation

Index entries are stored using the collation in effect at build time. Changing from EXACT to SQLUPPER means the index should store uppercased values, but existing entries still have the original EXACT values (mixed case). This mismatch causes queries to miss rows or return incorrect results. The index must be rebuilt after any collation change: do ##class(Sample.Class).%BuildIndices($LB("NameIdx")). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_defpersobj#GOBJ_indices_build))

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

A developer runs TUNE TABLE on a frequently queried table. What happens to existing cached queries for that table?

**A.** Cached queries are unaffected; the developer must manually purge them

**B.** TUNE TABLE automatically recompiles all cached queries for the table so they use the new statistics

**C.** Cached queries are deleted and must be re-created manually

**D.** TUNE TABLE only affects new queries; existing cached queries keep the old plan until the IRIS instance is restarted

### Answer and explanation

**Correct answer: B.** TUNE TABLE automatically recompiles all cached queries for the table so they use the new statistics

TUNE TABLE automatically recompiles all existing cached queries for the specified table to use the new statistics values. No manual purge is needed. However, if TUNE TABLE does not change any values (e.g., the data hasn't changed since the last run), cached queries are not recompiled since recompilation would produce the same plans. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_tunetable))

## Question 14 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

```text
A developer removes a property from a class and recompiles:

// Before:
Class Sample.Person Extends %Persistent
{
Property Name As %String;       // slot 2
Property Email As %String;      // slot 3
Property Phone As %String;      // slot 4
}

// After:
Class Sample.Person Extends %Persistent
{
Property Name As %String;       // slot 2
Property Phone As %String;      // slot ?
}

What happens to the Phone data in existing rows if the developer does NOT review the storage definition?
```

**A.** Phone data is unchanged and accessible because it keeps slot 4

**B.** Phone may be reassigned to slot 3 and read the old Email data instead

**C.** Phone data is automatically migrated from slot 4 to slot 3

**D.** The compilation fails because Email data still exists in the global

### Answer and explanation

**Correct answer: A.** Phone data is unchanged and accessible because it keeps slot 4

When a property is removed, InterSystems IRIS preserves the existing storage definition slots by default. The compiler typically keeps Phone in slot 4 and marks slot 3 (formerly Email) as unused in the storage definition. However, if the developer manually edits or regenerates the storage definition, Phone could be reassigned. Always verify the storage XML after removing properties. The old Email data remains in slot 3 of the global, orphaned but not deleted. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_storage))

## Question 15 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

```text
A developer performs the following schema evolution steps on a production table with 1 million rows:

1. Adds a new index: Index CityIdx On City [Type = bitmap];
2. Changes Property Score As %String to Property Score As %Integer;
3. Renames Property Addr to Property Address;
4. Compiles the class.

Which additional steps are required for correct behavior? (Select all that apply)
```

**A.** Run %BuildIndices($LB("CityIdx")) to populate the new bitmap index

**B.** Review and fix the storage definition to map Address to the original Addr storage slot

**C.** Run a data migration to convert non-numeric Score values before they cause silent data corruption

**D.** Purge cached queries so new plans reflect the schema changes

**E.** Restart the IRIS instance

### Answer and explanation

**Correct answer: A.** Run %BuildIndices($LB("CityIdx")) to populate the new bitmap index

**Correct answer: B.** Review and fix the storage definition to map Address to the original Addr storage slot

**Correct answer: C.** Run a data migration to convert non-numeric Score values before they cause silent data corruption

**Correct answer: D.** Purge cached queries so new plans reflect the schema changes

All four steps are needed: (A) New indexes must be built for existing data. (B) Renamed properties need storage definition fixes to read from the original slot. (C) Changing %String to %Integer means non-numeric strings like "N/A" will silently become 0\. (D) Cached queries may use stale plans. Restarting IRIS (E) is not required for any of these changes. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_storage))

## Question 16 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q16.md>)

A developer adds a new index to a production table and runs BUILD INDEX to populate it. TUNE TABLE is also run and confirms updated statistics. However, a critical query that should benefit from the new index still uses the old query plan. What is the most likely cause?

**A.** BUILD INDEX did not complete successfully

**B.** The query has a frozen plan that prevents it from being reoptimized

**C.** TUNE TABLE must be run a second time for the new index to be recognized

**D.** The IRIS instance must be restarted for new indexes to become visible to the optimizer

### Answer and explanation

**Correct answer: B.** The query has a frozen plan that prevents it from being reoptimized

Frozen plans are retained across compiles, TUNE TABLE, and even system upgrades. A frozen plan will not be recompiled to use the new index. The developer must explicitly unfreeze the plan (using UNFREEZE PLANS or $SYSTEM.SQL.Statement.UnfreezeStatement()) so a new plan can be generated. The %NOFPLAN keyword can also be used to temporarily ignore the frozen plan for testing. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_queries#GSQL_cachedqueries_freeze))

## Question 17 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q17.md>)

A DBA wants to protect all query plans for a critical table before a system upgrade, so that query performance is not affected. Which approach is correct?

**A.** FREEZE PLANS FOR TABLE Sample.CriticalTable

**B.** PURGE CACHED QUERIES FOR TABLE Sample.CriticalTable

**C.** Export the table data before upgrading

**D.** Set the table to read-only mode during the upgrade

### Answer and explanation

**Correct answer: A.** FREEZE PLANS FOR TABLE Sample.CriticalTable

FREEZE PLANS FOR TABLE freezes all query plans associated with the specified table. Frozen plans are retained across system upgrades, ensuring query performance is predictable. After the upgrade, the DBA can use the pessimistic strategy: test queries with %NOFPLAN to compare the new plan against the frozen plan, and unfreeze only if the new plan performs better. Plans can also be frozen/unfrozen per-statement, per-schema, or namespace-wide. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_queries#GSQL_cachedqueries_freeze))

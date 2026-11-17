# T2.2: Tracks Application Data — visual study guides

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Chapter contents](index.md) · [Full guide](study.md) · [Practice questions](quiz.md)

Generated learning summaries. Read the full notes for detailed explanations and exact code. [Technical review notes](../../visual-technical-notes.md).

## Visual guide — overview of sections 1–3

![T2.2 visual summary of sections 1–3: 1. Locates and accesses application globals; 2. Uses logging to track application data; 3. Adds and tracks metrics for performance monitoring](visual-guide-01-v3.png)

Covers:

- 1. Locates and accesses application globals
- 2. Uses logging to track application data
- 3. Adds and tracks metrics for performance monitoring

## Visual guide — globals, navigation and mapping

![T2.2 detailed guide to global navigation, the four $DATA results, and locating a class global through DataLocation and namespace mappings](visual-guide-02.png)

Covers:

- `ZWRITE`, `$DATA`, `$GET`, and `$ORDER`
- The distinction between a node's direct value and its descendants
- `DataLocation`, namespace global mappings, and `GetGlobalDest`

## Visual guide — logging and performance tools

![T2.2 reference for ^%ISCLOG and ^ISCLOG, process-level counters, IRISTEMP metrics, SQL statistics, and line-by-line monitoring](visual-guide-03.png)

Covers:

- Built-in diagnostics versus application logs and their storage locations
- `$SYSTEM.Process` counters and before/after measurements with `$ZHOROLOG`
- `^IRIS.Temp`, SQL statistics and query plans, and `^%SYS.MONLBL`

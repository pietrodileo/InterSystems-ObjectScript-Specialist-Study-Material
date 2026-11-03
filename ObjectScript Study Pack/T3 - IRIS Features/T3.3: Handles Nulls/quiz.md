[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T3.3: Handles Nulls — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
Consider the following ObjectScript code:

set a = ""
set b = $CHAR(0)
write a = b
```

**A.** 1 (true) \- they are the same value

**B.** 0 (false) \- $CHAR(0) is a single character, "" is an empty string

**C.** An error because $CHAR(0) is not a valid value

**D.** 1 (true) \- both represent NULL

### Answer and explanation

**Correct answer: B.** 0 (false) \- $CHAR(0) is a single character, "" is an empty string

$CHAR(0) produces a single character (the NUL character, ASCII code 0\) with $LENGTH of 1\. The empty string "" has $LENGTH of 0\. They are different values. In ObjectScript, $CHAR(0) is a valid character that can appear in strings, not a synonym for empty or NULL. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fchar))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

```text
A developer sets a property to empty string in ObjectScript and then queries it via SQL:

set obj = ##class(Sample.Person).%OpenId(1)
set obj.Email = ""
set sc = obj.%Save()

// Later, via SQL:
&sql(SELECT COUNT(*) INTO :cnt FROM Sample.Person WHERE Email IS NULL AND ID = 1)
write cnt
```

**A.** 0 \- the empty string is not NULL in SQL

**B.** 1 \- the empty string in ObjectScript maps to NULL in SQL

**C.** An error because you cannot compare empty strings with IS NULL

**D.** 0 \- IS NULL only matches explicit NULL insertions

### Answer and explanation

**Correct answer: B.** 1 \- the empty string in ObjectScript maps to NULL in SQL

In InterSystems IRIS, the ObjectScript empty string "" IS the representation of SQL NULL. Setting a property to "" (or leaving it unset, since "" is the default) projects as SQL NULL, so IS NULL matches the row and cnt \= 1\. The SQL zero-length string '' is the ObjectScript value $CHAR(0), which is a distinct value of length 1 and does NOT match IS NULL (it matches \= ''). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_langelements#GSQL_langelements_null))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
Consider the following ObjectScript code:

set x = $CHAR(0)
write $LENGTH(x), " "
write $ASCII(x), " "
write x = "", " "
write $LENGTH(""), " "
write $ASCII("")
```

**A.** 1 0 0 0 -1

**B.** 0 0 1 0 0

**C.** 1 0 1 0 -1

**D.** 0 -1 1 0 0

### Answer and explanation

**Correct answer: A.** 1 0 0 0 -1

$CHAR(0) has $LENGTH \= 1 (it is one character). $ASCII($CHAR(0)) \= 0 (the NUL character's ASCII code). $CHAR(0) \= "" is 0 (false, they are different). $LENGTH("") \= 0 (empty string). $ASCII("") \= -1 (the special return value for an empty string). These distinctions are critical for understanding null handling. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fchar))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
A table has three rows inserted as follows:

&sql(INSERT INTO Sample.Test (Code) VALUES ('ABC'))
&sql(INSERT INTO Sample.Test (Code) VALUES (''))
&sql(INSERT INTO Sample.Test (Code) VALUES (NULL))

Now consider these two queries:

Query A: SELECT COUNT(*) FROM Sample.Test WHERE Code IS NULL
Query B: SELECT COUNT(Code) FROM Sample.Test

What are the results of Query A and Query B?
```

**A.** A returns 1, B returns 2

**B.** A returns 2, B returns 1

**C.** A returns 2, B returns 2

**D.** A returns 1, B returns 3

### Answer and explanation

**Correct answer: A.** A returns 1, B returns 2

In InterSystems IRIS, SQL '' (zero-length string) and SQL NULL are different values. Inserting '' stores the ObjectScript value $CHAR(0) (a non-NULL, length-1 value); inserting NULL stores the ObjectScript empty string "" (which is how IRIS represents SQL NULL). Query A: only the explicit NULL row matches IS NULL, so count \= 1\. Query B: COUNT(Code) counts non-NULL values — both 'ABC' and '' are non-NULL, so count \= 2\. Note: COUNT(\*) would return 3 (all rows). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_langelements#GSQL_langelements_null))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
Consider the following ObjectScript code:

set val = ""
if val {
    write "truthy"
} else {
    write "falsy"
}
write " | "
set val2 = $CHAR(0)
if val2 {
    write "truthy"
} else {
    write "falsy"
}
```

**A.** truthy \| truthy

**B.** falsy \| falsy

**C.** falsy \| truthy

**D.** truthy \| falsy

### Answer and explanation

**Correct answer: B.** falsy \| falsy

In ObjectScript, the if command evaluates expressions numerically. The empty string "" has numeric value 0, so it is falsy. $CHAR(0) also has numeric value 0 (it is a string that does not begin with a digit), so it is also falsy. Both produce "falsy". Even though they are different values ($LENGTH-wise), they share the same numeric coercion to 0\. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
A developer writes a SQL query with COALESCE:

&sql(SELECT COALESCE(Phone, Email, 'No Contact') INTO :contact
     FROM Sample.Person WHERE ID = :id)

If the row has Phone = '' and Email = 'user@test.com', what value does :contact hold?
```

**A.** '' (empty string)

**B.** 'user@test.com'

**C.** 'No Contact'

**D.** NULL

### Answer and explanation

**Correct answer: A.** '' (empty string)

In InterSystems IRIS, SQL '' (zero-length string) is NOT the same as SQL NULL. COALESCE returns the first non-NULL argument. Since Phone \= '' is a zero-length string (not NULL), COALESCE returns '' immediately without checking Email or the fallback. To make COALESCE skip Phone, it would need to be NULL (represented in ObjectScript by the empty string ""), not the SQL zero-length string (represented in ObjectScript by $CHAR(0)). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_coalesce))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

```text
Consider the following table and query:

&sql(INSERT INTO Sample.Exam (Score) VALUES (10))
&sql(INSERT INTO Sample.Exam (Score) VALUES (NULL))
&sql(INSERT INTO Sample.Exam (Score) VALUES (20))
&sql(INSERT INTO Sample.Exam (Score) VALUES (NULL))
&sql(INSERT INTO Sample.Exam (Score) VALUES (30))

&sql(SELECT AVG(Score) INTO :avg,
            SUM(Score) INTO :total,
            COUNT(Score) INTO :cnt,
            COUNT(*) INTO :allRows
     FROM Sample.Exam)

write avg, " ", total, " ", cnt, " ", allRows
```

**A.** 12 60 5 5

**B.** 20 60 3 5

**C.** 12 60 3 3

**D.** 20 60 5 5

### Answer and explanation

**Correct answer: B.** 20 60 3 5

SQL aggregate functions (except COUNT(\*)) ignore NULL values. SUM(Score) \= 10\+20\+30 \= 60\. COUNT(Score) \= 3 (non-NULL values only). AVG(Score) \= 60/3 \= 20\. COUNT(\*) \= 5 (counts all rows regardless of NULL). This is standard SQL behavior \- NULL values are excluded from aggregation but COUNT(\*) counts rows, not values. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_avg))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

```text
A developer stores data using $CHAR(0) as a delimiter:

set record = "John" _ $CHAR(0) _ "Doe" _ $CHAR(0) _ "Boston"
write $PIECE(record, $CHAR(0), 2)

What is displayed?
```

**A.** An error because $CHAR(0) is not a valid delimiter

**B.** "" (empty string)

**C.** Doe

**D.** John

### Answer and explanation

**Correct answer: C.** Doe

$CHAR(0) is a valid single character (NUL, ASCII 0\) and works perfectly as a delimiter in $PIECE. It is commonly used as a delimiter because it rarely appears in actual data. The second piece of the record is "Doe". This demonstrates that $CHAR(0) is a real character, not equivalent to empty string or NULL. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fpiece))

## Question 9 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

```text
Consider this SQL query using IFNULL:

&sql(SELECT IFNULL(MiddleName, 'N/A') INTO :middle FROM Sample.Person WHERE ID = :id)

The row was inserted with:

&sql(INSERT INTO Sample.Person (Name, MiddleName) VALUES ('John', ''))

What value does :middle hold?
```

**A.** '' (empty string)

**B.** 'N/A'

**C.** NULL

**D.** 'John'

### Answer and explanation

**Correct answer: A.** '' (empty string)

MiddleName was inserted as the SQL zero-length string '' (stored in ObjectScript as $CHAR(0)), which in InterSystems IRIS is NOT the same as SQL NULL. '' is a valid non-NULL value. IFNULL(MiddleName, 'N/A') returns '' because MiddleName is not NULL — it is a zero-length string. IFNULL only substitutes the fallback when the value IS NULL (represented in ObjectScript by the empty string ""). To get 'N/A', the insert would need VALUES ('John', NULL). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_ifnull))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
A developer writes the following ObjectScript code to check for null values:

ClassMethod IsEmpty(val As %String) As %Boolean
{
    if val = "" quit 1
    quit 0
}

write ##class(MyApp.Utils).IsEmpty(""), " "
write ##class(MyApp.Utils).IsEmpty($CHAR(0)), " "
write ##class(MyApp.Utils).IsEmpty(0)
```

**A.** 1 1 1

**B.** 1 0 0

**C.** 1 0 1

**D.** 1 1 0

### Answer and explanation

**Correct answer: B.** 1 0 0

"" \= "" is 1 (true). $CHAR(0) \= "" is 0 (false, $CHAR(0) is a different string from empty string). 0 \= "" is 0 (false) because the \= operator only performs numeric comparison when BOTH operands have numeric values. The empty string "" is not a numeric value, so this is a string comparison: the string "0" does not equal the empty string "". This is a key behavior of ObjectScript's \= operator. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators))

## Question 11 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

```text
Consider a table with nullable columns:

&sql(INSERT INTO Sample.Order (Total, Discount) VALUES (100, NULL))
set id = %ROWID
&sql(SELECT Total - Discount INTO :net FROM Sample.Order WHERE ID = :id)
write net
```

**A.** 100

**B.** NULL — received as empty string in the host variable

**C.** An error because you cannot subtract NULL

**D.** 0

### Answer and explanation

**Correct answer: B.** NULL — received as empty string in the host variable

In SQL, any arithmetic operation involving NULL returns NULL. 100 \- NULL \= NULL. This is standard SQL behavior and applies in InterSystems IRIS as well. When a NULL result is returned into an embedded SQL host variable, it is received as an empty string. To handle this, use COALESCE: Total \- COALESCE(Discount, 0). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_langelements))

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

```text
A developer needs to distinguish between a property that was never set and one explicitly set to empty. They write:

set obj1 = ##class(Sample.Person).%New()
set obj1.Email = ""
set sc = obj1.%Save()
set id1 = obj1.%Id()

set obj2 = ##class(Sample.Person).%New()
; Email is NOT set on obj2
set sc = obj2.%Save()
set id2 = obj2.%Id()

&sql(SELECT COUNT(*) INTO :cnt FROM Sample.Person
     WHERE ID IN (:id1, :id2) AND Email IS NULL)
write cnt
```

**A.** 0 \- neither qualifies as NULL

**B.** 1 \- only the explicitly set empty string is NULL

**C.** 1 \- only the unset property is NULL

**D.** 2 \- both unset and empty string properties are NULL in SQL

### Answer and explanation

**Correct answer: D.** 2 \- both unset and empty string properties are NULL in SQL

In InterSystems IRIS, a property that was never set defaults to "" (empty string), and a property explicitly set to "" stores the same value. The ObjectScript empty string IS the representation of SQL NULL, so both rows project as NULL in SQL and both match IS NULL — cnt \= 2\. Because both paths lead to the same stored value, there is no way at the SQL level to distinguish 'never set' from 'set to empty'. To make a property non-NULL but zero-length, set it to $CHAR(0) (which projects as the SQL zero-length string '', not NULL). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_langelements#GSQL_langelements_null))

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

```text
Consider the following SQL query on a table where some City values are NULL:

&sql(SELECT COUNT(*) INTO :cnt FROM Sample.Person WHERE City <> 'Boston')

The table has 100 rows: 30 have City = 'Boston', 50 have other cities, and 20 have City IS NULL. What is cnt?
```

**A.** 70 \- all rows that are not Boston (including NULL)

**B.** 50 \- only rows with a non-NULL city that is not Boston

**C.** 100 \- all rows

**D.** 20 \- only the NULL rows

### Answer and explanation

**Correct answer: B.** 50 \- only rows with a non-NULL city that is not Boston

In SQL, NULL \<\> 'Boston' evaluates to UNKNOWN (not TRUE). Rows where the comparison evaluates to UNKNOWN are excluded from the result set. Only the 50 rows with an actual non-NULL, non-Boston city satisfy the WHERE clause. To include NULL rows, use: WHERE City \<\> 'Boston' OR City IS NULL. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_langelements))

## Question 14 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

```text
A developer writes a method that processes global data and encounters $CHAR(0):

set ^data(1) = "Hello" _ $CHAR(0) _ "World"
set val = ^data(1)
write $LENGTH(val), " "
write $PIECE(val, $CHAR(0), 1), " "
write $PIECE(val, $CHAR(0), 2)
```

**A.** 5 Hello (nothing after second space)

**B.** 10 Hello World

**C.** 11 Hello World

**D.** 0 (empty) (empty)

### Answer and explanation

**Correct answer: C.** 11 Hello World

$CHAR(0) is a single character, so "Hello" (5) \+ $CHAR(0) (1) \+ "World" (5) \= 11 characters total. $PIECE with $CHAR(0) delimiter correctly splits the string: piece 1 \= "Hello", piece 2 \= "World". The NUL character is stored and preserved in globals just like any other character. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fchar))

## Question 15 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

```text
Consider the following SQL statements:

&sql(CREATE TABLE Sample.NullTest (A VARCHAR(10), B VARCHAR(10)))
&sql(INSERT INTO Sample.NullTest VALUES ('X', NULL))
&sql(INSERT INTO Sample.NullTest VALUES (NULL, 'Y'))
&sql(INSERT INTO Sample.NullTest VALUES (NULL, NULL))

&sql(SELECT COUNT(*) INTO :cnt FROM Sample.NullTest
     WHERE COALESCE(A, B, 'none') = 'none')
write cnt
```

**A.** 0

**B.** 1

**C.** 2

**D.** 3

### Answer and explanation

**Correct answer: B.** 1

COALESCE returns the first non-NULL argument. Row 1: COALESCE('X', NULL, 'none') \= 'X'. Row 2: COALESCE(NULL, 'Y', 'none') \= 'Y'. Row 3: COALESCE(NULL, NULL, 'none') \= 'none'. Only row 3 produces 'none', so cnt \= 1\. COALESCE is essential for providing fallback values when columns may be NULL. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_coalesce))

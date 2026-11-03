[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T3.2: ObjectScript and SQL Features — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
Which of the following is the result of this expression?

"A" + "B"
```

**A.** "AB"

**B.** \<SYNTAX\>

**C.** "0"

**D.** \<COMMAND\>

**E.** 0

### Answer and explanation

**Correct answer: E.** 0

ObjectScript is weakly typed and the \+ operator is always arithmetic addition. When a string does not begin with a digit, its numeric value is 0\. Both "A" and "B" evaluate to 0, so "A" \+ "B" \= 0 \+ 0 \= 0\. String concatenation requires the \_ operator, not \+. No error is thrown because type coercion is automatic. (Reference: InterSystems Practice Question Q16; [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_arith))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

```text
Consider the following columns in a table:

Property UTCPurchaseDate As %Date;
Property LocalPurchaseDate As %Date;

Your application has a query that retrieves these dates so they can be sent to two different external systems. Currently, both dates are returned in logical format. However, UTCPurchaseDate must be sent in ODBC format while LocalPurchaseDate must stay in logical format.

Which of the following enforces the returned value of UTCPurchaseDate to be ODBC while keeping LocalPurchaseDate in logical format?
```

**A.** Call $SYSTEM.SQL.Util.SetOption("SelectMode", 1\) to set SelectMode to ODBC before the query

**B.** Set the Display Mode to ODBC in the Management Portal Execute Query interface

**C.** Call ##class(%SQL.Statement).%New(1) to set the SelectMode of the query to ODBC

**D.** Use the %ODBCOUT function in the SQL query on the UTCPurchaseDate column

### Answer and explanation

**Correct answer: D.** Use the %ODBCOUT function in the SQL query on the UTCPurchaseDate column

The %ODBCOUT function can be applied to individual columns within a query to convert them to ODBC format while leaving other columns in their current mode. Options A, B, and C would change the mode for ALL columns in the query, not just UTCPurchaseDate. Only %ODBCOUT provides per-column format control. (Reference: InterSystems Practice Question Q10; [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_selectmode))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
Consider the following class:

Class Sample.Person Extends %RegisteredObject
{

ClassMethod ProcessAddress(Address As %String)
{
    #Include Sample.AreaCodes
    set code = $$$FindAreaCode($P(Address, " "))
    //Omitted
}

}

The class previously compiled successfully. After editing the method to add a new line, you get:

ERROR: Sample.Person.cls
ERROR:  Sample.Person.1(5) : MPP5610 : Referenced macro not defined: 'FindAreaCode'

Which of the following is the most likely source of the error?
```

**A.** The new code added to the method has a syntax error

**B.** The new code modified the Address string so it is no longer accepted by the FindAreaCode macro

**C.** IRIS received an update that removed the FindAreaCode macro

**D.** There is no include file \- the #Include is inside the method body instead of at the class level

### Answer and explanation

**Correct answer: D.** There is no include file \- the #Include is inside the method body instead of at the class level

The #Include directive must be placed at the class level, not inside a method body. When #Include appears inside a method, it is not processed as a preprocessor directive. The class previously compiled by coincidence or the #Include was in the correct location before editing. The #Include should be moved to the top of the class definition or specified using the class keyword Include \= "Sample.AreaCodes". (Reference: InterSystems Practice Question Q21; [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_macros#GCOS_macros_include))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
What is the result of the following ObjectScript expression?

write "10abc20" + 5
```

**A.** 15

**B.** "10abc205"

**C.** An \<ILLEGAL VALUE\> error

**D.** 5

### Answer and explanation

**Correct answer: A.** 15

ObjectScript's weak typing converts strings to numbers by extracting the leading numeric portion. The string "10abc20" has a numeric value of 10 (parsing stops at 'a', the first non-numeric character). Therefore 10 \+ 5 \= 15\. No error is thrown because automatic type coercion is a core feature of ObjectScript. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_arith))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
Consider a table Sample.Person with an Email field. The following SQL statements were executed:

&sql(INSERT INTO Sample.Person (Email) VALUES (''))
&sql(INSERT INTO Sample.Person (Email) VALUES (''))
&sql(INSERT INTO Sample.Person (Email) VALUES (NULL))

Assuming no other records, what will be the value of x when:

&sql(SELECT COUNT(*) INTO :x FROM Sample.Person WHERE Email IS NULL)
```

**A.** 0

**B.** 1

**C.** 2

**D.** 3

### Answer and explanation

**Correct answer: B.** 1

In InterSystems IRIS, SQL '' (zero-length string) and SQL NULL are NOT the same. Inserting '' stores $C(0) in the ObjectScript layer (a distinct, length-1 non-NULL value); inserting NULL stores "" (the ObjectScript empty string, which is how IRIS represents SQL NULL). The IS NULL condition matches only the rows stored as "", so only the one explicit NULL insert matches. COUNT(\*) returns 1\. The two '' inserts are SQL zero-length strings — valid non-NULL values that would be found by \`Email \= ''\` instead. (Reference: InterSystems Practice Question Q11; [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_langelements#GSQL_langelements_null))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
A developer writes the following class:

Class MyApp.Utils Extends %RegisteredObject
{

ClassMethod Calculate() As %Status
{
    // business logic
    return $$$OK
}

}

The class fails to compile with an error about $$$OK being an undefined macro. What is the fix?
```

**A.** Replace $$$OK with the literal value 1

**B.** Add Include %occInclude at the class level

**C.** Replace return with quit

**D.** $$$OK is only available in %Persistent classes, not %RegisteredObject

### Answer and explanation

**Correct answer: B.** Add Include %occInclude at the class level

$$$OK is a macro defined in the %occInclude include file (which itself includes %occStatus). The class-level keyword is 'Include' (placed before the Class keyword), not '#Include' (which is a preprocessor directive used inside method bodies). Without an Include directive, the compiler cannot resolve the macro. Adding 'Include %occInclude' at the class level makes $$$OK, $$$ISERR, $$$ThrowOnError, and other standard macros available. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_macros#GCOS_macros_include))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

```text
Consider the following embedded SQL code:

&sql(SELECT Name, DOB INTO :name, :dob FROM Sample.Person WHERE ID = 999)
if SQLCODE = 0 {
    write "Found: ", name
} elseif SQLCODE = 100 {
    write "Not found"
} else {
    write "Error: ", SQLCODE
}

If no row with ID 999 exists, what is displayed?
```

**A.** Found: followed by an empty string

**B.** Not found

**C.** Error: -1

**D.** An \<UNDEFINED\> error because SQLCODE is not defined

### Answer and explanation

**Correct answer: B.** Not found

When an embedded SQL SELECT INTO finds no matching rows, SQLCODE is set to 100\. SQLCODE \= 0 means successful execution with data returned. Negative SQLCODE values indicate actual errors. The code correctly checks for SQLCODE \= 100, so "Not found" is displayed. SQLCODE is automatically available as a local variable after any \&sql() statement. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_sqlcode))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

```text
A developer writes the following dynamic SQL:

set stmt = ##class(%SQL.Statement).%New()
set sc = stmt.%Prepare("SELECT Name, DOB FROM Sample.Person WHERE City = ?")
set rs = stmt.%Execute("Boston")
while rs.%Next() {
    write rs.%Get("Name"), " - ", rs.%Get("DOB"), !
}

The DOB column is a %Date property. When using the default SelectMode, what format will DOB be displayed in?
```

**A.** ODBC format (e.g., 2025-01-15)

**B.** Display format (e.g., 01/15/2025)

**C.** Logical format (e.g., 67339 \- integer days since 12/31/1840)

**D.** ISO 8601 format (e.g., 2025-01-15T00:00:00Z)

### Answer and explanation

**Correct answer: C.** Logical format (e.g., 67339 \- integer days since 12/31/1840)

The default SelectMode for Dynamic SQL (%SQL.Statement) is Logical mode (mode 0). In Logical mode, %Date properties are returned as their internal integer representation (days since December 31, 1840). To get ODBC format, pass 1 to %New(): ##class(%SQL.Statement).%New(1). To get Display format, pass 2\. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_selectmode))

## Question 9 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

```text
Consider the following class:

Class MyApp.Order Extends %Persistent
{
Property OrderDate As %Date;
Property Total As %Numeric;
Property Status As %String;
}

What SQL table and column names are generated by default?
```

**A.** Table: MyApp.Order, Columns: ID, OrderDate, Total, Status

**B.** Table: MyApp\_Order, Columns: OrderDate, Total, Status

**C.** Table: MyApp.Order, Columns: order\_date, total, status

**D.** Table: MYAPP\_ORDER, Columns: ORDERDATE, TOTAL, STATUS

### Answer and explanation

**Correct answer: A.** Table: MyApp.Order, Columns: ID, OrderDate, Total, Status

InterSystems IRIS projects persistent classes to SQL using the package name as the SQL schema and the class name as the table name. For Class MyApp.Order, the schema is MyApp and the table is Order, giving a fully qualified name of MyApp.Order (dot notation). The underscore convention (e.g., MyApp\_Data) only applies when the package itself contains dots (e.g., MyApp.Data). Property names become column names preserving their original case, and every persistent table also has an implicit ID column. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_projections))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
A developer executes the following code:

&sql(INSERT INTO Sample.Person (Name, City) VALUES ('Jane Doe', 'Boston'))
write "SQLCODE: ", SQLCODE, !
write "ROWCOUNT: ", %ROWCOUNT, !
write "ROWID: ", %ROWID, !

The insert succeeds. Which output is correct?
```

**A.** SQLCODE: 0, ROWCOUNT: 0, ROWID: (empty)

**B.** SQLCODE: 0, ROWCOUNT: 1, ROWID: (the new row's ID)

**C.** SQLCODE: 1, ROWCOUNT: 1, ROWID: (the new row's ID)

**D.** SQLCODE: 100, ROWCOUNT: 1, ROWID: (the new row's ID)

### Answer and explanation

**Correct answer: B.** SQLCODE: 0, ROWCOUNT: 1, ROWID: (the new row's ID)

After a successful INSERT: SQLCODE \= 0 (success), %ROWCOUNT \= 1 (one row inserted), and %ROWID contains the RowID of the newly inserted row. SQLCODE \= 100 means no data found (used for SELECT). SQLCODE \= 1 is not a standard value. %ROWID is particularly useful for retrieving the auto-assigned ID of a new row. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_variables))

## Question 11 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

```text
What is the result of the following ObjectScript expressions?

set a = "3.14abc" + 1
set b = "abc3.14" + 1
set c = "" + 1
write a, " ", b, " ", c
```

**A.** 4.14 4.14 1

**B.** 4.14 1 1

**C.** An error on the second expression

**D.** 4.14 1 0

### Answer and explanation

**Correct answer: B.** 4.14 1 1

ObjectScript extracts the leading numeric portion of a string for arithmetic. "3.14abc" has numeric value 3.14, so a \= 4.14. "abc3.14" starts with a non-digit, so its numeric value is 0, making b \= 1\. The empty string "" has numeric value 0, so c \= 1\. No errors are thrown \- weak typing silently coerces all values. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_arith))

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

```text
Consider the following macro definitions and usage:

Include MyApp.Constants

Class MyApp.Tax Extends %RegisteredObject
{

ClassMethod GetTax(amount As %Numeric) As %Numeric
{
    return amount * $$$TaxRate
}

}

The include file MyApp.Constants.inc contains:

#Define TaxRate 0.07
#Define MaxAmount 10000

What does GetTax(100) return?
```

**A.** An error because macros cannot be used in arithmetic expressions

**B.** 7

**C.** 0.07

**D.** "0.07" (as a string)

### Answer and explanation

**Correct answer: B.** 7

Macros are resolved at compile time by simple text substitution. $$$TaxRate is replaced with 0.07 before compilation, so the method body becomes: return amount \* 0.07. At runtime, 100 \* 0.07 \= 7\. Macros are compile-time constants and work seamlessly in any expression where their replacement text is valid. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_macros))

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

```text
A developer needs to run a SQL query whose text is constructed from user input. They write:

set tableName = userInput
set sql = "SELECT * FROM " _ tableName _ " WHERE Status = ?"
set stmt = ##class(%SQL.Statement).%New()
set sc = stmt.%Prepare(sql)
set rs = stmt.%Execute("Active")

Which type of SQL is this, and what is a key concern?
```

**A.** Embedded SQL; the concern is that it requires class recompilation when the query changes

**B.** Dynamic SQL; the concern is SQL injection risk because tableName is concatenated directly

**C.** Dynamic SQL; there is no concern because the ? parameter protects against SQL injection

**D.** Embedded SQL; the concern is that userInput may contain invalid characters

### Answer and explanation

**Correct answer: B.** Dynamic SQL; the concern is SQL injection risk because tableName is concatenated directly

This is Dynamic SQL using %SQL.Statement. While the Status value is safely parameterized with ?, the tableName is directly concatenated into the SQL string, creating a SQL injection vulnerability. Parameters (?) only work for values in WHERE clauses, not for table or column names. The table name should be validated against a whitelist before use. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_dynsql))

## Question 14 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

```text
A developer writes a cursor-based query:

&sql(DECLARE personCursor CURSOR FOR
     SELECT Name, City FROM Sample.Person WHERE Status = 'Active')
&sql(OPEN personCursor)
set count = 0
for {
    &sql(FETCH personCursor INTO :name, :city)
    quit:SQLCODE'=0
    set count = count + 1
}
&sql(CLOSE personCursor)
write "Processed: ", count, " rows. ROWCOUNT: ", %ROWCOUNT

If 5 rows match, what does %ROWCOUNT contain after the loop?
```

**A.** 0

**B.** 5

**C.** 6 (5 successful fetches plus 1 failed fetch)

**D.** 1 (only the last fetch counts)

### Answer and explanation

**Correct answer: B.** 5

After a cursor FETCH loop, %ROWCOUNT contains the number of rows successfully fetched. The final FETCH that sets SQLCODE \= 100 (no more data) does not increment %ROWCOUNT. So %ROWCOUNT \= 5, matching the count variable. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_variables#RSQL_variables_rowcount))

## Question 15 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

```text
Consider the following code:

set x = "5 apples"
set y = "3 oranges"
write x + y, " ", x _ y
```

**A.** 8 5 apples3 oranges

**B.** "5 apples3 oranges" "5 apples3 oranges"

**C.** An error because you cannot add strings containing spaces

**D.** 8 53

### Answer and explanation

**Correct answer: A.** 8 5 apples3 oranges

The \+ operator performs arithmetic: "5 apples" has numeric value 5 and "3 oranges" has numeric value 3, so 5 \+ 3 \= 8\. The \_ operator performs string concatenation: "5 apples" \_ "3 oranges" \= "5 apples3 oranges". This demonstrates the fundamental difference between \+ (arithmetic) and \_ (concatenation) in ObjectScript's weak typing system. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators))

## Question 16 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q16.md>)

```text
A developer writes the following embedded SQL:

&sql(UPDATE Sample.Person SET Status = 'Inactive' WHERE City = 'Boston')
write "Rows updated: ", %ROWCOUNT, !
write "SQLCODE: ", SQLCODE, !

If 50 rows have City = 'Boston', what output is produced?
```

**A.** Rows updated: 1, SQLCODE: 0

**B.** Rows updated: 50, SQLCODE: 0

**C.** Rows updated: 50, SQLCODE: 100

**D.** Rows updated: 0, SQLCODE: 50

### Answer and explanation

**Correct answer: B.** Rows updated: 50, SQLCODE: 0

After a successful UPDATE, SQLCODE \= 0 indicates success and %ROWCOUNT contains the number of rows affected (50). SQLCODE \= 100 is for 'no data found' in SELECT queries, not for UPDATE. %ROWCOUNT always reflects the actual count of modified rows, not just 0 or 1\. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_variables))

## Question 17 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q17.md>)

```text
Consider the following class definition:

Class MyApp.Employee Extends %Persistent
{
Property Name As %String;
Property HireDate As %Date;
Property Salary As %Numeric;
ClassMethod GetTopEarners(minSalary As %Numeric) As %SQL.StatementResult [ SqlProc, SqlName = GetTopEarners ]
{
    set sql = "SELECT Name, Salary FROM MyApp.Employee WHERE Salary >= ?"
    set stmt = ##class(%SQL.Statement).%New()
    set sc = stmt.%Prepare(sql)
    quit stmt.%Execute(minSalary)
}
}

Which statements about the SQL projection of this class are true?
```

**A.** The table is MyApp.Employee with columns Name, HireDate, Salary; GetTopEarners is NOT available as a SQL procedure

**B.** The table is MyApp.Employee with columns Name, HireDate, Salary; GetTopEarners is available as a SQL stored procedure

**C.** The table is Employee with columns Name, HireDate, Salary; GetTopEarners is available as a SQL function

**D.** The class cannot have both properties and SqlProc methods

### Answer and explanation

**Correct answer: B.** The table is MyApp.Employee with columns Name, HireDate, Salary; GetTopEarners is available as a SQL stored procedure

The %Persistent class projects as table MyApp.Employee (schema MyApp, table Employee) with properties as columns. The GetTopEarners ClassMethod is explicitly marked with the SqlProc keyword and SqlName, so it projects as a SQL stored procedure callable via CALL MyApp.GetTopEarners(50000). Without the SqlProc keyword, ClassMethods are NOT projected to SQL. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_projections))

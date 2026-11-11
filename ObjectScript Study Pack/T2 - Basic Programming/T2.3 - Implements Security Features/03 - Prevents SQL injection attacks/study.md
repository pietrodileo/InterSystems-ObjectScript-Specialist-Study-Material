[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T2.3: Implements Security Features

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T2.3.html). Reference links require internet access.

## 3. Prevents SQL injection attacks

![T2.3 visual summary of sections 1–4: 1. Ensures appropriate variable and global use to avoid security leaks; 2. Checks roles for permission control; 3. Prevents SQL injection attacks; 4. Implements embedded SQL permission checks](../visual-guide-01-v3.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **Parameterized queries**: Use ? placeholders with %SQL.Statement to prevent injection
- **Host variables in embedded SQL**: Use :variable syntax; values are bound safely, not concatenated
- **Never concatenate user input**: String concatenation in SQL queries is the primary injection vector
- **%SQL.Statement**: The recommended dynamic SQL interface with built-in parameterization
- **Input validation**: Defense-in-depth -- validate and sanitize input even when using parameters

### Detailed Notes

#### The SQL Injection Problem

SQL injection occurs when user-provided input is directly concatenated into a SQL string, allowing an attacker to alter the query logic:

```objectscript
 // VULNERABLE: Direct string concatenation
 SET sql = "SELECT * FROM Patient WHERE Name = '" _ userInput _ "'"
 // If userInput = "' OR 1=1 --", the query becomes:
 // SELECT * FROM Patient WHERE Name = '' OR 1=1 --'
 // This returns ALL patients!
```

#### Prevention with %SQL.Statement and ? Parameters

The correct approach uses parameterized queries where user input is bound as parameters, never interpolated into the SQL string:

```objectscript
 SET stmt = ##class(%SQL.Statement).%New()
 SET sc = stmt.%Prepare("SELECT Name, DOB FROM Patient WHERE PatientId = ?")
 IF $$$ISERR(sc) {
     WRITE "Prepare error: ", $SYSTEM.Status.GetErrorText(sc), !
     QUIT
 }

 // Execute with parameter -- safely bound regardless of content
 SET rs = stmt.%Execute(userInput)
 WHILE rs.%Next() {
     WRITE rs.Name, " - ", rs.DOB, !
 }
```

Multiple parameters:

```objectscript
 SET sc = stmt.%Prepare("SELECT * FROM Patient WHERE State = ? AND Age > ?")
 SET rs = stmt.%Execute(stateInput, ageInput)
```

#### Safe Embedded SQL with Host Variables

Embedded SQL automatically uses safe binding through host variables (prefixed with colon):

```objectscript
 // SAFE: Host variables are bound, not concatenated
 SET patientName = userInput
 &sql(SELECT DOB, Phone INTO :dob, :phone
      FROM Patient
      WHERE Name = :patientName)
 IF SQLCODE = 0 {
     WRITE "DOB: ", dob, !
 }
```

The colon-prefixed variables (:patientName, :dob, :phone) are treated as bound parameters by the SQL engine, making injection impossible through these values.

#### Dynamic Table/Column Names

When table or column names must be dynamic (which parameters cannot handle), use a whitelist approach:

```objectscript
 // Validate against a known whitelist
 SET allowedTables = $LISTBUILD("Patient", "Appointment", "Provider")
 IF '$LISTFIND(allowedTables, tableName) {
     WRITE "Invalid table name", !
     QUIT
 }
 // Now safe to use in query construction
 SET sql = "SELECT * FROM " _ tableName _ " WHERE Id = ?"
 SET sc = stmt.%Prepare(sql)
 SET rs = stmt.%Execute(idValue)  // idValue still parameterized
```

#### Defense in Depth: Input Validation

Even with parameterized queries, validate input as an additional layer:

```objectscript
 // Validate expected format
 IF patientId '?1.N {
     // Not a valid numeric ID
     WRITE "Invalid patient ID format", !
     QUIT
 }
 SET rs = stmt.%Execute(patientId)
```

### Documentation References

- [Using Dynamic SQL](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_dynsql)
- [%SQL.Statement](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_dynsql#GSQL_dynsql_statement)
- [Embedded SQL](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_esql)

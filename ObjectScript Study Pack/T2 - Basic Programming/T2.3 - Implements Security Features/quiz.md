[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T2.3: Security Features — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
Consider the following class method:

ClassMethod CreateAccount(name As %String, password As %String) As %Status
{
    set oref = ##class(Sample.Person).%New()
    set oref.name = name
    set oref.pswd = password
    //Rest of code
}

This class method contains sensitive code that should only be executed by users who have read and write privileges on the %Create_Account resource.

Which of the following shows how this can be protected against unprivileged execution?
```

**A.** ```text
ClassMethod CreateAccount(name As %String, password As %String) As %Status
{
    if $ROLES [ "%Create_Account:R,W" {
       set oref = ##class(Sample.Person).%New()
       set oref.name = name
       set oref.pswd = password
    } else {
        return $$$ERROR("NO PERMISSION")
    }
}
```

**B.** ```text
ClassMethod CreateAccount(name As %String, password As %String) As %Status
{
    if $USERNAME = "Administrator" {
       set oref = ##class(Sample.Person).%New()
       set oref.name = name
       set oref.pswd = password
    } else {
        return $$$ERROR("NO PERMISSION")
    }
}
```

**C.** ```text
ClassMethod CreateAccount(name As %String, password As %String) As %Status [ Requires = "%Create_Account:RW" ]
{
    set oref = ##class(Sample.Person).%New()
    set oref.name = name
    set oref.pswd = password
    //Rest of code
}
```

**D.** ```text
ClassMethod CreateAccount(name As %String, password As %String) As %Status
{
    if System.Security.Check("%Create_Account", "U") {
       set oref = ##class(Sample.Person).%New()
       set oref.name = name
       set oref.pswd = password
    } else {
        return $$$ERROR("NO PERMISSION")
    }
}
```

### Answer and explanation

**Correct answer: C.** ```text
ClassMethod CreateAccount(name As %String, password As %String) As %Status [ Requires = "%Create_Account:RW" ]
{
    set oref = ##class(Sample.Person).%New()
    set oref.name = name
    set oref.pswd = password
    //Rest of code
}
```

The Requires keyword is the correct mechanism for enforcing resource-based security on a method. Option (a) checks $ROLES, but $ROLES contains role names not resource permissions, and the \[ operator can produce false matches. Option (b) hardcodes a username, which is fragile and not resource-based. Option (d) uses incorrect syntax (should be $SYSTEM.Security.Check) and checks "U" (USE) instead of RW. The Requires keyword declaratively enforces that the caller must have RW permission on %Create\_Account before the method body executes. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_method_requires))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

```text
A developer writes the following method:

ClassMethod DeletePatient(id As %Integer) As %Status [ Requires = "%Admin_Manage:RW" ]
{
  SET sc = ##class(Patient).%DeleteId(id)
  QUIT sc
}

A user who does NOT have RW permission on %Admin_Manage calls this method. What happens?
```

**A.** The method executes but returns an error %Status

**B.** The method executes with read-only behavior, skipping the delete

**C.** A \<PROTECT\> error is thrown before the method body executes

**D.** The method silently returns $$$OK without executing

### Answer and explanation

**Correct answer: C.** A \<PROTECT\> error is thrown before the method body executes

When a method has the Requires keyword, the system checks the caller's privileges before executing the method body. If the user does not hold the required permission (RW on %Admin\_Manage), a \<PROTECT\> error is thrown immediately. No code inside the method runs. This is a declarative security enforcement mechanism. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_method_requires))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
A developer needs to check at runtime whether the current user has the "AppAdmin" role. They write:

IF $ROLES [ "AppAdmin" {
  ; grant admin access
}

A tester logs in with only the "SuperAppAdmin" role and gains admin access. What went wrong?
```

**A.** $ROLES is encrypted and cannot be checked with the \[ operator

**B.** The \[ (contains) operator matches substrings, so "SuperAppAdmin" contains "AppAdmin" and produces a false positive

**C.** $ROLES only works inside class methods, not in routines

**D.** The IF syntax is incorrect; it should be IF ($ROLES \[ "AppAdmin")

### Answer and explanation

**Correct answer: B.** The \[ (contains) operator matches substrings, so "SuperAppAdmin" contains "AppAdmin" and produces a false positive

The \[ (contains) operator checks if the right operand is a substring of the left operand. Since "SuperAppAdmin" contains "AppAdmin" as a substring, the check succeeds incorrectly. A safer approach is to parse $ROLES with $PIECE using the comma delimiter and check for an exact match, or use $LISTFROMSTRING($ROLES, ",") and $LISTFIND for exact role matching. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_vroles))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
A developer writes two versions of a sensitive method:

Version A:
ClassMethod Transfer(from, to, amt) As %Status [ Requires = "%Financial:RW" ]
{
  ; transfer logic
}

Version B:
ClassMethod Transfer(from, to, amt) As %Status
{
  IF '$SYSTEM.Security.Check("%Financial", "RW") {
    QUIT $$$ERROR($$$GeneralError, "Insufficient privileges")
  }
  ; transfer logic
}

What is the key difference between these approaches?
```

**A.** Version A checks permissions at compile time; Version B checks at runtime

**B.** Version A throws a \<PROTECT\> error automatically before the method body runs; Version B returns an error status that the caller must handle

**C.** Version A only works for ClassMethods; Version B works for both ClassMethods and instance Methods

**D.** Version A requires the resource to exist in the system; Version B does not

### Answer and explanation

**Correct answer: B.** Version A throws a \<PROTECT\> error automatically before the method body runs; Version B returns an error status that the caller must handle

Both check permissions at runtime. The key difference is the failure behavior: Requires (Version A) throws a \<PROTECT\> error before any method code executes, which is an exception. $SYSTEM.Security.Check (Version B) allows the developer to handle the failure gracefully by returning an error status. Version B gives more control over error handling, while Version A is simpler and more declarative. Both work for ClassMethods and instance Methods. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_method_requires))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
A web application accepts a patient name from user input and searches the database:

ClassMethod Search(name As %String) As %Status
{
  SET sql = "SELECT * FROM Patient WHERE Name = '"_name_"'"
  SET stmt = ##class(%SQL.Statement).%New()
  SET sc = stmt.%Prepare(sql)
  SET rs = stmt.%Execute()
  ; process results
}

An attacker enters the following as the name parameter:

' OR 1=1 --

What happens?
```

**A.** The query returns no results because the name does not match any patient

**B.** A \<SYNTAX\> error is thrown because the SQL is malformed

**C.** The query returns ALL patient records because the injected OR 1\=1 always evaluates to true, and \-- comments out the rest

**D.** The %Prepare method rejects the query because it detects the injection attempt

### Answer and explanation

**Correct answer: C.** The query returns ALL patient records because the injected OR 1\=1 always evaluates to true, and \-- comments out the rest

This is a classic SQL injection attack. The user input is concatenated directly into the SQL string, producing: SELECT \* FROM Patient WHERE Name \= '' OR 1\=1 --'. The OR 1\=1 condition is always true, so all rows are returned. The \-- comments out the trailing quote. The %Prepare method does not detect injection; it simply prepares whatever SQL string is given. Parameterized queries with ? placeholders prevent this. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_dynsql))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
Consider the following two implementations of a patient search:

Version A:
SET sql = "SELECT * FROM Patient WHERE Name = ?" 
SET stmt = ##class(%SQL.Statement).%New()
SET sc = stmt.%Prepare(sql)
SET rs = stmt.%Execute(userInput)

Version B:
SET sql = "SELECT * FROM Patient WHERE Name = '"_userInput_"'"
SET stmt = ##class(%SQL.Statement).%New()
SET sc = stmt.%Prepare(sql)
SET rs = stmt.%Execute()

Which statement is correct?
```

**A.** Version A is vulnerable because ? allows arbitrary input to bypass the query

**B.** Version B is vulnerable because user input is concatenated directly into the SQL string, enabling SQL injection

**C.** Both are equally secure because %SQL.Statement sanitizes input automatically

**D.** Neither is vulnerable because InterSystems IRIS prevents SQL injection at the database level

### Answer and explanation

**Correct answer: B.** Version B is vulnerable because user input is concatenated directly into the SQL string, enabling SQL injection

Version B concatenates user input directly into the SQL string, allowing SQL injection. An attacker can inject malicious SQL (e.g., ' OR 1\=1 --). Version A uses a parameterized query with ?, passing the value separately via %Execute(userInput). The parameter is always treated as data, never as SQL code, completely preventing injection. %SQL.Statement does NOT auto-sanitize concatenated strings. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_dynsql))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

```text
A developer stores sensitive query results during processing:

ClassMethod ProcessReport(query As %String)
{
  SET stmt = ##class(%SQL.Statement).%New()
  SET sc = stmt.%Prepare(query)
  SET rs = stmt.%Execute()
  WHILE rs.%Next() {
    SET ^||results($I(^||results)) = rs.%GetData(1)_"|"_rs.%GetData(2)
  }
  ; process ^||results
  ; ... done, process ends
}

What security benefit does using ^||results provide over ^results?
```

**A.** ^\|\|results is encrypted at rest while ^results is not

**B.** ^\|\|results is isolated to the current process and automatically cleaned up when the process ends, preventing data leakage between concurrent processes

**C.** ^\|\|results is stored in a separate, access-controlled database

**D.** ^\|\|results cannot be viewed in the Management Portal

### Answer and explanation

**Correct answer: B.** ^\|\|results is isolated to the current process and automatically cleaned up when the process ends, preventing data leakage between concurrent processes

Process-private globals (^\|\|) are visible only to the creating process. Using ^\|\|results ensures no other process can access the sensitive query results, and they are automatically deleted when the process ends. With ^results, concurrent processes could see each other's data, and the data would persist after the process ends unless explicitly killed. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_globals#GCOS_globals_ppg))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

```text
A developer needs to programmatically check if the current user can access the %DB_PRODUCTION database resource before attempting an operation:

IF $SYSTEM.Security.Check("%DB_PRODUCTION", "RW") {
  ; perform database write operations
} ELSE {
  SET sc = $$$ERROR($$$GeneralError, "No write access to production database")
}

What does $SYSTEM.Security.Check return?
```

**A.** A %Status value that must be checked with $$$ISOK

**B.** 1 if the user has the specified permission on the resource, 0 otherwise

**C.** The name of the role that grants the permission

**D.** A comma-delimited list of all permissions the user has on the resource

### Answer and explanation

**Correct answer: B.** 1 if the user has the specified permission on the resource, 0 otherwise

$SYSTEM.Security.Check(resource, permission) returns 1 if the current user has the specified permission on the given resource, and 0 otherwise. This is the standard programmatic way to verify resource-based privileges at runtime. It checks the effective permissions based on all roles assigned to the user. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCAS_rsrcs))

## Question 9 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

A developer needs to protect a method that manages user accounts. Which of the following are valid approaches to restrict execution?

**A.** ClassMethod ManageUser() \[ Requires \= "%Admin\_Secure:USE" \] to enforce resource-based security declaratively

**B.** Checking $ROLES within the method body and returning an error if the required role is absent

**C.** Using $SYSTEM.Security.Check() inside the method to verify privileges programmatically

**D.** Making the method Private so only the same class can call it

**E.** Using the Encrypted keyword to prevent unauthorized access to the method

### Answer and explanation

**Correct answer: A.** ClassMethod ManageUser() \[ Requires \= "%Admin\_Secure:USE" \] to enforce resource-based security declaratively

**Correct answer: B.** Checking $ROLES within the method body and returning an error if the required role is absent

**Correct answer: C.** Using $SYSTEM.Security.Check() inside the method to verify privileges programmatically

**Correct answer: D.** Making the method Private so only the same class can call it

All four approaches provide different levels of protection. Requires enforces resource-based security declaratively (throws \<PROTECT\> on failure). Checking $ROLES provides role-based authorization. $SYSTEM.Security.Check offers programmatic privilege verification with custom error handling. Private restricts access to the same class (encapsulation, not security per se, but limits the attack surface). There is no Encrypted keyword for methods. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_method_requires))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

A database administrator needs to grant a nurse role the ability to read patient data but not modify it. Which SQL statement is correct?

**A.** GRANT SELECT ON Patient TO NurseRole

**B.** GRANT READ ON Patient TO NurseRole

**C.** ALLOW SELECT ON Patient FOR NurseRole

**D.** GRANT SELECT, INSERT ON Patient TO NurseRole

### Answer and explanation

**Correct answer: A.** GRANT SELECT ON Patient TO NurseRole

GRANT SELECT ON Patient TO NurseRole grants read-only access. SELECT is the SQL privilege for reading data. There is no READ privilege or ALLOW command in SQL. Option (d) would also grant INSERT (write) permission, which is not what was requested. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_grant))

## Question 11 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

```text
A database administrator executes the following SQL statements:

GRANT SELECT, INSERT ON Patient TO NurseRole
GRANT ALL PRIVILEGES ON Patient TO AdminRole
GRANT SELECT ON Patient TO NurseRole WITH GRANT OPTION
GRANT EXECUTE ON GetPatientHistory TO NurseRole

Which of these GRANT statements are valid in InterSystems IRIS SQL?
```

**A.** GRANT SELECT, INSERT ON Patient TO NurseRole

**B.** GRANT ALL PRIVILEGES ON Patient TO AdminRole

**C.** GRANT SELECT ON Patient TO NurseRole WITH GRANT OPTION

**D.** GRANT EXECUTE ON GetPatientHistory TO NurseRole

**E.** GRANT SELECT ON Patient TO NurseRole EXCEPT COLUMN SSN

### Answer and explanation

**Correct answer: A.** GRANT SELECT, INSERT ON Patient TO NurseRole

**Correct answer: B.** GRANT ALL PRIVILEGES ON Patient TO AdminRole

**Correct answer: C.** GRANT SELECT ON Patient TO NurseRole WITH GRANT OPTION

**Correct answer: D.** GRANT EXECUTE ON GetPatientHistory TO NurseRole

All four of the statements shown are valid: several privileges can be granted in one statement, ALL PRIVILEGES grants every applicable privilege on the table, WITH GRANT OPTION lets the grantee pass the privilege on, and EXECUTE can be granted on a stored procedure. EXCEPT COLUMN is not InterSystems SQL syntax \-- column-level control is expressed by naming the columns you DO grant, as in GRANT SELECT (Name, MRN) ON Patient TO NurseRole, not by subtracting one. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_grant))

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

```text
A developer writes Embedded SQL that updates patient records:

&sql(UPDATE Patient SET Status = 'Active' WHERE PatientId = :patId)

The user running this code has SELECT privilege on Patient but NOT UPDATE. What happens?
```

**A.** The UPDATE executes successfully because Embedded SQL bypasses SQL privilege checks

**B.** A \<PROTECT\> error is thrown at the ObjectScript level

**C.** SQLCODE is set to a negative value indicating a privilege error, and %msg contains the error description

**D.** The UPDATE silently does nothing and SQLCODE is set to 100 (no rows)

### Answer and explanation

**Correct answer: A.** The UPDATE executes successfully because Embedded SQL bypasses SQL privilege checks

Embedded SQL does NOT check SQL privileges. The InterSystems documentation states: 'Embedded SQL statements do not perform privilege checking; it is assumed that applications using Embedded SQL will check for privileges before using Embedded SQL statements.' Therefore the UPDATE executes successfully regardless of the user's SQL privileges. SQL privilege enforcement only applies to Dynamic SQL, ODBC, JDBC, and the SQL Shell. Developers who need privilege checking with Embedded SQL should use %CHECKPRIV explicitly before the operation. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_privileges))

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

```text
A developer writes the following code to revoke excessive privileges:

REVOKE INSERT, UPDATE, DELETE ON Patient FROM ReportRole

The ReportRole was previously granted ALL PRIVILEGES on Patient. After this REVOKE, which privileges does ReportRole still hold?
```

**A.** No privileges remain; REVOKE removes all granted privileges

**B.** Only SELECT remains, since INSERT, UPDATE, and DELETE were revoked

**C.** ALL PRIVILEGES minus the three revoked ones, but the exact remaining set depends on the table type

**D.** The REVOKE fails because you cannot partially revoke ALL PRIVILEGES

### Answer and explanation

**Correct answer: C.** ALL PRIVILEGES minus the three revoked ones, but the exact remaining set depends on the table type

REVOKE removes specific privileges. ALL PRIVILEGES on a table includes %ALTER, SELECT, INSERT, UPDATE, DELETE, and REFERENCES. After revoking INSERT, UPDATE, and DELETE, the remaining privileges are SELECT, %ALTER, and REFERENCES — not just SELECT. The exact set of privileges included in ALL PRIVILEGES depends on the object type (table vs view vs procedure), so the remaining privileges after a partial revoke depend on what ALL PRIVILEGES originally granted. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_revoke))

## Question 14 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

```text
A developer writes a search method that accepts user input:

ClassMethod FindOrders(status As %String) As %Status
{
  &sql(DECLARE OrderCursor CURSOR FOR
    SELECT OrderId, Total FROM Orders WHERE Status = :status)
  &sql(OPEN OrderCursor)
  ; process results
}

Is this code vulnerable to SQL injection? Why or why not?
```

**A.** Yes, because the :status host variable is still concatenated into the SQL at runtime

**B.** No, because Embedded SQL with host variables (:status) treats the input as a data value, not as SQL code, preventing injection

**C.** Yes, because DECLARE CURSOR does not support parameterized input

**D.** No, but only because Embedded SQL is compiled at class compile time, making it immune to all runtime attacks

### Answer and explanation

**Correct answer: B.** No, because Embedded SQL with host variables (:status) treats the input as a data value, not as SQL code, preventing injection

Embedded SQL host variables (prefixed with :) are treated as parameterized input. The value of the ObjectScript variable 'status' is passed as data, not interpreted as SQL code. This provides the same SQL injection protection as ? parameters in Dynamic SQL. Even if the user passes malicious input like ' OR 1\=1 --, it is treated as a literal string value. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_esql))

## Question 15 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

Which of the following are security best practices when developing ObjectScript applications that access databases?

**A.** Use parameterized queries (? placeholders or :hostvar) for all SQL with user input to prevent injection

**B.** Store sensitive temporary data in process-private globals (^\|\|) rather than regular globals

**C.** Use the Requires keyword or $SYSTEM.Security.Check to enforce authorization on sensitive methods

**D.** Embed database credentials directly in application code for convenience and reliability

**E.** Follow the principle of least privilege by using GRANT and REVOKE to give each role only the permissions it needs

### Answer and explanation

**Correct answer: A.** Use parameterized queries (? placeholders or :hostvar) for all SQL with user input to prevent injection

**Correct answer: B.** Store sensitive temporary data in process-private globals (^\|\|) rather than regular globals

**Correct answer: C.** Use the Requires keyword or $SYSTEM.Security.Check to enforce authorization on sensitive methods

**Correct answer: E.** Follow the principle of least privilege by using GRANT and REVOKE to give each role only the permissions it needs

Security best practices include: parameterized queries to prevent SQL injection, PPGs for temporary sensitive data isolation, role/resource checks for authorization, and following the principle of least privilege with GRANT/REVOKE. Embedding credentials in code is a serious security anti-pattern; credentials should be managed through configuration or secret management systems. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_dynsql))

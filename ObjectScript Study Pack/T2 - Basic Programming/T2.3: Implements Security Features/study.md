[All topics](../../index.md) · [Practice quiz](quiz.md)

# T2.3: Implements Security Features

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T2.3.html). Reference links require internet access.

### Contents

1. [Ensures appropriate variable and global use to avoid security leaks](#1-ensures-appropriate-variable-and-global-use-to-avoid-security-leaks)
2. [Checks roles for permission control](#2-checks-roles-for-permission-control)
3. [Prevents SQL injection attacks](#3-prevents-sql-injection-attacks)
4. [Implements embedded SQL permission checks](#4-implements-embedded-sql-permission-checks)

### Visual study guide — sections 1–4

![T2.3 visual summary of sections 1–4: 1. Ensures appropriate variable and global use to avoid security leaks; 2. Checks roles for permission control; 3. Prevents SQL injection attacks; 4. Implements embedded SQL permission checks](visual-guide-01-v3.png)

[View all chapter diagrams](visuals.md) · [Technical review notes](../../visual-technical-notes.md)

## 1. Ensures appropriate variable and global use to avoid security leaks

### Key Points

- **Process-private globals (^||name)**: Visible only to the current process; use for sensitive temporary data
- **Local variables**: Exist only in the current process memory; never persisted or journaled
- **Avoid exposing globals directly**: Never pass global names to client-side code or expose them in URLs
- **IRISTEMP for transient data**: Use ^IRIS.Temp.\* globals for temporary data that should not be journaled or backed up
- **Namespace security**: Sensitive globals should reside in databases with restricted access

### Detailed Notes

#### Process-Private Globals for Sensitive Data

Process-private globals (PPGs) are visible only to the process that creates them. They are ideal for holding sensitive intermediate data such as authentication tokens, decrypted values, or temporary patient data during processing:

```objectscript
 // Store sensitive data in a process-private global
 SET ^||Session("authToken") = token
 SET ^||Session("decryptedSSN") = ssn

 // Process the data
 DO ..ProcessPatientData()

 // Clean up -- though PPGs are automatically cleaned when the process ends
 KILL ^||Session
```

PPGs are NOT journaled, NOT backed up, and NOT accessible from other processes. This makes them significantly more secure than regular globals for temporary sensitive data.

#### Dangerous Patterns to Avoid

```objectscript
 // DANGEROUS: Storing credentials in a regular global
 SET ^Config("dbPassword") = "secret123"    // Persisted, journaled, backed up, visible to all processes

 // DANGEROUS: Exposing global structure to client
 SET %response.ContentType = "application/json"
 WRITE "{""global"": ""^Patient.Data""}"    // Reveals internal storage structure

 // DANGEROUS: Using global name from user input
 SET globalName = %request.Get("global")
 SET value = @globalName@(id)               // Indirection with user input = security risk

 // SAFE: Use an abstraction layer
 SET value = ##class(MyApp.DataService).GetPatient(id)
```

#### Protecting Global Data with Database Security

Configure database-level security to restrict which roles can read/write specific globals:

- Map sensitive globals to dedicated databases
- Apply resource-based permissions to those databases
- Use application roles to control access at the namespace level

```objectscript
 // Check if current user has access before proceeding
 IF '$SYSTEM.Security.Check("%DB_SENSITIVE", "READ") {
     SET sc = $$$ERROR($$$AccessDenied)
     QUIT sc
 }
 SET data = ^SensitiveData(patientId)
```

#### Local Variables vs Globals for Security

Local variables exist only in process memory and are never visible to other processes, never persisted to disk, and never journaled. Use them for:

- Passwords and credentials during authentication
- Decrypted data during processing
- Temporary computation results with sensitive content

### Documentation References

- [Process-Private Globals](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GGBL_structure#GGBL_structure_ppg)
- [Database Security](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCAS_dbsrv)
- [Security Best Practices](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCAS_bestpract)

## 2. Checks roles for permission control

### Key Points

- **$ROLES**: Special variable containing a comma-delimited list of roles held by the current process
- **$SYSTEM.Security.Check()**: Programmatically checks if the current user holds a specific privilege on a resource
- **Requires keyword**: Method-level annotation that restricts execution to users with specific resources/privileges
- **%Admin_Manage, %DB_\*, %Development**: Common system resources used in permission checks
- **Application roles**: Custom roles that group privileges for application-specific access control

### Detailed Notes

#### Checking Roles with $ROLES

$ROLES contains all roles assigned to the current user, including assigned roles and their cascading sub-roles:

```objectscript
 // Display current user's roles
 WRITE "$ROLES = ", $ROLES, !
 // Output example: %All,%Developer,MyApp.Admin,MyApp.User

 // Check for a specific role
 IF $LISTFIND($LISTFROMSTRING($ROLES), "MyApp.Admin") {
     WRITE "User is an administrator", !
 }

 // Alternative: simple string check (less precise due to substring matching)
 IF $ROLES [ "MyApp.Admin" {
     WRITE "User has admin role", !
 }
```

#### Using $SYSTEM.Security.Check()

$SYSTEM.Security.Check() verifies whether the current user has a specific permission on a named resource. This is the recommended approach for programmatic authorization checks:

```objectscript
 // Check if user has WRITE permission on a resource
 IF $SYSTEM.Security.Check("MyApp.PatientData", "WRITE") {
     // User is authorized to modify patient data
     SET ^Patient(id, "Name") = newName
 }
 ELSE {
     SET sc = $$$ERROR($$$AccessDenied)
     QUIT sc
 }

 // Check READ permission
 IF '$SYSTEM.Security.Check("MyApp.Reports", "READ") {
     WRITE "Access denied: insufficient privileges", !
     QUIT
 }
```

The permission argument can be: "READ", "WRITE", or "USE".

#### Method-Level Security with Requires

The Requires keyword on class methods restricts execution to users who hold the specified resource privilege:

```objectscript
/// Delete a patient record (admin only)
ClassMethod DeletePatient(id As %Integer) As %Status [ Requires = "MyApp.Admin:WRITE" ]
{
    SET sc = ##class(MyApp.Patient).%DeleteId(id)
    RETURN sc
}

/// View audit log (requires USE on the audit resource)
ClassMethod ViewAuditLog() As %Status [ Requires = "%Admin_Manage:USE" ]
{
    // Only users with %Admin_Manage:USE can execute this method
    // A <PROTECT> error is thrown if the user lacks the required privilege
    DO ..DisplayLog()
    RETURN $$$OK
}
```

If a user without the required privilege calls a method with Requires, a  error is generated.

#### Practical Authorization Pattern

```objectscript
ClassMethod ProcessOrder(orderId As %Integer) As %Status
{
    // Verify user has appropriate role
    IF '$SYSTEM.Security.Check("MyApp.Orders", "WRITE") {
        $$$ThrowStatus($$$ERROR($$$AccessDenied))
    }

    // Additional business-level role check
    IF $ROLES '[ "MyApp.OrderProcessor" {
        RETURN $$$ERROR($$$GeneralError, "Role MyApp.OrderProcessor required")
    }

    // Proceed with order processing
    TSTART
    TRY {
        // ... processing logic ...
        TCOMMIT
    }
    CATCH ex {
        TROLLBACK
        RETURN ex.AsStatus()
    }
    RETURN $$$OK
}
```

### Documentation References

- [$ROLES Special Variable](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_vroles)
- [$SYSTEM.Security.Check](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_vsystem_security)
- [Method Keywords - Requires](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_method_requires)

## 3. Prevents SQL injection attacks

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

## 4. Implements embedded SQL permission checks

### Key Points

- **Embedded SQL does NOT check SQL privileges**: Embedded SQL bypasses SQL privilege enforcement — applications must check privileges explicitly
- **%CHECKPRIV**: SQL command to verify if the current user has a specific SQL privilege (use before embedded SQL operations)
- **GRANT/REVOKE**: SQL commands to assign or remove privileges on tables, views, and procedures
- **SQL privileges**: %ALTER, SELECT, INSERT, UPDATE, DELETE, EXECUTE, and REFERENCES on specific objects
- **SQLCODE -99**: Error code returned when a Dynamic SQL operation fails due to insufficient privileges
- **Privilege inheritance**: Roles can be granted SQL privileges, and users inherit privileges from their roles

### Detailed Notes

#### Embedded SQL and Privilege Checking

**Important:** Embedded SQL does NOT perform SQL privilege checking. The InterSystems documentation states: \*"Embedded SQL statements do not perform privilege checking; it is assumed that applications using Embedded SQL will check for privileges before using Embedded SQL statements."\*

SQL privilege enforcement applies to:

- Dynamic SQL (%SQL.Statement)
- ODBC connections
- JDBC connections
- SQL Shell

Embedded SQL can access all tables, views, and columns and perform any operation regardless of privilege assignments. Use %CHECKPRIV explicitly if you need to verify privileges in embedded SQL code.

#### Checking SQL Privileges with %CHECKPRIV

Use %CHECKPRIV in embedded SQL to verify a user's privileges before attempting an operation:

```objectscript
 // Check if current user has SELECT privilege on Patient table
 &sql(%CHECKPRIV SELECT ON MyApp.Patient)
 IF SQLCODE = 0 {
     WRITE "User has SELECT privilege on Patient", !
 }
 ELSE {
     WRITE "Access denied to Patient table", !
     QUIT
 }

 // Check INSERT privilege
 &sql(%CHECKPRIV INSERT ON MyApp.Patient)
 IF SQLCODE '= 0 {
     WRITE "Cannot insert: ", %msg, !
     QUIT
 }
```

#### Handling Privilege Failures (SQLCODE -99)

When a Dynamic SQL operation fails due to missing privileges, SQLCODE is set to -99 (this does NOT apply to Embedded SQL, which bypasses privilege checks):

```objectscript
 &sql(INSERT INTO MyApp.AuditLog (Action, Username, Timestamp)
      VALUES ('LOGIN', :username, CURRENT_TIMESTAMP))
 IF SQLCODE = -99 {
     // Privilege error -- handle gracefully
     WRITE "Insufficient SQL privileges for audit logging", !
     // Log through alternative mechanism
     DO ##class(MyApp.Logger).Log("WARN", "SQL privilege denied for " _ $USERNAME)
 }
 ELSEIF SQLCODE < 0 {
     WRITE "SQL error: ", SQLCODE, " - ", %msg, !
 }
```

#### GRANT and REVOKE in Embedded SQL

Manage SQL privileges programmatically using GRANT and REVOKE:

```objectscript
 // Grant SELECT on a table to a role
 &sql(GRANT SELECT ON MyApp.Patient TO MyAppReadOnly)
 IF SQLCODE '= 0 {
     WRITE "Grant failed: ", %msg, !
 }

 // Grant multiple privileges
 &sql(GRANT SELECT, INSERT, UPDATE ON MyApp.Patient TO MyAppDataEntry)

 // Grant EXECUTE on a stored procedure
 &sql(GRANT EXECUTE ON MyApp.CalculateRisk TO MyAppClinician)

 // Revoke a privilege
 &sql(REVOKE DELETE ON MyApp.Patient FROM MyAppDataEntry)

 // Grant with GRANT OPTION (allows the grantee to grant the same privilege to others)
 &sql(GRANT SELECT ON MyApp.Patient TO MyAppAdmin WITH GRANT OPTION)
```

#### Combining Role Checks with SQL Privilege Checks

For defense in depth, combine ObjectScript role checks with SQL privilege verification:

```objectscript
ClassMethod UpdatePatientRecord(patientId As %Integer, data As %String) As %Status
{
    // Layer 1: ObjectScript role check
    IF '$SYSTEM.Security.Check("MyApp.PatientData", "WRITE") {
        RETURN $$$ERROR($$$AccessDenied)
    }

    // Layer 2: SQL privilege check
    &sql(%CHECKPRIV UPDATE ON MyApp.Patient)
    IF SQLCODE '= 0 {
        RETURN $$$ERROR($$$GeneralError, "SQL UPDATE privilege required")
    }

    // Layer 3: Execute the update with proper error handling
    &sql(UPDATE MyApp.Patient SET Data = :data WHERE PatientId = :patientId)
    IF SQLCODE < 0 {
        RETURN $$$ERROR($$$GeneralError, "Update failed: " _ %msg)
    }
    IF SQLCODE = 100 {
        RETURN $$$ERROR($$$GeneralError, "Patient not found")
    }

    RETURN $$$OK
}
```

#### Column-Level Privileges

SQL privileges can be granted at the column level for fine-grained control:

```objectscript
 // Grant SELECT only on non-sensitive columns
 &sql(GRANT SELECT (Name, DOB, Phone) ON MyApp.Patient TO MyAppReceptionist)

 // Deny access to sensitive columns
 &sql(REVOKE SELECT (SSN, DiagnosisCode) ON MyApp.Patient FROM MyAppReceptionist)
```

#### Viewing Current Privileges

Query the SQL security metadata to see what privileges exist:

```objectscript
 &sql(SELECT Grantee, Privilege, TableName
      INTO :grantee, :priv, :tbl
      FROM INFORMATION_SCHEMA.TABLE_PRIVILEGES
      WHERE TableName = 'MyApp.Patient')
 WHILE SQLCODE = 0 {
     WRITE grantee, " has ", priv, " on ", tbl, !
     &sql(FETCH INTO :grantee, :priv, :tbl)
 }
```

### Documentation References

- [SQL Privileges](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GSQL_privileges)
- [GRANT Command](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_grant)
- [REVOKE Command](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_revoke)
- [%CHECKPRIV](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_checkpriv)

## Exam Preparation Summary

### Critical Concepts to Master:

1. **PPGs for sensitive data**: Process-private globals (^||name) are isolated per-process, not journaled, not backed up -- ideal for temporary sensitive data
2. **$SYSTEM.Security.Check()**: The primary programmatic method for checking resource-level permissions; accepts resource name and permission type (READ/WRITE/USE)
3. **$ROLES**: Contains comma-delimited list of current user's roles; use $LISTFIND for precise checking rather than the contains operator ([)
4. **Parameterized queries**: Always use ? with %SQL.Statement or :variable with embedded SQL; never concatenate user input into SQL strings
5. **%CHECKPRIV**: Embedded SQL command to verify SQL privileges before executing operations
6. **SQLCODE -99**: The specific error code for privilege violations in SQL operations

### Common Exam Scenarios:

- Identifying vulnerable code that concatenates user input into SQL queries
- Choosing between local variables, PPGs, and regular globals for storing sensitive data
- Writing $SYSTEM.Security.Check() calls with correct resource name and permission type
- Fixing insecure code patterns (global indirection with user input, exposed global names)
- Implementing GRANT/REVOKE statements for role-based SQL access
- Determining the correct location for authorization checks (method level with Requires vs programmatic)
- Recognizing SQLCODE -99 and implementing appropriate error handling

### Hands-On Practice Recommendations:

- Create a test class with methods using the Requires keyword and test with different user roles
- Write both vulnerable and secure versions of dynamic SQL queries to understand the difference
- Use $ROLES and $SYSTEM.Security.Check() in Terminal with different user accounts
- Set up SQL privileges with GRANT and test access with %CHECKPRIV
- Create process-private globals and verify they are invisible from other processes using a second Terminal session
- Attempt SQL operations without proper privileges to observe SQLCODE -99 behavior
- Practice column-level GRANT to restrict access to sensitive fields (SSN, diagnosis codes)

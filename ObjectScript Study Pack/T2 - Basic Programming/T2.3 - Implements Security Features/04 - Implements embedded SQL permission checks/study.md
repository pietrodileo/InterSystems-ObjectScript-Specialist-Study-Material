[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T2.3: Implements Security Features

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T2.3.html). Reference links require internet access.

## 4. Implements embedded SQL permission checks

![T2.3 visual summary of sections 1–4: 1. Ensures appropriate variable and global use to avoid security leaks; 2. Checks roles for permission control; 3. Prevents SQL injection attacks; 4. Implements embedded SQL permission checks](../visual-guide-01-v3.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

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

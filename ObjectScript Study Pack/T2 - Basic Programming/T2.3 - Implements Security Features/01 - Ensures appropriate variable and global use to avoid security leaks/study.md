[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T2.3: Implements Security Features

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T2.3.html). Reference links require internet access.

## 1. Ensures appropriate variable and global use to avoid security leaks

![T2.3 visual summary of sections 1–4: 1. Ensures appropriate variable and global use to avoid security leaks; 2. Checks roles for permission control; 3. Prevents SQL injection attacks; 4. Implements embedded SQL permission checks](../visual-guide-01-v3.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

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

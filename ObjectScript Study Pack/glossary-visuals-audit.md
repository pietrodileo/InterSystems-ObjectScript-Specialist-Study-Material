# Glossary visual cards — coverage audit

Style: the approved T5.1 illustrated sample. English text, landscape 1536 × 1024, navy headings, pale grid, blue/lilac/mint panels, semantic icons and diagrams, amber cautions.

Generated and edited with the built-in imagegen tool. Every Key terms entry and every System methods and functions entry is assigned to a card. The complete source labels and descriptions are compared programmatically with study.md; all PNGs were visually reviewed, with targeted corrections to 18 cards. PNG signatures, dimensions and unique hashes are checked, and recap links are updated in study.md and visuals.md. This inventory is the text companion for inspecting exact API spelling and arguments.

| Chapter | Terms | APIs | Cards |
|---|---:|---:|---:|
| T1.1 | 55 | 25 | 5 |
| T1.2 | 44 | 29 | 4 |
| T1.3 | 54 | 25 | 5 |
| T1.4 | 31 | 29 | 4 |
| T2.1 | 58 | 15 | 4 |
| T2.2 | 41 | 36 | 5 |
| T2.3 | 58 | 15 | 4 |
| T3.1 | 24 | 9 | 2 |
| T3.2 | 55 | 21 | 5 |
| T3.3 | 29 | 16 | 3 |
| T3.4 | 31 | 18 | 4 |
| T3.5 | 39 | 27 | 4 |
| T4.1 | 17 | 5 | 2 |
| T4.2 | 19 | 15 | 2 |
| T4.3 | 19 | 11 | 2 |
| T4.4 | 19 | 13 | 2 |
| T4.5 | 22 | 11 | 2 |
| T4.6 | 30 | 25 | 4 |
| T4.7 | 31 | 45 | 5 |
| T5.1 | 25 | 22 | 3 |
| T5.2 | 39 | 30 | 4 |
| T5.3 | 41 | 34 | 5 |

Total: 22 chapters, 80 cards, 1257 source entries.

## Per-card inventory

### T1.1 · 1/5 · Key terms

Image: [visual-guide-glossary-01.png](<T1 - Manages Data Model/T1.1 - Uses Classes/visual-guide-glossary-01.png>)

**Class lifecycle**

- `%Persistent` — Gives stored objects database IDs and, by default, a SQL projection.
- `%RegisteredObject` — Provides in-process object behavior and object references.
- `%SerialObject` — Embeds a value in the storage of its containing object.

**OREF, OID and ID**

- `OREF` — Identifies an object instance in memory.
- `%Id` — Returns the object's persistent ID.
- `%Oid` — Returns object identity, including class and ID.
- `IdKey` — Lets a unique application key serve as the persistent ID.

**Create, validate and save**

- `%New` — Constructs an instance in memory.
- `%OnNew` — Runs initialization during %New.
- `%ValidateObject` — Runs object validation and returns a status.
- `%OnValidateObject` — Implements additional validation rules.
- `%Save` — Persists changes and returns a %Status. An outer transaction can still roll back.

**Open and delete**

- `%OpenId` — Opens a stored object by persistent ID.
- `%DeleteId` — Deletes the object with the given ID.
- `%DeleteExtent` — Deletes the class extent through the object API.
- `%KillExtent` — Clears extent storage directly and bypasses per-object delete callbacks.

**Lifecycle callbacks**

- `%OnBeforeSave` — Runs before writing object changes.
- `%OnAfterSave` — Runs after the storage operation, within the save transaction.
- `%OnOpen` — Runs when an object is opened from storage.

### T1.1 · 2/5 · Key terms

Image: [visual-guide-glossary-02.png](<T1 - Manages Data Model/T1.1 - Uses Classes/visual-guide-glossary-02.png>)

**Lifecycle callbacks**

- `%OnDelete` — Runs during object deletion.
- `%OnAfterDelete` — Runs after the object has been removed from storage.
- `SQL trigger` — Runs on its configured SQL event according to trigger settings.

**Storage mapping**

- `DataLocation` — Names the default data global.
- `IdLocation` — Names the default ID-counter global.
- `IndexLocation` — Names the default index global.
- `Location` — Overrides storage for a specific index.
- `USEEXTENTSET` — Enables extent membership tracking.
- `Namespace mapping` — Resolves a logical global reference to its physical database.

**Inheritance and documentation**

- `Extends` — Declares the class's superclasses.
- `Inheritance` — Controls superclass resolution order.
- `Description` — Stores documentation in class metadata.
- `///` — Introduces class-member documentation.

**ObjectScript commands**

- `DO` — Invokes a routine, label or method.
- `FOR` — Repeats a block or command according to a loop specification.
- `IF` — Runs the following command or block when its condition is true.
- `OPEN` — Opens the specified I/O device.
- `QUIT` — Leaves the current loop, block or invocation as determined by context.
- `RETURN` — Returns control, optionally with a value, to the caller.

### T1.1 · 3/5 · Key terms

Image: [visual-guide-glossary-03.png](<T1 - Manages Data Model/T1.1 - Uses Classes/visual-guide-glossary-03.png>)

**ObjectScript commands**

- `SET` — Assigns a value to a variable, property or assignable expression.
- `WRITE` — Sends formatted output to the current device.
- `ZWRITE` — Displays variable values and subscripts for inspection.

**System variables and macros**

- `$HOROLOG` — Reports local date and time as day and seconds fields.
- `$NAMESPACE` — Names the current namespace.
- `$SYSTEM` — Provides shorthand access to the IRIS %SYSTEM package.
- `$$$ERROR` — Builds an error status from its code and arguments.
- `$$$GeneralError` — Identifies the general-error code used with message text.
- `$$$ISERR` — Tests whether a status indicates an error.
- `$$$oidPrimary` — Selects the primary OID representation.
- `$$$OK` — Supplies a success status.

**SQL statements and clauses**

- `SELECT` — Reads rows and expressions from one or more sources.
- `FROM` — Names the source tables or queries.
- `WHERE` — Keeps rows whose predicate is true.
- `UPDATE` — Changes values in existing rows.
- `INSERT INTO` — Creates rows in the named table.
- `DELETE (SQL)` — Removes rows that match the filter.

### T1.1 · 4/5 · System methods and functions

Image: [visual-guide-glossary-04.png](<T1 - Manages Data Model/T1.1 - Uses Classes/visual-guide-glossary-04.png>)

**System methods and functions**

- `##class(%SYS.Namespace).GetGlobalDest(namespace, globalName)` — Resolves the database mapped to the global.
- `##class(App.Record).%Delete(oid)` — Deletes a persistent object by object identity.
- `##class(App.Record).%DeleteExtent()` — Deletes stored records through the object API.
- `##class(App.Record).%DeleteId(id)` — Deletes the record with the supplied persistent ID.
- `##class(App.Record).%Exists(oid)` — Tests whether an object with the given OID exists.
- `##class(App.Record).%ExistsId(id)` — Tests whether an object with the given ID exists.
- `##class(App.Record).%KillExtent()` — Clears extent storage directly, including related extents as applicable.
- `##class(App.Record).%New()` — Creates a new in-memory instance of the class.
- `##class(App.Record).%Open(oid)` — Opens a persistent object by its OID.
- `##class(App.Record).%OpenId(id, concurrency, .status)` — Opens a record by ID. The concurrency and status arguments are optional.
- `##class(App.Record).%Populate(count)` — Generates sample objects for a class that supports test data population.
- `$INCREMENT(node, amount)` — Atomically adds an amount and returns the new value.
- `$ISOBJECT(obj)` — Indicates whether the value is an object reference.

### T1.1 · 5/5 · System methods and functions

Image: [visual-guide-glossary-05.png](<T1 - Manages Data Model/T1.1 - Uses Classes/visual-guide-glossary-05.png>)

**System methods and functions**

- `$LISTBUILD(value1, value2)` — Encodes values as an ObjectScript list.
- `$PIECE(text, delimiter, from, to)` — Returns one or more delimited fields.
- `$SYSTEM.Status.DisplayError(status)` — Writes error details to the current device.
- `$SYSTEM.Status.GetErrorText(status)` — Returns status message text.
- `$SYSTEM.Status.IsError(status)` — Tests whether the status represents an error.
- `$ZDATE(days, format)` — Formats an internal day count.
- `$ZDATEH(dateText, format)` — Converts a formatted date to an internal day count.
- `$ZDATETIME(daySecondPair, dateFormat, timeFormat)` — Formats a day-and-seconds pair as date and time text.
- `obj.%Id()` — Returns the persistent ID of the open object.
- `obj.%Oid()` — Returns the OID of the persistent object.
- `obj.%Save()` — Persists the object and returns a status.
- `obj.%ValidateObject()` — Validates the object and returns a status.

### T1.2 · 1/4 · Key terms

Image: [visual-guide-glossary-01.png](<T1 - Manages Data Model/T1.2 - Creates Properties and Indexes/visual-guide-glossary-01.png>)

**String validation**

- `MAXLEN` — Sets the maximum string length.
- `TRUNCATE` — Controls truncation of overlong string values.
- `%Status` — Reports validation or save failure to the caller.

**Stream types**

- `Global streams` — Store data in IRIS globals.
- `File streams` — Read or write operating-system files.
- `Character streams` — Handle text and character encoding.
- `Binary streams` — Preserve raw bytes.

**Computed values**

- `Calculated` — Computes a property through its getter.
- `SqlComputed` — Marks a SQL-computed property.
- `SqlComputeCode` — Supplies the SQL computation logic.
- `SqlComputeOnChange` — Controls which changes trigger recomputation.
- `Backfill` — Initializes or verifies rows that predate the new computation.

**Class member parameters**

- `Required` — Requires a property value at validation time.
- `InitialExpression` — Supplies a value when an instance is created.
- `Parameter` — Defines class or member configuration such as a datatype limit.

**Index selection**

- `Standard index` — Maps indexed keys to row IDs.
- `Bitmap index` — Represents row membership for each indexed key using bits.
- `Bitslice index` — Organizes numeric values by bit to support aggregation.
- `Selectivity` — Describes how strongly a predicate narrows the matching rows.

**Unique keys and references**

- `Index-generated methods` — Open, test or delete rows by the specific index key.
- `%ExistsId` — Tests existence using the persistent ID.
- `ForeignKey` — Enforces a reference to a related row.

### T1.2 · 2/4 · Key terms

Image: [visual-guide-glossary-02.png](<T1 - Manages Data Model/T1.2 - Creates Properties and Indexes/visual-guide-glossary-02.png>)

**Unique keys and references**

- `OnDelete` — Specifies the referential action when the referenced row is deleted.

**ObjectScript commands**

- `DO` — Invokes a routine, label or method.
- `ELSE` — Runs the alternative branch when the condition is false.
- `IF` — Runs the following command or block when its condition is true.
- `RETURN` — Returns control, optionally with a value, to the caller.
- `WHILE` — Repeats the block while its condition holds.
- `WRITE` — Sends formatted output to the current device.
- `%ID` — Exposes the row's persistent identifier in SQL.
- `OPEN` — Opens the specified I/O device.
- `READ` — Reads input from the current device.

**System variables and macros**

- `$HOROLOG` — Reports local date and time as day and seconds fields.
- `$SYSTEM` — Provides shorthand access to the IRIS %SYSTEM package.
- `$$$ISERR` — Tests whether a status indicates an error.
- `$$$ISOK` — Tests whether a status indicates success.

**SQL statements and clauses**

- `SELECT` — Reads rows and expressions from one or more sources.
- `FROM` — Names the source tables or queries.
- `WHERE` — Keeps rows whose predicate is true.
- `ORDER BY` — Chooses the order in which result rows appear.
- `UPDATE` — Changes values in existing rows.
- `SET (SQL)` — Defines the columns and expressions updated by an UPDATE.
- `&sql` — Embeds a SQL statement in ObjectScript.
- `SQLCODE` — Reports the result of an Embedded SQL operation.

### T1.2 · 3/4 · System methods and functions

Image: [visual-guide-glossary-03.png](<T1 - Manages Data Model/T1.2 - Creates Properties and Indexes/visual-guide-glossary-03.png>)

**System methods and functions**

- `##class(%Stream.FileCharacter).%New()` — Creates a character stream backed by a file.
- `##class(%Stream.GlobalCharacter).%New()` — Creates a character stream backed by an IRIS global.
- `##class(App.Record).%BuildIndices($LISTBUILD("IndexName"))` — Builds the named index for stored records.
- `##class(App.Record).%DeleteId(id)` — Deletes the record with the supplied persistent ID.
- `##class(App.Record).%ExistsId(id)` — Tests whether an object with the given ID exists.
- `##class(App.Record).%New()` — Creates a new in-memory instance of the class.
- `##class(App.Record).%OpenId(id, concurrency, .status)` — Opens a record by ID. The concurrency and status arguments are optional.
- `##class(App.Record).%PurgeIndices($LISTBUILD("IndexName"))` — Clears entries from the named index for a subsequent rebuild.
- `$CHAR(code1, code2)` — Builds a string from character codes.
- `$LENGTH(text, delimiter)` — Counts delimited fields. Omit the delimiter to count characters.
- `$LISTBUILD(value1, value2)` — Encodes values as an ObjectScript list.
- `$SELECT(condition:value, 1:default)` — Returns the value for the first true condition.
- `$SYSTEM.Status.DisplayError(status)` — Writes error details to the current device.
- `$SYSTEM.Status.IsError(status)` — Tests whether the status represents an error.
- `$ZDATETIME(daySecondPair, dateFormat, timeFormat)` — Formats a day-and-seconds pair as date and time text.

### T1.2 · 4/4 · System methods and functions

Image: [visual-guide-glossary-04.png](<T1 - Manages Data Model/T1.2 - Creates Properties and Indexes/visual-guide-glossary-04.png>)

**System methods and functions**

- `COUNT(*)` — Counts rows, regardless of whether individual fields are NULL.
- `file.Open("WSA")` — Opens a file for stream writes in append mode.
- `obj.%Id()` — Returns the persistent ID of the open object.
- `obj.%Save()` — Persists the object and returns a status.
- `obj.%ValidateObject()` — Validates the object and returns a status.
- `stream.Clear()` — Clears contents and resets the stream.
- `stream.CopyFrom(source)` — Copies data from the source stream into the destination.
- `stream.MoveToEnd()` — Moves the stream cursor to the end.
- `stream.Read(length)` — Reads up to the requested number of characters or bytes.
- `stream.ReadLine()` — Reads a line at the current stream position.
- `stream.Rewind()` — Moves the stream cursor back to the start.
- `stream.Write(data)` — Writes the supplied data to the stream.
- `stream.WriteLine(text)` — Writes text followed by a line terminator.
- `SUM(column)` — Adds the non-NULL values.

### T1.3 · 1/5 · Key terms

Image: [visual-guide-glossary-01.png](<T1 - Manages Data Model/T1.3 - Creates ObjectScript Methods/visual-guide-glossary-01.png>)

**Instance and class methods**

- `Method` — Runs with an instance context and can access its properties.
- `ClassMethod` — Runs at class scope and can be invoked through ##class.
- `..#ParameterName` — Reads a class parameter in the current context.

**Signature and types**

- `As` — Declares argument and return types.
- `Default argument` — Makes an argument optional at the call site.
- `ByRef` — Allows the callee to read and update the caller's variable.
- `Output` — Declares a value produced through an argument.

**Object reference**

- `Passing an OREF` — Copies the reference to the same object instance.
- `Mutating the object` — Changes shared object state through either reference.
- `Passing by reference` — Allows reassignment of the caller's variable.

**Multidimensional arguments**

- `Dotted argument` — Passes a variable by reference, as in .scores.
- `Array subscripts` — Can be traversed and updated through the callee's reference.

**Override and parent call**

- `Override` — Supplies a replacement implementation with a compatible signature.
- `##super` — Invokes the inherited implementation of the current method.
- `$CLASSNAME` — Returns the full class name.

**Status and return**

- `%Status` — Carries success or error information from fallible calls.
- `QUIT value` — Returns a value in an appropriate method or invocation context.
- `RETURN value` — Returns from the method or procedure, including from nested blocks.

### T1.3 · 2/5 · Key terms

Image: [visual-guide-glossary-02.png](<T1 - Manages Data Model/T1.3 - Creates ObjectScript Methods/visual-guide-glossary-02.png>)

**Inherited callbacks**

- `%OnNew` — Initializes a new instance.
- `%OnOpen` — Runs when IRIS opens a stored object.
- `%OnValidateObject` — Adds an application validation check.
- `%OnBeforeSave` — Runs before writing the object.
- `%OnAfterSave` — Runs after writing the object within the save transaction.

**ObjectScript commands**

- `DO` — Invokes a routine, label or method.
- `ELSE` — Runs the alternative branch when the condition is false.
- `ELSEIF` — Tests an additional condition after a false branch.
- `FOR` — Repeats a block or command according to a loop specification.
- `IF` — Runs the following command or block when its condition is true.
- `KILL` — Removes a variable or a node and all its descendants.
- `MERGE` — Copies a variable tree, including its descendants.
- `QUIT` — Leaves the current loop, block or invocation as determined by context.
- `RETURN` — Returns control, optionally with a value, to the caller.
- `SET` — Assigns a value to a variable, property or assignable expression.
- `WRITE` — Sends formatted output to the current device.

**System variables and macros**

- `$HOROLOG` — Reports local date and time as day and seconds fields.
- `$SYSTEM` — Provides shorthand access to the IRIS %SYSTEM package.

### T1.3 · 3/5 · Key terms

Image: [visual-guide-glossary-03.png](<T1 - Manages Data Model/T1.3 - Creates ObjectScript Methods/visual-guide-glossary-03.png>)

**System variables and macros**

- `$THIS` — Refers to the current object in an instance method.
- `$USERNAME` — Identifies the authenticated user.
- `$ZPI` — Supplies the constant pi.
- `$$$ERROR` — Builds an error status from its code and arguments.
- `$$$GeneralError` — Identifies the general-error code used with message text.
- `$$$ISERR` — Tests whether a status indicates an error.
- `$$$ISOK` — Tests whether a status indicates success.
- `$$$OK` — Supplies a success status.

**SQL statements and clauses**

- `&sql` — Embeds a SQL statement in ObjectScript.
- `DECLARE CURSOR` — Gives a result set a name for Embedded SQL row-by-row fetch.
- `OPEN (cursor)` — Starts a declared cursor.
- `FETCH` — Reads the next cursor row into host variables.
- `CLOSE (cursor)` — Closes the cursor and releases its resources.
- `SELECT` — Reads rows and expressions from one or more sources.
- `FROM` — Names the source tables or queries.
- `WHERE` — Keeps rows whose predicate is true.
- `GROUP BY` — Forms groups of rows for aggregate operations.
- `SQLCODE` — Reports the result of an Embedded SQL operation.

### T1.3 · 4/5 · System methods and functions

Image: [visual-guide-glossary-04.png](<T1 - Manages Data Model/T1.3 - Creates ObjectScript Methods/visual-guide-glossary-04.png>)

**System methods and functions**

- `##class(App.Record).%New()` — Creates a new in-memory instance of the class.
- `##class(App.Record).%OpenId(id, concurrency, .status)` — Opens a record by ID. The concurrency and status arguments are optional.
- `##super(arg)` — Calls the inherited implementation of the current method.
- `$CHAR(code1, code2)` — Builds a string from character codes.
- `$CLASSNAME(obj)` — Returns the object's fully qualified class name.
- `$DATA(node)` — Reports whether a node has data, descendants, both or neither.
- `$FNUMBER(number, format, decimals)` — Formats a numeric value to the specified precision.
- `$GET(node, default)` — Returns the node value or a default.
- `$ISOBJECT(obj)` — Indicates whether the value is an object reference.
- `$LIST(list, position)` — Reads the element at the specified position.
- `$LISTBUILD(value1, value2)` — Encodes values as an ObjectScript list.
- `$LISTLENGTH(list)` — Counts list positions.
- `$ORDER(node, direction)` — Returns the next or previous sibling subscript.

### T1.3 · 5/5 · System methods and functions

Image: [visual-guide-glossary-05.png](<T1 - Manages Data Model/T1.3 - Creates ObjectScript Methods/visual-guide-glossary-05.png>)

**System methods and functions**

- `$PIECE(text, delimiter, from, to)` — Returns one or more delimited fields.
- `$SYSTEM.Status.DisplayError(status)` — Writes error details to the current device.
- `$SYSTEM.Status.GetErrorText(status)` — Returns status message text.
- `$ZCONVERT(text, mode)` — Converts case or applies an encoding mode.
- `$ZDATE(days, format)` — Formats an internal day count.
- `$ZSTRIP(text, action)` — Removes characters according to class and position rules.
- `COUNT(*)` — Counts rows, regardless of whether individual fields are NULL.
- `list.Count()` — Returns the number of elements in the list collection.
- `list.GetAt(position)` — Returns the collection element at the specified position.
- `obj.%ClassName(1)` — Returns the fully qualified class name. Omit 1 for the short name.
- `obj.%IsA(className)` — Tests membership in the object's primary class hierarchy.
- `obj.%Save()` — Persists the object and returns a status.

### T1.4 · 1/4 · Key terms

Image: [visual-guide-glossary-01.png](<T1 - Manages Data Model/T1.4 - Uses Complex Structures/visual-guide-glossary-01.png>)

**Dynamic containers**

- `%DynamicObject` — Stores named JSON-style properties.
- `%DynamicArray` — Stores elements by zero-based index.
- `%FromJSON` — Parses JSON into a dynamic entity.
- `%ToJSON` — Serializes a dynamic entity as JSON.

**Presence and access**

- `%IsDefined` — Tests whether the key or index is present.
- `%Get` — Reads an entry with optional default or type conversion.
- `%GetTypeOf` — Reports the entry's dynamic type.
- `JSON null` — Represents an explicit null value and is distinct from a missing entry.

**Mutation and iteration**

- `%Set` — Assigns an entry.
- `%Remove` — Removes an entry.
- `%Push` — Appends an array element.
- `%Pop` — Removes and returns the final array element.
- `%GetIterator` — Creates an iterator over entries.
- `%GetNext` — Advances the iterator and fills key and value outputs.

**Streams**

- `Global or File` — Chooses database or file-system storage.
- `Character or Binary` — Chooses text or byte-oriented content.

### T1.4 · 2/4 · Key terms

Image: [visual-guide-glossary-02.png](<T1 - Manages Data Model/T1.4 - Uses Complex Structures/visual-guide-glossary-02.png>)

**Streams**

- `Read` — Reads a chunk of data.
- `ReadLine` — Reads a line of text.
- `Rewind` — Moves the cursor back to the beginning.
- `CopyFrom` — Copies data from another stream.
- `AtEnd` — Indicates whether the cursor has reached the end.

**ObjectScript commands**

- `DO` — Invokes a routine, label or method.
- `FOR` — Repeats a block or command according to a loop specification.
- `IF` — Runs the following command or block when its condition is true.
- `QUIT` — Leaves the current loop, block or invocation as determined by context.
- `RETURN` — Returns control, optionally with a value, to the caller.
- `SET` — Assigns a value to a variable, property or assignable expression.
- `WHILE` — Repeats the block while its condition holds.
- `WRITE` — Sends formatted output to the current device.

**System variables and macros**

- `$HOROLOG` — Reports local date and time as day and seconds fields.
- `$SYSTEM` — Provides shorthand access to the IRIS %SYSTEM package.

### T1.4 · 3/4 · System methods and functions

Image: [visual-guide-glossary-03.png](<T1 - Manages Data Model/T1.4 - Uses Complex Structures/visual-guide-glossary-03.png>)

**System methods and functions**

- `##class(%DynamicArray).%New()` — Creates an empty dynamic array.
- `##class(%DynamicObject).%FromJSON(json)` — Parses JSON into a dynamic entity.
- `##class(%DynamicObject).%New()` — Creates an empty dynamic object.
- `##class(%Stream.FileCharacter).%New()` — Creates a character stream backed by a file.
- `##class(%Stream.GlobalCharacter).%New()` — Creates a character stream backed by an IRIS global.
- `$LIST(list, position)` — Reads the element at the specified position.
- `$SYSTEM.Status.IsError(status)` — Tests whether the status represents an error.
- `array.%Pop()` — Removes and returns the last array element.
- `array.%Push(value)` — Appends a value to the array.
- `iterator.%GetNext(.key, .value)` — Advances the iterator and fills the key and value variables.
- `obj.%ConstructClone()` — Creates a copy of a dynamic entity.
- `obj.%Get(key, default)` — Reads a dynamic entry or returns the default.
- `obj.%GetIterator()` — Returns an iterator over the dynamic entity's entries.
- `obj.%GetTypeOf(key)` — Returns the dynamic type of the specified entry.
- `obj.%IsDefined(key)` — Tests whether a key or index is defined.

### T1.4 · 4/4 · System methods and functions

Image: [visual-guide-glossary-04.png](<T1 - Manages Data Model/T1.4 - Uses Complex Structures/visual-guide-glossary-04.png>)

**System methods and functions**

- `obj.%Remove(key)` — Removes a property or array element.
- `obj.%Save()` — Persists the object and returns a status.
- `obj.%Set(key, value)` — Assigns a dynamic property or array element.
- `obj.%Size()` — Counts members of the dynamic entity.
- `obj.%ToJSON()` — Serializes the dynamic entity as JSON.
- `stream.Clear()` — Clears contents and resets the stream.
- `stream.CopyFrom(source)` — Copies data from the source stream into the destination.
- `stream.CopyFromAndSave(source)` — Copies the source and saves the result to permanent stream storage.
- `stream.MoveToEnd()` — Moves the stream cursor to the end.
- `stream.Read(length)` — Reads up to the requested number of characters or bytes.
- `stream.ReadLine()` — Reads a line at the current stream position.
- `stream.Rewind()` — Moves the stream cursor back to the start.
- `stream.Write(data)` — Writes the supplied data to the stream.
- `stream.WriteLine(text)` — Writes text followed by a line terminator.

### T2.1 · 1/4 · Key terms

Image: [visual-guide-glossary-01.png](<T2 - Basic Programming/T2.1 - Ensures Data Integrity/visual-guide-glossary-01.png>)

**Transaction and nesting**

- `TSTART` — Opens a transaction level.
- `TCOMMIT` — Closes a level and commits changes at the outermost level.
- `TROLLBACK 1` — Undoes work at the current level.
- `TROLLBACK` — Without an argument, rolls back all active levels.
- `$TLEVEL` — Reports the transaction nesting depth.

**Rollback scope**

- `Journaled changes` — Can be undone by transaction rollback.
- `Local and external effects` — Require separate recovery where applicable.
- `Ownership` — Determines which transaction level a routine may commit or roll back.

**Cooperative lock**

- `LOCK +` — Incrementally acquires a lock on a named resource.
- `LOCK -` — Releases one acquisition of that resource.
- `Timed LOCK` — Sets $TEST to indicate whether acquisition succeeded.
- `Resource name` — Must be shared by all cooperating code paths.

**Modes and escalation**

- `Shared lock` — Allows compatible readers to share the resource.
- `Exclusive lock` — Conflicts with other processes' shared and exclusive locks.
- `Lock escalation` — Can replace many SQL row locks with a table lock.

**Optimistic and pessimistic control**

- `Pessimistic locking` — Protects the read-to-write interval with a lock.
- `Optimistic checking` — Detects intervening changes and requires handling a conflict.

**SQL transaction controls**

- `START TRANSACTION` — Starts a SQL transaction.
- `COMMIT` — Makes the transaction's changes permanent.
- `ROLLBACK` — Undoes transactional changes.

### T2.1 · 2/4 · Key terms

Image: [visual-guide-glossary-02.png](<T2 - Basic Programming/T2.1 - Ensures Data Integrity/visual-guide-glossary-02.png>)

**SQL transaction controls**

- `SET TRANSACTION` — Configures the isolation level.
- `LOCK TABLE and UNLOCK TABLE` — Acquire and release explicit table locks.
- `%NOLOCK` — Changes the query's locking behavior.

**Deadlock and lifetime**

- `Deadlock` — Occurs when processes wait on resources in a cycle.
- `Lock ordering` — Reduces deadlocks by acquiring shared resources consistently.
- `Lock lifetime` — Depends on how the lock was taken and the transaction boundary.

**ObjectScript commands**

- `CATCH` — Receives the exception raised in the corresponding TRY block.
- `FOR` — Repeats a block or command according to a loop specification.
- `IF` — Runs the following command or block when its condition is true.
- `LOCK` — Acquires or releases a cooperative lock on the supplied name.
- `QUIT` — Leaves the current loop, block or invocation as determined by context.
- `TRY` — Begins a block watched for exceptions.
- `WHILE` — Repeats the block while its condition holds.
- `WRITE` — Sends formatted output to the current device.

**System variables and macros**

- `$HOROLOG` — Reports local date and time as day and seconds fields.
- `$SYSTEM` — Provides shorthand access to the IRIS %SYSTEM package.
- `$ZERROR` — Reports the last ObjectScript error text.
- `$ZTRAP` — Identifies the legacy ObjectScript error handler.
- `$$$ERROR` — Builds an error status from its code and arguments.
- `$$$GeneralError` — Identifies the general-error code used with message text.

### T2.1 · 3/4 · Key terms

Image: [visual-guide-glossary-03.png](<T2 - Basic Programming/T2.1 - Ensures Data Integrity/visual-guide-glossary-03.png>)

**System variables and macros**

- `$$$ISERR` — Tests whether a status indicates an error.
- `$$$OK` — Supplies a success status.
- `$TEST` — Reports the result of commands such as a timed LOCK.

**SQL statements and clauses**

- `READ UNCOMMITTED` — Allows reads of another transaction's uncommitted changes.
- `READ COMMITTED` — Prevents reads of uncommitted changes.
- `REPEATABLE READ` — Protects rows already read from concurrent changes within the transaction.
- `SERIALIZABLE` — Uses the strongest transaction isolation, protecting against phantom reads.
- `SELECT` — Reads rows and expressions from one or more sources.
- `FROM` — Names the source tables or queries.
- `WHERE` — Keeps rows whose predicate is true.
- `GROUP BY` — Forms groups of rows for aggregate operations.
- `INSERT INTO` — Creates rows in the named table.
- `VALUES` — Supplies row values for an insert.
- `UPDATE` — Changes values in existing rows.
- `SET (SQL)` — Defines the columns and expressions updated by an UPDATE.
- `&sql` — Embeds a SQL statement in ObjectScript.
- `SQLCODE` — Reports the result of an Embedded SQL operation.
- `%msg` — Contains diagnostic text for a SQL error where supplied.

### T2.1 · 4/4 · System methods and functions

Image: [visual-guide-glossary-04.png](<T2 - Basic Programming/T2.1 - Ensures Data Integrity/visual-guide-glossary-04.png>)

**System methods and functions**

- `##class(%SQL.Statement).%New()` — Creates a dynamic SQL statement object.
- `##class(App.Record).%New()` — Creates a new in-memory instance of the class.
- `##class(App.Record).%OpenId(id, concurrency, .status)` — Opens a record by ID. The concurrency and status arguments are optional.
- `$GET(node, default)` — Returns the node value or a default.
- `$INCREMENT(node, amount)` — Atomically adds an amount and returns the new value.
- `$LISTNEXT(list, position, value)` — Advances the position variable and outputs the next element.
- `$SELECT(condition:value, 1:default)` — Returns the value for the first true condition.
- `$SEQUENCE(^counter)` — Allocates the next value from a global sequence counter.
- `$SYSTEM.OBJ.SetConcurrencyMode(mode)` — Sets the current process's default object concurrency mode.
- `$SYSTEM.SQL.Util.GetOption(option)` — Reads the current value of an SQL option.
- `$SYSTEM.SQL.Util.SetOption(option, value)` — Sets a named SQL option.
- `ex.DisplayString()` — Returns the exception in displayable form.
- `obj.%Save()` — Persists the object and returns a status.
- `stmt.%Execute(value)` — Runs the prepared statement with the given bound value.
- `stmt.%Prepare(sql)` — Prepares a dynamic statement and returns a status.

### T2.2 · 1/5 · Key terms

Image: [visual-guide-glossary-01.png](<T2 - Basic Programming/T2.2 - Tracks Application Data/visual-guide-glossary-01.png>)

**Global and namespace mapping**

- `Global` — Stores data in a sparse subscript tree.
- `Namespace mapping` — Resolves a global name to a database.
- `Deployed storage` — Identifies the actual globals used by a class.

**Safe inspection**

- `$DATA` — Checks whether a node has a value, descendants or both.
- `$GET` — Reads a node with a default for an undefined value.
- `$ORDER` — Returns the next or previous sibling subscript.
- `$QUERY` — Returns the next or previous full node reference.
- `ZWRITE` — Displays values and subscripts for inspection.

**Application logging**

- `Correlation context` — Associates events from the same operation.
- `$INCREMENT` — Atomically allocates the next numeric sequence value.
- `Data minimization` — Keeps secrets and sensitive fields out of log records.

**Time sources**

- `$HOROLOG` — Gives local day and second fields.
- `$ZTIMESTAMP` — Gives UTC day and fractional-second fields.
- `$ZHOROLOG` — Reports elapsed seconds since IRIS startup.

**Performance metrics**

- `Baseline and delta` — Compare before and after readings from the same scope.
- `Operation counters` — Measure globals, executed lines or disk activity alongside duration.

**Global browsing with SQL**

- `Global_Find` — Finds global names matching a search pattern.
- `Global_Get` — Reads nodes from a specified global.
- `Namespace and privileges` — Determine which globals a caller can inspect.

**ObjectScript commands**

- `DO` — Invokes a routine, label or method.
- `FOR` — Repeats a block or command according to a loop specification.

### T2.2 · 2/5 · Key terms

Image: [visual-guide-glossary-02.png](<T2 - Basic Programming/T2.2 - Tracks Application Data/visual-guide-glossary-02.png>)

**ObjectScript commands**

- `IF` — Runs the following command or block when its condition is true.
- `QUIT` — Leaves the current loop, block or invocation as determined by context.
- `RETURN` — Returns control, optionally with a value, to the caller.
- `SET` — Assigns a value to a variable, property or assignable expression.
- `WHILE` — Repeats the block while its condition holds.
- `WRITE` — Sends formatted output to the current device.
- `CLOSE` — Closes the device identified by its argument.
- `OPEN` — Opens the specified I/O device.
- `ZNAMESPACE` — Switches the current process to another namespace.

**System variables and macros**

- `$JOB` — Identifies the current process.
- `$NAMESPACE` — Names the current namespace.
- `$SYSTEM` — Provides shorthand access to the IRIS %SYSTEM package.
- `$USERNAME` — Identifies the authenticated user.
- `$ZTIMEZONE` — Reports the current time zone offset in minutes west of UTC.
- `$$$ISCLOG` — Emits diagnostics through the framework logging configuration.
- `$$$OK` — Supplies a success status.
- `$$$SysLog` — Writes framework diagnostics to the system logging facility.

**SQL statements and clauses**

- `SELECT` — Reads rows and expressions from one or more sources.
- `FROM` — Names the source tables or queries.
- `CALL` — Executes a stored procedure.

### T2.2 · 3/5 · System methods and functions

Image: [visual-guide-glossary-03.png](<T2 - Basic Programming/T2.2 - Tracks Application Data/visual-guide-glossary-03.png>)

**System methods and functions**

- `##class(%File).%New(path)` — Creates a file object for the path.
- `##class(%Monitor.System.LineByLine).Start($LISTBUILD(routine))` — Starts line-by-line monitoring for the named routine.
- `##class(%Monitor.System.LineByLine).Stop()` — Stops line-by-line monitoring.
- `##class(%SQL.Statement).%New()` — Creates a dynamic SQL statement object.
- `##class(%SYS.Namespace).GetGlobalDest(namespace, globalName)` — Resolves the database mapped to the global.
- `##class(%SYS.Namespace).GetNSInfo(namespace, .info)` — Returns namespace properties, including its default mappings.
- `$DATA(node)` — Reports whether a node has data, descendants, both or neither.
- `$GET(node, default)` — Returns the node value or a default.
- `$INCREMENT(node, amount)` — Atomically adds an amount and returns the new value.
- `$LIST(list, position)` — Reads the element at the specified position.
- `$LISTBUILD(value1, value2)` — Encodes values as an ObjectScript list.
- `$LISTGET(list, position, default)` — Reads an element or supplies a default.

### T2.2 · 4/5 · System methods and functions

Image: [visual-guide-glossary-04.png](<T2 - Basic Programming/T2.2 - Tracks Application Data/visual-guide-glossary-04.png>)

**System methods and functions**

- `$NOW()` — Returns the current date and time with fractional seconds.
- `$ORDER(node, direction)` — Returns the next or previous sibling subscript.
- `$PIECE(text, delimiter, from, to)` — Returns one or more delimited fields.
- `$QUERY(node, direction)` — Returns the next or previous full node reference.
- `$RANDOM(limit)` — Returns a random integer from zero through limit minus one.
- `$SYSTEM.Process.FixedDate(days)` — Sets a test date for the process's Horolog value. Pass zero to restore it.
- `$SYSTEM.Process.GlobalReferences()` — Returns the process's global reference count.
- `$SYSTEM.Process.LinesExecuted()` — Returns the process's executed-line count.
- `$SYSTEM.SQL.Explain(sql)` — Generates and displays an execution plan for the SQL query.
- `$SYSTEM.SYS.Horolog()` — Returns the current Horolog value.
- `$SYSTEM.SYS.TimeStamp()` — Returns the current timestamp.
- `$ZDATE(days, format)` — Formats an internal day count.

### T2.2 · 5/5 · System methods and functions

Image: [visual-guide-glossary-05.png](<T2 - Basic Programming/T2.2 - Tracks Application Data/visual-guide-glossary-05.png>)

**System methods and functions**

- `$ZDATETIME(daySecondPair, dateFormat, timeFormat)` — Formats a day-and-seconds pair as date and time text.
- `$ZTIME(seconds, format)` — Formats an internal seconds-of-day value.
- `CALL %Library.Global_Find(namespace, startNode, pattern)` — Finds global nodes containing the search value.
- `CALL %Library.Global_Get(namespace, searchMask, lastNode)` — Returns nodes selected by the global search mask.
- `file.Close()` — Closes an open file object.
- `file.Open("WSA")` — Opens a file for stream writes in append mode.
- `result.%Get("ColumnName")` — Reads a result column by name.
- `result.%Next()` — Advances to the next SQL row and reports whether it exists.
- `stmt.%Execute(value)` — Runs the prepared statement with the given bound value.
- `stmt.%Prepare(sql)` — Prepares a dynamic statement and returns a status.
- `stmt.%PrepareClassQuery(className, queryName)` — Prepares a named class query for execution.
- `stream.WriteLine(text)` — Writes text followed by a line terminator.

### T2.3 · 1/4 · Key terms

Image: [visual-guide-glossary-01.png](<T2 - Basic Programming/T2.3 - Implements Security Features/visual-guide-glossary-01.png>)

**Variable and global scope**

- `Method locals` — Follow the method's procedure scope.
- `Process-private globals` — Remain available to their owning process, potentially across reused requests.
- `Shared globals` — Require permissions on the mapped database.

**Role, resource and privilege**

- `$ROLES` — Reports the active roles.
- `$LISTFROMSTRING` — Converts the role string to an encoded list.
- `$LISTFIND` — Tests exact membership in that list.
- `$SYSTEM.Security.Check` — Tests a privilege on a named resource.
- `Requires` — Specifies an entry requirement for a method.

**Visibility and authorization**

- `Private` — Restricts class member visibility.
- `Resource privileges and SQL grants` — Authorize specific actions on protected objects.
- `%Status` — Passes a denied operation or other failure back to the caller.

**Bound SQL values**

- `? placeholder` — Binds a Dynamic SQL value separately from statement text.
- `%Prepare` — Parses SQL and reports preparation status.
- `%Execute` — Executes with the supplied bind values.
- `SQLCODE` — Reports the SQL operation outcome.
- `Identifier allowlist` — Limits dynamically chosen names to predefined options.

**SQL and embedded privileges**

- `GRANT and REVOKE` — Assign and remove SQL privileges.
- `WITH GRANT OPTION` — Permits the grantee to delegate a privilege.
- `:hostVariable` — Binds an ObjectScript variable in Embedded SQL.
- `Application privilege check` — Guards embedded operations where the application must enforce authorization.

### T2.3 · 2/4 · Key terms

Image: [visual-guide-glossary-02.png](<T2 - Basic Programming/T2.3 - Implements Security Features/visual-guide-glossary-02.png>)

**ObjectScript commands**

- `CATCH` — Receives the exception raised in the corresponding TRY block.
- `DO` — Invokes a routine, label or method.
- `ELSE` — Runs the alternative branch when the condition is false.
- `ELSEIF` — Tests an additional condition after a false branch.
- `FOR` — Repeats a block or command according to a loop specification.
- `IF` — Runs the following command or block when its condition is true.
- `KILL` — Removes a variable or a node and all its descendants.
- `QUIT` — Leaves the current loop, block or invocation as determined by context.
- `RETURN` — Returns control, optionally with a value, to the caller.
- `TCOMMIT` — Ends a transaction level and commits at the outermost level.
- `TROLLBACK` — Undoes transaction changes at the requested level.
- `TRY` — Begins a block watched for exceptions.
- `TSTART` — Starts a new transaction level.
- `WHILE` — Repeats the block while its condition holds.
- `WRITE` — Sends formatted output to the current device.

**System variables and macros**

- `$SYSTEM` — Provides shorthand access to the IRIS %SYSTEM package.
- `$USERNAME` — Identifies the authenticated user.
- `$$$AccessDenied` — Identifies the access-denied error code.
- `$$$ERROR` — Builds an error status from its code and arguments.
- `$$$GeneralError` — Identifies the general-error code used with message text.

### T2.3 · 3/4 · Key terms

Image: [visual-guide-glossary-03.png](<T2 - Basic Programming/T2.3 - Implements Security Features/visual-guide-glossary-03.png>)

**System variables and macros**

- `$$$ISERR` — Tests whether a status indicates an error.
- `$$$ISOK` — Tests whether a status indicates success.
- `$$$OK` — Supplies a success status.
- `$$$ThrowStatus` — Raises an exception from the supplied error status.

**SQL statements and clauses**

- `FROM` — Names the source tables or queries.
- `SELECT` — Reads rows and expressions from one or more sources.
- `UPDATE` — Changes values in existing rows.
- `INSERT INTO` — Creates rows in the named table.
- `DELETE (SQL)` — Removes rows that match the filter.
- `&sql` — Embeds a SQL statement in ObjectScript.
- `DECLARE CURSOR` — Gives a result set a name for Embedded SQL row-by-row fetch.
- `OPEN (cursor)` — Starts a declared cursor.
- `FETCH` — Reads the next cursor row into host variables.
- `CLOSE (cursor)` — Closes the cursor and releases its resources.
- `WHERE` — Keeps rows whose predicate is true.
- `ORDER BY` — Chooses the order in which result rows appear.
- `SET (SQL)` — Defines the columns and expressions updated by an UPDATE.
- `%msg` — Contains diagnostic text for a SQL error where supplied.

### T2.3 · 4/4 · System methods and functions

Image: [visual-guide-glossary-04.png](<T2 - Basic Programming/T2.3 - Implements Security Features/visual-guide-glossary-04.png>)

**System methods and functions**

- `##class(%SQL.Statement).%New()` — Creates a dynamic SQL statement object.
- `##class(App.Record).%DeleteId(id)` — Deletes the record with the supplied persistent ID.
- `$INCREMENT(node, amount)` — Atomically adds an amount and returns the new value.
- `$LISTBUILD(value1, value2)` — Encodes values as an ObjectScript list.
- `$LISTFIND(list, value, startAfter)` — Returns the position of a matching list value.
- `$LISTFROMSTRING(text, delimiter)` — Splits delimited text into an encoded list.
- `$PIECE(text, delimiter, from, to)` — Returns one or more delimited fields.
- `$SYSTEM.Security.Check(resource, permission)` — Tests the process's privilege on the named resource.
- `$SYSTEM.Status.GetErrorText(status)` — Returns status message text.
- `$SYSTEM.Status.IsError(status)` — Tests whether the status represents an error.
- `ex.AsStatus()` — Converts an exception object to a status.
- `result.%GetData(columnNumber)` — Reads a result column by its one-based ordinal.
- `result.%Next()` — Advances to the next SQL row and reports whether it exists.
- `stmt.%Execute(value)` — Runs the prepared statement with the given bound value.
- `stmt.%Prepare(sql)` — Prepares a dynamic statement and returns a status.

### T3.1 · 1/2 · Key terms

Image: [visual-guide-glossary-01.png](<T3 - IRIS Features/T3.1 - Differentiates Storage Media/visual-guide-glossary-01.png>)

**Local variable**

- `Lifetime` — Normally tied to the process and the relevant scope.
- `NEW` — Saves prior bindings and creates a fresh local scope.
- `Subscripted local` — Stores sparse per-operation data in memory.

**Process-private global**

- `^||name` — Refers to a global visible only to its owning process.
- `Lifetime` — Spans routines in the same process and ends at process exit.

**Temporary global**

- `Temporary database mapping` — Places shared scratch data in temporary storage.
- `Cleanup` — Depends on application ownership and restart behavior.

**Persistent global**

- `Regular database mapping` — Lets global data outlive the creating process.
- `Durability` — Depends on database and journaling configuration.

**Storage choice**

- `Visibility and ownership` — Determine which sessions can access and clean up data.
- `$JOB` — Identifies the current process.
- `$DATA` — Reports the state of a node.
- `$GET` — Reads a node with a default.

**ObjectScript commands**

- `DO` — Invokes a routine, label or method.
- `FOR` — Repeats a block or command according to a loop specification.
- `HANG` — Pauses the current process for a specified duration.
- `KILL` — Removes a variable or a node and all its descendants.
- `QUIT` — Leaves the current loop, block or invocation as determined by context.
- `SET` — Assigns a value to a variable, property or assignable expression.
- `WHILE` — Repeats the block while its condition holds.
- `WRITE` — Sends formatted output to the current device.

**System variables and macros**

- `$ZERROR` — Reports the last ObjectScript error text.
- `$ZTIMESTAMP` — Reports UTC date and time with fractional seconds.
- `$$$OK` — Supplies a success status.

### T3.1 · 2/2 · System methods and functions

Image: [visual-guide-glossary-02.png](<T3 - IRIS Features/T3.1 - Differentiates Storage Media/visual-guide-glossary-02.png>)

**System methods and functions**

- `##class(%Stream.FileCharacter).%New()` — Creates a character stream backed by a file.
- `$DATA(node)` — Reports whether a node has data, descendants, both or neither.
- `$GET(node, default)` — Returns the node value or a default.
- `$INCREMENT(node, amount)` — Atomically adds an amount and returns the new value.
- `$ORDER(node, direction)` — Returns the next or previous sibling subscript.
- `$PIECE(text, delimiter, from, to)` — Returns one or more delimited fields.
- `$ZSTRIP(text, action)` — Removes characters according to class and position rules.
- `stream.LinkToFile(fileName)` — Associates a file stream with a path.
- `stream.ReadLine()` — Reads a line at the current stream position.
### T3.2 · 1/5 · Key terms

Image: [visual-guide-glossary-01.png](<T3 - IRIS Features/T3.2 - Leverages ObjectScript - SQL Features/visual-guide-glossary-01.png>)

**Weak typing and coercion**

- `Runtime coercion` — Interprets a value according to its numeric, string or Boolean context.
- `Datatype boundary` — Applies class or SQL datatype checks and conversions.

**Macros and includes**

- `$$$name` — References a compile-time macro.
- `#define` — Declares a macro.
- `#include and Include` — Make shared definitions available to the compiler.
- `%occStatus` — Provides standard status macros.

**Object-to-SQL projection**

- `Persistent class` — Projects a SQL table by default.
- `Property` — Projects a column when the property is SQL-visible.
- `SqlName` — Changes the SQL name in its declaration context.
- `SqlProc` — Exposes a method or query as a SQL procedure.

**Embedded and dynamic SQL**

- `&sql` — Embeds SQL and binds named host variables.
- `%SQL.Statement` — Represents a prepared or executable SQL statement.
- `%Prepare` — Prepares the statement and reports a status.
- `%Execute` — Runs it with positional parameters.
- `%Next` — Advances through returned rows.

**Select modes**

- `Logical` — Uses internal data representations.
- `ODBC` — Uses interoperability formats.
- `Display` — Uses display-oriented formats.
- `%EXTERNAL, %INTERNAL and %ODBCOUT` — Request explicit representation conversion.

### T3.2 · 2/5 · Key terms

Image: [visual-guide-glossary-02.png](<T3 - IRIS Features/T3.2 - Leverages ObjectScript - SQL Features/visual-guide-glossary-02.png>)

**Result metadata**

- `SQLCODE` — Distinguishes success, end of results and error.
- `%ROWCOUNT` — Reports row count for the operation in context.
- `%ROWID` — Reports a row ID where supplied.

**ObjectScript commands**

- `ELSE` — Runs the alternative branch when the condition is false.
- `ELSEIF` — Tests an additional condition after a false branch.
- `FOR` — Repeats a block or command according to a loop specification.
- `IF` — Runs the following command or block when its condition is true.
- `QUIT` — Leaves the current loop, block or invocation as determined by context.
- `RETURN` — Returns control, optionally with a value, to the caller.
- `THROW` — Raises an exception object.
- `WHILE` — Repeats the block while its condition holds.
- `WRITE` — Sends formatted output to the current device.
- `%ID` — Exposes the row's persistent identifier in SQL.

**System variables and macros**

- `$HOROLOG` — Reports local date and time as day and seconds fields.
- `$SYSTEM` — Provides shorthand access to the IRIS %SYSTEM package.
- `$$$ERROR` — Builds an error status from its code and arguments.
- `$$$GeneralError` — Identifies the general-error code used with message text.
- `$$$ISERR` — Tests whether a status indicates an error.
- `$$$ISOK` — Tests whether a status indicates success.

### T3.2 · 3/5 · Key terms

Image: [visual-guide-glossary-03.png](<T3 - IRIS Features/T3.2 - Leverages ObjectScript - SQL Features/visual-guide-glossary-03.png>)

**System variables and macros**

- `$$$NULLOREF` — Supplies the null object reference.
- `$$$OK` — Supplies a success status.
- `$$$ThrowOnError` — Throws if the supplied status indicates an error.
- `$$$ThrowStatus` — Raises an exception from the supplied error status.

**SQL statements and clauses**

- `DECLARE CURSOR` — Gives a result set a name for Embedded SQL row-by-row fetch.
- `OPEN (cursor)` — Starts a declared cursor.
- `FETCH` — Reads the next cursor row into host variables.
- `CLOSE (cursor)` — Closes the cursor and releases its resources.
- `SELECT` — Reads rows and expressions from one or more sources.
- `FROM` — Names the source tables or queries.
- `WHERE` — Keeps rows whose predicate is true.
- `INSERT INTO` — Creates rows in the named table.
- `VALUES` — Supplies row values for an insert.
- `UPDATE` — Changes values in existing rows.
- `SET (SQL)` — Defines the columns and expressions updated by an UPDATE.
- `%ID` — Exposes the row's persistent identifier in SQL.
- `%msg` — Contains diagnostic text for a SQL error where supplied.

### T3.2 · 4/5 · System methods and functions

Image: [visual-guide-glossary-04.png](<T3 - IRIS Features/T3.2 - Leverages ObjectScript - SQL Features/visual-guide-glossary-04.png>)

**System methods and functions**

- `##class(%Exception.StatusException).CreateFromStatus(status)` — Creates an exception object from a status.
- `##class(%SQL.Statement).%New()` — Creates a dynamic SQL statement object.
- `##class(%SYS.System).WriteToConsoleLog(message)` — Writes a message to the IRIS console log.
- `##class(App.Record).%New()` — Creates a new in-memory instance of the class.
- `##class(App.Record).%OpenId(id, concurrency, .status)` — Opens a record by ID. The concurrency and status arguments are optional.
- `%EXTERNAL(column)` — Converts the value to its display representation.
- `%INTERNAL(column)` — Requests the internal representation of the value.
- `%ODBCOUT(column)` — Converts a value to its ODBC representation.
- `$CHAR(code1, code2)` — Builds a string from character codes.
- `$PIECE(text, delimiter, from, to)` — Returns one or more delimited fields.
- `$SYSTEM.SQL.Util.SetOption(option, value)` — Sets a named SQL option.

### T3.2 · 5/5 · System methods and functions

Image: [visual-guide-glossary-05.png](<T3 - IRIS Features/T3.2 - Leverages ObjectScript - SQL Features/visual-guide-glossary-05.png>)

**System methods and functions**

- `$SYSTEM.Status.AppendStatus(first, second)` — Combines two status values.
- `$SYSTEM.Status.GetErrorText(status)` — Returns status message text.
- `$ZDATE(days, format)` — Formats an internal day count.
- `COUNT(*)` — Counts rows, regardless of whether individual fields are NULL.
- `obj.%Id()` — Returns the persistent ID of the open object.
- `obj.%Save()` — Persists the object and returns a status.
- `result.%Get("ColumnName")` — Reads a result column by name.
- `result.%Next()` — Advances to the next SQL row and reports whether it exists.
- `stmt.%Execute(value)` — Runs the prepared statement with the given bound value.
- `stmt.%Prepare(sql)` — Prepares a dynamic statement and returns a status.

### T3.3 · 1/3 · Key terms

Image: [visual-guide-glossary-01.png](<T3 - IRIS Features/T3.3 - Handles Nulls/visual-guide-glossary-01.png>)

**Undefined and empty values**

- `Undefined variable` — Has no assigned value.
- `Empty string` — Has zero characters.
- `$CHAR(0)` — Represents a SQL empty string at the ObjectScript interface.

**SQL NULL**

- `NULL` — Represents a missing SQL value.
- `IS NULL and IS NOT NULL` — Test a value for nullness.
- `Three-valued logic` — A comparison with NULL can return unknown. WHERE keeps only true rows.

**Host variable and result**

- `SQLCODE` — Distinguishes a returned row from end of data or error.
- `Host variable` — Can be set to a defined empty string for SQL NULL.
- `$DATA` — Checks variable presence independently of SQL nullness.

**Fallback and aggregates**

- `COALESCE` — Returns the first non-NULL expression.
- `IFNULL` — Supplies a fallback based on whether its first argument is NULL.
- `COUNT(*)` — Counts all qualifying rows.
- `COUNT(column)` — Counts non-NULL values in a column.
- `SUM` — Sums non-NULL inputs.
- `AVG` — Averages non-NULL inputs.

### T3.3 · 2/3 · Key terms

Image: [visual-guide-glossary-02.png](<T3 - IRIS Features/T3.3 - Handles Nulls/visual-guide-glossary-02.png>)

**ObjectScript commands**

- `ELSE` — Runs the alternative branch when the condition is false.
- `ELSEIF` — Tests an additional condition after a false branch.
- `IF` — Runs the following command or block when its condition is true.
- `QUIT` — Leaves the current loop, block or invocation as determined by context.
- `SET` — Assigns a value to a variable, property or assignable expression.
- `WRITE` — Sends formatted output to the current device.
- `%ID` — Exposes the row's persistent identifier in SQL.

**SQL statements and clauses**

- `CREATE TABLE` — Defines a table and its columns.
- `INSERT INTO` — Creates rows in the named table.
- `VALUES` — Supplies row values for an insert.
- `SELECT` — Reads rows and expressions from one or more sources.
- `FROM` — Names the source tables or queries.
- `WHERE` — Keeps rows whose predicate is true.
- `&sql` — Embeds a SQL statement in ObjectScript.

### T3.3 · 3/3 · System methods and functions

Image: [visual-guide-glossary-03.png](<T3 - IRIS Features/T3.3 - Handles Nulls/visual-guide-glossary-03.png>)

**System methods and functions**

- `##class(App.Record).%New()` — Creates a new in-memory instance of the class.
- `##class(App.Record).%OpenId(id, concurrency, .status)` — Opens a record by ID. The concurrency and status arguments are optional.
- `$ASCII(text, position)` — Returns the numeric character code at a position.
- `$CHAR(code1, code2)` — Builds a string from character codes.
- `$DATA(node)` — Reports whether a node has data, descendants, both or neither.
- `$GET(node, default)` — Returns the node value or a default.
- `$LENGTH(text, delimiter)` — Counts delimited fields. Omit the delimiter to count characters.
- `$PIECE(text, delimiter, from, to)` — Returns one or more delimited fields.
- `AVG(column)` — Averages non-NULL values.
- `COALESCE(value1, value2)` — Returns the first non-NULL value in argument order.
- `COUNT(*)` — Counts rows, regardless of whether individual fields are NULL.
- `COUNT(column)` — Counts non-NULL values in that column.
- `IFNULL(value, whenNull, whenPresent)` — Selects the result according to whether the first argument is NULL.
- `obj.%Id()` — Returns the persistent ID of the open object.
- `obj.%Save()` — Persists the object and returns a status.
- `SUM(column)` — Adds the non-NULL values.

### T3.4 · 1/4 · Key terms

Image: [visual-guide-glossary-01.png](<T3 - IRIS Features/T3.4 - Handles Schema Evolution/visual-guide-glossary-01.png>)

**Schema evolution**

- `Class compilation` — Updates class metadata and generated code.
- `Backfill` — Populates or converts existing data.
- `Validation` — Checks revised metadata, stored rows and query results together.

**Index build and purge**

- `%BuildIndices` — Rebuilds or populates indexes for stored rows.
- `%PurgeIndices` — Removes index entries without deleting stored objects.
- `Index migration` — Checks returned statuses and representative query results.

**Rename and datatype change**

- `SqlFieldName` — Controls the name of the projected column.
- `Storage mapping` — Determines where existing values are stored.
- `Datatype conversion` — Migrates old values that cannot be read under the new definition.

**Cached and frozen plans**

- `Cached statement` — Can depend on the old schema or statistics.
- `Purge` — Invalidates affected cached queries for fresh preparation.
- `Frozen plan` — Retains a chosen strategy until it is deliberately changed or unfrozen.

**ObjectScript commands**

- `DO` — Invokes a routine, label or method.
- `FOR` — Repeats a block or command according to a loop specification.
- `IF` — Runs the following command or block when its condition is true.
- `QUIT` — Leaves the current loop, block or invocation as determined by context.

### T3.4 · 2/4 · Key terms

Image: [visual-guide-glossary-02.png](<T3 - IRIS Features/T3.4 - Handles Schema Evolution/visual-guide-glossary-02.png>)

**ObjectScript commands**

- `SET` — Assigns a value to a variable, property or assignable expression.
- `WRITE` — Sends formatted output to the current device.

**System variables and macros**

- `$SYSTEM` — Provides shorthand access to the IRIS %SYSTEM package.
- `$$$ISERR` — Tests whether a status indicates an error.

**SQL statements and clauses**

- `BUILD INDEX` — Populates an index for rows already stored in the table.
- `PURGE CACHED QUERIES` — Removes SQL cache entries within the chosen namespace, table, age or name scope.
- `CREATE INDEX` — Defines an index for a table.
- `DROP INDEX` — Removes the index definition and its index data.
- `ALTER TABLE` — Changes an existing table definition.
- `SELECT` — Reads rows and expressions from one or more sources.
- `FROM` — Names the source tables or queries.
- `WHERE` — Keeps rows whose predicate is true.
- `&sql` — Embeds a SQL statement in ObjectScript.
- `SQLCODE` — Reports the result of an Embedded SQL operation.
- `%NOFPLAN` — Directs the optimizer to ignore a frozen plan for a statement.

### T3.4 · 3/4 · System methods and functions

Image: [visual-guide-glossary-03.png](<T3 - IRIS Features/T3.4 - Handles Schema Evolution/visual-guide-glossary-03.png>)

**System methods and functions**

- `##class(App.Record).%BuildIndices($LISTBUILD("IndexName"))` — Builds the named index for stored records.
- `##class(App.Record).%New()` — Creates a new in-memory instance of the class.
- `##class(App.Record).%OpenId(id, concurrency, .status)` — Opens a record by ID. The concurrency and status arguments are optional.
- `##class(App.Record).%PurgeIndices($LISTBUILD("IndexName"))` — Clears entries from the named index for a subsequent rebuild.
- `$LIST(list, position)` — Reads the element at the specified position.
- `$LISTBUILD(value1, value2)` — Encodes values as an ObjectScript list.
- `$ORDER(node, direction)` — Returns the next or previous sibling subscript.
- `$SYSTEM.OBJ.Compile(className, flags)` — Compiles the specified class with the given flags.
- `$SYSTEM.SQL.PurgeQueries()` — Purges cached queries in the current namespace.

### T3.4 · 4/4 · System methods and functions

Image: [visual-guide-glossary-04.png](<T3 - IRIS Features/T3.4 - Handles Schema Evolution/visual-guide-glossary-04.png>)

**System methods and functions**

- `$SYSTEM.SQL.PurgeQueries({"table":[tableName]})` — Purges cached queries that reference the named table.
- `$SYSTEM.SQL.Schema.ImportDDL(fileName)` — Imports SQL DDL from a file.
- `$SYSTEM.SQL.Statement.FreezeRelation(tableName)` — Freezes statement plans referencing the relation.
- `$SYSTEM.SQL.Statement.FreezeStatement(statementId)` — Freezes the plan of an identified statement.
- `$SYSTEM.SQL.Statement.UnfreezeRelation(tableName)` — Unfreezes statement plans referencing the relation.
- `$SYSTEM.SQL.Statement.UnfreezeStatement(statementId)` — Unfreezes the plan of an identified statement.
- `$SYSTEM.SQL.TuneTable(tableName)` — Updates optimizer statistics for the target table.
- `$SYSTEM.Status.GetErrorText(status)` — Returns status message text.
- `COUNT(*)` — Counts rows, regardless of whether individual fields are NULL.

### T3.5 · 1/4 · Key terms

Image: [visual-guide-glossary-01.png](<T3 - IRIS Features/T3.5 - Ensures Scalability and Performance/visual-guide-glossary-01.png>)

**Statistics and selectivity**

- `TUNE TABLE` — Updates table statistics used in optimizer estimates.
- `Selectivity` — Describes how much a predicate narrows the result.
- `Stale statistics` — Can distort estimates after significant data changes.

**Plan interpretation**

- `Scan and index probe` — Show how the engine accesses rows.
- `Filter and join` — Show how rows are narrowed and combined.
- `Result equivalence` — Verifies that alternative queries still return the same data.

**Correctness tests**

- `%UnitTest.TestCase` — Provides the base class for regression tests.
- `%UnitTest.Manager` — Runs and reports test suites.
- `Setup, assertion and teardown` — Control state, check outcomes and clean up afterward.

**Benchmarking**

- `Repeatability` — Keeps workloads and conditions comparable.
- `Duration and counters` — Show elapsed time alongside the work performed.

**ObjectScript commands**

- `DO` — Invokes a routine, label or method.
- `FOR` — Repeats a block or command according to a loop specification.
- `IF` — Runs the following command or block when its condition is true.
- `QUIT` — Leaves the current loop, block or invocation as determined by context.
- `READ` — Reads input from the current device.
- `RETURN` — Returns control, optionally with a value, to the caller.
- `SET` — Assigns a value to a variable, property or assignable expression.
- `WHILE` — Repeats the block while its condition holds.
- `WRITE` — Sends formatted output to the current device.

### T3.5 · 2/4 · Key terms

Image: [visual-guide-glossary-02.png](<T3 - IRIS Features/T3.5 - Ensures Scalability and Performance/visual-guide-glossary-02.png>)

**ObjectScript commands**

- `%ID` — Exposes the row's persistent identifier in SQL.

**System variables and macros**

- `$HOROLOG` — Reports local date and time as day and seconds fields.
- `$SYSTEM` — Provides shorthand access to the IRIS %SYSTEM package.
- `$ZHOROLOG` — Reports elapsed time in seconds since IRIS startup.
- `$$$AssertEquals` — Checks that actual and expected values are equal.
- `$$$AssertNotEquals` — Checks that actual and expected values differ.
- `$$$AssertStatusNotOK` — Checks that a status indicates an error.
- `$$$AssertStatusOK` — Checks that a status indicates success.
- `$$$AssertTrue` — Checks that a test expression is true.
- `$$$ISOK` — Tests whether a status indicates success.
- `$$$OK` — Supplies a success status.

**SQL statements and clauses**

- `EXPLAIN` — Shows a query execution plan in the SQL Shell.
- `SHOW PLAN` — Displays the execution plan for the most recent query in the SQL Shell.
- `SELECT` — Reads rows and expressions from one or more sources.
- `FROM` — Names the source tables or queries.
- `WHERE` — Keeps rows whose predicate is true.
- `ORDER BY` — Chooses the order in which result rows appear.
- `JOIN` — Combines rows from related sources.
- `&sql` — Embeds a SQL statement in ObjectScript.

### T3.5 · 3/4 · System methods and functions

Image: [visual-guide-glossary-03.png](<T3 - IRIS Features/T3.5 - Ensures Scalability and Performance/visual-guide-glossary-03.png>)

**System methods and functions**

- `##class(%SQL.Statement).%New()` — Creates a dynamic SQL statement object.
- `##class(%UnitTest.Manager).DebugRunTestCase(suite, testCase)` — Runs a unit test case interactively for debugging.
- `##class(%UnitTest.Manager).RunTest(testSpec)` — Runs the specified unit test suite.
- `##class(App.Record).%DeleteId(id)` — Deletes the record with the supplied persistent ID.
- `##class(App.Record).%New()` — Creates a new in-memory instance of the class.
- `##class(App.Record).%OpenId(id, concurrency, .status)` — Opens a record by ID. The concurrency and status arguments are optional.
- `%SQLUPPER(column)` — Applies the SQLUPPER collation transformation.
- `$FNUMBER(number, format, decimals)` — Formats a numeric value to the specified precision.
- `$LIST(list, position)` — Reads the element at the specified position.
- `$LISTBUILD(value1, value2)` — Encodes values as an ObjectScript list.
- `$LISTGET(list, position, default)` — Reads an element or supplies a default.
- `$PIECE(text, delimiter, from, to)` — Returns one or more delimited fields.
- `$SYSTEM.SQL.Explain(sql)` — Generates and displays an execution plan for the SQL query.
- `$SYSTEM.SQL.PurgeQueries()` — Purges cached queries in the current namespace.

### T3.5 · 4/4 · System methods and functions

Image: [visual-guide-glossary-04.png](<T3 - IRIS Features/T3.5 - Ensures Scalability and Performance/visual-guide-glossary-04.png>)

**System methods and functions**

- `$SYSTEM.SQL.PurgeQueries({"table":[tableName]})` — Purges cached queries that reference the named table.
- `$SYSTEM.SQL.Stats.Table.GatherTableStats(tableName)` — Gathers optimizer statistics for the named table.
- `$SYSTEM.SQL.TuneTable(tableName)` — Updates optimizer statistics for the target table.
- `CHAR_LENGTH(text)` — Counts the characters in the SQL string.
- `COUNT(*)` — Counts rows, regardless of whether individual fields are NULL.
- `obj.%Id()` — Returns the persistent ID of the open object.
- `obj.%Save()` — Persists the object and returns a status.
- `result.%GetData(columnNumber)` — Reads a result column by its one-based ordinal.
- `result.%Next()` — Advances to the next SQL row and reports whether it exists.
- `stmt.%Display()` — Displays the prepared statement text and implementation information.
- `stmt.%Execute(value)` — Runs the prepared statement with the given bound value.
- `stmt.%GetImplementationDetails(.className, .sql)` — Retrieves implementation details of a prepared statement.
- `stmt.%Prepare(sql)` — Prepares a dynamic statement and returns a status.

### T4.1 · 1/2 · Key terms

Image: [visual-guide-glossary-01.png](<T4 - Functions & APIs/T4.1 - Traverses and Sorts Arrays/visual-guide-glossary-01.png>)

**Sparse multidimensional array**

- `Subscript` — Identifies a branch or leaf in the tree.
- `Node value` — Can exist independently of child nodes.

**Collation**

- `Canonical numeric subscript` — Sorts numerically under standard collation.
- `Text subscript` — Sorts as text, so 02 is distinct from canonical 2.

**Traversal**

- `$ORDER` — Returns the next sibling subscript, or the previous one with direction -1.
- `$QUERY` — Returns a full reference to the next or previous node.
- `Nested loops` — Visit each level of a multidimensional structure.

**Node state**

- `$DATA` — Returns 0, 1, 10 or 11 for neither, value only, descendants only or both.
- `$GET` — Reads a value without raising an undefined-variable error.
- `KILL` — Removes a variable or a node and its descendants.

**ObjectScript commands**

- `ELSE` — Runs the alternative branch when the condition is false.
- `FOR` — Repeats a block or command according to a loop specification.
- `IF` — Runs the following command or block when its condition is true.
- `QUIT` — Leaves the current loop, block or invocation as determined by context.
- `SET` — Assigns a value to a variable, property or assignable expression.
- `WHILE` — Repeats the block while its condition holds.
- `WRITE` — Sends formatted output to the current device.

### T4.1 · 2/2 · System methods and functions

Image: [visual-guide-glossary-02.png](<T4 - Functions & APIs/T4.1 - Traverses and Sorts Arrays/visual-guide-glossary-02.png>)

**System methods and functions**

- `$DATA(node)` — Reports whether a node has data, descendants, both or neither.
- `$GET(node, default)` — Returns the node value or a default.
- `$ORDER(node, -1)` — Finds the previous sibling subscript.
- `$ORDER(node, direction)` — Returns the next or previous sibling subscript.
- `$QUERY(node, direction)` — Returns the next or previous full node reference.

### T4.2 · 1/2 · Key terms

Image: [visual-guide-glossary-01.png](<T4 - Functions & APIs/T4.2 - Manipulates Lists/visual-guide-glossary-01.png>)

**Encoded list**

- `$LISTBUILD` — Creates an encoded one-based list.
- `Empty element` — Stores an empty value at an existing position.
- `Omitted element` — Leaves that position without a defined value.

**Access and update**

- `$LIST` — Reads a position, slices a range or sets an element.
- `$LISTGET` — Reads an element with a default for an omitted value.
- `$LISTLENGTH` — Counts positions in a list.
- `$LISTVALID` — Checks whether a value is a valid encoded list.

**Sequential operations**

- `$LISTNEXT` — Advances a position variable and supplies the next value.
- `$LISTFIND` — Returns the position of a matching value.
- `$LISTSAME` — Checks for equivalent lists.

**Delimited text**

- `$LISTFROMSTRING` — Splits delimited text into an encoded list.
- `$LISTTOSTRING` — Joins list values with a delimiter.
- `Round-trip` — Requires attention to delimiters and empty fields.

**ObjectScript commands**

- `ELSE` — Runs the alternative branch when the condition is false.
- `FOR` — Repeats a block or command according to a loop specification.
- `IF` — Runs the following command or block when its condition is true.
- `SET` — Assigns a value to a variable, property or assignable expression.
- `WHILE` — Repeats the block while its condition holds.
- `WRITE` — Sends formatted output to the current device.

### T4.2 · 2/2 · System methods and functions

Image: [visual-guide-glossary-02.png](<T4 - Functions & APIs/T4.2 - Manipulates Lists/visual-guide-glossary-02.png>)

**System methods and functions**

- `$CHAR(code1, code2)` — Builds a string from character codes.
- `$DATA(node)` — Reports whether a node has data, descendants, both or neither.
- `$LIST(list, first, last)` — Returns an encoded sublist from first through last.
- `$LIST(list, position)` — Reads the element at the specified position.
- `$LISTBUILD()` — Creates an empty encoded list.
- `$LISTBUILD(value1, value2)` — Encodes values as an ObjectScript list.
- `$LISTFIND(list, value, startAfter)` — Returns the position of a matching list value.
- `$LISTFROMSTRING(text, delimiter)` — Splits delimited text into an encoded list.
- `$LISTGET(list, position, default)` — Reads an element or supplies a default.
- `$LISTLENGTH(list)` — Counts list positions.
- `$LISTNEXT(list, position, value)` — Advances the position variable and outputs the next element.
- `$LISTSAME(list1, list2)` — Tests whether two encoded lists contain equivalent elements.
- `$LISTTOSTRING(list, delimiter)` — Joins list elements as delimited text.
- `$LISTVALID(value)` — Tests whether a value is a valid encoded list.
- `SET $LIST(list, position) = value` — Writes to the specified position in the encoded list.

### T4.3 · 1/2 · Key terms

Image: [visual-guide-glossary-01.png](<T4 - Functions & APIs/T4.3 - Manipulates Strings/visual-guide-glossary-01.png>)

**Fields and character positions**

- `$PIECE` — Reads or sets one-based delimited fields.
- `$EXTRACT` — Reads or sets characters by one-based position.

**Replacement and stripping**

- `$REPLACE` — Substitutes occurrences of a substring.
- `$TRANSLATE` — Maps or removes single characters.
- `$ZSTRIP` — Removes characters according to character-class rules.

**Concatenation and matching**

- `_` — Concatenates strings.
- `$LENGTH` — Counts characters or delimited fields.
- `$MATCH` — Tests whether the entire input matches a regular expression.
- `$LOCATE` — Finds a regular expression match within an input.
- `?` — Tests an ObjectScript pattern.

**Encoding and escapes**

- `$ZCONVERT` — Changes case or applies an encoding for a specified context.
- `URL and HTML` — Use different escaping rules for their output contexts.
- `Doubled quotes` — Represent a literal quotation mark inside an ObjectScript string.

**ObjectScript commands**

- `FOR` — Repeats a block or command according to a loop specification.
- `IF` — Runs the following command or block when its condition is true.
- `QUIT` — Leaves the current loop, block or invocation as determined by context.
- `RETURN` — Returns control, optionally with a value, to the caller.
- `SET` — Assigns a value to a variable, property or assignable expression.
- `WRITE` — Sends formatted output to the current device.

### T4.3 · 2/2 · System methods and functions

Image: [visual-guide-glossary-02.png](<T4 - Functions & APIs/T4.3 - Manipulates Strings/visual-guide-glossary-02.png>)

**System methods and functions**

- `$ASCII(text, position)` — Returns the numeric character code at a position.
- `$CHAR(code1, code2)` — Builds a string from character codes.
- `$EXTRACT(text, from, to)` — Returns a substring by character position.
- `$LENGTH(text, delimiter)` — Counts delimited fields. Omit the delimiter to count characters.
- `$LOCATE(text, regex, start)` — Finds a regular expression match.
- `$MATCH(text, regex)` — Tests whether the entire input matches a regular expression.
- `$PIECE(text, delimiter, from, to)` — Returns one or more delimited fields.
- `$REPLACE(text, old, new)` — Substitutes occurrences of a substring.
- `$TRANSLATE(text, from, to)` — Maps or removes individual characters.
- `$ZCONVERT(text, mode)` — Converts case or applies an encoding mode.
- `$ZSTRIP(text, action)` — Removes characters according to class and position rules.

### T4.4 · 1/2 · Key terms

Image: [visual-guide-glossary-01.png](<T4 - Functions & APIs/T4.4 - Mathematical, Logical, and Date - Time Operations/visual-guide-glossary-01.png>)

**Arithmetic evaluation**

- `Evaluation order` — Evaluates binary arithmetic left to right unless parentheses group it.
- `\ and #` — Perform integer division and remainder respectively.
- `` — Raises a number to a power.

**Logical evaluation**

- `Grouping` — Makes the order of comparisons and Boolean operations explicit.
- `Apostrophe` — Negates a logical expression or comparison operator.
- `Contains and follows` — Test substring membership and string ordering respectively.

**Clocks and duration**

- `$HOROLOG` — Reports the local day and seconds.
- `$ZTIMESTAMP` — Reports UTC day and fractional seconds.
- `$ZHOROLOG` — Measures seconds elapsed since IRIS startup.

**Formatting and arithmetic**

- `$ZDATE` — Formats an internal day count.
- `$ZDATEH` — Parses a date to its internal day count.
- `$ZTIME` — Formats a seconds-of-day value.
- `$ZTIMEH` — Parses a time to seconds of day.
- `Duration across midnight` — Includes both the change in day count and seconds.

**ObjectScript commands**

- `FOR` — Repeats a block or command according to a loop specification.
- `IF` — Runs the following command or block when its condition is true.
- `SET` — Assigns a value to a variable, property or assignable expression.
- `WRITE` — Sends formatted output to the current device.

**System variables and macros**

- `$SYSTEM` — Provides shorthand access to the IRIS %SYSTEM package.

### T4.4 · 2/2 · System methods and functions

Image: [visual-guide-glossary-02.png](<T4 - Functions & APIs/T4.4 - Mathematical, Logical, and Date - Time Operations/visual-guide-glossary-02.png>)

**System methods and functions**

- `$INCREMENT(node, amount)` — Atomically adds an amount and returns the new value.
- `$JUSTIFY(value, width, decimals)` — Right-aligns or formats a numeric value.
- `$NOW()` — Returns the current date and time with fractional seconds.
- `$PIECE(text, delimiter, from, to)` — Returns one or more delimited fields.
- `$SYSTEM.SQL.DATEADD("day", amount, dateValue)` — Adds a date interval through the deprecated SQL system wrapper.
- `$SYSTEM.SQL.DATEDIFF("day", startDate, endDate)` — Measures a date interval through the deprecated SQL system wrapper.
- `$SYSTEM.SQL.Functions.DATEADD("day", amount, dateValue)` — Adds a date interval using the ObjectScript SQL functions API.
- `$ZDATE(days, format)` — Formats an internal day count.
- `$ZDATEH(dateText, format)` — Converts a formatted date to an internal day count.
- `$ZTIME(seconds, format)` — Formats an internal seconds-of-day value.
- `$ZTIMEH(timeText, format)` — Parses a time as an internal seconds-of-day value.
- `DATEADD('day', amount, dateValue)` — Adds a specified number of date parts to a SQL date or timestamp.
- `DATEDIFF('day', startDate, endDate)` — Counts the specified date-part intervals between values.

### T4.5 · 1/2 · Key terms

Image: [visual-guide-glossary-01.png](<T4 - Functions & APIs/T4.5 - Decision and Control Structures/visual-guide-glossary-01.png>)

**Postconditionals**

- `COMMAND:condition` — Runs one command only when the condition is true.
- `Block IF` — Groups multiple statements under one condition.

**Loop exit and method return**

- `QUIT` — Exits the current loop, block or invocation as determined by context.
- `RETURN` — Exits the method or procedure from its current block.

**Boolean evaluation**

- `& and !` — Evaluate both operands for AND and OR respectively.
- `&& and ||` — Stop evaluating as soon as the result is known.
- `Parentheses` — Make the intended grouping explicit.

**Loop and selection flow**

- `FOR` — Repeats work over a range or with explicit exit logic.
- `WHILE` — Repeats as long as its condition holds.
- `CONTINUE` — Skips to the next iteration.
- `$SELECT` — Returns the value for the first true condition.

**ObjectScript commands**

- `DO` — Invokes a routine, label or method.
- `KILL` — Removes a variable or a node and all its descendants.
- `SET` — Assigns a value to a variable, property or assignable expression.
- `THROW` — Raises an exception object.
- `WRITE` — Sends formatted output to the current device.
- `IF` — Runs the following command or block when its condition is true.
- `ELSE` — Runs the alternative branch when the condition is false.
- `ELSEIF` — Tests an additional condition after a false branch.

**System variables and macros**

- `$$$ERROR` — Builds an error status from its code and arguments.
- `$$$GeneralError` — Identifies the general-error code used with message text.
- `$$$OK` — Supplies a success status.

### T4.5 · 2/2 · System methods and functions

Image: [visual-guide-glossary-02.png](<T4 - Functions & APIs/T4.5 - Decision and Control Structures/visual-guide-glossary-02.png>)

**System methods and functions**

- `##class(%Exception.StatusException).CreateFromStatus(status)` — Creates an exception object from a status.
- `$DATA(node)` — Reports whether a node has data, descendants, both or neither.
- `$GET(node, default)` — Returns the node value or a default.
- `$LENGTH(text, delimiter)` — Counts delimited fields. Omit the delimiter to count characters.
- `$LIST(list, position)` — Reads the element at the specified position.
- `$LISTBUILD(value1, value2)` — Encodes values as an ObjectScript list.
- `$LISTLENGTH(list)` — Counts list positions.
- `$RANDOM(limit)` — Returns a random integer from zero through limit minus one.
- `$SELECT(condition:value, 1:default)` — Returns the value for the first true condition.
- `list.Count()` — Returns the number of elements in the list collection.
- `list.GetAt(position)` — Returns the collection element at the specified position.

### T4.6 · 1/4 · Key terms

Image: [visual-guide-glossary-01.png](<T4 - Functions & APIs/T4.6 - Executes Methods and Queries Objects/visual-guide-glossary-01.png>)

**Dynamic dispatch**

- `$METHOD` — Calls an instance method selected at runtime.
- `$CLASSMETHOD` — Calls a class method selected at runtime.
- `$PROPERTY` — Reads or sets a property by runtime name.
- `Allowlist` — Restricts invocation to known safe class and member names.

**Object type**

- `%ClassName` — Returns the short name by default and the full name with argument 1.
- `$CLASSNAME` — Returns the full class name.
- `%IsA` — Tests the primary inheritance chain.
- `%Extends` — Checks inheritance, including secondary superclasses.

**Metadata dictionaries**

- `ClassDefinition, MethodDefinition and PropertyDefinition` — Describe source metadata.
- `CompiledClass, CompiledMethod and CompiledProperty` — Describe compiled metadata including inherited members.

**Metadata lookup**

- `Known ID` — Opens a dictionary record directly by its key.
- `Bound query` — Finds records using parameters instead of concatenating values.
- `Missing metadata` — Can be checked before attempting a dynamic invocation.

**ObjectScript commands**

- `CATCH` — Receives the exception raised in the corresponding TRY block.
- `CONTINUE` — Skips the rest of the current loop iteration.

### T4.6 · 2/4 · Key terms

Image: [visual-guide-glossary-02.png](<T4 - Functions & APIs/T4.6 - Executes Methods and Queries Objects/visual-guide-glossary-02.png>)

**ObjectScript commands**

- `DO` — Invokes a routine, label or method.
- `ELSE` — Runs the alternative branch when the condition is false.
- `ELSEIF` — Tests an additional condition after a false branch.
- `FOR` — Repeats a block or command according to a loop specification.
- `IF` — Runs the following command or block when its condition is true.
- `QUIT` — Leaves the current loop, block or invocation as determined by context.
- `SET` — Assigns a value to a variable, property or assignable expression.
- `TRY` — Begins a block watched for exceptions.
- `WHILE` — Repeats the block while its condition holds.
- `WRITE` — Sends formatted output to the current device.

**System variables and macros**

- `$SYSTEM` — Provides shorthand access to the IRIS %SYSTEM package.
- `$$$ISERR` — Tests whether a status indicates an error.

**SQL statements and clauses**

- `SELECT` — Reads rows and expressions from one or more sources.
- `FROM` — Names the source tables or queries.
- `WHERE` — Keeps rows whose predicate is true.

### T4.6 · 3/4 · System methods and functions

Image: [visual-guide-glossary-03.png](<T4 - Functions & APIs/T4.6 - Executes Methods and Queries Objects/visual-guide-glossary-03.png>)

**System methods and functions**

- `##class(%Dictionary.ClassDefinition).%OpenId(className)` — Opens the source definition of the named class.
- `##class(%Dictionary.CompiledClass).%OpenId(className)` — Opens compiled metadata for the named class.
- `##class(%SQL.Statement).%New()` — Creates a dynamic SQL statement object.
- `##class(App.Record).%ExistsId(id)` — Tests whether an object with the given ID exists.
- `##class(App.Record).%Extends(className)` — Checks whether the class extends the given class, including secondary inheritance.
- `##class(App.Record).%New()` — Creates a new in-memory instance of the class.
- `##class(App.Record).%OpenId(id, concurrency, .status)` — Opens a record by ID. The concurrency and status arguments are optional.
- `##class(App.Record).%PackageName()` — Returns the package portion of the class name.
- `$CLASSMETHOD(className, methodName, arg)` — Invokes a class method selected at runtime.
- `$CLASSNAME(obj)` — Returns the object's fully qualified class name.
- `$EXTRACT(text, from, to)` — Returns a substring by character position.
- `$ISOBJECT(obj)` — Indicates whether the value is an object reference.
- `$LISTBUILD(value1, value2)` — Encodes values as an ObjectScript list.

### T4.6 · 4/4 · System methods and functions

Image: [visual-guide-glossary-04.png](<T4 - Functions & APIs/T4.6 - Executes Methods and Queries Objects/visual-guide-glossary-04.png>)

**System methods and functions**

- `$LISTNEXT(list, position, value)` — Advances the position variable and outputs the next element.
- `$METHOD(obj, methodName, arg)` — Invokes an instance method selected at runtime.
- `$PIECE(text, delimiter, from, to)` — Returns one or more delimited fields.
- `$PROPERTY(obj, propertyName)` — Reads a property selected at runtime.
- `list.Count()` — Returns the number of elements in the list collection.
- `list.GetAt(position)` — Returns the collection element at the specified position.
- `obj.%ClassName(1)` — Returns the fully qualified class name. Omit 1 for the short name.
- `obj.%IsA(className)` — Tests membership in the object's primary class hierarchy.
- `result.%Get("ColumnName")` — Reads a result column by name.
- `result.%Next()` — Advances to the next SQL row and reports whether it exists.
- `stmt.%Execute(value)` — Runs the prepared statement with the given bound value.
- `stmt.%Prepare(sql)` — Prepares a dynamic statement and returns a status.

### T4.7 · 1/5 · Key terms

Image: [visual-guide-glossary-01.png](<T4 - Functions & APIs/T4.7 - Uses APIs for Common Operations/visual-guide-glossary-01.png>)

**Stream types**

- `File, global and temporary streams` — Choose where stream data is stored.
- `Character stream` — Works with text and character encoding.
- `Binary stream` — Preserves raw bytes.

**File stream navigation**

- `LinkToFile` — Associates the stream with a file path.
- `Read` — Reads a chunk from the current position.
- `ReadLine` — Reads a line from the current position.
- `AtEnd` — Indicates whether reading has reached the end.
- `Size` — Reports stream length.
- `Rewind` — Resets the current position.
- `CopyFrom` — Copies content from another stream.

**HTTP transport and response**

- `%Net.HttpRequest` — Defines the endpoint, headers, body and TLS settings.
- `Transport status` — Reports whether the send operation succeeded.
- `HttpResponse.StatusCode` — Reports the HTTP result returned by the server.
- `HttpResponse.Data` — Contains the response body stream.

**FTP and SMTP**

- `%Net.FtpSession` — Manages FTP connections and file transfers.
- `%Net.MailMessage` — Holds message headers, body and attachments.

### T4.7 · 2/5 · Key terms

Image: [visual-guide-glossary-02.png](<T4 - Functions & APIs/T4.7 - Uses APIs for Common Operations/visual-guide-glossary-02.png>)

**FTP and SMTP**

- `%Net.SMTP` — Submits mail to an SMTP server.

**ObjectScript commands**

- `DO` — Invokes a routine, label or method.
- `ELSE` — Runs the alternative branch when the condition is false.
- `ELSEIF` — Tests an additional condition after a false branch.
- `FOR` — Repeats a block or command according to a loop specification.
- `IF` — Runs the following command or block when its condition is true.
- `QUIT` — Leaves the current loop, block or invocation as determined by context.
- `SET` — Assigns a value to a variable, property or assignable expression.
- `WHILE` — Repeats the block while its condition holds.
- `WRITE` — Sends formatted output to the current device.
- `CLOSE` — Closes the device identified by its argument.
- `OPEN` — Opens the specified I/O device.

**System variables and macros**

- `$SYSTEM` — Provides shorthand access to the IRIS %SYSTEM package.
- `$$$ISERR` — Tests whether a status indicates an error.
- `$$$ISOK` — Tests whether a status indicates success.

### T4.7 · 3/5 · System methods and functions

Image: [visual-guide-glossary-03.png](<T4 - Functions & APIs/T4.7 - Uses APIs for Common Operations/visual-guide-glossary-03.png>)

**System methods and functions**

- `##class(%DynamicObject).%FromJSON(json)` — Parses JSON into a dynamic entity.
- `##class(%Net.FtpSession).%New()` — Creates an FTP session object.
- `##class(%Net.HttpRequest).%New()` — Creates an HTTP request object.
- `##class(%Net.MailMessage).%New()` — Creates a mail message object.
- `##class(%Net.SMTP).%New()` — Creates an SMTP client.
- `##class(%Stream.FileCharacter).%New()` — Creates a character stream backed by a file.
- `##class(%Stream.GlobalCharacter).%New()` — Creates a character stream backed by an IRIS global.
- `$CHAR(code1, code2)` — Builds a string from character codes.
- `$LENGTH(text, delimiter)` — Counts delimited fields. Omit the delimiter to count characters.
- `$SYSTEM.Status.DisplayError(status)` — Writes error details to the current device.
- `$SYSTEM.Status.GetErrorText(status)` — Returns status message text.
- `$SYSTEM.Status.IsError(status)` — Tests whether the status represents an error.
- `ftp.Connect(server, username, password, port)` — Opens an FTP session and reports success as a Boolean.
- `ftp.Delete(fileName)` — Deletes a remote file through the FTP session.
- `ftp.List(pattern, .entries)` — Writes the matching directory entries to an output stream.

### T4.7 · 4/5 · System methods and functions

Image: [visual-guide-glossary-04.png](<T4 - Functions & APIs/T4.7 - Uses APIs for Common Operations/visual-guide-glossary-04.png>)

**System methods and functions**

- `ftp.Logout()` — Closes the FTP session.
- `ftp.Retrieve(fileName, .download)` — Retrieves the remote file to an output stream.
- `ftp.SetDirectory(path)` — Changes the remote working directory.
- `ftp.Store(fileName, upload)` — Uploads a stream to a remote file.
- `msg.AttachFile(directory, fileName)` — Adds a file attachment to the mail message.
- `msg.To.Insert(address)` — Adds a recipient to the message's To list.
- `obj.%Save()` — Persists the object and returns a status.
- `obj.%ToJSON()` — Serializes the dynamic entity as JSON.
- `request.Delete(path)` — Sends an HTTP DELETE request.
- `request.Get(path)` — Sends an HTTP GET request.
- `request.Head(path)` — Sends an HTTP HEAD request for response headers.
- `request.Patch(path)` — Sends an HTTP PATCH request for a partial update.
- `request.Post(path)` — Sends an HTTP POST request.
- `request.Put(path)` — Sends an HTTP PUT request.
- `request.Reset()` — Resets HTTP request state for reuse.

### T4.7 · 5/5 · System methods and functions

Image: [visual-guide-glossary-05.png](<T4 - Functions & APIs/T4.7 - Uses APIs for Common Operations/visual-guide-glossary-05.png>)

**System methods and functions**

- `request.Send("GET", path)` — Sends a request using an explicit HTTP verb.
- `request.Send("OPTIONS", path)` — Queries the server's communication options for a resource.
- `request.SetHeader(name, value)` — Sets an HTTP request header.
- `response.GetHeader(name)` — Returns the value of the named HTTP response header.
- `smtp.Send(msg)` — Submits the email message to the configured SMTP server.
- `stream.Clear()` — Clears contents and resets the stream.
- `stream.CopyFrom(source)` — Copies data from the source stream into the destination.
- `stream.Flush()` — Flushes buffered writes.
- `stream.LinkToFile(fileName)` — Associates a file stream with a path.
- `stream.MoveToEnd()` — Moves the stream cursor to the end.
- `stream.Read(length)` — Reads up to the requested number of characters or bytes.
- `stream.ReadLine()` — Reads a line at the current stream position.
- `stream.Rewind()` — Moves the stream cursor back to the start.
- `stream.Write(data)` — Writes the supplied data to the stream.
- `stream.WriteLine(text)` — Writes text followed by a line terminator.

### T5.1 · 1/3 · Key terms

Image: [visual-guide-glossary-01.png](<T5 - Error Handling/T5.1 - Uses Troubleshooting Tools/visual-guide-glossary-01.png>)

**Performance baseline**

- `Comparable runs` — Repeat equivalent workloads under similar conditions.
- `Elapsed time and counters` — Track time together with global, code and SQL activity.

**Line and SQL tools**

- `DO ^%SYS.MONLBL` — Opens interactive line-by-line monitoring.
- `%Monitor.System.LineByLine` — Provides the monitoring class API.
- `%SYS.PTools.StatsSQL` — Exposes SQL performance statistics and supersedes the older SQLStats class.

**Class compilation**

- `Namespace` — Determines the target classes and routines available to the compiler.
- `Compile status` — Reports source, include and dependency failures.
- `First failure` — Often explains later generated-code diagnostics.

**Flags and generated routines**

- `Compiler flags` — Control aspects of generated code and diagnostic output.
- `Generated routine` — Maps runtime failures back to generated and source lines.

**ObjectScript commands**

- `DO` — Invokes a routine, label or method.
- `FOR` — Repeats a block or command according to a loop specification.
- `HANG` — Pauses the current process for a specified duration.
- `IF` — Runs the following command or block when its condition is true.
- `QUIT` — Leaves the current loop, block or invocation as determined by context.
- `RETURN` — Returns control, optionally with a value, to the caller.
- `SET` — Assigns a value to a variable, property or assignable expression.
- `WRITE` — Sends formatted output to the current device.
- `ZNAMESPACE` — Switches the current process to another namespace.
- `SQLCODE` — Reports the result of an Embedded SQL operation.

**System variables and macros**

- `$HOROLOG` — Reports local date and time as day and seconds fields.
- `$SYSTEM` — Provides shorthand access to the IRIS %SYSTEM package.
- `$ZHOROLOG` — Reports elapsed time in seconds since IRIS startup.
- `$ZTIMESTAMP` — Reports UTC date and time with fractional seconds.
- `$$$ISERR` — Tests whether a status indicates an error.

### T5.1 · 2/3 · System methods and functions

Image: [visual-guide-glossary-02.png](<T5 - Error Handling/T5.1 - Uses Troubleshooting Tools/visual-guide-glossary-02.png>)

**System methods and functions**

- `##class(%Monitor.System.LineByLine).Start($LISTBUILD(routine))` — Starts line-by-line monitoring for the named routine.
- `##class(%Monitor.System.LineByLine).Stop()` — Stops line-by-line monitoring.
- `##class(%SQL.Statement).%ExecDirect(, sql, value)` — Prepares and executes SQL with a bound value.
- `##class(%SQL.Statement).%New()` — Creates a dynamic SQL statement object.
- `##class(%SYS.PTools.SQLStats).SetSQLStatsJob(mode)` — Controls SQL statistics collection for the current job through the legacy interface.
- `##class(App.Record).%New()` — Creates a new in-memory instance of the class.
- `$JUSTIFY(value, width, decimals)` — Right-aligns or formats a numeric value.
- `$PIECE(text, delimiter, from, to)` — Returns one or more delimited fields.
- `$RANDOM(limit)` — Returns a random integer from zero through limit minus one.
- `$SYSTEM.OBJ.Compile(className, flags)` — Compiles the specified class with the given flags.
- `$SYSTEM.OBJ.CompileAll(flags)` — Compiles the classes in the current namespace.

### T5.1 · 3/3 · System methods and functions

Image: [visual-guide-glossary-03.png](<T5 - Error Handling/T5.1 - Uses Troubleshooting Tools/visual-guide-glossary-03.png>)

**System methods and functions**

- `$SYSTEM.OBJ.CompileList(classList, flags)` — Compiles the supplied list of classes.
- `$SYSTEM.OBJ.CompilePackage(packageName, flags)` — Compiles classes in a package.
- `$SYSTEM.OBJ.ShowFlags()` — Displays the object compiler flags.
- `$SYSTEM.SQL.Explain(sql)` — Generates and displays an execution plan for the SQL query.
- `$SYSTEM.SQL.SetSQLStatsFlagJob(mode)` — Controls SQL statistics collection for the current job.
- `$SYSTEM.Status.DisplayError(status)` — Writes error details to the current device.
- `$SYSTEM.Status.GetErrorText(status)` — Returns status message text.
- `$SYSTEM.Status.IsError(status)` — Tests whether the status represents an error.
- `$TRANSLATE(text, from, to)` — Maps or removes individual characters.
- `obj.%Save()` — Persists the object and returns a status.
- `stmt.%Prepare(sql)` — Prepares a dynamic statement and returns a status.

### T5.2 · 1/4 · Key terms

Image: [visual-guide-glossary-01.png](<T5 - Error Handling/T5.2 - Handles and Logs Runtime Errors/visual-guide-glossary-01.png>)

**TRY, CATCH and THROW**

- `TRY` — Wraps work that may raise an exception.
- `CATCH` — Receives an exception OREF for handling or conversion.
- `THROW` — Raises or propagates an exception.

**%Status and exception**

- `%Status` — Carries success or error details in a return value.
- `$$$ISERR` — Detects an error status.
- `$$$ISOK` — Tests for success.
- `CreateFromStatus` — Creates an exception from a status.
- `AsStatus` — Converts an exception to a status.

**Diagnostics**

- `Name` — Identifies the exception type or reported error.
- `Code` — Holds the exception's error code.
- `Location` — Identifies the source location where the exception occurred.
- `Data` — Supplies additional exception context.
- `$STACK` — Reports stack levels and source context.
- `$ZERROR` — Holds the last ObjectScript error text.

**Application logging**

- `Failure context` — Captures details needed to investigate without recording secrets.
- `Rollback ownership` — Limits cleanup to the work owned by the failing routine.
- `Original error` — Remains available if cleanup raises another error.

**ObjectScript commands**

- `DO` — Invokes a routine, label or method.
- `ELSE` — Runs the alternative branch when the condition is false.
- `ELSEIF` — Tests an additional condition after a false branch.

### T5.2 · 2/4 · Key terms

Image: [visual-guide-glossary-02.png](<T5 - Error Handling/T5.2 - Handles and Logs Runtime Errors/visual-guide-glossary-02.png>)

**ObjectScript commands**

- `FOR` — Repeats a block or command according to a loop specification.
- `IF` — Runs the following command or block when its condition is true.
- `QUIT` — Leaves the current loop, block or invocation as determined by context.
- `RETURN` — Returns control, optionally with a value, to the caller.
- `SET` — Assigns a value to a variable, property or assignable expression.
- `WRITE` — Sends formatted output to the current device.
- `ZWRITE` — Displays variable values and subscripts for inspection.
- `%ID` — Exposes the row's persistent identifier in SQL.
- `SQLCODE` — Reports the result of an Embedded SQL operation.

**System variables and macros**

- `$HOROLOG` — Reports local date and time as day and seconds fields.
- `$SYSTEM` — Provides shorthand access to the IRIS %SYSTEM package.
- `$$$ADDSC` — Appends one status to another.
- `$$$ERROR` — Builds an error status from its code and arguments.
- `$$$GeneralError` — Identifies the general-error code used with message text.
- `$$$InvalidArgument` — Identifies the invalid-argument error code.
- `$$$OK` — Supplies a success status.
- `$$$ThrowOnError` — Throws if the supplied status indicates an error.
- `$$$ThrowStatus` — Raises an exception from the supplied error status.
- `$ZTRAP` — Identifies the legacy ObjectScript error handler.

### T5.2 · 3/4 · System methods and functions

Image: [visual-guide-glossary-03.png](<T5 - Error Handling/T5.2 - Handles and Logs Runtime Errors/visual-guide-glossary-03.png>)

**System methods and functions**

- `##class(%Exception.General).%New(name, code, location, data)` — Creates a general exception carrying diagnostic context.
- `##class(%Exception.StatusException).CreateFromStatus(status)` — Creates an exception object from a status.
- `##class(App.Record).%New()` — Creates a new in-memory instance of the class.
- `##class(App.Record).%Open(oid)` — Opens a persistent object by its OID.
- `##class(App.Record).%OpenId(id, concurrency, .status)` — Opens a record by ID. The concurrency and status arguments are optional.
- `$CHAR(code1, code2)` — Builds a string from character codes.
- `$INCREMENT(node, amount)` — Atomically adds an amount and returns the new value.
- `$LISTBUILD(value1, value2)` — Encodes values as an ObjectScript list.
- `$LISTGET(list, position, default)` — Reads an element or supplies a default.
- `$METHOD(obj, methodName, arg)` — Invokes an instance method selected at runtime.
- `$PIECE(text, delimiter, from, to)` — Returns one or more delimited fields.
- `$STACK(level, "MCODE")` — Returns ObjectScript source text for the stack level.
- `$STACK(level, "PLACE")` — Returns the execution location at a stack level.
- `$SYSTEM.OBJ.DisplayError(status)` — Displays a status error using the object utility API.
- `$SYSTEM.Status.AppendStatus(first, second)` — Combines two status values.

### T5.2 · 4/4 · System methods and functions

Image: [visual-guide-glossary-04.png](<T5 - Error Handling/T5.2 - Handles and Logs Runtime Errors/visual-guide-glossary-04.png>)

**System methods and functions**

- `$SYSTEM.Status.DecomposeStatus(status, .errors)` — Breaks a status into its constituent errors.
- `$SYSTEM.Status.DisplayError(status)` — Writes error details to the current device.
- `$SYSTEM.Status.Error(code, argument)` — Constructs an error status from an error code and its argument.
- `$SYSTEM.Status.GetErrorCodes(status)` — Returns error codes from the status.
- `$SYSTEM.Status.GetErrorText(status)` — Returns status message text.
- `$SYSTEM.Status.GetOneStatusText(status, index)` — Returns the message for one indexed error in the status.
- `$SYSTEM.Status.IsError(status)` — Tests whether the status represents an error.
- `$ZDATETIME(daySecondPair, dateFormat, timeFormat)` — Formats a day-and-seconds pair as date and time text.
- `ex.AsSQLCODE()` — Returns an SQLCODE for the exception.
- `ex.AsSQLMessage()` — Returns SQL-oriented exception message text.
- `ex.AsStatus()` — Converts an exception object to a status.
- `ex.DisplayString()` — Returns the exception in displayable form.
- `ex.Log()` — Records an exception in the application error log.
- `obj.%Id()` — Returns the persistent ID of the open object.
- `obj.%Save()` — Persists the object and returns a status.

### T5.3 · 1/5 · Key terms

Image: [visual-guide-glossary-01.png](<T5 - Error Handling/T5.3 - Diagnoses Common Errors/visual-guide-glossary-01.png>)

**&lt;SUBSCRIPT&gt; and &lt;UNDEFINED&gt;**

- `<SUBSCRIPT>` — Signals an invalid subscript operation.
- `<UNDEFINED>` — Signals a read from an undefined variable or node.
- `$DATA` — Checks for a value or descendants.
- `$GET` — Supplies a default when an undefined value is expected.

**&lt;PROTECT&gt; and &lt;FRAMESTACK&gt;**

- `<PROTECT>` — Signals a protected operation or insufficient access.
- `<FRAMESTACK>` — Signals exhausted call frames, often from uncontrolled recursion.
- `Base case` — Terminates a recursive algorithm.

**&lt;INVALID OREF&gt;**

- `Invalid object reference` — Prevents safe access to an instance's methods or properties.
- `$ISOBJECT` — Tests whether a value is an object reference.
- `Construction and open status` — Help identify why a reference was unavailable.

**Missing class, method or property**

- `Namespace and compilation` — Determine whether the definition is available.
- `Dispatch kind` — Determines whether the call needs a class or instance receiver.
- `Metadata inspection` — Checks that the target member exists and that its name matches.

**&lt;SYNTAX&gt;**

- `Syntax error` — Reports code the parser cannot accept.
- `First reported error` — Can identify the malformed bracket, argument, postconditional or indirection that triggered later errors.

**ObjectScript commands**

- `CATCH` — Receives the exception raised in the corresponding TRY block.
- `DO` — Invokes a routine, label or method.
- `ELSE` — Runs the alternative branch when the condition is false.
- `ELSEIF` — Tests an additional condition after a false branch.
- `FOR` — Repeats a block or command according to a loop specification.
- `IF` — Runs the following command or block when its condition is true.

### T5.3 · 2/5 · Key terms

Image: [visual-guide-glossary-02.png](<T5 - Error Handling/T5.3 - Diagnoses Common Errors/visual-guide-glossary-02.png>)

**ObjectScript commands**

- `KILL` — Removes a variable or a node and all its descendants.
- `NEW` — Saves an existing local binding and creates a fresh one for the current scope.
- `QUIT` — Leaves the current loop, block or invocation as determined by context.
- `RETURN` — Returns control, optionally with a value, to the caller.
- `SET` — Assigns a value to a variable, property or assignable expression.
- `THROW` — Raises an exception object.
- `TRY` — Begins a block watched for exceptions.
- `WHILE` — Repeats the block while its condition holds.
- `WRITE` — Sends formatted output to the current device.
- `XECUTE` — Executes a string as ObjectScript commands.
- `ZNAMESPACE` — Switches the current process to another namespace.

**System variables and macros**

- `$JOB` — Identifies the current process.
- `$ROLES` — Lists the roles active for the current process.
- `$SYSTEM` — Provides shorthand access to the IRIS %SYSTEM package.
- `$USERNAME` — Identifies the authenticated user.
- `$$$ERROR` — Builds an error status from its code and arguments.
- `$$$GeneralError` — Identifies the general-error code used with message text.
- `$$$ISERR` — Tests whether a status indicates an error.
- `$$$OK` — Supplies a success status.
- `$$$ThrowOnError` — Throws if the supplied status indicates an error.

### T5.3 · 3/5 · System methods and functions

Image: [visual-guide-glossary-03.png](<T5 - Error Handling/T5.3 - Diagnoses Common Errors/visual-guide-glossary-03.png>)

**System methods and functions**

- `##class(%ArrayOfDataTypes).%New()` — Creates an empty array collection.
- `##class(%Exception.General).%New(name, code, location, data)` — Creates a general exception carrying diagnostic context.
- `##class(%SQL.Statement).%New()` — Creates a dynamic SQL statement object.
- `##class(%Stream.FileCharacter).%New()` — Creates a character stream backed by a file.
- `##class(%SYS.Namespace).GetGlobalDest(namespace, globalName)` — Resolves the database mapped to the global.
- `##class(App.Record).%ExistsId(id)` — Tests whether an object with the given ID exists.
- `##class(App.Record).%OpenId(id, concurrency, .status)` — Opens a record by ID. The concurrency and status arguments are optional.
- `$CLASSMETHOD(className, methodName, arg)` — Invokes a class method selected at runtime.
- `$DATA(node)` — Reports whether a node has data, descendants, both or neither.
- `$EXTRACT(text, from, to)` — Returns a substring by character position.
- `$FIND(text, needle, start)` — Returns the position after the match, or zero.
- `$GET(node, default)` — Returns the node value or a default.

### T5.3 · 4/5 · System methods and functions

Image: [visual-guide-glossary-04.png](<T5 - Error Handling/T5.3 - Diagnoses Common Errors/visual-guide-glossary-04.png>)

**System methods and functions**

- `$ISOBJECT(obj)` — Indicates whether the value is an object reference.
- `$LENGTH(text, delimiter)` — Counts delimited fields. Omit the delimiter to count characters.
- `$LIST(list, position)` — Reads the element at the specified position.
- `$LISTBUILD(value1, value2)` — Encodes values as an ObjectScript list.
- `$LISTGET(list, position, default)` — Reads an element or supplies a default.
- `$LISTLENGTH(list)` — Counts list positions.
- `$METHOD(obj, methodName, arg)` — Invokes an instance method selected at runtime.
- `$ORDER(node, direction)` — Returns the next or previous sibling subscript.
- `$PIECE(text, delimiter, from, to)` — Returns one or more delimited fields.
- `$PROPERTY(obj, propertyName)` — Reads a property selected at runtime.
- `$SELECT(condition:value, 1:default)` — Returns the value for the first true condition.
- `$SYSTEM.SQL.Stats.Table.GatherTableStats(tableName)` — Gathers optimizer statistics for the named table.

### T5.3 · 5/5 · System methods and functions

Image: [visual-guide-glossary-05.png](<T5 - Error Handling/T5.3 - Diagnoses Common Errors/visual-guide-glossary-05.png>)

**System methods and functions**

- `$XECUTE(code)` — Executes an ObjectScript command string that returns a value.
- `$ZCONVERT(text, mode)` — Converts case or applies an encoding mode.
- `array.SetAt(value, key)` — Sets a value at the named key in an array collection.
- `ex.AsStatus()` — Converts an exception object to a status.
- `obj.%ClassName(1)` — Returns the fully qualified class name. Omit 1 for the short name.
- `obj.%IsA(className)` — Tests membership in the object's primary class hierarchy.
- `obj.%Save()` — Persists the object and returns a status.
- `stmt.%Prepare(sql)` — Prepares a dynamic statement and returns a status.
- `stream.LinkToFile(fileName)` — Associates a file stream with a path.
- `stream.ReadLine()` — Reads a line at the current stream position.

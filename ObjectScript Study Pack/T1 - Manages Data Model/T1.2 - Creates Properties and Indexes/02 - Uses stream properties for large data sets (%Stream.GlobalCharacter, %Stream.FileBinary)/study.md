[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.2: Creates Properties and Indexes

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.2.html). Reference links require internet access.

## 2. Uses stream properties for large data sets (%Stream.GlobalCharacter, %Stream.FileBinary)

![T1.2 visual summary of sections 1–4: 1. Sets max length for string properties (MAXLEN parameter, TRUNCATE); 2. Uses stream properties for large data sets (%Stream.GlobalCharacter, %Stream.FileBinary); 3. Creates properties that calculate values dynamically or are auto-updated (Calculated, SqlComputed, SqlComputeOnChange); 4. Creates and validates class member parameters and attributes (Required, InitialExpression, parameter keywords)](../visual-guide-01-v2.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **Streams** handle data too large for standard string properties (documents, images, files)
- **%Stream.GlobalCharacter**: Character data stored in globals (most common for text); **automatically compressed** by IRIS
- **%Stream.GlobalBinary**: Binary data stored in globals (images, PDFs stored in database); **automatically compressed** by IRIS
- **%Stream.FileCharacter**: Character data stored in external files on the file system (not compressed by default, but compressed subclasses exist)
- **%Stream.FileBinary**: Binary data stored in external files on the file system (not compressed by default, but compressed subclasses like `%Stream.FileBinaryGzip` exist)
- **Global-based streams are compressed automatically** — this is the recommended choice when IRIS compression is desired
- Streams use `Write()`, `Read()`, `Rewind()`, and `MoveToEnd()` methods instead of direct assignment
- **`WriteLine()`** is only available on character streams — it appends data followed by a line terminator

### Detailed Notes

#### Overview

When data exceeds the practical limits of a string property (or when handling binary content like images or documents), stream properties provide a chunked storage mechanism. Streams are read and written sequentially, making them suitable for large data that doesn't need random access.

#### Types of Streams

| Stream Class | Content Type | Storage Location | Compressed by IRIS |
| --- | --- | --- | --- |
| %Stream.GlobalCharacter | Text (character) | Database globals | Yes |
| %Stream.GlobalBinary | Binary | Database globals | Yes |
| %Stream.FileCharacter | Text (character) | External file system | No (by default) |
| %Stream.FileBinary | Binary | External file system | No (by default) |

#### Declaring Stream Properties

```objectscript
Class Sample.Document Extends %Persistent
{
    Property Title As %String(MAXLEN = 200);

    /// Large text content stored in globals
    Property Content As %Stream.GlobalCharacter;

    /// PDF file stored in the database
    Property Attachment As %Stream.GlobalBinary;
}
```

#### Writing to Streams

```objectscript
Set doc = ##class(Sample.Document).%New()
Set doc.Title = "My Report"

// Write text to the character stream
Do doc.Content.Write("This is the first paragraph of the report. ")
Do doc.Content.Write("This is the second paragraph.")
Do doc.Content.WriteLine("")  // adds a line with newline

// Save the object (stream data is saved with the object)
Set sc = doc.%Save()
```

#### Reading from Streams

```objectscript
Set doc = ##class(Sample.Document).%OpenId(1)

// Rewind to the beginning
Do doc.Content.Rewind()

// Read in chunks
While 'doc.Content.AtEnd {
    Set chunk = doc.Content.Read(32000)
    Write chunk
}
```

#### Key Stream Methods

- **Write(data)**: Appends data to the stream (all stream types)
- **WriteLine(data)**: Appends data followed by a line terminator (character streams only)
- **Read(len)**: Reads up to `len` characters/bytes from the current position
- **ReadLine()**: Reads one line of text
- **Rewind()**: Resets the read position to the beginning
- **MoveToEnd()**: Positions at the end for appending
- **Clear()**: Removes all content from the stream
- **Size**: Property that returns the total size of the stream
- **AtEnd**: Property that indicates whether the read position is at the end

#### File-Based Streams

```objectscript
// Write to an external file
Set fileStream = ##class(%Stream.FileCharacter).%New()
Set fileStream.Filename = "/tmp/output.txt"
Do fileStream.Write("Content for external file")
Set sc = fileStream.%Save()
```

#### Copying Between Streams

```objectscript
// Copy one stream to another
Do targetStream.CopyFrom(sourceStream)
```

#### Stream Compression

Global-based streams (`%Stream.GlobalCharacter` and `%Stream.GlobalBinary`) are **automatically compressed by IRIS** when stored in the database. This compression is transparent — data is compressed on write and decompressed on read without any additional code. This makes global-based streams the recommended choice when you want IRIS to handle compression automatically.

File-based streams (`%Stream.FileCharacter` and `%Stream.FileBinary`) are stored as regular files on the operating system's file system and are **not compressed by default**. However, IRIS provides compressed subclasses such as `%Stream.FileBinaryGzip` that store the file in gzip format.

**Exam tip**: When a question asks about storing large data that "should be automatically compressed by IRIS if possible," choose a global-based stream class (`%Stream.GlobalCharacter` for text, `%Stream.GlobalBinary` for binary data).

### Documentation References

- [Stream Classes](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propstream)
- [%Stream.GlobalCharacter](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propstream)

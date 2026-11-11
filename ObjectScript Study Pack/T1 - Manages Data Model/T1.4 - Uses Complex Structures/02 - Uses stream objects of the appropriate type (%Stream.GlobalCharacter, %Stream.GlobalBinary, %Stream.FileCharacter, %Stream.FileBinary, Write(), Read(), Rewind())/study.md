[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.4: Uses Complex Structures

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.4.html). Reference links require internet access.

## 2. Uses stream objects of the appropriate type (%Stream.GlobalCharacter, %Stream.GlobalBinary, %Stream.FileCharacter, %Stream.FileBinary, Write(), Read(), Rewind())

![T1.4 visual summary of sections 1–2: 1. Creates dynamic objects/arrays (JSON) - %DynamicObject, %DynamicArray, %FromJSON, %ToJSON; 2. Uses stream objects of the appropriate type (%Stream.GlobalCharacter, %Stream.GlobalBinary, %Stream.FileCharacter, %Stream.FileBinary, Write(), Read(), Rewind())](../visual-guide-01.png)

*This diagram covers sections 1–2; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- Streams handle data too large for string variables (max ~3.6M characters)
- **Global streams** store data in database globals (portable, backed up with database)
- **File streams** store data in external files on the file system
- **Character streams** handle text data with character encoding support
- **Binary streams** handle raw binary data (images, PDFs, executables)
- Core operations: **Write()**, **Read()**, **Rewind()**, **CopyFrom()**, **Clear()**

### Detailed Notes

#### Overview

Stream objects provide sequential access to large data. Unlike string properties that load entirely into memory, streams can be read and written in chunks, making them suitable for files, documents, and binary content of any size.

#### Stream Type Selection Guide

| Need | Stream Class | Storage |
| --- | --- | --- |
| Large text in database | %Stream.GlobalCharacter | Globals |
| Binary data in database | %Stream.GlobalBinary | Globals |
| Text files on disk | %Stream.FileCharacter | File system |
| Binary files on disk | %Stream.FileBinary | File system |

#### %Stream.GlobalCharacter - Text in Database

```objectscript
// Create and write
Set stream = ##class(%Stream.GlobalCharacter).%New()
Do stream.Write("Line 1 of the document. ")
Do stream.WriteLine("Line 2 with newline.")
Do stream.Write("Line 3 continues.")

// Read back
Do stream.Rewind()
While 'stream.AtEnd {
    Set chunk = stream.Read(1000)
    Write chunk
}
```

When used as a property in a persistent class, the stream data is automatically saved with the object:

```objectscript
Class Sample.Document Extends %Persistent
{
    Property Title As %String(MAXLEN = 200);
    Property Body As %Stream.GlobalCharacter;

    ClassMethod CreateDoc(title As %String, text As %String) As %Status
    {
        Set doc = ##class(Sample.Document).%New()
        Set doc.Title = title
        Do doc.Body.Write(text)
        Return doc.%Save()
    }
}
```

#### %Stream.GlobalBinary - Binary in Database

```objectscript
Class Sample.Attachment Extends %Persistent
{
    Property Filename As %String;
    Property Content As %Stream.GlobalBinary;
    Property ContentType As %String;
}

// Store binary data
Set att = ##class(Sample.Attachment).%New()
Set att.Filename = "report.pdf"
Set att.ContentType = "application/pdf"

// Read from a file stream and copy to global stream
Set fileStream = ##class(%Stream.FileBinary).%New()
Set fileStream.Filename = "/path/to/report.pdf"
Do att.Content.CopyFrom(fileStream)
Set sc = att.%Save()
```

#### %Stream.FileCharacter - Text on File System

```objectscript
// Write to an external file
Set stream = ##class(%Stream.FileCharacter).%New()
Set stream.Filename = "/tmp/output.csv"
Do stream.Write("Name,Age,City")
Do stream.WriteLine("")
Do stream.Write("Alice,30,Boston")
Do stream.WriteLine("")
Set sc = stream.%Save()

// Read from an external file
Set stream = ##class(%Stream.FileCharacter).%New()
Set stream.Filename = "/tmp/output.csv"
Do stream.Rewind()
While 'stream.AtEnd {
    Set line = stream.ReadLine()
    Write line, !
}
```

#### %Stream.FileBinary - Binary on File System

```objectscript
// Read a binary file
Set stream = ##class(%Stream.FileBinary).%New()
Set stream.Filename = "/path/to/image.png"
Write "File size: ", stream.Size, " bytes", !

// Copy to another location
Set target = ##class(%Stream.FileBinary).%New()
Set target.Filename = "/path/to/copy.png"
Do target.CopyFrom(stream)
Set sc = target.%Save()
```

#### Core Stream Methods Reference

| Method/Property | Description |
| --- | --- |
| **Write(data)** | Appends data at the current position |
| **WriteLine(data)** | Appends data followed by a platform line terminator |
| **Read(len)** | Reads up to `len` characters/bytes from current position |
| **ReadLine(len, .sc, .eol)** | Reads one line (up to len characters) |
| **Rewind()** | Resets position to the beginning of the stream |
| **MoveToEnd()** | Moves position to the end (for appending) |
| **Clear()** | Removes all content from the stream |
| **CopyFrom(source)** | Copies all content from another stream |
| **Size** | Returns the total size in characters/bytes |
| **AtEnd** | Returns 1 if at end of stream, 0 otherwise |

#### Stream Processing Patterns

Reading in fixed-size chunks (for large streams):

```objectscript
Set chunkSize = 32000
Do stream.Rewind()
While 'stream.AtEnd {
    Set chunk = stream.Read(chunkSize)
    // Process chunk
}
```

Line-by-line reading (for text streams):

```objectscript
Do stream.Rewind()
While 'stream.AtEnd {
    Set line = stream.ReadLine()
    // Process each line
}
```

Appending to an existing stream:

```objectscript
// Position at the end before writing more data
Do stream.MoveToEnd()
Do stream.Write("Additional content appended.")
Set sc = stream.%Save()
```

#### Character Encoding with File Streams

File character streams support the `TranslateTable` property for character encoding:

```objectscript
Set stream = ##class(%Stream.FileCharacter).%New()
Set stream.Filename = "/tmp/utf8file.txt"
Set stream.TranslateTable = "UTF8"
Do stream.Write("Content with special characters: accents, symbols")
Set sc = stream.%Save()
```

#### Comparing Streams

```objectscript
// Check if two streams have identical content
Set same = stream1.%ConstructClone().Equals(stream2)

// Or use SizeGet for a quick size comparison first
If stream1.Size '= stream2.Size {
    Write "Streams differ (different sizes)", !
}
```

### Documentation References

- [Stream Classes](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propstream)
- [Working with Streams](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propstream)
- [%Stream.GlobalCharacter](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_stream)

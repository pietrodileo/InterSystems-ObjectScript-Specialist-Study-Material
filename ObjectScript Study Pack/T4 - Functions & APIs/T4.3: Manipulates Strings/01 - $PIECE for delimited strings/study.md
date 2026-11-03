[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T4.3: Manipulates Strings

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T4.3.html). Reference links require internet access.

## 1. $PIECE for delimited strings

![T4.3 visual summary of sections 1–4: 1. $PIECE for delimited strings; 2. $EXTRACT for substrings; 3. $REPLACE, $TRANSLATE, $ZSTRIP; 4. String concatenation](../visual-guide-01-v2.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **$PIECE($P)**: Extracts a substring based on a delimiter and piece number
- **$P(string, delimiter, from, to)**: Extracts pieces from position "from" to "to"
- **SET $PIECE**: Modifies a specific piece in-place: SET $P(var, delim, pos) = newValue
- **1-based positions**: First piece is position 1
- **Multi-character delimiters**: Delimiter can be more than one character: $P(str, "::", 2)
- **Beyond range**: Requesting a piece beyond the last delimiter returns empty string

### Detailed Notes

#### Overview

$PIECE is one of the most frequently used ObjectScript functions. It works with delimited strings, extracting or replacing segments based on a specified delimiter. Unlike lists, $PIECE works on plain strings without any special encoding.

#### Basic Extraction

```objectscript
 SET record = "Smith^John^42^New York"

 // Extract individual pieces (1-based)
 WRITE $PIECE(record, "^", 1), !     // Smith
 WRITE $PIECE(record, "^", 2), !     // John
 WRITE $PIECE(record, "^", 3), !     // 42
 WRITE $PIECE(record, "^", 4), !     // New York

 // $P shorthand
 WRITE $P(record, "^", 1), !         // Smith

 // Piece beyond range returns ""
 WRITE $P(record, "^", 10), !        // (empty string)
```

#### Extracting Multiple Pieces

```objectscript
 SET record = "Smith^John^42^New York^Engineer"

 // Extract pieces 2 through 4
 WRITE $P(record, "^", 2, 4), !      // John^42^New York

 // Extract from piece 3 to end
 WRITE $P(record, "^", 3, *), !      // 42^New York^Engineer

 // First piece only (default when no position given)
 WRITE $P(record, "^"), !            // Smith
```

#### Modifying Pieces with SET $PIECE

```objectscript
 SET record = "Smith^John^42^New York"

 // Replace piece 3 (age)
 SET $PIECE(record, "^", 3) = 43
 WRITE record, !    // Smith^John^43^New York

 // $P shorthand for SET
 SET $P(record, "^", 4) = "Boston"
 WRITE record, !    // Smith^John^43^Boston

 // Setting a piece beyond current range extends the string
 SET $P(record, "^", 6) = "Active"
 WRITE record, !    // Smith^John^43^Boston^^Active
 // Note: piece 5 is empty, creating two consecutive delimiters
```

#### Building Strings Piece by Piece

```objectscript
 // Start with empty string and build incrementally
 SET msg = ""
 SET $P(msg, "|", 1) = "MSH"
 SET $P(msg, "|", 2) = "^~\&"
 SET $P(msg, "|", 3) = "SENDING_APP"
 WRITE msg, !    // MSH|^~\&|SENDING_APP
```

#### Multi-Character Delimiters

```objectscript
 SET data = "key1::value1::key2::value2"
 WRITE $P(data, "::", 1), !    // key1
 WRITE $P(data, "::", 2), !    // value1
 WRITE $P(data, "::", 4), !    // value2
```

#### Counting Pieces with $LENGTH

```objectscript
 SET csv = "a,b,c,d,e"
 WRITE $LENGTH(csv, ","), !    // 5 (number of comma-delimited pieces)

 SET empty = ""
 WRITE $LENGTH(empty, ","), !  // 1 (empty string = 1 piece)
```

### Documentation References

- [$PIECE Function](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fpiece)
- [SET $PIECE](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fpiece#RCOS_fpiece_set)

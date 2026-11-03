[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T4.2: Manipulates Lists — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
Consider the following list:

set x = $LB("A", "B", "C")

How do you retrieve the third element in this list?
```

**A.** set y \= $LISTGET(x, 3, "default value")

**B.** set y \= $LISTGET(x, 2, "default value")

**C.** set y \= $LISTNEXT(x, 2, "default value")

**D.** set y \= $LISTNEXT(x, 3, "default value")

### Answer and explanation

**Correct answer: A.** set y \= $LISTGET(x, 3, "default value")

$LISTGET uses 1-based indexing. $LISTGET(x, 3, "default value") returns the element at position 3, which is "C". The third argument is a default value returned only if the position is undefined. $LISTNEXT is an iteration function with different syntax (it takes a pointer, not a position). (Reference: InterSystems Practice Q15; [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_flistget))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

```text
You are building a patient demographics record. Consider:

set record = $LISTBUILD("Smith", "John", 45, "Male")
write $LISTGET(record, 2)

What is the output?
```

**A.** Smith

**B.** John

**C.** 45

**D.** Male

### Answer and explanation

**Correct answer: B.** John

$LISTGET retrieves an element by its 1-based position. Position 2 of the list ("Smith", "John", 45, "Male") is "John". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_flistget))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
A data import routine encounters missing fields. Consider:

set row = $LISTBUILD("OrderA",,"Shipped")
write $LISTGET(row, 2, "N/A")

What is the output?
```

**A.** "" (empty string)

**B.** N/A

**C.** \<NULL\>

**D.** An \<UNDEFINED\> error

### Answer and explanation

**Correct answer: B.** N/A

In $LISTBUILD("OrderA",,"Shipped"), position 2 is undefined (null) \- not an empty string, but truly undefined. $LISTGET with a default value returns "N/A" for an undefined element. If position 2 were an empty string ($LB("OrderA","","Shipped")), $LISTGET would return the empty string instead. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_flistget))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
You are converting data between list and delimited formats. Consider:

set colors = $LISTBUILD("Red", "Green", "Blue")
set str = $LISTTOSTRING(colors, "|")
write str

What is the output?
```

**A.** Red\|Green\|Blue

**B.** Red,Green,Blue

**C.** $LB("Red","Green","Blue")

**D.** RedGreenBlue

### Answer and explanation

**Correct answer: A.** Red\|Green\|Blue

$LISTTOSTRING converts a $LISTBUILD list into a delimited string. The second argument specifies the delimiter character. With "\|" as the delimiter, the result is "Red\|Green\|Blue". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_flisttostring))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
A CSV file parser needs to convert a line into a list. Consider:

set line = "Tokyo,London,Paris"
set cities = $LISTFROMSTRING(line, ",")
write $LISTGET(cities, 2)

What is the output?
```

**A.** Tokyo

**B.** London

**C.** Paris

**D.** Tokyo,London,Paris

### Answer and explanation

**Correct answer: B.** London

$LISTFROMSTRING converts a delimited string into a $LISTBUILD list. Using "," as the delimiter, "Tokyo,London,Paris" becomes $LB("Tokyo","London","Paris"). Position 2 is "London". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_flistfromstring))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

You need to iterate through a list of error messages as efficiently as possible. Which code is correct?

**A.** ```text
set ptr = 0
while $LISTNEXT(errors, ptr, msg) {
  write msg, !
}
```

**B.** ```text
set ptr = 1
while $LISTNEXT(errors, ptr, msg) {
  write msg, !
}
```

**C.** ```text
set ptr = ""
while $LISTNEXT(errors, ptr, msg) {
  write msg, !
}
```

**D.** ```text
for i = 1:1:$LL(errors) {
  set msg = $LISTNEXT(errors, i)
  write msg, !
}
```

### Answer and explanation

**Correct answer: A.** ```text
set ptr = 0
while $LISTNEXT(errors, ptr, msg) {
  write msg, !
}
```

$LISTNEXT requires the pointer to be initialized to 0 before the first call. Each call advances the pointer internally and sets the value in msg. It returns 1 while elements remain and 0 when exhausted. $LISTNEXT is the most efficient way to iterate because it avoids recalculating offsets. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_flistnext))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

```text
You are merging two lists of permissions. Consider:

set read = $LISTBUILD("view", "export")
set write = $LISTBUILD("edit", "delete")
set all = read _ write
write $LISTLENGTH(all)

What is the output?
```

**A.** 2

**B.** 4

**C.** A \<LIST\> error

**D.** 1

### Answer and explanation

**Correct answer: B.** 4

Concatenating two $LISTBUILD lists with the \_ operator produces a valid combined list. $LB("view","export") \_ $LB("edit","delete") creates $LB("view","export","edit","delete"), which has 4 elements. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_lists))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

```text
A data correction routine needs to update a list element in place. Consider:

set items = $LISTBUILD("Apple", "Bannana", "Cherry")
set $LIST(items, 2) = "Banana"
write $LISTGET(items, 2)

What is the output?
```

**A.** Bannana

**B.** Banana

**C.** A \<FUNCTION\> error

**D.** Apple

### Answer and explanation

**Correct answer: B.** Banana

SET $LIST(list, position) \= value modifies the list in place, replacing the element at the specified position. After the correction, position 2 now contains "Banana" instead of the misspelled "Bannana". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_flist))

## Question 9 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

```text
You need to extract a sublist from a larger list. Consider:

set weekdays = $LISTBUILD("Mon", "Tue", "Wed", "Thu", "Fri")
set midweek = $LIST(weekdays, 2, 4)
write $LISTTOSTRING(midweek, "-")

What is the output?
```

**A.** Tue-Wed-Thu

**B.** Mon-Tue-Wed-Thu

**C.** Tue-Thu

**D.** Wed-Thu-Fri

### Answer and explanation

**Correct answer: A.** Tue-Wed-Thu

$LIST(list, from, to) extracts a sublist from position 'from' to position 'to' inclusive. $LIST(weekdays, 2, 4\) returns $LB("Tue","Wed","Thu"). Converting to string with "-" gives "Tue-Wed-Thu". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_flist))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
You are searching for a specific role in a user's role list. Consider:

set roles = $LISTBUILD("Admin", "Editor", "Viewer", "Auditor")
write $LISTFIND(roles, "Viewer")

What is the output?
```

**A.** 2

**B.** 3

**C.** Viewer

**D.** 0

### Answer and explanation

**Correct answer: B.** 3

$LISTFIND searches for an element in a list and returns its 1-based position. "Viewer" is at position 3\. If the element is not found, $LISTFIND returns 0\. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_flistfind))

## Question 11 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

```text
A developer reports that accessing a null list element throws an error. Consider:

set x = $LISTBUILD("A",,"C")
write $LIST(x, 2)

What happens?
```

**A.** It writes an empty string

**B.** It writes \<null\>

**C.** It throws a \<NULL VALUE\> error

**D.** It writes 0

### Answer and explanation

**Correct answer: C.** It throws a \<NULL VALUE\> error

Position 2 in $LB("A",,"C") is undefined (null). Unlike $LISTGET which returns a default value for undefined elements, $LIST throws a \<NULL VALUE\> error. Use $LISTGET with a default value to safely access elements that might be null. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_flist))

## Question 12 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

A colleague asks about the advantages of $LISTBUILD lists over delimited strings. Which of the following are true? (Select all that apply)

**A.** Elements can contain the delimiter character without conflict

**B.** Elements can be undefined (null) as distinct from empty string

**C.** $LISTBUILD lists use significantly less memory than delimited strings

**D.** Elements preserve their data type (string vs number)

**E.** $LISTBUILD lists can be displayed in readable $LISTBUILD notation using ZWRITE

### Answer and explanation

**Correct answer: A.** Elements can contain the delimiter character without conflict

**Correct answer: B.** Elements can be undefined (null) as distinct from empty string

**Correct answer: D.** Elements preserve their data type (string vs number)

**Correct answer: E.** $LISTBUILD lists can be displayed in readable $LISTBUILD notation using ZWRITE

$LISTBUILD lists use a binary encoded format that preserves data types, supports null/undefined elements distinct from empty strings, and avoids delimiter conflicts. WRITE outputs the binary representation of a $LISTBUILD list (garbled characters), while ZWRITE displays them in readable $lb() notation (e.g., ZWRITE $LB("A",,"C") shows $lb("A",,"C")). Memory usage is comparable to delimited strings. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_lists))

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

```text
You need to verify whether an incoming value is a valid list before processing. Consider:

set input = "not a list"
write $LISTVALID(input)

What is the output?
```

**A.** 1

**B.** 0

**C.** A \<LIST\> error

**D.** "not a list"

### Answer and explanation

**Correct answer: B.** 0

$LISTVALID returns 1 if the value is a valid $LISTBUILD list and 0 otherwise. A plain string "not a list" is not a valid list structure, so $LISTVALID returns 0\. This is the safe way to test before calling list functions. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_flistvalid))

## Question 14 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

```text
You are comparing two lists that were built differently. Consider:

set list1 = $LISTBUILD("X", "Y", "Z")
set list2 = $LISTFROMSTRING("X,Y,Z", ",")
write $LISTSAME(list1, list2)

What is the output?
```

**A.** 0

**B.** 1

**C.** A \<FUNCTION\> error

**D.** "X,Y,Z"

### Answer and explanation

**Correct answer: B.** 1

$LISTSAME compares two lists element by element. Both list1 and list2 contain the same three string elements ("X", "Y", "Z") in the same order, so $LISTSAME returns 1 (true), even though they were constructed differently. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_flistsame))

## Question 15 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

```text
You are processing a multi-value HL7 field stored as a list. Consider:

set diagnoses = $LISTBUILD("J06.9", "R05", "J20.9", "R50.9")
set pos = $LISTFIND(diagnoses, "R05")
if pos {
  write "Found at position: ", pos
} else {
  write "Not found"
}

What is the output?
```

**A.** Found at position: 1

**B.** Found at position: 2

**C.** Found at position: 3

**D.** Not found

### Answer and explanation

**Correct answer: B.** Found at position: 2

$LISTFIND returns the 1-based position of the element "R05" in the list. It is at position 2\. Since 2 is non-zero (truthy), the if branch executes and prints "Found at position: 2". If the element were not in the list, $LISTFIND would return 0 (falsy). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_flistfind))

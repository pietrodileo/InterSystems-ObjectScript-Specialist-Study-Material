[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T4.1: Traverses and Sorts Arrays — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
Consider the following array:

set data("apple") = 1
set data("banana") = 2
set data(100) = 3
set data(20) = 4

What is the first subscript returned by $ORDER(data(""))?
```

**A.** "apple"

**B.** 100

**C.** 20

**D.** "banana"

### Answer and explanation

**Correct answer: C.** 20

In canonical ordering, numeric subscripts come before string subscripts, and they are sorted numerically: 20 \< 100\. So $ORDER(data("")) returns 20 as the first subscript. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables#GCOS_variables_global_subscripts))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

```text
Consider the following array:

set y = 10
set y("X") = 11
set y("Y") = 22
set y("X", 1) = 33
set y("X", 2) = 44
set y("Y", 1) = 55
set y("Y", 2) = 66

You would like to write a loop that prints all the values in the second level, so that the output looks like this:

33445566

Which of the following code blocks accomplishes that?
```

**A.** ```text
set key = $ORDER(y(""))
while key '= "" {
    write y(key)
    set key1 = $ORDER(y(key))
}
```

**B.** ```text
set node = $QUERY(y)
while node '= "" {
    write node
    set node = $QUERY(node)
}
```

**C.** ```text
set key1 = $ORDER(y(""))
while key1 '= "" {
    set key2 = $ORDER(y(key1, ""))
    while key2 '= "" {
         write y(key1, key2)
         set key2 = $ORDER(y(key1,key2))
    }
    set key1 = $ORDER(y(key1))
}
```

**D.** ```text
set node = $QUERY(y(""), 1, target)
while node '= "" {
    set node = $QUERY(node)
}
set node = $QUERY(y(node, ""), 1, target)
while node '= "" {
    write node
    set node = $QUERY(node, "")
}
```

### Answer and explanation

**Correct answer: C.** ```text
set key1 = $ORDER(y(""))
while key1 '= "" {
    set key2 = $ORDER(y(key1, ""))
    while key2 '= "" {
         write y(key1, key2)
         set key2 = $ORDER(y(key1,key2))
    }
    set key1 = $ORDER(y(key1))
}
```

To traverse all second-level subscripts, you need nested $ORDER loops. The outer loop iterates over first-level subscripts ("X", "Y"), and for each, the inner loop iterates over second-level subscripts (1, 2). Option (a) only reads first-level values. Option (b) uses $QUERY incorrectly. Option (d) has syntax errors. The nested $ORDER loop correctly produces 33445566\. (Reference: InterSystems Practice Q14; [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_forder))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
A developer is loading patient records into a local array and notices the traversal order is unexpected. Consider:

set patients(3) = "Chen"
set patients("10A") = "Patel"
set patients(1) = "Smith"
set patients(10) = "Jones"
set patients("2B") = "Garcia"

What is the $ORDER traversal order of the subscripts?
```

**A.** 1, 3, 10, "10A", "2B"

**B.** 1, 3, 10, "2B", "10A"

**C.** "10A", 1, "2B", 3, 10

**D.** 1, "2B", 3, 10, "10A"

### Answer and explanation

**Correct answer: A.** 1, 3, 10, "10A", "2B"

Canonical ordering places numeric subscripts first (sorted numerically: 1, 3, 10), then string subscripts (sorted by ASCII collation: "10A" before "2B" because "1" \< "2" in ASCII). "10A" and "2B" are strings because they contain non-numeric characters. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables#GCOS_variables_global_subscripts))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
You are debugging a routine that checks whether a global node has children. Consider:

set ^inventory("warehouse") = "Main"
set ^inventory("warehouse", "aisle1") = 50
set ^inventory("warehouse", "aisle2") = 30

write $DATA(^inventory("warehouse"))

What is the output?
```

**A.** 0

**B.** 1

**C.** 10

**D.** 11

### Answer and explanation

**Correct answer: D.** 11

$DATA returns 11 when a node has both a value AND descendant nodes. ^inventory("warehouse") has the value "Main" and also has child subscripts ("aisle1" and "aisle2"), so $DATA returns 11\. Return values: 0\=undefined, 1\=value only, 10\=descendants only, 11\=both. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fdata))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
A colleague asks you to review their array traversal code. Consider:

set arr(1) = "A"
set arr(3) = "B"
set arr(10) = "C"
set arr(2) = "D"
set key = ""
for {
  set key = $ORDER(arr(key))
  quit:key=""
  write arr(key)
}

What is the output?
```

**A.** ABCD

**B.** ADBC

**C.** ABDC

**D.** DACB

### Answer and explanation

**Correct answer: B.** ADBC

$ORDER traverses numeric subscripts in numeric order: 1, 2, 3, 10\. So the output is arr(1)\="A", arr(2)\="D", arr(3)\="B", arr(10)\="C" \= "ADBC". The insertion order does not matter; canonical ordering always applies. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_forder))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
You need to find the last item in a price list stored in a global. Consider:

set ^prices(10) = 9.99
set ^prices(20) = 14.99
set ^prices(30) = 24.99
set ^prices(40) = 39.99

Which code correctly retrieves the last subscript (40)?
```

**A.** set last \= $ORDER(^prices(""))

**B.** set last \= $ORDER(^prices(""), -1)

**C.** set last \= $ORDER(^prices(40), 1\)

**D.** set last \= $ORDER(^prices(40))

### Answer and explanation

**Correct answer: B.** set last \= $ORDER(^prices(""), -1)

$ORDER with direction -1 starting from "" returns the last subscript in the array. $ORDER(^prices(""), -1) returns 40\. Starting from "" with direction 1 gives the first subscript; starting from "" with direction -1 gives the last. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_forder))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

```text
You are writing a utility that retrieves both the key and value in a single $ORDER call. Consider:

set scores("Alice") = 95
set scores("Bob") = 87
set scores("Carol") = 92

set key = ""
set key = $ORDER(scores(key), 1, val)
write key, ": ", val

What is the output?
```

**A.** Alice: 95

**B.** Bob: 87

**C.** Carol: 92

**D.** An \<UNDEFINED\> error

### Answer and explanation

**Correct answer: A.** Alice: 95

The third argument of $ORDER receives the data value at the next node. Starting from "", the first subscript in canonical order is "Alice" (A \< B \< C in ASCII). The value 95 is stored in val. Output: "Alice: 95". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_forder))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

```text
While investigating a bug, you examine an array that uses negative subscripts:

set arr(-3) = "X"
set arr(0) = "Y"
set arr(2) = "Z"
set arr(-1) = "W"
set key = ""
for {
  set key = $ORDER(arr(key))
  quit:key=""
  write key, " "
}

What is the output?
```

**A.** -3 -1 0 2

**B.** 0 2 -3 -1

**C.** -1 -3 0 2

**D.** 2 0 -1 -3

### Answer and explanation

**Correct answer: A.** -3 -1 0 2

Numeric subscripts are sorted in numeric order, including negative numbers. The traversal order is -3, -1, 0, 2\. Canonical numeric sorting respects the actual numeric value. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables#GCOS_variables_global_subscripts))

## Question 9 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

Which of the following are valid return values of the $DATA function? (Select all that apply)

**A.** 0 \- node is undefined

**B.** 1 \- node has a value, no descendants

**C.** 5 \- node has five child subscripts

**D.** 10 \- no value at this node, but has descendants

**E.** 11 \- node has a value AND has descendants

**F.** 100 \- node has descendants at multiple levels

### Answer and explanation

**Correct answer: A.** 0 \- node is undefined

**Correct answer: B.** 1 \- node has a value, no descendants

**Correct answer: D.** 10 \- no value at this node, but has descendants

**Correct answer: E.** 11 \- node has a value AND has descendants

$DATA returns only four possible values: 0, 1, 10, 11\. The tens digit indicates descendants (0\=none, 1\=has descendants), and the ones digit indicates a value (0\=none, 1\=has value). Values like 5 and 100 are never returned. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fdata))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
A developer sets up a configuration array and is confused by the sorting. Consider:

set cfg("abc") = 1
set cfg("ABC") = 2
set cfg("Abc") = 3
set key = ""
for {
  set key = $ORDER(cfg(key))
  quit:key=""
  write cfg(key)
}

What is the output?
```

**A.** 123

**B.** 213

**C.** 231

**D.** 321

### Answer and explanation

**Correct answer: C.** 231

String subscripts are sorted in ASCII order. In ASCII, uppercase letters come before lowercase: 'A'\=65, 'a'\=97. So "ABC" (all uppercase) \< "Abc" (A then lowercase) \< "abc" (all lowercase). Output: cfg("ABC")\=2, cfg("Abc")\=3, cfg("abc")\=1 \= "231". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables#GCOS_variables_global_subscripts))

## Question 11 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

```text
You are building an order processing routine. Consider the following code:

set orders(1001,"item") = "Widget"
set orders(1001,"qty") = 5
set orders(1002,"item") = "Gadget"
set orders(1002,"qty") = 3

set key = ""
for {
  set key = $ORDER(orders(key))
  quit:key=""
  write "Order: ", ordKey, !
  write "  Item: ", orders(key,"item"), !
}

What happens when this code runs?
```

**A.** It prints both orders correctly

**B.** \<SYNTAX\> error on the Write line

**C.** \<UNDEFINED\> error because ordKey was never set

**D.** \<SUBSCRIPT\> error because nested subscripts cannot be traversed

### Answer and explanation

**Correct answer: C.** \<UNDEFINED\> error because ordKey was never set

The loop uses the variable ordKey in the Write statement, but ordKey was never assigned a value. The correct variable should be key (which is set by $ORDER). This is a common typo bug that causes an \<UNDEFINED\> \*ordKey error at runtime. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RERR_gen#RERR_UNDEFINED))

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

```text
A reporting module stores data in a deep hierarchy. Consider:

set ^data("a","b","c") = "deep"
write $DATA(^data("a","b"))

What is the output?
```

**A.** 0

**B.** 1

**C.** 10

**D.** 11

### Answer and explanation

**Correct answer: C.** 10

^data("a","b") was never explicitly assigned a value, but it has a descendant node at ("a","b","c"). Therefore $DATA returns 10: no value at this node, but descendants exist. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fdata))

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

```text
You need to process decimal product IDs. Consider:

set arr(1.5) = "A"
set arr(1) = "B"
set arr(2) = "C"
set arr(1.10) = "D"
set key = ""
for {
  set key = $ORDER(arr(key))
  quit:key=""
  write arr(key)
}

What is the output?
```

**A.** BADC

**B.** BDAC

**C.** ABDC

**D.** BACD

### Answer and explanation

**Correct answer: B.** BDAC

Numeric subscripts are sorted by numeric value. 1.10 is canonically equivalent to 1.1. The sort order is: 1, 1.1, 1.5, 2\. So: arr(1)\="B", arr(1.1)\="D", arr(1.5)\="A", arr(2)\="C" \= "BDAC". Trailing zeros are stripped in canonical form. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_variables#GCOS_variables_global_subscripts))

## Question 14 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

```text
You are verifying that a configuration node was properly cleaned up. Consider:

kill ^config("db")
set ^config("db","host") = "localhost"
set ^config("db","port") = 1972

write $DATA(^config("db"))

What is the output?
```

**A.** 0

**B.** 1

**C.** 10

**D.** 11

### Answer and explanation

**Correct answer: C.** 10

After KILL ^config("db"), the node and all descendants are removed. Then two child nodes are created under ^config("db"), but ^config("db") itself is never given a value. So $DATA returns 10: no value, but has descendants. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fdata))

## Question 15 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

```text
What is the output of the following code?

kill arr
set arr(1) = "one"
set arr(2) = "two"
set key = ""
set key = $ORDER(arr(key))
set key = $ORDER(arr(key))
set key = $ORDER(arr(key))
write key
```

**A.** "two"

**B.** 2

**C.** "" (empty string)

**D.** An \<UNDEFINED\> error

### Answer and explanation

**Correct answer: C.** "" (empty string)

Starting from "", the first $ORDER returns 1, the second returns 2, and the third call (from subscript 2\) returns "" because there are no more subscripts. So key is "" and Write outputs an empty string. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_forder))

## Question 16 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q16.md>)

A junior developer asks about $ORDER behavior. Which of the following statements are true? (Select all that apply)

**A.** $ORDER with direction -1 traverses subscripts in reverse order

**B.** $ORDER returns "" when there are no more subscripts at that level

**C.** $ORDER can accept a third argument to retrieve the node's data value

**D.** $ORDER automatically descends into child subscripts

**E.** $ORDER can only be used with global arrays, not local arrays

### Answer and explanation

**Correct answer: A.** $ORDER with direction -1 traverses subscripts in reverse order

**Correct answer: B.** $ORDER returns "" when there are no more subscripts at that level

**Correct answer: C.** $ORDER can accept a third argument to retrieve the node's data value

$ORDER traverses subscripts at a single level only \- it does NOT automatically descend into child subscripts (use nested $ORDER or $QUERY for that). It works with both local and global arrays. Direction -1 enables reverse traversal, it returns "" at the end, and the optional third argument retrieves the node value. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_forder))

## Question 17 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q17.md>)

```text
You want to safely check whether a global node exists before reading it. Which approach avoids an <UNDEFINED> error?

set value = ^settings("timeout")
```

**A.** if $DATA(^settings("timeout")) set value \= ^settings("timeout")

**B.** set value \= $GET(^settings("timeout"), 30\)

**C.** set value \= $ORDER(^settings("timeout"))

**D.** Both $DATA and $GET approaches are correct

### Answer and explanation

**Correct answer: B.** set value \= $GET(^settings("timeout"), 30\)

Only $GET safely avoids \<UNDEFINED\> in all cases. While $DATA(^settings("timeout")) returns a truthy value (10) when the node has subnodes but no value at the node itself, the subsequent SET still causes \<UNDEFINED\> because the node has no data. The correct $DATA check would be $DATA(...)#2 (bitwise AND with 2\) to verify the node has a value. $GET(^settings("timeout"),30) safely returns the default value 30 when the node has no value, regardless of subnodes. $ORDER returns the next subscript, not the value. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fget))

## Question 18 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q18.md>)

```text
You are building an index of error codes. Consider:

set ^errors(100) = "Timeout"
set ^errors(200) = "Not Found"
set ^errors("AUTH01") = "Unauthorized"
set ^errors("AUTH02") = "Forbidden"
set ^errors(500) = "Internal"

set key = ""
set key = $ORDER(^errors(key))
set key = $ORDER(^errors(key))
set key = $ORDER(^errors(key))
write ^errors(key)
```

**A.** Not Found

**B.** Internal

**C.** Unauthorized

**D.** Forbidden

### Answer and explanation

**Correct answer: B.** Internal

Canonical ordering: numeric subscripts come first sorted numerically (100, 200, 500), then string subscripts sorted by ASCII ("AUTH01", "AUTH02"). The first $ORDER from "" returns 100, the second from 100 returns 200, the third from 200 returns 500\. ^errors(500) \= "Internal". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_forder))

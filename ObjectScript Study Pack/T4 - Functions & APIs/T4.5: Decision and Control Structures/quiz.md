[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T4.5: Uses Post-Conditionals and Control Flow — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
While reviewing code you notice the following statement:

set:$GET(person)="" phone = "Unknown"

Which of the following best describes what this line does?
```

**A.** The assignment executes only when person is undefined or holds an empty string; in that case phone is set to "Unknown". Otherwise the line is skipped.

**B.** The line always sets both person and phone to "Unknown" in a single statement, regardless of their previous values.

**C.** Because $GET(person) returns "" only when person is undefined, this line always raises an error before phone can be assigned.

**D.** The statement checks whether phone already equals "Unknown"; if so, it clears the variable person by setting it to the empty string.

### Answer and explanation

**Correct answer: A.** The assignment executes only when person is undefined or holds an empty string; in that case phone is set to "Unknown". Otherwise the line is skipped.

The post-conditional Set:condition executes the SET command only when the condition is true. $GET(person) returns "" if person is undefined OR if it explicitly holds "". So $GET(person)\="" is true in both cases, and phone gets set to "Unknown". If person has any non-empty value, the entire SET is skipped. (Reference: InterSystems Practice Q18; [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_commands#GCOS_commands_postconditional))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

A developer is confused about Boolean evaluation. Which of the following values is considered TRUE (non-zero) in an ObjectScript Boolean context?

**A.** "" (empty string)

**B.** 0

**C.** "abc"

**D.** "1abc"

### Answer and explanation

**Correct answer: D.** "1abc"

ObjectScript evaluates Boolean values by converting to numeric. Empty string converts to 0 (false). 0 is false. "abc" has no leading numeric portion and converts to 0 (false). "1abc" starts with 1, so it converts to 1 (true). Any non-zero numeric value is considered true. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_boolean))

## Question 3 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

You are auditing code for Boolean logic bugs. Which of the following ObjectScript values evaluate to FALSE (0)? (Select all that apply)

**A.** "" (empty string)

**B.** 0

**C.** "0"

**D.** "abc"

**E.** "0.0"

**F.** 1

### Answer and explanation

**Correct answer: A.** "" (empty string)

**Correct answer: B.** 0

**Correct answer: C.** "0"

**Correct answer: D.** "abc"

**Correct answer: E.** "0.0"

All are false except 1\. Empty string, 0, "0", and "0.0" are all numerically zero. "abc" has no leading digits, so it converts to 0 (false). Only non-zero numeric values (like 1, -5, 3.14, "2dogs") are true. This is a critical concept for post-conditionals. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_boolean))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
You are categorizing values using post-conditionals. Consider:

set x = 10
set:x>5 result = "big"
set:x<5 result = "small"
write result

What is the output?
```

**A.** big

**B.** small

**C.** bigsmall

**D.** An \<UNDEFINED\> error

### Answer and explanation

**Correct answer: A.** big

x\=10. The first post-conditional x\>5 is true, so result is set to "big". The second post-conditional x\<5 is false (10 is not less than 5), so that SET is skipped. Write outputs "big". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_commands#GCOS_commands_postconditional))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
You need to understand the difference between QUIT and RETURN. Consider:

ClassMethod Process() As %String
{
  for i = 1:1:3 {
    if i = 2 return "found"
  }
  return "not found"
}

What does ..Process() return?
```

**A.** "found"

**B.** "not found"

**C.** An empty string

**D.** An \<UNDEFINED\> error

### Answer and explanation

**Correct answer: A.** "found"

RETURN exits the entire method immediately, regardless of how many nested loops or blocks surround it. When i\=2, RETURN "found" exits the method and returns "found". If QUIT were used instead, it would only exit the for loop, and execution would continue to RETURN "not found". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_creturn))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
You are tracing the execution of a loop with a post-conditional quit. Consider:

for i = 1:1:5 {
  quit:i=3
  write i, " "
}
write "done"

What is the output?
```

**A.** 1 2 done

**B.** 1 2 3 done

**C.** 1 2 3 4 5 done

**D.** done

### Answer and explanation

**Correct answer: A.** 1 2 done

The loop writes 1 (i\=1), then writes 2 (i\=2). When i\=3, the post-conditional Quit:i\=3 is true, so QUIT exits the For loop before the Write. Execution continues after the loop with Write "done". Output: "1 2 done". (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_cquit))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

```text
You are using post-conditionals with the Write command. Consider:

set status = "active"
write:status="active" "Online"
write:status="inactive" "Offline"

What is the output?
```

**A.** Online

**B.** Offline

**C.** OnlineOffline

**D.** A \<SYNTAX\> error

### Answer and explanation

**Correct answer: A.** Online

Post-conditionals work with Write and most other commands. Write:status\="active" executes because the condition is true. Write:status\="inactive" is skipped because the condition is false. Only "Online" is output. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_commands#GCOS_commands_postconditional))

## Question 8 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

Which ObjectScript commands support post-conditionals (command:condition)? (Select all that apply)

**A.** SET

**B.** DO

**C.** QUIT

**D.** WRITE

**E.** FOR

**F.** IF

### Answer and explanation

**Correct answer: A.** SET

**Correct answer: B.** DO

**Correct answer: C.** QUIT

**Correct answer: D.** WRITE

Most ObjectScript commands support post-conditionals: SET, DO, QUIT, WRITE, KILL, NEW, CONTINUE, and many others. However, FOR and IF do NOT support post-conditionals because they already have their own conditional logic built in. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_commands#GCOS_commands_postconditional))

## Question 9 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

```text
You are counting odd numbers using Continue with a post-conditional. Consider:

set count = 0
for i = 1:1:10 {
  continue:i#2=0
  set count = count + 1
}
write count

What is the output?
```

**A.** 5

**B.** 10

**C.** 4

**D.** 6

### Answer and explanation

**Correct answer: A.** 5

Continue:i#2\=0 skips the rest of the loop body when i is even (i modulo 2 equals 0). So count is incremented only for odd values of i: 1, 3, 5, 7, 9 \= 5 times. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_ccontinue))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
You encounter a value with mixed numeric and string content in a Boolean context. Consider:

set val = "3.5abc"
if val {
  write "TRUE"
} else {
  write "FALSE"
}

What is the output?
```

**A.** TRUE

**B.** FALSE

**C.** An \<ILLEGAL VALUE\> error

**D.** A \<SYNTAX\> error

### Answer and explanation

**Correct answer: A.** TRUE

ObjectScript converts "3.5abc" to numeric by extracting the leading numeric portion: 3.5. Since 3.5 is non-zero, the Boolean evaluation is true. This is consistent with the weak typing rules used everywhere in ObjectScript. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_boolean))

## Question 11 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

```text
You are testing whether a Do post-conditional skips execution. Consider:

set x = ""
do:x ..MyMethod()
write "End"

ClassMethod MyMethod()
{
  write "Called "
}

What is the output?
```

**A.** Called End

**B.** End

**C.** An \<UNDEFINED\> error

**D.** A \<SYNTAX\> error

### Answer and explanation

**Correct answer: B.** End

Do:x evaluates x as a Boolean condition. Since x\="" which converts to 0 (false), the DO is not executed and MyMethod is never called. Only "End" is written. An empty string is always false in ObjectScript. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_commands#GCOS_commands_postconditional))

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

```text
You are using $SELECT for a compact conditional. Consider:

set x = "cat"
write $SELECT(x="dog":"Woof", x="cat":"Meow", 1:"Unknown")

What is the output?
```

**A.** Woof

**B.** Meow

**C.** Unknown

**D.** A \<SYNTAX\> error

### Answer and explanation

**Correct answer: B.** Meow

$SELECT evaluates conditions left to right and returns the value associated with the first true condition. x\="dog" is false, x\="cat" is true, so it returns "Meow". The 1:"Unknown" acts as a default case (1 is always true). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fselect))

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

```text
A developer forgot the default case in $SELECT. Consider:

write $SELECT(0:"A", 0:"B")

What happens?
```

**A.** Returns "" (empty string)

**B.** Returns 0

**C.** Throws a \<SELECT\> error

**D.** Returns the last value "B"

### Answer and explanation

**Correct answer: C.** Throws a \<SELECT\> error

If no condition in $SELECT evaluates to true, ObjectScript throws a \<SELECT\> error. Always include a default case using 1:defaultValue as the last condition to prevent this error. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fselect))

## Question 14 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

Which of the following values evaluate to TRUE in an ObjectScript Boolean context? (Select all that apply)

**A.** 1

**B.** -5

**C.** "2dogs"

**D.** " 3"

**E.** "00"

**F.** ".5test"

### Answer and explanation

**Correct answer: A.** 1

**Correct answer: B.** -5

**Correct answer: C.** "2dogs"

**Correct answer: F.** ".5test"

In ObjectScript, a value is TRUE if its numeric interpretation is nonzero. 1 is true. -5 is true (nonzero). "2dogs" interprets as 2 (true). " 3" with a leading space interprets as 0 (false) because ObjectScript's numeric conversion stops at the first non-numeric character, and a leading space is non-numeric in this context. "00" converts to 0 (false). ".5test" converts to 0.5 (true, nonzero). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators))

## Question 15 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

```text
You are debugging a loop that uses QUIT incorrectly. Consider:

ClassMethod FindItem(list As %ListOfDataTypes, target As %String) As %Integer
{
  for i = 1:1:list.Count() {
    if list.GetAt(i) = target {
      quit i
    }
  }
  return -1
}

Assuming the target is found at position 2, what does this method return?
```

**A.** 2

**B.** -1

**C.** An \<UNDEFINED\> error

**D.** A \<COMMAND\> error

### Answer and explanation

**Correct answer: D.** A \<COMMAND\> error

QUIT with an argument (QUIT i) is not allowed inside a FOR block \-- it produces a \<COMMAND\> error. Inside a FOR loop, QUIT (without an argument) exits the loop, while QUIT expr is only valid for exiting a method with a return value. To return from the method, use RETURN i instead of QUIT i. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_cquit))

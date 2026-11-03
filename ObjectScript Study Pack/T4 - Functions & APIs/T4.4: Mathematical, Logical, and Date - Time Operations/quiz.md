[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T4.4: Performs Mathematical Operations and Date/Time Manipulation — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

```text
Which of the following is the result of this expression:

"A" + "B"
```

**A.** "AB"

**B.** A \<SYNTAX\> error

**C.** "0"

**D.** A \<COMMAND\> error

**E.** 0

### Answer and explanation

**Correct answer: E.** 0

In ObjectScript, the \+ operator always performs numeric addition. Non-numeric strings like "A" and "B" are coerced to 0 (they have no leading numeric portion). So "A" \+ "B" \= 0 \+ 0 \= 0\. String concatenation uses the \_ operator: "A" \_ "B" \= "AB". No error is thrown because weak typing is a core feature of ObjectScript. (Reference: InterSystems Practice Q16; [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_numeric))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

```text
Which of the following expressions evaluates to 5?

Remember: ObjectScript evaluates strictly left-to-right with NO operator precedence.
```

**A.** 2 / 2 \+ 2 \+ 4 / 2

**B.** 1 \+ (2 \* 3\) \+ 1 / 2

**C.** 2 \+ 4 \* 1 \+ 1

**D.** 3 \+ 4 \+ (4 \* 2\) / (1 \+ 2\)

### Answer and explanation

**Correct answer: D.** 3 \+ 4 \+ (4 \* 2\) / (1 \+ 2\)

Evaluating each left-to-right (parentheses evaluated first):
a) 2/2\=1, \+2\=3, \+4\=7, /2\=3.5
b) (2\*3)\=6, then 1\+6\=7, \+1\=8, /2\=4
c) 2\+4\=6, \*1\=6, \+1\=7
d) (4\*2)\=8, (1\+2)\=3, then 3\+4\=7, \+8\=15, /3\=5
Only option d equals 5\. (Reference: InterSystems Practice Q17; [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_precedence))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

```text
A junior developer is surprised by this result. Consider:

write 2 + 3 * 4

What is the output?
```

**A.** 14

**B.** 20

**C.** 12

**D.** 24

### Answer and explanation

**Correct answer: B.** 20

ObjectScript evaluates expressions strictly left-to-right with NO operator precedence. So: 2 \+ 3 \= 5, then 5 \* 4 \= 20\. In languages with standard math precedence, 3\*4 would be evaluated first giving 14, but ObjectScript does not follow that convention. Use parentheses to control order: 2 \+ (3 \* 4\) \= 14\. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_precedence))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
You are calculating a hash bucket for load balancing. Consider:

set bucket = 47 # 8
write bucket

What is the output?
```

**A.** 5

**B.** 7

**C.** 5.875

**D.** 6

### Answer and explanation

**Correct answer: B.** 7

The \# operator performs modulo (remainder) division. 47 \# 8: 47 divided by 8 is 5 with remainder 7 (5 \* 8 \= 40, 47 \- 40 \= 7). So the result is 7\. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_numeric))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
You are calculating page numbers from a record offset. Consider:

set page = 47 \ 10
write page

What is the output?
```

**A.** 4.7

**B.** 4

**C.** 5

**D.** 3

### Answer and explanation

**Correct answer: B.** 4

The \\ operator performs integer division (truncates toward zero). 47 \\ 10 \= 4 (47 / 10 \= 4.7, truncated to 4). This is useful for pagination and similar integer calculations. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_numeric))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
You encounter the ObjectScript modulo operator with a negative number. Consider:

write -7 # 3

What is the output?
```

**A.** -1

**B.** 2

**C.** -2

**D.** 1

### Answer and explanation

**Correct answer: B.** 2

In ObjectScript, the modulo operator (#) always returns a result with the same sign as the divisor (or zero). For -7 \# 3: the result is 2 (because -7 \= -3\*3 \+ 2). This differs from languages like C where -7 % 3 \= -1. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_numeric))

## Question 7 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

What format does the $HOROLOG special variable use?

**A.** YYYY-MM-DD HH:MM:SS

**B.** Two comma-separated integers: days since December 31, 1840 and seconds since midnight

**C.** Unix timestamp (seconds since January 1, 1970\)

**D.** MM/DD/YYYY,HH:MM:SS

### Answer and explanation

**Correct answer: B.** Two comma-separated integers: days since December 31, 1840 and seconds since midnight

$HOROLOG contains the current local date and time as two comma-separated integers: the number of days since December 31, 1840, and the number of seconds since midnight. For example, "67891,45000" means day 67891 at 45000 seconds past midnight. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_vhorolog))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

```text
You are writing a time display utility. Consider:

set h = "67891,3661"
write $ZTIME($PIECE(h, ",", 2))

What is the output?
```

**A.** 01:01:01

**B.** 1:01:01

**C.** 01:01 AM

**D.** 3661

### Answer and explanation

**Correct answer: A.** 01:01:01

$PIECE(h, ",", 2\) extracts the seconds portion (3661). $ZTIME converts seconds since midnight to a time string. 3661 seconds \= 1 hour \+ 1 minute \+ 1 second \= "01:01:01" in the default 24-hour HH:MM:SS format. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fztime))

## Question 9 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

You need to add 7 days to the current date and keep the result as a $HOROLOG day number. Which code does that?

**A.** set future \= $HOROLOG \+ 7

**B.** set future \= $PIECE($HOROLOG, ",", 1\) \+ 7

**C.** set future \= $DATEADD($HOROLOG, 7, "day")

**D.** set future \= $SYSTEM.SQL.Functions.DATEADD("dd", 7, $ZDATE($HOROLOG,3))

**E.** set future \= $INCREMENT($HOROLOG, 7\)

### Answer and explanation

**Correct answer: A.** set future \= $HOROLOG \+ 7

**Correct answer: B.** set future \= $PIECE($HOROLOG, ",", 1\) \+ 7

$HOROLOG is "days,seconds" (for example 67669,34384). Applying \+ to it makes ObjectScript read characters up to the first non-numeric one, so $HOROLOG \+ 7 yields the day count plus 7 \-- the same value $PIECE($HOROLOG, ",", 1\) \+ 7 computes explicitly, which is the clearer way to write it. $DATEADD is not an ObjectScript function. $SYSTEM.SQL.Functions.DATEADD does run and returns the right DATE, but as an ODBC timestamp string ('2026-09-24 00:00:00'), not the $HOROLOG day number the question asks for. $INCREMENT does not even compile against a special variable \-- it raises \<SYNTAX\>, because it increments a stored node, not an expression.

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
You are converting an ODBC date string to $HOROLOG format. Consider:

set hDate = $ZDATEH("2026-03-05", 3)

What does hDate contain?
```

**A.** A formatted date string like "03/05/2026"

**B.** An integer representing days since December 31, 1840

**C.** A %Date object

**D.** The string "2026-03-05" unchanged

### Answer and explanation

**Correct answer: B.** An integer representing days since December 31, 1840

$ZDATEH is the inverse of $ZDATE \- it converts a date string to a $HOROLOG date value. Format 3 \= YYYY-MM-DD (ODBC/ISO). It returns an integer representing days since December 31, 1840, which can be used for date arithmetic. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fzdateh))

## Question 11 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

```text
You are debugging a complex expression. Consider:

write 10 - 2 * 3 + 1

What is the output?
```

**A.** 5

**B.** 25

**C.** 3

**D.** 4

### Answer and explanation

**Correct answer: B.** 25

Left-to-right evaluation: 10 \- 2 \= 8, then 8 \* 3 \= 24, then 24 \+ 1 \= 25\. Standard math precedence would give 10 \- 6 \+ 1 \= 5, but ObjectScript evaluates strictly left-to-right. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_precedence))

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

```text
A report generator needs today's date in ISO format. Consider:

write $ZDATE($HOROLOG, 3)

What format does this produce?
```

**A.** MM/DD/YYYY (e.g., 03/05/2026)

**B.** DD/MM/YYYY (e.g., 05/03/2026)

**C.** YYYY-MM-DD (e.g., 2026-03-05)

**D.** Mmm DD, YYYY (e.g., Mar 05, 2026\)

### Answer and explanation

**Correct answer: C.** YYYY-MM-DD (e.g., 2026-03-05)

$ZDATE format 3 returns a date in YYYY-MM-DD format (ODBC/ISO 8601). Common formats: 1 \= MM/DD/YYYY (US), 3 \= YYYY-MM-DD (ISO), 4 \= DD/MM/YYYY (European). Format 3 is the most common for database operations and international standards. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fzdate))

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

```text
You are reviewing a billing calculation. Consider:

write 100 - 10 * 2 + 5 * 3

What is the output?
```

**A.** 555

**B.** 265

**C.** 75

**D.** 185

### Answer and explanation

**Correct answer: A.** 555

Left-to-right: 100 \- 10 \= 90, \* 2 \= 180, \+ 5 \= 185, \* 3 \= 555\. This is a dangerous expression in ObjectScript because most developers expect standard precedence (100 \- 20 \+ 15 \= 95). Always use parentheses for clarity. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_operators#GCOS_operators_precedence))

## Question 14 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

Which of the following are special variables related to date and time in ObjectScript? (Select all that apply)

**A.** $HOROLOG \- local date and time as days,seconds (integer precision)

**B.** $ZTIMESTAMP \- UTC date and time with fractional seconds

**C.** $NOW \- current date and time

**D.** $ZHOROLOG \- local date and time with fractional seconds

**E.** $DATE \- current date

### Answer and explanation

**Correct answer: A.** $HOROLOG \- local date and time as days,seconds (integer precision)

**Correct answer: B.** $ZTIMESTAMP \- UTC date and time with fractional seconds

$HOROLOG contains local date,time as integer days and seconds. $ZTIMESTAMP contains UTC date,time with fractional seconds. $ZHOROLOG does NOT contain date/time — it contains the number of seconds elapsed since the most recent InterSystems IRIS startup. There are no $NOW or $DATE special variables in ObjectScript. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_vzhorolog))

## Question 15 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

```text
A developer needs midnight represented as a time value. Consider:

write $ZTIME(0)

What is the output?
```

**A.** 00:00:00

**B.** 12:00:00 AM

**C.** 0

**D.** An \<ILLEGAL VALUE\> error

### Answer and explanation

**Correct answer: A.** 00:00:00

$ZTIME(0) converts 0 seconds since midnight to the default 24-hour time format: "00:00:00". The default format (tformat\=1) is HH:MM:SS in 24-hour notation. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_fztime))

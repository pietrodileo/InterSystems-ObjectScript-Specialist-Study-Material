[Topic contents](index.md) · [Study guide](study.md) · [All topics](../../index.md)

# T4.7: Uses Streams and Network APIs — Practice quiz

[Approfondimenti dagli esercizi](<Approfondimenti esercizi/README.md>)

[Review the chapter diagrams](visuals.md)


Try each question before reading its answer. Answers and explanations are reproduced from the source.

## Question 1 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q01.md>)

You need to read a large log file line by line. Which class should you use?

**A.** %Stream.FileBinary

**B.** %Stream.FileCharacter

**C.** %Stream.GlobalCharacter

**D.** %File

### Answer and explanation

**Correct answer: B.** %Stream.FileCharacter

%Stream.FileCharacter is designed for reading and writing text (character) files. It handles character encoding and provides ReadLine() for line-by-line reading. %Stream.FileBinary is for binary files (images, PDFs) where character encoding is not relevant. %Stream.GlobalCharacter stores data in globals, not files. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propstream))

## Question 2 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q02.md>)

You are writing a utility to create a text file. Which code correctly writes data and saves it?

**A.** ```text
set stream = ##class(%Stream.FileCharacter).%New()
set stream.Filename = "/tmp/output.txt"
do stream.Write("Hello World")
set sc = stream.%Save()
```

**B.** ```text
set stream = ##class(%Stream.FileCharacter).%New()
do stream.Open("/tmp/output.txt")
do stream.Write("Hello World")
do stream.Close()
```

**C.** ```text
set stream = ##class(%Stream.FileCharacter).%New()
set stream.Filename = "/tmp/output.txt"
do stream.Append("Hello World")
do stream.Flush()
```

**D.** ```text
set stream = ##class(%Stream.FileCharacter).%New()
do stream.SetFilename("/tmp/output.txt")
do stream.Put("Hello World")
set sc = stream.%Save()
```

### Answer and explanation

**Correct answer: A.** ```text
set stream = ##class(%Stream.FileCharacter).%New()
set stream.Filename = "/tmp/output.txt"
do stream.Write("Hello World")
set sc = stream.%Save()
```

The correct pattern for %Stream.FileCharacter: (1) Create a new instance, (2) set the Filename property to the target path, (3) use Write() or WriteLine() to add data, (4) call %Save() to persist to disk. There are no Open/Close, Append, Flush, SetFilename, or Put methods for this pattern. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propstream))

## Question 3 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q03.md>)

You are reading an entire file stream. Which code correctly reads all content?

**A.** ```text
while 'stream.AtEnd {
  set line = stream.ReadLine()
  write line, !
}
```

**B.** ```text
while stream.HasNext() {
  set line = stream.Next()
  write line, !
}
```

**C.** ```text
for i = 1:1:stream.Length {
  write stream.ReadChar(), !
}
```

**D.** set content \= stream.GetAll()

### Answer and explanation

**Correct answer: A.** ```text
while 'stream.AtEnd {
  set line = stream.ReadLine()
  write line, !
}
```

The standard stream reading pattern uses While 'stream.AtEnd (while NOT at end) with ReadLine() or Read(). AtEnd is a property that returns 1 when the stream position has reached the end. HasNext(), Next(), ReadChar(), and GetAll() are not standard stream methods. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propstream))

## Question 4 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q04.md>)

```text
A colleague's code reads a stream but needs to read it again from the beginning. Consider:

set stream = ##class(%Stream.GlobalCharacter).%New()
do stream.Write("First line")
do stream.WriteLine("")
do stream.Write("Second line")
// Read the stream once...
while 'stream.AtEnd { set x = stream.Read() }
// Now need to read it again

What method resets the read position to the beginning?
```

**A.** do stream.Reset()

**B.** do stream.Rewind()

**C.** set stream.Position \= 0

**D.** do stream.MoveToStart()

### Answer and explanation

**Correct answer: B.** do stream.Rewind()

Rewind() resets the stream's read position to the beginning, allowing you to read the content from the start again. It does not modify the stream's content. There is no Reset(), Position property, or MoveToStart() method on standard streams. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propstream))

## Question 5 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q05.md>)

```text
You need to copy data from one stream to another. Consider:

set source = ##class(%Stream.GlobalCharacter).%New()
do source.Write("Important data")
do source.Rewind()

set target = ##class(%Stream.FileCharacter).%New()
set target.Filename = "/tmp/backup.txt"

Which line correctly copies the source content to the target?
```

**A.** set target \= source

**B.** do target.CopyFrom(source)

**C.** do target.Write(source.ReadAll())

**D.** set target.Content \= source.Content

### Answer and explanation

**Correct answer: B.** do target.CopyFrom(source)

CopyFrom() copies the entire contents of the source stream into the target stream. This is more efficient than manually reading and writing, especially for large streams. Simple assignment (set target \= source) would copy the object reference, not the data. There is no ReadAll() or Content property on standard streams. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propstream))

## Question 6 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q06.md>)

```text
You are testing stream behavior. Consider:

set stream = ##class(%Stream.GlobalCharacter).%New()
do stream.Write("Hello ")
do stream.Write("World")
do stream.Rewind()
write stream.Read()

What is the output?
```

**A.** Hello

**B.** World

**C.** Hello World

**D.** A \<STREAM\> error

### Answer and explanation

**Correct answer: C.** Hello World

Two Write calls append data sequentially to the stream: "Hello " then "World". After Rewind(), the read position is reset to the beginning. Read() without a length argument reads all remaining content, returning "Hello World". Multiple writes are concatenated. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propstream))

## Question 7 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q07.md>)

Which of the following are valid stream classes in InterSystems IRIS? (Select all that apply)

**A.** %Stream.FileCharacter \- text files

**B.** %Stream.FileBinary \- binary files

**C.** %Stream.GlobalCharacter \- text in globals

**D.** %Stream.GlobalBinary \- binary in globals

**E.** %Stream.MemoryCharacter \- in-memory text

### Answer and explanation

**Correct answer: A.** %Stream.FileCharacter \- text files

**Correct answer: B.** %Stream.FileBinary \- binary files

**Correct answer: C.** %Stream.GlobalCharacter \- text in globals

**Correct answer: D.** %Stream.GlobalBinary \- binary in globals

IRIS provides four main stream types: FileCharacter and FileBinary for file-based storage, GlobalCharacter and GlobalBinary for database (global) storage. There is no %Stream.MemoryCharacter; for temporary in-memory streams, use %Stream.TmpCharacter or %Stream.TmpBinary. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_propstream))

## Question 8 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q08.md>)

You need to make an HTTP GET request to retrieve data from a REST API. Which code is correct?

**A.** ```text
set req = ##class(%Net.HttpRequest).%New()
set req.Server = "api.example.com"
set sc = req.Get("/data")
```

**B.** ```text
set req = ##class(%Net.HttpRequest).%New()
set sc = req.Send("GET", "http://api.example.com/data")
```

**C.** ```text
set req = ##class(%Net.HttpRequest).%New("http://api.example.com")
set sc = req.Execute("GET", "/data")
```

**D.** set response \= ##class(%Net.HttpRequest).Get("[Reference](http://api.example.com/data"))

### Answer and explanation

**Correct answer: A.** ```text
set req = ##class(%Net.HttpRequest).%New()
set req.Server = "api.example.com"
set sc = req.Get("/data")
```

The correct pattern: (1) Create a %Net.HttpRequest object, (2) set the Server property to the hostname, (3) call Get("/path") with the request path. While %Net.HttpRequest does have a Send(type, location) method (used internally by Get/Post/Put/etc.), option B passes a full URL as the location parameter instead of just the path, and does not set the Server property. Option C uses Execute() which does not exist. Option D uses a static Get() which does not exist. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GNET_http))

## Question 9 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q09.md>)

```text
After making an HTTP request, you need to read the response body. Consider:

set req = ##class(%Net.HttpRequest).%New()
set req.Server = "api.example.com"
set sc = req.Get("/users")

How do you access the response body?
```

**A.** set body \= req.Response.Body

**B.** set body \= req.HttpResponse.Data

**C.** set body \= req.GetResponseBody()

**D.** set body \= req.HttpResponse.Content

### Answer and explanation

**Correct answer: B.** set body \= req.HttpResponse.Data

After an HTTP request, the response is in req.HttpResponse (a %Net.HttpResponse object). The response body is available as a stream in req.HttpResponse.Data. You can read it with .Read() or iterate with ReadLine(). The status code is in req.HttpResponse.StatusCode. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GNET_http))

## Question 10 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q10.md>)

```text
You are building an integration that sends JSON data via HTTP POST. Consider:

set req = ##class(%Net.HttpRequest).%New()
set req.Server = "api.example.com"
set req.ContentType = "application/json"
do req.EntityBody.Write("{""name"":""John""}")
set sc = req.Post("/users")

Which statement best describes what this code does?
```

**A.** It sends a GET request with JSON query parameters

**B.** It sends a POST request with a JSON body to /users

**C.** It creates a JSON file on the server at /users

**D.** It throws an error because EntityBody is not a valid property

### Answer and explanation

**Correct answer: B.** It sends a POST request with a JSON body to /users

The code creates an HTTP POST request with Content-Type set to application/json. The request body is written to req.EntityBody (a stream). Post("/users") sends the request with the JSON body to the /users endpoint. EntityBody is the standard way to set the request body for POST/PUT requests. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GNET_http))

## Question 11 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q11.md>)

Which HTTP methods are directly supported as methods on %Net.HttpRequest? (Select all that apply)

**A.** Get() for HTTP GET

**B.** Post() for HTTP POST

**C.** Put() for HTTP PUT

**D.** Delete() for HTTP DELETE

**E.** Patch() for HTTP PATCH

**F.** Options() for HTTP OPTIONS

### Answer and explanation

**Correct answer: A.** Get() for HTTP GET

**Correct answer: B.** Post() for HTTP POST

**Correct answer: C.** Put() for HTTP PUT

**Correct answer: D.** Delete() for HTTP DELETE

**Correct answer: E.** Patch() for HTTP PATCH

%Net.HttpRequest provides Get(), Post(), Put(), Delete() and Patch() directly, and Head() for HTTP HEAD. It has no Options() method: for OPTIONS \-- or any other verb without a dedicated method \-- you call Send() and pass the verb as a string, for example do request.Send("OPTIONS", url). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GNET_http))

## Question 12 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q12.md>)

You need to send an email notification. Which two classes are involved and what are their roles?

**A.** %Net.SMTP sends the email; %Net.MailMessage defines the email content (To, From, Subject, Body)

**B.** %Net.MailMessage both composes and sends the email directly

**C.** %Net.SMTP both composes and sends the email with setters for To, From, Subject

**D.** %Net.EmailClient sends the email; %Net.EmailMessage defines the content

### Answer and explanation

**Correct answer: A.** %Net.SMTP sends the email; %Net.MailMessage defines the email content (To, From, Subject, Body)

Two classes work together: %Net.MailMessage is used to compose the email (set To, From, Subject, TextBody or add HTML/attachments). %Net.SMTP is the transport \- set its SmtpServer property, then call smtp.Send(message) to deliver. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GNET_email))

## Question 13 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q13.md>)

You are writing an email-sending utility. Which code correctly sets up and sends an email?

**A.** ```text
set msg = ##class(%Net.MailMessage).%New()
set msg.From = "sender@test.com"
do msg.To.Insert("recipient@test.com")
set msg.Subject = "Test"
set msg.TextData.Write("Hello")
set smtp = ##class(%Net.SMTP).%New()
set smtp.smtpserver = "mail.test.com"
set sc = smtp.Send(msg)
```

**B.** ```text
set smtp = ##class(%Net.SMTP).%New()
set smtp.To = "recipient@test.com"
set smtp.From = "sender@test.com"
set smtp.Subject = "Test"
set smtp.Body = "Hello"
set sc = smtp.Send()
```

**C.** ```text
set msg = ##class(%Net.MailMessage).%New()
set msg.To = "recipient@test.com"
do msg.Send("mail.test.com")
```

**D.** set sc \= ##class(%Net.SMTP).SendMail("mail.test.com", "sender@test.com", "recipient@test.com", "Test", "Hello")

### Answer and explanation

**Correct answer: A.** ```text
set msg = ##class(%Net.MailMessage).%New()
set msg.From = "sender@test.com"
do msg.To.Insert("recipient@test.com")
set msg.Subject = "Test"
set msg.TextData.Write("Hello")
set smtp = ##class(%Net.SMTP).%New()
set smtp.smtpserver = "mail.test.com"
set sc = smtp.Send(msg)
```

The correct pattern: (1) Create a %Net.MailMessage and configure From, To (via To.Insert), Subject, and body content (TextData stream or IsHTML). (2) Create a %Net.SMTP, set smtpserver. (3) Call smtp.Send(msg). The To property is a list that requires Insert() to add recipients. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GNET_email))

## Question 14 (single)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q14.md>)

Which class provides FTP client functionality for transferring files in ObjectScript?

**A.** %Net.FTP

**B.** %Net.FtpSession

**C.** %Net.FtpClient

**D.** %Net.FileTransfer

### Answer and explanation

**Correct answer: B.** %Net.FtpSession

%Net.FtpSession provides FTP client functionality including connecting to FTP servers, uploading/downloading files, listing directories, and managing remote files. Set the Server property, call Connect(), then use methods like Store(), Retrieve(), and List(). (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GNET_ftp))

## Question 15 (multiple)

[Analisi guidata di questa domanda](<Approfondimenti esercizi/Domanda per domanda/Q15.md>)

You need to configure an HTTPS request with custom headers. Which properties and methods of %Net.HttpRequest are valid? (Select all that apply)

**A.** Server \- sets the target hostname

**B.** Port \- sets the target port number

**C.** Https \- set to 1 to enable SSL/TLS

**D.** ContentType \- sets the Content-Type header

**E.** SetHeader(name, value) \- sets a custom HTTP header

**F.** Setting Https\=1 is sufficient on its own; SSLConfiguration is only needed for client certificates

### Answer and explanation

**Correct answer: A.** Server \- sets the target hostname

**Correct answer: B.** Port \- sets the target port number

**Correct answer: C.** Https \- set to 1 to enable SSL/TLS

**Correct answer: D.** ContentType \- sets the Content-Type header

**Correct answer: E.** SetHeader(name, value) \- sets a custom HTTP header

Server sets the hostname, Port the port, Https\=1 selects TLS, ContentType sets the Content-Type header, and SetHeader() adds arbitrary headers such as Authorization or Accept. Https\=1 alone is not enough: SSLConfiguration must name a configured SSL/TLS client configuration, which supplies the trusted certificate authorities and protocol settings the connection needs. Without it the request fails to establish TLS, and that is true whether or not a client certificate is involved. (Reference: [Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GNET_http))

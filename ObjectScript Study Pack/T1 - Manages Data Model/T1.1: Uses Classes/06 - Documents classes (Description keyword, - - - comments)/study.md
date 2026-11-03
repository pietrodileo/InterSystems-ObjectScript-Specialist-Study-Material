[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.1: Uses Classes

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.1.html). Reference links require internet access.

## 6. Documents classes (Description keyword, /// comments)

![T1.1 visual summary of sections 4–6: 4. Interprets storage definitions (DataLocation, IdLocation, IndexLocation, USEEXTENTSET); 5. Implements multiple inheritance (order matters, method resolution); 6. Documents classes (Description keyword, /// comments)](../visual-guide-02-v2.png)

*This diagram covers sections 4–6; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **/// comments** placed before a class, property, or method become the Description in the class reference
- The **Description keyword** can also be used in class/member definitions
- Documentation is accessible via the Class Reference in the Management Portal and Studio
- Supports **HTML formatting** within descriptions
- Good documentation is essential for maintainability and team collaboration

### Detailed Notes

#### Overview

InterSystems IRIS provides a built-in documentation system that extracts specially formatted comments from class source code and presents them in the Class Reference documentation browser. Proper documentation helps other developers understand your code and is a professional best practice.

#### Using /// Comments

Lines beginning with `///` immediately before a class, property, method, or other class member are treated as the member's description. These comments support HTML markup.

```objectscript
/// This class represents a patient in the healthcare system.
/// <p>It stores demographic information and provides methods
/// for managing patient records.</p>
Class Sample.Patient Extends %Persistent
{
    /// The patient's full legal name as it appears on their ID.
    Property Name As %String(MAXLEN = 200);

    /// The patient's date of birth in $HOROLOG format.
    Property DOB As %Date;

    /// Calculate the patient's age based on their date of birth.
    /// <p>Returns the age in whole years.</p>
    /// <example>
    /// Set age = patient.GetAge()
    /// Write "Patient is ", age, " years old"
    /// </example>
    Method GetAge() As %Integer
    {
        // Method implementation
        Return $HOROLOG - ..DOB \ 365.25
    }
}
```

#### Using the Description Keyword

Alternatively, the `Description` keyword can be used within member definitions:

```objectscript
Property Name As %String [ Description = "The patient's full legal name" ];
```

However, `///` comments are generally preferred because they are easier to read and maintain in the source code.

#### HTML Tags Supported in Documentation

- `<p>` - Paragraphs
- `<b>`, `<i>` - Bold and italic
- `<ul>`, `<ol>`, `<li>` - Lists
- `<table>`, `<tr>`, `<td>` - Tables
- `<code>` - Inline code
- `<example>` - Code example blocks (InterSystems-specific tag)
- `<class>ClassName</class>` - Links to other class documentation
- `<method>MethodName</method>` - Links to methods
- `<property>PropertyName</property>` - Links to properties

#### Viewing Documentation

Class documentation can be viewed through:

- **Management Portal**: System Explorer &gt; Classes &gt; select class &gt; Documentation tab
- **VS Code Extension**: Hover over class/member names to see descriptions
- **Class Reference**: Generated HTML documentation browsable by package

#### Best Practices

- Document every public class and method with `///` comments
- Include parameter descriptions and return value explanations for methods
- Use `<example>` tags to show usage patterns
- Document non-obvious behavior, edge cases, and assumptions
- Keep descriptions concise but informative

### Documentation References

- [Documenting Classes](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes_documenting)
- [Class Reference](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_class_desc)

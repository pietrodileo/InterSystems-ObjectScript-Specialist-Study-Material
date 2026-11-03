[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.3: Creates ObjectScript Methods

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.3.html). Reference links require internet access.

## 1. Differentiates between instance and class methods (Method vs ClassMethod, ..property syntax)

![T1.3 visual summary of sections 1–4: 1. Differentiates between instance and class methods (Method vs ClassMethod, ..property syntax); 2. Uses class parameters inside methods (..#ParameterName); 3. Specifies method arguments and return type (As clause, Output, ByRef); 4. Passes objects to methods (oref passing)](../visual-guide-01.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **Method**: Instance method that operates on a specific object instance; has access to properties via `..PropertyName`
- **ClassMethod**: Invoked on the class itself without requiring an object instance
- Instance methods receive an implicit `%This` reference to the current object
- **..PropertyName** syntax accesses properties of the current instance (only in instance methods)
- Class methods cannot use `..` syntax because there is no object instance

### Detailed Notes

#### Overview

InterSystems IRIS distinguishes between two fundamental method types. The choice between them determines how the method is invoked and what data it can access. This distinction is critical for proper class design.

#### Instance Methods

```objectscript
Class Sample.Person Extends %Persistent
{
    Property Name As %String;
    Property DOB As %Date;

    /// Instance method - operates on a specific person
    Method GetAge() As %Integer
    {
        Set today = +$HOROLOG
        Set birthDays = ..DOB
        Return (today - birthDays) \ 365.25
    }

    /// Instance method that modifies the object
    Method UpdateName(newName As %String) As %Status
    {
        Set ..Name = newName
        Return ..%Save()
    }
}
```

Calling an instance method requires an object reference:

```objectscript
Set person = ##class(Sample.Person).%OpenId(1)
Set age = person.GetAge()
Write "Age: ", age, !
```

#### Class Methods

```objectscript
Class Sample.Person Extends %Persistent
{
    /// Class method - no object instance needed
    ClassMethod FindByName(name As %String) As Sample.Person
    {
        &sql(SELECT ID INTO :id FROM Sample.Person WHERE Name = :name)
        If SQLCODE = 0 {
            Return ##class(Sample.Person).%OpenId(id)
        }
        Return ""
    }

    /// Class method - utility function
    ClassMethod GetCount() As %Integer
    {
        &sql(SELECT COUNT(*) INTO :count FROM Sample.Person)
        Return count
    }
}
```

Calling a class method uses the class reference syntax:

```objectscript
Set person = ##class(Sample.Person).FindByName("John Smith")
Set total = ##class(Sample.Person).GetCount()
```

#### The `..` Syntax

The double-dot syntax is syntactic sugar available only in instance methods:

- `..PropertyName` accesses a property (equivalent to `$THIS.PropertyName`)
- `..MethodName()` calls another instance method on the same object
- `..#ParameterName` accesses a class parameter (works in both instance and class methods)

```objectscript
Method DisplayInfo()
{
    Write "Name: ", ..Name, !
    Write "Age: ", ..GetAge(), !         // calls instance method
    Write "Type: ", ..#OBJECTTYPE, !     // accesses class parameter
}
```

#### When to Use Each Type

| Use Instance Method When... | Use ClassMethod When... |
| --- | --- |
| Operating on a specific object's data | No specific object is needed |
| Accessing or modifying properties | Performing lookups or searches |
| Computing derived values from properties | Creating factory methods |
| Implementing business logic for one object | Implementing utility functions |

### Documentation References

- [Method Definitions](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods)
- [Instance Methods vs Class Methods](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_methods_kinds)

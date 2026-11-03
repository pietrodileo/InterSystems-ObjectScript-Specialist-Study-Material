[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.3: Creates ObjectScript Methods

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.3.html). Reference links require internet access.

## 2. Uses class parameters inside methods (..#ParameterName)

![T1.3 visual summary of sections 1–4: 1. Differentiates between instance and class methods (Method vs ClassMethod, ..property syntax); 2. Uses class parameters inside methods (..#ParameterName); 3. Specifies method arguments and return type (As clause, Output, ByRef); 4. Passes objects to methods (oref passing)](../visual-guide-01.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **..#ParameterName** accesses a class parameter from within any method (instance or class)
- Class parameters act as constants defined at the class level
- Parameters can be overridden in subclasses, enabling polymorphic behavior
- Common system parameters: DEFAULTGLOBAL, USEEXTENTSET, MANAGEDEXTENT
- Use parameters for configuration values that may vary by subclass

### Detailed Notes

#### Overview

Class parameters define constants associated with a class. They provide a way to configure class behavior without hardcoding values in methods. Because parameters can be overridden in subclasses, they enable a powerful pattern where base class methods adapt their behavior based on subclass configuration.

#### Defining and Accessing Parameters

```objectscript
Class Sample.Notification Extends %RegisteredObject
{
    Parameter MAXRETRIES = 3;
    Parameter TIMEOUT = 30;
    Parameter PROVIDER = "Email";

    Method Send(message As %String) As %Status
    {
        For i = 1:1:..#MAXRETRIES {
            // Attempt to send with timeout
            Set sc = ..DoSend(message, ..#TIMEOUT)
            If $$$ISOK(sc) Return sc
        }
        Return $$$ERROR($$$GeneralError, "Failed after " _ ..#MAXRETRIES _ " retries")
    }

    ClassMethod GetProvider() As %String
    {
        Return ..#PROVIDER
    }
}
```

#### Overriding Parameters in Subclasses

```objectscript
Class Sample.SMSNotification Extends Sample.Notification
{
    Parameter MAXRETRIES = 5;
    Parameter TIMEOUT = 10;
    Parameter PROVIDER = "SMS";
}
```

When `SMSNotification.Send()` executes, `..#MAXRETRIES` evaluates to 5 and `..#TIMEOUT` to 10 (the overridden values), even though the method code is defined in the parent class. This is resolved at compile time.

#### Parameter Types

Parameters can optionally have a type constraint:

```objectscript
Parameter BATCHSIZE As %Integer = 100;
Parameter ENABLED As %Boolean = 1;
Parameter PREFIX As %String = "APP";
```

#### Common System Parameters

Several system parameters control class behavior:

| Parameter | Purpose |
| --- | --- |
| USEEXTENTSET | Use hashed global names for storage |
| MANAGEDEXTENT | Allow %ExtentMgr to track the extent |
| DEFAULTGLOBAL | Override default global name for storage |
| READONLY | Prevent modification of objects |
| DSTIME | Enable BI synchronization |

#### Using Parameters for Configurable Behavior

```objectscript
Class Sample.BaseProcessor Extends %RegisteredObject
{
    Parameter LOGPREFIX = "PROC";
    Parameter LOGLEVEL = 2;

    Method Log(message As %String, level As %Integer = 1)
    {
        If level <= ..#LOGLEVEL {
            Write "[", ..#LOGPREFIX, "] ", message, !
        }
    }
}
```

### Documentation References

- [Class Parameters](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes_parameters)
- [Parameter Keywords](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_parameter)

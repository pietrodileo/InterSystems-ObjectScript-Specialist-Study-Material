[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.2: Creates Properties and Indexes

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.2.html). Reference links require internet access.

## 4. Creates and validates class member parameters and attributes (Required, InitialExpression, parameter keywords)

![T1.2 visual summary of sections 1–4: 1. Sets max length for string properties (MAXLEN parameter, TRUNCATE); 2. Uses stream properties for large data sets (%Stream.GlobalCharacter, %Stream.FileBinary); 3. Creates properties that calculate values dynamically or are auto-updated (Calculated, SqlComputed, SqlComputeOnChange); 4. Creates and validates class member parameters and attributes (Required, InitialExpression, parameter keywords)](../visual-guide-01-v2.png)

*This diagram covers sections 1–4; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **Required** keyword ensures a property must have a value before %Save() succeeds
- **InitialExpression** sets a default value when %New() creates an object
- **Property parameters** (MAXLEN, MINVAL, MAXVAL, VALUELIST, etc.) constrain allowed values
- **Class parameters** define constants accessible throughout the class via `..#ParamName`
- Validation occurs during %Save() and respects all constraints

### Detailed Notes

#### Overview

Class members in InterSystems IRIS can be configured with various keywords and parameters that control validation, default values, and behavior. These attributes are essential for building robust data models that enforce business rules at the object level.

#### The Required Keyword

When a property is marked `Required`, `%Save()` will fail if the property has no value:

```objectscript
Class Sample.Order Extends %Persistent
{
    Property OrderNumber As %String [ Required ];
    Property CustomerName As %String [ Required ];
    Property OrderDate As %Date [ InitialExpression = {+$HOROLOG} ];
    Property Status As %String [ InitialExpression = "NEW" ];
}
```

Attempting to save without setting `OrderNumber` or `CustomerName` returns a `%Status` error.

#### InitialExpression

`InitialExpression` provides a default value assigned when `%New()` creates an instance:

```objectscript
Property CreatedDate As %Date [ InitialExpression = {+$HOROLOG} ];
Property Active As %Boolean [ InitialExpression = 1 ];
Property Counter As %Integer [ InitialExpression = 0 ];
```

Note: Expressions within `{ }` are evaluated at runtime. Without braces, the value is a literal constant.

#### Common Property Parameters

```objectscript
Class Sample.Product Extends %Persistent
{
    /// String with constrained length
    Property Name As %String(MAXLEN = 100, MINLEN = 1);

    /// Numeric with range constraints
    Property Price As %Numeric(MAXVAL = 99999.99, MINVAL = 0, SCALE = 2);

    /// Enumerated values
    Property Category As %String(VALUELIST = ",Electronics,Clothing,Food,Other");

    /// Display values for the enumeration
    Property Priority As %String(
        VALUELIST = ",H,M,L",
        DISPLAYLIST = ",High,Medium,Low"
    );

    /// Pattern-matched string
    Property ZipCode As %String(PATTERN = "5N.1(1""-""4N)");
}
```

#### Class Parameters

Class parameters define constants for the entire class:

```objectscript
Class Sample.Config Extends %Persistent
{
    Parameter DEFAULTCATEGORY = "General";
    Parameter MAXRETRIES As %Integer = 3;
    Parameter TABLENAME = "Products";

    Method GetCategory() As %String
    {
        Return ..#DEFAULTCATEGORY
    }
}
```

Parameters can be overridden in subclasses:

```objectscript
Class Sample.SpecialConfig Extends Sample.Config
{
    Parameter DEFAULTCATEGORY = "Special";
}
```

#### Validation Behavior

Validation occurs at several points: 1. **Property Set**: Type checking happens when a property value is set 2. **%Save()**: Required checks, VALUELIST validation, MAXLEN/MINLEN checks 3. **%ValidateObject()**: Can be called explicitly to validate without saving 4. **SQL INSERT/UPDATE**: Same validation applies through SQL operations

```objectscript
Set order = ##class(Sample.Order).%New()
// OrderNumber is Required but not set
Set sc = order.%Save()
// sc contains an error - Required field missing
If $$$ISERR(sc) {
    Do $System.Status.DisplayError(sc)
    // Displays: "ERROR #7201: Property 'OrderNumber' required"
}
```

### Documentation References

- [Property Keywords](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_property)
- [Class Parameters](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes_parameters)

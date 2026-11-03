[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.3: Creates ObjectScript Methods

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.3.html). Reference links require internet access.

## 7. Uses and overrides inherited methods (overriding, calling parent)

![T1.3 visual summary of sections 5–8: 5. Passes variables by reference (ByRef, .variable syntax at call site); 6. Passes multidimensional variables by reference (passing arrays); 7. Uses and overrides inherited methods (overriding, calling parent); 8. Determines when to use ##super for calling superclass methods](../visual-guide-02.png)

*This diagram covers sections 5–8; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- Subclasses **inherit** all methods from their superclass(es)
- A subclass can **override** an inherited method by defining a method with the same name
- The overriding method must have a **compatible signature** (same arguments and return type)
- The **Final** keyword prevents a method from being overridden in subclasses
- Overriding is the foundation of **polymorphism** in object-oriented programming

### Detailed Notes

#### Overview

Method inheritance allows subclasses to reuse parent class behavior. When a subclass needs different behavior, it overrides the inherited method with its own implementation. This is a key mechanism of object-oriented programming that enables polymorphism.

#### Basic Inheritance

```objectscript
Class Sample.Shape Extends %RegisteredObject
{
    Property Color As %String;

    Method Describe() As %String
    {
        Return "A shape of color " _ ..Color
    }

    Method Area() As %Numeric
    {
        Return 0
    }
}
```

A subclass inherits all methods automatically:

```objectscript
Class Sample.Circle Extends Sample.Shape
{
    Property Radius As %Numeric;

    /// Override Area to compute circle area
    Method Area() As %Numeric
    {
        Return $ZPI * (..Radius ** 2)
    }

    /// Override Describe
    Method Describe() As %String
    {
        Return "A circle of radius " _ ..Radius _ " and color " _ ..Color
    }
}
```

#### Polymorphic Behavior

```objectscript
ClassMethod PrintShapeInfo(shape As Sample.Shape)
{
    // Calls the appropriate version based on actual object type
    Write shape.Describe(), !
    Write "Area: ", shape.Area(), !
}

// Works with any Shape subclass
Set c = ##class(Sample.Circle).%New()
Set c.Radius = 5
Set c.Color = "Red"
Do ##class(Sample.Util).PrintShapeInfo(c)
// Output: A circle of radius 5 and color Red
// Area: 78.5398...
```

#### The Final Keyword

Marking a method as `Final` prevents subclasses from overriding it:

```objectscript
Class Sample.Base Extends %RegisteredObject
{
    /// This method cannot be overridden
    Method Validate() As %Status [ Final ]
    {
        // Validation logic that must not be changed
        Return $$$OK
    }
}
```

Attempting to override a Final method in a subclass causes a compiler error.

#### Overriding Rules

- The overriding method should have the same argument types and return type
- An instance method can only be overridden by an instance method (same for ClassMethod)
- If the parent method is Final, it cannot be overridden
- The overriding method can call the parent implementation using `##super()`

### Documentation References

- [Inheritance](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GOBJ_classes_inheritance)
- [Method Keywords](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ROBJ_method)

[Topic contents](../index.md) · [Full topic guide](../study.md) · [All topics](../../../index.md)

# T1.4: Uses Complex Structures

Saved 2 November 2026 from [exam-prep.es](https://exam-prep.es/exams/objectscript/knowledge/T1.4.html). Reference links require internet access.

## 1. Creates dynamic objects/arrays (JSON) - %DynamicObject, %DynamicArray, %FromJSON, %ToJSON

![T1.4 visual summary of sections 1–2: 1. Creates dynamic objects/arrays (JSON) - %DynamicObject, %DynamicArray, %FromJSON, %ToJSON; 2. Uses stream objects of the appropriate type (%Stream.GlobalCharacter, %Stream.GlobalBinary, %Stream.FileCharacter, %Stream.FileBinary, Write(), Read(), Rewind())](../visual-guide-01.png)

*This diagram covers sections 1–2; use the matching numbered panel for this page.* [Chapter diagrams](../visuals.md) · [Technical review notes](../../../visual-technical-notes.md)

### Key Points

- **%DynamicObject** creates key-value structures similar to JSON objects
- **%DynamicArray** creates ordered lists similar to JSON arrays
- **%FromJSON()** parses a JSON string into a %DynamicObject or %DynamicArray
- **%ToJSON()** serializes a dynamic object/array back to a JSON string
- Curly brace `{}` and bracket `[]` literals create dynamic objects and arrays inline
- Dynamic objects are schema-less: no class definition required
- Assigning a nested dynamic array or object to a variable shares a reference; mutations are visible through the parent

### Detailed Notes

#### Overview

InterSystems IRIS provides native JSON support through `%DynamicObject` and `%DynamicArray`. These classes allow you to create, manipulate, and serialize JSON data without defining formal class schemas. They are essential for building REST APIs, processing external data, and exchanging structured data with other systems.

#### Creating Dynamic Objects

Using the `%New()` constructor:

```objectscript
Set obj = ##class(%DynamicObject).%New()
Do obj.%Set("name", "John Smith")
Do obj.%Set("age", 35, "number")
Do obj.%Set("active", 1, "boolean")
Write obj.%ToJSON()
// Output: {"name":"John Smith","age":35,"active":true}
```

Using the `{}` literal syntax (preferred for simple cases):

```objectscript
Set obj = {"name": "John Smith", "age": 35, "active": true}
Write obj.%ToJSON()
// Output: {"name":"John Smith","age":35,"active":true}
```

#### Accessing Properties

```objectscript
Set obj = {"name": "John", "age": 35}

// Dot syntax for simple property names
Write obj.name, !          // John
Write obj.age, !           // 35

// %Get() method for dynamic access
Set key = "name"
Write obj.%Get(key), !     // John
```

#### Modifying Dynamic Objects

```objectscript
Set obj = {"name": "John"}

// Add/modify properties
Set obj.age = 35
Do obj.%Set("email", "john@example.com")

// Remove a property
Do obj.%Remove("email")

// Check if property exists
Write obj.%IsDefined("name")   // 1
Write obj.%IsDefined("email")  // 0
```

#### Creating Dynamic Arrays

Using `%New()`:

```objectscript
Set arr = ##class(%DynamicArray).%New()
Do arr.%Push("apple")
Do arr.%Push("banana")
Do arr.%Push("cherry")
Write arr.%ToJSON()
// Output: ["apple","banana","cherry"]
```

Using the `[]` literal syntax:

```objectscript
Set arr = ["apple", "banana", "cherry"]
Write arr.%ToJSON()
```

#### Array Operations

```objectscript
Set arr = ["a", "b", "c", "d"]

// Access by index (0-based)
Write arr.%Get(0), !      // a
Write arr.%Get(2), !      // c

// Get array size
Write arr.%Size(), !       // 4

// Push to the end
Do arr.%Push("e")

// Pop from the end
Set last = arr.%Pop()      // "e"

// Remove at index
Do arr.%Remove(1)          // removes "b"
```

#### Parsing JSON with %FromJSON()

```objectscript
Set jsonString = "{""name"":""Alice"",""scores"":[95,87,92]}"
Set obj = ##class(%DynamicAbstractObject).%FromJSON(jsonString)
// or equivalently:
Set obj = {}.%FromJSON(jsonString)

Write obj.name, !                  // Alice
Write obj.scores.%Get(0), !       // 95
Write obj.scores.%Size(), !       // 3
```

From a stream:

```objectscript
Set stream = ##class(%Stream.GlobalCharacter).%New()
Do stream.Write("{""key"":""value""}")
Do stream.Rewind()
Set obj = ##class(%DynamicAbstractObject).%FromJSON(stream)
Write obj.key, !   // value
```

#### Nested Structures

```objectscript
Set person = {
    "name": "Bob",
    "address": {
        "street": "123 Main St",
        "city": "Springfield",
        "state": "IL"
    },
    "phones": [
        {"type": "home", "number": "555-1234"},
        {"type": "work", "number": "555-5678"}
    ]
}

Write person.address.city, !                      // Springfield
Write person.phones.%Get(0).number, !             // 555-1234
Write person.%ToJSON(), !                          // Full JSON string
```

#### Shared References to Nested Arrays

A nested dynamic array is an object. In `Set arr = obj.values`, the variable `arr` receives a reference to the same array held by the `values` member. Both references let you access and modify that array.

`%DynamicArray` indexes start at 0, so `arr.%Set(1, 99)` replaces the second element, 20, with 99. Serializing the parent with `obj.%ToJSON()` includes the array's current contents, so the change appears in the parent's JSON.

```objectscript
Set obj = {"name":"Test","values":[10,20,30]}
Set arr = obj.values
Do arr.%Set(1, 99)

Write arr.%ToJSON(), !
// [10,99,30]
Write obj.values.%ToJSON(), !
// [10,99,30]
Write obj.%ToJSON(), !
// {"name":"Test","values":[10,99,30]}
```

Assigning a new array to `arr` has a different effect: it changes which object that variable references. It leaves `obj.values` pointing to the original array.

```objectscript
Set arr = [1,2,3]
Write arr.%ToJSON(), !
// [1,2,3]
Write obj.values.%ToJSON(), !
// [10,99,30]
```

The same reference behavior applies to nested `%DynamicObject` values.

#### Iterating Over Dynamic Objects

```objectscript
Set obj = {"name": "Alice", "age": 30, "city": "Boston"}
Set iter = obj.%GetIterator()
While iter.%GetNext(.key, .value) {
    Write key, " = ", value, !
}
// Output:
// name = Alice
// age = 30
// city = Boston
```

#### Iterating Over Dynamic Arrays

```objectscript
Set arr = ["red", "green", "blue"]
Set iter = arr.%GetIterator()
While iter.%GetNext(.idx, .value) {
    Write idx, ": ", value, !
}
// Output:
// 0: red
// 1: green
// 2: blue
```

#### Type Control with %Set()

The third argument of `%Set()` controls the JSON type:

```objectscript
Set obj = ##class(%DynamicObject).%New()
Do obj.%Set("count", 42, "number")       // JSON number
Do obj.%Set("label", "42", "string")      // JSON string "42"
Do obj.%Set("active", 1, "boolean")       // JSON true
Do obj.%Set("deleted", 0, "boolean")      // JSON false
Do obj.%Set("notes", "", "null")          // JSON null
Write obj.%ToJSON()
// {"count":42,"label":"42","active":true,"deleted":false,"notes":null}
```

#### Checking Value Types

```objectscript
Set obj = {"name": "Test", "count": 5, "active": true, "data": null}
Write obj.%GetTypeOf("name"), !      // string
Write obj.%GetTypeOf("count"), !     // number
Write obj.%GetTypeOf("active"), !    // boolean
Write obj.%GetTypeOf("data"), !      // null
Write obj.%GetTypeOf("missing"), !   // unassigned
```

### Documentation References

- [Using JSON in ObjectScript](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GJSON_create)
- [%DynamicObject](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GJSON_create)
- [%DynamicArray](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GJSON_create)

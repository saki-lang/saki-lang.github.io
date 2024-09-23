# Record

Record terms in **Saki** represent structured data types that aggregate multiple named fields, each of which is associated with a specific type. They are similar to records or structs in other programming languages, providing a way to group related data under one composite type. The flexibility of records, along with the ability to organize fields with shared types concisely, makes them useful for modeling a wide variety of data structures.

## Syntax

The syntax for defining a record type in Saki is as follows:

```
FieldBinding ::= Ident+ ':' Term
RecordTerm   ::= 'record' '{' FieldBinding ((NL+|',') FieldBinding)* '}'
```

- **FieldBinding:** The field declaration in a record, consisting of one or more field names (`Ident+`) followed by a colon (`:`) and the type (`Term`). The `Ident+` syntax indicates that multiple fields can share the same type, simplifying the declaration of records with fields of identical types.
  
- **RecordTerm:** The entire record type definition. The `record` keyword introduces the record, followed by a block `{}` containing one or more field declarations (`FieldBinding`). Field declarations can be separated by either newlines (`NL`) or commas.

## Typing Rules

The formal typing rules for records in Saki specify how to type both the record term and the field access. The rules ensure that the types of fields are consistent with the declared record structure.

### Typing a Record Term

The typing rule for constructing a record is given as:

$$
\frac{\Gamma \vdash \overline{t_i : T_i}^i}{\Gamma \vdash \{ \overline{l_i = t_i}^i \} : \{ \overline{l_i : T_i}^i \}}
$$

This rule means that if each field `t_i` has type `T_i` in the typing context $\Gamma$, then the record `{ l_i = t_i }` is of type `{ l_i : T_i }`. In other words, if all fields are well-typed according to their declarations, the entire record is well-typed.

### Typing Field Access

The rule for accessing a field from a record is as follows:

$$
\frac{\Gamma \vdash t: \{ \overline{l_i : T_i}^i \}}{\Gamma \vdash t.f_i : T_i}
$$

This rule means that if a term `t` is a record with a field `f_i` of type `T_i`, then accessing the field `t.f_i` results in a value of type `T_i`. The field access operation is type-safe because it guarantees that the type of the field matches its declaration in the record.

### Record Subtyping

Saki supports **structural subtyping** for records, meaning that a record with more fields can be a subtype of a record with fewer fields if the shared fields have matching types. This is formalized as:

$$
\forall S \,.\, \forall (S' \subseteq S) \,.\, \{\overline{l_i : T_i}^{i \in S}\} <: \{\overline{l_i : T_i}^{i \in S'}\}
$$

This rule states that a record type with fields indexed by `S` is a subtype of a record type with fields indexed by `S'` if `S'` is a subset of `S`. This allows for flexibility when passing records to functions that only need to access a subset of the fields.

## Examples

### Basic Record Declaration

A simple record with fields `name` and `age`:

```
record {
    name: String
    age: ℕ
}
```

This defines a record with two fields:

- `name` of type `String`
- `age` of type `ℕ` (natural number)

A record type like this can be used to represent an entity, such as a person, where each field holds specific data relevant to that entity.

### Nested Records and Higher-Level Universes

```
record {  
    name: String
    birthDate: record {
        day month year: ℕ
    }
}
```

Here, the `birthDate` field is a nested record with fields for `day`, `month`, and `year`, all of type `ℕ`. 
   
### Field Assignments for Record Values

Record terms not only define types but also support **value instantiation**. A record value can be created using field assignments. The syntax for record values is:

```
FieldAssignment   ::= Ident (‘:’ Term)? ‘=’ Term
RecordValueTerm   ::= (Term | 'record') ‘^’ ‘{’ (FieldAssignment ((NL+|‘,’) FieldAssignment)*)? ‘}’
```

- **FieldAssignment:** A field value assignment uses the `Ident = Term` syntax, where `Ident` is the field name and `Term` is the value assigned to that field.
- **RecordValueTerm:** The value instantiation uses the `Term ^ { ... }` syntax, where `Term` refers to the record type, and the braces `{}` enclose field assignments. In addition, anonymous record values are represented by `record ^ { ... }` syntax.

Consider the following example of creating a `Point` record:

```scala
def Point = record {
    x y z: ℝ
}

let point = Point^ {
    x = 1.0
    y = 2.0
    z = 3.0
}
```

This code defines a record type `Point` with three fields (`x`, `y`, `z`) of type `ℝ` (real numbers). The value `point` is an instance of the `Point` record, where the fields are assigned values: `x = 1.0`, `y = 2.0`, and `z = 3.0`.

### Using Record Subtyping

Suppose you have a function that operates on a subset of the fields in a record. Using Saki’s structural subtyping, you can pass records with extra fields to functions that only expect a subset. For example:

```scala
def printName(obj: record { name: String }): Unit = {
    println(obj.name)
}

let person = record^ {
    name: String = "Alice"
    age: ℕ = 30
}

printName(person)
```

Here, the `printName` function expects a record with only a `name` field. However, `person` is a record with both `name` and `age`. Thanks to structural subtyping, `person` can still be passed to `printName`, as the `name` field exists and has the correct type.

## Higher-Level Universes in Record Fields

Saki’s type system is based on **Martin-Löf Type Theory (MLTT)**, which supports **universes** — hierarchical levels of types, where types themselves can belong to higher universes. This feature allows for **contracts**, **dependent types**, and **abstract types** to be embedded in records. Fields in records can be drawn from higher-level universes, allowing complex interactions between fields while preserving type safety. 

### Examples of Higher-Level Universes in Records

#### Contract Universes in Records

Suppose we define a contract universe for printable objects, where any object that conforms to the `Printable` contract must implement a `print` method that returns a `String`. We can store such contract-bound objects in a record:

```scala
universe 'Printable = contract {
    require print(self): String
}

record {
    docType: 'Printable
    content: String
}
```

- `docType` is a field that must conform to the `'Printable` contract, ensuring that any object assigned to this field implements the `print` method. 
- `content` is a simple string field.

#### Dependent Types in Records

Records can contain fields whose types depend on the values of other fields. For instance, consider a record that stores a vector and its size, where the size field determines the length of the vector:

```scala
record {
    size: ℕ
    elements: Vector(ℝ, size)
}
```

- `size` is a natural number representing the length of the vector.
- `elements` is a vector of real numbers, where the size of the vector is determined by the `size` field.

#### Recursive Records with Higher-Level Universes

Higher-level universes enable recursive data structures. Consider a record that models a tree with operations defined at the universe level:

```scala
universe 'Tree(A: 'Type) = contract {
    require insert(self, value: A): 'Tree(A)
    require find(self, value: A): Option(A)
}

record {
    elementType: 'Type
    structure: 'Tree(elementType)
}
```

- `elementType` is a type from the universe `'Type`, which allows for any valid type in the Saki type system.
- `structure` is a tree that supports `insert` and `find` operations, constrained by the contract `'Tree(elementType)`.

#### Abstract Operations in Records

Higher-level universes allow fields in records to refer to abstract types and operations. For example, a record might represent a mathematical object with an associated operation:

```scala
universe 'Operation = contract {
    require apply(self, x: A, y: A): A
}

record {
    operandType: 'Type
    operation: 'Operation
}
```

- `operandType` is a field from the universe `'Type`, representing any valid type.
- `operation` is a contract universe that ensures the field adheres to the `'Operation` contract, defining an `apply` method for performing operations on values of `operandType`.

#### Complex Example: A Physics Model with Higher-Level Universes

Consider a model of a physical object, where the `material` and `physical` fields are abstract and enforced by higher-level universes:

```scala
universe 'PhysicalObject = contract {
    require volume(self): ℝ
}

record {
    material: 'Type
    dimensions: record {
        length width height: ℝ
    }
    physical: 'PhysicalObject
}
```
# Algebraic Datatype

**Algebraic Data Types (ADTs)** are a special class of inductive types that are essential in functional programming and type theory. They are used to define composite types by combining other types using **sum types** (also known as **variants**) and **product types**. ADTs are particularly useful for modeling data that can take multiple distinct forms, and they are foundational in expressing complex structures such as trees, lists, and option types. In **Saki**, ADTs are defined using the `enum` keyword and can be parameterized by types and type classes, with the ability to incorporate contract universes for constrained types.

## Syntax of Algebraic Datatypes

The syntax for defining ADTs in Saki follows a straightforward pattern:

```
EnumCons     ::= Ident (‘(’ Term (‘,’ Term)* ‘)’)?
EnumTypeTerm ::= ‘data’ ‘{’ EnumCons (‘,’ EnumCons)* ‘}’
```

- **EnumCons**: Represents each constructor of the algebraic datatype. A constructor can either be a simple identifier (like `None`) or an identifier with parameters (like `Some(A)`).
- **EnumTypeTerm**: The ADT is introduced using the `data` keyword, followed by a list of constructors enclosed in braces `{}`. Multiple constructors can be defined, separated by commas.

Each constructor defines a specific form that a value of the ADT can take, either as a simple tag or as a combination of different types. ADTs in Saki resemble **sum types** in type theory, where each constructor defines a possible variant of the type.

## Examples

### Simple ADT

The `Color` type represents an ADT with no parameters. It has two possible values: `Red` and `Black`.

```scala
type Color = enum {
    Red
    Black
}
```

This is a simple ADT with no type parameters, where each constructor (`Red` and `Black`) is a distinct value of the `Color` type. This is an example of a basic sum type with two possible values.

### ADT with Type Parameters

The `Option` type is an algebraic datatype that represents a value that may or may not exist. It has two constructors: `None` (indicating no value) and `Some(A)` (indicating a value of type `A`).

```scala
type Option(A: 'Type) = enum {
    None
    Some(A)
}
```

- `Option(A)` is an ADT parameterized by a type `A`.
- The `None` constructor represents the absence of a value.
- The `Some(A)` constructor represents the presence of a value of type `A`.

This corresponds to the common **option** or **maybe** type in many functional programming languages, such as Haskell’s `Maybe` or Rust’s `Option`. In type theory, `Option(A)` represents the sum type `1 + A`, where `1` represents the unit type (used for `None`), and `A` represents the type contained in `Some`.

### Nested ADT

In Saki, algebraic data types can be parameterized by both types and contract universes. This allows the definition of types like binary trees with additional constraints on the values stored in the tree nodes. Here’s an example of a RB-tree where the values must satisfy the `'LessThan` contract, which ensures that the values can be compared.

```scala
universe 'LessThan(A: 'Type) = contract {
    require (<)(self, A: 'Type): Bool
}

type Tree[A: 'LessThan(A)] = enum {
    Leaf
    Node(Color, A, Tree[A], Tree[A])
}
```

- **Leaf**: Represents an empty tree.
- **Node**: Represents a tree node containing a `Color`, a value of type `A`, and two subtrees (`Tree[A]`).

In this example:
- `Tree[A]` is parameterized by a type `A` that must satisfy the `'LessThan` contract, ensuring that `A` supports a comparison operation (`<`).
- The `Node` constructor takes four parameters: a `Color`, a value of type `A`, and two subtrees of type `Tree[A]`. This models a binary search tree where each node is either `Red` or `Black` (as defined by the `Color` type).

**Constructors:**
- `Leaf: Tree[A]`
- `Node: Color -> A -> Tree[A] -> Tree[A] -> Tree[A]`

This definition mirrors the concept of **algebraic data structures** like binary search trees in languages such as **Haskell** or **OCaml**, but adds the flexibility of enforcing additional constraints via contracts like `'LessThan(A)`.

## Type-Theoretic Foundation of Algebraic Data Types

Algebraic Data Types can be understood as **sum types** in type theory, which are defined using **coproducts**. A sum type, like `A + B`, represents a type that can hold either a value of type `A` or a value of type `B`. In the context of ADTs:
- Each constructor of the ADT corresponds to an inclusion map into the coproduct.
- The ADT represents the **disjoint union** of its constructors.

For instance, the type `Option(A)` is defined as:
$$
\text{Option}(A) \cong 1 + A
$$
Where:

- `1` represents the `None` constructor (the unit type), indicating absence.
- `A` represents the `Some` constructor, indicating presence.

Similarly, the tree type `Tree[A]` can be seen as:
$$
\text{Tree}(A) \cong 1 + (\text{Color} \times A \times \text{Tree}(A) \times \text{Tree}(A))
$$
This reflects the two possible forms of the tree:

- A `Leaf` (represented by `1`).
- A `Node`, which holds a `Color`, a value of type `A`, and two subtrees of type `Tree[A]`.


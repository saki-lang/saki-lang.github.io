# Algebraic Datatype

<script type="module" src="/javascripts/editor.js"></script>
<link rel="stylesheet" href="/static/styles.css">

**Algebraic Datatype (ADT)** is a special kind of inductive types that are essential in functional programming and type theory. They are used to define composite types by combining other types using **sum types** (also known as **variants**) and **product types**. ADTs are particularly useful for modeling data that can take multiple distinct forms, and they are foundational in expressing complex structures such as trees, lists, and option types. In **Saki**, ADTs are defined using the `enum` keyword and can be parameterized by types and type classes, with the ability to incorporate contract universes for constrained types.

## Syntax of Algebraic Datatypes

The syntax for defining ADTs in Saki follows a straightforward pattern:

```
InductiveCons     ::= Ident (‘(’ Term (‘,’ Term)* ‘)’)?
InductiveTypeTerm ::= ‘inductive’ ‘{’ InductiveCons (‘,’ InductiveCons)* ‘}’
```

- **EnumCons**: Represents each constructor of the algebraic datatype. A constructor can either be a simple identifier (like `None`) or an identifier with parameters (like `Some(A)`).
- **EnumTypeTerm**: The ADT is introduced using the `inductive` keyword, followed by a list of constructors enclosed in braces `{}`. Multiple constructors can be defined, separated by commas.

Each constructor defines a specific form that a value of the ADT can take, either as a simple tag or as a combination of different types. ADTs in Saki resemble **sum types** in type theory, where each constructor defines a possible variant of the type.

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

## Examples of ADTs in Saki

### Simple Algebraic Data Type: `Color`

The following is an example of a simple ADT called `Color`, which represents a type with no parameters and has two distinct values: `Red` and `Black`.

<div class="code-editor">

```
type Color = inductive { Red; Black }
```
</div>

In this case, `Color` is a sum type with two possible values, `Red` and `Black`. Each constructor defines a unique value of the `Color` type. This is a basic example of an ADT, where no additional parameters or data are required.

### Parameterized Algebraic Data Type: `Option`

The `Option` type is a more complex example of an ADT. It represents a type that can either contain a value of type `A` or no value at all.

<div class="code-editor">

```
type Option(A: 'Type) = inductive {
    None
    Some(A)
}
```
</div>

- **`Option(A)`**: A generic ADT parameterized by a type `A`.
- **`None`**: A constructor representing the absence of a value.
- **`Some(A)`**: A constructor representing the presence of a value of type `A`.


### Nested Algebraic Data Type: `List`

The following example illustrates a recursive ADT that defines a list structure. The `List` type is parameterized by a type `A` and has two constructors: `Nil`, representing an empty list, and `Cons`, which constructs a new list by prepending an element of type `A` to an existing list of type `List[A]`.

<div class="code-editor">

```
type List[A: 'Type] = inductive {
    Nil
    Cons(A, List[A])
}
```
</div>

- **`Nil`**: Represents an empty list.
- **`Cons(A, List[A])`**: Represents a non-empty list, where the first element is of type `A` and the rest is a list of type `List[A]`.

### Tree Structure Using ADTs: `Tree`

The following example defines a binary tree structure, where each node contains a color, a value of type `A`, and two subtrees of the same type `Tree[A]`.

<div class="code-editor">

```
type Tree[A: 'Type] = inductive {
    Leaf
    Node(Color, A, Tree[A], Tree[A])
}
```
</div>

- **`Leaf`**: Represents a leaf node, which has no data.
- **`Node(Color, A, Tree[A], Tree[A])`**: Represents an internal node that contains a value of type `A`, a `Color`, and two subtrees of type `Tree[A]`.


## ADT/Inductive Constructor Access

In Saki, the constructors of inductive types (including ADTs) can be accessed using the `::` operator. For example:

<div class="code-editor" id="code-adt-constructor-access">

```
type Option(A: 'Type) = inductive {
    None
    Some(A)
}

eval Option(Int)::None
eval Option(String)::Some
```
</div>
<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-adt-constructor-access', 'result-adt-constructor-access')">Run Code</button>
</div>
<div class="result-editor" id="result-adt-constructor-access"></div>
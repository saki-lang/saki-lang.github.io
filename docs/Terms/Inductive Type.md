# Inductive Types

**Inductive types** are essential in type theory and functional programming for defining algebraic data structures. In **Saki**, they are introduced similarly to the **Calculus of Inductive Constructions (CIC)**, allowing the definition of recursive data structures, proof types, and logical propositions. 

## Syntax of Inductive Types

The general form for defining inductive types in Saki is:

```
InductiveField    ::= Ident ‘:’ Term
InductiveTypeTerm ::= ‘inductive’ (‘(’ Term (’,’ Term)* ‘)’)? ‘{’ InductiveField (NL+ InductiveField)* ‘}’
```

The syntax includes:

- **InductiveField**: Represents the name and type of each constructor of the inductive type.
- **InductiveTypeTerm**: Begins with the `inductive` keyword, optionally followed by type parameters. The constructor fields are enclosed within `{}`.

The parameters listed after the `inductive` keyword represent the **arity** of the inductive type. Since the ultimate part of the arity in Saki is always `'Type`, we do not explicitly write it. This mirrors the arity definition in CIC, where inductive types can take parameters but always return a value in the universe of types (`Type`). For example, in Saki, `inductive(A)` corresponds to an arity of `A -> 'Type`.

## General Form of Inductive Types

```
inductive(<ArityParams>) {
   Cons1 : <ConsType1>
   ...
   ConsN : <ConsTypeN>
}
```

In this form:

- **ArityParams**: Represents the parameters for the inductive type.
- **Cons1 ... ConsN**: Are the constructors that define the inductive data structure, each with a corresponding type `<ConsType>`.

## Examples of Inductive Types

### Option Type:**

The `Option` type represents a value that can either be `Some` (containing a value) or `None` (representing absence of a value). In Saki, it is defined as:

```scala
def Option(A: 'Type): 'Type = inductive {
    None : this        // `this` refers to the inductive type being defined, `Option(A)`
    Some : A -> this   // Constructor Some takes a value of type `A` and returns an Option
}
```

- `Option(A)` has the type `'Type -> 'Type`, which corresponds to an inductive type in CIC where the arity is `'Type`.
- The `None` constructor returns `Option(A)`, and the `Some` constructor takes a value of type `A` and returns `Option(A)`.


### Equality Type

In dependent type theory, **propositional equality** (also known as Leibniz equality) is defined as an inductive type that asserts that two terms are equal. In Saki, it can be defined as follows:

```scala
def Eq(A: 'Type, x: A): A -> 'Type = inductive(A) {
    EqRefl: this(x)   // `this(x)` is the same as `Eq(A, x, x)`
}
```

- The `Eq` inductive type has arity `A -> A -> 'Type`.
- The constructor `EqRefl` provides a proof that `x` is equal to itself (`this(x)`), which is equivalent to `Eq(A, x, x)`.


### Natural Number Ordering (Leq)

The less-than-or-equal-to relation `Leq` can be defined inductively over natural numbers (`ℕ`):

```scala
def Leq: ℕ -> ℕ -> 'Type = inductive(ℕ, ℕ) {
    LeqZero : ∀(x: ℕ) -> this(0, x)
    LeqSucc : ∀(x y: ℕ) -> this(succ x, succ y)
}
```

- `Leq` has the arity `ℕ -> ℕ -> 'Type`.
- `LeqZero` asserts that `0` is less than or equal to any number `x`.
- `LeqSucc` states that if `x ≤ y`, then `succ(x) ≤ succ(y)`.

### Binary Trees with Constraints

Using **contract universes**, Saki can define inductive types with constraints, such as a binary search tree where nodes satisfy a comparison constraint:

```scala
universe 'LessThan(A: 'Type) = contract {
    require (<)(self, A: 'Type): Bool
}

def Tree[A: 'LessThan(A)]: 'Type = inductive {
    Leaf : this
    Node : A -> Tree[A] -> Tree[A] -> this
}
```

- The `Tree` inductive type represents a binary tree structure where the values stored in the nodes satisfy the `LessThan` constraint.
- `Leaf` represents an empty tree.
- `Node` represents a tree node containing a value of type `A` and two subtrees.

### Mutually Recursive Types

**Mutually recursive** inductive types allow for the simultaneous definition of two or more types that refer to each other. An example is the definition of even and odd natural numbers:

```scala
def Even: ℕ -> 'Type = inductive(ℕ) {
    EvenZero : Even(0)
    EvenSucc : ∀(n: ℕ) -> Even(n) -> Odd(succ n)
}

def Odd: ℕ -> 'Type = inductive(ℕ) {
    OddSucc : ∀(n: ℕ) -> Odd(n) -> Even(succ n)
}
```

- `Even` and `Odd` are mutually recursive types. The constructors for `Even` and `Odd` refer to each other.
- `EvenZero` asserts that `0` is even.
- `EvenSucc` asserts that if `n` is even, then `succ(n)` is odd.
- Similarly, `OddSucc` asserts that if `n` is odd, then `succ(n)` is even.

## Inductive Constructor Access

In Saki, the constructors of inductive types can be accessed using the `::` operator. For example:

```scala
Option(ℕ)::Some
```

This refers to the `Some` constructor of the `Option(ℕ)` inductive type.

## Pattern Matching on Inductive Types

Pattern matching is essential for working with inductive types in Saki. When a term of an inductive type is passed to a function, pattern matching is used to deconstruct the term and apply the appropriate logic based on the constructor. Consider the following example of inserting a value into a binary search tree:

```scala
def insert[A: 'Type](tree: Tree[A], newValue: A): Tree[A] = match tree {
    case Tree[A]::Leaf => Tree[A]::Node(newValue, Tree[A]::Leaf, Tree[A]::Leaf)
    case Tree[A]::Node(value, left, right) => if newValue < value then {
        Tree[A]::Node(value, insert(left, newValue), right)
    } else if value < newValue then {
        Tree[A]::Node(value, left, insert(right, newValue))
    } else {
        Tree[A]::Node(newValue, left, right)
    }
}
```

- The function `insert` uses pattern matching to handle different cases of the tree (`Leaf` or `Node`).
- When `tree` is a `Leaf`, a new node is created with the `newValue`.
- When `tree` is a `Node`, the value is inserted recursively based on the comparison with `value`.

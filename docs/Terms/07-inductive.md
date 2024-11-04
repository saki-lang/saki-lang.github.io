# Inductive Type with Indices

<script type="module" src="/javascripts/editor.js"></script>
<link rel="stylesheet" href="/static/styles.css">

!!! warning
    This feature is not yet implemented or not fully supported in the current version of Saki interpreter/REPL.

In type theory, **inductive types** are fundamental constructs that allow the definition of complex data structures by specifying their constructors. 
In previous sections, we introduced algebraic data types (ADTs) as a special case of inductive types. 
An extension of inductive types involves introducing **indices**, allowing the type to vary depending on certain parameters. 
This leads to the concept of **indexed families** or **inductive types with indices**. This feature enable the encoding of rich invariants directly into the type system.


## Syntax of Inductive Types

The general form for defining inductive types in Saki is:

```
InductiveConsType       ::= InductiveConsTypeAtom (‘->’ InductiveConsTypeAtom)*
InductiveConsTypeAtom   ::= ( Term | (‘this’ ImplicitArgList? ExplicitArgList?) )
InductiveCons           ::= Ident ‘:’ InductiveConsType
InductiveTypeTerm       ::= ‘inductive’ ExplicitArgList? ‘{’ InductiveCons (NL+ InductiveCons)* ‘}’
```

The syntax includes:

- **InductiveConsType**: Specifies the type of a constructor. It consists of zero or more parameter types, followed by a return type, which can be a `Term` or the inductive type itself, denoted by `this`.
- **InductiveCons**: Declares a constructor with an identifier (`Ident`), a colon, and its type (`InductiveConsType`). 
- **InductiveTypeTerm**: Defines the inductive type, starting with the `inductive` keyword, optionally followed by explicit arguments (`ExplicitArgList`), and containing one or more constructors within braces `{}`.
 
The parameters listed after the `inductive` keyword represent the **index** of the inductive type. Since the ultimate part of the index in Saki is always `'Type`, we do not explicitly write it. This mirrors the index definition in CIC, where inductive types can take parameters but always return a value in the universe of types (`Type`). For example, in Saki, `inductive(A)` corresponds to an index of `A -> 'Type`.

## General Form of Inductive Types

An inductive type in Saki can be defined in the following general form:

```
inductive(<IndexParams>) {
   Constructor₁ : <ConstructorType₁>
   ⋮
   Constructorₙ : <ConstructorTypeₙ>
}
```

- **IndexParams**: Parameters or indices that the inductive type depends on. These can be types or values upon which the type varies.

- **Constructor₁ … Constructorₙ**: Constructors that define how values of the inductive type can be constructed. Each constructor has a corresponding type `<ConstructorType>` that may involve the indices and the inductive type itself.

## Algebraic Data Type Style vs. Inductive Style Definitions

Inductive types can be defined in different styles. The **Algebraic Data Type (ADT) style** is more concise and resembles traditional sum types, while the **inductive style** provides more explicit definitions with indices, providing greater expressiveness and control over the type system.

Consider the `Option` type as an example.

### ADT Style Definition

<div class="code-editor">

```
type Option(A: 'Type) = inductive {
    None
    Some(A)
}
```
</div>

In this definition:

- `Option` is parameterized by a type `A`.
- `None` is a constructor representing the absence of a value.
- `Some` is a constructor that takes a value of type `A`.

### Inductive Style Definition

<div class="code-editor">

```
type Option(A: 'Type) = inductive {
    None : this          // 'this' refers to 'Option(A)'
    Some : A → this      // 'Some' takes an 'A' and returns 'Option(A)'
}
```
</div>

In this definition:

- The constructors explicitly specify their types.
- `None` has type `Option(A)`, indicated by `this`.
- `Some` is a function from `A` to `Option(A)`.

Both definitions are functionally equivalent. The inductive style makes the types of the constructors explicit. 
This is essential when defining inductive types with indices, as it allows for precise type-level information and reasoning.


## Examples of Inductive Types with Indices

### Vectors with Length Indices

A classic example of an inductive type with indices is a vector whose length is part of its type. 
This kind of vector definition ensures that operations on vectors respect their lengths at the type level.

<div class="code-editor">

```
def Vec(A: 'Type): Int -> 'Type = inductive(Int) {
    Nil : this(0)
    Cons : A -> ∀(n: Int) -> Vec(A, n) -> this(n + 1)
}
```
</div>

Where:

- **`Vec`** is a function that, given a type (`A: 'Type`), returns an inductive type with index (`n: Int`) representing the length . (i.e. a function taking an integer (`n: Int`) and producing an inductive type `Vec(n) : 'Type`).
- The **index** is the integer specified in `inductive(Int)`.
- **Constructors**:
    - `Nil` is a constructor of type `this(0)`, representing an empty vector of length 0.
    - `Cons` is a constructor that takes an element of type `A`, an integer `n`, and a vector `Vec(A, n)`, and returns a vector of length `n + 1`, indicated by `this(n + 1)`.

### Equality Type

Recall the **propositional equality** (Leibniz equality) defined as a function in the previous section:

<div class="code-editor">

```
def Eq(A: 'Type, a b: A): 'Type = ∀(P: A -> 'Type) -> P(a) -> P(b)
def refl(A: 'Type, a: A): A.Eq(a, a) = (P: A -> 'Type, p: P(a)) => p
```
</div>

Besides this functional definition, equality can also be defined as an inductive type in Saki:

<div class="code-editor">

```
def Eq(A: 'Type, x: A): A -> 'Type = inductive(A) {
    EqRefl: this(x)   // `this(x)` is the same as `Eq(A, x, x)`
}
```
</div>

In this example, $Eq_A$ and $refl_x$ are separately defined by the inductive type `Eq` and the constructor `EqRefl`:

- The `Eq` inductive type has index `A -> A -> 'Type`.
- The constructor `EqRefl` provides a proof that `x` is equal to itself (`this(x)`), which is equivalent to `Eq(A, x, x)`.



## Practical Example: Verified Merge Sort

<div class="code-editor">

```
/**
 * Inductive type definition for natural numbers (ℕ).
 * This type is recursively defined using two constructors:
 * - `Zero`: The base case representing the natural number zero.
 * - `Succ`: The successor constructor, representing a natural number that is one greater than another.
 */
type ℕ = inductive { Zero; Succ(ℕ) }

/**
 * Boolean function to compare two natural numbers (ℕ) for less-than-or-equal-to relation (<=).
 * 
 * @param x The first natural number (ℕ).
 * @param y The second natural number (ℕ).
 * @return true if x is less than or equal to y, false otherwise.
 */
def (<=)(x y: ℕ): Bool = match (x, y) {
    case (ℕ::Zero, _) => true
    case (ℕ::Succ(x'), ℕ::Succ(y')) => x' <= y'
    case (_, _) => false
}

/**
 * Inductive type definition for the proof of the less-than-or-equal-to (Leq) relation.
 * 
 * The type provides a constructive proof for the relation `x <= y`:
 * - `LeqZero`: A proof that `Zero <= x` for any natural number x.
 * - `LeqSucc`: A proof that if `x <= y`, then `Succ(x) <= Succ(y)`.
 */
def Leq: ℕ -> ℕ -> 'Type = inductive(ℕ, ℕ) {
    LeqZero : ∀(x: ℕ) -> this(ℕ::Zero, x)
    LeqSucc : ∀(x y: ℕ) -> this(ℕ::Succ(x), ℕ::Succ(y))
}

/**
 * Inductive type definition for a vector (Vec) of fixed size.
 * This type is recursively defined using two constructors:
 * - `Nil`: An empty vector of length 0.
 * - `Cons`: A non-empty vector with length n + 1, consisting of a head element and a tail vector of size n.
 * 
 * @param n The length of the vector (ℕ).
 */
type Vec(n: Int) = inductive {
    Nil                // An empty list with length 0
    Cons(ℕ, Vec(n))    // A list with length n+1, consisting of a head and a tail
}

/**
 * Inductive type definition for the proof that a vector (Vec) is sorted.
 * 
 * The type provides a constructive proof that a vector of length n is sorted:
 * - `SortedNil`: A proof that an empty vector is always sorted.
 * - `SortedOne`: A proof that a vector with one element is always sorted.
 * - `SortedCons`: A proof that a vector with two or more elements is sorted if the head is less than or equal to
 *                 the next element, and the tail is also sorted.
 * 
 * @param n The length of the vector (ℕ).
 * @param vec The vector of length n to be checked for sortedness.
 * @return A type-level proof that the vector is sorted.
 */
def Sorted(n: Int): Vec(n) -> 'Type = inductive(Vec(n)) {
    // An empty list is always sorted
    SortedNil: this(Vec(0))
    // A list with one element is always sorted
    SortedOne: this(Vec(1))
    // A list with two or more elements is sorted if the head is less than or equal 
    // to the next element, and the tail is also sorted
    SortedCons: ∀(x y: ℕ) -> ∀(xs: Vec(n)) -> Leq(x, y) -> this(Vec(n)) -> this(Vec(n + 1))
}

/**
 * Function to merge two sorted vectors (Vec) and return a merged sorted vector with a proof of sortedness.
 * 
 * @param n The length of the first vector (ℕ).
 * @param m The length of the second vector (ℕ).
 * @param xs The first sorted vector of length n.
 * @param ys The second sorted vector of length m.
 * @return A tuple containing the merged vector of length n + m and a proof that the merged vector is sorted.
 */
def merge(n m: Int, xs: Vec(n), ys: Vec(m)): (Vec(n + m), Sorted(n + m)) = match (xs, ys) {
    case (Vec(n)::Nil, ys) => (ys, Sorted(m)::SortedNil)  // Merging with an empty list is sorted
    case (xs, Vec(m)::Nil) => (xs, Sorted(n)::SortedNil)  // Merging with an empty list is sorted
    case (Vec(n)::Cons(x, xsRest), Vec(m)::Cons(y, ysRest)) => {
        if x <= y then {
            let (mergedRest, proofRest) = merge(xsRest, ys)
            let proof = Sorted(n + m)::SortedCons(x, y, mergedRest, Leq::LeqZero, proofRest)
            (Vec(n + m)::Cons(x, mergedRest), proof)
        } else {
            let (mergedRest, proofRest) = merge(xs, ysRest)
            let proof = Sorted(n + m)::SortedCons(y, x, mergedRest, Leq::LeqSucc(x, y), proofRest)
            (Vec(n + m)::Cons(y, mergedRest), proof)
        }
    }
}

/**
 * Function to perform merge sort on a vector (Vec) of length n, returning the sorted vector and a proof of sortedness.
 * 
 * @param n The length of the input vector (ℕ).
 * @param list The input vector to be sorted.
 * @return A tuple containing the sorted vector and a proof that the vector is sorted.
 */
def mergeSort(n: Int, list: Vec(n)): (Vec(n), Sorted(n)) = match list {
    // An empty list is trivially sorted
    case Vec(0)::Nil => (Vec(0)::Nil, Sorted(0)::SortedNil)
    // A single-element list is sorted
    case Vec(1)::Cons(x, Vec(0)::Nil) => (list, Sorted(1)::SortedOne)
    case _ => {
        let (left, right) = split(n, list)  // Split the list into two halves
        let (sortedLeft, proofLeft) = mergeSort(left)
        let (sortedRight, proofRight) = mergeSort(right)
        merge(sortedLeft, sortedRight)  // Merge the sorted halves with proof
    }
}

/**
 * Function to split a vector of length n into two sub-vectors.
 * The first sub-vector has length n / 2, and the second has length n - n / 2.
 * 
 * @param n The length of the input vector (ℕ).
 * @param list The input vector to be split.
 * @return A tuple containing the two sub-vectors after the split.
 */
def split(n: Int, list: Vec(n)): (Vec(n / 2), Vec(n - n / 2)) = {
    // Start the recursion with initial accumulators and sizes
    splitRec(n, n / 2, Vec(n / 2)::Nil, Vec(n - n / 2)::Nil, list)
}

/**
 * Recursive helper function to split a vector into two sub-vectors.
 * This function takes accumulators and sizes for the left and right sub-vectors, and iterates through the input vector.
 * 
 * @param i The remaining size of the input vector (ℕ).
 * @param leftSize The size of the left sub-vector (ℕ).
 * @param leftAcc The accumulated left sub-vector (Vec(leftSize)).
 * @param rightAcc The accumulated right sub-vector (Vec(n - leftSize)).
 * @param rest The remaining part of the vector to be split (Vec(i)).
 * @return A tuple containing the two sub-vectors after the split.
 */
def splitRec(
    i: Int, leftSize: Int, leftAcc: Vec(leftSize), 
    rightAcc: Vec(n - leftSize), rest: Vec(i),
): (Vec(n / 2), Vec(n - n / 2)) = match (leftSize, rest) {
    // No more elements for the left side, return the remaining as right
    case (0, _) => (leftAcc, rest)
    // Done splitting, return accumulators
    case (_, Vec(i)::Nil) => (leftAcc, rightAcc)
    // Add to the left
    case (_, Vec(i)::Cons(x, xs)) => {
        splitRec(i - 1, leftSize - 1, Vec(leftSize)::Cons(x, leftAcc), rightAcc, xs)
    }
}
```
</div>

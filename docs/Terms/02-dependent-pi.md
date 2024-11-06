# Dependent Pi (Function) Type

<script type="module" src="/javascripts/editor.js"></script>
<link rel="stylesheet" href="/static/styles.css">

Dependent types generalize function types by allowing the result type to depend on the input value. This capability enables richer type systems where the type returned by a function can vary based on its argument.

## Syntax

Dependent types are expressed in terms of $\Pi$-types (Pi-types), which describe functions where the return type is dependent on the actual input value. The syntax for dependent function types in Saki is:

```
PiTypeSymbol    ::= ‘forall’ | ‘Π’ | ‘∀’
DepFuncType     ::= PiTypeSymbol ‘(’ Ident ‘:’ Term ‘)’ ‘->’ Term
```

This can be read as: for all $x$ of type $A$, the type of the result is $B(x)$, where $B(x)$ may depend on the actual value of $x$.

## Typing Rules

### Formation Rule
The $\Pi$-type is formed when the return type is dependent on the input value. The rule for forming a dependent function type is:
$$
\frac{\Gamma ,x:A \vdash B: \mathcal{U}}{\Gamma \vdash \Pi (x:A) \,.\, B: \mathcal{U}}
$$
This rule means that if the return type $B(x)$ is well-formed in the universe $\mathcal{U}$ when $x$ has type $A$, then the dependent function type $\Pi(x:A) . B(x)$ is also well-formed in the universe.

### Introduction Rule
$$
\frac{\Gamma ,x:A \vdash B: \mathcal{U} \quad \Gamma ,x:A \vdash b : B}{\Gamma \vdash \lambda (x:A)\,.\,b : \Pi (x:A) \,.\, B}
$$
This rule means that if $b$ is a term of type $B(x)$ when $x$ has type $A$, then the lambda abstraction $\lambda (x:A) . b$ has the dependent function type $\Pi(x:A) . B(x)$.

### Application Rule
$$
\frac{\Gamma \vdash f : \Pi(x:A)\,.\,B \quad \Gamma \vdash a: A}{\Gamma \vdash f \ a : [x \mapsto a]B}
$$

This rule governs how to apply a dependent function. If $f$ is a function of dependent type $\Pi(x:A) . B(x)$ and $a$ is a term of type $A$, then applying $f$ to $a$ gives a result of type $B(a)$.

### Beta-Reduction Rule

$$
\frac{\Gamma \vdash a: A \quad \Gamma ,x:A \vdash B: \mathcal{U} \quad \Gamma ,x:A \vdash b : B}{\Gamma \vdash (\lambda (x:A)\,.\,b)\ a \equiv [x\mapsto a] b : \Pi (x:A) \,.\, B}
$$
This rule is a version of beta-reduction for dependent types. It states that applying a lambda abstraction to an argument results in substituting the argument for the bound variable in the body of the lambda expression. 

$$
\frac{\Gamma, x : A \vdash B : \mathcal{U}}{\Gamma \vdash \Lambda (x : A) \,.\, B : \Pi (x : A) \,.\, \mathcal{U}}
$$

### Subtyping in Dependent Functions

$$
\frac{
\begin{array}{c}
\Gamma, x: A_1 \vdash B_1 : \mathcal{U} \quad \Gamma, y: A_2 \vdash B_2 : \mathcal{U} \\
\Gamma \vdash A_1 >: A_2 \quad \Gamma,\, x: A_1,\, y: A_2 \vdash B_1 <: B_2
\end{array}
}{
\Gamma \vdash \Pi (x: A_1) \,.\, B_1 <: \Pi (x: A_2) \,.\, B_2
}
$$

## Examples

#### Dependent identity function

The dependent identity function takes a type `A` as an argument and returns a function that takes a value of type `A` and returns it:

```scala
forall(A: 'Type) -> (A -> A)
```

This can be written in Saki using symbolic notation:

```scala
Π(A: 'Type) -> (A -> A)
```

or

```scala
∀(A: 'Type) -> (A -> A)
```

This type describes a polymorphic identity function that works for any type `A`.

An example implementation of this function could be:

```scala
|A: 'Type| => |x: A| => x
```

Here, `A` is a type, and `x` is a value of type `A`, which is returned unchanged. The function type is `Π(A: 'Type) -> (A -> A)`.

#### Vector length function

Suppose we define a vector type where the length of the vector is encoded in its type. The type of a vector of length `n` over elements of type `A` might be written as `Vector(A, n)`. A function that returns the length of such a vector can be written as:

```scala
∀(A: 'Type) -> ∀(n: ℕ) -> Vector(A, n) -> ℕ
```

This function takes a type `A`, a natural number `n`, and a vector of type `Vector(A, n)`, and returns the length of the vector (which is `n`).

An example implementation might look like:

```scala
|A: 'Type, n: ℕ, v: Vector(A, n)|: ℕ => n
```

#### Function that depends on a value

Consider a function that returns a type based on the input value. For instance, a function that returns `Bool` if the input is positive and `ℕ` otherwise:

```scala
∀(n: ℤ) -> (if n > 0 then Bool else ℕ)
```

This is an example of a dependent type where the return type varies depending on the value of the input. The function could be implemented as:

```scala
|n: ℤ| => if n > 0 then true else 0
```

The return type is `Bool` if `n > 0`, and `ℕ` (represented as 0 here) otherwise. The type of this function is a dependent function type.

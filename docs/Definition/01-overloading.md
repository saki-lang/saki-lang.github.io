# Function Overloading

In **Saki**, function overloading is introduced by leveraging a new type construct called the **superposition type** ($A \oplus B$), which allows a single function to operate over multiple input types, providing different behaviors based on the types of arguments passed to the function. This generalizes traditional function overloading, often found in programming languages, into the type-theoretic framework of **Martin-Löf Type Theory (MLTT)**. The superposition type formalizes this behavior, ensuring that function overloading is type-safe and rigorous, enabling polymorphism at the type level.

## Superposition Types

The **superposition type** $A \oplus B$ encapsulates the ability of a function to accept multiple types as input and return different types depending on the context of the application. Unlike a **sum type** ($A \sqcup B$), which restricts a term to belong to either $A$ or $B$, the superposition type dynamically resolves the term’s type based on the argument passed, making it applicable multiple times for different types.

For example, if a function can handle both integer and string types, its type would be expressed as $Int \oplus String$, meaning that the function can accept either type, and the appropriate behavior will be applied based on the argument.

### Typing Rules for Superposition Types

The rules for superposition types enable the safe typing and application of overloaded functions in the type system. These rules are as follows:

1. **Term Typing for Superposition Types**:

$$
\frac{\Gamma \vdash t: A \quad \Delta \vdash t: B}{\Gamma, \Delta \vdash t: A \oplus B}
$$

If a term $t$ can be typed as both $A$ in context $\Gamma$ and $B$ in context $\Delta$, then $t$ can be assigned the superposition type $A \oplus B$ in the combined context $\Gamma, \Delta$. This allows the function to behave polymorphically, with its type determined by the argument.

2. **Function Overloading with Superposition**:

$$
\frac{\Gamma \vdash t: A \rightarrow B \quad \Delta \vdash t: A \rightarrow C}{\Gamma, \Delta \vdash t: A \rightarrow (B \oplus C)}
$$

This rule allows a function to have multiple return types based on the context of its application. The function `t` can return either `B` in context $\Gamma$ or `C$ in context $\Delta$, and the final type is resolved as $B \oplus C$ depending on the argument.

3. **Function Application for Overloaded Functions**:

$$
\frac{\Gamma \vdash f: (A \rightarrow B) \oplus (C \rightarrow D) \quad \Gamma \vdash t: A}{\Gamma \vdash f\ t: B}
$$

This rule governs the application of overloaded functions. If a function `f` has a superposition type $(A \rightarrow B) \oplus (C \rightarrow D)$, applying it to an argument of type `A` resolves the function to return type `B`.

4. **Subtyping for Superposition Types**:

$$
(A \sqcup B) <: (A \oplus B)
$$

This rule states that a sum type $A \sqcup B$, which represents an exclusive choice between `A` and `B`, is a subtype of the corresponding superposition type $A \oplus B$. Superposition types provide more flexibility, allowing the function’s behavior to be dynamically resolved based on the context.

## Example of Function Overloading with Superposition

Consider the following example where a function `f` can take either an integer or a string as input and perform different operations:

```scala
def f(x: Int): Int = x + 1
def f(x: String): String = x + "!"
```

In **Saki**, this behavior would be captured by a superposition type:

```scala
f: (Int -> Int) ⊕ (String -> String)
```

When called with an integer, `f(5)` returns `6`; when called with a string, `f("Hello")` returns `"Hello!"`.

### Overloading via `let-in` Expressions

The **`let-in` expression** in Saki can also incorporate superposition types, allowing for function overloading in local contexts. The general form of the `let-in` expression is:

$$
\text{let } x = t_1 \text{ in } t_2
$$

If `t_1` has a superposition type, the variable `x` inherits this type, and the body `t_2` must handle each possible type that `x` may take on.

#### Typing Rule for Overloaded `let-in`

$$
\frac{\Gamma \vdash t_1 : A \oplus C \quad \Gamma, x:A \vdash t_2 : B \quad \Gamma, x:C \vdash t_2 : D}{\Gamma \vdash \text{let } x = t_1 \text{ in } t_2 : B \oplus D}
$$

In this case:

- $t_1$ has the superposition type $A \oplus C$.
- $t_2$ is well-typed under both contexts $\Gamma, x:A$ and $\Gamma, x:C$, producing types $B$ and $D$.
- The resulting type of the `let-in` expression is $B \oplus D$, reflecting the dynamic resolution based on the branch of the superposition.

#### Function Overloading in Context

In **Saki**, overloaded functions may operate on different types, but their behavior and return type must be well-typed in each case. For example, consider the following overloaded function `g`:

```scala
def g(x: Int): String = "The number is " + x.toString
def g(x: Bool): String = if x then "True" else "False"
```

The type of `g` would be:

```scala
g: (Int -> String) ⊕ (Bool -> String)
```

When `g` is applied to an integer, it returns a string representing the number; when applied to a boolean, it returns `"True"` or `"False"`.


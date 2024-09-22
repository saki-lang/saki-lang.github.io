## Definitions

In **Saki**, a **definition** is used to introduce named functions, constants, or operators within the type system. Definitions allow for explicit type annotations, parameter bindings, and a function body. The definition syntax is designed to handle **explicit** and **implicit** parameter lists, allowing for greater flexibility when defining generic, polymorphic functions.

### Syntax of Definitions

The syntax for defining functions or operators in Saki is structured as follows:

```
ParamBindings ::= Ident+ ':' Term
ParamList     ::= ParamBindings (',' ParamBindings)*
Definition    ::= 'def' (Ident|OpIdent) ('[' ParamList ']')? ('(' ParamList ')')? '=' Term
```

- **ParamBindings**: Defines one or more parameters, where `Ident+` represents one or more parameter identifiers, and `Term` represents the type of the parameters.
- **ParamList**: A list of **ParamBindings**, separated by commas.
- **Definition**: Starts with the `def` keyword, followed by the function name (or operator), and can optionally include:
  - **Implicit Parameters** in square brackets (`[ParamList]`), typically used for type-level parameters or constraints.
  - **Explicit Parameters** in parentheses (`(ParamList)`), representing the values passed to the function.
  - The **function body**, which is the expression on the right-hand side of the `=` symbol that defines the behavior of the function.

### Components of Definitions

1. **Identifier**: The name of the function, constant, or operator. This can be a regular identifier or an operator (denoted as `OpIdent`).
   
2. **Implicit Parameters**: Parameters in square brackets (`[ ]`) are implicit, meaning they are typically inferred by the compiler during function application. These parameters are often used for **type parameters** or **contract constraints**. In Saki, these parameters are generally related to the type system and are inferred based on the arguments passed to the function.

3. **Explicit Parameters**: Parameters in parentheses (`( )`) are explicit, meaning they must be provided by the caller. These are the **values** or **expressions** passed to the function when it is invoked.

4. **Return Type**: The return type is specified after the parameter list and before the function body, indicating the type of the value returned by the function.

5. **Function Body**: The expression or series of expressions that define the actual behavior of the function.

### Typical Example of a Function Definition

Consider a simple definition for a `map` function that operates on a list:

```scala
def map[A: 'Type](list: List[A], transform: A -> A): List[A] = ...
```

- **`map`** is the function name.
- **`[A: 'Type]`** is the **implicit parameter list**:
  - `A` is a type parameter, constrained by `'Type`, meaning it can be any type in the universe of types.
  - The compiler infers the type `A` based on the type of the list passed to the function.
- **`(list: List[A], transform: A -> A)`** is the **explicit parameter list**:
  - `list` is a list of elements of type `A`.
  - `transform` is a function that takes a value of type `A` and returns a new value of type `A`.
- **`List[A]`** is the return type, indicating that the function returns a list of elements of type `A`.
- **`...`** represents the function body, which defines how the elements of the list are transformed by the `transform` function.

### Other Examples

1. **Implicit and Explicit Parameters**:

   In Saki, functions often have both implicit and explicit parameters. Implicit parameters allow for **generic** and **polymorphic** functions without needing to specify the type each time the function is called.

   For example:

   ```scala
   def identity[A: 'Type](x: A): A = x
   ```

   - The function `identity` takes a single value `x` of type `A` and returns `x`.
   - The type `A` is inferred from the argument passed to `identity`, so the user doesn't need to explicitly provide `A` when calling the function.

2. **Type Constraints in Definitions**:

   In Saki, **contract universes** can be used to impose constraints on the types of the parameters. For example, consider the following function that requires the type `A` to satisfy the `'Add` contract (i.e., it must support an `add` operation):

   ```scala
   def sum[A: 'Add](x: A, y: A): A = x.add(y)
   ```

   - The function `sum` takes two values `x` and `y` of type `A`.
   - The type `A` is constrained by the contract `'Add`, meaning that `A` must implement the `add` method.
   - The function returns the result of adding `x` and `y` using `A`'s `add` method.

3. **Operator Definitions**:

   Operators can be defined similarly to functions, using the same syntax. For example, a custom addition operator could be defined as follows:

   ```scala
   def (+)[A: 'Add](x: A, y: A): A = x.add(y)
   ```

   - The operator `+` is defined for any type `A` that satisfies the `'Add` contract.
   - This allows users to use `+` in the same way they would for built-in numeric types, but it applies to any type that defines an `add` method.

4. **Higher-Level Universe in Definition**

    Consider a function that multiplies a value by itself, where the type `A` is constrained by the `'Mul` contract universe:

    ```scala
    def square[R: 'Type, A: 'Mul(A, R)](self: A): R = self.mul(self)
    ```

    - **`square`** is the function name.
    - **`[R: 'Type, A: 'Mul(A, R)]`** are implicit parameters:
      - `R` is a type, and `A` is a type constrained by the `'Mul(A, R)` contract, meaning that `A` must implement a `mul` method that returns a value of type `R`.
    - **`(self: A)`** is the explicit parameter.
    - The return type is `R`, the result of multiplying `self` by itself using the `mul` method.

    This function is generic across any type `A` that supports multiplication, allowing it to work with numbers, matrices, or any other type that implements the `'Mul` contract.

### Function Overloading in Saki

In **Saki**, function overloading is introduced by leveraging a new type construct called the **superposition type** ($A \oplus B$), which allows a single function to operate over multiple input types, providing different behaviors based on the types of arguments passed to the function. This generalizes traditional function overloading, often found in programming languages, into the type-theoretic framework of **Martin-Löf Type Theory (MLTT)**. The superposition type formalizes this behavior, ensuring that function overloading is type-safe and rigorous, enabling polymorphism at the type level.

#### Superposition Types

The **superposition type** $A \oplus B$ encapsulates the ability of a function to accept multiple types as input and return different types depending on the context of the application. Unlike a **sum type** ($A \sqcup B$), which restricts a term to belong to either $A$ or $B$, the superposition type dynamically resolves the term’s type based on the argument passed, making it applicable multiple times for different types.

For example, if a function can handle both integer and string types, its type would be expressed as $Int \oplus String$, meaning that the function can accept either type, and the appropriate behavior will be applied based on the argument.

#### Typing Rules for Superposition Types

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

#### Example of Function Overloading with Superposition

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

#### Overloading via `let-in` Expressions

The **`let-in` expression** in Saki can also incorporate superposition types, allowing for function overloading in local contexts. The general form of the `let-in` expression is:

$$
\text{let } x = t_1 \text{ in } t_2
$$

If `t_1` has a superposition type, the variable `x` inherits this type, and the body `t_2` must handle each possible type that `x` may take on.

**Typing Rule for Overloaded `let-in`**:

1. **Basic `let-in` with Superposition**:

$$
\frac{\Gamma \vdash t_1 : A \oplus C \quad \Gamma, x:A \vdash t_2 : B \quad \Gamma, x:C \vdash t_2 : D}{\Gamma \vdash \text{let } x = t_1 \text{ in } t_2 : B \oplus D}
$$

In this case:
- `t_1` has the superposition type `A \oplus C`.
- `t_2` is well-typed under both contexts $\Gamma, x:A$ and $\Gamma, x:C$, producing types `B` and `D`.
- The resulting type of the `let-in` expression is `B \oplus D`, reflecting the dynamic resolution based on the branch of the superposition.

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


### Function Type Terms

#### Syntax

The syntax of function types in Saki follows the common notation used in functional programming and type theory. A function type is composed of a domain and codomain, separated by an arrow (`->`). Formally, this is expressed as:

```
FuncType    ::= Term "->" Term
```

Here, `A -> B` represents the type of a function that takes an argument of the first type (`A`) and returns a value of the second type (`B`). This notation generalizes higher-order functions, where both the input and output can themselves be functions, and extends naturally to the lambda calculus formulation of functions.

#### Typing Rules

The basic typing rule for functions follows from the lambda calculus. For a function term $\lambda (x: T_1) . t$ that takes an argument $x$ of type $T_1$ and returns a result $t$ of type $T_2$, the corresponding typing rule is:
$$
\frac{\Gamma, x: T_1 \vdash t: T_2}{\Gamma \vdash \lambda (x: T_1) \,.\, t : T_1 \rightarrow T_2}
$$

This states that: Given a context $\Gamma$ and assuming that $x$ is a variable of type $T_1$, if the term $t$ has type $T_2$, then the lambda abstraction $\lambda (x: T_1) . t$ (a function taking $x$ as an argument) has the type $T_1 \rightarrow T_2$.

#### Subtyping Relationship

Subtyping in function types adheres to the principles of ***contravariance*** for the argument types and ***covariance*** for the return types. This is formally captured by the subtyping rule for function types:
$$
\frac{\Gamma \vdash A_1 >: B_1 \quad A_2 <: B_2}{\Gamma \vdash A_1 \rightarrow A_2 <: B_1 \rightarrow B_2}
$$

- **Contravariance in the argument:** If $A_1$ is a supertype of $B_1$ ($A_1 >: B_1$), then we can safely replace $B_1$ with $A_1$ in the function's input position, meaning that $A_1 \rightarrow A_2$ is a subtype of $B_1 \rightarrow A_2$.
- **Covariance in the return:** If $A_2$ is a subtype of $B_2$ ($A_2 <: B_2$), then the result type can safely be replaced with a more general type, preserving the function's output.

#### Examples

1. **Simple function type:**

   ```
   ℕ -> ℕ
   ```

   This denotes a function that takes a natural number (`ℕ`) as input and returns a natural number. For example:

   ```
   |x: ℕ| => x + 1
   ```

   The above lambda expression is a function that adds 1 to its argument. Its type is `ℕ -> ℕ`.

2. **Higher-order function type:**

   ```
   (ℕ -> ℕ) -> ℕ
   ```

   This type describes a function that takes another function from `ℕ` to `ℕ` as input and returns a natural number. An example function could be one that applies its function argument twice:

   ```
   |f: ℕ -> ℕ| => f(f(0))
   ```

   This function takes a function `f`, applies it twice to the value 0, and returns the result. Its type is `(ℕ -> ℕ) -> ℕ`.

3. **Contravariance and covariance in function types:**

   Consider a scenario where we have two subtypes:
   - `Int <: Real` (integers are a subtype of real numbers).
   
   Then, for functions, the following relationship holds:

   ```
   Real -> Real <: Int -> Int
   ```

   A function that maps real numbers to real numbers can be safely used in place of a function that maps integers to integers. This is because the more general function can handle a broader range of inputs and still return the required type.
# Saki-Lang
> [!WARNING]
> This project is currently in active elaboration and development, with significant progress yet to be made before it is ready for use.

## Keywords and Identifiers

### Keywords

Saki supports following keywords:

| Keyword              | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| `import`             | Module import                                                |
| `pub`                | Public modifier                                              |
| `def`                | Function definition                                          |
| `impl`               | Implementation block                                         |
| `operator`           | Operator declaration                                         |
| `prefix`             | Prefix modifier (unary operator)                             |
| `postfix`            | Postfix modifier (unary operator)                            |
| `left-assoc`         | Left association modifier (binary operator)                  |
| `right-assoc`        | Right association modifier (binary operator)                 |
| `tighter-than`       | Precedence partial-order modifier (binary operator)          |
| `looser-than`        | Precedence partial-order modifier (binary operator)          |
| `same-as`            | Precedence partial-order modifier (binary operator)          |
| `let`                | Let binding                                                  |
| `instance`           | Instance value                                               |
| `enum`               | Enum type (Algebraic Data Type)                              |
| `record`             | Record type                                                  |
| `universe`           | Universe                                                     |
| `self`               | Self instance                                                |
| `Self`               | Self type                                                    |
| `this`               | Current subject (such as recursive access in anonymous function) |
| `forall` / `Π` / `∀` | Forall / dependent pi type                                   |
| `exists` / `Σ` / `∃` | Exists / dependent sigma type                                |
| `if`                 | If-expression                                                |
| `then`               | Then branch in if-expression                                 |
| `else`               | Else branch in if-expression                                 |
| `match`              | Match-expression                                             |
| `case`               | Case clause in match-expression                              |

### Identifiers

|    Universe     |                          Identifier                          |             Example              |                    Description                    |
| :-------------: | :----------------------------------------------------------: | :------------------------------: | :-----------------------------------------------: |
|        -        | `camelCaseWithEnglishOrGreekLetters` / `withOptionalPostfixSingleQuotation'` | `value`, `α`, `παράδειγμα`, `n'` |                      Values                       |
| $\mathcal{U}_0$ |   `PascalCaseInEnglish` / A single blackboard bold letter    |            `Nat`, `ℕ`            |                       Types                       |
| $\mathcal{U}_1$ |          `'PascalCaseWithAPrefixedSingleQuotation`           |       `'Type`, `'Runnable`       |                Contract universes                 |
| $\mathcal{U}_2$ |                         `#Universe`                          |           `#Universe`            | The universe that all contract universes lives in |
| $\mathcal{U_n}$ |                     `'Type_n` / `'Typeₙ`                     |       `'Type_3`, `'Type₃`        |              Higher-level universes               |

## Terms

### Basic Subtype Relationship

In type theory, subtyping formalizes a notion of substitutability between types, where a term of one type can be used in any context where a term of another (super)type is expected. The subtyping relation, written as \(T_1 <: T_2\), expresses that type \(T_1\) is a subtype of \(T_2\), meaning that every term of type \(T_1\) can be safely used where a term of type \(T_2\) is required.

#### Reflexivity of Subtyping

The first rule expresses the **reflexivity** of subtyping:
$$
\begin{align}
\begin{array}{c}
\\\hline
T <: T
\end{array}
\end{align}
$$
This states that any type \(T\) is trivially a subtype of itself. Reflexivity is a foundational property ensuring that a type can always be substituted for itself.

#### Transitivity of Subtyping

The second rule describes the **transitivity** of the subtyping relation:
$$
\begin{align}
\begin{array}{c}
\Gamma \vdash T_1 <: T_2 \quad \Gamma \vdash T_2 <: T_3
\\\hline
\Gamma \vdash T_1 <: T_3
\end{array}
\end{align}
$$
In words, if \(T_1\) is a subtype of \(T_2\) and \(T_2\) is a subtype of \(T_3\), then \(T_1\) is also a subtype of \(T_3\). 

### Primitive Terms

| Name             | Type            | Super Type           |                      Set Representation                      |
| ---------------- | --------------- | -------------------- | :----------------------------------------------------------: |
| Nothing (Bottom) | `Nothing`       | -                    |                         $\emptyset$                          |
| Unit (Top)       | `Unit`          | -                    |                           $\{e\}$                            |
| Boolean          | `Bool` / `𝔹`    | -                    |                         $\mathbb{B}$                         |
| Byte             | `Byte`          | -                    |            $\{x \mid [0, 255] \cup \mathbb{N} \}$            |
| Natural Number   | `Nat` / `ℕ`     | -                    |                         $\mathbb{N}$                         |
| Integer          | `Int` / `ℤ`     | `Nat`                |                         $\mathbb{Z}$                         |
| Real Number      | `Float` / `ℝ`   | `Nat`, `Int`         |                         $\mathbb{R}$                         |
| Complex Number   | `Complex` / `ℂ` | `Nat`, `Int`, `Real` |                         $\mathbb{C}$                         |
| Char             | `Char`          | -                    |                   $U$ (Unicode characters)                   |
| String           | `String`        | -                    | $\{ s \in U^* \mid s = c_1c_2\dots c_n, \, n \in \mathbb{N}\}$ |

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
\begin{align}
\begin{array}{c}
\Gamma, x: T_1 \vdash t: T_2
\\\hline
\Gamma \vdash \lambda (x: T_1) . t : T_1 \rightarrow T_2
\end{array}
\end{align}
$$

This states that: Given a context $\Gamma$ and assuming that $x$ is a variable of type $T_1$, if the term $t$ has type $T_2$, then the lambda abstraction $\lambda (x: T_1) . t$ (a function taking $x$ as an argument) has the type $T_1 \rightarrow T_2$.

#### Subtyping Relationship

Subtyping in function types adheres to the principles of ***contravariance*** for the argument types and ***covariance*** for the return types. This is formally captured by the subtyping rule for function types:
$$
\begin{align}
\begin{array}{c}
\Gamma\vdash A_1 >: B_1 \quad A_2 <: B_2 
\\\hline
\Gamma\vdash A_1 \rightarrow A_2 <: B_1 \rightarrow B_2
\end{array}
\end{align}
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

### Dependent Type Terms

Dependent types generalize function types by allowing the result type to depend on the input value. This capability enables richer type systems where the type returned by a function can vary based on its argument.

#### Syntax

Dependent types are expressed in terms of $\Pi$-types (Pi-types), which describe functions where the return type is dependent on the actual input value. The syntax for dependent function types in Saki is:

```
PiTypeSymbol    ::= ‘forall’ | ‘Π’ | ‘∀’
DepFuncType     ::= PiTypeSymbol ‘(’ Ident ‘:’ Term ‘)’ ‘->’ Term
```

This can be read as: for all $x$ of type $A$, the type of the result is $B(x)$, where $B(x)$ may depend on the actual value of $x$.

#### Typing Rules

##### Formation Rule
The $\Pi$-type is formed when the return type is dependent on the input value. The rule for forming a dependent function type is:
$$
\begin{align}
\begin{array}{c}
\Gamma ,x:A \vdash B: \mathcal{U}
\\\hline
\Gamma\vdash \Pi (x:A) \,.\, B: \mathcal{U}
\end{array}
\end{align}
$$
This rule means that if the return type $B(x)$ is well-formed in the universe $\mathcal{U}$ when $x$ has type $A$, then the dependent function type $\Pi(x:A) . B(x)$ is also well-formed in the universe.

##### Introduction Rule
$$
\begin{align}
\begin{array}{c}
\Gamma ,x:A \vdash B: \mathcal{U} \quad \Gamma ,x:A \vdash b : B
\\\hline
\Gamma\vdash \lambda (x:A)\,.\,b : \Pi (x:A) \,.\, B
\end{array}
\end{align}
$$
This rule means that if $b$ is a term of type $B(x)$ when $x$ has type $A$, then the lambda abstraction $\lambda (x:A) . b$ has the dependent function type $\Pi(x:A) . B(x)$.

##### Application Rule
$$
\begin{align}
\begin{array}{c}
\Gamma \vdash f : \Pi(x:A)\,.\,B \quad \Gamma \vdash a: A
\\\hline
\Gamma\vdash f \ a : [x \mapsto a]B
\end{array}
\end{align}
$$

This rule governs how to apply a dependent function. If $f$ is a function of dependent type $\Pi(x:A) . B(x)$ and $a$ is a term of type $A$, then applying $f$ to $a$ gives a result of type $B(a)$.

##### Beta-Reduction Rule

$$
\begin{align}
\begin{array}{c}
\Gamma\vdash a: A \quad \Gamma ,x:A \vdash B: \mathcal{U} \quad \Gamma ,x:A \vdash b : B
\\\hline
\Gamma\vdash (\lambda (x:A)\,.\,b)\ a \equiv [x\mapsto a] b : \Pi (x:A) \,.\, B
\end{array}
\end{align}
$$
This rule is a version of beta-reduction for dependent types. It states that applying a lambda abstraction to an argument results in substituting the argument for the bound variable in the body of the lambda expression. 

$$
\begin{align}
\begin{array}{c}
\Gamma, x : A \vdash B : \mathcal{U}
\\ \hline
\Gamma \vdash \Lambda (x : A) \,.\, B : \Pi (x : A) \,.\, \mathcal{U}
\end{array}
\end{align}
$$

##### Subtyping in Dependent Functions

$$
\begin{align}
\begin{array}{c}
\Gamma, x: A_1 \vdash B_1 : \mathcal{U} \quad \Gamma, y: A_2 \vdash B_2 : \mathcal{U} \\ \Gamma \vdash A_1 >: A_2 \quad \Gamma,\, x: A_1,\, y: A_2 \vdash B_1 <: B_2
\\\hline
\Gamma \vdash \Pi (x: A_1) \,.\, B_1 <: \Pi (x: A_2) \,.\, B_2
\end{array}
\end{align}
$$

#### Examples

1. **Dependent identity function:**

   The dependent identity function takes a type `A` as an argument and returns a function that takes a value of type `A` and returns it:

   ```
   forall(A: 'Type) -> (A -> A)
   ```

   This can be written in Saki using symbolic notation:

   ```
   Π(A: 'Type) -> (A -> A)
   ```

   or

   ```
   ∀(A: 'Type) -> (A -> A)
   ```

   This type describes a polymorphic identity function that works for any type `A`.

   An example implementation of this function could be:

   ```
   |A: 'Type| => |x: A| => x
   ```

   Here, `A` is a type, and `x` is a value of type `A`, which is returned unchanged. The function type is `Π(A: 'Type) -> (A -> A)`.

2. **Vector length function:**

   Suppose we define a vector type where the length of the vector is encoded in its type. The type of a vector of length `n` over elements of type `A` might be written as `Vector(A, n)`. A function that returns the length of such a vector can be written as:

   ```
   ∀(A: 'Type) -> ∀(n: ℕ) -> Vector(A, n) -> ℕ
   ```

   This function takes a type `A`, a natural number `n`, and a vector of type `Vector(A, n)`, and returns the length of the vector (which is `n`).

   An example implementation might look like:

   ```
   |A: 'Type, n: ℕ, v: Vector(A, n)|: ℕ => n
   ```

3. **Function that depends on a value:**

   Consider a function that returns a type based on the input value. For instance, a function that returns `Bool` if the input is positive and `ℕ` otherwise:

   ```
   forall(n: ℤ) -> (if n > 0 then Bool else ℕ)
   ```

   This is an example of a dependent type where the return type varies depending on the value of the input. The function could be implemented as:

   ```
   |n: ℤ| => if n > 0 then true else 0
   ```

   The return type is `Bool` if `n > 0`, and `ℕ` (represented as 0 here) otherwise. The type of this function is a dependent function type.

### Function (Lambda) Terms

In Saki, lambda expressions are essential constructs that allow for the creation of anonymous functions in a concise manner. Functions in Saki are **automatically curried**, which means a function with multiple arguments is treated as a series of functions, each taking one argument and returning another function. This makes function application more flexible and allows partial application of functions.

The syntax for lambda expressions in Saki is structured as follows:

```
ParamBinding    ::= ‘self’ 
                  | Ident+ ‘:’ Term
ParamList       ::= ParamBinding (‘,’ ParamBinding)*
FuncTerm        ::= ‘|’ ParamList ‘|’ ‘=>’ Term
```
- **`ParamBinding`:** A `ParamBinding` represents a list of parameters to the function, which can either be one or more simple identifier (`Ident`) paired with a type (`Term`), or the special keyword `self` which refers to the current instance in `impl` contexts.
  
- **`ParamList`:** A comma-separated list of parameters, each defined as a `ParamBinding`, encapsulated within vertical bars (`|`). This indicates the arguments that the lambda function will accept.
  
- **`FuncTerm`:** After the parameters are specified, the function body follows an arrow symbol (`=>`), which expresses the transformation or operation performed on the parameters.

#### Examples

1. **Basic Lambda Expression:**
   
   The simplest lambda expression might define a function that takes an integer and returns its successor:

   ```
   |x: ℤ|: ℤ => x + 1
   ```

   This lambda function takes a single argument `x` of type `ℤ` (integer) and returns the result of `x + 1`. The type annotation `: ℤ` after the parameter list and before the arrow specifies the return type of the function, which is also `ℤ`.

2. **Lambda Expression with Block Syntax**:

   ```
   |x: ℤ|: ℤ => { return x + 1 }
   ```

   In this example, the body of the lambda function is enclosed in curly braces and uses an explicit `return` statement. The explicit use of braces allows for more complex logic in the function body, though in this case, it performs the same operation as the previous example.

3. **Multiple Parameters**:

   ```
   |x y: ℤ|: ℤ => x + y
   ```

   This lambda expression takes two integers, `x` and `y`, and returns their sum. The type of this lambda expression is:

   ```
   ℤ -> ℤ -> ℤ
   ```

   Since functions are **curried** in Saki, this means the lambda takes an argument of type `ℤ` and returns a new function that also takes an argument of type `ℤ` and returns an `ℤ`. Curried functions enable partial application, meaning that this function can be applied to one argument at a time.

4. **Lambda as an Argument**:

   Suppose we have the following function definition:

   ```
   def map(transform: ℤ -> ℤ, list: List[ℤ]): List[ℤ] = { ... }
   ```

   This function applies a transformation to each element of a list of integers. The type of `map` is:

   ```
   (ℤ -> ℤ) -> List[ℤ] -> List[ℤ]
   ```

   Since functions are curried, `map` can take a single argument (the transformation function of type `ℤ -> ℤ`) and return another function that expects a list of integers (`List[ℤ]`) and returns a transformed list (`List[ℤ]`).

   An example of using `map` with a lambda expression:

   ```
   map (|x| => x + 1) list
   ```

   Here, the lambda `|x| => x + 1` is passed as the `transform` argument. The type of the lambda is `ℤ -> ℤ`, and the application of `map` returns a new function that accepts a `List[ℤ]` and returns a transformed `List[ℤ]`.

5. **Partial Application of Curried Functions**:

   Since functions are curried, we can partially apply them. Consider the following example:

   ```
   let incrementAll = map |x: ℤ| => x + 1
   ```

   The function `incrementAll` is a result of partially applying the `map` function with the lambda `|x: ℤ| => x + 1`. The type of `incrementAll` is:

   ```
   List[ℤ] -> List[ℤ]
   ```

   This means `incrementAll` is now a function that takes a list of integers and returns a list of integers where each element has been incremented by 1.

#### Omitting Type Annotations in Lambda Expressions

In Saki, when lambda expressions are passed as arguments to a function, the type annotations of the parameters and the return type can often be omitted if the types can be inferred from context. This results in more concise code without losing type safety.

Consider the same `map` function:

```
def map(transform: ℤ -> ℤ, list: List[ℤ]): List[ℤ] = { ... }
```

Here’s how you can call `map` with a lambda, omitting the type annotations:

```
map (|x| => x + 1) list
```

In this case, the type of the lambda `|x| => x + 1` is inferred from the signature of `map` as `ℤ -> ℤ`. The type system can deduce the type of `x` to be `ℤ`, and thus there's no need to explicitly annotate it.

#### Syntactic Sugar for Lambda Expressions

Saki allows for further syntactic simplifications when lambda expressions are passed as the **last argument** to a function. In these cases, you can omit the parentheses around the lambda and even the arrow (`=>`) symbol:

Consider the same `map` function, but now we pass the lambda as the last argument:

```
def map(list: List[ℤ], transform: ℤ -> ℤ): List[ℤ] = { ... }
```

Here’s how you can invoke `map` using syntactic sugar:

```
map list |x| { x + 1 }
```

In this example:
- The parentheses around the lambda are omitted.
- The `=>` symbol is omitted, but the braces `{}` around the function body remain, indicating the lambda body.

The type of this lambda remains the same:

```
ℤ -> ℤ
```

#### More Complex Examples and Their Types

1. **Lambda Returning Another Lambda (Curried Function):**

   In Saki, because functions are curried by default, you can have lambda expressions that return other lambda expressions. Consider the following example, which defines a curried multiplication function:

   ```
   let multiply = |x: ℤ| => |y: ℤ| => x * y
   ```

   The type of `multiply` is:

   ```
   ℤ -> ℤ -> ℤ
   ```

   This function takes an integer `x` and returns a new function that takes another integer `y` and returns the product `x * y`. You can partially apply this function:

   ```
   let double = multiply 2
   ```

   The type of `double` is:

   ```
   ℤ -> ℤ
   ```

   Now, `double` is a function that multiplies any given integer by 2.

2. **Lambda as Return Type:**

   Consider a lambda that takes a value and returns a function that always returns that value (a constant function):

   ```
   let constant = |x: ℤ| => |y: ℤ| => x
   ```

   The type of `constant` is:

   ```
   ℤ -> ℤ -> ℤ
   ```

   This lambda takes an integer `x` and returns a function that ignores its input and always returns `x`. For example:

   ```
   let alwaysFive = constant 5
   ```

   The type of `alwaysFive` is:

   ```
   ℤ -> ℤ
   ```

   Now, `alwaysFive` is a function that ignores its argument and always returns `5`.

3. **Using Lambdas in Higher-Order Functions:**

   Consider a `filter` function that takes a predicate (a function that returns a boolean) and a list, returning a list of elements that satisfy the predicate:

   ```
   def filter(predicate: ℤ -> Bool, list: List[ℤ]): List[ℤ] = { ... }
   ```

   The type of `filter` is:

   ```
   (ℤ -> Bool) -> List[ℤ] -> List[ℤ]
   ```

   To use `filter`, we can pass a lambda to filter out negative numbers:

   ```
   filter (|x| => x > 0) list
   ```

   The lambda `|x| => x > 0` has the type `ℤ -> Bool`, and the result of `filter` will be a new list containing only the positive integers from the original `list`.

### Sum Type Terms

#### Syntax

### Sum Type Terms

Sum types (also known as disjoint union types or variant types) are one of the key constructs in type theory for expressing a choice between different types. A sum type allows a value to be one of several distinct types. 

#### Syntax

In **Saki**, sum types are written using the vertical bar (`|`) symbol to denote a disjoint union between two or more types:

```
SumTypeTerm     ::= Term ‘|’ Term
```

This means that a value of type `A | B` can be either a value of type `A` or a value of type `B`. The sum type is closed and disjoint, meaning the value must belong to one of the specified types and not both simultaneously. This is distinct from intersection types where values must belong to all specified types.

#### Typing Rules for Sum Types

In formal terms, the behavior of sum types is governed by subtyping relationships. The typing rules for sum types ensure that they can participate in subtyping relationships in a way that preserves soundness and flexibility.

##### Subtyping Rule for Sum Types (Covariant)

The following rule describes subtyping for sum types in the covariant case:

$$
\begin{align}
\begin{array}{c}
\forall i \,.\, \exists j \,.\, (\Gamma \vdash A_i <: B_j)
\\\hline
\Gamma \vdash \bigsqcup_i A_i <: \bigsqcup_j B_j
\end{array}
\end{align}
$$

This rule asserts that if for every component type \(A_i\) in the sum type \(\bigsqcup_i A_i\), there exists a corresponding type \(B_j\) in the sum type \(\bigsqcup_j B_j\), and \(A_i\) is a subtype of \(B_j\), then the sum of all \(A_i\) is a subtype of the sum of all \(B_j\). This reflects the **covariance** of sum types, meaning that they preserve subtyping relationships when their component types are related by subtyping.

##### Subtyping Rule for Sum Types (Contravariant)

There is also a corresponding rule for contravariant subtyping of sum types, where the direction of the subtyping relationship is reversed:

$$
\begin{align}
\begin{array}{c}
\Gamma \vdash \forall i \,.\, \exists j \,.\, (A_i >: B_j)
\\\hline
\Gamma \vdash \bigsqcup_i A_i >: \bigsqcup_j B_j
\end{array}
\end{align}
$$

This means that if for every component type \(A_i\) in the sum type \(\bigsqcup_i A_i\), there exists a corresponding type \(B_j\) in the sum type \(\bigsqcup_j B_j\), and \(A_i\) is a **supertype** of \(B_j\), then the sum of all \(A_i\) is a **supertype** of the sum of all \(B_j\). This rule reflects the **contravariant** nature of certain contexts, such as function parameters, where subtypes behave in the opposite direction.


#### Intuition Behind the Typing Rules

The subtyping rules for sum types are based on the notion of type containment and choice. A sum type \(A | B\) is essentially saying that a value belongs to **either** \(A\) or \(B\), but not both at the same time. Therefore:

- **Covariance** (first rule) applies when the subtypes on the left-hand side can be safely used as substitutes for the types on the right-hand side. This occurs when the sum type's components are subtypes of the corresponding components in the supertype sum.
- **Contravariance** (second rule) works in the opposite direction, often in contexts where the sum type appears as a function argument. In such cases, the supertype on the left-hand side can safely be used where the subtype on the right-hand side is expected.

#### Examples of Sum Types

1. **Basic Sum Type**:

   Consider a sum type representing a value that can either be an integer (`ℤ`) or a string:

   ```
   ℤ | String
   ```

   The type `ℤ | String` means that a value of this type can either be an integer or a string. For example, the following are valid values of type `ℤ | String`:

   ```
   42 : ℤ | String
   "Hello" : ℤ | String
   ```

2. **Sum Type with Subtyping**:

   Now, assume that `ℕ` is a subtype of `ℤ` (natural numbers are a subtype of integers). If we define a sum type:

   ```
   ℕ | String
   ```

   Based on the subtyping rule for sum types, we can infer that:

   ```
   ℕ | String <: ℤ | String
   ```

   This follows the first rule (covariant subtyping), where `ℕ <: ℤ`. Therefore, a sum type that contains `ℕ` as one of its components is a subtype of a sum type containing `ℤ` in the corresponding position.

3. **Covariance in Function Return Types**:

   Sum types often appear as return types in functions. For example, consider a function that either returns an integer or an error message (represented as a string):

   ```
   def resultFunction(): ℤ | String = { ... }
   ```

   The return type of this function is `ℤ | String`, indicating that it can return either an integer (successful result) or a string (error message). Since `ℕ <: ℤ`, if this function were modified to return `ℕ | String`, it would still be a valid subtype:

   ```
   def resultFunction(): ℕ | String = { ... }
   ```

   This works because of the covariance in the sum type, allowing a subtype (`ℕ`) to be returned where a supertype (`ℤ`) is expected.

4. **Sum Types in Pattern Matching**:

   Sum types are particularly useful in pattern matching scenarios. Suppose we define a type representing either a boolean or an integer:

   ```
   Bool | ℤ
   ```

   In a function, we can pattern match on this sum type:

   ```
   def handleValue(value: Bool | ℤ): String = match value {
       case true => "It is true!"
       case false => "It is false!"
       case n: ℤ => "It is the integer: ${n}"
   }
   ```

   Here, the type `Bool | ℤ` allows the function to accept either a boolean or an integer, and we can handle each case appropriately using pattern matching.

### Record Terms

Record terms in **Saki** represent structured data types that aggregate multiple named fields, each of which is associated with a specific type. They are similar to records or structs in other programming languages, providing a way to group related data under one composite type. The flexibility of records, along with the ability to organize fields with shared types concisely, makes them useful for modeling a wide variety of data structures.

#### Syntax

The syntax for defining a record type in Saki is as follows:

```
FieldBinding ::= Ident+ ':' Term
RecordTerm   ::= 'record' '{' FieldBinding ((NL+|',') FieldBinding)* '}'
```

- **FieldBinding:** The field declaration in a record, consisting of one or more field names (`Ident+`) followed by a colon (`:`) and the type (`Term`). The `Ident+` syntax indicates that multiple fields can share the same type, simplifying the declaration of records with fields of identical types.
  
- **RecordTerm:** The entire record type definition. The `record` keyword introduces the record, followed by a block `{}` containing one or more field declarations (`FieldBinding`). Field declarations can be separated by either newlines (`NL`) or commas.

#### Typing Rules

The formal typing rules for records in Saki specify how to type both the record term and the field access. The rules ensure that the types of fields are consistent with the declared record structure.

1. **Typing a Record Term:**

   The typing rule for constructing a record is given as:

   $$
   \frac{\Gamma \vdash \overline{t_i : T_i}^i}{\Gamma \vdash \{ \overline{l_i = t_i}^i \} : \{ \overline{l_i : T_i}^i \}}
   $$

   This rule means that if each field `t_i` has type `T_i` in the typing context $\Gamma$, then the record `{ l_i = t_i }` is of type `{ l_i : T_i }`. In other words, if all fields are well-typed according to their declarations, the entire record is well-typed.

2. **Typing Field Access:**

   The rule for accessing a field from a record is as follows:

   $$
   \frac{\Gamma \vdash t: \{ \overline{l_i : T_i}^i \}}{\Gamma \vdash t.f_i : T_i}
   $$

   This rule means that if a term `t` is a record with a field `f_i` of type `T_i`, then accessing the field `t.f_i` results in a value of type `T_i`. The field access operation is type-safe because it guarantees that the type of the field matches its declaration in the record.

3. **Record Subtyping:**

   Saki supports **structural subtyping** for records, meaning that a record with more fields can be a subtype of a record with fewer fields if the shared fields have matching types. This is formalized as:

   $$
   \forall S \,.\, \forall (S' \subseteq S) \,.\, \{\overline{l_i : T_i}^{i \in S}\} <: \{\overline{l_i : T_i}^{i \in S'}\}
   $$

   This rule states that a record type with fields indexed by `S` is a subtype of a record type with fields indexed by `S'` if `S'` is a subset of `S`. This allows for flexibility when passing records to functions that only need to access a subset of the fields.

#### Examples

1. **Basic Record Declaration:**

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

2. **Nested Records and Higher-Level Universes:**

   ```
   record {  
       name: String
       birthDate: record {
           day month year: ℕ
       }
   }
   ```
   
   Here, the `birthDate` field is a nested record with fields for `day`, `month`, and `year`, all of type `ℕ`. 
   
3. **Field Assignments for Record Values:**

   Record terms not only define types but also support **value instantiation**. A record value can be created using field assignments. The syntax for record values is:

   ```
   FieldAssignment   ::= Ident (‘:’ Term)? ‘=’ Term
   RecordValueTerm   ::= (Term | 'record') ‘^’ ‘{’ (FieldAssignment ((NL+|‘,’) FieldAssignment)*)? ‘}’
   ```

   - **FieldAssignment:** A field value assignment uses the `Ident = Term` syntax, where `Ident` is the field name and `Term` is the value assigned to that field.
   - **RecordValueTerm:** The value instantiation uses the `Term ^ { ... }` syntax, where `Term` refers to the record type, and the braces `{}` enclose field assignments. In addition, anonymous record values are represented by `record ^ { ... }` syntax.

   Consider the following example of creating a `Point` record:

   ```
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

4. **Using Record Subtyping:**

   Suppose you have a function that operates on a subset of the fields in a record. Using Saki’s structural subtyping, you can pass records with extra fields to functions that only expect a subset. For example:

   ```
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

#### Higher-Level Universes in Record Fields

Saki’s type system is based on **Martin-Löf Type Theory (MLTT)**, which supports **universes** — hierarchical levels of types, where types themselves can belong to higher universes. This feature allows for **contracts**, **dependent types**, and **abstract types** to be embedded in records. Fields in records can be drawn from higher-level universes, allowing complex interactions between fields while preserving type safety. 

##### Examples of Higher-Level Universes in Records

1. **Contract Universes in Records:**

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

2. **Dependent Types in Records:**

   Records can contain fields whose types depend on the values of other fields. For instance, consider a record that stores a vector and its size, where the size field determines the length of the vector:

   ```scala
   record {
       size: ℕ
       elements: Vector(ℝ, size)
   }
   ```

   - `size` is a natural number representing the length of the vector.
   - `elements` is a vector of real numbers, where the size of the vector is determined by the `size` field.

3. **Recursive Records with Higher-Level Universes:**

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

4. **Abstract Operations in Records:**

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

5. **Complex Example: A Physics Model with Higher-Level Universes**

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



### Inductive Types

**Inductive types** are essential in type theory and functional programming for defining algebraic data structures. In **Saki**, they are introduced similarly to the **Calculus of Inductive Constructions (CIC)**, allowing the definition of recursive data structures, proof types, and logical propositions. 

#### Syntax of Inductive Types

The general form for defining inductive types in Saki is:

```
InductiveField    ::= Ident ‘:’ Term
InductiveTypeTerm ::= ‘inductive’ (‘(’ Term (’,’ Term)* ‘)’)? ‘{’ InductiveField (NL+ InductiveField)* ‘}’
```

The syntax includes:
- **InductiveField**: Represents the name and type of each constructor of the inductive type.
- **InductiveTypeTerm**: Begins with the `inductive` keyword, optionally followed by type parameters. The constructor fields are enclosed within `{}`.

The parameters listed after the `inductive` keyword represent the **arity** of the inductive type. Since the ultimate part of the arity in Saki is always `'Type`, we do not explicitly write it. This mirrors the arity definition in CIC, where inductive types can take parameters but always return a value in the universe of types (`Type`). For example, in Saki, `inductive(A)` corresponds to an arity of `A -> 'Type`.

#### General Form of Inductive Types

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

#### Examples of Inductive Types

1. **Option Type:**

   The `Option` type represents a value that can either be `Some` (containing a value) or `None` (representing absence of a value). In Saki, it is defined as:

   ```scala
   def Option(A: 'Type): 'Type = inductive {
       None : this        // `this` refers to the inductive type being defined, `Option(A)`
       Some : A -> this   // Constructor Some takes a value of type `A` and returns an Option
   }
   ```

   - `Option(A)` has the type `'Type -> 'Type`, which corresponds to an inductive type in CIC where the arity is `'Type`.
   - The `None` constructor returns `Option(A)`, and the `Some` constructor takes a value of type `A` and returns `Option(A)`.


2. **Equality Type:**

   In dependent type theory, **propositional equality** (also known as Leibniz equality) is defined as an inductive type that asserts that two terms are equal. In Saki, it can be defined as follows:

   ```scala
   def Eq(A: 'Type, x: A): A -> 'Type = inductive(A) {
       EqRefl: this(x)   // `this(x)` is the same as `Eq(A, x, x)`
   }
   ```

   - The `Eq` inductive type has arity `A -> A -> 'Type`.
   - The constructor `EqRefl` provides a proof that `x` is equal to itself (`this(x)`), which is equivalent to `Eq(A, x, x)`.


3. **Natural Number Ordering (Leq):**

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

4. **Binary Trees with Constraints:**

   Using **contract universes**, Saki can define inductive types with constraints, such as a binary search tree where nodes satisfy a comparison constraint:

   ```scala
   universe 'GreaterThan(A: 'Type) = contract {
       require gt(self, A: 'Type): Bool
   }

   def Tree[A: 'GreaterThan(A)]: 'Type = inductive {
       Leaf : this
       Node : A -> Tree[A] -> Tree[A] -> this
   }
   ```

   - The `Tree` inductive type represents a binary tree structure where the values stored in the nodes satisfy the `GreaterThan` constraint.
   - `Leaf` represents an empty tree.
   - `Node` represents a tree node containing a value of type `A` and two subtrees.

5. **Mutually Recursive Types:**

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

#### Inductive Constructor Access

In Saki, the constructors of inductive types can be accessed using the `::` operator. For example:

```
Option(Nat)::Some
```

This refers to the `Some` constructor of the `Option(Nat)` inductive type.

#### Pattern Matching on Inductive Types

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



### Algebraic Datatype Terms

**Algebraic Data Types (ADTs)** are a special class of inductive types that are essential in functional programming and type theory. They are used to define composite types by combining other types using **sum types** (also known as **variants**) and **product types**. ADTs are particularly useful for modeling data that can take multiple distinct forms, and they are foundational in expressing complex structures such as trees, lists, and option types. In **Saki**, ADTs are defined using the `enum` keyword and can be parameterized by types and type classes, with the ability to incorporate contract universes for constrained types.

#### Syntax of Algebraic Data Types in Saki

The syntax for defining ADTs in Saki follows a straightforward pattern:

```
EnumCons     ::= Ident (‘(’ Term (‘,’ Term)* ‘)’)?
EnumTypeTerm ::= ‘data’ ‘{’ EnumCons (‘,’ EnumCons)* ‘}’
```

- **EnumCons**: Represents each constructor of the algebraic datatype. A constructor can either be a simple identifier (like `None`) or an identifier with parameters (like `Some(A)`).
- **EnumTypeTerm**: The ADT is introduced using the `data` keyword, followed by a list of constructors enclosed in braces `{}`. Multiple constructors can be defined, separated by commas.

Each constructor defines a specific form that a value of the ADT can take, either as a simple tag or as a combination of different types. ADTs in Saki resemble **sum types** in type theory, where each constructor defines a possible variant of the type.

#### Examples of Algebraic Data Types in Saki

1. **Option Type:**

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

2. **Color Type:**

   The `Color` type represents an ADT with no parameters. It has two possible values: `Red` and `Black`.

   ```scala
   type Color = enum {
       Red
       Black
   }
   ```

   This is a simple ADT with no type parameters, where each constructor (`Red` and `Black`) is a distinct value of the `Color` type. This is an example of a basic sum type with two possible values.

3. **RB-Tree Type:**

   In Saki, algebraic data types can be parameterized by both types and contract universes. This allows the definition of types like binary trees with additional constraints on the values stored in the tree nodes. Here’s an example of a RB-tree where the values must satisfy the `'GreaterThan` contract, which ensures that the values can be compared.

   ```scala
   universe 'GreaterThan(A: 'Type) = contract {
       require gt(self, A: 'Type): Bool
   }
   
   type Tree[A: 'GreaterThan(A)] = enum {
       Leaf
       Node(Color, A, Tree[A], Tree[A])
   }
   ```

   - **Leaf**: Represents an empty tree.
   - **Node**: Represents a tree node containing a `Color`, a value of type `A`, and two subtrees (`Tree[A]`).

   In this example:
   - `Tree[A]` is parameterized by a type `A` that must satisfy the `'GreaterThan` contract, ensuring that `A` supports a comparison operation (`gt`).
   - The `Node` constructor takes four parameters: a `Color`, a value of type `A`, and two subtrees of type `Tree[A]`. This models a binary search tree where each node is either `Red` or `Black` (as defined by the `Color` type).

   **Constructors:**
   - `Leaf: Tree[A]`
   - `Node: Color -> A -> Tree[A] -> Tree[A] -> Tree[A]`

   This definition mirrors the concept of **algebraic data structures** like binary search trees in languages such as **Haskell** or **OCaml**, but adds the flexibility of enforcing additional constraints via contracts like `'GreaterThan(A)`.

#### Type-Theoretic Foundation of Algebraic Data Types

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



### Contract Universe Terms

In **Saki**, universes are used to organize types into hierarchies, particularly when dealing with **contract universes**, which enforce certain behaviors or constraints on types. A **universe** in Saki is essentially a type whose elements are themselves types, constrained by certain contracts or predicates. This design closely aligns with **Martin-Löf Type Theory (MLTT)**, where universes are structured collections of types that satisfy specific conditions. Contract universes in Saki allow types to declare behaviors through contracts, enforcing rules and conditions on how types interact.

#### Universe Structure and Predicates

In **MLTT**, a universe $\mathcal{U}_P$ is the collection of all types `T` that satisfy a given predicate `P(T)`. In Saki, this idea extends to **contract universes**, where types belong to universes by fulfilling contracts. These contracts specify behaviors (like implementing certain methods), which serve as predicates for inclusion in the universe.

For instance, consider the following contract universe in Saki:

```scala
universe 'Printable = contract {
    require print(self): String
}
```

- The **`'Printable`** universe contains all types that satisfy the contract by implementing a `print` method that returns a `String`.

The relationship between types and the universe $\mathcal{U}_P$ can be expressed as follows:

$$
T : \mathcal{U}_P \iff P(T)
$$

Where `P(T)` is a predicate that holds for a type `T`, meaning `T` satisfies the contract (or conditions) required by `P`.

#### Typing Rules for Universes

The typing rule for contract universes ensures that types are included in the universe only if they satisfy the required contract. In Saki, this is reflected in the following general typing rule:

$$
\frac{\Gamma \vdash T : \mathcal{U} \quad P(T)}{\Gamma \vdash T : \mathcal{U}_P}
$$

This rule states that:

- If a type `T` belongs to a base universe `\mathcal{U}` and satisfies the predicate `P(T)` (such as implementing required contract methods), then `T` belongs to the universe $\mathcal{U}_P`, where $P$ represents the contract.

#### Universe Hierarchy and Subtyping

Saki employs a **hierarchical universe system** similar to that of **MLTT**, where universes can be ordered by subtyping. One universe is a **subtype** of another if every type in the first universe satisfies the conditions of the second. This hierarchy is based on the predicates enforced by each universe.

For instance, consider the following two contract universes:

```scala
universe 'Add = contract {
    require add(lhs: Self, rhs: Self): String
}

universe 'Mul(A: 'Type, R: 'Type) = contract {
    require mul(self, other: A): R
}
```

- The `'Add` universe includes all types that implement an `add` method, while the `'Mul` universe contains types that implement a `mul` method for multiplication.

The **subtyping relation** between universes can be expressed as:

$$
\mathcal{U}_{P_1} <: \mathcal{U}_{P_2} \iff \forall T \,.\, (T : \mathcal{U}_{P_1} \implies T : \mathcal{U}_{P_2})
$$

This means that a universe $\mathcal{U}_{P_1}$ is a subtype of another universe $\mathcal{U}_{P_2}$ if every type in $\mathcal{U}_{P_1}$ also satisfies the predicate $P_2$. In other words, if a type satisfies the conditions of universe $P_1$, it must also satisfy the conditions of universe $P_2$.

#### Subtyping Properties in Universes

The subtyping relation between universes follows several important properties, ensuring consistency in the hierarchy:

1. **Reflexivity**:
   Every universe is a subtype of itself:
   $$
   \mathcal{U}_P <: \mathcal{U}_P
   $$
   This holds because $P(T) \implies P(T)$ for any predicate $P$.

2. **Antisymmetry**:
   If two universes $\mathcal{U}_{P_1}$ and $\mathcal{U}_{P_2}$ are mutually subtypes of each other, they are equal:
   $$
   (\mathcal{U}_{P_1} <: \mathcal{U}_{P_2} \land \mathcal{U}_{P_2} <: \mathcal{U}_{P_1}) \implies \mathcal{U}_{P_1} = \mathcal{U}_{P_2}
   $$

3. **Transitivity**:
   If universe $\mathcal{U}_{P_1}$ is a subtype of $\mathcal{U}_{P_2}$, and $\mathcal{U}_{P_2}$ is a subtype of $\mathcal{U}_{P_3}$, then $\mathcal{U}_{P_1}$ is a subtype of $\mathcal{U}_{P_3}$:
   $$
   (\mathcal{U}_{P_1} <: \mathcal{U}_{P_2} \land \mathcal{U}_{P_2} <: \mathcal{U}_{P_3}) \implies \mathcal{U}_{P_1} <: \mathcal{U}_{P_3}
   $$

#### Dependent Universes

In **Saki**, universes can also be **dependent types**, where the universe's constraints (predicates) depend on a parameter. For example, in the contract universe `'Mul`, the multiplication contract depends on two parameters, `A` and `R`, where `A` is the type being multiplied and `R` is the result type:

```scala
universe 'Mul(A: 'Type, R: 'Type) = contract {
    require mul(self, other: A): R
}
```

This can be formalized as a **dependent universe**:

$$
\Pi_{R:\mathcal{U}_1}. \Pi_{A: \mathcal{U}_0} \,.\, (A \rightarrow R)
$$

Here, the universe for types satisfying the multiplication contract is dependent on the types `A` and `R`.

#### Contract Universe Binding

Just like types and values, contract universes in Saki can be bound to a `let` expression. For example:

```scala
let 'Mul: 'Type -> 'Type -> #Universe = |A: 'Type, R: 'Type| {
    return contract {
        decl mul(self, other: A): R
    }
}
```

In this case:

- The `let` expression binds a contract universe `'Mul` to a type-level function.
- The contract ensures that any type belonging to this universe implements a `mul` function, with the input type `A` and the result type `R`.

#### Example: Defining Functions with Contract Universes

Once contract universes are defined, they can be used to enforce specific behaviors within functions. Consider the following example:

```scala
def square[R: 'Type, A: 'Mul(A, R)](self: A): R = self.mul(self)
```

- This function takes a value `self` of type `A` that belongs to the `'Mul` contract universe, meaning `A` must implement the `mul` method.
- The function returns `R`, the result of multiplying `self` by itself using the `mul` method.

### If Expression Terms

The **if-expression** in **Saki** provides a way to perform conditional branching, allowing a program to execute one of two expressions based on a boolean condition. Unlike some languages where control flow statements are separate from expressions, Saki’s **if-expression** integrates into the language's expression system, meaning that an **if-expression** always evaluates to a value.

#### Syntax

The syntax for an if-expression in Saki is:

```
IfExpr ::= 'if' Term 'then' Term 'else' Term
```

- **`if`**: Starts the conditional expression.
- **Condition** (`Term`): The first `Term` represents the condition. This must be of type `Bool`.
- **`then`**: If the condition evaluates to `true`, the expression following the `then` keyword is evaluated.
- **`else`**: If the condition evaluates to `false`, the expression following the `else` keyword is evaluated.

#### Typing Rules

The typing rule for an **if-expression** ensures that the result of the expression is type-consistent across both branches (`then` and `else`). Formally, the rule can be written as:

$$
\frac{\Gamma \vdash t_1: \mathbb{B} \quad \Gamma \vdash t_2: T \quad \Gamma \vdash t_3: T}{\Gamma \vdash \text{if } t_1 \text{ then } t_2 \text{ else } t_3 : T}
$$

This rule states that:
- The condition $t_1$ must have type `Bool` (denoted by $\mathbb{B}$).
- The `then` and `else` branches ($t_2$ and $t_3$) must both have the same type $T$ for the if-expression to be well-typed.

### Match Expression Terms

The **match-expression** in **Saki** is a powerful construct for pattern matching, similar to pattern matching in languages like **Haskell** or **ML**. It allows a value (usually of a record, inductive type or algebraic data type) to be deconstructed and matched against a set of patterns. The matched pattern determines which branch of the expression will be executed. Pattern matching is essential for working with algebraic data types and other complex structures.

#### Syntax

The syntax for a match-expression is:

```
MatchExpr  ::= 'match' Term '{' CaseClause+ '}'
CaseClause ::= 'case' Pattern '=>' Term
```

- **`match`**: Begins the match-expression.
- **Term**: The term being matched, often an algebraic data type or inductive type.
- **`with`**: Introduces the case clauses that follow.
- **`case`**: Defines each pattern to match.
- **Pattern**: The pattern to match against the term.
- **`=>`**: Separates the pattern from the corresponding expression to evaluate.

#### Typing Rules

The typing rule for match-expressions ensures that the matched patterns are exhaustive and that each branch returns the same type `T`:

$$
\frac{\Gamma \vdash t: T \quad \Gamma \vdash p_i: T \quad \Gamma \vdash e_i: R}{\Gamma \vdash \text{match } t \ \{ \ p_1 \Rightarrow e_1 \mid \dots \mid p_n \Rightarrow e_n \ \} : R}
$$

This means that:
- The term being matched (`t`) must have type `T`.
- Each pattern `p_i` must match against the type `T`.
- The expression `e_i` associated with each pattern must have the same result type `R`.
- The patterns must be exhaustive, meaning that all possible forms of the term are covered by the patterns.

#### Examples

1. **Pattern Matching on Algebraic Data Types:**

   Consider the `Option` type:

   ```scala
   def getValue[A](opt: Option[A], default: A): A = match opt with {
       case Option[A]::Some(x) => x
       case Option[A]::None => default
   }
   ```

   - This function takes an `Option[A]` and a default value.
   - If the option is `Some(x)`, it returns `x`; if it is `None`, it returns the default value.

3. **Exhaustive Matching:**

   Match expressions must cover all possible cases for the type being matched. For example, when matching on `Bool`:

   ```scala
   def toInt(b: Bool): ℤ = match b with {
       case true => 1
       case false => 0
   }
   ```

   - This function converts a `Bool` value to an integer.
   - Both possible values (`true` and `false`) are covered, making the pattern match exhaustive.





## Definitions

### Function Overloading

To introduce **function overloading** into **Martin-Löf Type Theory (MLTT)**, we define a new type construct, the **superposition type** ($\oplus$), to handle scenarios where a single function can take multiple types depending on the types of its inputs. Superposition types generalize the notion of function overloading, which is prevalent in programming languages but lacks formal representation in traditional type theory. The addition of superposition types enables polymorphism where the type of a function and its return value can vary depending on the input types, without violating the rigor of type theory.

#### Superposition Types

The **superposition type** $A \oplus B$ captures the behavior of a function that can operate over multiple types simultaneously. Unlike sum types ($A \sqcup B$), which denote a disjoint union of types where a term belongs to either $A$ or $B$, a superposition type allows a term to be dynamically resolved depending on the argument type. This is akin to the concept of a quantum superposition, where the state collapses based on interaction (or, in this case, application of arguments). However, unlike a quantum measurement, superposition types can be applied multiple times.

The following **typing rules** describe how terms of superposition type behave, allowing function overloading to be formalized in MLTT.

#### Typing Rules for Superposition

1. **Term Typing for Superposition Types**:
$$
   \frac{\Gamma \vdash t: A \quad \Delta \vdash t: B}{\Gamma, \Delta \vdash t: A \oplus B}
$$
   This rule asserts that if a term $t$ can be typed as $A$ in context $\Gamma$ and as $B$ in context $\Delta$, then $t$ can be assigned the type $A \oplus B$ under the combined context $\Gamma, \Delta$. The term $t$ now behaves polymorphically, resolving to $A$ or $B$ based on the input.

2. **Function Overloading with Superposition**:
$$
   \frac{\Gamma \vdash t: A \rightarrow B \quad \Delta \vdash t: A \rightarrow C}{\Gamma, \Delta \vdash t: A \rightarrow (B \oplus C)}
$$
   This rule allows the function $t$ to have different return types based on the context of its application. In context $\Gamma$, $t$ behaves as $A \rightarrow B$, while in context $\Delta$, it behaves as $A \rightarrow C$. Thus, the return type is $B \oplus C$, allowing the function to be overloaded depending on the argument type.

3. **Application of Overloaded Functions**:
$$
   \frac{\Gamma \vdash f: (A \rightarrow B) \oplus (C \rightarrow D) \quad \Gamma \vdash t: A}{\Gamma \vdash f\ t: B}
$$
   This rule governs the application of overloaded functions. If a function $f$ has the superposition type $(A \rightarrow B) \oplus (C \rightarrow D)$, and it is applied to an argument $t$ of type $A$, the result will be of type $B$. This resolves the superposition at application time, depending on the input type.

4. **Subtyping for Superposition Types**:
$$
   (A \sqcup B) <: (A \oplus B)
$$
   A sum type $A \sqcup B$, representing an exclusive choice between $A$ and $B$, is a subtype of the corresponding superposition type $A \oplus B$, which captures a more flexible relationship, where the final type is determined by the context.

#### Overloading via `let-in` Expressions

We extend the **`let-in` expression** in MLTT to incorporate function overloading using superposition types. The general form of the `let-in` expression is:
$$
\text{let } x = t_1 \text{ in } t_2
$$
Where:
- $x$ is bound to the term $t_1$,
- $t_2$ is the body in which $x$ is used.

If $t_1$ has a superposition type, the variable $x$ inherits this type, and the body $t_2$ must be typed accordingly for each branch of the superposition.

#### Typing Rule for Overloaded `let-in`

1. **Basic `let-in` with Superposition**:
$$
   \frac{\Gamma \vdash t_1 : A \oplus C \quad \Gamma, x:A \vdash t_2 : B \quad \Gamma, x:C \vdash t_2 : D}{\Gamma \vdash \text{let } x = t_1 \text{ in } t_2 : B \oplus D}
$$
   This rule formalizes the `let-in` construct with superposition:
   - $t_1$ has a superposition type $A \oplus C$,
   - $t_2$ must be well-typed under both contexts $\Gamma, x:A$ and $\Gamma, x:C$, producing the types $B$ and $D$, respectively.
   - The resulting type of the `let-in` expression is $B \oplus D$, reflecting the type resolution based on the specific branch of the superposition.

2. **Application of Overloaded Functions in `let-in`**:
$$
   \frac{\Gamma \vdash t_1 : (A \rightarrow B) \oplus (C \rightarrow D) \quad \Gamma, x:A \vdash t_2 : E \quad \Gamma, x:C \vdash t_2 : F}{\Gamma \vdash \text{let } x = t_1 \text{ in } t_2 : E \oplus F}
$$
   This rule extends the `let-in` expression to handle **function application** with overloading:
   - $t_1$ is an overloaded function with the superposition type $(A \rightarrow B) \oplus (C \rightarrow D)$,
   - The body $t_2$, which applies the function $x$, must be typed under both $\Gamma, x:A$ and $\Gamma, x:C$, producing the types $E$ and $F$, respectively.
   - The resulting type of the `let-in` expression is $E \oplus F$, reflecting the fact that function overloading has occurred, and the type depends on which branch of the superposition is invoked.

### Handling Function Overloading

Function overloading in MLTT is thus formalized by introducing **superposition types** that enable a single function to take on multiple types, depending on the input type. Superposition types generalize the notion of function overloading found in practical programming languages, ensuring that overloaded terms are well-typed under all possible contexts while preserving the consistency of the type system.

For example, consider an overloaded function $f$ with the type:
$$
f : (A \rightarrow B) \oplus (C \rightarrow D)
$$
This superposition type reflects that $f$ can either behave as a function from $A$ to $B$ or from $C$ to $D$. The specific behavior of $f$ depends on the type of argument passed during function application. When applied to an argument of type $A$, the function resolves to a type $B$; similarly, when applied to an argument of type $C$, it resolves to a type $D$.



## Function Elimination (Application) and Function Overloading
$$
\begin{align}
\begin{array}{c}
\Gamma \vdash f: A \rightarrow B \quad \Gamma \vdash t: A
\\\hline
\Gamma \vdash f\ t: B
\end{array}
\end{align}
$$
Overloaded version:
$$
\begin{align}
\begin{array}{c}
\Gamma \vdash f: (A \rightarrow B) \oplus (C \rightarrow D) \quad \Gamma \vdash t: A
\\\hline
\Gamma \vdash f\ t: B
\end{array}
\end{align}
$$

```scala
type Cat = record {
    name: String
    age: Nat
}

def eat(cat: Cat, food: String) = {
    println("Cat ${cat.name} is eating ${food}")
}

let cat = Cat^ {
    name = "alice"
    age = 5
}
```

These four kinds of application are identical:

```
eat cat "fish"
eat(cat, fish)
cat.eat "fish"
cat.eat("fish")
```



## Decorator

```
def debug[T R: 'Type](func: T -> R): T -> R = {
    return |arg: T|: R => {
        println("argument: ${arg}")
        return func(arg)
    } 
}

#[debug]
def write(content: List[Byte]) = {
    // ...
}
```






## Example

```rust
universe 'GreaterThan(A: 'Type) = contract {
    require gt(self, A: 'Type): Bool
}

type Option(A: 'Type) = enum {
    None
    Some(A)
}

type Color = enum {
    Red
    Black
}

type Tree[A: 'GreaterThan(A)] = enum {
    Leaf
    Node(Color, A, Tree[A], Tree[A])
}

impl [A: 'GreaterThan(A)] Tree[A] {
    def balance(self): Self = match self {
        case Self::Node(
            Color::Black, valueRight, 
            Self::Node(
                  Color::Red, valueTop, 
                  Self::Node(Color::Red, valueLeft, leftLeft, leftRight), 
                rightLeft
              ), rightRight
        ) | Self::Node(
            Color::Black, valueRight, 
            Self::Node(
                  Color::Red, valueLeft, 
                  leftLeft, 
                  Self::Node(Color::Red, valueTop, leftRight, rightLeft)
              ), rightRight
        ) | Self::Node(
            Color::Black, valueLeft, 
            leftLeft, 
            Self::Node(
                  Color::Red, valueRight, 
                  Self::Node(Color::Red, valueTop, leftRight, rightLeft), 
                  rightRight
              ),
        ) | Self::Node(
            Color::Black, valueLeft, 
            leftLeft, 
            Self::Node(
                  Color::Red, valueTop, 
                  leftRight, 
                  Self::Node(Color::Red, valueRight, rightLeft, rightRight),
            ),
        ) => Self::Node(
            Color::Red, valueTop, 
            Self::Node(Color::Black, valueLeft, leftLeft, leftRight),
            Self::Node(Color::Black, valueRight, rightLeft, rightRight),
        )
        case node: Self => node
    }

    def insert(self, newValue: A): Self = match self {
        case Self::Leaf => Self::Node(Color::Red, newValue, Self::Leaf, Self::Leaf)
        case Self::Node(color, value, left, right) => if newValue < value then {
            Self::Node(color, value, left.insert(value), right)
        } else if value < newValue then {
            Self::Node(color, value, left, right.insert(value))
        } else {
            Self::Node(color, newValue, left, right)
        }
    }

    def find(self, value: A): Option(A) = match self {
        case Self::Leaf => Option(A)::None
        case Self::Node(color, value, left, right) => if newValue < value then {
            left.find(value)
        } else if value < newValue then {
            right.find(value)
        } else {
            Option(A)::Some(value)
        }
    }
}
```




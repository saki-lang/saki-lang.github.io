# Ad-Hoc Polymorphism (Overloading)

<script type="module" src="/javascripts/editor.js"></script>
<link rel="stylesheet" href="/static/styles.css">

In **Saki**, function overloading is introduced by leveraging a new type construct called the **superposition type** ($A \oplus B$), which allows a single function to operate over multiple input types, providing different behaviors based on the types of arguments passed to the function. This generalizes traditional function overloading, often found in programming languages, into the type-theoretic framework of **Martin-Löf Type Theory (MLTT)**. The superposition type formalizes this behavior, ensuring that function overloading is type-safe and rigorous, enabling polymorphism at the type level.

## Superposition Types

The **superposition type** $A \oplus B$ encapsulates the ability of a function to accept multiple types as input and return different types depending on the context of the application. Unlike a **sum type** ($A \sqcup B$), which restricts a term to belong to either $A$ or $B$, the superposition type dynamically resolves the term’s type based on the argument passed, making it applicable multiple times for different types.

For example, if a function can handle both integer and string types, its type would be expressed as $Int \oplus String$, meaning that the function can accept either type, and the appropriate behavior will be applied based on the argument.

### Typing Rules for Superposition Types

The rules for superposition types enable the safe typing and application of overloaded functions in the type system. These rules are as follows:

#### Term Typing for Superposition Types

$$
\frac{\Gamma \vdash t: A \quad \Delta \vdash t: B}{\Gamma, \Delta \vdash t: A \oplus B}
$$

If a term $t$ can be typed as both $A$ in context $\Gamma$ and $B$ in context $\Delta$, then $t$ can be assigned the superposition type $A \oplus B$ in the combined context $\Gamma, \Delta$. This allows the function to behave polymorphically, with its type determined by the argument.

#### Function Overloading with Superposition

$$
\frac{\Gamma \vdash t: A \rightarrow B \quad \Delta \vdash t: A \rightarrow C}{\Gamma, \Delta \vdash t: A \rightarrow (B \oplus C)}
$$

This rule allows a function to have multiple return types based on the context of its application. The function `t` can return either `B` in context $\Gamma$ or $C$ in context $\Delta$, and the final type is resolved as $B \oplus C$ depending on the argument.

#### Function Application for Overloaded Functions

$$
\frac{\Gamma \vdash f: (A \rightarrow B) \oplus (C \rightarrow D) \quad \Gamma \vdash t: A}{\Gamma \vdash f\ t: B}
$$

This rule governs the application of overloaded functions. If a function `f` has a superposition type $(A \rightarrow B) \oplus (C \rightarrow D)$, applying it to an argument of type `A` resolves the function to return type `B`.

#### Subtyping for Superposition Types

$$
(A \sqcap B) \leq (A \oplus B)
$$

The superposition type $A \oplus B$ is a subtype of the intersection type $A \sqcap B$.
This rule comes from the property of an intersection type:

$$
(A_1 \to B_1) \sqcap (A_2 \to B_2) \equiv (A_1 \sqcup A_2) \to (B_1 \sqcap B_2)
$$

A superposition type $(A_1 \to B_1) \sqcap (A_2 \to B_2)$ yields $B_1$ when applied to $A_1$ and $B_2$ when applied to $A_2$. The input type satisfies $A_1 \geq A_1 \sqcup A_2$ and $A_2 \geq A_1 \sqcup A_2$, and the output type satisfies $B_1 \leq B_1 \sqcap B_2$ and $B_2 \leq B_1 \sqcap B_2$.
And because the covariance of the input type and the contravariance of the output type:

$$
\begin{align}
\begin{array}{c}
\Gamma \vdash A_1 \geq B_1 \quad A_2 \leq B_2
\\\hline
\Gamma \vdash A_1 \rightarrow A_2 \leq B_1 \rightarrow B_2
\end{array}
\end{align}
$$

Thus, the superposition type is considered as a subtype of the intersection type.

## Function Application with Overloading

When functions are **overloaded** via **superposition types**, the function's behavior is dependent on the type of the argument. The superposition type allows a function to operate on multiple types and dynamically resolve which version of the function to apply based on the argument’s type.

The typing rule for overloaded functions is:

$$
\frac{\Gamma \vdash f: (A \rightarrow B) \oplus (C \rightarrow D) \quad \Gamma \vdash t: A}{\Gamma \vdash f\ t: B}
$$

This rule means that if:
- `f` is an overloaded function with the type `(A → B) ⊕ (C → D)` in the context $\Gamma$,
- and `t` is an argument of type `A`,

then applying `f` to `t` will resolve the function to return a result of type `B`.

## Function Overloading with Identical Return Types

Consider the following overloaded function `describe`, which can take either an integer or a string:

<div class="code-editor">

```
def describe(x: Int): String = "The number is " + x.toString
def describe(x: String): String = "The string is \"" + x + "\""
```
</div>

The function `describe` has the following type:

$$
\text{describe}: (Int \to String) \oplus (String \to String)
$$

Which is identical to

$$
\text{describe}: (Int \oplus String) \to String
$$

When applying `describe`, the behavior depends on the argument type:

<div class="code-editor" id="code-overloading">

```
def describe(x: Int): String = "The number is " ++ x.toString
def describe(x: String): String = "The string is \"" ++ x ++ "\""
eval describe 114514     // Result: "The number is 114514"
eval describe "Saki"     // Result: "The string is "Saki""
```
</div>
<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-overloading', 'output-overloading')">Run Code</button>
</div>
<div class="output-container" id="output-overloading"></div>

In this case:

- When applied to an integer (`42`), the function returns a description of the number.
- When applied to a string (`"Saki"`), the function returns a description of the string.

### Overloaded Function with Different Return Types

Consider an overloaded function `concat` that operates on both numbers and strings, returning different types based on the argument type:

<div class="code-editor" id="code-overloading-diff-return">

```
def ceilDec(x: Int): Int = if x == 0 then 1 else 10 * ceilDec(x / 10)
def concat(a: Int, b: Int): Int = a * ceilDec(b) + b
def concat(x: String, y: String): String = x ++ y
eval concat
```
</div>
<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-overloading-diff-return', 'output-overloading-diff-return')">Run Code</button>
</div>
<div class="output-container" id="output-overloading-diff-return"></div>


The type of this function is:

$$
\text{concat}: (Int \to Int \to Int) ⊕ (String \to String \to String)
$$

Application:

<div class="code-editor" id="code-overloading-diff-return-invoke">

```
def ceilDec(x: Int): Int = if x == 0 then 1 else 10 * ceilDec(x / 10)
def concat(a: Int, b: Int): Int = a * ceilDec(b) + b
def concat(x: String, y: String): String = x ++ y

eval concat(123, 456)               // Result: 123456
eval concat("It's ", "mygo!!!!!")   // Result: "It's mygo!!!!!"
```
</div>
<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-overloading-diff-return-invoke', 'output-overloading-diff-return-invoke')">Run Code</button>
</div>
<div class="output-container" id="output-overloading-diff-return-invoke"></div>

Here, the overloaded function `concat`:

- Concatenates numbers when passed two integers using mathematical operations.
- Concatenates strings when passed two strings using built-in string concatenation.

### Currying with Overloaded Functions

Due to the nature of superposition types, overloaded functions are curried as well like regular functions. 
This allows for partial application and dynamic resolution of the function's behavior based on the arguments provided.

Consider the following example:

<div class="code-editor" id="code-overloading-curry">

```
def ceilDec(x: Int): Int = if x == 0 then 1 else 10 * ceilDec(x / 10)
def concat(a: Int, b: Int): Int = a * ceilDec(b) + b
def concat(x: String, y: String): String = x ++ y

eval concat 123
eval concat "Hello! "
```
</div>
<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-overloading-curry', 'output-overloading-curry')">Run Code</button>
</div>
<div class="output-container" id="output-overloading-curry"></div>

Here, `concat` can be partially applied to an integer or string, with its final behavior determined by the type of the subsequent argument. Specifically, applying an overloaded lambda to an argument invokes a selection process based on the argument’s type, identifying the corresponding function branch. This type-based selection mechanism is termed "**measurement**" of an overloaded lambda, analogous to quantum state measurement, where an indeterminate superposed state collapses into a definite outcome upon observation.

### Why Superposition Types?

Superposition types in **Saki** elegantly combine **function overloading** (ad-hoc polymorphism) with **currying**, overcoming challenges that typically arise when attempting to integrate these concepts in functional programming languages.

In many functional programming languages, **currying** and **function overloading** can clash. Currying, which allows functions to be partially applied, introduces ambiguity when combined with overloading. For instance, in a curried function, the compiler may struggle to determine which version of an overloaded function to apply based on partial arguments, leading to errors.

A typical example of this issue occurs in **Scala**, where the following code results in an **ambiguous overload** error:

<div class="code-editor">

```
def appendToString(s: String)(x: Int): String = s + x
def appendToString(s: String)(x: String): String = s + x
def test = appendToString("foo")
```
</div>

In this case, the compiler cannot decide whether to apply `appendToString("foo")(Int)` or `appendToString("foo")(String)`, because both are valid overloads. The argument `"foo"` is a `String`, but it could be followed by either an `Int` or a `String`, causing ambiguity.
However, **Saki** addresses this problem through **superposition types**. A superposition type, such as `A ⊕ B`, enables a function to handle multiple types dynamically and resolve overloading in a way that is both type-safe and flexible.
When **superposition types** are used in conjunction with **currying**, the function can accept and handle different argument types across different stages of application without ambiguity. In Saki, the curried function `appendToString` would look like this:

<div class="code-editor" id="code-overloading-ambiguous">

```
def appendToString(s: String, x: Int): String = s ++ x.toString
def appendToString(s: String, x: String): String = s ++ x
eval appendToString "foo"
```
</div>

<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-overloading-ambiguous', 'output-overloading-ambiguous')">Run Code</button>
</div>
<div class="output-container" id="output-overloading-ambiguous"></div>

Here, the superposition type ensures that the function can adapt its behavior based on the next argument type—whether it’s an `Int` or a `String`. The type of the partial application `appendToString("foo")` would be:

$$
(Int \to String) \oplus (String \to String)
$$

This means that **Saki**’s type system can resolve the correct overload dynamically based on the second argument’s type, thus avoiding the ambiguity.

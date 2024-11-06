# Sum Type

<script type="module" src="/javascripts/editor.js"></script>
<link rel="stylesheet" href="/static/styles.css">

Sum types (also known as disjoint union types or variant types) are one of the key constructs in type theory for expressing a choice between different types. A sum type allows a value to be one of several distinct types. 

## Syntax

In **Saki**, sum types are written using the vertical bar (`|`) symbol to denote a disjoint union between two or more types:

```
SumTypeTerm     ::= Term ‘|’ Term
```

This means that a value of type $(A \mid B)$ can be either a value of type $A$ or a value of type $B$. The sum type is closed and disjoint, meaning the value must belong to one of the specified types and not both simultaneously. This is distinct from intersection types where values must belong to all specified types.

## Typing Rules for Sum Types

In formal terms, the behavior of sum types is governed by subtyping relationships. The typing rules for sum types ensure that they can participate in subtyping relationships in a way that preserves soundness and flexibility.

### Subtyping Rule for Sum Types (Covariant)

The following rule describes subtyping for sum types in the covariant case:

$$
\frac{
\forall i \,.\, \exists j \,.\, (\Gamma \vdash A_i <: B_j)
}{
\Gamma \vdash \bigsqcup_i A_i <: \bigsqcup_j B_j
}
$$

This rule asserts that if for every component type $A_i$ in the sum type $\bigsqcup_i A_i$, there exists a corresponding type $B_j$ in the sum type $\bigsqcup_j B_j$, and $A_i$ is a subtype of $B_j$, then the sum of all $A_i$ is a subtype of the sum of all $B_j$. This reflects the **covariance** of sum types, meaning that they preserve subtyping relationships when their component types are related by subtyping.

### Subtyping Rule for Sum Types (Contravariant)

There is also a corresponding rule for contravariant subtyping of sum types, where the direction of the subtyping relationship is reversed:

$$
\frac{
\Gamma \vdash \forall i \,.\, \exists j \,.\, (A_i >: B_j)
}{
\Gamma \vdash \bigsqcup_i A_i >: \bigsqcup_j B_j
}
$$

This means that if for every component type $A_i$ in the sum type $\bigsqcup_i A_i$, there exists a corresponding type $B_j$ in the sum type $\bigsqcup_j B_j$, and $A_i$ is a **supertype** of $B_j$, then the sum of all $A_i$ is a **supertype** of the sum of all $B_j$. This rule reflects the **contravariant** nature of certain contexts, such as function parameters, where subtypes behave in the opposite direction.


## Intuition Behind the Typing Rules

The subtyping rules for sum types are based on the notion of type containment and choice. A sum type $A | B$ is essentially saying that a value belongs to **either** $A$ or $B$, but not both at the same time. Therefore:

- **Covariance** (first rule) applies when the subtypes on the left-hand side can be safely used as substitutes for the types on the right-hand side. This occurs when the sum type's components are subtypes of the corresponding components in the supertype sum.
- **Contravariance** (second rule) works in the opposite direction, often in contexts where the sum type appears as a function argument. In such cases, the supertype on the left-hand side can safely be used where the subtype on the right-hand side is expected.

## Examples of Sum Types

### Basic Sum Type

Consider a sum type representing a value that may either be an integer ($\mathbb{Z}$) or a string:

<div class="code-editor">

```
(ℤ | String)
```
</div>

The type $(ℤ \mid String)$ specifies that a value can either be an integer or a string. Valid values for this type include:

<div class="code-editor">

```
42 : (ℤ | String)
"Hello" : (ℤ | String)
```
</div>

### Sum Type with Subtyping

Suppose `Dog` is a subtype of `Animal`. If we define a sum type:

<div class="code-editor">

```
(Dog | String)
```
</div>

Using the covariant subtyping rule, we conclude:

<div class="code-editor">

```
(Animal | String) <: (Dog | String)
```
</div>

Since `Dog <: Animal`, the sum type containing `Dog` is a subtype of one containing `Animal` in the corresponding position.

### Covariance in Function Return Types

Sum types frequently appear as return types in functions. Consider a function that may return either a `Dog` instance or an error message (as a string):

<div class="code-editor">

```
def resultFunction(): (Dog | String) = { ... }
```
</div>

This function’s return type can also be expressed as `Animal | String` since `Dog <: Animal`. Replacing the return type with `Animal | String` is valid:

<div class="code-editor">

```
def resultFunction(): (Animal | String) = { ... }
```
</div>

Covariance permits the substitution of a subtype (`Dog`) for a supertype (`Animal`) in the return type.

### Sum Types in Pattern Matching

Sum types are particularly advantageous in pattern matching. For example, consider a type representing a boolean, an integer, or a string:

<div class="code-editor">

```
(Bool | ℤ | String)
```
</div>

In a function, we can match against this sum type:

<div class="code-editor" id="code-sum-pattern-matching">

```
def describeValue(value: (Bool | ℤ | String)): String = match value {
    case true => "It's true!"
    case false => "It's false!"
    case n: ℤ => "It's an integer: " ++ n.toString ++ "!"
    case s: String => "It's " ++ s ++ "!!!!!"
}

eval describeValue 2024     // Output: "It's an integer: 2024!"
eval describeValue true     // Output: "It's true!"
eval describeValue "mygo"   // Output: "It's mygo!!!!!"
```
</div>
<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-sum-pattern-matching', 'output-sum-pattern-matching')">Run Code</button>
</div>
<div class="result-editor" id="output-sum-pattern-matching"></div>

Here, the type $(Bool \mid ℤ \mid String)$ allows the function to process each type individually, and we can handle each case appropriately with pattern matching.
# Sum Type

## Syntax

# Sum Type Terms

Sum types (also known as disjoint union types or variant types) are one of the key constructs in type theory for expressing a choice between different types. A sum type allows a value to be one of several distinct types. 

## Syntax

In **Saki**, sum types are written using the vertical bar (`|`) symbol to denote a disjoint union between two or more types:

```
SumTypeTerm     ::= Term ‘|’ Term
```

This means that a value of type `A | B` can be either a value of type `A` or a value of type `B`. The sum type is closed and disjoint, meaning the value must belong to one of the specified types and not both simultaneously. This is distinct from intersection types where values must belong to all specified types.

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

Consider a sum type representing a value that can either be an integer (`ℤ`) or a string:

```
ℤ | String
```

The type `ℤ | String` means that a value of this type can either be an integer or a string. For example, the following are valid values of type `ℤ | String`:

```
42 : ℤ | String
"Hello" : ℤ | String
```

### Sum Type with Subtyping

Now, assume that `ℕ` is a subtype of `ℤ` (natural numbers are a subtype of integers). If we define a sum type:

```
ℕ | String
```

Based on the subtyping rule for sum types, we can infer that:

```
ℕ | String <: ℤ | String
```

This follows the first rule (covariant subtyping), where `ℕ <: ℤ`. Therefore, a sum type that contains `ℕ` as one of its components is a subtype of a sum type containing `ℤ` in the corresponding position.

### Covariance in Function Return Types

Sum types often appear as return types in functions. For example, consider a function that either returns an integer or an error message (represented as a string):

```
def resultFunction(): ℤ | String = { ... }
```

The return type of this function is `ℤ | String`, indicating that it can return either an integer (successful result) or a string (error message). Since `ℕ <: ℤ`, if this function were modified to return `ℕ | String`, it would still be a valid subtype:

```
def resultFunction(): ℕ | String = { ... }
```

This works because of the covariance in the sum type, allowing a subtype (`ℕ`) to be returned where a supertype (`ℤ`) is expected.

### Sum Types in Pattern Matching

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
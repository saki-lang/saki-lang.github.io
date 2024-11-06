# Product Type (Pair)  and Dependent Sigma Type

## Product Type (Pair)

In type theory, the **product type** (often referred to as the **pair type**) is a type that combines two other types into a single type. This type is denoted by $A \times B$, where $A$ and $B$ are types. Formally, an element of the product type $A \times B$ is a pair $(a, b)$, where $a : A$ and $b : B$.

### Syntax

```
PairType        ::= (Term ‘,’ Term)
PairValue       ::= ‘'’ ‘(’ Term ‘,’ Term ‘)’
```

## Dependent Sigma Type

In type theory, the **dependent sigma type** (often referred to as the **dependent pair type**) extends the notion of the product type by allowing the second component of a pair to depend on the first component. This type is denoted by $\Sigma(x : A) . B(x)$, where $A$ is a type, and $B(x)$ is a family of types indexed by elements of $A$. Formally, for each $a : A$, $B(a)$ is a type, and $\Sigma(x : A) . B(x)$ represents the type of pairs $(a, b)$, where $a : A$ and $b : B(a)$.

This construction generalizes the usual product type $A \times B$, which can be seen as a special case of the dependent sigma type where $B(x)$ is constant (i.e., does not depend on $x$). In the case of a dependent sigma type, the second component is required to be a term of a type that is indexed by the first component. This reflects the central idea of dependency: the second component $b$ is not an arbitrary element of some type but is constrained by the first component $a$ through the type $B(a)$.

### Syntax

```
SigmaTypeSymbol ::= ‘exists’ | ‘Σ’ | ‘∃’
ProdTypeTerm    ::= SigmaTypeSymbol Ident ‘:’ Term
DepProdType     ::= ‘(’ ( PairTypeTerm ‘,’ )* Term ‘)’
```

### Formal Definition

Given:
1. A type $A$,
2. A dependent type $B : A \to \text{Type}$, a function that assigns a type $B(a)$ to each element $a : A$,

the dependent sigma type $\Sigma(x : A) . B(x)$ is defined as the type of pairs $(a, b)$ where:
- $a : A$,
- $b : B(a)$.

Thus, an element of $\Sigma(x : A) . B(x)$ is a dependent pair $(a, b)$, where the type of $b$ depends on $a$.

### Projections and Operations on Dependent Sigma Types

The **first projection** $\pi_1$ for an element $(a, b) : \Sigma(x : A) . B(x)$ extracts the first component, i.e.,
$$
\pi_1 : \Sigma(x : A) . B(x) \to A, \quad \pi_1(a, b) = a.
$$
The **second projection** $\pi_2$ extracts the second component, which depends on the first component, i.e.,
$$
\pi_2 : \Sigma(x : A) . B(x) \to B(\pi_1(a, b)), \quad \pi_2(a, b) = b.
$$
These projections decompose a dependent pair into its components, respecting the dependency structure.

### Introduction and Elimination Rules

In type theory, the introduction and elimination rules for the dependent sigma type formalize how elements of $\Sigma$-types are constructed and used.

1. **Introduction Rule**: If $a : A$ and $b : B(a)$, then $(a, b) : \Sigma(x : A) . B(x)$. This corresponds to the pairing operation and constructs a term of the dependent sigma type from a term of $A$ and a dependent term of $B(a)$.

2. **Elimination Rule**: Given $p : \Sigma(x : A) . B(x)$, we can project out its components:
    - $\pi_1(p)$ gives the first component of the pair,
    - $\pi_2(p)$ gives the second component, which is of type $B(\pi_1(p))$, ensuring that the dependency on the first component is preserved.

These rules allow the construction of dependent pairs and the decomposition of these pairs into their respective components.

### Equivalence with Product Types

When $B(x)$ does not depend on $x$, i.e., $B(x) = B$ for some fixed type $B$, the dependent sigma type $\Sigma(x : A) . B(x)$ reduces to the usual product type $A \times B$. This equivalence is expressed as:
$$
\Sigma(x : A) . B = A \times B,
$$
where $B$ is constant with respect to $x$. This shows that the dependent sigma type is a strict generalization of the product type, encompassing cases where the second type can vary with the first element.


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
Where $P(T)$ is a predicate that holds for a type $T$, meaning $T$ satisfies the contract (or conditions) required by $P$.

#### Typing Rules for Universes

The typing rule for contract universes ensures that types are included in the universe only if they satisfy the required contract. In Saki, this is reflected in the following general typing rule:
$$
\frac{\Gamma \vdash T : \mathcal{U} \quad P(T)}{\Gamma \vdash T : \mathcal{U}_P}
$$
This rule states that:

- If a type $T$ belongs to a base universe $\mathcal{U}$ and satisfies the predicate $P(T)$ (such as implementing required contract methods), then $T$ belongs to the universe $\mathcal{U}_P$, where $P$ represents the contract.

#### Universe Hierarchy and Subtyping

Saki employs a **hierarchical universe system** similar to that of **MLTT**, where universes can be ordered by subtyping. One universe is a **subtype** of another if every type in the first universe satisfies the conditions of the second. This hierarchy is based on the predicates enforced by each universe.

For instance, consider the following two contract universes:

```scala
universe 'Add = contract {
    require add(lhs: Self, rhs: Self): String
}

universe 'Mul(A R: 'Type) = contract {
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
universe 'Mul(A R: 'Type) = contract {
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
let 'Mul: 'Type -> 'Type -> #Universe = |A R: 'Type| {
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

# Terms

## Basic Subtype Relationship

In type theory, subtyping formalizes a notion of substitutability between types, where a term of one type can be used in any context where a term of another (super)type is expected. The subtyping relation, written as $T_1 <: T_2$, expresses that type $T_1$ is a subtype of $T_2$, meaning that every term of type $T_1$ can be safely used where a term of type $T_2$ is required.

### Reflexivity of Subtyping

The first rule expresses the **reflexivity** of subtyping:
$$
T <: T
$$
This states that any type $T$ is trivially a subtype of itself. Reflexivity is a foundational property ensuring that a type can always be substituted for itself.

### Transitivity of Subtyping

The second rule describes the **transitivity** of the subtyping relation:
$$
\frac{\Gamma \vdash T_1 <: T_2 \quad \Gamma \vdash T_2 <: T_3}{\Gamma \vdash T_1 <: T_3}
$$
In words, if $T_1$ is a subtype of $T_2$ and $T_2$ is a subtype of $T_3$, then $T_1$ is also a subtype of $T_3$. 

## Primitive Terms

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
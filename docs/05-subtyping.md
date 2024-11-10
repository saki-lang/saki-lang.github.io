
# Subtyping and Algebraic Subtyping

<script type="module" src="/javascripts/editor.js"></script>
<link rel="stylesheet" href="/static/styles.css">

Subtyping is mathematically represented as a subset relation, \( A \subseteq B \), such that \( \forall t \in A, t \in B \). This interpretation allows subtyping to reflect a preorder relation, which becomes a partial order under equivalence (\( A \leq B \land B \leq A \implies A = B \)). The introduction of least upper bounds (lub, \( A \sqcup B \)) and greatest lower bounds (glb, \( A \sqcap B \)) converts this structure into a lattice. When combined with the universal top type (\( \top \)) and bottom type (\( \bot \)), the lattice becomes bounded, satisfying:

$$
\forall T, \ T \leq \top \quad \text{and} \quad  \forall T, \ \bot \leq T
$$

## Basic Subtype Relationships

### Reflexivity of Subtyping
Subtyping is reflexive, implying any type \( T \) is trivially a subtype of itself:

$$
\begin{align}
\begin{array}{c}
\\\hline
T \leq T
\end{array}
\end{align}
$$

This property is foundational to any preorder relation that subtyping models.

### Transitivity of Subtyping
Transitivity guarantees consistency across multiple subtyping relations. If \( T_1 \leq T_2 \) and \( T_2 \leq T_3 \), then \( T_1 \leq T_3 \). Formally:

$$
\begin{align}
\begin{array}{c}
\Gamma \vdash T_1 \leq T_2 \quad \Gamma \vdash T_2 \leq T_3
\\\hline
\Gamma \vdash T_1 \leq T_3
\end{array}
\end{align}
$$

## Functions
The subtyping relation for function types follows contravariant behavior in the parameter type and covariant behavior in the return type:

$$
\begin{align}
\begin{array}{c}
\Gamma \vdash A_1 \geq B_1 \quad A_2 \leq B_2
\\\hline
\Gamma \vdash A_1 \rightarrow A_2 \leq B_1 \rightarrow B_2
\end{array}
\end{align}
$$

Here, \( A_1 \geq B_1 \) indicates the parameter type \( A_1 \) is a supertype of \( B_1 \), while \( A_2 \leq B_2 \) requires the return type \( A_2 \) to be a subtype of \( B_2 \).

## Union and Intersection Types

### Union Types
Union types, denoted \( \sqcup \), allow combining types such that a value of the union type belongs to at least one constituent type:

$$
\begin{align}
\begin{array}{c}
\forall i \,.\, \exists j \,.\, (\Gamma \vdash A_i \leq B_j)
\\\hline
\Gamma \vdash \bigsqcup_i A_i \leq \bigsqcup_j B_j
\end{array}
\end{align}
$$

This expresses that the union of subtypes remains a subtype of the union of their respective supertypes.

### Intersection Types
Intersection types, denoted \( \sqcap \), describe a type that belongs simultaneously to multiple constituent types:

$$
\newcommand{\bigsqcap}{\mathop ⨅}
\begin{align}
\begin{array}{c}
\Gamma \vdash \forall i \,.\, \exists j \,.\, (A_i \geq B_j)
\\\hline
\Gamma \vdash \bigsqcap_i A_i \geq \bigsqcap_j B_j
\end{array}
\end{align}
$$

The intersection of supertypes forms a supertype of the intersection of their respective subtypes.

### Relationships
For function types, union and intersection obey distributive laws:

$$
(A_1 \to B_1) \sqcap (A_2 \to B_2) = (A_1 \sqcup A_2) \to (B_1 \sqcap B_2)
$$

This states that the intersection of function types corresponds to the union of parameter types and the intersection of return types.

For example:

<div class="code-editor" id="code-union-dist">

```
(Int -> String) & (Float -> Bool)
```
</div>
<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-union-dist', 'output-union-dist', true)">Run Example</button>
</div>
<div id="output-union-dist" class="result-editor"></div>

Similarly, the union of function types results from the intersection of parameter types and the union of return types.

$$
(A_1 \to B_1) \sqcup (A_2 \to B_2) = (A_1 \sqcap A_2) \to (B_1 \sqcup B_2)
$$

For example:
<div class="code-editor" id="code-intersection-dist">

```
(Int -> String) | (Float -> Bool)
```
</div>
<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-intersection-dist', 'output-intersection-dist', true)">Run Example</button>
</div>
<div id="output-intersection-dist" class="result-editor"></div>


## Records
Subtyping for record types aligns with structural subtyping, where records are compatible if they share the same fields and types. The typing rule for record types is:

$$
\begin{align}
\begin{array}{c}
\Gamma \vdash \overline{t_i : T_i}^i
\\ \hline
\Gamma \vdash \{ \overline{l_i = t_i}^i \} : \{ \overline{l_i : T_i}^i \}
\end{array}
\end{align}
$$

Here, \( \overline{t_i : T_i}^i \) denotes record fields, and field labels \( l_i \) and types \( T_i \) determine the record's type.

Field access ensures type preservation:

$$
\begin{align}
\begin{array}{c}
\Gamma \vdash t: \{ \overline{l_i : T_i}^i \}
\\\hline
\Gamma \vdash t.l_i : T_i
\end{array}
\end{align}
$$

Subtyping among records supports the subset relation:

$$
\begin{align}
\begin{array}{c}
\\\hline
\forall S \,.\, \forall (S' \subseteq S) \,.\, (\{\overline{l_i : T_i}^{i \in S}\} \leq  \{\overline{l_i : T_i}^{i \in S'}\})
\end{array}
\end{align}
$$

If fields \( S' \) are a subset of \( S \), then their respective record types exhibit a subtyping relationship.

Pointwise subtyping applies across all fields in records:

$$
\begin{align}
\begin{array}{c}
\Gamma \vdash \forall i \,.\, (A_i \leq B_i)
\\\hline
\Gamma \vdash \{\overline{a_i : A_i}^i\} \leq \{\overline{b_i : B_i}^i\}
\end{array}
\end{align}
$$



### Union and Intersection Rules for Record Types

In algebraic subtyping, **union** (\( \sqcup \)) and **intersection** (\( \sqcap \)) types can also be extended to **record types**. These operations allow record subtyping to support partial and combined views of records, ensuring compatibility and flexibility in handling structured data.

#### Union of Record Types
The union of two record types combines their fields, allowing overlapping fields to resolve to the union of their respective types:

$$
\{\overline{l_i : A_i}^{i \in S}\} \sqcup \{\overline{l_i : B_i}^{i \in T}\} = \{\overline{l_i : A_i \sqcup B_i}^{i \in S \cap T}, \overline{l_j : A_j}^{j \in S \setminus T}, \overline{l_k : B_k}^{k \in T \setminus S}\}
$$

- For shared fields \( l_i \in S \cap T \), the resulting type is the union of their individual types \( A_i \sqcup B_i \).
- For fields exclusive to one record (e.g., \( l_j \in S \setminus T \) or \( l_k \in T \setminus S \)), their types remain unchanged.

For example:

<div class="code-editor" id="code-union-record">

```
(record { a: Int; b: String }) | (record { b: Float; c: Bool })
```
</div>

<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-union-record', 'output-union-record', true)">Run Example</button>
</div>
<div id="output-union-record" class="result-editor"></div>


#### Intersection of Record Types
The intersection of two record types combines their fields similarly, but overlapping fields resolve to the intersection of their types:

$$
\{\overline{l_i : A_i}^{i \in S}\} \sqcap \{\overline{l_i : B_i}^{i \in T}\} = \{\overline{l_i : A_i \sqcap B_i}^{i \in S \cap T}\}
$$

- Only fields common to both records (\( l_i \in S \cap T \)) are preserved in the resulting record.
- For shared fields, the resulting type is the intersection of their individual types \( A_i \sqcap B_i \).
- Fields exclusive to one record are excluded from the intersection.

For example:

<div class="code-editor" id="code-intersect-record">

```
(record { a: Int; b: String }) & (record { b: String; c: Bool })
```
</div>

<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-intersect-record', 'output-intersect-record', true)">Run Example</button>
</div>
<div id="output-intersect-record" class="result-editor"></div>










## Dependent Types

Dependent types extend the expressive power of type systems by allowing types to depend on values or other types. Algebraic subtyping supports dependent types, incorporating union and intersection constructs to define relationships between dependent types effectively.

### Intersection of Dependent \( \Pi \)-Types

#### Type Formation Rule for Intersection of Dependent \( \Pi \)-Types

Dependent \( \Pi \)-types are function-like types where the codomain depends on the specific value of the domain. For the intersection of such types:

$$
\frac{
\Gamma \vdash A_1 : \mathcal{U} \quad \Gamma \vdash A_2 : \mathcal{U} \quad \Gamma, x:A_1 \vdash B_1(x) : \mathcal{U} \quad \Gamma, x:A_2 \vdash B_2(x) : \mathcal{U}
}{
\Gamma \vdash \Pi(x:A_1). B_1(x) \cap \Pi(x:A_2). B_2(x) : \mathcal{U}
}
$$

Refinement ensures that \( x \) must be in both \( A_1 \) and \( A_2 \), producing:

$$
\frac{
\Gamma \vdash A = A_1 \cap A_2 : \mathcal{U} \quad \Gamma, x:A \vdash B(x) = B_1(x) \cap B_2(x) : \mathcal{U}
}{
\Gamma \vdash \Pi(x:A). B(x) : \mathcal{U}
}
$$

#### Subtyping Rule for Intersection of Dependent \( \Pi \)-Types

Subtyping for dependent \( \Pi \)-types follows:

$$
\frac{
\Gamma \vdash A_2 \leq A_1 \quad \Gamma \vdash B_1(x) \leq B_2(x) \quad \Gamma \vdash B_2(x) \leq B_1(x)
}{
\Gamma \vdash \Pi(x : A_1). B_1(x) \cap \Pi(x : A_2). B_2(x) \leq \Pi(x : A_2). B_2(x)
}
$$

### Union of Dependent \( \Pi \)-Types

#### Type Formation Rule for Union of Dependent \( \Pi \)-Types

For unions of dependent \( \Pi \)-types, a sum type representation is used:

$$
\Pi(x : A_1). B_1(x) \cup \Pi(x : A_2). B_2(x) \equiv \text{inl}(\Pi(x : A_1). B_1(x)) \cup \text{inr}(\Pi(x : A_2). B_2(x))
$$

Where \( \text{inl} \) and \( \text{inr} \) represent injections into the left and right components.

#### Typing Rule

A term \( f \) of either constituent type satisfies:

$$
\frac{
\Gamma \vdash f : \Pi(x : A_1). B_1(x)
}{
\Gamma \vdash f : \Pi(x : A_1). B_1(x) \cup \Pi(x : A_2). B_2(x)
}
\quad \text{or} \quad
\frac{
\Gamma \vdash f : \Pi(x : A_2). B_2(x)
}{
\Gamma \vdash f : \Pi(x : A_1). B_1(x) \cup \Pi(x : A_2). B_2(x)
}
$$

#### Subtyping Rule for Union of Dependent \( \Pi \)-Types

Subtyping ensures inclusion and equivalence between unions and their constituents:

$$
\frac{
\Gamma \vdash \Pi(x : A_1). B_1(x) \leq \Pi(x : A_1). B_1(x) \cup \Pi(x : A_2). B_2(x)
}{
\Gamma \vdash \Pi(x : A_1). B_1(x) \cup \Pi(x : A_2). B_2(x) \leq \Pi(x : A_1). B_1(x)
}
$$

A similar rule applies for the second component of the union.

### Intersection of Dependent \( \Sigma \)-Types

#### Type Formation Rule for Intersection of Dependent \( \Sigma \)-Types

For dependent \( \Sigma \)-types, intersections represent the set of pairs satisfying constraints for both components:

$$
\Sigma(x : A_1). B_1(x) \cap \Sigma(x : A_2). B_2(x) \equiv \Sigma(x : A_1 \cap A_2). (B_1(x) \cap B_2(x))
$$

#### Subtyping Rule for Intersection of Dependent \( \Sigma \)-Types

The subtyping rule for intersected \( \Sigma \)-types is:

$$
\frac{
\Gamma \vdash A_2 \leq A_1 \quad \Gamma \vdash B_1(x) \leq B_2(x) \quad \Gamma \vdash B_2(x) \leq B_1(x)
}{
\Gamma \vdash \Sigma(x : A_1). B_1(x) \cap \Sigma(x : A_2). B_2(x) \leq \Sigma(x : A_2). B_2(x)
}
$$

### Union of Dependent \( \Sigma \)-Types

#### Type Formation Rule for Union of Dependent \( \Sigma \)-Types

Unions of dependent \( \Sigma \)-types follow a sum-type structure:

$$
\Sigma(x : A_1). B_1(x) \cup \Sigma(x : A_2). B_2(x) \equiv \text{inl}(\Sigma(x : A_1). B_1(x)) \cup \text{inr}(\Sigma(x : A_2). B_2(x))
$$

Here, \( \text{inl} \) and \( \text{inr} \) designate the left and right components.

#### Typing Rule

Subtyping for unions of \( \Sigma \)-types maintains compatibility:

$$
\frac{
\Gamma \vdash (a, b) : \Sigma(x : A_1). B_1(x)
}{
\Gamma \vdash (a, b) : \Sigma(x : A_1). B_1(x) \cup \Sigma(x : A_2). B_2(x)
}
$$

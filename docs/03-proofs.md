# Construct Formal Proofs

<script type="module" src="/javascripts/editor.js"></script>
<link rel="stylesheet" href="/static/styles.css">

## Background

In modern software and systems development, especially in critical applications like artificial intelligence, cryptography, and distributed systems, ensuring code correctness is of utmost importance. Errors in these domains can lead to severe consequences, ranging from security vulnerabilities to catastrophic failures in autonomous systems. Therefore, it's essential to rigorously verify code correctness. Formal proofs provide a solid foundation for this verification, ensuring that programs not only execute correctly but are mathematically guaranteed to meet their specifications.

A **formal proof** is a mathematically rigorous argument demonstrating the truth of a statement within a formal system. Unlike informal proofs that rely on intuition and natural language, formal proofs are expressed symbolically and precisely. They are designed to be machine-verifiable, meaning automated theorem provers or proof assistants can check them. This capability is particularly important in fields such as:

- **Software Verification**: Ensuring that critical software components (e.g., in aerospace, medical devices, or autonomous systems) are free of bugs and perform as intended.
- **AI Code Synthesis**: Verified AI code synthesis uses formal proofs to ensure that automatically generated code meets its specification, reducing the risk of errors in complex systems generated by machine learning models.



### Type-Level Programming and Proofs

In type-level programming, types are not just used for ensuring low-level correctness (e.g., checking that an integer is passed to a function expecting an integer) but for encoding complex logical propositions and ensuring that programs satisfy deep properties, such as invariants or theorems. When we speak of **dependent types**, these are types that depend on values, allowing us to encode even more detailed and precise properties about programs.

For example, when dealing with natural numbers, the proof of properties such as equality, commutativity, and associativity can be encoded directly in the type system. The formal proof of a mathematical statement like "equality is symmetric" becomes a recursive function over the natural numbers, and the type system ensures that the proof is complete and correct.

We will now move from this background into the concrete construction of a formal proof of the symmetry of equality for natural numbers. This construction will follow the principles of the Curry-Howard correspondence, where the proof is represented as a program in a type-safe, recursive language, and the proposition of symmetric equality is encoded as a type.



## Curry-Howard Correspondence

The **Curry-Howard correspondence**, also known as the propositions-as-types paradigm, is a foundational concept in type theory that establishes a deep relationship between logic and computation. According to this correspondence, logical propositions correspond to types in programming, and proofs of those propositions correspond to programs (or functions) that inhabit those types.

In this framework:

- **Logical Propositions** (such as $P \to Q$, $P \land Q$, and $P \lor Q$) correspond to **types** in programming languages.
- **Proofs** of these propositions correspond to **programs** (i.e., functions) that construct elements of these types.
- **Constructive Proofs**: A proof of a logical statement in this system is constructive, meaning that it not only asserts the truth of the proposition but also provides a method (i.e., an algorithm) for constructing evidence that the proposition holds.

The Curry-Howard correspondence can be summarized as:

| Logical Concept                      | Programming Concept                  |
|--------------------------------------|--------------------------------------|
| Proposition $P$                      | Type $T$                             |
| Proof of $P$                         | Value of type $T$                    |
| Implication $P \to Q$                | Function type $T_1 \to T_2$          |
| Conjunction $P \land Q$              | Pair type $T_1 \times T_2$           |
| Disjunction $P \lor Q$               | Sum type $T_1 + T_2$                 |
| Falsehood $\bot$                     | Empty type (no inhabitants)          |
| Truth $\top$                         | Unit type (single inhabitant)        |
| Universal quantification $\forall$   | Dependent function type ($\Pi$-type) |
| Existential quantification $\exists$ | Dependent pair type ($\Sigma$-type)  |

Through the Curry-Howard correspondence, we can view formal proofs as programs, and the act of proving a theorem becomes synonymous with writing a program that satisfies the corresponding type signature. This correspondence has significant implications for formal verification, enabling the use of proof assistants (such as Coq, Agda, and Lean) to both prove mathematical theorems and verify the correctness of programs in type-safe programming languages like Saki, Haskell, or other dependent type systems.

For example, the proposition $P \to Q$ (i.e., if $P$ holds, then $Q$ holds) corresponds to a function that takes a value of type $P$ and returns a value of type $Q$. Proving this proposition requires constructing such a function. Similarly, proving equality between two elements $a$ and $b$ corresponds to constructing a proof of type $A.\text{Eq}(a, b)$, which can be interpreted as constructing a witness to the fact that $a$ and $b$ are equal in the system.

## Dependent Types

**Dependent types** are an extension of the basic types used in functional programming languages. They allow types to depend on values, thus enabling richer and more precise specifications of programs. Two important forms of dependent types that correspond to universal and existential quantifiers in logic are:

### Dependent Function Types ($\Pi$-Types)
These types correspond to the universal quantifier $\forall$ in logic. They are also called **dependent function types** because they generalize the function types to allow the output type to depend on the value of the input. Formally:

$$
\Pi(x : A) . P(x)
$$

This represents a function that, for each value $x$ of type $A$, returns a value of type $P(x)$, where $P(x)$ is a type that may depend on $x$. In logical terms, this corresponds to the statement "$\forall x \in A, P(x)$" which means "for every $x$ of type $A$, the proposition $P(x)$ holds."

In programming terms, this is a **generalization of function types** because the type of the result of the function can vary depending on the input. For example, in a dependently typed language, we might express the type of a list's length as a function from lists to natural numbers:

<div class="code-editor">

```
length : ∀(A : Type) -> List(A) -> ℕ
```
</div>

This says that for every type $A$, `length` is a function from a list of type $A$ to a natural number, describing the length of the list.

### Dependent Pair Types ($\Sigma$-Types)
These types correspond to the existential quantifier $\exists$ in logic. They represent pairs where the type of the second element depends on the value of the first element. Formally:

$$
\Sigma(x : A) . P(x)
$$

This represents a pair $(x, y)$ where $x$ is of type $A$ and $y$ is of type $P(x)$, where $P(x)$ depends on $x$. In logical terms, this corresponds to the statement "$\exists x \in A, P(x)$" which means "there exists an $x$ of type $A$ such that the proposition $P(x)$ holds."

In programming, a $\Sigma$-type allows for encoding richer structures where some values depend on others. For example, we can encode the type of non-empty lists by using a $\Sigma$-type where the list's first element exists and subsequent elements are of type $A$:

<div class="code-editor">

```
NonEmptyList(A : Type) = ∃(n : ℕ) × Vector(A, n)
```
</div>

This says that a non-empty list of type $A$ is a pair consisting of a natural number $n$ and a vector of $n$ elements of type $A$. The second component depends on the first, reflecting the idea that the length of the list is tied to the vector's length.

### Universal Quantification ($\forall$) and Dependent $\Pi$-Types

In logic, the universal quantifier $\forall$ represents statements that hold for all elements of a certain set. In the Curry-Howard correspondence, $\forall$ corresponds to the **dependent function type** (also called the **$\Pi$-type**). A proposition $\forall x \in A, P(x)$ is equivalent to constructing a function that, given any $x$ of type $A$, returns a proof of $P(x)$. 

For example, to prove a statement like "$\forall n \in \mathbb{N}, n + 0 = n$" (i.e., zero is the identity element for addition over natural numbers), we construct a function that takes a natural number $n$ and returns a proof that $n + 0 = n$.

In type theory, the dependent function type $\Pi(x : A) . P(x)$ is used to encode this idea. It represents a function that, for each $x \in A$, returns a value of type $P(x)$, where $P(x)$ can depend on the input $x$. 

### Existential Quantification ($\exists$) and Dependent $\Sigma$-Types

The existential quantifier $\exists$ in logic asserts the existence of an element with a certain property. In the Curry-Howard correspondence, $\exists$ corresponds to the **dependent pair type** (or **$\Sigma$-type**). A proposition $\exists x \in A, P(x)$ is equivalent to constructing a pair consisting of an element $x$ of type $A$ and a proof that $P(x)$ holds for that $x$.

In type theory, the dependent pair type $\Sigma(x : A) . P(x)$ is used to encode this idea. It represents a pair $(x, p)$, where $x$ is an element of type $A$ and $p$ is a proof that $P(x)$ holds. The type $P(x)$ can depend on $x$, allowing us to express properties that vary depending on the value of $x$.

For instance, if we want to express the statement "there exists a natural number $n$ such that $n$ is even," we could use a $\Sigma$-type to represent this in type theory:

<div class="code-editor">

```
EvenNumber = ∃(n : ℕ) × isEven(n)
```
</div>

This type encodes both the natural number $n$ and a proof that $n$ satisfies the property of being even.


## Definition of Equality, Reflexivity, and Symmetry

We begin by establishing the formal definitions of equality, reflexivity, and symmetry within the framework of type theory. These definitions are critical for the subsequent construction of inductive proofs on natural numbers.

### Definition of Equality

The equality relation between two elements $a, b$ of a type $A$ is defined as a dependent type $A.Eq(a, b)$, which asserts that $a$ and $b$ are equal. This is expressed using a dependent type $A \to \mathcal{U}$ where $\mathcal{U}$ is the universe of types. Formally, the equality type $A.Eq(a, b)$ is defined as:

$$
A.Eq(a, b) :\equiv \forall P : (A \to \mathcal{U}), P(a) \to P(b)
$$

This means that $A.Eq(a, b)$ holds if, for all propositions $P$ on $A$, whenever $P(a)$ is true, $P(b)$ must also hold. In essence, this defines equality as the ability to substitute $a$ for $b$ in any context described by $P$.

<div class="code-editor">

```
def Eq(A: 'Type, a b: A): 'Type = ∀(P: A -> 'Type) -> P(a) -> P(b)
```
</div>

### Reflexivity of Equality

The property of **reflexivity** asserts that any element $a$ of a type $A$ is equal to itself. This is a fundamental axiom of equality, which can be proven for all types by constructing a proof using the definition of equality.

For any element $a \in A$, reflexivity is stated as:

$$
A.Eq(a, a) :\equiv \forall P : (A \to \mathcal{U}), P(a) \to P(a)
$$

This is trivially true because the proof $pa : P(a)$ already holds. Reflexivity is defined as:

<div class="code-editor">

```
def refl(A: 'Type, a: A): A.Eq(a, a) = {
    (P: A -> 'Type, pa: P(a)) => pa
}
```
</div>

This expresses that for any proposition $P$, if $P(a)$ holds, then $P(a)$ trivially holds again, establishing that $a = a$.

### Symmetry of Equality

The property of **symmetry** states that if $a = b$, then $b = a$. Formally, given a proof $A.Eq(a, b)$, we construct a proof of $A.Eq(b, a)$.

The symmetry of equality is defined as follows:

$$
A.Eq(b, a) :\equiv \forall P : (A \to \mathcal{U}), P(b) \to P(a)
$$

Given a proof of $A.Eq(a, b)$, we construct a proof of $A.Eq(b, a)$ by applying $A.Eq(a, b)$ to the proposition $P(b') = A.Eq(b', a)$, and using the reflexivity of $a$. This is formally stated as:

<div class="code-editor">

```
def symmetry(A: 'Type, a b: A, eqab: A.Eq(a, b)): A.Eq(b, a) = {
    eqab((b': A) => A.Eq(b', a), A.refl(a))
}
```
</div>

This construction uses the existing proof $eqab : A.Eq(a, b)$ to establish $A.Eq(b, a)$, thereby proving symmetry.

## Natural Numbers

We now turn to the formal inductive definition of the natural numbers $\mathbb{N}$, which forms the basis for all subsequent proofs.

### Inductive Definition of $\mathbb{N}$ (Natural Numbers): Peano Axioms

The **Peano axioms** provide a formal foundation for the natural numbers and their properties. These axioms define the structure of $\mathbb{N}$ (the set of natural numbers) in a recursive manner. The Peano axioms, originally formulated by Giuseppe Peano in 1889, consist of a set of rules that describe how natural numbers are constructed and how operations like addition and equality are defined.

The Peano axioms can be summarized as follows:

1. **Zero is a natural number**: $Z \in \mathbb{N}$.
   
2. **Every natural number has a successor**: For each $n \in \mathbb{N}$, there exists a successor $S(n) \in \mathbb{N}$, which represents the next natural number after $n$.

3. **Zero is not the successor of any number**: $\forall n \in \mathbb{N}, S(n) \neq Z$.

4. **Distinct numbers have distinct successors**: $\forall n, m \in \mathbb{N}, S(n) = S(m) \implies n = m$.

5. **Mathematical induction**: If a property $P$ holds for zero and holds for the successor of $n$ whenever it holds for $n$, then $P$ holds for all natural numbers $n$.

These axioms define the structure of the natural numbers and allow us to reason about properties such as addition, multiplication, and equality in a recursive manner. The natural numbers, as defined by these axioms, are typically represented as:

$$
\mathbb{N} ::= Z \mid S(n) \quad \text{where } n \in \mathbb{N}
$$

- $Z$ is the natural number zero.
- $S(n)$ is the successor of $n$, representing the number immediately following $n$.

For example:

- $Z$ represents the number $0$,
- $S(Z)$ represents $1$,
- $S(S(Z))$ represents $2$, and so on.

The natural numbers are defined inductively by two constructors:

- $\text{Zero} : \mathbb{N}$, representing the number $0$,
- $\text{Succ} : \mathbb{N} \to \mathbb{N}$, representing the successor of a natural number $n$.

Formally, the inductive type $\mathbb{N}$ is given by:

$$
\mathbb{N} ::= \text{Zero} \mid \text{Succ}(n) \quad \text{where } n \in \mathbb{N}
$$

This is captured in the following Saki code:

<div class="code-editor">

```
type ℕ = inductive {
    Zero
    Succ(ℕ)
}
```
</div>

To make the proof code clear, we add some extra definitions for further proof: 

<div class="code-editor">

```
operator binary (===) left-assoc {
    looser-than (+)
}

def (===)(a b: ℕ): 'Type = ℕ.Eq(a, b)

def o: ℕ = ℕ::Zero
def succ(n: ℕ): ℕ = ℕ::Succ(n)
```
</div>

### Definition of Addition for Natural Numbers

Addition on natural numbers is defined recursively. For $a, b \in \mathbb{N}$, the addition function $+$ is defined as:
$$
+ : \mathbb{N} \to \mathbb{N} \to \mathbb{N}
$$
$$
a + 0 = a
$$
$$
a + \text{Succ}(b) = \text{Succ}(a + b)
$$

and is formally defined in Saki code below:

<div class="code-editor">

```
def (+)(a b : ℕ): ℕ = match a {
    case ℕ::Zero => b
    case ℕ::Succ(a') => ℕ::Succ(a' + b)
}
```
</div>

- **Base Case**: When $a = 0$, $a + b = b$.
- **Recursive Step**: When $a = \text{Succ}(a')$, $a + b = \text{Succ}(a' + b)$, adding one to the result of adding $a'$ and $b$.





## Induction Principles and Theorems on Natural Numbers

Let $\mathbb{N}$ be the type of natural numbers, defined inductively by $\text{Zero} : \mathbb{N}$ and $\text{Succ} : \mathbb{N} \to \mathbb{N}$. The following formal proof is conducted using type theory and the induction principle, denoted as follows:

### Induction Principle

Let $P : \mathbb{N} \to \mathcal{U}$ be a dependent type, where $\mathcal{U}$ is the universe of types. The induction principle on natural numbers is formulated as:

$$
\text{induction}_{\mathbb{N}} : \prod_{P : \mathbb{N} \to \mathcal{U}} P(\text{Zero}) \to \left( \prod_{n : \mathbb{N}} P(n) \to P(\text{Succ}(n)) \right) \to \prod_{n : \mathbb{N}} P(n)
$$

This principle constructs a proof that $P(n)$ holds for all $n \in \mathbb{N}$, given that $P(\text{Zero})$ holds and that $P(n) \to P(\text{Succ}(n))$ holds for all $n \in \mathbb{N}$.

<div class="code-editor">

```
def induction(
    P: ℕ -> 'Type,
    base: P(ℕ::Zero),
    induce: ∀(n: ℕ) -> P(n) -> P(n.succ),
    nat: ℕ,
): P(nat) = match nat {
    case ℕ::Zero => base
    case ℕ::Succ(n') => induce(n', P.induction(base, induce, n'))
}
```
</div>

### Induction Reduction

Let $a, b : \mathbb{N}$ and $P : \mathbb{N} \to \mathcal{U}$ be a dependent type. To simplify inductive proofs, we define a reduction function based on symmetry:

$$
\text{inductionReduce} : \prod_{a, b : \mathbb{N}} (b = a) \to P(a) \to P(b)
$$

This function allows us to reverse the direction of an equality $b = a$ to $a = b$ via the symmetry of equality and use $P(a)$ to derive $P(b)$.

<div class="code-editor">

```
def inductionReduce(
    a b: ℕ,
    eqba: (b === a),
    P: ℕ -> 'Type,
    pa: P(a),
): P(b) = {
    let eqab = ℕ.symmetry(b, a, eqba)
    eqab(P, pa)
}
```
</div>

### Theorem: $n + 0 = n$

We prove by induction on $n \in \mathbb{N}$ that $n + 0 = n$:
$$
\forall n \in \mathbb{N}, n + 0 = n
$$

This is formalized using the induction principle:

$$
\text{theoremPlusZero} : \prod_{n : \mathbb{N}} (n + 0 = n)
$$

<div class="code-editor">

```
def theoremPlusZero: ∀(n: ℕ) -> (n + o === n) = {
    ((n: ℕ) => (n + o === n)).induction(
        ℕ.refl(ℕ::Zero),
        (n: ℕ, assumption: (n + o === n)) => {
            inductionReduce(
                n, n + o, assumption,
                (n': ℕ) => (n'.succ === n.succ),
                ℕ.refl(n.succ)
            )
        }
    )
}
```
</div>

This inductive proof proceeds as follows:

- **Base Case**: $0 + 0 = 0$, by reflexivity of equality.
- **Inductive Step**: Assume $n + 0 = n$, and prove that $S(n) + 0 = S(n)$, which follows from the inductive hypothesis and the definition of addition.

### Leibniz Equality

We define the Leibniz rule of equality, which states that if $a = b$, then for any function $f : \mathbb{N} \to \mathbb{N}$, $f(a) = f(b)$. This is formalized as:

$$
\text{leibnizEq} : \prod_{a, b : \mathbb{N}} (a = b) \to \prod_{f : \mathbb{N} \to \mathbb{N}} f(a) = f(b)
$$

<div class="code-editor">

```
def leibnizEq(f: ℕ -> ℕ): ∀(a: ℕ) -> ∀(b: ℕ) -> (a === b) -> (f(a) === f(b)) = {
    (a b : ℕ, eqab: (a === b)) => {
        (P: ℕ -> 'Type, pfa: P(f a)) => eqab((b': ℕ) => P(f b'), pfa)
    }
}
```
</div>

### Theorem: $n = n + 0$

The reverse direction, $n = n + 0$, is derived using the symmetry of equality and the previously proven theorem:

$$
\forall n \in \mathbb{N}, n = n + 0
$$

This is formalized as:

<div class="code-editor">

```
def theoremPlusZeroInv: ∀(n: ℕ) -> (n === n + o) = {
    (n: ℕ) => ℕ.symmetry(n + o, n, theoremPlusZero(n))
}
```
</div>

### Theorem: Successor and Addition

We now prove that for all $a, b \in \mathbb{N}$, the following holds:

$$
\forall a, b \in \mathbb{N}, S(a + b) = a + S(b)
$$

This is formalized as:

<div class="code-editor">

```
def theoremPlusSucc: ∀(a: ℕ) -> ∀(b: ℕ) -> (succ(a + b) === a + b.succ) = {
    (a b : ℕ) => induction(
        (a': ℕ) => (succ(a' + b) === a' + b.succ),
        ℕ.refl(succ(o + b)),
        (a': ℕ, assumption: (succ(a' + b) === a' + b.succ)) => {
            leibnizEq(succ, succ(a' + b), a' + b.succ, assumption)
        }, a
    )
}
```
</div>

- **Base Case**: $S(0 + b) = 0 + S(b)$, which holds by reflexivity.
- **Inductive Step**: Assuming $S(a + b) = a + S(b)$, prove that $S(S(a) + b) = S(a) + S(b)$, using the inductive hypothesis.

### Transitivity of Equality

Equality in type theory satisfies the transitivity property:
$$
\forall a, b, c \in \mathbb{N}, (a = b) \land (b = c) \to a = c
$$
This is formalized as:
$$
\text{transitivity} : \prod_{a, b, c : A} A.Eq(a, b) \to A.Eq(b, c) \to A.Eq(a, c)
$$

<div class="code-editor">

```
def transitivity(A: 'Type, a b c: A, eqab: A.Eq(a, b), eqbc: A.Eq(b, c)): A.Eq(a, c) = {
    (P: A -> 'Type, pa: P(a)) => eqbc(P, eqab(P, pa))
}
```
</div>

### Theorem: Commutativity of Addition

Finally, we prove the commutativity of addition, i.e., for all $a, b \in \mathbb{N}$:
$$
a + b = b + a
$$
This is formalized as:

<div class="code-editor">

```
def theoremPlusComm: ∀(a: ℕ) -> ∀(b: ℕ) -> (a + b === b + a) = {
    (a: ℕ, b: ℕ) => induction(
        (a': ℕ) => (a' + b === b + a'),
        theoremPlusZeroInv b,
        (a': ℕ, IH: (a' + b === b + a')) => {
            let eq1 = ℕ.refl(succ(a' + b))                  // succ(a') + b === succ(a' + b)
            let eq2 = leibnizEq(succ, a' + b, b + a', IH)   // succ(a' + b) === succ(b + a')
            let eq3 = theoremPlusSucc(b, a')                // succ(b + a') === b + succ(a')
            let eq4 = transitivity(ℕ, succ(a' + b), succ(b + a'), b + succ(a'), eq2, eq3)
            transitivity(ℕ, succ(a') + b, succ(a' + b), b + succ(a'), eq1, eq4)
        }, a
    )
}
```
</div>

- **Base Case**: $0 + b = b + 0$, follows from $n + 0 = n$ and $n = n + 0$.
- **Inductive Step**: Assuming $a + b = b + a$, prove that $S(a) + b = b + S(a)$, using the inductive hypothesis, successor properties, and transitivity of equality.

## Complete Code

<div class="code-editor" id="code-proof">

```
def Eq(A: 'Type, a b: A): 'Type = ∀(P: A -> 'Type) -> P(a) -> P(b)

def refl(A: 'Type, a: A): A.Eq(a, a) = {
    (P: A -> 'Type, pa: P(a)) => pa
}

def symmetry(A: 'Type, a b: A, eqab: A.Eq(a, b)): A.Eq(b, a) = {
    eqab((b': A) => A.Eq(b', a), A.refl(a))
}

type ℕ = inductive {
    Zero
    Succ(ℕ)
}

def o: ℕ = ℕ::Zero
def succ(n: ℕ): ℕ = ℕ::Succ(n)

operator binary (===) left-assoc {
    looser-than (+)
}

def (===)(a b: ℕ): 'Type = ℕ.Eq(a, b)

def (+)(a b : ℕ): ℕ = match a {
    case ℕ::Zero => b
    case ℕ::Succ(a') => ℕ::Succ(a' + b)
}

def induction(
    P: ℕ -> 'Type,
    base: P(ℕ::Zero),
    induce: ∀(n: ℕ) -> P(n) -> P(n.succ),
    nat: ℕ,
): P(nat) = match nat {
    case ℕ::Zero => base
    case ℕ::Succ(n') => induce(n', P.induction(base, induce, n'))
}

def inductionReduce(
    a b: ℕ,
    eqba: (b === a),
    P: ℕ -> 'Type,
    pa: P(a),
): P(b) = {
    let eqab = ℕ.symmetry(b, a, eqba)
    eqab(P, pa)
}

def theoremPlusZero: ∀(n: ℕ) -> (n + o === n) = {
    ((n: ℕ) => (n + o === n)).induction(
        ℕ.refl(ℕ::Zero),
        (n: ℕ, assumption: (n + o === n)) => {
            inductionReduce(
                n, n + o, assumption,
                (n': ℕ) => (n'.succ === n.succ),
                ℕ.refl(n.succ)
            )
        }
    )
}

def leibnizEq(f: ℕ -> ℕ): ∀(a: ℕ) -> ∀(b: ℕ) -> (a === b) -> (f(a) === f(b)) = {
    (a b : ℕ, eqab: (a === b)) => {
        (P: ℕ -> 'Type, pfa: P(f a)) => eqab((b': ℕ) => P(f b'), pfa)
    }
}

def theoremPlusZeroInv: ∀(n: ℕ) -> (n === n + o) = {
    (n: ℕ) => ℕ.symmetry(n + o, n, theoremPlusZero(n))
}

def theoremPlusSucc: ∀(a: ℕ) -> ∀(b: ℕ) -> (succ(a + b) === a + b.succ) = {
    (a b : ℕ) => induction(
        (a': ℕ) => (succ(a' + b) === a' + b.succ),
        ℕ.refl(succ(o + b)),
        (a': ℕ, assumption: (succ(a' + b) === a' + b.succ)) => {
            leibnizEq(succ, succ(a' + b), a' + b.succ, assumption)
        }, a
    )
}

def transitivity(A: 'Type, a b c: A, eqab: A.Eq(a, b), eqbc: A.Eq(b, c)): A.Eq(a, c) = {
    (P: A -> 'Type, pa: P(a)) => eqbc(P, eqab(P, pa))
}

def theoremPlusComm: ∀(a: ℕ) -> ∀(b: ℕ) -> (a + b === b + a) = {
    (a: ℕ, b: ℕ) => induction(
        (a': ℕ) => (a' + b === b + a'),
        theoremPlusZeroInv b,
        (a': ℕ, IH: (a' + b === b + a')) => {
            let eq1 = ℕ.refl(succ(a' + b))                  // succ(a') + b === succ(a' + b)
            let eq2 = leibnizEq(succ, a' + b, b + a', IH)   // succ(a' + b) === succ(b + a')
            let eq3 = theoremPlusSucc(b, a')                // succ(b + a') === b + succ(a')
            let eq4 = transitivity(ℕ, succ(a' + b), succ(b + a'), b + succ(a'), eq2, eq3)
            transitivity(ℕ, succ(a') + b, succ(a' + b), b + succ(a'), eq1, eq4)
        }, a
    )
}

eval "∀(n: ℕ), n + 0 = n"
eval theoremPlusZero

eval ""

eval "∀(a b : ℕ), S(a + b) = a + S(b)"
eval theoremPlusSucc

eval ""

eval "∀(a b : ℕ), a + b = b + a"
eval theoremPlusComm
```
</div>

<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-proof', 'output-proof')">Run Type Checker</button>
</div>

<div class="result-editor" id="output-proof"></div>
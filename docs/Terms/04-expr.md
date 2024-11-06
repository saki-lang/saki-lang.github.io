# Expressions

<script type="module" src="/javascripts/editor.js"></script>
<link rel="stylesheet" href="/static/styles.css">

## If Expression Terms

The **if-expression** in **Saki** provides a way to perform conditional branching, allowing a program to execute one of two expressions based on a boolean condition. Unlike some languages where control flow statements are separate from expressions, Saki’s **if-expression** integrates into the language's expression system, meaning that an **if-expression** always evaluates to a value.

### Syntax

The syntax for an if-expression in Saki is:

```
IfExpr ::= 'if' Term 'then' Term 'else' Term
```

- **`if`**: Starts the conditional expression.
- **Condition** (`Term`): The first `Term` represents the condition. This must be of type `Bool`.
- **`then`**: If the condition evaluates to `true`, the expression following the `then` keyword is evaluated.
- **`else`**: If the condition evaluates to `false`, the expression following the `else` keyword is evaluated.

### Typing Rules

The typing rule for an **if-expression** ensures that the result of the expression is type-consistent across both branches (`then` and `else`). Formally, the rule can be written as:

$$
\frac{\Gamma \vdash t_1: \mathbb{B} \quad \Gamma \vdash t_2: T \quad \Gamma \vdash t_3: T}{\Gamma \vdash \text{if } t_1 \text{ then } t_2 \text{ else } t_3 : T}
$$

Where:

- The condition $t_1$ must have type `Bool` (denoted by $\mathbb{B}$).
- The `then` and `else` branches ($t_2$ and $t_3$) must both have the same type $T$ for the if-expression to be well-typed.

<div class="code-editor" id="code-if">

```
eval {
    let value = 10
    if value % 2 == 0 then "Even" else "Odd"
}
```
</div>
<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-if', 'result-if')">Run Code</button>
</div>
<div class="result-editor" id="result-if"></div>


## Match Expression Terms

The **match-expression** in **Saki** is a powerful construct for pattern matching, similar to pattern matching in languages like **Haskell** or **ML**. It allows a value (usually of a record, inductive type or algebraic data type) to be deconstructed and matched against a set of patterns. The matched pattern determines which branch of the expression will be executed. Pattern matching is essential for working with algebraic data types and other complex structures.

### Syntax

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

### Typing Rules

The typing rule for match-expressions ensures that the matched patterns are exhaustive and that each branch returns the same type `T`:

$$
\frac{\Gamma \vdash t: T \quad \Gamma \vdash p_i: T \quad \Gamma \vdash e_i: R}{\Gamma \vdash \text{match } t \ \{ \ p_1 \Rightarrow e_1 \mid \dots \mid p_n \Rightarrow e_n \ \} : R}
$$

Where:

- The term $t$ being matched must have type $T$.
- Each pattern $p_i$ must correspond to a value of type $T$.
- The expression $e_i$ associated with each pattern must return the same type $R$, ensuring uniformity across all branches.
- The patterns must be exhaustive, covering all possible values of the term $t$. Failing to provide exhaustive patterns would result in a type error, as not all possible values would be handled.

### Example: Boolean Pattern Matching

In the following example, a boolean value is matched against two patterns: `true` and `false`:

<div class="code-editor" id="code-match-bool">

```
def toInt(b: Bool): ℤ = match b {
    case true => 1
    case false => 0
}

eval true.toInt  // Result: 1
eval false.toInt // Result: 0
```
</div>
<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-match-bool', 'result-match-bool')">Run Code</button>
</div>
<div class="result-editor" id="result-match-bool"></div>

Here, the match-expression transforms a boolean value into an integer representation by explicitly handling both possible cases of a `Bool` type.

### Pattern Matching on Inductive Types

Pattern matching becomes particularly useful when working with inductive types, which may represent optional values, lists, or other recursively defined structures. Consider the following inductive type `Option`:

<div class="code-editor" id="code-match-option">

```
type Option[A: 'Type] = inductive {
    None
    Some(A)
}

def getOrDefault[A: 'Type](opt: Option[A], default: A): A = match opt {
    case Option[A]::Some(x) => x
    case Option[A]::None => default
}

eval Option[Int]::Some(114514).getOrDefault[Int](0) // Result: 114514
eval Option[Int]::None.getOrDefault[Int](0)         // Result: 0
```
</div>
<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-match-option', 'result-match-option')">Run Code</button>
</div>
<div class="result-editor" id="result-match-option"></div>

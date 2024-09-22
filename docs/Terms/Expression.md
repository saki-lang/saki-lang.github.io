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
   def getValue[A: 'Type](opt: Option[A], default: A): A = match opt with {
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


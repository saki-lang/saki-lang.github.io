# Martin-Löf Type Theory

<script type="module" src="/javascripts/editor.js"></script>
<link rel="stylesheet" href="/static/styles.css">

Martin-Löf Type Theory (MLTT) stands as a foundational system intertwining constructive mathematics and computer science, developed by Per Martin-Löf in the 1970s. It offers a framework where logic and computation are unified, serving both as a formal language for mathematical proofs and as a typed functional programming language. The hallmark of MLTT is its use of **dependent types**, which enhances the expressiveness of the type system by allowing types to depend on terms. This introduction delves into the theoretical underpinnings of MLTT, emphasizing the role and implications of dependent types within the system.


## Background and Motivation

### Constructive Mathematics and Computation

Constructive mathematics emphasizes the necessity of constructing mathematical objects explicitly rather than assuming their existence non-constructively. This approach aligns naturally with computation, where mathematical proofs correspond to algorithms, and existence proofs provide methods to compute the objects in question.

### The Curry-Howard Correspondence

The Curry-Howard correspondence establishes a profound connection between logic and computation, interpreting types as propositions and terms as proofs or programs. In this paradigm:

- **Types ≈ Propositions**
- **Terms ≈ Proofs/Programs**
- **Type Checking ≈ Proof Verification**
- **Program Execution ≈ Proof Normalization**

MLTT extends this correspondence by incorporating dependent types, allowing for more expressive propositions and enabling the representation of intricate mathematical concepts within the type system.

## Dependent Types

### Dependent Function Types (Π-Types)

**Formation Rule**:

$$
\frac{\Gamma \vdash A : \mathcal{U} \quad \Gamma, x : A \vdash B(x) : \mathcal{U}}{\Gamma \vdash \Pi(x : A) . B(x) : \mathcal{U}}
$$

**Introduction Rule**:

$$
\frac{\Gamma, x : A \vdash b(x) : B(x)}{\Gamma \vdash \lambda x. b(x) : \Pi(x : A) . B(x)}
$$

**Elimination Rule (Application)**:

$$
\frac{\Gamma \vdash f : \Pi(x : A) . B(x) \quad \Gamma \vdash a : A}{\Gamma \vdash f(a) : B(a)}
$$

### Dependent Pair Types (Σ-Types)

**Formation Rule**:

$$
\frac{\Gamma \vdash A : \mathcal{U} \quad \Gamma, x : A \vdash B(x) : \mathcal{U}}{\Gamma \vdash \Sigma(x : A) . B(x) : \mathcal{U}}
$$

**Introduction Rule**:

$$
\frac{\Gamma \vdash a : A \quad \Gamma \vdash b : B(a)}{\Gamma \vdash (a, b) : \Sigma(x : A) . B(x)}
$$

**Elimination Rules (Projections)**:

For $p : (\Sigma x : A) B(x)$:

- **First Projection**: $\text{fst}(p) : A$
- **Second Projection**: $\text{snd}(p) : B(\text{fst}(p))$

## Universes and Type Hierarchies

To prevent paradoxes such as Girard's paradox, MLTT introduces a hierarchy of universes:

- **Type Universes** ($\mathcal{U}_0, \mathcal{U}_1, \ldots$): Each universe $\mathcal{U}_i$ is a type whose elements are types in the universe $\mathcal{U}_{i-1}$.
- **Cumulativity**: If $A : \mathcal{U}_i$, then $A : \mathcal{U}_{i+1}$.

This stratification ensures the consistency of the type theory by avoiding circular definitions.

## Syntax of Martin-Löf Type Theory

To formalize the discussion, we present the syntax of MLTT, focusing on constructs related to dependent types:

$$
\begin{array}{lcll}
t, u & ::= & x & \text{Variable} \\ 
& | & \mathcal{U} & \text{Universe} \\
& | & \Pi(x: t).u & \text{Dependent Pi Type} \\
& | & \lambda(x: t).u & \text{Lambda Expression} \\
& | & t \ u & \text{Application} \\
\end{array}
$$

In this syntax:

- **Variables** (\( x \)) represent identifiers.
- **Universes** (\( \mathcal{U} \)) represent types of types, introducing a hierarchy to prevent paradoxes.
- **Dependent Pi Types** (\( \Pi(x: t).u \)) generalize function types, allowing the return type \( u \) to depend on the input \( x \).
- **Lambda Expressions** (\( \lambda(x: t).u \)) define functions with parameter \( x \) of type \( t \) and body \( u \).
- **Applications** (\( t \ u \)) apply functions to arguments.

To further elucidate the structure of terms in MLTT, we can represent them using an inductive data type:

<div class="code-editor">

```
type Term = inductive {
    // Variable: Represents a variable identified by its name.
    Var(String)
    // Universe Level: Represents types at a certain universe level.
    Type(Int)
    // Dependent Pi Type: `Π(x : A). B`, where `B` may depend on `x`.
    Pi(String, Term, Term)
    // Lambda Term: `λ(x : A). t`.
    Lambda(String, Term, Term)
    // Application: Applying a function to an argument.
    Apply(Term, Term)
}
```
</div>













## Normalization by Evaluation (NBE)

Evaluation in MLTT aims to reduce terms to their normal forms, or fully simplified versions. The process involves translating syntactic terms into a structured representation that allows terms with bound variables to be resolved efficiently. Traditional reduction-based evaluation relies on direct substitution and can be inefficient. Normalization by Evaluation (NBE), however, uses an environment to track bindings and reification to convert values back into terms. It differs fundamentally from direct reduction methods by bypassing substitution and instead leveraging environments and reification to achieve efficient normalization of terms to their irreducible, or normal forms. NBE is especially advantageous in dependent type theories, where terms can depend on values, and normalization is essential for type-checking and proof verification. 


### Values and Neutral Values

*Values* in NBE are representations of terms that can fully evaluate within an environment, encompassing functions, constants, and closed expressions.

<div class="code-editor">

```
type Value = inductive {
    // Neutral Value: A value that cannot be reduced further
    Neutral(NeutralValue)
    // Universe Level: A type at a specific universe level.
    Type(Int)
    // Lambda Function: A function value with its parameter type and body.
    Lambda(Value, Value -> Value)
    // Pi Type Value: Represents a dependent function type.
    Pi(Value, Value -> Value)
}

// In this implementation, types are represented as values.
type Type = Value
```
</div>

*Neutral values*, however, represent terms that are blocked from further reduction due to free variables or unsolved dependencies. Neutral values allow terms with unresolved components to be stored without forcing premature reductions. They are especially significant in representing expressions that cannot simplify further because they involve variables that are free in the current context.
<div class="code-editor">

```
type NeutralValue = inductive {
    // Variable: A neutral value representing an unresolved variable.
    Var(String)
    // Application: Applying a neutral function to a value.
    Apply(NeutralValue, Value)
}
```
</div>

### Environments and Closures

In NBE, functions are represented as closures, capturing both the function body and its environment. An environment binds variables to values, avoiding the need for explicit substitution and enhancing the efficiency of evaluation.

For instance, if a term `λx.t` is in the environment `Env`, it can be represented as a closure combining `t` with `Env`. This representation enables the function to retain variable bindings even as it passes through various stages of evaluation.

For simplicity, we use a linked list to implement the environment and lambda functions in the host language to represent closures:

<div class="code-editor">

```
type Env = inductive {
    Empty
    Cons(String, TypedValue, Env)
}

type Value = inductive {
    /* ... */
    Lambda(Value, Value -> Value).
    Pi(Value, Value -> Value)
}
```
</div>


### Evaluation 
Evaluation in NBE converts syntactic terms into a structured representation of values. Each variable is looked up in the environment rather than being substituted directly, streamlining the process. Below is a function implementing this evaluation, handling variables, functions, and applications:

<div class="code-editor">

```
def evaluate(env: Env, expr: Term): Value = match expr {
    // Look up the variable's value.
    case Term::Var(name) => env.get(name).unwrap[TypedValue].value
    // A type evaluates to itself.
    case Term::Type(univ) => Value::Type(univ)
    // Lambda Evaluation: Constructs a closure capturing the environment and parameter.
    case Term::Lambda(paramIdent, paramTypeTerm, bodyTerm) => {
        let paramType = env.evaluate(paramTypeTerm) // Evaluate parameter type.
        let closure = (arg: Value) => {
            // Evaluate the body with the argument bound.
            env.add(paramIdent, arg, paramType).evaluate(bodyTerm)  
        }
        Value::Lambda(paramType, closure)
    }
    // Pi Type Evaluation: Similar to lambda
    case Term::Pi(paramIdent, paramTypeTerm, codomainTerm) => {
        let paramType = env.evaluate(paramTypeTerm) // Evaluate parameter type.
        let closure = (arg: Value) => {
            // Evaluate codomain with argument bound.
            env.add(paramIdent, arg, paramType).evaluate(codomainTerm)
        }
        Value::Pi(paramType, closure)
    }
    // Function Application Evaluation
    case Term::Apply(fn, arg) => match env.evaluate(fn) {
        // Apply function to the argument.
        case Value::Lambda(_, fn) => fn(env.evaluate(arg))
        // Neutral Application: Cannot reduce further; keep it a neutral value.
        case Value::Neutral(neutral) => 
            NeutralValue::Apply(neutral, env.evaluate(arg)).toValue
        case _ => panic("Invalid type: not a function")
    }
}
```
</div>


### Reification (Read-Back)
The final stage in NBE is reification, which converts evaluated values back into syntactic terms, producing a term in its normal form. Reification ensures that the term representation is irreducible and allows comparisons of normalized terms. In essence, reification “reads back” a value by converting closures and neutral values to their term equivalents. For example:

<div class="code-editor">

```
def readBack(value: Value, env: Env): Term = match value {
    case Value::Neutral(neutral) => neutral.readBack(env)
    case Value::Type(univ) => Term::Type(univ)
    // Lambda Normalization: Generate a fresh variable to avoid capture.
    case Value::Lambda(paramType, fn) => {
        let paramIdent: String = env.freshIdent
        // Normalize parameter type.
        let paramTypeTerm = paramType.readBack(env)
        // Create variable value.
        let variable: Value = NeutralValue::Var(paramIdent).toValue
        // Extend environment.
        let updatedEnv = env.add(paramIdent, variable, env.evaluate(paramTypeTerm))
        Term::Lambda(
            paramIdent, paramTypeTerm,         // Construct lambda term.
            fn(variable).readBack(updatedEnv)  // Normalize the body.
        )
    }
    // Pi Type Normalization: Similar to lambda normalization.
    case Value::Pi(paramType, fn) => {
        // Fresh parameter name.
        let paramIdent: String = env.freshIdent
        // Normalize parameter type.
        let paramTypeTerm = paramType.readBack(env)
        // Create variable value.
        let variable: Value = NeutralValue::Var(paramIdent).toValue
        // Extend environment.
        let updatedEnv = env.add(paramIdent, variable, env.evaluate(paramTypeTerm))
        Term::Pi(
            paramIdent, paramTypeTerm,          // Construct Pi type term.
            fn(variable).readBack(updatedEnv)   // Normalize the codomain.
        )
    }
}
```
</div>

### Neutral Value Reification
Neutral terms are read back by preserving the unresolved structure, which makes them appear in their simplest, irreducible forms. For instance, if the neutral term is a variable `x`, `readBack` simply returns `Term::Var(x)`:

<div class="code-editor">
```
def readBack(neutral: NeutralValue, env: Env): Term = match neutral {
    // Convert variable to term.
    case NeutralValue::Var(name) => Term::Var(name)
    // Reconstruct application.
    case NeutralValue::Apply(fn, arg) => Term::Apply(fn.readBack(env), arg.readBack(env))
}
```
</div>

### Formalization of NBE’s Core Operations

In formal terms, NBE employs structured definitions of evaluation and application, capturing both the computational essence and logical foundation of dependent type theories. These formalizations are represented with mathematical notations:

#### Evaluation Rules
$$
⟦ x ⟧_{\rho} = \rho(x)
$$

For a variable $x$, evaluation retrieves $x$'s value from the environment $\rho$.

$$
⟦ \lambda x.t ⟧_{\rho} = (\rho, \lambda x.t)
$$

A lambda function evaluates to a closure with $\rho$ capturing the environment.

$$
⟦ t \ u ⟧_{\rho} = ⟦ t ⟧_{\rho} \cdot ⟦ u ⟧_{\rho}
$$

Application proceeds by evaluating both the function $t$ and argument $u$.

#### Application in Formal Terms
Application between values distinguishes between closures and neutral values:

$$
(\rho, \lambda x.t) \cdot v = ⟦ t ⟧_{\rho[x \mapsto v]}
$$
If the function is a closure, the argument $v$ extends the environment.

$$
n \cdot v = \text{Neutral}(n \ v)
$$
For neutral values, application produces another neutral structure.


## Complete Implementation

The following code implements a simple type checker and evaluator for Martin-Löf Type Theory (MLTT).

<div class="code-editor" id="code-mltt">

```
/**
 * This code implements a simple type checker and evaluator for Martin-Löf Type Theory (MLTT).
 * 
 * MLTT is a constructive type theory foundational to many proof assistants and dependently 
 * typed programming languages, such as Agda (MLTT) and Coq (CIC).
 * 
 * In MLTT, types depend on values, leading to a system where functions can accept types 
 * as parameters and return types as results. Key concepts include:
 * - Dependent Function Types (Pi Types): Generalizations of function types where the 
 *   return type depends on the input value.
 * - Lambda Abstractions: Anonymous functions defined by specifying parameters and body.
 * - Universes: A hierarchy of types (e.g., `Type(0)`, `Type(1)`, etc.).
 * 
 * This implementation models core constructs of MLTT, including terms, values, environments, 
 * evaluation, type inference, and normalization.
 */

/**
 * Extracts the value from an `Option[A]`. Throws an error if the option is `None`.
 * @param <A> Type of the value.
 * @param option The `Option` instance.
 * @return The extracted value of type `A`.
 */
type Option[A: 'Type] = inductive {
    None        // Represents the absence of a value.
    Some(A)     // Wraps a value of type A.
}

/**
 * Extracts the value from an `Option[A]`. Throws an error if the option is `None`.
 * @param <A> Type of the value.
 * @param option The `Option` instance.
 * @return The extracted value of type `A`.
 */
def unwrap[A: 'Type](option: Option[A]): A = match option {
    case Option[A]::None => panic("Unwrapping a none option type")
    case Option[A]::Some(value) => value
}

/**
 * `Term` represents the syntax of expressions in MLTT. Each constructor corresponds 
 * to a syntactic category.
 */
type Term = inductive {
    // Variable: Represents a variable identified by its name.
    Var(String)
    // Universe Level: Represents types at a certain universe level.
    Type(Int)
    // Dependent Pi Type: `Π(x : A). B`, where `B` may depend on `x`.
    Pi(String, Term, Term)
    // Lambda Term: `λ(x : A). t`.
    Lambda(String, Term, Term)
    // Application: Applying a function to an argument.
    Apply(Term, Term)
}

/**
 * `Value` represents the evaluated form of terms, reducing to values during evaluation.
 */
type Value = inductive {
    // Neutral Value: A value that cannot be reduced further
    Neutral(NeutralValue)
    // Universe Level: A type at a specific universe level.
    Type(Int)
    // Lambda Function: A function value with its parameter type and body.
    Lambda(Value, Value -> Value)
    // Pi Type Value: Represents a dependent function type.
    Pi(Value, Value -> Value)
}

/** 
 * Types are represented as values within this implementation.
 */
type Type = Value

// **Neutral Values**

/*
 * `NeutralValue` represents expressions that cannot be evaluated further due to 
 * the absence of sufficient information (e.g., variables or applications of variables).
 */ 
type NeutralValue = inductive {
    // Variable: A neutral value representing an unresolved variable.
    Var(String)
    // Application: Applying a neutral function to a value.
    Apply(NeutralValue, Value)
}

/**
 * Converts a `NeutralValue` into a `Value`.
 * @param neutral The `NeutralValue` to convert.
 * @return The resulting `Value`.
 */
def toValue(neutral: NeutralValue): Value = Value::Neutral(neutral)

/**
 * `TypedValue` pairs a value with its type, essential for type checking and 
 * ensuring type safety during evaluation.
 */
type TypedValue = record {
    value: Value    // The evaluated value.
    ty: Type        // The type of the value.
}

/**
 * `Env` represents the typing context, mapping variable names to their corresponding typed values.
 */
type Env = inductive {
    Empty
    Cons(String, TypedValue, Env)
}

/**
 * Adds a new binding to the environment.
 * @param env The current environment.
 * @param name The variable name.
 * @param value The value to bind.
 * @param ty The type of the value.
 * @return A new environment with the added binding.
 */
def add(env: Env, name: String, value: Value, ty: Type): Env = {
    let typedValue = TypedValue '{
        value = value  // The value associated with the name.
        ty = ty        // The type of the value.
    }
    Env::Cons(name, typedValue, env)
}

/**
 * Adds a variable to the environment as a neutral value, commonly used when introducing parameters.
 * @param env The current environment.
 * @param ident The identifier of the variable.
 * @param ty The type of the variable.
 * @return A new environment with the variable added as a neutral value.
 */
def addVar(env: Env, ident: String, ty: Type): Env = {
    env.add(ident, NeutralValue::Var(ident).toValue, ty)
}

/**
 * Retrieves a binding from the environment by name.
 * @param env The current environment.
 * @param name The name of the variable to retrieve.
 * @return An `Option` of `TypedValue` containing the variable's type if found, or `None` if not found.
 */
def get(env: Env, name: String): Option[TypedValue] = {
    match env {
        case Env::Empty => Option[TypedValue]::None  // Name not found.
        case Env::Cons(name', value, env') => {
            if name' == name then Option[TypedValue]::Some(value)  
            else env'.get(name) // Search in the rest of the environment.
        }
    }
}

/**
 * Checks if a name exists in the environment.
 * @param env The current environment.
 * @param name The name to check for.
 * @return `true` if the name exists in the environment, `false` otherwise.
 */
def contains(env: Env, name: String): Bool = match env {
    case Env::Empty => false  // Name not found.
    case Env::Cons(name', _, env') => name' == name || env'.contains(name)  // Found or continue searching.
}

/**
 * Generates a fresh identifier not present in the environment, used to avoid variable capture during substitution.
 * @param env The current environment.
 * @param cnt The starting count for generating identifiers.
 * @return A fresh identifier not currently in the environment.
 */
def freshIdentFrom(env: Env, cnt: Int): String = {
    let ident = "$" ++ cnt.toString     // Generates identifiers like `$0`, `$1`, etc.
    if !env.contains(ident) then ident  // If not in the environment, it's fresh.
    else env.freshIdentFrom(cnt + 1)    // Try the next identifier.
}

/**
 * Generates a fresh identifier starting from `$0`.
 * @param env The current environment.
 * @return A fresh identifier.
 */
def freshIdent(env: Env): String = env.freshIdentFrom(0)

/**
 * Evaluates a `Term` in a given environment to produce a `Value`.
 * Evaluation proceeds by pattern matching on the term's structure.
 * @param env The current environment.
 * @param expr The `Term` to evaluate.
 * @return The evaluated `Value`.
 */
def evaluate(env: Env, expr: Term): Value = match expr {
    // Look up the variable's value.
    case Term::Var(name) => env.get(name).unwrap[TypedValue].value
    // A type evaluates to itself.
    case Term::Type(univ) => Value::Type(univ)
    // Lambda Evaluation: Constructs a closure capturing the environment and parameter.
    case Term::Lambda(paramIdent, paramTypeTerm, bodyTerm) => {
        let paramType = env.evaluate(paramTypeTerm) // Evaluate parameter type.
        let closure = (arg: Value) => {
            // Evaluate the body with the argument bound.
            env.add(paramIdent, arg, paramType).evaluate(bodyTerm)  
        }
        Value::Lambda(paramType, closure)
    }
    // Pi Type Evaluation: Similar to lambda
    case Term::Pi(paramIdent, paramTypeTerm, codomainTerm) => {
        let paramType = env.evaluate(paramTypeTerm) // Evaluate parameter type.
        let closure = (arg: Value) => {
            // Evaluate codomain with argument bound.
            env.add(paramIdent, arg, paramType).evaluate(codomainTerm)
        }
        Value::Pi(paramType, closure)
    }
    // Function Application Evaluation
    case Term::Apply(fn, arg) => match env.evaluate(fn) {
        // Apply function to the argument.
        case Value::Lambda(_, fn) => fn(env.evaluate(arg))
        // Neutral Application: Cannot reduce further; keep it a neutral value.
        case Value::Neutral(neutral) => NeutralValue::Apply(neutral, env.evaluate(arg)).toValue
        case _ => panic("Invalid type: not a function")
    }
}


/**
 * Converts a `NeutralValue` back into a `Term`, used during normalization to reconstruct 
 * terms from evaluated values.
 * @param neutral The `NeutralValue` to convert.
 * @param env The current environment.
 * @return The reconstructed `Term`.
 */
def readBack(neutral: NeutralValue, env: Env): Term = match neutral {
    // Convert variable to term.
    case NeutralValue::Var(name) => Term::Var(name)
    // Reconstruct application.
    case NeutralValue::Apply(fn, arg) => Term::Apply(fn.readBack(env), arg.readBack(env))
}

/**
 * Converts a `Value` back into a `Term`, effectively normalizing the term by reducing it to its simplest form.
 * @param value The `Value` to convert.
 * @param env The current environment.
 * @return The normalized `Term`.
 */
def readBack(value: Value, env: Env): Term = match value {
    case Value::Neutral(neutral) => neutral.readBack(env)
    case Value::Type(univ) => Term::Type(univ)
    // Lambda Normalization: Generate a fresh variable to avoid capture.
    case Value::Lambda(paramType, fn) => {
        let paramIdent: String = env.freshIdent
        // Normalize parameter type.
        let paramTypeTerm = paramType.readBack(env)
        // Create variable value.
        let variable: Value = NeutralValue::Var(paramIdent).toValue
        // Extend environment.
        let updatedEnv = env.add(paramIdent, variable, env.evaluate(paramTypeTerm))
        Term::Lambda(
            paramIdent, paramTypeTerm,         // Construct lambda term.
            fn(variable).readBack(updatedEnv)  // Normalize the body.
        )
    }
    // Pi Type Normalization: Similar to lambda normalization.
    case Value::Pi(paramType, fn) => {
        // Fresh parameter name.
        let paramIdent: String = env.freshIdent
        // Normalize parameter type.
        let paramTypeTerm = paramType.readBack(env)
        // Create variable value.
        let variable: Value = NeutralValue::Var(paramIdent).toValue
        // Extend environment.
        let updatedEnv = env.add(paramIdent, variable, env.evaluate(paramTypeTerm))
        Term::Pi(
            paramIdent, paramTypeTerm,          // Construct Pi type term.
            fn(variable).readBack(updatedEnv)   // Normalize the codomain.
        )
    }
}

/**
 * Retrieves the universe level from a `Type` value.
 * Universe levels are critical in MLTT to maintain consistency and avoid paradoxes.
 * @param ty The `Type` value.
 * @return The universe level as an `Int`.
 */
def universeLevel(ty: Type): Int = match ty {
    case Value::Type(univ) => univ
    case _ => panic("Failed to unwrap universe level: not a type")
}

/**
 * Infers the type of a `Term` within a given environment following MLTT's typing rules.
 * @param env The current environment.
 * @param expr The `Term` whose type is inferred.
 * @return The inferred type as a `Value`.
 */
def infer(env: Env, expr: Term): Value = match expr {
    // Retrieve the variable's type from the environment.
    case Term::Var(name) => env.get(name).unwrap[TypedValue].ty
    // `Type(n)` has type `Type(n + 1)`.
    case Term::Type(univ) => Value::Type(univ + 1)
    // Lambda Type Inference:
    case Term::Lambda(paramIdent, paramTypeTerm, bodyTerm) => {
        // Infer parameter type's universe level.
        let paramLevel = env.infer(paramTypeTerm).universeLevel
        // Evaluate parameter type.
        let paramType: Type = env.evaluate(paramTypeTerm)
        // Create variable for parameter.
        let variable: Value = NeutralValue::Var(paramIdent).toValue
        // Extend environment with parameter.
        let bodyEnv = env.add(paramIdent, variable, paramType)
        // Infer body's type.
        let returnType: Type = bodyEnv.infer(bodyTerm)
        // The lambda's type is a Pi type from parameter to return type.
        Value::Pi(
            paramType,
            (arg: Value) => {
                // Infer argument's type.
                let argType = env.infer(arg.readBack(bodyEnv))
                // Evaluate the body.
                bodyEnv.add(paramIdent, arg, argType).evaluate(bodyTerm)
            }
        )
    }
    // Pi Type Inference:
    case Term::Pi(paramIdent, paramTypeTerm, returnTypeTerm) => {
        // Infer parameter type's universe level.
        let paramLevel = env.infer(paramTypeTerm).universeLevel
        // Evaluate parameter type.
        let paramType: Type = env.evaluate(paramTypeTerm)
        // Create variable for parameter.
        let variable: Value = NeutralValue::Var(paramIdent).toValue
        let returnTypeLevel = env.add(paramIdent, variable, paramType).infer(returnTypeTerm).universeLevel
        // The Pi type's universe level is the maximum of parameter and return types.
        Value::Type(max paramLevel returnTypeLevel)
    }
}

/**
 * Normalizes a `Term` by evaluating it and converting the result back into a term.
 * Normalization is essential for comparing terms for equality and ensuring consistent behavior.
 * @param env The current environment.
 * @param expr The `Term` to normalize.
 * @return The normalized `Term`.
 */
def normalize(env: Env, expr: Term): Term = env.evaluate(expr).readBack(env)

```
</div>
<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-mltt', 'result-mltt')">Run Code</button>
</div>
<div class="result-editor" id="result-mltt"></div>

# Function (Lambda)

<script type="module" src="/javascripts/editor.js"></script>
<link rel="stylesheet" href="/static/styles.css">

## Lambda Expressions

Lambda expressions in Saki serve as anonymous functions, allowing computations to be defined concisely and utilized without requiring a named identifier. These expressions are automatically curried, meaning that a function expecting multiple parameters is interpreted as a sequence of unary functions, each taking a single argument and returning a new function. This implicit currying supports partial application, a powerful feature in functional programming.

### Syntax of Lambda Expressions

Lambda expressions in Saki are defined using a specific syntax to ensure type safety and expressiveness. The core syntax is as follows:

```
ParamBinding    ::= ‘self’ 
                  | Ident+ ‘:’ Term
ParamList       ::= ParamBinding (‘,’ ParamBinding)*
FuncTerm        ::= ‘(’ ParamList ‘)’ ‘=>’ Term
```

- **`ParamBinding`**: Represents each parameter in a function, specifying the parameter name (`Ident`) and its type (`Term`). In Saki, `self` is a special keyword used to refer to the current instance, commonly in implementation contexts (e.g., in classes or modules).

- **`ParamList`**: A list of `ParamBinding`s separated by commas, enclosed in a pair of parentheses. This structure defines the parameters accepted by the lambda function.

- **`FuncTerm`**: Specifies the function body following the `=>` symbol. This term represents the operation applied to the parameters provided in `ParamList`.


### Syntax of Lambda Types

The syntax of function types in Saki follows the common notation used in functional programming and type theory. A function type is composed of a domain and codomain, separated by an arrow (`->`). Formally, this is expressed as:

```
FuncType    ::= Term "->" Term
```

Here, `A -> B` represents the type of a function that takes an argument of the first type (`A`) and returns a value of the second type (`B`). This notation generalizes higher-order functions, where both the input and output can themselves be functions, and extends naturally to the lambda calculus formulation of functions.



## Typing Rules

The basic typing rule for functions follows from the lambda calculus. For a function term $\lambda (x: T_1) . t$ that takes an argument $x$ of type $T_1$ and returns a result $t$ of type $T_2$, the corresponding typing rule is:
$$
\frac{\Gamma, x: T_1 \vdash t: T_2}{\Gamma \vdash \lambda (x: T_1) \,.\, t : T_1 \rightarrow T_2}
$$

This states that: Given a context $\Gamma$ and assuming that $x$ is a variable of type $T_1$, if the term $t$ has type $T_2$, then the lambda abstraction $\lambda (x: T_1) . t$ (a function taking $x$ as an argument) has the type $T_1 \rightarrow T_2$.

## Subtyping Relationship

Subtyping in function types adheres to the principles of ***contravariance*** for the argument types and ***covariance*** for the return types. This is formally captured by the subtyping rule for function types:
$$
\frac{\Gamma \vdash A_1 >: B_1 \quad A_2 <: B_2}{\Gamma \vdash A_1 \rightarrow A_2 <: B_1 \rightarrow B_2}
$$

- **Contravariance in the argument:** If $A_1$ is a supertype of $B_1$ ($A_1 >: B_1$), then we can safely replace $B_1$ with $A_1$ in the function's input position, meaning that $A_1 \rightarrow A_2$ is a subtype of $B_1 \rightarrow A_2$.
- **Covariance in the return:** If $A_2$ is a subtype of $B_2$ ($A_2 <: B_2$), then the result type can safely be replaced with a more general type, preserving the function's output.


### Basic Lambda Expression

A lambda function that increments an integer by 1 is defined as:

<div class="code-editor">

```
(x: ℤ): ℤ => x + 1
```
</div>

Here, `x` is the integer parameter, and the function returns the result of `x + 1`. The type of this function is:
$$
\text{ℤ} \rightarrow \text{ℤ}
$$

### Lambda Expression with Block Syntax

Block syntax is supported to handle more complex operations within the function body. For example:

<div class="code-editor">

```
(x: ℤ): ℤ => { x + 1 }
```
</div>

This expression performs the same operation as the previous one but includes braces (`{}`), allowing more complex logic within the lambda.

### Multiple Parameters

Lambda expressions in Saki can take multiple parameters, illustrated as follows:

<div class="code-editor">

```
(x y: ℤ): ℤ => x + y
```
</div>

This lambda expression takes two integers, `x` and `y`, and returns their sum. The type of this lambda expression is:
$$
\text{ℤ} \rightarrow \text{ℤ} \rightarrow \text{ℤ}
$$

Since functions are **curried** in Saki, this means the lambda takes an argument of type `ℤ` and returns a new function that also takes an argument of type `ℤ` and returns an `ℤ`. Curried functions enable partial application, meaning that this function can be applied to one argument at a time.

### Lambda as an Argument

Suppose we have the following definitions:

<div class="code-editor">

```
type List[T: 'Type] = inductive {
    Nil
    Cons(T, List[T])
}

def map(transform: ℤ -> ℤ, list: List[ℤ]): List[ℤ] = match list {
    case List[ℤ]::Nil => List[ℤ]::Nil
    case List[ℤ]::Cons(head, tail) => List[ℤ]::Cons(transform head, map transform tail)
}
```
</div>

This `map` function applies a transformation to each element of a list of integers. The type of `map` is:
$$
(\text{ℤ} \rightarrow \text{ℤ}) \rightarrow \text{List}[\text{ℤ}] \rightarrow \text{List}[\text{ℤ}]
$$

Since functions are curried, `map` can take a single argument (the transformation function of type `ℤ -> ℤ`) and return another function that expects a list of integers (`List[ℤ]`) and returns a transformed list (`List[ℤ]`).

An example of using `map` with a lambda expression:

<div class="code-editor" id="code-fn-map">

```
type List[T: 'Type] = inductive {
    Nil
    Cons(T, List[T])
}

def map(transform: ℤ -> ℤ, list: List[ℤ]): List[ℤ] = match list {
    case List[ℤ]::Nil => List[ℤ]::Nil
    case List[ℤ]::Cons(head, tail) => List[ℤ]::Cons(transform head, map transform tail)
}

eval {
    let list = List[ℤ]::Cons(1, List[ℤ]::Cons(2, List[ℤ]::Cons(3, List[ℤ]::Nil)))
    map ((x: ℤ) => x + 1) list
}
```
</div>

<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-fn-map', 'result-fn-map')">Run Example</button>
</div>

<div id="result-fn-map" class="result-editor"></div>

Here, the lambda `(x: ℤ) => x + 1` is passed as the `transform` argument. The type of the lambda is `ℤ -> ℤ`, and the application of `map` returns a new function that accepts a `List[ℤ]` and returns a transformed `List[ℤ]`.

In addition, the return type of the lambda expression is not nessessarily to be identical to the argument type. 
Consider a `filter` function that takes a list and a predicate (a function that returns a boolean), returning a list of elements that satisfy the predicate:

<div class="code-editor">

```
def filter(list: List[ℤ], predicate: ℤ -> Bool): List[ℤ] = match list {
    case List[ℤ]::Nil => List[ℤ]::Nil
    case List[ℤ]::Cons(head, tail) => {
        if predicate head then {
            List[ℤ]::Cons(head, tail.filter(predicate))
        } else {
            tail.filter(predicate) 
        }
    }
}
```
</div>

The type of `filter` is:
$$
\text{List}[\text{ℤ}] \rightarrow (\text{𝔹} \rightarrow \text{ℤ}) \rightarrow \text{List}[\text{ℤ}]
$$

To use `filter`, we can pass a lambda to filter out negative numbers:

<div class="code-editor" id="code-fn-filter">

```

type List[T: 'Type] = inductive {
    Nil
    Cons(T, List[T])
}

def filter(list: List[ℤ], predicate: ℤ -> Bool): List[ℤ] = match list {
    case List[ℤ]::Nil => List[ℤ]::Nil
    case List[ℤ]::Cons(head, tail) => {
        if predicate head then {
            List[ℤ]::Cons(head, tail.filter(predicate))
        } else {
            tail.filter(predicate) 
        }
    }
}

eval {
    let list = List[ℤ]::Cons(-1, List[ℤ]::Cons(2, List[ℤ]::Cons(-3, List[ℤ]::Nil)))
    list.filter((x: ℤ) => x > 0) 
}
```
</div>

<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-fn-filter', 'result-fn-filter')">Run Example</button>
</div>

<div id="result-fn-filter" class="result-editor"></div>


The lambda `(x: ℤ) => x > 0` has the type `ℤ -> Bool`, and the result of `filter` will be a new list containing only the positive integers from the original `list`.


### Partial Application of Curried Functions

Due to currying, functions in Saki can be partially applied. For example:

<div class="code-editor" id="code-fn-partial">

```
type List[T: 'Type] = inductive {
    Nil
    Cons(T, List[T])
}

def map(transform: ℤ -> ℤ, list: List[ℤ]): List[ℤ] = match list {
    case List[ℤ]::Nil => List[ℤ]::Nil
    case List[ℤ]::Cons(head, tail) => List[ℤ]::Cons(transform head, map transform tail)
}

eval {
    let list = List[ℤ]::Cons(1, List[ℤ]::Cons(2, List[ℤ]::Cons(3, List[ℤ]::Nil)))
    let incrementAll = map ((x: ℤ) => x + 1)
    incrementAll list
}
```
</div>

<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-fn-partial', 'result-fn-partial')">Run Example</button>
</div>

<div id="result-fn-partial" class="result-editor"></div>

In this case, `incrementAll` is a partially applied version of `map`, accepting a list of integers and returning a list with each element incremented by 1. The resulting type of `incrementAll` is:
$$
\text{List}[\text{ℤ}] \rightarrow \text{List}[\text{ℤ}]
$$

This means `incrementAll` is now a function that takes a list of integers and returns a list of integers where each element has been incremented by 1.

## Omitting Type Annotations in Lambda Expressions

When a lambda is passed as an argument and the type can be inferred, type annotations can often be omitted:

<div class="code-editor">

```
map (|x| => x + 1) list
```
</div>

In this example, `x` is inferred to be of type `ℤ` from the context of `map`’s signature. This reduces verbosity without compromising type safety.

## Syntactic Sugar for Lambda Expressions

Saki supports syntax simplifications for lambda expressions. When a lambda is the final argument to a function, parentheses around the lambda can be omitted, as can the `=>` symbol:

<div class="code-editor">

```
map list |x| { x + 1 }
```
</div>

The type of this lambda remains the same:
$$
\text{ℤ} \rightarrow \text{ℤ}
$$

### Lambda Returning Another Lambda (Curried Function)

Lambda expressions in Saki can return other lambdas, facilitating nested function applications. For example:

<div class="code-editor">

```
let multiply = (x: ℤ) => (y: ℤ) => x * y
```
</div>

The type of `multiply` is:
$$
\text{ℤ} \rightarrow \text{ℤ} \rightarrow \text{ℤ}
$$

This function takes an integer `x` and returns a new function that takes another integer `y` and returns the product `x * y`. You can partially apply this function:

When partially applied, `multiply 2`, for instance, produces a function `ℤ -> ℤ` that doubles any integer input:

<div class="code-editor" id="code-fn-curry">

```
eval {
    let multiply = (x: ℤ) => (y: ℤ) => x * y
    multiply 2
}
```
</div>

<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-fn-curry', 'result-fn-curry')">Run Example</button>
</div>

<div id="result-fn-curry" class="result-editor"></div>


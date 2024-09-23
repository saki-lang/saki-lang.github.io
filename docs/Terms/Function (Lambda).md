# Function (Lambda) Terms

In Saki, lambda expressions are essential constructs that allow for the creation of anonymous functions in a concise manner. Functions in Saki are **automatically curried**, which means a function with multiple arguments is treated as a series of functions, each taking one argument and returning another function. This makes function application more flexible and allows partial application of functions.

The syntax for lambda expressions in Saki is structured as follows:

```
ParamBinding    ::= ‘self’ 
                  | Ident+ ‘:’ Term
ParamList       ::= ParamBinding (‘,’ ParamBinding)*
FuncTerm        ::= ‘|’ ParamList ‘|’ ‘=>’ Term
```
- **`ParamBinding`:** A `ParamBinding` represents a list of parameters to the function, which can either be one or more simple identifier (`Ident`) paired with a type (`Term`), or the special keyword `self` which refers to the current instance in `impl` contexts.
  
- **`ParamList`:** A comma-separated list of parameters, each defined as a `ParamBinding`, encapsulated within vertical bars (`|`). This indicates the arguments that the lambda function will accept.
  
- **`FuncTerm`:** After the parameters are specified, the function body follows an arrow symbol (`=>`), which expresses the transformation or operation performed on the parameters.

## Examples

### Basic Lambda Expression
   
The simplest lambda expression might define a function that takes an integer and returns its successor:

```scala
|x: ℤ|: ℤ => x + 1
```

This lambda function takes a single argument `x` of type `ℤ` (integer) and returns the result of `x + 1`. The type annotation `: ℤ` after the parameter list and before the arrow specifies the return type of the function, which is also `ℤ`.

### Lambda Expression with Block Syntax

```scala
|x: ℤ|: ℤ => { return x + 1 }
```

In this example, the body of the lambda function is enclosed in curly braces and uses an explicit `return` statement. The explicit use of braces allows for more complex logic in the function body, though in this case, it performs the same operation as the previous example.

### Multiple Parameters

```scala
|x y: ℤ|: ℤ => x + y
```

This lambda expression takes two integers, `x` and `y`, and returns their sum. The type of this lambda expression is:

```scala
ℤ -> ℤ -> ℤ
```

Since functions are **curried** in Saki, this means the lambda takes an argument of type `ℤ` and returns a new function that also takes an argument of type `ℤ` and returns an `ℤ`. Curried functions enable partial application, meaning that this function can be applied to one argument at a time.

### Lambda as an Argument

Suppose we have the following function definition:

```scala
def map(transform: ℤ -> ℤ, list: List[ℤ]): List[ℤ] = { ... }
```

This function applies a transformation to each element of a list of integers. The type of `map` is:

```scala
(ℤ -> ℤ) -> List[ℤ] -> List[ℤ]
```

Since functions are curried, `map` can take a single argument (the transformation function of type `ℤ -> ℤ`) and return another function that expects a list of integers (`List[ℤ]`) and returns a transformed list (`List[ℤ]`).

An example of using `map` with a lambda expression:

```scala
map (|x| => x + 1) list
```

Here, the lambda `|x| => x + 1` is passed as the `transform` argument. The type of the lambda is `ℤ -> ℤ`, and the application of `map` returns a new function that accepts a `List[ℤ]` and returns a transformed `List[ℤ]`.

### Partial Application of Curried Functions

Since functions are curried, we can partially apply them. Consider the following example:

```scala
let incrementAll = map |x: ℤ| => x + 1
```

The function `incrementAll` is a result of partially applying the `map` function with the lambda `|x: ℤ| => x + 1`. The type of `incrementAll` is:

```scala
List[ℤ] -> List[ℤ]
```

This means `incrementAll` is now a function that takes a list of integers and returns a list of integers where each element has been incremented by 1.

## Omitting Type Annotations in Lambda Expressions

In Saki, when lambda expressions are passed as arguments to a function, the type annotations of the parameters and the return type can often be omitted if the types can be inferred from context. This results in more concise code without losing type safety.

Consider the same `map` function:

```scala
def map(transform: ℤ -> ℤ, list: List[ℤ]): List[ℤ] = { ... }
```

Here’s how you can call `map` with a lambda, omitting the type annotations:

```scala
map (|x| => x + 1) list
```

In this case, the type of the lambda `|x| => x + 1` is inferred from the signature of `map` as `ℤ -> ℤ`. The type system can deduce the type of `x` to be `ℤ`, and thus there's no need to explicitly annotate it.

## Syntactic Sugar for Lambda Expressions

Saki allows for further syntactic simplifications when lambda expressions are passed as the **last argument** to a function. In these cases, you can omit the parentheses around the lambda and even the arrow (`=>`) symbol:

Consider the same `map` function, but now we pass the lambda as the last argument:

```scala
def map(list: List[ℤ], transform: ℤ -> ℤ): List[ℤ] = { ... }
```

Here’s how you can invoke `map` using syntactic sugar:

```scala
map list |x| { x + 1 }
```

In this example:

- The parentheses around the lambda are omitted.
- The `=>` symbol is omitted, but the braces `{}` around the function body remain, indicating the lambda body.

The type of this lambda remains the same:

```scala
ℤ -> ℤ
```

## Complex Examples

### Lambda Returning Another Lambda (Curried Function)

In Saki, because functions are curried by default, you can have lambda expressions that return other lambda expressions. Consider the following example, which defines a curried multiplication function:

```scala
let multiply = |x: ℤ| => |y: ℤ| => x * y
```

The type of `multiply` is:

```scala
ℤ -> ℤ -> ℤ
```

This function takes an integer `x` and returns a new function that takes another integer `y` and returns the product `x * y`. You can partially apply this function:

```scala
let double = multiply 2
```

The type of `double` is:

```scala
ℤ -> ℤ
```

Now, `double` is a function that multiplies any given integer by 2.

### Lambda as Return Type

Consider a lambda that takes a value and returns a function that always returns that value (a constant function):

```scala
let constant = |x: ℤ| => |y: ℤ| => x
```

The type of `constant` is:

```scala
ℤ -> ℤ -> ℤ
```

This lambda takes an integer `x` and returns a function that ignores its input and always returns `x`. For example:

```scala
let alwaysFive = constant 5
```

The type of `alwaysFive` is:

```scala
ℤ -> ℤ
```

Now, `alwaysFive` is a function that ignores its argument and always returns `5`.

### Using Lambdas in Higher-Order Functions

Consider a `filter` function that takes a predicate (a function that returns a boolean) and a list, returning a list of elements that satisfy the predicate:

```scala
def filter(predicate: ℤ -> Bool, list: List[ℤ]): List[ℤ] = { ... }
```

The type of `filter` is:

```scala
(ℤ -> Bool) -> List[ℤ] -> List[ℤ]
```

To use `filter`, we can pass a lambda to filter out negative numbers:

```scala
filter (|x| => x > 0) list
```

The lambda `|x| => x > 0` has the type `ℤ -> Bool`, and the result of `filter` will be a new list containing only the positive integers from the original `list`.

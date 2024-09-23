# Definition

In **Saki**, a **definition** is used to introduce named functions, constants, or operators within the type system. Definitions allow for explicit type annotations, parameter bindings, and a function body. The definition syntax is designed to handle **explicit** and **implicit** parameter lists, allowing for greater flexibility when defining generic, polymorphic functions.

## Syntax of Definitions

The syntax for defining functions or operators in Saki is structured as follows:

```
ParamBindings ::= Ident+ ':' Term
ParamList     ::= ParamBindings (',' ParamBindings)*
Definition    ::= 'def' (Ident|OpIdent) ('[' ParamList ']')? ('(' ParamList ')')? '=' Term
```

- **ParamBindings**: Defines one or more parameters, where `Ident+` represents one or more parameter identifiers, and `Term` represents the type of the parameters.
- **ParamList**: A list of **ParamBindings**, separated by commas.
- **Definition**: Starts with the `def` keyword, followed by the function name (or operator), and can optionally include:
  - **Implicit Parameters** in square brackets (`[ParamList]`), typically used for type-level parameters or constraints.
  - **Explicit Parameters** in parentheses (`(ParamList)`), representing the values passed to the function.
  - The **function body**, which is the expression on the right-hand side of the `=` symbol that defines the behavior of the function.

## Components of Definitions

1. **Identifier**: The name of the function, constant, or operator. This can be a regular identifier or an operator (denoted as `OpIdent`).
   
2. **Implicit Parameters**: Parameters in square brackets (`[ ]`) are implicit, meaning they are typically inferred by the compiler during function application. These parameters are often used for **type parameters** or **contract constraints**. In Saki, these parameters are generally related to the type system and are inferred based on the arguments passed to the function.

3. **Explicit Parameters**: Parameters in parentheses (`( )`) are explicit, meaning they must be provided by the caller. These are the **values** or **expressions** passed to the function when it is invoked.

4. **Return Type**: The return type is specified after the parameter list and before the function body, indicating the type of the value returned by the function.

5. **Function Body**: The expression or series of expressions that define the actual behavior of the function.

## Typical Example of a Function Definition

Consider a simple definition for a `map` function that operates on a list:

```scala
def map[A: 'Type](list: List[A], transform: A -> A): List[A] = ...
```

- **`map`** is the function name.
- **`[A: 'Type]`** is the **implicit parameter list**:
  - `A` is a type parameter, constrained by `'Type`, meaning it can be any type in the universe of types.
  - The compiler infers the type `A` based on the type of the list passed to the function.
- **`(list: List[A], transform: A -> A)`** is the **explicit parameter list**:
  - `list` is a list of elements of type `A`.
  - `transform` is a function that takes a value of type `A` and returns a new value of type `A`.
- **`List[A]`** is the return type, indicating that the function returns a list of elements of type `A`.
- **`...`** represents the function body, which defines how the elements of the list are transformed by the `transform` function.

## Implicit and Explicit Parameters

In Saki, functions often have both implicit and explicit parameters. Implicit parameters allow for **generic** and **polymorphic** functions without needing to specify the type each time the function is called.

For example:

```scala
def identity[A: 'Type](x: A): A = x
```

- The function `identity` takes a single value `x` of type `A` and returns `x`.
- The type `A` is inferred from the argument passed to `identity`, so the user doesn't need to explicitly provide `A` when calling the function.

## Type Constraints in Definitions

In Saki, **contract universes** can be used to impose constraints on the types of the parameters. For example, consider the following function that requires the type `A` to satisfy the `'Add` contract (i.e., it must support an `add` operation):

```scala
def sum[A: 'Add](x: A, y: A): A = x.add(y)
```

- The function `sum` takes two values `x` and `y` of type `A`.
- The type `A` is constrained by the contract `'Add`, meaning that `A` must implement the `add` method.
- The function returns the result of adding `x` and `y` using `A`'s `add` method.

## Operator Definitions

Operators can be defined similarly to functions, using the same syntax. For example, a custom addition operator could be defined as follows:

```scala
def (+)[A: 'Add](x: A, y: A): A = x.add(y)
```

- The operator `+` is defined for any type `A` that satisfies the `'Add` contract.
- This allows users to use `+` in the same way they would for built-in numeric types, but it applies to any type that defines an `add` method.

## Higher-Level Universe in Definition

Consider a function that multiplies a value by itself, where the type `A` is constrained by the `'Mul` contract universe:

```scala
def square[R: 'Type, A: 'Mul(A, R)](self: A): R = self.mul(self)
```

- **`square`** is the function name.
- **`[R: 'Type, A: 'Mul(A, R)]`** are implicit parameters:
  - `R` is a type, and `A` is a type constrained by the `'Mul(A, R)` contract, meaning that `A` must implement a `mul` method that returns a value of type `R`.
- **`(self: A)`** is the explicit parameter.
- The return type is `R`, the result of multiplying `self` by itself using the `mul` method.

This function is generic across any type `A` that supports multiplication, allowing it to work with numbers, matrices, or any other type that implements the `'Mul` contract.


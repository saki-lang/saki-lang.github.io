# Function Elimination (Application)

In **Saki**, **function elimination** (or **function application**) refers to the process of applying a function to arguments and obtaining a result. This follows the standard rules of type theory, where a function of type `A → B` is applied to an argument of type `A`, yielding a result of type `B`. However, **Saki** extends this process to handle **function overloading** via **superposition types** ($A \oplus B$), which allow a function to operate over multiple argument types, returning different results based on the argument type.

## Standard Function Application

In traditional **function elimination** (without overloading), a function of type `A \rightarrow B` can be applied to an argument of type `A`. The general typing rule for this is:

$$
\frac{\Gamma \vdash f: A \rightarrow B \quad \Gamma \vdash t: A}{\Gamma \vdash f\ t: B}
$$

This rule states that if:

- `f` is a function from `A` to `B` in the context $\Gamma$,
- and `t` is a term of type `A` in the same context,

then applying `f` to `t` results in a term of type `B`.

### Example

Consider a simple function `double` that takes an integer and returns its double:

```scala
def double(x: Int): Int = x * 2
```

The function `double` has the type `Int → Int`. Applying it to an integer argument proceeds as follows:

```scala
double(5) // Result: 10
```

## Function Application with Overloading

When functions are **overloaded** via **superposition types**, the function's behavior is dependent on the type of the argument. The superposition type allows a function to operate on multiple types and dynamically resolve which version of the function to apply based on the argument’s type.

The typing rule for overloaded functions is:

$$
\frac{\Gamma \vdash f: (A \rightarrow B) \oplus (C \rightarrow D) \quad \Gamma \vdash t: A}{\Gamma \vdash f\ t: B}
$$

This rule means that if:
- `f` is an overloaded function with the type `(A → B) ⊕ (C → D)` in the context $\Gamma$,
- and `t` is an argument of type `A`,

then applying `f` to `t` will resolve the function to return a result of type `B`.

## unction Overloading with Identical Return Types

Consider the following overloaded function `describe`, which can take either an integer or a string:

```scala
def describe(x: Int): String = "The number is " + x.toString
def describe(x: String): String = "The string is \"" + x + "\""
```

The function `describe` has the following type:

```scala
describe: (Int -> String) ⊕ (String -> String)
```

Which is identical to

```
describe: Int ⊕ String -> String
```

When applying `describe`, the behavior depends on the argument type:

```scala
describe(42)        // Result: "The number is 42"
describe("Saki")    // Result: "The string is "Saki""
```

In this case:

- When applied to an integer (`42`), the function returns a description of the number.
- When applied to a string (`"Saki"`), the function returns a description of the string.

### Overloaded Function with Different Return Types

Consider an overloaded function `addOrConcat` that operates on both numbers and strings, performing addition for numbers and concatenation for strings:

```scala
def addOrConcat(x: Int, y: Int): Int = x + y
def addOrConcat(x: String, y: String): String = x + y
```

The type of this function is:

```scala
addOrConcat: (Int -> Int -> Int) ⊕ (String -> String -> String)
```

Application:

```scala
addOrConcat(3, 4)        // Result: 7
addOrConcat("Hello, ", "world!")  // Result: "Hello, world!"
```

Here, the overloaded function `addOrConcat`:

- Adds integers when passed two integers.
- Concatenates strings when passed two strings.

### Overloaded Function with Records

In **Saki**, you can also define overloaded functions that operate on **records**. Consider a record type `Cat` and an overloaded function `describeAnimal` that describes either a `Cat` or a `Dog`:

```scala
type Cat = record {
    name: String
    age: ℕ
}

type Dog = record {
    name: String
    breed: String
}

def describeAnimal(cat: Cat): String = "Cat ${cat.name} is ${cat.age.toString} years old."
def describeAnimal(dog: Dog): String = "Dog ${dog.name} is of breed ${dog.breed}."
```

The overloaded function `describeAnimal` has the type:

```scala
describeAnimal: Cat ⊕ Dog -> String
```

Application:

```scala
let cat = Cat^ {
    name = "Alice",
    age = 5
}

let dog = Dog^ {
    name = "Buddy",
    breed = "Golden Retriever"
}

describeAnimal(cat)  // Result: "Cat Alice is 5 years old."
describeAnimal(dog)  // Result: "Dog Buddy is of breed Golden Retriever."
```

Here, the function dynamically resolves to:

- Describe a `Cat` if the argument is of type `Cat`.
- Describe a `Dog` if the argument is of type `Dog`.

## Type Safety in Function Elimination

**Function elimination** in **Saki** enforces strict type safety, ensuring that:

- Overloaded functions are applied to the correct argument types.
- The return type is properly resolved based on the argument type.
- The use of **superposition types** allows dynamic resolution without violating the rules of **MLTT**, ensuring that overloaded functions are rigorously well-typed.


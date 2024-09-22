## Decorator

A **decorator** in **Saki** is a higher-order function that takes another function as its argument and returns a new function with the same type signature. Decorators allow for the dynamic augmentation of functions with additional functionality, enhancing the behavior of the original function without modifying its core logic. In essence, a decorator has the type:

$$
(T \rightarrow R) \rightarrow (T \rightarrow R)
$$

This means it takes a function of type `T -> R` and returns a function of the same type.

Decorators in **Saki** can be applied directly to functions using a specific syntax. They enable modular code, where functionality can be extended in a reusable and composable manner.

### Syntax

The syntax for applying one or more decorators to a function is as follows:

```
DecoratorApply ::= '#' '[' Term (',' Term)* ']'
```

The general form for applying decorators looks like this:

```
#[dec1, dec2, ..., decN]
def func: T -> R
```

- **`#[dec1, dec2, ..., decN]`**: Decorators are applied using a `#` followed by a list of decorators enclosed in square brackets. These decorators are applied to the function that follows.

### Typing Rules

Decorators must preserve the type signature of the functions they are applied to. If a function `func` has type `T -> R`, and a decorator `dec` transforms it while maintaining the same type, the resulting decorated function also has type `T -> R`. The typing rule can be formalized as:

$$
\frac{\Gamma \vdash func : T \rightarrow R \quad \Gamma \vdash dec : (T \rightarrow R) \rightarrow (T \rightarrow R)}{\Gamma \vdash dec(func) : T \rightarrow R}
$$

This ensures that the decorator takes in a function of type `T -> R` and returns a function with the same signature.

### Examples of Decorators

1. **Ensuring Positive Input Values**

   Consider a decorator that ensures that a function only operates on positive input values. This decorator checks if the input is greater than 0 and only calls the original function if the condition is satisfied. Otherwise, it returns `None`.

   ```scala
   universe GreaterThan(T: 'Type) = contract {
       require (>)(self, other: T): Bool
   }

   def ensurePositive[T: 'GreaterThan(ℕ)](func: T -> Option[T]): T -> Option[T] = {
       return |arg: T|: Option[T] => if arg > 0 then func(arg) else None
   }

   #[ensurePositive]
   def safeDivide(x: ℕ): Option[ℕ] = if x != 0 then Some(10 / x) else None
   ```

   - **`ensurePositive`**: The decorator checks if the input is greater than 0. If true, it calls the original function; otherwise, it returns `None`.
   - **`safeDivide`**: This function divides 10 by the input value, but using the decorator, it is guaranteed to only operate on positive integers. If the input is 0 or negative, it returns `None`.

2. **Transforming Input Before Applying a Function**

   The following example demonstrates how a decorator can be used to modify the input before passing it to the original function.

   ```scala
   def mapInput[T1 T2 R: 'Type](transform: T1 -> T2, func: T2 -> R): T1 -> R = {
       return |arg: T1|: R => func(transform(arg))
   }

   #[mapInput(|x: ℕ| => x * 2)]
   def half(n: ℕ): ℕ = n / 2
   ```

   - **`mapInput`**: This decorator takes a transformation function and applies it to the input before passing it to the original function.
   - **`half`**: This function divides the input by 2, but with the decorator applied, the input is first doubled, so `half(5)` would return the result of `10 / 2`, which is `5`.

3. **Transforming the Output of a Function**

   A decorator can also be used to modify the output of a function. In the following example, the decorator multiplies the function's result by 10.

   ```scala
   def mapOutput[T R1 R2: 'Type](func: T -> R1, transform: R1 -> R2): T -> R2 = {
       return |arg: T|: R2 => transform(func(arg))
   }
   
   #[mapOutput(|x: ℕ| => x * 10)]
   def increment(n: ℕ): ℕ = n + 1
   ```

   - **`mapOutput`**: This decorator takes a transformation function and applies it to the output of the original function.
   - **`increment`**: This function adds 1 to the input, but with the decorator, the result is multiplied by 10. So, `increment(5)` results in `60`, as `(5 + 1) * 10 = 60`.

### Composition of Decorators

Decorators in Saki can be composed. Multiple decorators can be applied to the same function in sequence. This means that each decorator applies its transformation on the function that results from the previous decorator.

For example:

```scala
#[ensurePositive, mapOutput(|x: ℕ| => x * 10)]
def safeDivideAndScale(x: ℕ): Option[ℕ] = if x != 0 then Some(10 / x) else None
```

In this case:
- **`ensurePositive`** ensures that the function only operates on positive inputs.
- **`mapOutput`** scales the result of the function by 10.

If the input to `safeDivideAndScale` is `2`, the function returns `Some(50)` (since `10 / 2 = 5` and `5 * 10 = 50`). If the input is `0`, the function returns `None` due to `ensurePositive`.

#### Contract Universes and Decorators

In Saki, decorators can leverage **contract universes** to enforce behavior through constraints. For example, decorators like `ensurePositive` can depend on contract universes such as `'GreaterThan`, ensuring that the function operates only on types that support comparison.

```scala
universe GreaterThan(T: 'Type) = contract {
    require (>)(self, other: T): Bool
}

def ensurePositive[T: 'GreaterThan(ℕ)](func: T -> Option[T]): T -> Option[T] = {
    return |arg: T|: Option[T] => if arg > 0 then func(arg) else None
}
```

In this example, the decorator relies on the contract universe `'GreaterThan`, ensuring that the input type supports the `>` operator. This enforces additional type safety by ensuring that only types adhering to this contract can use the decorator.

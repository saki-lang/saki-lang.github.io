# Keywords and Identifiers

## Keywords

Saki supports following keywords:

| Keyword              | Description                                                      |
|----------------------|------------------------------------------------------------------|
| `import`             | Module import                                                    |
| `pub`                | Public modifier                                                  |
| `def`                | Function definition                                              |
| `impl`               | Implementation block                                             |
| `operator`           | Operator declaration                                             |
| `prefix`             | Prefix modifier (unary operator)                                 |
| `postfix`            | Postfix modifier (unary operator)                                |
| `left-assoc`         | Left association modifier (binary operator)                      |
| `right-assoc`        | Right association modifier (binary operator)                     |
| `tighter-than`       | Precedence partial-order modifier (binary operator)              |
| `looser-than`        | Precedence partial-order modifier (binary operator)              |
| `same-as`            | Precedence partial-order modifier (binary operator)              |
| `let`                | Let binding                                                      |
| `instance`           | Instance value                                                   |
| `enum`               | Enum type (Algebraic Data Type)                                  |
| `record`             | Record type                                                      |
| `universe`           | Universe                                                         |
| `self`               | Self instance                                                    |
| `Self`               | Self type                                                        |
| `this`               | Current subject (such as recursive access in anonymous function) |
| `forall` / `Π` / `∀` | Forall / dependent pi type                                       |
| `exists` / `Σ` / `∃` | Exists / dependent sigma type                                    |
| `if`                 | If-expression                                                    |
| `then`               | Then branch in if-expression                                     |
| `else`               | Else branch in if-expression                                     |
| `match`              | Match-expression                                                 |
| `case`               | Case clause in match-expression                                  |

## Identifiers

|                                  Identifier                                  |             Example              |                    Description                    |
|:----------------------------------------------------------------------------:|:--------------------------------:|:-------------------------------------------------:|
| `camelCaseWithEnglishOrGreekLetters` / `withOptionalPostfixSingleQuotation'` | `value`, `α`, `παράδειγμα`, `n'` |                      Values                       |
|           `PascalCaseInEnglish` / A single blackboard bold letter            |            `Nat`, `ℕ`            |                       Types                       |
|                  `'PascalCaseWithAPrefixedSingleQuotation`                   |       `'Type`, `'Runnable`       |                Contract universes                 |
|                                 `#Universe`                                  |           `#Universe`            | The universe that all contract universes lives in |
|                             `'Type_n` / `'Typeₙ`                             |       `'Type_3`, `'Type₃`        |              Higher-level universes               |
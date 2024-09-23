# Introduction

!!! warning
    Saki-lang is currently in a very early stage of design and development, with substantial work required before it reaches a mature state. The prototype interpreter and REPL are still under active development, and no working interpreters are currently available.

Saki is a statically typed, pure functional programming language that integrates dependent types and certain object-oriented constructs, including function overloading and algebraic subtyping. Its design emphasizes simplicity, adopting a C-family syntax while employing a sophisticated type system rooted in Martin-Löf Type Theory. Saki introduces novel features, such as [contract universes](Terms/Contract%20Universe.md) and [superposition types](Definition/Function%20Overloading.md), positioning itself as an experimental platform for investigating advanced type system mechanics and program synthesis. Heavily influenced by [Pikelet](https://github.com/pikelet-lang/pikelet) and [MLsub](https://lptk.github.io/programming/2020/03/26/demystifying-mlsub.html), Saki aims to explore new frontiers in type theory and programming paradigms.

## Practical Example: Red-Black Tree in Saki

```scala
universe 'LessThan(A: 'Type) = contract {
  require (<)(self, A: 'Type): Bool
}

type Option(A: 'Type) = enum {
  None
  Some(A)
}

type Color = enum {
  Red
  Black
}

type Tree[A: 'LessThan(A)] = enum {
  Leaf
  Node(Color, A, Tree[A], Tree[A])
}

impl [A: 'LessThan(A)] Tree[A] {
  def balance(self): Self = match self {
    case Self::Node(
      Color::Black, valueRight, 
      Self::Node(
        Color::Red, valueTop, 
        Self::Node(Color::Red, valueLeft, leftLeft, leftRight), 
        rightLeft
      ), rightRight
    ) | Self::Node(
      Color::Black, valueRight, 
      Self::Node(
        Color::Red, valueLeft, 
        leftLeft, 
        Self::Node(Color::Red, valueTop, leftRight, rightLeft)
      ), rightRight
    ) | Self::Node(
      Color::Black, valueLeft, 
      leftLeft, 
      Self::Node(
        Color::Red, valueRight, 
        Self::Node(Color::Red, valueTop, leftRight, rightLeft), 
        rightRight
      ),
    ) | Self::Node(
      Color::Black, valueLeft, 
      leftLeft, 
      Self::Node(
        Color::Red, valueTop, 
        leftRight, 
        Self::Node(Color::Red, valueRight, rightLeft, rightRight),
      ),
    ) => Self::Node(
      Color::Red, valueTop, 
      Self::Node(Color::Black, valueLeft, leftLeft, leftRight),
      Self::Node(Color::Black, valueRight, rightLeft, rightRight),
    )
    case node: Self => node
  }

  def insert(self, newValue: A): Self = match self {
    case Self::Leaf => Self::Node(Color::Red, newValue, Self::Leaf, Self::Leaf)
    case Self::Node(color, value, left, right) => if newValue < value then {
      Self::Node(color, value, left.insert(value), right)
    } else if value < newValue then {
      Self::Node(color, value, left, right.insert(value))
    } else {
      Self::Node(color, newValue, left, right)
    }
  }

  def find(self, value: A): Option(A) = match self {
    case Self::Leaf => Option(A)::None
    case Self::Node(color, value, left, right) => if newValue < value then {
      left.find(value)
    } else if value < newValue then {
      right.find(value)
    } else {
      Option(A)::Some(value)
    }
  }
}
```

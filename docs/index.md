
# Introduction

<script type="module" src="javascripts/editor.js"></script>
<link rel="stylesheet" href="static/styles.css">

!!! warning
    Saki-lang is currently in a very early stage of design and development, with substantial work required before it reaches a mature state. The prototype interpreter and REPL are still under active development, and many features are not yet implemented or fully supported. The language design and syntax are subject to change based on ongoing research and experimentation.

Saki is a dependently-typed, pure functional language with algebraic subtyping and overloaded superposition types.  It prioritizes simplicity in design, using a Scala-inspired syntax while leveraging a type system grounded in Martin-Löf Type Theory. Saki introduces novel features like constraint universes and superposition types, serving as a research platform for exploring advanced type systems and verified program synthesis.

## Playground

<div class="playground-editor" id="code-playground">

```
eval "==== Red-Black Tree ===="

type Option[A: 'Type] = inductive {
    None
    Some(A)
}

def intOptionToString(option: Option[ℤ]): String = match option {
    case Option[ℤ]::None => "None"
    case Option[ℤ]::Some(value) => value.toString
}

// Definition of possible colors in a Red-Black Tree
// Red or Black color to maintain tree properties
type Color = inductive {
    Red
    Black
}

// Definition of the Red-Black Tree data structure
// Tree can be a Leaf or a Node with color, value, left and right children
type Tree = inductive {
    Leaf
    Node(Color, ℤ, Tree, Tree)
}

// Function to balance the Red-Black Tree after insertion
// Ensures that Red-Black Tree properties are maintained, such as balancing after consecutive red nodes
def balance(tree: Tree): Tree = match tree {
    // Left-Left case (left subtree of left child is red)
    // Perform a right rotation to balance the tree
    // This situation occurs when the left child and its left child are both red, causing a violation
    case Tree::Node(
        Color::Black, valueRight,
        Tree::Node(
            Color::Red, valueTop,
            Tree::Node(Color::Red, valueLeft, leftLeft, leftRight),
            rightLeft
        ), rightRight
    ) | Tree::Node(
        Color::Black, valueRight,
        Tree::Node(
            Color::Red, valueLeft,
            leftLeft,
            Tree::Node(Color::Red, valueTop, leftRight, rightLeft)
        ), rightRight
    ) => Tree::Node(
        Color::Red, valueTop,
        Tree::Node(Color::Black, valueLeft, leftLeft, leftRight),
        Tree::Node(Color::Black, valueRight, rightLeft, rightRight)
    )

    // Right-Right case (right subtree of right child is red)
    // Perform a left rotation to balance the tree
    // This situation occurs when the right child and its right child are both red, causing a violation
    case Tree::Node(
        Color::Black, valueLeft,
        leftLeft,
        Tree::Node(
            Color::Red, valueRight,
            Tree::Node(Color::Red, valueTop, leftRight, rightLeft),
            rightRight
        )
    ) | Tree::Node(
        Color::Black, valueLeft,
        leftLeft,
        Tree::Node(
            Color::Red, valueTop,
            leftRight,
            Tree::Node(Color::Red, valueRight, rightLeft, rightRight)
        )
    ) => Tree::Node(
        Color::Red, valueTop,
        Tree::Node(Color::Black, valueLeft, leftLeft, leftRight),
        Tree::Node(Color::Black, valueRight, rightLeft, rightRight)
    )
    
    // Recoloring case: both children are red
    // Recolor the children to black and maintain the parent as red
    // This occurs to fix the situation where both children of a red node are also red
    case Tree::Node(
        Color::Red, value,
        Tree::Node(Color::Red, leftValue, leftLeft, leftRight),
        Tree::Node(Color::Red, rightValue, rightLeft, rightRight)
    ) => Tree::Node(
        Color::Red, value,
        Tree::Node(Color::Black, leftValue, leftLeft, leftRight),
        Tree::Node(Color::Black, rightValue, rightLeft, rightRight)
    )
    
    // Other cases: no need to balance
    case node => node
}

// Insert a new value into the Red-Black Tree as a red node
// Recursively inserts the new value and then balances the tree if necessary
def insertRed(tree: Tree, newValue: ℤ): Tree = match tree {
    case Tree::Leaf => Tree::Node(Color::Red, newValue, Tree::Leaf, Tree::Leaf)
    case Tree::Node(color, value, left, right) => if newValue < value then {
        Tree::Node(color, value, left.insertRed(newValue), right).balance
    } else if newValue > value then {
        Tree::Node(color, value, left, right.insertRed(newValue)).balance
    } else {
        Tree::Node(color, newValue, left, right)
    }
}

// inserting a value into the Red-Black Tree
// Ensures that the root of the tree is always black after insertion
def insert(tree: Tree, value: ℤ): Tree = match tree.insertRed(value) {
    case Tree::Node(Color::Red, value, left, right) => Tree::Node(Color::Black, value, left, right)
    case Tree::Node(Color::Black, value, left, right) => Tree::Node(Color::Black, value, left, right)
    case Tree::Leaf => Tree::Leaf   // Should not happen
}

def find(tree: Tree, target: ℤ): Option[ℤ] = match tree {
    case Tree::Leaf => Option[ℤ]::None
    case Tree::Node(color, value, left, right) => {
        if target < value then {
            left.find(target)
        } else if target > value then {
            right.find(target)
        } else {
            Option[ℤ]::Some(value)
        }
    }
}

// Find the predecessor of a given value in the Red-Black Tree
// The predecessor is the largest value smaller than the given value
def predecessor(tree: Tree, value: ℤ): Option[ℤ] = match tree {
    case Tree::Leaf => Option[ℤ]::None
    case Tree::Node(color, nodeValue, left, right) => if value <= nodeValue then {
        // Search in the left subtree if the value is less than or equal to the current node's value
        left.predecessor(value)
    } else {
        // Search in the right subtree, but also consider the current node as a potential predecessor
        match right.predecessor(value) {
            case Option[ℤ]::None => Option[ℤ]::Some(nodeValue)
            case Option[ℤ]::Some(pred) => Option[ℤ]::Some(pred)
        }
    }
}

// Find the successor of a given value in the Red-Black Tree
// The successor is the smallest value greater than the given value
def successor(tree: Tree, value: ℤ): Option[ℤ] = match tree {
    case Tree::Leaf => Option[ℤ]::None
    case Tree::Node(color, nodeValue, left, right) => if value >= nodeValue then {
        // Search in the right subtree if the value is greater than or equal to the current node's value
        right.successor(value)
    } else {
        // Search in the left subtree, but also consider the current node as a potential successor
        match left.successor(value) {
            case Option[ℤ]::None => Option[ℤ]::Some(nodeValue)
            case Option[ℤ]::Some(succ) => Option[ℤ]::Some(succ)
        }
    }
}

def depth(tree: Tree): ℤ = match tree {
    case Tree::Leaf => 0
    case Tree::Node(c, x, left, right) => max(left.depth, right.depth) + 1
}

def formatLevel(tree: Tree, level maxDepth: ℤ): String = {
    let spaces = " ".repeat(2 ** maxDepth - 1)
    if level == 0 then {
        match tree {
            case Tree::Leaf => " "
            case Tree::Node(c, value, l, r) => value.toString
        } ++ spaces
    } else match tree {
        case Tree::Leaf => " "
        case Tree::Node(c, x, left, right) => {
            let leftStr = left.formatLevel(level - 1, maxDepth - 1)
            let rightStr = right.formatLevel(level - 1, maxDepth - 1)
            leftStr ++ rightStr
        }
    }
}

def formatLevelBelow(tree: Tree, level maxDepth: ℤ): String = {
    if level >= maxDepth then "" else {
        let prefixStr = " ".repeat(2 ** (maxDepth - 1 - level) + 4)
        let currentLevelStr = tree.formatLevel(level, maxDepth)
        let levelBelowStr = tree.formatLevelBelow(level + 1, maxDepth)
        prefixStr ++ currentLevelStr ++ "\n" ++ levelBelowStr
    }
}

def formatTree(tree: Tree): String = tree.formatLevelBelow(0, tree.depth)

def step1Insert5: Tree = Tree::Leaf.insert(5)

eval "RBTree after inserting 5: "
eval step1Insert5.formatTree

def step2Insert2: Tree = step1Insert5.insert(2)

eval "RBTree after inserting 2: "
eval step2Insert2.formatTree

def step3Insert7: Tree = step2Insert2.insert(7)

eval "RBTree after inserting 7: "
eval step3Insert7.formatTree

def step4Insert9: Tree = step3Insert7.insert(9)

eval "RBTree after inserting 9: "
eval step4Insert9.formatTree

def step5Insert8: Tree = step4Insert9.insert(8)

eval "RBTree after inserting 8: "
eval step5Insert8.formatTree

def step6Insert1: Tree = step5Insert8.insert(1)

eval "RBTree after inserting 1: "
eval step6Insert1.formatTree

def step7Insert3: Tree = step6Insert1.insert(3)

eval "RBTree after inserting 3: "
eval step7Insert3.formatTree

def step8Insert1Again: Tree = step7Insert3.insert(1)

eval "RBTree after inserting 1 again: "
eval step8Insert1Again.formatTree

def step9Insert4: Tree = step8Insert1Again.insert(4)

eval "RBTree after inserting 4: "
eval step9Insert4.formatTree

// It's myTree!!!!!
def myTree: Tree = step9Insert4

eval ""
eval "==== Test Predecessor and Successor ===="

eval "The predecessor of 5 is " ++ myTree.predecessor(5).intOptionToString
eval "The successor of 5 is " ++ myTree.successor(5).intOptionToString
eval "The successor of 9 is " ++ myTree.successor(9).intOptionToString
eval "The predecessor of 1 is " ++ myTree.predecessor(1).intOptionToString
```
</div>
<div class="button-container">
    <button class="md-button button-run" onclick="runCodeInEditor('code-playground', 'result-playground')">Run Code</button>
</div>
<div class="result-editor" id="result-playground"></div>


## REPL

<iframe style="width:100%;height:500px" frameborder="0" src="https://repl.saki-lang.tech/"></iframe>

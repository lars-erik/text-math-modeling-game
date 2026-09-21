# Problem DSL language reference

This page describes the serialized Problem DSL accepted by the current parser and produced by the current serializer.

The EBNF below is a documentation form of the active Ohm grammars in `src/features/problem-dsl/problem-grammar.ts` and `src/features/named-expression/named-expression-grammar.ts`. The implementation remains authoritative if this document and the parser ever disagree.

## Notation

This reference uses **EBNF (Extended Backus–Naur Form)**:

- `=` defines a production;
- `,` means sequence;
- `|` means alternative;
- `[ ... ]` means optional;
- `{ ... }` means zero or more repetitions;
- quoted text is literal syntax.

Whitespace is insignificant between grammar elements. Comments are not part of the current DSL syntax.

## Complete grammar

```ebnf
problem =
    "problem", metadata-identifier, "{",
    concepts,
    { quantity },
    equation,
    [ guidance ],
    [ replay ],
    "}" ;

concepts =
    "concepts", "{",
    { metadata-identifier },
    "}" ;

quantity =
    "quantity", identifier, ":",
    dimension,
    [ role-clause ],
    "=",
    given ;

role-clause =
    "role", role ;

given =
      "?"
    | integer ;

equation =
    "equation", "{",
    relation,
    "}" ;

guidance =
    "guidance", "{",
    { watch },
    "}" ;

watch =
    "watch", metadata-identifier, "{",
    { guidance-reference },
    "}" ;

guidance-reference =
    identifier, metadata-identifier ;

replay =
    "replay", "{",
    "seed", integer,
    "generator", metadata-identifier,
    "}" ;

relation =
    additive, "=", additive ;

additive =
    multiplicative,
    { "+", multiplicative } ;

multiplicative =
    primary,
    { [ "*" ], primary } ;

primary =
      "(", additive, ")"
    | integer
    | identifier ;

dimension =
      "amountPerItem"
    | "amount"
    | "item"
    | "scalar" ;

role =
      "per-item"
    | "base"
    | "count"
    | "total" ;

metadata-identifier =
    letter,
    { letter | digit | "-" | "." } ;

identifier =
    letter,
    { letter | digit } ;

integer =
    digit,
    { digit } ;
```

### Juxtaposition

The expression grammar accepts adjacent primaries as multiplication, for example `2 x` or `count unitValue`. Because whitespace is insignificant, `ab` is one identifier while `a b` is multiplication of two identifiers.

Canonical serialization never relies on juxtaposition; it writes `*`.

## Section order

The top-level order is fixed:

```text
problem
  concepts
  zero or more quantity declarations
  equation
  optional guidance
  optional replay
```

`guidance` cannot precede `equation`, and `replay` cannot precede `guidance` when both are present.

## Identifiers

### Metadata identifiers

Used for:

- problem ids;
- concept ids;
- watch/guidance ids;
- generator ids;
- the referenced quantity token in a guidance binding at grammar level.

They must start with a letter. Remaining characters may be letters, digits, `-`, or `.`.

Examples:

```text
total-from-parts
arithmetic.multiplication
groups-total-v1
```

Underscores are not accepted.

### Quantity/expression identifiers

Quantity declarations, expression references, and guidance labels use the stricter `identifier` syntax: a leading letter followed only by letters or digits.

Examples:

```text
base
count
unitValue
total2
```

Examples that are not valid quantity ids:

```text
unit-value
unit.value
unit_value
2units
```

## Numbers

The grammar accepts decimal digits only:

```text
0
17
210
```

It does not currently accept signs, decimal points, exponents, or fractions.

Known quantity values, equation literals, and replay seeds must also fit JavaScript's safe-integer range. Numerically unsafe values parse syntactically but are rejected by Problem validation.

## Quantities

Syntax:

```text
quantity <id>: <dimension> [role <role>] = <integer-or-question-mark>
```

Examples:

```text
quantity total: amount = 210
quantity unitValue: amountPerItem role per-item = ?
```

A parsed Problem must satisfy these quantity invariants:

- quantity ids are unique;
- exactly one quantity is hidden with `?`;
- every quantity referenced by the equation exists;
- every quantity referenced by guidance exists.

The parser validates the canonical Problem AST, but it does not have the private AnswerKey and therefore does not prove that a hand-authored equation has the intended solution.

## Dimensions

Supported dimensions are `amount`, `amountPerItem`, `item`, and `scalar`.

Integer literals have dimension `scalar`.

### Addition

Both sides of `+` must have the same dimension.

Examples:

```text
amount + amount                 -> amount
scalar + scalar                 -> scalar
amount + item                   -> invalid
```

### Multiplication

The current validator accepts these products:

| Left | Right | Result |
| --- | --- | --- |
| `scalar` | `scalar` | `scalar` |
| `scalar` | `amount` | `amount` |
| `amount` | `scalar` | `amount` |
| `scalar` | `amountPerItem` | `amountPerItem` |
| `amountPerItem` | `scalar` | `amountPerItem` |
| `scalar` | `item` | `scalar` |
| `item` | `scalar` | `scalar` |
| `item` | `amountPerItem` | `amount` |
| `amountPerItem` | `item` | `amount` |

Other dimension pairs are currently rejected.

### Equation

The left and right sides of `=` must resolve to the same dimension.

## Expressions and precedence

The supported operators are:

1. parentheses;
2. multiplication (`*` or juxtaposition);
3. addition (`+`);
4. relation equality (`=`).

Multiplication binds more tightly than addition:

```text
total = base + count * unitValue
```

is interpreted as:

```text
total = base + (count * unitValue)
```

Parentheses override precedence:

```text
total = (base + count) * unitValue
```

A relation contains exactly one equality operator. The operands of `=` are additive expressions; an equality cannot be nested inside another expression.

## Roles

The optional role clause accepts exactly one of:

```text
base
count
per-item
total
```

Roles are canonical mathematical metadata. The grammar does not infer a role from a quantity id or dimension.

## Guidance

Syntax:

```text
guidance {
    watch <watch-id> {
        <label> <quantity-id>
        ...
    }
    ...
}
```

The watch id is a metadata identifier. Each label is an identifier. Each referenced quantity must match a declared quantity after parsing and validation.

The grammar allows zero watches and zero references inside a watch.

## Replay

Syntax:

```text
replay {
    seed <integer>
    generator <generator-id>
}
```

The generator id is a metadata identifier. The seed must be a safe integer after parsing.

Replay is optional and represents mathematical generation metadata only.

## Canonical serializer output

`serializeProblem(problem)` normalizes accepted Problems to stable text:

- four spaces per indentation level;
- concepts in domain order;
- quantities in domain order;
- equation operators surrounded by one space;
- explicit `*` for multiplication;
- minimum parentheses required to preserve the expression tree;
- `guidance` before `replay`;
- LF line endings;
- exactly one final newline.

Round-tripping through the parser and serializer is intended to preserve Problem semantics:

```text
Problem AST -> serialize -> parse -> semantically same Problem AST
DSL text    -> parse -> serialize -> canonical DSL text
```

## Deliberately outside the language

The canonical Problem DSL does not serialize:

- Theme/scenario selection;
- story text;
- learner-facing quantity names;
- contextual units;
- locale/language;
- puzzle Mode/task;
- input provider;
- academic display symbols;
- the private AnswerKey.

Those values belong to other composition or presentation layers and must not alter the canonical Problem.

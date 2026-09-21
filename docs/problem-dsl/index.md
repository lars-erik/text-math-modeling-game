# Problem DSL authoring guide

The Problem DSL is the readable, serializable form of the game's **canonical mathematics**. Use it to author fixtures, inspect generated problems, copy reproducible examples into bug reports, and understand what the serializer writes.

This guide is for people who want to **read or write DSL**. For implementation architecture and representation boundaries, see [DSL and representation adapters](../03-dsl-and-representations.md). For the exact syntax, see the [language reference](reference.md).

## What belongs in the DSL

A Problem describes mathematics only:

- the problem family/id;
- mathematical concept ids;
- canonical quantities, dimensions, optional roles, and which value is hidden;
- one equation;
- optional structured guidance metadata;
- optional mathematical replay metadata.

Theme/scenario, story text, translated learner-facing names, units, locale, puzzle mode/task, input provider, and academic display symbols do **not** belong here. Those are composed with the Problem elsewhere.

## Tutorial: write a small problem

Start with a problem wrapper and a stable id:

```text
problem groups-total {
}
```

Problem ids are metadata identifiers. They begin with a letter and may contain letters, digits, `-`, and `.`.

### 1. Declare concepts

Concept ids say which mathematical ideas the problem exercises.

```text
problem groups-total {
    concepts {
        arithmetic.multiplication
        algebra.variable
    }
}
```

Concept ids use the same metadata-identifier syntax, so dotted names such as `arithmetic.multiplication` are valid.

### 2. Declare quantities

Each quantity has a canonical id, a dimension, and either a known non-negative integer or `?` for the hidden value.

```text
problem groups-total {
    concepts {
        arithmetic.multiplication
        algebra.variable
    }

    quantity count: item = 6
    quantity unitValue: amountPerItem = 8
    quantity total: amount = ?
}
```

A valid Problem currently has **exactly one hidden quantity**.

Quantity ids are deliberately stricter than metadata ids: they begin with a letter and contain only letters and digits. Canonical ids such as `count`, `unitValue`, and `total` are mathematical/domain names, not themed learner-facing names.

The currently supported dimensions are:

| Dimension | Intended use |
| --- | --- |
| `amount` | an amount or total |
| `amountPerItem` | an amount associated with one item |
| `item` | an item/group count |
| `scalar` | a dimensionless scalar |

### 3. Add the equation

The equation relates the declared quantities:

```text
problem groups-total {
    concepts {
        arithmetic.multiplication
        algebra.variable
    }

    quantity count: item = 6
    quantity unitValue: amountPerItem = 8
    quantity total: amount = ?

    equation {
        total = count * unitValue
    }
}
```

The current expression language supports:

- quantity identifiers;
- non-negative integer literals;
- `+`;
- `*`;
- parentheses;
- exactly one `=` between the two sides.

Multiplication binds more tightly than addition. The parser also accepts juxtaposition as multiplication, but canonical serialization always writes an explicit ` * `.

Every quantity referenced by the equation must be declared, and the dimensions on additions, multiplications, and both sides of the equation must be compatible.

That is already a complete Problem DSL document.

## Optional quantity roles

A quantity may also carry one of the current generic roles:

```text
quantity base: amount role base = 30
quantity count: item role count = 4
quantity unitValue: amountPerItem role per-item = ?
quantity total: amount role total = 210
```

Supported roles are `base`, `count`, `per-item`, and `total`. Roles are generic mathematical metadata; they must not encode a Theme.

## Optional guidance

Structured guidance can name a reusable warning/hint concept and bind labels in that concept to canonical quantities:

```text
guidance {
    watch per-item-scaled-by-count {
        count count
        unit unitValue
    }
}
```

Here, `per-item-scaled-by-count` is the guidance/watch id. Inside the watch, the first token is a local label and the second token is a canonical quantity id. Referenced quantities must exist.

The DSL stores the structure, not learner-facing prose. Presentation can turn the guidance id and quantity bindings into localized text later.

## Optional replay metadata

A generated problem may carry enough mathematical replay metadata to reproduce it:

```text
replay {
    seed 103
    generator groups-total-v1
}
```

The seed is a non-negative safe integer. The generator id uses metadata-identifier syntax.

Replay metadata is about regenerating the canonical mathematics. Theme, locale, and Mode are separate composition inputs and therefore are not serialized here.

## A fuller example

```text
problem total-from-parts {
    concepts {
        arithmetic.addition
        arithmetic.multiplication
        algebra.variable
        linear.one-unknown
    }

    quantity base: amount role base = 30
    quantity count: item role count = 4
    quantity unitValue: amountPerItem role per-item = ?
    quantity total: amount role total = 210

    equation {
        total = base + count * unitValue
    }

    guidance {
        watch base-applied-once {
            quantity base
        }

        watch per-item-scaled-by-count {
            count count
            unit unitValue
        }
    }

    replay {
        seed 17
        generator total-from-parts-v1
    }
}
```

## Canonical serialization

The parser is whitespace-tolerant, but the serializer emits one stable form:

1. problem header;
2. `concepts`;
3. quantities in domain order;
4. `equation`;
5. optional `guidance`;
6. optional `replay`;
7. closing brace.

Canonical output uses four spaces per indentation level, one space around equation operators, explicit `*`, only the parentheses needed to preserve the expression tree, LF line endings, and one final newline.

This makes serialized Problems suitable for approvals, diffs, fixtures, and bug reports.

## Common mistakes

- Putting story/theme names such as `dronePower` into canonical quantity ids.
- Using `-`, `.`, or `_` in a quantity id. Dashes and dots are only accepted by metadata identifiers.
- Hiding zero or more than one quantity.
- Referring to a quantity that was never declared.
- Using decimals or negative numbers; the current grammar accepts only non-negative integers.
- Writing dimensionally incompatible arithmetic.
- Placing `replay` before `guidance`; section order is fixed.

For all accepted productions and validation rules, continue with the [Problem DSL language reference](reference.md).

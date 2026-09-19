import * as ohm from 'ohm-js';

export const namedExpressionGrammar = ohm.grammar(String.raw`
  NamedExpression {
    Relation = AddExpression "=" AddExpression

    AddExpression
      = AddExpression "+" MultiplyExpression  -- add
      | MultiplyExpression

    MultiplyExpression
      = MultiplyExpression "*" Primary  -- multiply
      | MultiplyExpression Primary     -- juxtapose
      | Primary

    Primary
      = "(" AddExpression ")"  -- parenthesized
      | integer                 -- integer
      | identifier              -- identifier

    identifier (an identifier) = letter alnum*
    integer (an integer) = digit+
  }
`);

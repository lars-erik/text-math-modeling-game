import * as ohm from 'ohm-js';

export const namedExpressionGrammar = ohm.grammar(String.raw`
  NamedExpression {
    Relation = AddExpression "=" AddExpression

    AddExpression
      = AddExpression "+" MultiplyExpression  -- add
      | MultiplyExpression

    MultiplyExpression
      = MultiplyExpression "*" Primary  -- multiply
      | Primary

    Primary = identifier
    identifier = letter alnum*
  }
`);
